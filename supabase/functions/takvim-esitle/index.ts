// Villa Takvimim — dış takvimleri (Airbnb, Booking, Vrbo, Villasepeti, diğer) okuma ve eşitleme (Görev 32.1)
//
// DEPLOY EDİLMEDİ. Ürün yöneticisi kontrol edip deploy eder:
//   supabase functions deploy takvim-esitle --no-verify-jwt
//     (zamanlayıcı JWT değil ESITLE_GIZLI gönderir; uygulamadan gelen oturum tokenini fonksiyon kendisi denetler: auth.getUser)
//   Gizli değişkenler: ESITLE_GIZLI (zamanlayıcının parolası), VAPID_ACIK / VAPID_GIZLI / VAPID_POSTA (bildirim fonksiyonuyla aynı)
//   Zamanlayıcı (pg_net ile, VERITABANI_GOREV32.sql sonundaki not):
//     her 10 dakikada  POST { "mod": "tam" }     Authorization: Bearer <ESITLE_GIZLI>
//     her dakika       POST { "mod": "dakika" }  Authorization: Bearer <ESITLE_GIZLI>
//
// İki çağrılma şekli:
//  1) Uygulamadan (kullanıcının oturum tokeni):
//       { villa_id }                       → villanın bütün aktif takvimleri PARALEL okunur, kaydedilir, cakisma_tara çağrılır
//       { villa_id, bas, bit }             → aynı; cevaptaki dolu aralıklar ve durum yalnız bu aralığa bakar
//       { villa_id, deneme: {adres, kaynak} } → yalnız sahip: link kaydedilmeden okunur ("Bağla" öncesi test)
//     Erişim service_role ile, kullanıcının id'si üzerinden denetlenir (villalar.sahip / villa_erisim / yönetici).
//     Aynı villa için 20 sn'den sık çağrı gelirse takvimler yeniden okunmaz, son okumanın sonucu döner.
//  2) Zamanlayıcıdan (Authorization: Bearer <ESITLE_GIZLI>, hız sınırı yok):
//       mod "tam"    → bütün aktif takvimler, aynı anda en fazla 8; ardından bekleyenler, çakışma bildirimleri,
//                      3 saattir okunamayan takvim bildirimi
//       mod "dakika" → yalnız dis_kontrol='bekliyor' rezervasyonu olan villaların takvimleri + bekleyenler + çakışma bildirimleri
//
// Cevap: { takvimler: [{id, ad, kaynak, durum:'bos'|'dolu'|'hata', sure_ms, hata?, dolu_araliklar:[{bas,bit,tur}]}], cakisma_var }
// KVKK: misafir adı, telefon, SUMMARY / DESCRIPTION metni kaydedilmez; yalnız tarih, tür ve UID.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { ayristir, gunEkle, doluGunSay, type Blok } from "../_shared/ical.ts";
import { guvenliGetir, TakvimHatasi } from "../_shared/guvenlik.ts";
import { gonder, bugunTr } from "../_shared/push.ts";

// deno-lint-ignore no-explicit-any
type Db = any;
// deno-lint-ignore no-explicit-any
type Satir = any;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const ESZAMAN = 8;              // zamanlayıcıda aynı anda okunan takvim
const HIZ_SINIRI = 20_000;      // uygulamadan aynı villa için en az 20 sn
const BEKLEME_SURESI = 30 * 60_000;
const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function json(veri: unknown, durum = 200) {
  return new Response(JSON.stringify(veri), { status: durum, headers: { ...CORS, "Content-Type": "application/json" } });
}
const cakisir = (a: { bas: string; bit: string }, bas?: string, bit?: string) => !bas || !bit || (a.bas < bit && bas < a.bit);
export function aralikYaz(bas: string, bit: string): string {
  const a = new Date(bas + "T00:00:00Z"), b = new Date(bit + "T00:00:00Z");
  return a.getUTCMonth() === b.getUTCMonth() ? a.getUTCDate() + "–" + b.getUTCDate() + " " + AYLAR[b.getUTCMonth()]
    : a.getUTCDate() + " " + AYLAR[a.getUTCMonth()] + " – " + b.getUTCDate() + " " + AYLAR[b.getUTCMonth()];
}

// Aynı anda en fazla n iş
async function havuz<T, R>(l: T[], n: number, f: (x: T) => Promise<R>): Promise<R[]> {
  const sonuc: R[] = new Array(l.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, l.length) }, async () => {
    while (i < l.length) { const k = i++; sonuc[k] = await f(l[k]); }
  }));
  return sonuc;
}

// ---------------- bir takvimi oku ve kaydet ----------------
interface Okuma { id: string; ad: string; kaynak: string; durum: "tamam" | "hata"; sure_ms: number; hata?: string; bloklar: Blok[] }

async function takvimEsitle(db: Db, t: Satir): Promise<Okuma> {
  const t0 = Date.now(), simdi = new Date().toISOString(), bugun = bugunTr();
  try {
    const basliklar: Record<string, string> = {};
    if (t.etag) basliklar["If-None-Match"] = t.etag;
    if (t.son_degisim) basliklar["If-Modified-Since"] = t.son_degisim;
    const r = await guvenliGetir(t.adres, { basliklar });
    let bloklar: Blok[];
    if (r.durum === 304) {
      // değişmemiş: yalnız zaman güncellenir, bloklar olduğu gibi
      const { data } = await db.from("dis_bloklar").select("uid, baslangic, bitis, tur").eq("takvim_id", t.id);
      bloklar = (data || []).map((x: Satir) => ({ uid: x.uid, bas: x.baslangic, bit: x.bitis, tur: x.tur }));
      await db.from("dis_bloklar").update({ son_gorulme: simdi }).eq("takvim_id", t.id);
    } else {
      bloklar = ayristir(r.metin, t.kaynak, bugun);
      if (bloklar.length) {
        const { error } = await db.from("dis_bloklar").upsert(bloklar.map((b) => ({
          takvim_id: t.id, villa_id: t.villa_id, baslangic: b.bas, bitis: b.bit, tur: b.tur, uid: b.uid, son_gorulme: simdi,
        })), { onConflict: "takvim_id,uid,baslangic" });
        if (error) throw new TakvimHatasi("kayit", "Takvim kaydedilemedi.");
      }
      // bu okumada görünmeyen eski bloklar: iptal edilmiş satış → silinir
      await db.from("dis_bloklar").delete().eq("takvim_id", t.id).lt("son_gorulme", simdi);
    }
    await db.from("dis_takvimler").update({
      son_basari: simdi, son_deneme: simdi, hata_sayisi: 0, son_hata: null,
      etag: r.etag || t.etag || null, son_degisim: r.sonDegisim || t.son_degisim || null,
    }).eq("id", t.id);
    return { id: t.id, ad: t.ad, kaynak: t.kaynak, durum: "tamam", sure_ms: Date.now() - t0, bloklar };
  } catch (e) {
    const mesaj = e instanceof TakvimHatasi ? e.message : "Takvim okunamadı.";
    await db.from("dis_takvimler").update({ son_deneme: simdi, son_hata: mesaj, hata_sayisi: (t.hata_sayisi || 0) + 1 }).eq("id", t.id);
    return { id: t.id, ad: t.ad, kaynak: t.kaynak, durum: "hata", sure_ms: Date.now() - t0, hata: mesaj, bloklar: [] };
  }
}

// Okumayı cevap biçimine çevir (bas/bit verilirse yalnız o aralık)
function cevapSatiri(o: Okuma, bas?: string, bit?: string) {
  const dolu = o.bloklar.filter((b) => cakisir(b, bas, bit)).map((b) => ({ bas: b.bas, bit: b.bit, tur: b.tur }));
  return { id: o.id, ad: o.ad, kaynak: o.kaynak, durum: o.durum === "hata" ? "hata" : (dolu.length ? "dolu" : "bos"), sure_ms: o.sure_ms,
    ...(o.hata ? { hata: o.hata } : {}), dolu_araliklar: dolu };
}

// Son okumanın sonucu (hız sınırı): veritabanındaki takvim satırları ve bloklardan
async function sonOkuma(db: Db, takvimler: Satir[], bas?: string, bit?: string) {
  const { data } = await db.from("dis_bloklar").select("takvim_id, uid, baslangic, bitis, tur").in("takvim_id", takvimler.map((t) => t.id));
  return takvimler.map((t) => {
    const hatali = t.hata_sayisi > 0 && (!t.son_basari || (t.son_deneme && t.son_deneme > t.son_basari));
    const o: Okuma = { id: t.id, ad: t.ad, kaynak: t.kaynak, durum: hatali ? "hata" : "tamam", sure_ms: 0, hata: hatali ? (t.son_hata || "Takvim okunamadı.") : undefined,
      bloklar: (data || []).filter((x: Satir) => x.takvim_id === t.id).map((x: Satir) => ({ uid: x.uid, bas: x.baslangic, bit: x.bitis, tur: x.tur })) };
    return cevapSatiri(o, bas, bit);
  });
}

// ---------------- yetki (service_role ile, kullanıcının id'si üzerinden) ----------------
async function yetki(db: Db, uid: string, villa: string): Promise<{ erisim: boolean; sahip: boolean }> {
  const { data: v } = await db.from("villalar").select("sahip").eq("id", villa).maybeSingle();
  if (!v) return { erisim: false, sahip: false };
  const { data: e } = await db.from("villa_erisim").select("rol").eq("villa_id", villa).eq("kullanici", uid);
  let sahip = v.sahip === uid || (e || []).some((x: Satir) => String(x.rol) === "sahip");
  let erisim = sahip || (e || []).length > 0;
  if (!erisim) {
    const { data: p, error } = await db.from("profiller").select("yonetici").eq("id", uid).maybeSingle();
    if (!error && p && p.yonetici === true) { erisim = true; sahip = true; }
  }
  return { erisim, sahip };
}

// ---------------- uygulamadan ----------------
async function uygulamadan(db: Db, uid: string, g: Satir): Promise<Response> {
  const villa = String(g.villa_id || "");
  if (!/^[0-9a-f-]{36}$/i.test(villa)) return json({ hata: "villa_id gerekli" }, 400);
  const y = await yetki(db, uid, villa);
  if (!y.erisim) return json({ hata: "Bu villaya erişiminiz yok." }, 403);
  const bas = /^\d{4}-\d{2}-\d{2}$/.test(g.bas || "") ? g.bas : undefined, bit = /^\d{4}-\d{2}-\d{2}$/.test(g.bit || "") ? g.bit : undefined;

  // "Bağla" öncesi deneme: link kaydedilmeden okunur
  if (g.deneme) {
    if (!y.sahip) return json({ hata: "Takvim bağlamayı yalnız villa sahibi yapabilir." }, 403);
    const kaynak = ["airbnb", "booking", "vrbo", "villasepeti", "diger"].includes(g.deneme.kaynak) ? g.deneme.kaynak : "diger";
    const t0 = Date.now();
    try {
      const r = await guvenliGetir(String(g.deneme.adres || ""));
      const bugun = bugunTr(), bloklar = ayristir(r.metin, kaynak, bugun);
      return json({ deneme: { ok: true, sure_ms: Date.now() - t0, blok_sayisi: bloklar.length,
        dolu_gun: doluGunSay(bloklar, bugun, gunEkle(bugun, 365)) } });
    } catch (e) {
      return json({ deneme: { ok: false, sure_ms: Date.now() - t0, hata: e instanceof TakvimHatasi ? e.message : "Takvim okunamadı." } });
    }
  }

  const { data: takvimler } = await db.from("dis_takvimler").select("*").eq("villa_id", villa).eq("aktif", true).order("olusturma");
  const l: Satir[] = takvimler || [];
  if (!l.length) return json({ takvimler: [], cakisma_var: false });

  // hız sınırı: son okuma 20 sn'den yeniyse yeniden okunmaz
  const son = Math.max(...l.map((t) => (t.son_deneme ? Date.parse(t.son_deneme) : 0)));
  let satirlar;
  if (Date.now() - son < HIZ_SINIRI) satirlar = await sonOkuma(db, l, bas, bit);
  else {
    const okuma = await Promise.all(l.map((t) => takvimEsitle(db, t)));
    await db.rpc("cakisma_tara", { p_villa: villa });
    satirlar = okuma.map((o) => cevapSatiri(o, bas, bit));
  }
  const { data: ck } = await db.from("cakismalar").select("id").eq("villa_id", villa).eq("durum", "acik").limit(1);
  return json({ takvimler: satirlar, cakisma_var: !!(ck && ck.length), onbellek: Date.now() - son < HIZ_SINIRI || undefined });
}

// ---------------- zamanlayıcıdan ----------------
async function villaKisileri(db: Db, villa: string): Promise<{ sahip: string | null; hepsi: string[] }> {
  const { data: v } = await db.from("villalar").select("sahip").eq("id", villa).maybeSingle();
  const { data: e } = await db.from("villa_erisim").select("kullanici").eq("villa_id", villa);
  const hepsi = [v?.sahip, ...(e || []).map((x: Satir) => x.kullanici)].filter(Boolean) as string[];
  return { sahip: v?.sahip || null, hepsi: [...new Set(hepsi)] };
}
async function villaAdi(db: Db, villa: string): Promise<string> {
  const { data } = await db.from("villalar").select("ad").eq("id", villa).maybeSingle();
  return (data && data.ad) || "Villa";
}

// dis_kontrol='bekliyor' rezervasyonlar: takvimler okunduysa onay; 30 dk geçtiyse "ulaşılamıyor" bildirimi
async function bekleyenler(db: Db) {
  const { data: rezler } = await db.from("rezervasyonlar").select("id, villa_id, baslangic, bitis, dis_kontrol_zamani").eq("dis_kontrol", "bekliyor");
  for (const r of rezler || []) {
    const { data: tk } = await db.from("dis_takvimler").select("id, ad, son_basari").eq("villa_id", r.villa_id).eq("aktif", true);
    const zaman = r.dis_kontrol_zamani ? Date.parse(r.dis_kontrol_zamani) : 0;
    const okunmayan = (tk || []).filter((t: Satir) => !t.son_basari || Date.parse(t.son_basari) < zaman);
    const kisiler = (await villaKisileri(db, r.villa_id)).hepsi, ad = await villaAdi(db, r.villa_id);
    if (!okunmayan.length) {
      // cakisma_tara bir çakışma bulduysa durum zaten 'cakisma' oldu; yalnız hâlâ 'bekliyor' olan onaylanır
      const { data: g } = await db.from("rezervasyonlar").update({ dis_kontrol: "tamam", dis_kontrol_zamani: new Date().toISOString() })
        .eq("id", r.id).eq("dis_kontrol", "bekliyor").select("id");
      if (g && g.length) {
        await gonder(db, kisiler, { baslik: "Villa Takvimim", metin: "✓ " + ad + " " + aralikYaz(r.baslangic, r.bitis) + ": bütün takvimler müsait, rezervasyon onaylandı.",
          yol: "/?villa=" + r.villa_id + "&gun=" + r.baslangic, etiket: "onay-" + r.id }, "rez-onay-" + r.id);
      }
    } else if (Date.now() - zaman > BEKLEME_SURESI) {
      const adlar = okunmayan.map((t: Satir) => t.ad).join(", ");
      await gonder(db, kisiler, { baslik: "Villa Takvimim", metin: adlar + " takvimine 30 dakikadır ulaşılamıyor. Lütfen orada da kontrol edin.",
        yol: "/?villa=" + r.villa_id + "&gun=" + r.baslangic, etiket: "bekliyor-" + r.id }, "rez-bekliyor-" + r.id);
    }
  }
}

// Türkiye saati (0–23)
const trSaat = (d = new Date()) => (d.getUTCHours() + 3) % 24;

// Açık çakışmalar: açıldığı anda, sonra çözülene kadar tekrar (girişe 3 günden fazla: 3 saatte bir; az: saatte bir;
// 23:00–08:00 sessiz, girişe 24 saatten az kaldıysa gece de)
async function alarmlar(db: Db) {
  const { data: l } = await db.from("cakismalar").select("id, villa_id, rezervasyon_id, takvim_ad, baslangic, bitis, son_bildirim, bildirim_sayisi").eq("durum", "acik");
  const simdi = Date.now();
  for (const c of l || []) {
    const { data: r } = await db.from("rezervasyonlar").select("baslangic, bitis").eq("id", c.rezervasyon_id).maybeSingle();
    const giris = Date.parse((r?.baslangic || c.baslangic) + "T16:00:00+03:00"), kalan = giris - simdi;
    if (c.son_bildirim) {
      const aralik = kalan > 3 * 86_400_000 ? 3 * 3_600_000 : 3_600_000;
      if (simdi - Date.parse(c.son_bildirim) < aralik - 60_000) continue;
      const s = trSaat();
      if ((s >= 23 || s < 8) && kalan > 86_400_000) continue;
    }
    const ad = await villaAdi(db, c.villa_id), kisiler = (await villaKisileri(db, c.villa_id)).hepsi;
    await gonder(db, kisiler, { baslik: "⚠ Çift satış riski",
      metin: ad + " " + aralikYaz(r?.baslangic || c.baslangic, r?.bitis || c.bitis) + ": hem burada hem " + (c.takvim_ad || "başka sitede") + " dolu. Dokunup çözün.",
      yol: "/?cakisma=" + c.id, etiket: "cakisma-" + c.id });
    await db.from("cakismalar").update({ son_bildirim: new Date().toISOString(), bildirim_sayisi: (c.bildirim_sayisi || 0) + 1 }).eq("id", c.id);
  }
}

// 3 saattir okunamayan takvim: sahibe bildirim (günde en fazla 2: sabah / öğleden sonra)
async function ulasilamayanlar(db: Db) {
  const { data: l } = await db.from("dis_takvimler").select("id, villa_id, ad, son_basari, olusturma, hata_sayisi").eq("aktif", true).gt("hata_sayisi", 0);
  for (const t of l || []) {
    const son = Date.parse(t.son_basari || t.olusturma);
    if (Date.now() - son < 3 * 3_600_000) continue;
    const { sahip } = await villaKisileri(db, t.villa_id); if (!sahip) continue;
    const ad = await villaAdi(db, t.villa_id), dilim = trSaat() < 14 ? "1" : "2";
    await gonder(db, [sahip], { baslik: "Villa Takvimim", metin: ad + ": " + t.ad + " takvimi 3 saattir okunamıyor. Linki kontrol edin.",
      yol: "/?villa=" + t.villa_id + "&ayar=takvim", etiket: "takvim-3s-" + t.id }, "takvim-3s-" + t.id + "-" + dilim);
  }
}

async function zamanlayicidan(db: Db, mod: string): Promise<Response> {
  let takvimler: Satir[] = [];
  if (mod === "dakika") {
    const { data: rz } = await db.from("rezervasyonlar").select("villa_id").eq("dis_kontrol", "bekliyor")
      .gte("dis_kontrol_zamani", new Date(Date.now() - BEKLEME_SURESI - 60_000).toISOString());
    const villalar = [...new Set((rz || []).map((x: Satir) => x.villa_id))];
    if (villalar.length) ({ data: takvimler } = await db.from("dis_takvimler").select("*").eq("aktif", true).in("villa_id", villalar));
  } else {
    ({ data: takvimler } = await db.from("dis_takvimler").select("*").eq("aktif", true));
  }
  const okuma = await havuz(takvimler || [], ESZAMAN, (t) => takvimEsitle(db, t));
  const villalar = [...new Set((takvimler || []).map((t: Satir) => t.villa_id))];
  if (mod === "dakika") for (const v of villalar) await db.rpc("cakisma_tara", { p_villa: v });
  else await db.rpc("cakisma_tara", { p_villa: null });
  await bekleyenler(db);
  await alarmlar(db);
  if (mod !== "dakika") await ulasilamayanlar(db);
  return json({ mod, okunan: okuma.length, hata: okuma.filter((o) => o.durum === "hata").length });
}

// deno-lint-ignore no-explicit-any
const D = (globalThis as any).Deno;
if (D && D.serve) D.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ hata: "Yalnızca POST" }, 405);
  let g: Satir = {};
  try { g = await req.json(); } catch { g = {}; }
  const db = createClient(D.env.get("SUPABASE_URL")!, D.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const yetkiBasligi = req.headers.get("Authorization") || "";
  const GIZLI = D.env.get("ESITLE_GIZLI");
  try {
    if (GIZLI && yetkiBasligi === "Bearer " + GIZLI) return await zamanlayicidan(db, String(g.mod || "tam"));
    const jeton = yetkiBasligi.replace(/^Bearer\s+/i, "");
    const { data: u } = await db.auth.getUser(jeton);
    if (!u || !u.user) return json({ hata: "Oturum bulunamadı, tekrar giriş yapın." }, 401);
    return await uygulamadan(db, u.user.id, g);
  } catch (_e) {
    return json({ hata: "Takvimler şu an kontrol edilemedi." }, 500);
  }
});
