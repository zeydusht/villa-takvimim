// takvim-esitle sunucu mantığının testi (Deno ve gerçek veritabanı olmadan): sahte Supabase istemcisi, sahte saat, sahte iCal.
//   node --no-warnings docs/qa/gorev32/sunucu-testi.mjs
// Senaryolar: uygulamadan (erişim, deneme, hız sınırı, aralık özeti, SSRF), zamanlayıcı (bekleyen → onay bildirimi,
// bekleyen → çakışma, 30 dk ulaşılamıyor), çakışma bildirim aralıkları (3 saat / saatte bir / gece), 3 saattir okunamayan takvim,
// yansıma (bizim rezervasyonumuz 'bilinmiyor' olarak birebir dönünce alarm yok), KVKK (kaydedilen alanlar).
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";
const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../supabase/functions");
const IS = await import(pathToFileURL(path.join(KOK, "takvim-esitle/is.ts")).href);

// ---- sahte veritabanı (supabase-js sorgu zinciri: select / update / upsert / delete + eq / gte / gt / lt / in / limit / maybeSingle) ----
function sahteDb(T) {
  const tablo = ad => (T[ad] = T[ad] || []);
  const from = ad => {
    let islem = "select", veri = null, opt = {}, tek = false, sinir = null, donus = false; const f = [];
    const q = {
      select() { if (islem !== "select") donus = true; return q; },
      update(v) { islem = "update"; veri = v; return q; }, upsert(v, o) { islem = "upsert"; veri = v; opt = o || {}; return q; },
      delete() { islem = "delete"; return q; },
      eq(k, v) { f.push(r => r[k] === v); return q; }, gte(k, v) { f.push(r => r[k] != null && r[k] >= v); return q; },
      gt(k, v) { f.push(r => r[k] != null && r[k] > v); return q; }, lt(k, v) { f.push(r => r[k] != null && r[k] < v); return q; },
      in(k, l) { f.push(r => l.includes(r[k])); return q; }, order() { return q; }, limit(n) { sinir = n; return q; },
      maybeSingle() { tek = true; return q; },
      then(ok, red) { return Promise.resolve().then(calistir).then(ok, red); },
    };
    function calistir() {
      const L = tablo(ad), uy = r => f.every(g => g(r));
      if (islem === "select") { let l = L.filter(uy); if (sinir != null) l = l.slice(0, sinir); return { data: tek ? (l[0] ? { ...l[0] } : null) : l.map(x => ({ ...x })), error: null }; }
      if (islem === "update") { const l = L.filter(uy); l.forEach(r => Object.assign(r, veri)); return { data: donus ? l.map(x => ({ ...x })) : null, error: null }; }
      if (islem === "delete") { T[ad] = L.filter(r => !uy(r)); return { data: null, error: null }; }
      const anahtar = (opt.onConflict || (ad === "bildirim_gonderim" ? "kullanici,anahtar,gun" : "")).split(",").filter(Boolean);
      for (const s of [].concat(veri)) {
        const e = anahtar.length ? L.find(r => anahtar.every(k => r[k] === s[k])) : null;
        if (e) { if (!opt.ignoreDuplicates) Object.assign(e, s); }
        else L.push(ad === "dis_bloklar" ? { id: L.length + 1, ilk_gorulme: s.son_gorulme, bagli_rezervasyon: null, ...s } : { ...s });
      }
      return { data: null, error: null };
    }
    return q;
  };
  // cakisma_tara (VERITABANI_GOREV32.sql ile aynı kural)
  const rpc = async (ad, a) => {
    if (ad !== "cakisma_tara") return { data: null, error: null };
    let n = 0;
    for (const r of tablo("rezervasyonlar")) {
      if ((a.p_villa && r.villa_id !== a.p_villa) || r.bitis < BUGUN) continue;
      for (const d of tablo("dis_bloklar")) {
        const t = tablo("dis_takvimler").find(x => x.id === d.takvim_id);
        if (d.villa_id !== r.villa_id || !(d.baslangic < r.bitis && r.baslangic < d.bitis) || !t || !t.aktif) continue;
        if (!["rezervasyon", "bilinmiyor"].includes(d.tur) || d.bagli_rezervasyon === r.id) continue;
        if (d.tur === "bilinmiyor" && d.baslangic === r.baslangic && d.bitis === r.bitis && d.ilk_gorulme >= r.olusturma) continue;
        if (tablo("cakismalar").some(c => c.rezervasyon_id === r.id && c.blok_id === d.id)) continue;
        tablo("cakismalar").push({ id: "c" + (tablo("cakismalar").length + 1), villa_id: r.villa_id, rezervasyon_id: r.id, blok_id: d.id, takvim_ad: t.ad,
          baslangic: r.baslangic > d.baslangic ? r.baslangic : d.baslangic, bitis: r.bitis < d.bitis ? r.bitis : d.bitis, durum: "acik", son_bildirim: null, bildirim_sayisi: 0 });
        n++;
      }
    }
    for (const r of tablo("rezervasyonlar")) if (tablo("cakismalar").some(c => c.rezervasyon_id === r.id && c.durum === "acik")) r.dis_kontrol = "cakisma";
    return { data: n, error: null };
  };
  return { from, rpc, T };
}

// ---- saat, iCal, bildirim toplayıcı ----
const BUGUN = "2026-11-16";
let SIMDI = Date.parse("2026-11-16T10:00:00+03:00");
const ICS = {};
const ics = l => "BEGIN:VCALENDAR\r\nVERSION:2.0\r\n" + l.map((o, i) => "BEGIN:VEVENT\r\nUID:" + (o.uid || "u" + i) + "\r\nDTSTART;VALUE=DATE:" + o.bas.replace(/-/g, "") +
  "\r\nDTEND;VALUE=DATE:" + o.bit.replace(/-/g, "") + "\r\nSUMMARY:" + o.ozet + "\r\n" + (o.aciklama ? "DESCRIPTION:" + o.aciklama + "\r\n" : "") + "END:VEVENT\r\n").join("") + "END:VCALENDAR\r\n";
const giden = [];
IS.bagla({
  simdi: () => SIMDI,
  cozumle: async () => ["93.184.216.34"],
  getir: async (u) => { const ad = String(u).replace("https://ical.test/", ""); if (!(ad in ICS)) return new Response("yok", { status: 404 }); if (ICS[ad] === null) throw new Error("bağlantı"); return new Response(ICS[ad], { status: 200 }); },
  gonder: async (db, kisiler, b, anahtar) => {
    const gun = new Date(SIMDI + 3 * 3600000).toISOString().slice(0, 10);
    const hedef = kisiler.filter(k => !anahtar || !db.T.bildirim_gonderim?.some(x => x.kullanici === k && x.anahtar === anahtar && x.gun === gun));
    if (anahtar) (db.T.bildirim_gonderim = db.T.bildirim_gonderim || []).push(...hedef.map(k => ({ kullanici: k, anahtar, gun })));
    if (hedef.length) giden.push({ kisiler: hedef.sort(), metin: b.metin, yol: b.yol, saat: new Date(SIMDI).toISOString() });
    return hedef.length;
  },
});

let gecen = 0, kalan = 0;
const test = async (ad, f) => { try { await f(); gecen++; console.log("✓ " + ad); } catch (e) { kalan++; console.log("✗ " + ad + "\n    " + e.message); } };
const esit = (a, b, m = "") => { const x = JSON.stringify(a), y = JSON.stringify(b); if (x !== y) throw new Error(m + " beklenen " + y + ", gelen " + x); };
const dogru = (x, m) => { if (!x) throw new Error(m); };
const iso = ms => new Date(ms).toISOString();
const V = "11111111-1111-4111-8111-111111111111", R1 = "22222222-2222-4222-8222-222222222222";
function temelDb(ek = {}) {
  return sahteDb({
    villalar: [{ id: V, sahip: "u1", ad: "Villa Salta" }],
    villa_erisim: [{ villa_id: V, kullanici: "u2", rol: "bakici" }],
    profiller: [{ id: "u3", yonetici: false }],
    dis_takvimler: [
      { id: "t1", villa_id: V, kaynak: "airbnb", ad: "Airbnb", adres: "https://ical.test/a.ics", aktif: true, hata_sayisi: 0, son_deneme: null, son_basari: null, olusturma: iso(SIMDI - 86400000) },
      { id: "t2", villa_id: V, kaynak: "villasepeti", ad: "Villasepeti", adres: "https://ical.test/v.ics", aktif: true, hata_sayisi: 0, son_deneme: null, son_basari: null, olusturma: iso(SIMDI - 86400000) }],
    dis_bloklar: [], cakismalar: [], rezervasyonlar: [], bildirim_gonderim: [], ...ek,
  });
}
const cevap = async r => ({ durum: r.status, govde: await r.json() });

// ---------------- uygulamadan ----------------
await test("erişimi olmayan kullanıcı 403; bakıcı okuyabilir; deneme yalnız sahip", async () => {
  const db = temelDb(); ICS["a.ics"] = ics([]); ICS["v.ics"] = ics([]);
  esit((await cevap(await IS.uygulamadan(db, "yabanci", { villa_id: V }))).durum, 403);
  esit((await cevap(await IS.uygulamadan(db, "u2", { villa_id: V }))).durum, 200);
  esit((await cevap(await IS.uygulamadan(db, "u2", { villa_id: V, deneme: { adres: "https://ical.test/a.ics", kaynak: "airbnb" } }))).durum, 403);
});
await test("deneme: 8 dolu gün; SSRF ve http reddi (sade Türkçe)", async () => {
  const db = temelDb();
  ICS["d.ics"] = ics([{ bas: "2026-11-25", bit: "2026-11-29", ozet: "Reserved" }, { bas: "2026-12-10", bit: "2026-12-14", ozet: "Reserved" }]);
  esit((await cevap(await IS.uygulamadan(db, "u1", { villa_id: V, deneme: { adres: "https://ical.test/d.ics", kaynak: "airbnb" } }))).govde.deneme.dolu_gun, 8);
  for (const [adres, kod] of [["https://127.0.0.1/x.ics", "IP adresiyle"], ["https://169.254.169.254/latest", "IP adresiyle"], ["http://ical.test/d.ics", "https://"], ["https://localhost/x.ics", "internetteki"]]) {
    const g = (await cevap(await IS.uygulamadan(db, "u1", { villa_id: V, deneme: { adres, kaynak: "diger" } }))).govde.deneme;
    dogru(!g.ok && g.hata.includes(kod), adres + " reddedilmeli: " + JSON.stringify(g));
  }
});
await test("okuma: bloklar kaydedilir (yalnız tarih / tür / UID), aralık özeti, eski blok silinir, 20 sn hız sınırı", async () => {
  const db = temelDb();
  ICS["a.ics"] = ics([{ bas: "2026-11-17", bit: "2026-11-21", ozet: "Reserved", aciklama: "Reservation URL: x\\nPhone Number (Last 4 Digits): 1234", uid: "a1" },
    { bas: "2026-12-01", bit: "2026-12-03", ozet: "Airbnb (Not available)", uid: "a2" }]);
  ICS["v.ics"] = ics([{ bas: "2026-11-25", bit: "2026-11-27", ozet: "Rezervasyon - Mehmet Kaya", uid: "v1" }]);
  const g = (await cevap(await IS.uygulamadan(db, "u1", { villa_id: V, bas: "2026-11-18", bit: "2026-11-20" }))).govde;
  esit(g.takvimler.map(t => [t.ad, t.durum, t.dolu_araliklar.length]), [["Airbnb", "dolu", 1], ["Villasepeti", "bos", 0]]);
  esit(db.T.dis_bloklar.map(b => [b.uid, b.baslangic, b.bitis, b.tur]), [["a1", "2026-11-17", "2026-11-21", "rezervasyon"], ["a2", "2026-12-01", "2026-12-03", "kapali"], ["v1", "2026-11-25", "2026-11-27", "bilinmiyor"]]);
  dogru(!/1234|Mehmet|Kaya|Reservation URL|SUMMARY/.test(JSON.stringify(db.T.dis_bloklar)), "KVKK: kişisel bilgi kaydedilmemeli");
  esit(Object.keys(db.T.dis_bloklar[0]).sort(), ["bagli_rezervasyon", "baslangic", "bitis", "id", "ilk_gorulme", "son_gorulme", "takvim_id", "tur", "uid", "villa_id"]);
  // 10 sn sonra: hız sınırı → yeniden okunmaz, son sonuç döner
  ICS["a.ics"] = ics([]); SIMDI += 10000;
  const g2 = (await cevap(await IS.uygulamadan(db, "u1", { villa_id: V }))).govde;
  dogru(g2.onbellek && db.T.dis_bloklar.length === 3, "20 sn içinde yeniden okunmamalı");
  // 25 sn sonra: yeniden okunur; Airbnb'de iptal edilen satış silinir
  SIMDI += 25000;
  await IS.uygulamadan(db, "u1", { villa_id: V });
  esit(db.T.dis_bloklar.map(b => b.uid), ["v1"]);
});
await test("ulaşılamayan takvim: son_hata sade, hata_sayisi artar; diğer takvim okunur", async () => {
  const db = temelDb(); ICS["a.ics"] = ics([]); delete ICS["v.ics"]; SIMDI += 60000;
  const g = (await cevap(await IS.uygulamadan(db, "u1", { villa_id: V }))).govde;
  esit(g.takvimler.map(t => t.durum), ["bos", "hata"]);
  const t2 = db.T.dis_takvimler.find(t => t.id === "t2");
  esit([t2.hata_sayisi, t2.son_hata], [1, "Bu link artık çalışmıyor. Siteden yeni linki alın."]);
});

// ---------------- zamanlayıcı: bekleyen rezervasyonlar ----------------
await test("bekleyen → takvimler okununca boş → 'tamam' + onay bildirimi (sahip ve bakıcıya), tekrar gönderilmez", async () => {
  SIMDI = Date.parse("2026-11-16T10:00:00+03:00"); giden.length = 0;
  const db = temelDb({ rezervasyonlar: [{ id: R1, villa_id: V, baslangic: "2026-11-17", bitis: "2026-11-21", misafir: "Ahmet Yılmaz", dis_kontrol: "bekliyor", dis_kontrol_zamani: iso(SIMDI - 60000), olusturma: iso(SIMDI - 60000) }] });
  ICS["a.ics"] = ics([]); ICS["v.ics"] = ics([]);
  await IS.zamanlayicidan(db, "dakika");
  esit(db.T.rezervasyonlar[0].dis_kontrol, "tamam");
  esit(giden.map(g => [g.kisiler, g.metin, g.yol]), [[["u1", "u2"], "✓ Villa Salta 17–21 Kasım: bütün takvimler müsait, rezervasyon onaylandı.", "/?villa=" + V + "&gun=2026-11-17"]]);
  SIMDI += 60000; await IS.zamanlayicidan(db, "dakika"); esit(giden.length, 1, "ikinci kez gönderilmemeli");
});
await test("bekleyen → dışarıda satış çıkar → çakışma açılır, onay gitmez, çakışma bildirimi gider", async () => {
  SIMDI = Date.parse("2026-11-16T10:00:00+03:00"); giden.length = 0;
  const db = temelDb({ rezervasyonlar: [{ id: R1, villa_id: V, baslangic: "2026-11-17", bitis: "2026-11-21", misafir: "Ahmet Yılmaz", dis_kontrol: "bekliyor", dis_kontrol_zamani: iso(SIMDI - 60000), olusturma: iso(SIMDI - 60000) }] });
  ICS["a.ics"] = ics([]); ICS["v.ics"] = ics([{ bas: "2026-11-18", bit: "2026-11-20", ozet: "Dolu" }]);
  await IS.zamanlayicidan(db, "dakika");
  esit([db.T.rezervasyonlar[0].dis_kontrol, db.T.cakismalar.length], ["cakisma", 1]);
  esit(giden.map(g => g.metin), ["Villa Salta 17–21 Kasım: hem burada hem Villasepeti dolu. Dokunup çözün."]);
  esit(giden[0].yol, "/?cakisma=" + db.T.cakismalar[0].id);
});
await test("bekleyen → 30 dk ulaşılamıyor → bir kez 'ulaşılamıyor' bildirimi", async () => {
  SIMDI = Date.parse("2026-11-16T10:00:00+03:00"); giden.length = 0;
  const db = temelDb({ rezervasyonlar: [{ id: R1, villa_id: V, baslangic: "2026-11-17", bitis: "2026-11-21", dis_kontrol: "bekliyor", dis_kontrol_zamani: iso(SIMDI), olusturma: iso(SIMDI) }] });
  ICS["a.ics"] = ics([]); ICS["v.ics"] = null;   // bağlantı kopuk
  db.T.dis_takvimler[1].olusturma = iso(SIMDI - 10 * 60000);   // takvim yeni bağlandı (3 saat kuralı devreye girmesin)
  await IS.zamanlayicidan(db, "dakika"); esit(giden.length, 0, "henüz 30 dk olmadı");
  SIMDI += 31 * 60000; await IS.zamanlayicidan(db, "tam");
  esit(giden.map(g => g.metin), ["Villasepeti takvimine 30 dakikadır ulaşılamıyor. Lütfen orada da kontrol edin."]);
  SIMDI += 60000; await IS.zamanlayicidan(db, "tam"); esit(giden.length, 1, "aynı gün ikinci kez gitmemeli");
  esit(db.T.rezervasyonlar[0].dis_kontrol, "bekliyor");
});

// ---------------- çakışma bildirimi aralıkları ----------------
async function alarmDb(giris, sonBildirim) {
  return temelDb({ rezervasyonlar: [{ id: R1, villa_id: V, baslangic: giris, bitis: "2027-01-30", olusturma: iso(0) }],
    cakismalar: [{ id: "c1", villa_id: V, rezervasyon_id: R1, takvim_ad: "Airbnb", baslangic: giris, bitis: "2027-01-30", durum: "acik", son_bildirim: sonBildirim, bildirim_sayisi: sonBildirim ? 1 : 0 }] });
}
await test("çakışma: açıldığı an; girişe 3 günden fazla → 3 saatte bir", async () => {
  SIMDI = Date.parse("2026-11-16T10:00:00+03:00"); giden.length = 0;
  const db = await alarmDb("2026-12-20", null);
  await IS.alarmlar(db); esit(giden.length, 1, "açıldığı an");
  SIMDI += 2 * 3600000; await IS.alarmlar(db); esit(giden.length, 1, "2 saat sonra gitmemeli");
  SIMDI += 3600000; await IS.alarmlar(db); esit(giden.length, 2, "3 saat sonra gitmeli");
  esit(db.T.cakismalar[0].bildirim_sayisi, 2);
  dogru(giden.every(g => g.kisiler.join() === "u1,u2"), "sahip ve erişimi olan herkes");
});
await test("çakışma: girişe 3 gün ve az → saatte bir; gece 23–08 sessiz; girişe 24 saatten az kaldıysa gece de", async () => {
  giden.length = 0;
  SIMDI = Date.parse("2026-11-16T02:00:00+03:00");   // gece 02:00, giriş 18 Kasım 16:00 (~38 saat)
  let db = await alarmDb("2026-11-18", iso(SIMDI - 61 * 60000));
  await IS.alarmlar(db); esit(giden.length, 0, "gece sessiz");
  SIMDI = Date.parse("2026-11-16T09:00:00+03:00"); await IS.alarmlar(db); esit(giden.length, 1, "sabah gider");
  SIMDI += 30 * 60000; await IS.alarmlar(db); esit(giden.length, 1, "yarım saat sonra gitmez");
  SIMDI += 31 * 60000; await IS.alarmlar(db); esit(giden.length, 2, "saatte bir");
  giden.length = 0;
  SIMDI = Date.parse("2026-11-18T02:00:00+03:00");   // giriş bugün 16:00 (14 saat)
  db = await alarmDb("2026-11-18", iso(SIMDI - 61 * 60000));
  await IS.alarmlar(db); esit(giden.length, 1, "girişe 24 saatten az: gece de gider");
});
await test("3 saattir okunamayan takvim: sahibe, günde en fazla 2 (sabah / öğleden sonra)", async () => {
  giden.length = 0; SIMDI = Date.parse("2026-11-16T09:00:00+03:00");
  const db = temelDb(); const t2 = db.T.dis_takvimler[1];
  Object.assign(t2, { hata_sayisi: 5, son_basari: iso(SIMDI - 4 * 3600000) });
  await IS.ulasilamayanlar(db); SIMDI += 3600000; await IS.ulasilamayanlar(db);
  esit(giden.map(g => [g.kisiler, g.metin]), [[["u1"], "Villa Salta: Villasepeti takvimi 3 saattir okunamıyor. Linki kontrol edin."]]);
  SIMDI = Date.parse("2026-11-16T15:00:00+03:00"); await IS.ulasilamayanlar(db); SIMDI += 3600000; await IS.ulasilamayanlar(db);
  esit(giden.length, 2, "öğleden sonra bir kez daha, toplam 2");
});

// ---------------- yansıma ----------------
await test("yansıma: bizim rezervasyonumuz Booking'den 'bilinmiyor' olarak birebir aynı tarihle dönünce alarm yok", async () => {
  SIMDI = Date.parse("2026-11-16T10:00:00+03:00"); giden.length = 0;
  const db = temelDb({ rezervasyonlar: [{ id: R1, villa_id: V, baslangic: "2026-11-25", bitis: "2026-11-28", olusturma: iso(SIMDI - 3600000), dis_kontrol: "tamam" }] });
  db.T.dis_takvimler[1] = { ...db.T.dis_takvimler[1], kaynak: "booking", ad: "Booking", adres: "https://ical.test/b.ics" };
  ICS["a.ics"] = ics([]); ICS["b.ics"] = ics([{ bas: "2026-11-25", bit: "2026-11-28", ozet: "CLOSED - Not available" }]);
  await IS.zamanlayicidan(db, "tam");
  esit([db.T.cakismalar.length, giden.length], [0, 0]);
  // aynı tarih ama bizim rezervasyondan ÖNCE görülmüş bir blok (gerçek çakışma) → alarm
  db.T.dis_bloklar[0].ilk_gorulme = iso(SIMDI - 7200000);
  await IS.zamanlayicidan(db, "tam");
  esit(db.T.cakismalar.length, 1, "önceden var olan blok yansıma sayılmaz");
});

console.log("\n" + gecen + " geçti, " + kalan + " kaldı");
process.exit(kalan ? 1 : 0);
