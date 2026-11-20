// Görev 33.8: takvim-esitle "tam" turundaki talep bildirimleri (Deno ve gerçek veritabanı olmadan; sahte istemci, sahte saat).
//   node --no-warnings docs/qa/gorev33/talep-sunucu-testi.mjs
// Yeni talep → bütün yöneticilere bir kez; "baglandi" → villa sahibine bir kez; ertesi gün tekrar gitmez; diğer durumlar sessiz.
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../supabase/functions");
const IS = await import(pathToFileURL(path.join(KOK, "takvim-esitle/is.ts")).href);

function sahteDb(T) {
  const tablo = ad => (T[ad] = T[ad] || []);
  const from = ad => {
    let islem = "select", veri = null, opt = {}, tek = false, sinir = null; const f = [];
    const q = {
      select() { return q; }, update(v) { islem = "update"; veri = v; return q; }, upsert(v, o) { islem = "upsert"; veri = v; opt = o || {}; return q; },
      delete() { islem = "delete"; return q; },
      eq(k, v) { f.push(r => r[k] === v); return q; }, gte(k, v) { f.push(r => r[k] != null && r[k] >= v); return q; },
      gt(k, v) { f.push(r => r[k] != null && r[k] > v); return q; }, lt(k, v) { f.push(r => r[k] != null && r[k] < v); return q; },
      in(k, l) { f.push(r => l.includes(r[k])); return q; }, order() { return q; }, limit(n) { sinir = n; return q; },
      maybeSingle() { tek = true; return q; },
      then(ok, red) { return Promise.resolve().then(calistir).then(ok, red); },
    };
    function calistir() {
      if (T.__yok && T.__yok.includes(ad)) return { data: null, error: { code: "PGRST205", message: "tablo yok" } };
      const L = tablo(ad), uy = r => f.every(g => g(r));
      if (islem === "select") { let l = L.filter(uy); if (sinir != null) l = l.slice(0, sinir); return { data: tek ? (l[0] ? { ...l[0] } : null) : l.map(x => ({ ...x })), error: null }; }
      if (islem === "update") { L.filter(uy).forEach(r => Object.assign(r, veri)); return { data: null, error: null }; }
      if (islem === "delete") { T[ad] = L.filter(r => !uy(r)); return { data: null, error: null }; }
      for (const s of [].concat(veri)) L.push({ ...s });
      return { data: null, error: null };
    }
    return q;
  };
  return { from, rpc: async () => ({ data: null, error: null }), T };
}

let SIMDI = Date.parse("2026-11-20T10:00:00+03:00");
const giden = [];
IS.bagla({
  simdi: () => SIMDI,
  gonder: async (db, kisiler, b, anahtar) => {
    const gun = new Date(SIMDI + 3 * 3600000).toISOString().slice(0, 10);
    const hedef = kisiler.filter(k => !anahtar || !db.T.bildirim_gonderim?.some(x => x.kullanici === k && x.anahtar === anahtar && x.gun === gun));
    if (anahtar) (db.T.bildirim_gonderim = db.T.bildirim_gonderim || []).push(...hedef.map(k => ({ kullanici: k, anahtar, gun })));
    if (hedef.length) giden.push({ kisiler: hedef.sort(), metin: b.metin, yol: b.yol, etiket: b.etiket });
    return hedef.length;
  },
});

let gecti = 0, kaldi = 0;
async function test(ad, f) {
  giden.length = 0;
  try { await f(); console.log("✓ " + ad); gecti++; } catch (e) { console.log("✗ " + ad + "\n   " + (e && e.message)); kaldi++; }
}
const esit = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error((m || "") + " beklenen " + JSON.stringify(b) + ", gelen " + JSON.stringify(a)); };
const V = "11111111-1111-4111-8111-111111111111";
const yeniT = () => ({
  villalar: [{ id: V, ad: "Villa Salta", sahip: "u1" }],
  profiller: [{ id: "a1", yonetici: true }, { id: "a2", yonetici: true }, { id: "u1", yonetici: false }],
  villa_erisim: [], dis_takvimler: [], rezervasyonlar: [], cakismalar: [],
  baglanti_talepleri: [{ id: "t1", villa_id: V, kullanici: "u1", site: "airbnb", durum: "bekliyor", olusturma: "2026-11-20T06:00:00Z", guncelleme: "2026-11-20T06:00:00Z" }],
});

await test("yeni talep: bütün yöneticilere bir kez, yol yönetim → talepler", async () => {
  const db = sahteDb(yeniT());
  await IS.zamanlayicidan(db, "tam");
  esit(giden.map(g => [g.kisiler, g.metin, g.yol, g.etiket]), [[["a1", "a2"], "Yeni takvim bağlama talebi: Villa Salta · Airbnb", "/?yonetim=talepler", "talep-t1"]]);
  giden.length = 0; await IS.zamanlayicidan(db, "tam");
  esit(giden.length, 0, "aynı gün ikinci tur");
  SIMDI += 86_400_000; await IS.zamanlayicidan(db, "tam"); SIMDI -= 86_400_000;
  esit(giden.length, 0, "ertesi gün");
});

await test("'dakika' turu talep bildirimi göndermez", async () => {
  const db = sahteDb(yeniT());
  await IS.zamanlayicidan(db, "dakika");
  esit(giden.length, 0);
});

await test("çalışılıyor / olmadı: bildirim yok", async () => {
  const T = yeniT(); T.baglanti_talepleri[0].durum = "calisiliyor";
  T.baglanti_talepleri.push({ id: "t2", villa_id: V, kullanici: "u1", site: "booking", durum: "olmadi", guncelleme: "2026-11-20T06:00:00Z" });
  await IS.zamanlayicidan(sahteDb(T), "tam");
  esit(giden.length, 0);
});

await test("bağlandı: villa sahibine bir kez '✓ Villa Salta artık Tatilsepeti takvimiyle bağlı.'", async () => {
  const T = yeniT(); Object.assign(T.baglanti_talepleri[0], { durum: "baglandi", site: "tatilsepeti", guncelleme: "2026-11-20T07:00:00Z" });
  const db = sahteDb(T);
  await IS.zamanlayicidan(db, "tam");
  esit(giden.map(g => [g.kisiler, g.metin, g.yol, g.etiket]), [[["u1"], "✓ Villa Salta artık Tatilsepeti takvimiyle bağlı.", "/?villa=" + V + "&ayar=takvim", "talep-bagli-t1"]]);
  giden.length = 0; SIMDI += 86_400_000; await IS.zamanlayicidan(db, "tam"); SIMDI -= 86_400_000;
  esit(giden.length, 0, "ertesi gün");
});

await test("7 günden eski bağlanma bildirimi taranmaz", async () => {
  const T = yeniT(); Object.assign(T.baglanti_talepleri[0], { durum: "baglandi", guncelleme: "2026-11-01T07:00:00Z" });
  await IS.zamanlayicidan(sahteDb(T), "tam");
  esit(giden.length, 0);
});

await test("tablo yoksa (SQL uygulanmadıysa) tur hatasız sürer", async () => {
  const T = yeniT(); T.__yok = ["baglanti_talepleri"];
  const c = await IS.zamanlayicidan(sahteDb(T), "tam");
  esit(c.status, 200); esit(giden.length, 0);
});

await test("deneme kaynakları yeni yerel siteleri içerir", async () => {
  for (const k of ["tatilsepeti", "kalkanvilla", "villapaketi", "tatilkentim"]) if (!IS.SITELER.includes(k)) throw new Error(k);
  esit(IS.siteAdi("kalkanvilla"), "Kalkan Villa");
});

console.log("\n" + gecti + " geçti, " + kaldi + " kaldı");
if (kaldi) process.exit(1);
