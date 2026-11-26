const { chromium } = require("playwright-core");
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHR }); const p = await b.newPage();
  for (const posta of ["", "destek@villatakvimim.com"]) {
    await p.route("**/config.js", async r => { const y = await r.fetch(); let t = await y.text();
      t = t.replace(/destekPosta:\s*"[^"]*"/, 'destekPosta: "' + posta + '"'); r.fulfill({ response: y, body: t }); });
    for (const s of ["gizlilik", "kosullar"]) {
      await p.goto(process.env.B + "/" + s + ".html");
      const h = await p.$eval("#destekPosta", e => e.innerHTML);
      console.log(s, "| destekPosta=" + JSON.stringify(posta), "→", h);
    }
    await p.unroute("**/config.js");
  }
  await b.close();
})();
