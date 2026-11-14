// konum-coz: Google veya Apple Haritalar bağlantısını (kısa linkler dahil) ya da düz koordinatı
// koordinata çevirir ve her durumda bir GOOGLE Haritalar bağlantısı döndürür.
// Girişli kullanıcı çağırır (verify_jwt açık). API anahtarı gerekmez.
// Dönüş: { lat, lng, ad, google, kaynak: "google" | "apple" | "koordinat" }
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const GOOGLE = /^(https?:\/\/)?((www\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i;
const APPLE = /^(https?:\/\/)?(maps\.apple\.com|maps\.apple\/|collections\.apple\.com|apple\.co\/)/i;

function gecerli(lat: number, lng: number) {
  return isFinite(lat) && isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0);
}
function koordinatBul(s: string): { lat: number; lng: number } | null {
  const desen = [
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,                                   // Google yer işareti (en doğru)
    /[?&](?:coordinate|ll|sll|q|query|center|daddr|destination)=(-?\d+\.\d+)(?:,|%2C)\s*(-?\d+\.\d+)/i, // Apple + Google parametreleri
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,                                        // Google harita merkezi
    /"latitude"\s*:\s*(-?\d+\.\d+)\s*,\s*"longitude"\s*:\s*(-?\d+\.\d+)/i,  // sayfa içi veri
    /place:location:latitude"\s+content="(-?\d+\.\d+)"[\s\S]{0,200}?place:location:longitude"\s+content="(-?\d+\.\d+)"/i,
  ];
  for (const d of desen) {
    const m = s.match(d);
    if (m) {
      const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
      if (gecerli(lat, lng)) return { lat, lng };
    }
  }
  return null;
}
function yerAdi(s: string): string {
  try {
    const g = s.match(/\/maps\/place\/([^/@?]+)/);
    if (g) return decodeURIComponent(g[1].replace(/\+/g, " ")).slice(0, 120);
    const u = new URL(s);
    const a = u.searchParams.get("name") || u.searchParams.get("q") || u.searchParams.get("address") || "";
    if (a && !/^-?\d+\.\d+\s*,/.test(a)) return a.slice(0, 120);
  } catch { /* yok say */ }
  return "";
}
const googleLink = (lat: number, lng: number) =>
  "https://www.google.com/maps/search/?api=1&query=" + lat.toFixed(6) + "," + lng.toFixed(6);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const yanit = (o: unknown, kod = 200) =>
    new Response(JSON.stringify(o), { status: kod, headers: { ...CORS, "Content-Type": "application/json" } });
  const tamam = (k: { lat: number; lng: number }, ad: string, kaynak: string) =>
    yanit({ lat: k.lat, lng: k.lng, ad, google: googleLink(k.lat, k.lng), kaynak });
  try {
    const { link } = await req.json();
    let url = String(link || "").trim();
    if (!url) return yanit({ hata: "Bağlantı boş." }, 400);
    const duz = url.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
    if (duz) {
      const k = { lat: parseFloat(duz[1]), lng: parseFloat(duz[2]) };
      if (gecerli(k.lat, k.lng)) return tamam(k, "", "koordinat");
    }
    const kaynak = GOOGLE.test(url) ? "google" : APPLE.test(url) ? "apple" : "";
    if (!kaynak) return yanit({ hata: "Lütfen Google Haritalar veya Apple Haritalar bağlantısı yapıştırın." }, 400);
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    let simdiki = url;
    for (let i = 0; i < 6; i++) {
      const k = koordinatBul(simdiki);
      if (k) return tamam(k, yerAdi(simdiki), kaynak);
      const r = await fetch(simdiki, {
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 VillaTakvim" },
      });
      const sonraki = r.headers.get("location");
      if (sonraki) { simdiki = new URL(sonraki, simdiki).toString(); continue; }
      const govde = (await r.text()).slice(0, 300000);
      const k2 = koordinatBul(govde);
      if (k2) return tamam(k2, yerAdi(simdiki), kaynak);
      break;
    }
    return yanit({ hata: "Bu bağlantıdan konum okunamadı. Haritada evin üstüne basılı tutup çıkan koordinatı (örn. 36.31, 29.42) yapıştırabilirsiniz." }, 422);
  } catch (_e) {
    return yanit({ hata: "Konum çözülemedi, tekrar deneyin." }, 500);
  }
});
