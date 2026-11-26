// Görev 45.1 — Cloudflare Pages: paylaşım linkleri (villatakvimim.com/villa-salta-k7m2)
// Netlify'daki "/* /g.html 200" kuralının (netlify.toml) Cloudflare karşılığı:
// önce gerçek dosya aranır; dosya yoksa (404) misafir sayfası g.html döner, adres değişmez, durum 200.
// Netlify ve GitHub Pages bu klasörü okumaz; yalnız Cloudflare Pages çalıştırır.

export async function onRequest(context) {
  const yanit = await context.next();
  if (yanit.status !== 404) return yanit;
  if (context.request.method !== "GET" && context.request.method !== "HEAD") return yanit;
  return misafirSayfasi(context);
}

async function misafirSayfasi(context) {
  const adres = new URL(context.request.url);
  // g.html'in "güzel adresi" /g (Cloudflare .html uzantısını kendisi kaldırır)
  const g = await context.env.ASSETS.fetch(new URL("/g", adres.origin));
  const basliklar = new Headers(g.headers);
  basliklar.set("Content-Type", "text/html; charset=utf-8");
  return new Response(g.body, { status: 200, headers: basliklar });
}
