// Görev 45.2 — npm run alan-adi
// www/config.js'teki siteUrl'i okur; adres yazmak zorunda olan statik dosyalardaki (og:/twitter: meta etiketleri,
// gizlilik/şartlar sayfalarındaki destek e-postası) değerleri bu tek kaynağa göre günceller.
// Kodun geri kalanı (paylaşım linki, giriş e-postası dönüşü, davet) adresi çalışırken config.js'ten okur.
// iCal UID'lerine (rez-…@villatakvim) DOKUNMAZ: Airbnb/Booking'deki kayıt kimlikleridir, değişirse kopya rezervasyon olur.
const fs = require("fs"), path = require("path");
const kok = path.join(__dirname, "..");
const oku = f => fs.readFileSync(path.join(kok, f), "utf8");
const yaz = (f, s) => fs.writeFileSync(path.join(kok, f), s);

const cfg = oku("www/config.js");
const deger = ad => { const m = cfg.match(new RegExp("^[ \\t]*" + ad + ":[ \\t]*\"([^\"]*)\"", "m")); return m ? m[1] : null; };
const site = (deger("siteUrl") || "").replace(/\/+$/, "");
if (!/^https:\/\/[a-z0-9.-]+$/i.test(site)) { console.error("config.js siteUrl okunamadı ya da https://alan.adi biçiminde değil:", site); process.exit(1); }
const posta = deger("destekPosta") || "";

let degisen = 0;
// 1) Meta etiketlerindeki tam adresler (og:url, og:image, twitter:image)
for (const f of ["www/index.html", "www/g.html"]) {
  const eski = oku(f);
  const yeni = eski.replace(/(<meta\s+(?:property|name)="(?:og:url|og:image|og:image:secure_url|twitter:image)"\s+content=")https?:\/\/[^/"]+/g, "$1" + site);
  if (yeni !== eski) { yaz(f, yeni); degisen++; console.log("güncellendi:", f); }
}
// 2) Destek e-postası (Görev 45.3): sayfalar config.js'i okuyamazsa diye statik metin de aynı olsun
for (const f of ["www/gizlilik.html", "www/kosullar.html"]) {
  const eski = oku(f);
  const ic = posta ? '<a href="mailto:' + posta + '">' + posta + "</a>" : "yakında eklenecek";
  const yeni = eski.replace(/(<b id="destekPosta">)[\s\S]*?(<\/b>)/, "$1" + ic + "$2");
  if (yeni !== eski) { yaz(f, yeni); degisen++; console.log("güncellendi:", f); }
}
// 3) Denetim: eski Netlify adresi kodda gömülü kalmasın (config.js ve açıklama satırları hariç)
const kalan = [];
(function tara(d) {
  for (const a of fs.readdirSync(path.join(kok, d), { withFileTypes: true })) {
    const y = d + "/" + a.name;
    if (a.isDirectory()) { if (a.name !== "img") tara(y); continue; }
    if (!/\.(html|js|json|txt|webmanifest)$/.test(a.name) || y === "www/config.js") continue;
    oku(y).split("\n").forEach((s, i) => {
      if (/netlify\.app/.test(s) && s.indexOf(site) < 0 && !/^\s*(\/\/|\*|<!--|#)/.test(s)) kalan.push(y + ":" + (i + 1));
    });
  }
})("www");
console.log("siteUrl:", site, "| destekPosta:", posta || "(boş)", "| değişen dosya:", degisen);
if (kalan.length) { console.error("Gömülü kalmış eski adres:", kalan.join(", ")); process.exit(1); }
console.log("Hatırlatma: www/sw.js SURUM'u artır, npx cap sync çalıştır.");
