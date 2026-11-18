/* ============================================================
   VİLLA TAKVİMİM — mağaza bağlantısı (Görev 30.2)
   App Store / Google Play aboneliği RevenueCat üzerinden
   (@revenuecat/purchases-capacitor, uygulamada "Purchases" eklentisi).
   Yalnız iOS / Android uygulamasında ve config.js'de anahtar varsa çalışır.
   Web'de ya da anahtar boşken Magaza.hazir() false döner, hiçbir şey çağrılmaz.
   RevenueCat'e kullanıcı kimliği olarak Supabase kullanıcı id'si (uuid) verilir;
   ad, e-posta ya da villa bilgisi gönderilmez.
   ============================================================ */
(function () {
  "use strict";
  var C = window.VILLA_CONFIG || {};
  var M = {};

  function platform() {
    try { var c = window.Capacitor; return (c && c.getPlatform && c.getPlatform()) || "web"; } catch (e) { return "web"; }
  }
  function eklenti() {
    try {
      var c = window.Capacitor;
      if (!c || !c.isNativePlatform || !c.isNativePlatform()) return null;
      return (c.Plugins && c.Plugins.Purchases) || null;
    } catch (e) { return null; }
  }
  function anahtar() {
    var p = platform();
    return String((p === "ios" ? C.RC_IOS_KEY : p === "android" ? C.RC_ANDROID_KEY : "") || "").trim();
  }
  M.platform = platform;
  M.hazir = function () { return !!(eklenti() && anahtar()); };

  // ---- kurulum: bir kez configure, kullanıcı değişince logIn ----
  var kurulan = null, kurulum = null;
  M.baslat = function (kullaniciId) {
    if (!M.hazir()) return Promise.reject(new Error("magaza-hazir-degil"));
    if (!kullaniciId) return Promise.reject(new Error("oturum-yok"));
    if (kurulan === kullaniciId && kurulum) return kurulum;
    var P = eklenti();
    var is = kurulan ? P.logIn({ appUserID: kullaniciId }) : P.configure({ apiKey: anahtar(), appUserID: kullaniciId });
    var once = kurulan;
    kurulan = kullaniciId;
    kurulum = Promise.resolve(is).then(function () { return true; }).catch(function (e) {
      kurulan = once; kurulum = null; throw e;
    });
    return kurulum;
  };
  // çıkışta mağaza tarafı anonim kullanıcıya döner (sonraki girişte logIn)
  M.cikis = function () {
    var P = eklenti();
    if (!P || !kurulan || kurulan === "(anonim)") return Promise.resolve();
    kurulan = "(anonim)"; kurulum = null;
    return Promise.resolve(P.logOut()).catch(function () {});
  };

  // ---- ürün: aylık paket, fiyat ve ücretsiz deneme ----
  function denemeVar(urun) {
    if (!urun) return false;
    var ip = urun.introPrice;
    if (ip && Number(ip.price) === 0) return true;
    var d = urun.defaultOption;   // Google Play
    return !!(d && d.freePhase);
  }
  // urunKimlik: plan_ayarlari.urun_aylik (ör. "villatakvim_pro_aylik"); Google Play'de "urun:temel-plan" biçiminde gelir
  M.teklif = function (urunKimlik) {
    var P = eklenti();
    if (!P) return Promise.resolve(null);
    return Promise.resolve(P.getOfferings()).then(function (o) {
      var cur = o && o.current, l = (cur && cur.availablePackages) || [];
      var paket = null;
      if (urunKimlik) paket = l.filter(function (p) {
        var id = p && p.product && p.product.identifier || "";
        return id === urunKimlik || id.split(":")[0] === urunKimlik;
      })[0] || null;
      paket = paket || (cur && cur.monthly) || l[0] || null;
      if (!paket || !paket.product) return null;
      var urun = paket.product, sonuc = { paket: paket, fiyat: urun.priceString || "", deneme: denemeVar(urun) };
      // iOS: daha önce deneme kullanıldıysa "İlk ay ücretsiz" gösterilmez (1 = hakkı yok)
      if (!sonuc.deneme || platform() !== "ios" || !P.checkTrialOrIntroductoryPriceEligibility) return sonuc;
      return Promise.resolve(P.checkTrialOrIntroductoryPriceEligibility({ productIdentifiers: [urun.identifier] }))
        .then(function (u) { var d = u && u[urun.identifier]; if (d && d.status === 1) sonuc.deneme = false; return sonuc; })
        .catch(function () { return sonuc; });
    });
  };

  function iptalMi(e) {
    if (!e) return false;
    return e.userCancelled === true || e.code === "1" || e.code === 1 ||
      !!(e.data && e.data.userCancelled) || !!(e.userInfo && e.userInfo.userCancelled);
  }
  function aktif(ci) {
    var a = ci && ci.entitlements && ci.entitlements.active;
    return !!(a && Object.keys(a).length);
  }
  // satın alma: { tamam: true } | { iptal: true }; diğer hatalar fırlatılır
  M.satinAl = function (paket) {
    var P = eklenti();
    if (!P) return Promise.reject(new Error("magaza-hazir-degil"));
    return Promise.resolve(P.purchasePackage({ aPackage: paket })).then(function (r) {
      return { tamam: true, aktif: aktif(r && r.customerInfo) };
    }, function (e) {
      if (iptalMi(e)) return { iptal: true };
      throw e;
    });
  };
  // geri yükleme: { aktif: true/false }
  M.geriYukle = function () {
    var P = eklenti();
    if (!P) return Promise.reject(new Error("magaza-hazir-degil"));
    return Promise.resolve(P.restorePurchases()).then(function (r) { return { aktif: aktif(r && r.customerInfo) }; });
  };
  // işletim sisteminin abonelik sayfası (mağazanın verdiği adres yoksa platformun genel sayfası)
  M.yonetAdresi = function () {
    var p = platform();
    var genel = p === "android" ? "https://play.google.com/store/account/subscriptions" : "https://apps.apple.com/account/subscriptions";
    var P = eklenti();
    if (!P || !kurulum) return Promise.resolve(genel);
    return Promise.resolve(P.getCustomerInfo()).then(function (r) {
      var u = r && r.customerInfo && r.customerInfo.managementURL;
      return /^https:\/\//.test(u || "") ? u : genel;
    }).catch(function () { return genel; });
  };
  // hata mesajı kullanıcıya teknik metin göstermez
  M.hataMetni = function (e) {
    var k = e && (e.code != null ? String(e.code) : "");
    if (k === "10" || k === "35") return "Mağazaya bağlanılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.";
    if (k === "2" || k === "3") return "Bu cihazda satın alma kapalı ya da mağaza şu anda yanıt vermiyor.";
    if (k === "6") return "Bu abonelik zaten bu hesapta açık.";
    if (k === "20") return "Ödeme onay bekliyor. Onaylanınca üyeliğiniz açılır.";
    return "Satın alma tamamlanamadı. Biraz sonra tekrar deneyin.";
  };

  window.Magaza = M;
})();
