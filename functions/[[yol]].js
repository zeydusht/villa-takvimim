// Cloudflare Pages Function: paylaşım linkleri ve WhatsApp/iMessage önizlemesi.
// Netlify ve GitHub Pages bu klasörü okumaz; yalnız Cloudflare Pages çalıştırır.
//
// Görev 45.1: Netlify'daki "/* /g.html 200" kuralının (netlify.toml) karşılığı. Önce gerçek dosya aranır.
//   Dosya yoksa (404) misafir sayfası g.html döner; adres değişmez, durum 200.
// Görev 45.6: önizleme uygulaması sayfayı JavaScript çalıştırmadan okur. Bu yüzden villanın adı, konumu ve
//   kapak fotoğrafı g.html'in <head> bölümüne sunucuda yazılır (og:title, og:image …).
//   - Supabase'e en fazla 1,5 sn beklenir; cevap gelmezse ya da villa yoksa genel etiketlerle normal sayfa döner.
//   - Supabase adresi: Pages ortam değişkeni SUPABASE_URL; tanımlı değilse www/config.js'ten okunur
//     (adres koda ikinci kez yazılmaz).
//   - Fotoğraf: galeri JSON'unda "kapak" (küçük sürüm) varsa o kullanılır. Yoksa ilk fotoğrafın Supabase
//     dönüştürülmüş 1200 px sürümü denenir; o da yoksa ilk fotoğrafın kendisi (uygulama en fazla 1400 px yükler).
//     Fotoğraf hiç yoksa /img/paylasim-genel.jpg kullanılır.

const BEKLEME_MS = 1500;
const ACIKLAMA = "Boş günler ve fiyatlar · Villa Takvimim";
const GENEL_GORSEL = "/img/paylasim-genel.jpg";

export async function onRequest(context) {
  const yanit = await context.next();
  if (yanit.status !== 404) return yanit;
  const yontem = context.request.method;
  if (yontem !== "GET" && yontem !== "HEAD") return yanit;
  try {
    return await misafirSayfasi(context);
  } catch (e) {
    // Hiçbir durumda hata sayfası verme: düz g.html
    return duzSayfa(context);
  }
}

async function duzSayfa(context) {
  const adres = new URL(context.request.url);
  const g = await context.env.ASSETS.fetch(new URL("/g", adres.origin));
  return new Response(g.body, { status: 200, headers: basliklar(g.headers, 60) });
}

function basliklar(kaynak, saniye) {
  const h = new Headers(kaynak);
  h.set("Content-Type", "text/html; charset=utf-8");
  h.set("Cache-Control", "public, max-age=" + saniye);
  h.delete("ETag");
  h.delete("Content-Length");
  return h;
}

async function misafirSayfasi(context) {
  const { request, env } = context;
  const adres = new URL(request.url);
  const jeton = adres.pathname.replace(/^\/+|\/+$/g, "");
  const teklifKod = (adres.searchParams.get("teklif") || "").trim();
  const teklif = /^[A-Za-z0-9]{4,16}$/.test(teklifKod);

  const sayfaSozu = env.ASSETS.fetch(new URL("/g", adres.origin));
  let villa = null;
  if (/^[a-z0-9-]+$/i.test(jeton)) {
    const kontrol = new AbortController();
    const zaman = setTimeout(() => kontrol.abort(), BEKLEME_MS);
    villa = await Promise.race([
      villaBilgisi(context, jeton, kontrol.signal).catch(() => null),
      new Promise(z => setTimeout(() => z(null), BEKLEME_MS + 50)),
    ]);
    clearTimeout(zaman);
  }

  const g = await sayfaSozu;
  let html = await g.text();

  const site = adres.origin;
  const url = site + "/" + jeton + (teklif ? "?teklif=" + encodeURIComponent(teklifKod.toUpperCase()) : "");
  let baslik = "Villa Takvimim", gorsel = site + GENEL_GORSEL, gen = 1200, yuk = 630;
  if (villa) {
    const ad = villa.ad || "Villa";
    baslik = ad + " · " + (teklif ? "size özel teklif" : (villa.konum || "Villa Takvimim"));
    if (villa.gorsel) { gorsel = villa.gorsel; gen = villa.gen || 0; yuk = villa.yuk || 0; }
  }
  html = etiketleriYaz(html, { baslik, aciklama: ACIKLAMA, url, gorsel, gen, yuk });

  const saniye = villa ? 600 : 60; // villa bulunamadıysa/yanıt gelmediyse kısa tut, bir sonraki önizleme düzelsin
  return new Response(request.method === "HEAD" ? null : html, { status: 200, headers: basliklar(g.headers, saniye) });
}

async function supabaseAdresi(context) {
  const ortam = String(context.env.SUPABASE_URL || "").trim();
  if (ortam) return ortam.replace(/\/+$/, "");
  const adres = new URL(context.request.url);
  const c = await context.env.ASSETS.fetch(new URL("/config.js", adres.origin));
  const m = (await c.text()).match(/supabaseUrl:\s*"(https:\/\/[^"]+)"/);
  return m ? m[1].replace(/\/+$/, "") : "";
}

async function villaBilgisi(context, jeton, sinyal) {
  const sb = await supabaseAdresi(context);
  if (!sb) return null;
  const r = await fetch(sb + "/storage/v1/object/public/galeri/" + jeton + ".json", { signal: sinyal, cf: { cacheTtl: 30 } });
  if (!r.ok) return null;
  const d = await r.json();
  if (!d || typeof d !== "object") return null;
  const v = {
    ad: temizMetin(d.ad, 80) || "Villa",
    konum: temizMetin(d.bilgi && d.bilgi.konum, 60),
    gorsel: "", gen: 0, yuk: 0,
  };
  const kapak = guvenliAdres(d.kapak && (d.kapak.url || d.kapak));
  const ilk = (Array.isArray(d.fotolar) ? d.fotolar : []).map(guvenliAdres).filter(Boolean)[0] || "";
  if (kapak) {
    v.gorsel = kapak;
    v.gen = +(d.kapak && d.kapak.gen) || 0; v.yuk = +(d.kapak && d.kapak.yuk) || 0;
  } else if (ilk) {
    v.gorsel = ilk;
    const kucuk = donusturulmus(sb, ilk);
    if (kucuk && await gorselVar(kucuk, sinyal)) { v.gorsel = kucuk; v.gen = 1200; }
  }
  return v;
}

// Supabase Storage resim dönüştürme adresi (projede açıksa 1200 px, %70 kalite)
function donusturulmus(sb, foto) {
  const on = sb + "/storage/v1/object/public/";
  if (foto.indexOf(on) !== 0) return "";
  return sb + "/storage/v1/render/image/public/" + foto.slice(on.length) + "?width=1200&quality=70";
}

async function gorselVar(u, sinyal) {
  try {
    const r = await fetch(u, { method: "HEAD", signal: sinyal });
    return r.ok && /^image\//.test(r.headers.get("Content-Type") || "");
  } catch (e) { return false; }
}

function guvenliAdres(u) {
  const t = String(u || "").trim();
  return /^https:\/\/[^\s"'<>]+$/i.test(t) ? t : "";
}

function temizMetin(s, uzunluk) {
  return String(s == null ? "" : s).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, uzunluk);
}

function kac(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function etiketleriYaz(html, e) {
  const m = (ad, deger) => '<meta property="' + ad + '" content="' + kac(deger) + '">';
  const blok = [
    "<!-- og:basla (sunucuda dolduruldu) -->",
    "<title>" + kac(e.baslik) + "</title>",
    '<meta name="description" content="' + kac(e.aciklama) + '">',
    m("og:type", "website"),
    m("og:site_name", "Villa Takvimim"),
    m("og:locale", "tr_TR"),
    m("og:title", e.baslik),
    m("og:description", e.aciklama),
    m("og:url", e.url),
    m("og:image", e.gorsel),
    e.gen ? m("og:image:width", e.gen) : "",
    e.yuk ? m("og:image:height", e.yuk) : "",
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:image" content="' + kac(e.gorsel) + '">',
    "<!-- og:bitir -->",
  ].filter(Boolean).join("\n");
  const bas = html.indexOf("<!-- og:basla"), son = html.indexOf("<!-- og:bitir -->");
  if (bas >= 0 && son > bas) return html.slice(0, bas) + blok + html.slice(son + "<!-- og:bitir -->".length);
  return html.replace(/<title>[\s\S]*?<\/title>/i, "").replace(/<\/head>/i, blok + "\n</head>");
}
