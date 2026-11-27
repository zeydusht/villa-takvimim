/* ---------------------------------------------------------------
   Villa Takvimim — paylaşım ayarları (dolduruldu, dokunmana gerek yok)
   Villa sahiplerinin hiçbir hesap açmasına gerek yoktur.
---------------------------------------------------------------- */

window.VILLA_CONFIG = {
  // Canlı adres (Görev 46.1: Cloudflare Pages). Adres değişirse SADECE bu satır değişir (ardından: npm run alan-adi):
  siteUrl:     "https://villatakvimim.com",
  // eski: "https://villatakvim.netlify.app" (artık villatakvimim.com'a 301 yönlendirir: netlify-yonlendirme/)

  // Davet linklerinin açıldığı adres (Görev 45.2'de buraya taşındı, 46.1'de yeni domaine çevrildi). Boşsa siteUrl kullanılır.
  davetUrl:    "https://villatakvimim.com",

  // Görev 45.3: destek e-postası. Doluysa gizlilik ve şartlar sayfalarında tıklanabilir görünür, boşsa "yakında eklenecek".
  // Cloudflare e-posta yönlendirmesiyle Zeyd'in postasına gider. Değişirse: npm run alan-adi
  destekPosta: "destek@villatakvimim.com",

  supabaseUrl: "https://qmfyqixilkvcvidigngt.supabase.co",
  supabaseKey: "sb_publishable_Tsr2CFKCR68Yl3mVQ2Bvhg_jaLVaEcC",

  // Uygulama sürümü (Görev 29: tek yer). Ölçüm olaylarında "surum" olarak gider; App Store sürümüyle (MARKETING_VERSION) aynı tutulur.
  surum:       "1.0.0",

  // Görev 30.2: RevenueCat herkese açık SDK anahtarları (App Store / Google Play). Boşken satın alma düğmesi "Yakında" der.
  RC_IOS_KEY:     "",
  RC_ANDROID_KEY: "",

  // Bildirim açık anahtarı (gizli olan Supabase'de saklanır)
  pushAnahtar: "BJpATauLAOM0hZl3JBe8JclVT8_Fuvjxi9YkKSxguUSjAt4IzLyTf6vha5fK-k0fa_GMllpyRLKYJr--R_jp7I4"
};
