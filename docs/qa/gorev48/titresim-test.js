// Görev 48.2 / 48.4 — titreşim testi (webkit). Sahte Capacitor (iOS) + sahte Haptics: hangi olayda hangi titreşim çağrıldı.
// Kullanım: node titresim-test.js <adres> <demo.json>
const { webkit } = require("playwright-core");
const [ADRES, DEMO] = process.argv.slice(2);
const bekle = ms => new Promise(r => setTimeout(r, ms));
let hata = 0;
const kontrol = (ad, ok, ek) => { if (!ok) hata++; console.log((ok ? "✓ " : "✗ ") + ad + (ek ? "  (" + ek + ")" : "")); };

async function sayfa(b, sec) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await ctx.addInitScript(sec => {
    if (!sessionStorage.getItem("kuruldu")) {
      sessionStorage.setItem("kuruldu", "1");
      localStorage.setItem("vt-tur", "1"); localStorage.setItem("vt-yazi-soruldu", "1");
      localStorage.setItem("vt-yardim", JSON.stringify({ acik: false, s: 22 }));   // rehberler testi bölmesin
      if (sec.kapali) localStorage.setItem("villa-takvim-titresim", "kapali");
    }
    window.__T = [];
    if (sec.site) return;
    const kayit = ad => o => { window.__T.push({ t: performance.now(), ne: ad + (o && (o.style || o.type) ? " " + (o.style || o.type) : "") }); return Promise.resolve(); };
    window.Capacitor = { isNativePlatform: () => true, getPlatform: () => "ios",
      Plugins: { Haptics: { impact: kayit("impact"), notification: kayit("notification"), selectionStart: () => Promise.resolve(),
        selectionChanged: kayit("selection"), selectionEnd: () => Promise.resolve() } } };
  }, sec || {});
  const p = await ctx.newPage();
  p.hatalar = []; p.on("pageerror", e => p.hatalar.push(e.message));
  await p.goto(ADRES); await bekle(1200);
  await p.setInputFiles("#dosya", DEMO); await p.waitForSelector("#villalar button.kart"); await bekle(600);
  return p;
}
// titreşim kaydını al ve sıfırla
const al = async p => { await bekle(60); return p.evaluate(() => { const l = window.__T.map(x => x.ne); window.__T = []; return l; }); };
// sahte dokunuş: seçici, hareket (px), adım sayısı
const dokun = (p, sec, ops) => p.evaluate(async ([sec, o]) => {
  const el = typeof sec === "string" ? document.querySelector(sec) : null; if (!el) return "yok:" + sec;
  const r = el.getBoundingClientRect(), x = o.x != null ? o.x : r.left + r.width / 2, y = o.y != null ? o.y : r.top + Math.min(r.height / 2, 30);
  const ev = (tur, dx, dy) => { const e = new Event(tur, { bubbles: true, cancelable: true });
    const t = [{ clientX: x + dx, clientY: y + dy, pageX: x + dx, pageY: y + dy, identifier: 1, target: el }];
    Object.defineProperty(e, "touches", { value: tur === "touchend" ? [] : t }); Object.defineProperty(e, "changedTouches", { value: t });
    Object.defineProperty(e, "targetTouches", { value: tur === "touchend" ? [] : t }); el.dispatchEvent(e); };
  ev("touchstart", 0, 0);
  const n = o.adim || 0;
  for (let i = 1; i <= n; i++) { await new Promise(r => requestAnimationFrame(r)); ev("touchmove", (o.dx || 0) * i / n, (o.dy || 0) * i / n); }
  if (!o.birakma) ev("touchend", o.dx || 0, o.dy || 0);
  return "ok";
}, [sec, ops || {}]);

(async () => {
  const b = await webkit.launch();
  let p = await sayfa(b);
  kontrol("uygulama sınıfı (html.native) var", await p.evaluate(() => document.documentElement.classList.contains("native")));
  await al(p);

  // alt sekme: impact LIGHT
  await p.evaluate(() => document.querySelector('#sekmeler [data-sekme="ajanda"]').click());
  let l = await al(p); kontrol("alt sekme değişimi → impact LIGHT", l.length === 1 && l[0] === "impact LIGHT", l.join(", "));
  // segment (Takvim / Misafirler): selection
  await bekle(150);
  await p.evaluate(() => { const b = document.querySelector('#ajUst [data-u="misafir"]'); if (b) b.click(); });
  l = await al(p); kontrol("segment → selection", l.length === 1 && l[0] === "selection", l.join(", "));
  await p.evaluate(() => document.querySelector('#sekmeler [data-sekme="ana"]').click()); await bekle(500); await al(p);

  // ana düğme: parmak BASINCA (touchstart) impact LIGHT
  await dokun(p, "#ana button.hap.ana", { birakma: true });
  l = await al(p); kontrol("ana düğmeye basınca (touchstart) → impact LIGHT", l.length === 1 && l[0] === "impact LIGHT", l.join(", "));
  await dokun(p, "#ana button.hap.ana", { adim: 0 }); await al(p);   // parmağı kaldır
  await bekle(120);
  // 80 ms kuralı: art arda iki basış (aynı titreşim) → bir kez
  await p.evaluate(() => { window.__T = []; });
  await dokun(p, "#ana button.hap.ana", {}); await dokun(p, "#ana button.hap.ana", {});
  l = await al(p); kontrol("80 ms içinde iki basış → tek titreşim", l.length === 1, l.join(", "));
  await bekle(120);
  await dokun(p, "#ana button.hap.ana", {});
  l = await al(p); kontrol("80 ms sonra yeni basış → yine titreşir", l.length === 1, l.join(", "));
  await bekle(120);

  // kaydırma: kartta parmak 30 px kayarsa titreşim yok
  await dokun(p, "#villalar button.kart", { dy: -30, adim: 4 });
  l = await al(p); kontrol("kaydırırken (30 px) titreşim yok", l.length === 0, l.join(", "));
  // kayan sayfayı durduran dokunuş: titreşim yok
  await p.evaluate(() => document.dispatchEvent(new Event("scroll")));
  await dokun(p, "#ana button.hap.ana", {});
  l = await al(p); kontrol("sayfa kayarken dokunuş → titreşim yok", l.length === 0, l.join(", "));
  await bekle(200);

  // karta dokunup yeni ekran: impact LIGHT (parmak kalkınca)
  await dokun(p, "#villalar button.kart", {});
  l = await al(p); kontrol("karta dokununca → impact LIGHT", l.length === 1 && l[0] === "impact LIGHT", l.join(", "));
  await p.click("#villalar button.kart >> nth=0"); await p.waitForSelector("#grid .cell"); await bekle(700); await al(p);

  // pencere açılınca: impact LIGHT
  await p.evaluate(() => { const c = document.querySelector('#grid .cell[data-k="2026-11-27"]'); c.click(); });
  await bekle(500); l = await al(p);
  kontrol("alttan pencere açılınca → impact LIGHT", l.length === 1 && l[0] === "impact LIGHT", l.join(", "));
  // aşağı çekip kapatma eşiği: impact MEDIUM, bir kez
  await bekle(300);
  await dokun(p, ".overlay:not(.kapaniyor) > .sheet", { dy: 500, adim: 20, birakma: true });
  l = await al(p); kontrol("pencere çekme eşiği geçilince → impact MEDIUM, bir kez", l.filter(x => x === "impact MEDIUM").length === 1, l.join(", "));
  await dokun(p, ".overlay:not(.kapaniyor) > .sheet", { adim: 0 }); await bekle(700);
  await p.evaluate(() => { const x = document.querySelector(".overlay:not(.kapaniyor) .sheet .x"); if (x) x.click(); });
  await p.waitForFunction(() => !document.querySelector(".overlay")); await bekle(300); await al(p);

  // kenardan kaydırarak geri: eşik (ekranın %35'i) geçilince impact LIGHT, bir kez
  await bekle(150);
  await dokun(p, "#takvim", { x: 6, y: 400, dx: 260, adim: 16 });
  l = await al(p); kontrol("kenardan geri eşiği → impact LIGHT, bir kez", l.filter(x => x === "impact LIGHT").length === 1, l.join(", "));
  kontrol("sayfa hatası yok", !p.hatalar.length, p.hatalar.join(" | "));
  await p.context().close();

  // Hesap → Titreşim kapalı: hiç titreşim yok
  p = await sayfa(b, { kapali: true }); await al(p);
  await p.evaluate(() => document.querySelector('#sekmeler [data-sekme="ajanda"]').click());
  await p.evaluate(() => document.querySelector('#sekmeler [data-sekme="ana"]').click()); await bekle(300);
  await dokun(p, "#ana button.hap.ana", {});
  l = await al(p); kontrol("titreşim ayarı kapalıyken hiç titreşim yok", l.length === 0, l.join(", "));
  await p.context().close();

  // sitede (uygulama değil): hiçbir şey olmaz, hata yok
  p = await sayfa(b, { site: true });
  await p.evaluate(() => document.querySelector('#sekmeler [data-sekme="ajanda"]').click());
  await dokun(p, "#sekmeler", {});
  kontrol("sitede html.native yok, hata yok", !(await p.evaluate(() => document.documentElement.classList.contains("native"))) && !p.hatalar.length, p.hatalar.join(" | "));
  await p.context().close();

  await b.close();
  console.log(hata ? hata + " kontrol geçmedi" : "hepsi geçti");
  process.exit(hata ? 1 : 0);
})();
