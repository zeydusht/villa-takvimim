// konum-coz: Google veya Apple Haritalar bağlantısını (kısa bağlantılar dahil) koordinata çevirir.
// Girişli kullanıcı çağırır (verify_jwt açık). API anahtarı gerekmez: bağlantı takip edilip adresten / sayfadan okunur.
// Görev 15 eki: yapıştırılan metnin içinden bağlantı ayıklanır; Apple Haritalar (maps.apple.com, maps.apple/p/…) desteklenir.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const IZINLI = /^(https?:\/\/)?((www\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.apple\.com|maps\.apple\/)/i;

const gecerli = (lat: number, lng: number) =>
  isFinite(lat) && isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0);

// Metnin içinden ilk bağlantıyı ya da düz koordinatı ayıkla ("Grand Emora https://maps.google.com/?q=…" gibi)
function ayikla(metin: string): { link?: string; lat?: number; lng?: number } {
  const u = metin.match(/https?:\/\/[^\s<>"']+/i);
  if (u) return { link: u[0].replace(/[).,;!?]+$/, "") };
  const c = metin.match(/(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
  if (c && gecerli(parseFloat(c[1]), parseFloat(c[2]))) return { lat: parseFloat(c[1]), lng: parseFloat(c[2]) };
  const d = metin.match(/(?:maps\.app\.goo\.gl|maps\.apple(?:\.com)?|maps\.google\.[a-z.]+|goo\.gl\/maps)\/?[^\s<>"']*/i);
  if (d) return { link: "https://" + d[0].replace(/[).,;!?]+$/, "") };
  return {};
}

function koordinatBul(s: string): { lat: number; lng: number } | null {
  const desen = [
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,          // Google yer işareti (en doğru)
    /[?&](?:coordinate|ll|sll|q|query|center|destination|daddr)=(-?\d+\.\d+)(?:,|%2C)\s*(-?\d+\.\d+)/i,
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,              // Google harita merkezi
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
// Sayfa gövdesinde koordinat (yönlendirmesiz kısa bağlantılar, Apple yer sayfaları)
function govdedeBul(g: string): { lat: number; lng: number } | null {
  const desen = [
    /"latitude"\s*:\s*(-?\d+\.\d+)\s*,\s*"longitude"\s*:\s*(-?\d+\.\d+)/i,
    /place:location:latitude"\s+content="(-?\d+\.\d+)"[\s\S]{0,300}?place:location:longitude"\s+content="(-?\d+\.\d+)"/i,
    /"lat"\s*:\s*(-?\d+\.\d+)\s*,\s*"lng"\s*:\s*(-?\d+\.\d+)/i,
  ];
  for (const d of desen) {
    const m = g.match(d);
    if (m) {
      const lat = parseFloat(m[1]), lng = parseFloat(m[2]);
      if (gecerli(lat, lng)) return { lat, lng };
    }
  }
  return koordinatBul(g);
}
function coz(x: string): string {
  try { return decodeURIComponent(x.replace(/\+/g, " ")).trim().slice(0, 120); } catch { return ""; }
}
function yerAdi(s: string, govde = ""): string {
  let m = s.match(/\/maps\/place\/([^/@?]+)/);
  if (m) return coz(m[1]);
  m = s.match(/[?&](?:name|q)=([^&#]+)/i);
  if (m) { const a = coz(m[1]); if (a && !/^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(a)) return a; }
  m = govde.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) || govde.match(/<title>([^<]+)<\/title>/i);
  if (m) {
    const a = m[1].replace(/\s*[-–—|]\s*(Apple (Haritalar|Maps)|Google (Haritalar|Maps))\s*$/i, "").trim();
    if (a && !/^(Apple|Google) (Haritalar|Maps)$/i.test(a)) return a.slice(0, 120);
  }
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const yanit = (o: unknown, kod = 200) =>
    new Response(JSON.stringify(o), { status: kod, headers: { ...CORS, "Content-Type": "application/json" } });
  try {
    const { link } = await req.json();
    const ham = String(link || "").trim().slice(0, 2000);
    if (!ham) return yanit({ hata: "Bağlantı boş." }, 400);
    const a = ayikla(ham);
    if (typeof a.lat === "number" && typeof a.lng === "number") return yanit({ lat: a.lat, lng: a.lng, ad: "" });
    let url = a.link || "";
    if (!url || !IZINLI.test(url)) return yanit({ hata: "Google veya Apple Haritalar bağlantısı yapıştırın." }, 400);
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    let simdiki = url;
    for (let i = 0; i < 6; i++) {           // en fazla 6 yönlendirme
      const k = koordinatBul(simdiki);
      if (k) return yanit({ ...k, ad: yerAdi(simdiki), link: url });
      const r = await fetch(simdiki, {
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) VillaTakvim", "Accept-Language": "tr,en;q=0.8" },
      });
      const sonraki = r.headers.get("location");
      if (sonraki) { await r.body?.cancel(); simdiki = new URL(sonraki, simdiki).toString(); continue; }
      const govde = (await r.text()).slice(0, 400000);
      const k2 = govdedeBul(govde);
      if (k2) return yanit({ ...k2, ad: yerAdi(simdiki, govde), link: url });
      break;
    }
    return yanit({ hata: "Bu bağlantıdan konum okunamadı. Haritada evin üstüne basılı tutup çıkan koordinatı yapıştırabilirsiniz." }, 422);
  } catch (_e) {
    return yanit({ hata: "Konum çözülemedi, tekrar deneyin." }, 500);
  }
});
