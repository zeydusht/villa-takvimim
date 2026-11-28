// Görev 48.1 kare ölçümü (webkit). Her karede: rAF zaman damgası → aynı karenin çizimi bittikten sonra gelen mesaj = ana iş (ms).
// 4x tahmini = 4 × iş. Kullanım: node kare.js <adres> <demo.json> <cikti.json> [tekrar]
const { webkit, chromium } = require("playwright-core");
const fs = require("fs");
const [ADRES, DEMO, CIKTI, TEKRAR = "3", MOTOR = "webkit", DPR = "3"] = process.argv.slice(2);
const villalar = JSON.parse(fs.readFileSync(DEMO, "utf8")).villalar;
const bekle = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = MOTOR === "webkit" ? await webkit.launch() : await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const sonuc = {};
  for (let t = 0; t < +TEKRAR; t++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: +DPR, hasTouch: true });
    await ctx.addInitScript(v => {
      if (!sessionStorage.getItem("kuruldu")) {
        sessionStorage.setItem("kuruldu", "1");
        localStorage.setItem("vt-tur", "1");
      }
      window.__K = { f: [], acik: false, nesil: 0,
        basla() { this.f = []; this.acik = true; const k = this, n = ++this.nesil;
          const d = t => { if (!k.acik || k.nesil !== n) return; k.f.push({ t: t, is: 0 }); requestAnimationFrame(d); };
          requestAnimationFrame(d); },
        bitir() { this.acik = false; const f = this.f; return f.map((x, i) => ({ is: +x.is.toFixed(2), ara: i ? +(x.t - f[i - 1].t).toFixed(2) : null })); } };
    }, villalar);
    const p = await ctx.newPage();
    if (MOTOR !== "webkit") { const c = await ctx.newCDPSession(p); await c.send("Emulation.setCPUThrottlingRate", { rate: 4 }); }
    const hata = []; p.on("pageerror", e => hata.push(e.message));
    await p.goto(ADRES, { waitUntil: "load" }); await bekle(1500);
    await p.setInputFiles("#dosya", DEMO); await p.waitForSelector("#villalar button.kart"); await bekle(1500);
    const olc = async (ad, is, sure) => {
      await p.evaluate(() => __K.basla()); await bekle(30);
      await is(); await bekle(sure);
      const f = await p.evaluate(() => __K.bitir());
      (sonuc[ad] = sonuc[ad] || []).push(...f);
    };
    // villa sayfası
    await p.click("#villalar button.kart >> nth=0"); await p.waitForSelector('#grid .cell[data-k="2026-11-27"]'); await bekle(900);
    const gun = '#grid .cell[data-k="2026-11-27"]';
    await olc("Pencere açılması (rezervasyon detayı)", () => p.click(gun), 800);
    await olc("Pencere kapanması (Kapat)", () => p.click(".overlay:not(.kapaniyor) .sheet .x"), 600);
    await bekle(300); await p.click(gun); await bekle(900);
    await olc("Pencereyi aşağı çekip kapatma (41.5)", () => p.evaluate(async () => {
      const sh = document.querySelector(".overlay:not(.kapaniyor) > .sheet"), r = sh.getBoundingClientRect();
      const x = 195, y0 = r.top + 40;
      const ev = (tur, y) => { const e = new Event(tur, { bubbles: true, cancelable: true });
        const t = [{ clientX: x, clientY: y, pageX: x, pageY: y, identifier: 1, target: sh }];
        Object.defineProperty(e, "touches", { value: tur === "touchend" ? [] : t }); Object.defineProperty(e, "changedTouches", { value: t });
        Object.defineProperty(e, "targetTouches", { value: tur === "touchend" ? [] : t }); sh.dispatchEvent(e); };
      ev("touchstart", y0);
      for (let i = 1; i <= 14; i++) { await new Promise(r => requestAnimationFrame(r)); ev("touchmove", y0 + i * 24); }
      ev("touchend", y0 + 14 * 24);
    }), 700);
    await bekle(400);
    // rehber (uygulama turu)
    await p.evaluate(() => document.getElementById("turTekrarBtn").click()); await bekle(200);
    await olc("Rehberin açılması", async () => {}, 1300);
    await olc("Rehberde adım geçişi (İleri)", () => p.click(".rhIleri:visible"), 900);
    await olc("Rehberin kapanması", () => p.click(".rhKapatBtn:visible, .rhKapat:visible"), 600);
    if (hata.length) console.log("sayfa hatası:", hata.join(" | "));
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(CIKTI, JSON.stringify(sonuc));
  for (const [ad, f] of Object.entries(sonuc)) {
    const a = f.filter(x => x.ara).map(x => x.ara).sort((x, y) => x - y), n = a.length;
    const ok = a.filter(x => x <= 18.4).length / n * 100, ort = a.reduce((x, y) => x + y, 0) / n;
    console.log([ad, n + " kare", "ort " + ort.toFixed(1), "en kötü " + a[n - 1].toFixed(0), "≤16,7 %" + ok.toFixed(1), ">33 ms: " + a.filter(x => x > 34).length].join(" | "));
  }
})();
