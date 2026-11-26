// Görev 45.1: Netlify kuralının mantık testi (netlify.toml → from="/*" to="/g.html" status=200, force yok).
// Netlify bu kuralı yalnız dosya YOKSA uygular (shadowing). Bu betik aynı mantıkla her adresin hangi dosyayı alacağını yazar.
// Çalıştırma: node docs/qa/gorev45/netlify-kural.js
const fs = require("fs"), path = require("path");
const kok = path.join(__dirname, "../../..");
const toml = fs.readFileSync(path.join(kok, "netlify.toml"), "utf8");
const kural = { from: (toml.match(/from\s*=\s*"([^"]+)"/) || [])[1], to: (toml.match(/to\s*=\s*"([^"]+)"/) || [])[1],
                status: +(toml.match(/status\s*=\s*(\d+)/) || [])[1], force: /force\s*=\s*true/.test(toml) };
if (kural.from !== "/*" || kural.to !== "/g.html" || kural.status !== 200 || kural.force) { console.error("netlify.toml kuralı beklenen gibi değil", kural); process.exit(1); }
if (fs.existsSync(path.join(kok, "www/_redirects")) && /\/\*\s+\/g\.html/.test(fs.readFileSync(path.join(kok, "www/_redirects"), "utf8"))) {
  console.error("www/_redirects içinde hâlâ /* → g.html var: Cloudflare'da her adresi g.html'e çevirir"); process.exit(1); }
const yollar = ["/", "/index.html", "/config.js", "/veri.js", "/img/3d/baslik-takvim-512.webp", "/manifest.json", "/sw.js",
  "/villa-salta-k7m2", "/villa-salta-k7m2?teklif=ABCD1234", "/g.html?v=villa-salta-k7m2", "/gizlilik.html", "/yok/derin/yol"];
let hata = 0;
for (const y of yollar) {
  const p = y.split("?")[0]; let dosya = p === "/" ? "/index.html" : p;
  const var_ = fs.existsSync(path.join(kok, "www", dosya)) && fs.statSync(path.join(kok, "www", dosya)).isFile();
  const gelen = var_ ? dosya : kural.to;
  const bekle = /^\/(villa-|yok\/)/.test(p) ? "/g.html" : dosya;
  if (gelen !== bekle) hata++;
  console.log(`${y.padEnd(36)} → 200 → ${gelen}${gelen === bekle ? "" : "   ✗ beklenen " + bekle}`);
}
console.log(hata ? hata + " hata" : "Netlify kuralı: tamam");
process.exit(hata ? 1 : 0);
