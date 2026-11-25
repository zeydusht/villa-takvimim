// Görev 42.4 (kalıcı test): okunabilirlik taraması (PM'in TARA fonksiyonu). Kelime bölünmüş (kirik) / harf harf dar (dar) / sayfadan taşan (tasma) yazı.
// Varsayılan (hızlı): chromium, 320 genişlik, Çok büyük; her ekran bir kez. Tam matris: MOTOR=chromium,webkit BOYUT=320,se YAZI=buyuk,cokbuyuk
// Ortam: MOTOR  BOYUT (320 | se=375)  YAZI (buyuk | cokbuyuk)  SUZ=<ekran adı regex>  CIKTI=<json>  GORSEL=<klasör> (yalnız chromium 320 cokbuyuk)
const fs = require("fs");
const pw = require("playwright-core");
// tarayıcı her ekran grubu için yeniden açılmasın: launch önbellekli, close yalnız bağlamı kapatır
const ON = {};
for (const ad of ["chromium", "webkit"]) { const asil = pw[ad].launch.bind(pw[ad]);
  pw[ad].launch = async (o) => { if (!ON[ad]) ON[ad] = await asil(o); const b = ON[ad]; let c = null;
    return { newContext: async (...a) => (c = await b.newContext(...a)), close: async () => { if (c) await c.close(); } }; }; }
const { ac, bk } = require("./ortak.js"); const { veri27, V } = require("./veri27.js");
const MOTORLAR = (process.env.MOTOR || "chromium").split(",");
const BOYUTLAR = (process.env.BOYUT || "320").split(",");
const YAZILAR = (process.env.YAZI || "cokbuyuk").split(",");
const SUZ = process.env.SUZ ? new RegExp(process.env.SUZ) : null;
const GORSEL = process.env.GORSEL || null; if (GORSEL) fs.mkdirSync(GORSEL, { recursive: true });
const RID = "b2000000-0000-4000-8000-000000000001";

// ---- PM'in tarama fonksiyonu (GOREV42.md, olduğu gibi) ----
const TARA = () => {
  const out = [], vw = innerWidth;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim(); if (t.length < 3) continue;
    const el = n.parentElement; if (!el || !el.offsetParent) continue;
    if (el.closest('.hide,[aria-hidden="true"]')) continue;
    const st = getComputedStyle(el);
    const r = document.createRange(); r.selectNodeContents(n);
    const rs = [...r.getClientRects()].filter(x => x.width > 0 && x.height > 0); if (!rs.length) continue;
    const satir = new Set(rs.map(x => Math.round(x.top))).size, kelime = t.split(/\s+/).length;
    const enUzun = Math.max(...t.split(/\s+/).map(k => k.length));
    const kirik = satir > kelime;
    const dar = satir >= 3 && enUzun >= 5 && rs.some(x => x.width < 3 * parseFloat(st.fontSize));
    const tasma = rs.some(x => x.right > vw + 1 || x.left < -1);
    if (kirik || dar || tasma) out.push({ t: t.slice(0, 50), kirik, dar, tasma, satir, kelime });
  }
  return out;
};
// TARA'nın aynısı + yer (hangi öğe) ve kasıtlı yatay kaydırılan şerit içinde mi (oradaki taşma sayılmaz)
const TARA_EK = () => {
  const out = [], vw = innerWidth;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const yol = e => { const l = []; for (let x = e; x && x !== document.body && l.length < 4; x = x.parentElement)
    l.unshift(x.tagName.toLowerCase() + (x.id ? "#" + x.id : "") + (typeof x.className === "string" && x.className.trim() ? "." + x.className.trim().split(/\s+/).slice(0, 2).join(".") : "")); return l.join(" > "); };
  const serit = e => { for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x);
    if ((s.overflowX === "auto" || s.overflowX === "scroll") && x.scrollWidth > x.clientWidth + 1 && !x.classList.contains("overlay")) return true; } return false; };
  let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim(); if (t.length < 3) continue;
    const el = n.parentElement; if (!el || !el.offsetParent) continue;
    if (el.closest('.hide,[aria-hidden="true"]')) continue;
    const st = getComputedStyle(el);
    const r = document.createRange(); r.selectNodeContents(n);
    const rs = [...r.getClientRects()].filter(x => x.width > 0 && x.height > 0); if (!rs.length) continue;
    const satir = new Set(rs.map(x => Math.round(x.top))).size, kelime = t.split(/\s+/).length;
    const enUzun = Math.max(...t.split(/\s+/).map(k => k.length));
    const kirik = satir > kelime;
    // GOREV42.md tanımı: "3 ve daha fazla satıra yayılmış, her satırı dar yazı". PM'in kodu (rs.some) paragrafın kısa SON
    // satırını da yakalıyor; burada son satır sayılmaz: son satırdan önceki satırlardan biri 3 harf boyundan (3 × yazı boyu) darsa "dar".
    const satirlar = {}; rs.forEach(x => { const k = Math.round(x.top); satirlar[k] = (satirlar[k] || 0) + x.width; });
    const genis = Object.keys(satirlar).map(Number).sort((a, b) => a - b).map(k => satirlar[k]);
    const dar = satir >= 3 && enUzun >= 5 && genis.slice(0, -1).some(g => g < 3 * parseFloat(st.fontSize));
    const darHam = satir >= 3 && enUzun >= 5 && rs.some(x => x.width < 3 * parseFloat(st.fontSize));
    const tasma = rs.some(x => x.right > vw + 1 || x.left < -1) && !serit(el);
    // istisna (GOREV42.md 42.1): bölünmesi gereken tek parça şeyler (bağlantı adresi, e-posta, kod)
    const istisna = !/\s/.test(t) && (/^https?:\/\/|^www\.|@/.test(t) || !!el.closest(".dtLink,.lsLink,.tlLink,code,#hesapAd"));
    if (istisna && !tasma) continue;
    if (kirik || dar || tasma) out.push({ t: t.slice(0, 50), kirik, dar, tasma, satir, kelime, yer: yol(el) });
    else if (darHam) out.push({ t: t.slice(0, 50), kirik: false, dar: false, tasma: false, darHam: true, satir, kelime, yer: yol(el) });
  }
  return out;
};

const tik = async (p, s, ms = 900) => { await p.waitForSelector(s, { state: "attached", timeout: 5000 }).catch(() => {});
  await p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error("yok " + s); e.click(); }, s); await bk(ms); };
const kapatHepsi = async p => { await p.evaluate(() => { document.querySelectorAll(".overlay").forEach(o => o.remove()); document.body.style.position = ""; document.body.style.top = "";
  document.documentElement.classList.remove("kilitli"); document.body.classList.remove("kilitli"); }); await bk(200); };
const sekme = (p, s) => tik(p, '#sekmeler [data-sekme="' + s + '"]', 1000);
const villa = async (p, id) => { await sekme(p, "ana"); await p.evaluate(() => { const g = document.getElementById("geri"); if (g && !document.getElementById("takvim").classList.contains("hide")) g.click(); }); await bk(600);
  await tik(p, '#villalar .kart[data-id="' + id + '"]', 1400); };
const gun = (p, k) => tik(p, '#grid .cell[data-k="' + k + '"]', 450);

// kurulumu bitmemiş villa (Villa kurulumu · x/7, Villa bilgileri Eksik), fotoğrafsız
const veriKurulum = () => { const d = veri27(); d.villalar[2] = { id: V[2], ad: "Villa Zeytin", renk: "#7A4B8C", bilgi: { konum: "Kalkan" }, silindi_tarih: null }; return d; };
const veriDolu = () => { const d = veri27(); d.rezler.push({ id: "b2000000-0000-4000-8000-000000000051", villa_id: V[0], baslangic: "2026-12-05", bitis: "2026-12-08", misafir: "Selim Ak", kisi: 2, renk: "#3C4E8C" });
  d.rezler[0].telefon = "05329998877"; d.odemeler = [{ id: "od0", rezervasyon_id: RID, villa_id: V[0], tarih: "2026-11-12", tutar: 4000, aciklama: "Kapora" }];
  d.ozelYol = { rezervasyon_mali: () => ({ govde: [{ rezervasyon_id: RID, villa_id: V[0], tutar: 13000, ek_ucret: 0, depozito_tutar: 5000 }] }) };
  d.giderler = [{ id: "c1000000-0000-4000-8000-000000000001", villa_id: V[0], aciklama: "Havuz temizliği ve bahçe bakımı", tutar: 1500, tarih: "2026-11-10" }];
  d.gelirler = [{ id: "c2000000-0000-4000-8000-000000000001", villa_id: V[0], aciklama: "Ek kahvaltı", tutar: 900, tarih: "2026-11-11" }];
  return d; };
let veri29 = null; try { veri29 = require("./veri29.js").veri29; } catch (e) {}

// ekran grupları: [grup adı, veri, adımlar(p, ekran)] ; ekran(ad) o anki durumu tarar
const GRUPLAR = [
  ["villalarim", () => veriDolu(), async (p, E) => {
    await E("villalarim-dolu");
    await villa(p, V[0]); await E("villa-sayfasi");
    await p.evaluate(() => document.querySelector("#siradaki .sirKart").click()); await bk(1300); await E("rez-detay");
    await tik(p, "#d-odeme", 1300); await E("odemeler"); await kapatHepsi(p);
    await p.evaluate(() => document.querySelector("#siradaki .sirKart").click()); await bk(1300);
    await tik(p, "#d-duzenle", 1300); await E("rez-duzenle"); await kapatHepsi(p);
    await gun(p, "2026-11-17"); await gun(p, "2026-11-19"); await bk(400); await E("secim-karti");
    await tik(p, "#spRez", 1300); await E("yeni-rez"); await kapatHepsi(p);
    await villa(p, V[0]); await gun(p, "2026-11-17"); await gun(p, "2026-11-19"); await tik(p, "#spTeklif", 1300); await E("teklif"); await kapatHepsi(p);
    await villa(p, V[0]); await gun(p, "2026-11-17"); await gun(p, "2026-11-19"); await tik(p, "#spOps", 1300); await E("opsiyon"); await kapatHepsi(p);
    await villa(p, V[0]); await tik(p, "#fiyatBtn", 1300); await E("fiyatlar");
    await p.evaluate(() => { const b = document.querySelector('#fySeg [data-g="gun"]'); if (b) b.click(); }); await bk(900); await E("fiyatlar-gun");
    await p.evaluate(() => { const b = document.querySelector('#fySeg [data-g="ay"]') || document.querySelector("#fySeg button"); if (b) b.click(); }); await bk(700);
    await p.evaluate(() => { const b = document.querySelector('#fyAylar [data-ay="2026-12"]'); if (b) b.click(); }); await bk(1100); await E("fiyat-ay-paneli"); await kapatHepsi(p);
    await p.evaluate(() => { const g = document.getElementById("fyGeri"); if (g) g.click(); }); await bk(700);
    await villa(p, V[0]); await tik(p, "#kasaBtn", 1300); await E("gelir-gider");
    await tik(p, "#kGiderEkle", 1200); await E("gider-ekle"); await kapatHepsi(p);
    await p.evaluate(() => { const g = document.getElementById("kasaGeri"); if (g) g.click(); }); await bk(700);
    await villa(p, V[0]); await tik(p, "#misafirBtn", 1300); await E("villa-misafirler");
    await p.evaluate(() => { const g = document.getElementById("misGeri"); if (g) g.click(); }); await bk(700);
    await villa(p, V[0]); await tik(p, "#bilgiBtn", 1300); await E("villa-bilgileri"); await kapatHepsi(p);
    await villa(p, V[0]); await tik(p, "#paylasBtn", 1300); await E("villa-sayfasi-paylas"); await kapatHepsi(p);
    await sekme(p, "ajanda"); await E("ajanda");
    await tik(p, '#ajSeg [data-m="30"]', 800); await E("ajanda-30");
    await tik(p, '#ajUst [data-u="misafir"]', 900); await E("misafirler");
    await tik(p, '#ajUst [data-u="ajanda"]', 700);
    await tik(p, "#maKart", 1100); await E("hangi-bos-1");
    await tik(p, '#maGrid .cell[data-k="2026-11-24"]', 250); await tik(p, '#maGrid .cell[data-k="2026-11-26"]', 700); await E("hangi-bos-2");
    await tik(p, "#maGoster", 1300); await E("hangi-bos-3");
    await p.evaluate(() => { const b = document.querySelector(".overlay:not(.kapaniyor) .maSonuc button, .overlay:not(.kapaniyor) [data-ma-villa]"); if (b) b.click(); }); await bk(1100); await E("hangi-bos-4");
    await kapatHepsi(p);
    await sekme(p, "hesapEkran"); await E("hesap");
    await tik(p, "#hesapBtn", 1200); await E("hesabim"); await kapatHepsi(p);
    await tik(p, "#destekBtn", 1100); await E("bize-ulasin"); await kapatHepsi(p);
    await tik(p, "#gelismisAc", 600); await E("hesap-gelismis");
  }],
  ["kurulum", () => veriKurulum(), async (p, E) => {
    await villa(p, V[2]); await kapatHepsi(p); await E("villa-kurulum");
    await tik(p, "#villaEkle", 0).catch(() => {});
  }],
  ["bos", () => Object.assign(veri27(), { villalar: [] }), async (p, E) => { await bk(800); await E("villalarim-bos");
    await tik(p, "#villaEkle", 900); await E("villa-ekle");
    await p.fill("#v-ad", "Villa Begonvil Deniz Manzaralı"); await tik(p, "#v-kaydet", 1600);
    for (let i = 1; i <= 7; i++) { await E("sihirbaz-" + i); const ok = await p.evaluate(() => { const b = document.getElementById("shIleri"); if (!b || b.classList.contains("hide")) return false; b.click(); return true; }); await bk(1000); if (!ok) break; }
  }],
  ["yonetici", () => veri29 ? veri29(true) : veri27(), async (p, E) => {
    await sekme(p, "hesapEkran"); await bk(800); await E("hesap-yonetici");
    if (await p.$("#istatistikBtn")) { await tik(p, "#istatistikBtn", 1300); await E("ozet-istatistik"); await kapatHepsi(p); }
    if (await p.$("#yoneticiBtn")) { await tik(p, "#yoneticiBtn", 1300); await E("kullanicilar"); await kapatHepsi(p); }
    if (await p.$("#mfaBtn")) { await tik(p, "#mfaBtn", 1300); await E("iki-adimli"); await kapatHepsi(p); }
  }]
];

async function misafirSayfasi(motor, boyut, E) {
  const VP = { "320": { width: 320, height: 640 }, "se": { width: 375, height: 667 } }[boyut];
  const b = ON[motor] || (ON[motor] = await (motor === "webkit" ? pw.webkit : pw.chromium).launch(motor === "webkit" ? { headless: true } : { executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true }));
  const ctx = await b.newContext({ viewport: VP, deviceScaleFactor: 2, isMobile: true, hasTouch: true, timezoneId: "Europe/Istanbul", locale: "tr-TR" });
  const p = await ctx.newPage(); const hata = []; p.on("pageerror", x => hata.push(x.message));
  await p.route("**/config.js*", r => r.fulfill({ status: 200, contentType: "text/javascript", body: 'window.VILLA_CONFIG={supabaseUrl:"https://sahte.supabase.co",supabaseKey:"pk"};' }));
  const fiyat = {}; for (let d = 17; d <= 31; d++) fiyat["2026-11-" + String(d).padStart(2, "0")] = 8000;
  await p.route("https://sahte.supabase.co/**", r => r.fulfill({ status: 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ ad: "Villa Mimoza Deniz Manzaralı", bilgi: { konum: "Kalkan, Antalya", whatsapp: "905320000000", kapasite: "6", oda: "3", banyo: "2", aciklama: "Denize 300 metre, bahçeli, havuzlu taş ev. Sessiz bir koyun kenarında, gün batımı manzaralı.", kurallar: "Sigara içilmez. Evcil hayvan kabul edilmez.", ozellikler: ["havuz", "wifi", "klima", "otopark"], depozito: 5000, belgeNo: "07-1234" },
      fotolar: [], fiyat, dolu: [["2026-11-20", "2026-11-23"]], yarim: [] }) }));
  await p.goto("http://localhost:" + (process.env.QA_PORT || 5077) + "/g.html?v=test", { waitUntil: "networkidle" }); await bk(700);
  await p.evaluate(() => { document.documentElement.style.fontSize = "20px"; document.querySelectorAll(".belirBekle").forEach(x => x.classList.remove("belirBekle")); }); await bk(300);
  await E(p, "misafir-sayfasi", hata); await ctx.close();
}

(async () => {
  const SONUC = { kontrol: 0, sorun: [], hata: [], ekranlar: {} }; const bas = Date.now();
  for (const motor of MOTORLAR) for (const boyut of BOYUTLAR) for (const yazi of YAZILAR) {
    const kosul = motor + " " + boyut + " " + yazi;
    const kaydet = async (p, ad) => {
      if (SUZ && !SUZ.test(ad)) return;
      const anahtar = kosul + " | " + ad; if (anahtar in SONUC.ekranlar) return; // her ekran bir kez
      await bk(150); const l = await p.evaluate(TARA_EK).catch(e => [{ t: "TARAMA HATASI " + e.message, kirik: true }]);
      SONUC.kontrol++; SONUC.ekranlar[anahtar] = l.length;
      for (const x of l) SONUC.sorun.push(Object.assign({ kosul, ekran: ad }, x));
      if (GORSEL && motor === "chromium" && boyut === "320" && yazi === "cokbuyuk")
        await p.screenshot({ path: GORSEL + "/" + ad + ".jpg", type: "jpeg", quality: 72, fullPage: true }).catch(() => {});
    };
    for (const [g, veri, adim] of GRUPLAR) {
      let A;
      try {
        A = await ac(Object.assign(veri(), { boyut, motor, ls: { "vt-yazi": yazi }, saat: "2026-11-21T12:00:00+03:00" })); await bk(900);
        await adim(A.p, ad => kaydet(A.p, ad));
      } catch (e) { SONUC.hata.push(kosul + " " + g + ": " + e.message.split("\n")[0]); }
      if (A) { if (A.S.hata.length) SONUC.hata.push(kosul + " " + g + " sayfa hatası: " + A.S.hata.join(" | ").slice(0, 300)); await A.b.close(); }
    }
    try { await misafirSayfasi(motor, boyut, async (p, ad, h) => { await kaydet(p, ad); if (h.length) SONUC.hata.push(kosul + " misafir sayfa hatası: " + h.join(" | ")); }); }
    catch (e) { SONUC.hata.push(kosul + " misafir: " + e.message.split("\n")[0]); }
    console.log(kosul + ": " + SONUC.sorun.filter(x => x.kosul === kosul).length + " sorun (" + Math.round((Date.now() - bas) / 1000) + " sn)");
  }
  for (const b of Object.values(ON)) await b.close();
  const kd = SONUC.sorun.filter(x => x.kirik || x.dar), ts = SONUC.sorun.filter(x => x.tasma);
  SONUC.ozet = { ekran: SONUC.kontrol, kirik: SONUC.sorun.filter(x => x.kirik).length, dar: SONUC.sorun.filter(x => x.dar).length, tasma: ts.length, hata: SONUC.hata.length,
    yalnizSonSatirKisa: SONUC.sorun.filter(x => x.darHam).length };
  fs.writeFileSync(process.env.CIKTI || require("os").tmpdir() + "/okunabilirlik-sonuc.json", JSON.stringify(SONUC, null, 1));
  console.log(JSON.stringify(SONUC.ozet));
  // benzersiz sorunlar (ekran + yazı)
  const t = {}; for (const x of SONUC.sorun) { const k = x.ekran + " | " + (x.kirik ? "K" : "") + (x.dar ? "D" : "") + (x.tasma ? "T" : "") + (x.darHam ? "s" : "") + " | " + x.t + " | " + x.yer; t[k] = (t[k] || 0) + 1; }
  console.log(Object.keys(t).sort().map(k => k + "  ×" + t[k]).join("\n"));
  if (SONUC.hata.length) console.log("HATALAR:\n" + SONUC.hata.join("\n"));
  process.exit(kd.length || ts.length || SONUC.hata.length ? 1 : 0);
})();
