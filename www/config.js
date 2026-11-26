/* ---------------------------------------------------------------
   Villa Takvimim — paylaşım ayarları (dolduruldu, dokunmana gerek yok)
   Villa sahiplerinin hiçbir hesap açmasına gerek yoktur.
---------------------------------------------------------------- */

window.VILLA_CONFIG = {
  // Canlı adres. Cloudflare'a geçiş günü SADECE bu satır değişir (ardından: npm run alan-adi):
  siteUrl:     "https://villatakvim.netlify.app",
  // siteUrl:  "https://villatakvimim.com",

  // Görev 45.2: davet linklerinin açıldığı adres (eskiden index.html içindeydi; davranış aynı).
  // Boş bırakılırsa siteUrl kullanılır. Geçiş günü boşaltılabilir: docs/ALAN_ADI_GECIS.md 4. adım.
  davetUrl:    "https://zeydusht.github.io/villa-takvimim/",

  // Görev 45.3: destek e-postası. Doluysa gizlilik ve şartlar sayfalarında tıklanabilir görünür, boşsa "yakında eklenecek".
  // Geçiş günü: "destek@villatakvimim.com" (Cloudflare e-posta yönlendirmesi). Ardından: npm run alan-adi
  destekPosta: "",

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
