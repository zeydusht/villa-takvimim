// Villa Takvimim — push bildirimi gönderme (sunucu işleri için; "bildirim" fonksiyonuyla aynı yöntem: web-push + VAPID)
// Gizli değişkenler: VAPID_ACIK, VAPID_GIZLI, VAPID_POSTA (bildirim fonksiyonunda zaten tanımlı).
// Tekrarı önlemek için bildirim_gonderim (kullanici, anahtar, gun) tablosuna yazılır.

// deno-lint-ignore no-explicit-any
type Db = any;

export interface Bildirim { baslik: string; metin: string; yol?: string; etiket?: string }

const temiz = (x: string | undefined) => (x ?? "").replace(/\s/g, "").replace(/^"|"$/g, "").replace(/=+$/, "");

// deno-lint-ignore no-explicit-any
let webpush: any = null;
async function kutuphane() {
  if (webpush) return webpush;
  // deno-lint-ignore no-explicit-any
  const D = (globalThis as any).Deno;
  const ACIK = temiz(D?.env.get("VAPID_ACIK")), GIZLI = temiz(D?.env.get("VAPID_GIZLI"));
  if (!ACIK || !GIZLI) return null;
  // deno-lint-ignore no-explicit-any
  const mod: any = await import("npm:web-push@3.6.7");
  webpush = mod.default ?? mod;
  webpush.setVapidDetails((D.env.get("VAPID_POSTA") ?? "mailto:bilgi@villatakvim.app").trim(), ACIK, GIZLI);
  return webpush;
}

// Bugün (Türkiye) "YYYY-MM-DD"
export function bugunTr(simdi = new Date()): string {
  return new Date(simdi.getTime() + 3 * 3600 * 1000).toISOString().slice(0, 10);
}

// Bu anahtar bugün bu kullanıcıya gönderildi mi?
export async function gonderildiMi(db: Db, kullanici: string, anahtar: string, gun: string): Promise<boolean> {
  const { data } = await db.from("bildirim_gonderim").select("anahtar").eq("kullanici", kullanici).eq("anahtar", anahtar).eq("gun", gun).limit(1);
  return !!(data && data.length);
}

// Kullanıcılara gönder. anahtar verilirse aynı gün aynı kullanıcıya ikinci kez gönderilmez. Gönderilen cihaz sayısını döner.
export async function gonder(db: Db, kullanicilar: string[], b: Bildirim, anahtar?: string): Promise<number> {
  const kisiler = [...new Set(kullanicilar.filter(Boolean))];
  if (!kisiler.length) return 0;
  const gun = bugunTr();
  let hedef = kisiler;
  if (anahtar) {
    const l: string[] = [];
    for (const k of kisiler) if (!(await gonderildiMi(db, k, anahtar, gun))) l.push(k);
    hedef = l;
  }
  if (!hedef.length) return 0;
  const wp = await kutuphane();
  let n = 0;
  if (wp) {
    const { data: abonelik } = await db.from("push_abonelik").select("adres, p256dh, auth").in("kullanici", hedef);
    for (const s of abonelik || []) {
      try {
        await wp.sendNotification({ endpoint: s.adres, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({ baslik: b.baslik, metin: b.metin, etiket: b.etiket || anahtar || undefined, yol: b.yol || "/" }));
        n++;
      } catch (e) {
        // deno-lint-ignore no-explicit-any
        const kod = (e as any)?.statusCode;
        if (kod === 404 || kod === 410) await db.from("push_abonelik").delete().eq("adres", s.adres);
      }
    }
  }
  if (anahtar) {
    await db.from("bildirim_gonderim").upsert(hedef.map((k) => ({ kullanici: k, anahtar, gun })), { ignoreDuplicates: true });
  }
  return n;
}
