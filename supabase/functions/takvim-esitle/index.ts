// Villa Takvimim — dış takvimleri (Airbnb, Booking, Vrbo, Villasepeti, diğer) okuma ve eşitleme (Görev 32.1)
//
// DEPLOY EDİLMEDİ. Ürün yöneticisi kontrol edip deploy eder:
//   supabase functions deploy takvim-esitle --no-verify-jwt
//     (zamanlayıcı JWT değil ESITLE_GIZLI gönderir; uygulamadan gelen oturum tokenini fonksiyon kendisi denetler: auth.getUser)
//   Gizli değişkenler: ESITLE_GIZLI (zamanlayıcının parolası), VAPID_ACIK / VAPID_GIZLI / VAPID_POSTA (bildirim fonksiyonuyla aynı)
//   Zamanlayıcı (pg_net ile, VERITABANI_GOREV32.sql sonundaki not):
//     her 10 dakikada  POST { "mod": "tam" }     Authorization: Bearer <ESITLE_GIZLI>
//     her dakika       POST { "mod": "dakika" }  Authorization: Bearer <ESITLE_GIZLI>
//
// İki çağrılma şekli:
//  1) Uygulamadan (kullanıcının oturum tokeni):
//       { villa_id }                       → villanın bütün aktif takvimleri PARALEL okunur, kaydedilir, cakisma_tara çağrılır
//       { villa_id, bas, bit }             → aynı; cevaptaki dolu aralıklar ve durum yalnız bu aralığa bakar
//       { villa_id, deneme: {adres, kaynak} } → yalnız sahip: link kaydedilmeden okunur ("Bağla" öncesi test)
//     Erişim service_role ile, kullanıcının id'si üzerinden denetlenir (villalar.sahip / villa_erisim / yönetici).
//     Aynı villa için 20 sn'den sık çağrı gelirse takvimler yeniden okunmaz, son okumanın sonucu döner.
//  2) Zamanlayıcıdan (Authorization: Bearer <ESITLE_GIZLI>, hız sınırı yok):
//       mod "tam"    → bütün aktif takvimler, aynı anda en fazla 8; ardından bekleyenler, çakışma bildirimleri,
//                      3 saattir okunamayan takvim bildirimi
//       mod "dakika" → yalnız dis_kontrol='bekliyor' rezervasyonu olan villaların takvimleri + bekleyenler + çakışma bildirimleri
//
// Cevap: { takvimler: [{id, ad, kaynak, durum:'bos'|'dolu'|'hata', sure_ms, hata?, dolu_araliklar:[{bas,bit,tur}]}], cakisma_var }
// KVKK: misafir adı, telefon, SUMMARY / DESCRIPTION metni kaydedilmez; yalnız tarih, tür ve UID.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { CORS, json, uygulamadan, zamanlayicidan } from "./is.ts";

// deno-lint-ignore no-explicit-any
const D = (globalThis as any).Deno;
if (D && D.serve) D.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ hata: "Yalnızca POST" }, 405);
  // deno-lint-ignore no-explicit-any
  let g: any = {};
  try { g = await req.json(); } catch { g = {}; }
  const db = createClient(D.env.get("SUPABASE_URL")!, D.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const yetkiBasligi = req.headers.get("Authorization") || "";
  const GIZLI = D.env.get("ESITLE_GIZLI");
  try {
    if (GIZLI && yetkiBasligi === "Bearer " + GIZLI) return await zamanlayicidan(db, String(g.mod || "tam"));
    const jeton = yetkiBasligi.replace(/^Bearer\s+/i, "");
    // Zamanlayıcı parolası kasada (vault: takvim_esitle_gizli) da tutulabilir: 64 haneli onaltılık metin.
    // Karşılaştırma veritabanında yapılır (esitle_gizli_dogru, yalnız service_role çağırabilir); parola fonksiyona hiç gelmez.
    if (/^[0-9a-f]{64}$/.test(jeton)) {
      const { data: dogru } = await db.rpc("esitle_gizli_dogru", { p: jeton });
      if (dogru === true) return await zamanlayicidan(db, String(g.mod || "tam"));
      return json({ hata: "Yetkisiz" }, 401);
    }
    const { data: u } = await db.auth.getUser(jeton);
    if (!u || !u.user) return json({ hata: "Oturum bulunamadı, tekrar giriş yapın." }, 401);
    return await uygulamadan(db, u.user.id, g);
  } catch (_e) {
    return json({ hata: "Takvimler şu an kontrol edilemedi." }, 500);
  }
});
