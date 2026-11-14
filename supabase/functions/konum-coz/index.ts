// konum-coz: Google Maps bağlantısını (kısa maps.app.goo.gl dahil) koordinata çevirir.
// Girişli kullanıcı çağırır (verify_jwt açık). API anahtarı gerekmez: bağlantı takip edilip adresten okunur.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const IZINLI = /^(https?:\/\/)?((www\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i;

function koordinatBul(s: string): { lat: number; lng: number } | null {
  const desen = [
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,          // yer işareti (en doğru)
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,              // harita merkezi
    /[?&](?:q|query|ll|center|destination)=(-?\d+\.\d+)(?:,|%2C)\s*(-?\d+\.\d+)/i,
  ];
  for (const d of desen) {
    const m = s.match(d);
    if (m) {
      const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
    }
  }
  return null;
}
function yerAdi(s: string): string {
  const m = s.match(/\/maps\/place\/([^/@?]+)/);
  if (!m) return "";
  try { return decodeURIComponent(m[1].replace(/\+/g, " ")).slice(0, 120); } catch { return ""; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const yanit = (o: unknown, kod = 200) =>
    new Response(JSON.stringify(o), { status: kod, headers: { ...CORS, "Content-Type": "application/json" } });
  try {
    const { link } = await req.json();
    let url = String(link || "").trim();
    if (!url) return yanit({ hata: "Bağlantı boş." }, 400);
    // düz koordinat yapıştırıldıysa ("36.26, 29.41")
    const duz = url.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
    if (duz) return yanit({ lat: parseFloat(duz[1]), lng: parseFloat(duz[2]), ad: "" });
    if (!IZINLI.test(url)) return yanit({ hata: "Lütfen Google Haritalar bağlantısı yapıştırın." }, 400);
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    let simdiki = url, metin = url;
    for (let i = 0; i < 5; i++) {           // en fazla 5 yönlendirme
      const k = koordinatBul(simdiki);
      if (k) return yanit({ ...k, ad: yerAdi(simdiki) });
      const r = await fetch(simdiki, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0 VillaTakvim" } });
      const sonraki = r.headers.get("location");
      if (sonraki) { simdiki = new URL(sonraki, simdiki).toString(); metin += " " + simdiki; continue; }
      const govde = (await r.text()).slice(0, 200000);
      const k2 = koordinatBul(govde);
      if (k2) return yanit({ ...k2, ad: yerAdi(simdiki) });
      break;
    }
    return yanit({ hata: "Bu bağlantıdan konum okunamadı. Haritada evin üstüne basılı tutup çıkan koordinatı yapıştırabilirsiniz." }, 422);
  } catch (_e) {
    return yanit({ hata: "Konum çözülemedi, tekrar deneyin." }, 500);
  }
});
