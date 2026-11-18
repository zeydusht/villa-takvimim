// abonelik-webhook (Görev 30.6): RevenueCat'in gönderdiği abonelik olaylarını karşılar ve
// public.abonelikler tablosuna service_role ile yazar (upsert, kullanici başına tek satır).
//
// DEPLOY EDİLMEDİ. Ürün yöneticisi deploy edecek:
//   supabase functions deploy abonelik-webhook --no-verify-jwt
//   supabase secrets set RC_WEBHOOK_SECRET=<RevenueCat panelinde "Authorization header" olarak girilen değer>
// (RevenueCat Supabase oturumu taşımaz; doğrulama aşağıdaki Authorization karşılaştırmasıyla yapılır.)
//
// Ortam: SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY Supabase tarafından verilir; RC_WEBHOOK_SECRET elle girilir.
//
// Durum eşlemesi:
//   deneme süresinde              → deneme
//   ücretli dönemde               → aktif
//   iptal edildi, süre bitmedi    → iptal_edildi
//   süre bitti                    → suresi_doldu
// bitis = expiration_at_ms, kaynak = apple (APP_STORE) | google (PLAY_STORE).
//
// Her zaman kısa bir cevap döner. Yalnız yetkisiz istek (401) ve geçici yazma hatası (500) dışında 200 döner;
// işlenmeyen olaylar (TEST, TRANSFER, başka mağaza vb.) da 200 alır, böylece RevenueCat boş yere tekrar denemez.

const ISLENEN = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "CANCELLATION",
  "EXPIRATION",
  "UNCANCELLATION",
  "PRODUCT_CHANGE",
  "BILLING_ISSUE",
]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const KAYNAK: Record<string, "apple" | "google"> = { APP_STORE: "apple", PLAY_STORE: "google" };

type Olay = {
  type?: string;
  app_user_id?: string;
  original_app_user_id?: string;
  aliases?: string[];
  product_id?: string;
  new_product_id?: string | null;
  period_type?: string; // TRIAL | INTRO | NORMAL | PROMOTIONAL | PREPAID
  expiration_at_ms?: number | null;
  event_timestamp_ms?: number;
  store?: string;
};

function cevap(durum: number, govde: Record<string, unknown>) {
  return new Response(JSON.stringify(govde), { status: durum, headers: { "Content-Type": "application/json" } });
}

// Sabit zamanlı karşılaştırma: uzunluk farkı dahil her baytı dolaşır, erken çıkmaz.
function esitMi(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  const n = Math.max(x.length, y.length);
  let fark = x.length ^ y.length;
  for (let i = 0; i < n; i++) fark |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return fark === 0;
}
function yetkili(baslik: string | null, gizli: string): boolean {
  if (!gizli || !baslik) return false;
  // RevenueCat başlığı panelde yazıldığı gibi gönderir; "Bearer <gizli>" de kabul edilir.
  const a = esitMi(baslik, gizli), b = esitMi(baslik, "Bearer " + gizli);
  return a || b;
}

// app_user_id = Supabase kullanıcı uuid'si (uygulama RevenueCat'e böyle giriş yapar).
// Anonim kimlikle başlamış bir satın almada uuid, original_app_user_id ya da aliases içinde olur.
function kullaniciBul(o: Olay): string | null {
  const adaylar = [o.app_user_id, o.original_app_user_id, ...(Array.isArray(o.aliases) ? o.aliases : [])];
  for (const a of adaylar) if (typeof a === "string" && UUID.test(a)) return a.toLowerCase();
  return null;
}

function durumBul(o: Olay, simdi: number): "deneme" | "aktif" | "iptal_edildi" | "suresi_doldu" {
  const bitis = typeof o.expiration_at_ms === "number" ? o.expiration_at_ms : null;
  const bitti = bitis !== null && bitis <= simdi;
  if (o.type === "EXPIRATION" || bitti) return "suresi_doldu";
  if (o.type === "CANCELLATION") return "iptal_edildi";
  // INITIAL_PURCHASE, RENEWAL, UNCANCELLATION, PRODUCT_CHANGE, BILLING_ISSUE (süre bitene kadar erişim sürer)
  return o.period_type === "TRIAL" ? "deneme" : "aktif";
}

Deno.serve(async (istek) => {
  if (istek.method !== "POST") return cevap(405, { hata: "yalnız POST" });

  const gizli = Deno.env.get("RC_WEBHOOK_SECRET") ?? "";
  if (!yetkili(istek.headers.get("Authorization"), gizli)) return cevap(401, { hata: "yetkisiz" });

  let olay: Olay;
  try {
    const g = await istek.json();
    olay = (g && typeof g === "object" && g.event && typeof g.event === "object") ? g.event : {};
  } catch {
    return cevap(400, { hata: "geçersiz gövde" });
  }

  const tur = String(olay.type ?? "");
  if (!ISLENEN.has(tur)) return cevap(200, { islem: "yok sayıldı", tur });

  const kaynak = KAYNAK[String(olay.store ?? "")];
  if (!kaynak) return cevap(200, { islem: "yok sayıldı", neden: "mağaza" });

  const kullanici = kullaniciBul(olay);
  if (!kullanici) return cevap(200, { islem: "yok sayıldı", neden: "kullanıcı kimliği" });

  const URL_ = Deno.env.get("SUPABASE_URL") ?? "";
  const ANAHTAR = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!URL_ || !ANAHTAR) return cevap(500, { hata: "sunucu ayarı eksik" });
  const bas = { apikey: ANAHTAR, Authorization: "Bearer " + ANAHTAR, "Content-Type": "application/json" };

  const simdi = Date.now();
  const olayZamani = typeof olay.event_timestamp_ms === "number" ? olay.event_timestamp_ms : simdi;

  // Sıra dışı gelen eski olay, daha yeni bir mağaza kaydının üstüne yazmasın.
  try {
    const r = await fetch(`${URL_}/rest/v1/abonelikler?select=kaynak,guncelleme&kullanici=eq.${kullanici}`, { headers: bas });
    if (r.ok) {
      const l = await r.json();
      const eski = Array.isArray(l) ? l[0] : null;
      if (eski && eski.kaynak !== "manuel" && eski.guncelleme && Date.parse(eski.guncelleme) > olayZamani) {
        return cevap(200, { islem: "yok sayıldı", neden: "daha yeni kayıt var" });
      }
    }
  } catch { /* okunamazsa yazmaya devam edilir */ }

  const bitis = typeof olay.expiration_at_ms === "number" ? new Date(olay.expiration_at_ms).toISOString() : null;
  const satir = {
    kullanici,
    durum: durumBul(olay, simdi),
    kaynak,
    urun: (tur === "PRODUCT_CHANGE" && olay.new_product_id) ? olay.new_product_id : (olay.product_id ?? null),
    bitis,
    musteri_kimlik: typeof olay.app_user_id === "string" ? olay.app_user_id.slice(0, 200) : null,
    guncelleme: new Date(olayZamani).toISOString(),
  };

  const y = await fetch(`${URL_}/rest/v1/abonelikler?on_conflict=kullanici`, {
    method: "POST",
    headers: { ...bas, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(satir),
  });
  if (!y.ok) {
    // 23503: kullanıcı silinmiş (auth.users'ta yok) → tekrar denemenin anlamı yok
    const t = await y.text();
    if (/23503|foreign key/i.test(t)) return cevap(200, { islem: "yok sayıldı", neden: "kullanıcı yok" });
    console.error("abonelik yazılamadı", y.status);
    return cevap(500, { hata: "yazılamadı" });   // RevenueCat sonra tekrar dener
  }
  return cevap(200, { islem: "yazıldı", durum: satir.durum });
});
