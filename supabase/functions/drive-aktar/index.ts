// Villa Takvimim — Google Drive'dan fotoğraf aktarma
//
// İki iş yapar (POST, JSON):
//   { islem: "liste", villa_id, link }            → klasördeki görsellerin listesi
//   { islem: "indir", villa_id, link, dosya_id }  → tek görselin kendisi (ikili veri)
//
// Güvenlik:
//   - Sadece giriş yapmış kullanıcılar (verify_jwt) ve sadece erişimi olduğu villa için.
//   - Sadece verilen klasörün içindeki görseller indirilebilir (genel amaçlı aracı değil).
//   - Google API anahtarı sunucuda gizli değişken: GOOGLE_API_KEY
//
// Klasör "Bağlantıya sahip olan herkes görüntüleyebilir" şeklinde paylaşılmış olmalı.

import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const EN_FAZLA = 60;
const EN_BUYUK = 25 * 1024 * 1024; // 25 MB
const DRIVE = "https://www.googleapis.com/drive/v3/files";

function json(veri: unknown, durum = 200) {
  return new Response(JSON.stringify(veri), {
    status: durum,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
function hata(mesaj: string, durum = 400) {
  return json({ hata: mesaj }, durum);
}

// drive.google.com/drive/folders/ID , .../folders/ID?usp=sharing , ?id=ID , /file/d/ID
function linktenId(link: string): { tur: "klasor" | "dosya"; id: string } | null {
  const s = String(link || "").trim();
  let m = s.match(/\/folders\/([A-Za-z0-9_-]{10,})/);
  if (m) return { tur: "klasor", id: m[1] };
  m = s.match(/\/file\/d\/([A-Za-z0-9_-]{10,})/);
  if (m) return { tur: "dosya", id: m[1] };
  m = s.match(/[?&]id=([A-Za-z0-9_-]{10,})/);
  if (m) return { tur: "klasor", id: m[1] };
  if (/^[A-Za-z0-9_-]{20,}$/.test(s)) return { tur: "klasor", id: s };
  return null;
}

async function driveHata(r: Response): Promise<string> {
  if (r.status === 404 || r.status === 403) {
    return "Klasöre ulaşılamadı. Drive'da klasörü 'Bağlantıya sahip olan herkes' ile paylaştığınızdan emin olun.";
  }
  return "Google Drive yanıt vermedi (" + r.status + "). Biraz sonra tekrar deneyin.";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return hata("Yalnızca POST", 405);

  const KEY = Deno.env.get("GOOGLE_API_KEY");
  if (!KEY) return hata("Drive bağlantısı henüz kurulmadı (GOOGLE_API_KEY yok).", 500);

  let govde: any;
  try { govde = await req.json(); } catch { return hata("Geçersiz istek"); }
  const { islem, villa_id, link, dosya_id } = govde || {};
  if (!villa_id || !link) return hata("villa_id ve link gerekli");

  // Kullanıcının bu villaya erişimi var mı? (kendi oturumuyla sorulur, RLS geçerli)
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
  });
  const { data: erisim, error: eh } = await sb.rpc("erisim_var", { v: villa_id });
  if (eh || erisim !== true) return hata("Bu villaya erişiminiz yok.", 403);

  const kaynak = linktenId(link);
  if (!kaynak) return hata("Bu bir Google Drive linki gibi görünmüyor.");

  // ---------- liste ----------
  if (islem === "liste") {
    if (kaynak.tur === "dosya") {
      const r = await fetch(`${DRIVE}/${kaynak.id}?fields=id,name,mimeType,size&key=${KEY}`);
      if (!r.ok) return hata(await driveHata(r), 400);
      const d = await r.json();
      if (!String(d.mimeType || "").startsWith("image/")) return hata("Bu dosya bir fotoğraf değil.");
      return json({ dosyalar: [{ id: d.id, ad: d.name, tur: d.mimeType, boyut: Number(d.size || 0) }], fazla: false });
    }
    const q = encodeURIComponent(`'${kaynak.id}' in parents and mimeType contains 'image/' and trashed = false`);
    let sayfa = "", hepsi: any[] = [];
    for (let i = 0; i < 5 && hepsi.length <= EN_FAZLA; i++) {
      const url = `${DRIVE}?q=${q}&fields=nextPageToken,files(id,name,mimeType,size)` +
        `&orderBy=name&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true&key=${KEY}` +
        (sayfa ? `&pageToken=${sayfa}` : "");
      const r = await fetch(url);
      if (!r.ok) return hata(await driveHata(r), 400);
      const d = await r.json();
      hepsi = hepsi.concat(d.files || []);
      if (!d.nextPageToken) break;
      sayfa = d.nextPageToken;
    }
    if (!hepsi.length) return hata("Klasörde fotoğraf bulunamadı (ya da klasör herkese açık paylaşılmamış).");
    return json({
      dosyalar: hepsi.slice(0, EN_FAZLA).map((f) => ({ id: f.id, ad: f.name, tur: f.mimeType, boyut: Number(f.size || 0) })),
      toplam: hepsi.length,
      fazla: hepsi.length > EN_FAZLA,
    });
  }

  // ---------- indir ----------
  if (islem === "indir") {
    if (!dosya_id || !/^[A-Za-z0-9_-]{10,}$/.test(dosya_id)) return hata("dosya_id gerekli");
    const m = await fetch(`${DRIVE}/${dosya_id}?fields=id,mimeType,size,parents&supportsAllDrives=true&key=${KEY}`);
    if (!m.ok) return hata(await driveHata(m), 400);
    const bilgi = await m.json();
    const ayniKlasor = kaynak.tur === "dosya" ? bilgi.id === kaynak.id : (bilgi.parents || []).includes(kaynak.id);
    if (!ayniKlasor) return hata("Bu dosya verilen klasörde değil.", 403);
    if (!String(bilgi.mimeType || "").startsWith("image/")) return hata("Bu dosya bir fotoğraf değil.");
    if (Number(bilgi.size || 0) > EN_BUYUK) return hata("Fotoğraf çok büyük (25 MB üstü).");

    const r = await fetch(`${DRIVE}/${dosya_id}?alt=media&supportsAllDrives=true&key=${KEY}`);
    if (!r.ok || !r.body) return hata(await driveHata(r), 400);
    return new Response(r.body, {
      headers: { ...CORS, "Content-Type": bilgi.mimeType, "Cache-Control": "no-store" },
    });
  }

  return hata("Bilinmeyen işlem");
});
