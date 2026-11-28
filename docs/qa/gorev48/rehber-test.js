// Görev 48.3 / 48.4 — rehber akış testi (webkit). Veritabanı yok: veri "Geri yükle" ile (docs/appstore/demo-yedek.json).
// Kullanım: node rehber-test.js <adres> <demo.json> <ekran klasörü>
const { webkit } = require("playwright-core");
const [ADRES, DEMO, KLAS] = process.argv.slice(2);
const bekle = ms => new Promise(r => setTimeout(r, ms));
let hata = 0;
const kontrol = (ad, ok, ek) => { if (!ok) hata++; console.log((ok ? "✓ " : "✗ ") + ad + (ek ? "  (" + ek + ")" : "")); };

async function sayfa(b, gen, yazi) {
  const ctx = await b.newContext({ viewport: { width: gen, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  await ctx.addInitScript(y => {
    if (sessionStorage.getItem("kuruldu")) return;
    sessionStorage.setItem("kuruldu", "1");
    localStorage.setItem("vt-tur", "1");            // otomatik tanıtım testte elle açılır
    localStorage.setItem("vt-yazi-soruldu", "1");
    if (y) localStorage.setItem("vt-yazi", y);
  }, yazi || "");
  const p = await ctx.newPage();
  p.hatalar = []; p.on("pageerror", e => p.hatalar.push(e.message));
  await p.goto(ADRES); await bekle(1200);
  await p.setInputFiles("#dosya", DEMO); await p.waitForSelector("#villalar button.kart"); await bekle(600);
  return p;
}
// bugünden sonraki ilk boş gün ve 2 gün sonrası (gerekirse sonraki ay)
async function bosGunler(p) {
  for (let i = 0; i < 3; i++) {
    const l = await p.evaluate(() => { const d = new Date(), bug = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      const c = [...document.querySelectorAll("#grid .cell:not([disabled])")].filter(x => x.dataset.k > bug && !x.querySelector(".bar, .rz") && !/dolu|giris|cikis/.test(x.className));
      return c.map(x => x.dataset.k); });
    for (let j = 0; j + 2 < l.length; j++) if (new Date(l[j + 2]) - new Date(l[j]) === 2 * 864e5) return [l[j], l[j + 2]];
    await p.click("#next"); await bekle(500);
  }
  return null;
}
const balon = p => p.evaluate(() => {
  const b = document.querySelector(".rh:not(.kapaniyor) .rhBalon");
  if (!b) return null;
  const gor = el => !!el && el.offsetParent !== null && getComputedStyle(el).display !== "none";
  const m = b.querySelector(".rhMetin"), lh = parseFloat(getComputedStyle(m).lineHeight);
  const k = b.querySelector(".rhKapat"), i = b.querySelector(".rhIleri"), ok = b.querySelector(".rhOk");
  const kr = k.getBoundingClientRect(), ir = i.getBoundingClientRect();
  return { metin: m.textContent, satir: Math.round(m.offsetHeight / lh), kapat: gor(k), ileri: gor(i) ? i.textContent : "",
    ayniBoy: gor(i) ? Math.abs(kr.height - ir.height) < 2 && Math.abs(kr.width - ir.width) < 2 : null,
    ok: gor(ok) && !document.querySelector(".rh").classList.contains("okYok"), okRenk: ok.querySelector("path").getAttribute("fill"),
    sayac: b.querySelectorAll(".rhSay span").length };
});

(async () => {
  const b = await webkit.launch();
  // ---------- 1) Tanıtım: 4 adım, yalnız gösterir, her adımda iki düğme ----------
  let p = await sayfa(b, 390);
  await p.evaluate(() => document.getElementById("turTekrarBtn").click()); await bekle(1500);
  const adimlar = [];
  for (let i = 0; i < 6; i++) {
    const x = await balon(p); if (!x) break;
    adimlar.push(x);
    if (i === 0) await p.screenshot({ path: KLAS + "/483-tanitim-1-390.png" });
    if (i === 1) await p.screenshot({ path: KLAS + "/483-tanitim-2-ok-390.png" });
    await p.click(".rh:not(.kapaniyor) .rhIleri"); await bekle(900);
  }
  kontrol("tanıtım en fazla 4 adım", adimlar.length >= 3 && adimlar.length <= 4, adimlar.length + " adım: " + adimlar.map(a => a.metin).join(" | "));
  kontrol("tanıtımda her adımda 'Rehberi kapat' ve 'İleri/Bitir'", adimlar.every(a => a.kapat && /İleri|Bitir/.test(a.ileri)));
  kontrol("iki düğme aynı büyüklükte", adimlar.every(a => a.ayniBoy));
  kontrol("hedefli adımda ok var, lime renk (kırmızı değil)", adimlar.filter(a => a.ok).length >= 2 && adimlar.every(a => a.okRenk === "#9FE870"));
  kontrol("tanıtımda tarih seçtiren / yazı bekleyen adım yok", !adimlar.some(a => /dokunun\.$/.test(a.metin) && /güne/.test(a.metin)));
  kontrol("tanıtım bitince başka rehber başlamıyor", !(await balon(p)));
  kontrol("sayfa hatası yok", !p.hatalar.length, p.hatalar.join(" | "));
  await p.context().close();

  // ---------- 2) Rezervasyon rehberi: yazı adımı "Bu adımı geç", engellemiyor; ipucu ikinci girişte yok ----------
  p = await sayfa(b, 390);
  await p.click("#villalar button.kart >> nth=1"); await p.waitForSelector("#grid .cell"); await bekle(700);
  const bos = await bosGunler(p);
  const rezAc = async () => {
    await p.click('#grid .cell[data-k="' + bos[0] + '"]'); await bekle(400);
    await p.click('#grid .cell[data-k="' + bos[1] + '"]'); await bekle(700);
    const sp = await p.$("#spRez"); if (sp) { await sp.click(); await bekle(1200); }
  };
  await rezAc();
  let x = await balon(p), gecildi = false, yaziAdimi = null;
  for (let i = 0; i < 4 && x; i++) {
    if (/adını yazın/.test(x.metin)) { yaziAdimi = x; break; }
    await p.click(".rh:not(.kapaniyor) .rhIleri:visible").catch(() => {}); await bekle(800); x = await balon(p);
  }
  kontrol("rezervasyon rehberi açıldı ve yazı adımına gelindi", !!yaziAdimi, x && x.metin);
  if (yaziAdimi) {
    kontrol("yazı adımında 'Bu adımı geç' ve 'Rehberi kapat'", yaziAdimi.ileri === "Bu adımı geç" && yaziAdimi.kapat);
    await p.screenshot({ path: KLAS + "/483-yazi-adimi-390.png" });
    // yazı adımı başka yere dokunmayı engellemiyor: telefon alanına odaklanılabiliyor
    const odak = await p.evaluate(() => { const t = document.querySelector("#f-phone"); if (!t) return null; t.focus(); return document.activeElement === t; });
    kontrol("yazı adımı başka alana dokunmayı engellemiyor", odak === true);
    await p.click(".rh:not(.kapaniyor) .rhIleri"); await bekle(800);
    const y = await balon(p); gecildi = !!y && !/adını yazın/.test(y.metin);
    kontrol("'Bu adımı geç' sonraki adıma geçiyor", gecildi, y && y.metin);
  }
  await p.click(".rh:not(.kapaniyor) .rhKapat"); await bekle(500);
  await p.evaluate(() => { const x = document.querySelector(".overlay:not(.kapaniyor) .sheet .x"); if (x) x.click(); }); await bekle(700);
  await p.evaluate(() => document.querySelector("#secPanel") && (window.scrollTo(0, 0)));
  // aynı ipucu ikinci girişte çıkmıyor
  await p.evaluate(() => { const t = document.querySelector("#secPanel .temizle, #secPanel [data-temizle]"); if (t) t.click(); });
  await rezAc();
  kontrol("aynı ipucu ikinci girişte çıkmıyor", !(await balon(p)), JSON.stringify(await p.evaluate(() => Rehber.ipucuDurum())));
  kontrol("sayfa hatası yok", !p.hatalar.length, p.hatalar.join(" | "));
  await p.context().close();

  // ---------- 3) İki kez "Rehberi kapat" → otomatik ipucu yok; Yardım → Tanıtım yine açılıyor ----------
  p = await sayfa(b, 390);
  await p.evaluate(() => document.getElementById("turTekrarBtn").click()); await bekle(1400);
  await p.click(".rh:not(.kapaniyor) .rhKapat"); await bekle(500);
  await p.evaluate(() => document.getElementById("turTekrarBtn").click()); await bekle(1400);
  await p.click(".rh:not(.kapaniyor) .rhKapat"); await bekle(500);
  const d = await p.evaluate(() => Rehber.ipucuDurum());
  kontrol("iki kapatmadan sonra otomatik ipuçları kapalı", d.sus === true && !(await p.evaluate(() => Rehber.otomatik())), JSON.stringify(d));
  await p.click("#villalar button.kart >> nth=2").catch(() => {});
  await p.evaluate(() => { document.querySelector('#sekmeler [data-sekme="ana"]').click(); }); await bekle(500);
  await p.click("#villalar button.kart >> nth=2"); await p.waitForSelector("#grid .cell"); await bekle(700);
  const bos2 = await bosGunler(p);
  await p.click('#grid .cell[data-k="' + bos2[0] + '"]'); await bekle(400); await p.click('#grid .cell[data-k="' + bos2[1] + '"]'); await bekle(600);
  const sp = await p.$("#spRez"); if (sp) { await sp.click(); await bekle(1200); }
  kontrol("susunca rezervasyon formunda otomatik rehber çıkmıyor", !(await balon(p)));
  const soru = await p.$(".overlay:not(.kapaniyor) .rhSoru");
  kontrol("'Nasıl?' düğmesi duruyor", !!soru);
  if (soru) { await soru.click(); await bekle(1200); kontrol("'Nasıl?' ile rehber yine açılıyor", !!(await balon(p))); }
  kontrol("sayfa hatası yok", !p.hatalar.length, p.hatalar.join(" | "));
  await p.context().close();

  // ---------- 4) Metin uzunluğu ve görüntü: 320 + Çok büyük ----------
  p = await sayfa(b, 320, "cokbuyuk");
  await p.evaluate(() => document.getElementById("turTekrarBtn").click()); await bekle(1500);
  let enCok = 0, n = 0;
  for (let i = 0; i < 5; i++) {
    const y = await balon(p); if (!y) break; n++;
    enCok = Math.max(enCok, y.satir);
    if (i === 1) await p.screenshot({ path: KLAS + "/483-tanitim-2-ok-320-cokbuyuk.png" });
    await p.click(".rh:not(.kapaniyor) .rhIleri"); await bekle(900);
  }
  kontrol("320 + Çok büyük: tanıtım metinleri en fazla 4 satır", enCok > 0 && enCok <= 4, "en çok " + enCok + " satır, " + n + " adım");
  kontrol("sayfa hatası yok", !p.hatalar.length, p.hatalar.join(" | "));
  await p.context().close();

  await b.close();
  console.log(hata ? hata + " kontrol geçmedi" : "hepsi geçti");
  process.exit(hata ? 1 : 0);
})();
