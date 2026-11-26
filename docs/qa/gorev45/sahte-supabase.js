// Görev 45.6 testi: sahte Supabase (yalnız herkese açık galeri JSON'u). Gerçek veritabanına dokunulmaz.
// Çalıştırma: node docs/qa/gorev45/sahte-supabase.js  (port 8790)
const http = require("http");
const VILLALAR = {
  "villa-salta-k7m2": { ad: "Villa Salta", bilgi: { konum: "Kalkan" }, fotolar: ["https://ornek.test/galeri/v1/f/kapak.jpg", "https://ornek.test/galeri/v1/f/2.jpg"] },
  "villa-kacis-x1y2z3": { ad: 'Villa "Mavi" <script>alert(1)</script> & Ev\'im', bilgi: { konum: "Kaş & <Kalkan>" }, fotolar: ['https://ornek.test/a.jpg"><script>x</script>', "https://ornek.test/guvenli.jpg"] },
  "villa-fotosuz-a1b2c3": { ad: "Villa Zeytin", bilgi: {}, fotolar: [] },
  "villa-kapakli-a1b2c3": { ad: "Villa Kapak", bilgi: { konum: "Kaş" }, kapak: { url: "https://ornek.test/kucuk-1200.jpg", gen: 1200, yuk: 900 }, fotolar: ["https://ornek.test/buyuk.jpg"] },
};
http.createServer((q, r) => {
  const m = q.url.match(/^\/storage\/v1\/object\/public\/galeri\/([a-z0-9-]+)\.json/);
  const jeton = m && m[1];
  if (jeton === "villa-yavas-a1b2c3") return setTimeout(() => { r.writeHead(200, { "Content-Type": "application/json" }); r.end('{"ad":"Geç"}'); }, 5000);
  if (jeton && VILLALAR[jeton]) { r.writeHead(200, { "Content-Type": "application/json" }); return r.end(JSON.stringify(VILLALAR[jeton])); }
  r.writeHead(404, { "Content-Type": "application/json" }); r.end('{"statusCode":"404","error":"not_found"}');
}).listen(8790, () => console.log("sahte supabase :8790"));
