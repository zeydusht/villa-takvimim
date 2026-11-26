const { chromium } = require("playwright-core");
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHR }); const p = await b.newPage();
  const hata = []; p.on("pageerror", e => hata.push(e.message));
  await p.goto(process.argv[2] + "/", { waitUntil: "load" });
  const sonuc = await p.evaluate(async () => {
    const k = await navigator.serviceWorker.register("/sw.js"); await navigator.serviceWorker.ready;
    return { kapsam: k.scope, aktif: !!k.active, betik: k.active && k.active.scriptURL };
  });
  console.log("servis calisani:", JSON.stringify(sonuc), "sayfa hatasi:", hata.length);
  const g = await b.newPage(); await g.goto(process.argv[2] + "/villa-salta-k7m2?teklif=ABCD1234", { waitUntil: "load" });
  console.log("misafir sayfasi adresi:", g.url(), "| metin:", (await g.textContent("body")).trim().slice(0, 60).replace(/\s+/g, " "));
  await b.close();
})();
