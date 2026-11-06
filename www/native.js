/* ============================================================
   VİLLA TAKVİM — app (iOS/Android) uyumluluk katmanı
   Sadece telefon uygulamasının içinde çalışır; web sitesinde
   hiçbir şey yapmaz. Sitenin koduna dokunmadan app'e uyarlar.
   ============================================================ */
(function () {
  "use strict";

  var Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;

  var P = Cap.Plugins || {};
  var SITE = String((window.VILLA_CONFIG || {}).siteUrl || "").replace(/\/+$/, "");
  var platform = Cap.getPlatform ? Cap.getPlatform() : "";

  document.documentElement.classList.add("native", "native-" + platform);

  // ---------- dış linkler ----------
  // App içinde yeni sekme olmadığı için bu linkler hiçbir şey yapmıyordu.
  // Web linkleri uygulama içi tarayıcıda, WhatsApp / telefon / e-posta ise
  // ilgili uygulamada açılır. Uygulamanın içindeki sayfalar (ör. gizlilik)
  // canlı sitedeki karşılığıyla açılır, böylece geri dönmek kolay olur.
  function tamAdres(href) {
    if (!href) return "";
    if (/^(https?:|tel:|mailto:|sms:|whatsapp:)/i.test(href)) return href;
    if (/^(javascript:|#|blob:|data:)/i.test(href)) return "";
    return SITE ? SITE + "/" + href.replace(/^\.?\/+/, "") : "";
  }

  function disariAc(url) {
    if (!url) return false;
    if (/^https?:/i.test(url) && !/^https?:\/\/(wa\.me|api\.whatsapp\.com)/i.test(url) &&
        P.Browser && P.Browser.open) {
      P.Browser.open({ url: url, presentationStyle: "popover" });
      return true;
    }
    if (P.App && P.App.openUrl) {
      P.App.openUrl({ url: url }).catch(function () { location.href = url; });
      return true;
    }
    location.href = url;
    return true;
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var harici = a.target === "_blank" || /^(https?:|tel:|mailto:|sms:)/i.test(href);
    if (!harici || a.hasAttribute("download")) return;
    var url = tamAdres(href);
    if (!url) return;
    e.preventDefault();
    disariAc(url);
  }, true);

  var eskiAc = window.open;
  window.open = function (url) {
    var tam = tamAdres(String(url || ""));
    if (tam && disariAc(tam)) return null;
    return eskiAc ? eskiAc.apply(window, arguments) : null;
  };

  // ---------- durum çubuğu (saat/pil) rengi ----------
  // Yeşil üst barın olduğu ekranlarda beyaz yazı, beyaz ekranlarda koyu yazı.
  var sonStil = "";
  function stilAyarla() {
    if (!P.StatusBar || !P.StatusBar.setStyle) return;
    var bar = document.querySelector(".appBar");
    var yesil = !!(bar && bar.offsetParent !== null);
    var stil = yesil ? "DARK" : "LIGHT"; // DARK = beyaz yazı, LIGHT = koyu yazı
    if (stil === sonStil) return;
    sonStil = stil;
    P.StatusBar.setStyle({ style: stil }).catch(function () {});
  }
  var bekle = 0;
  new MutationObserver(function () {
    clearTimeout(bekle);
    bekle = setTimeout(stilAyarla, 60);
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "hidden"] });
  document.addEventListener("DOMContentLoaded", stilAyarla);
  stilAyarla();

  if (platform === "android" && P.StatusBar && P.StatusBar.setOverlaysWebView) {
    P.StatusBar.setOverlaysWebView({ overlay: true }).catch(function () {});
  }

  // ---------- Android geri tuşu ----------
  if (platform === "android" && P.App && P.App.addListener) {
    P.App.addListener("backButton", function (d) {
      if (d && d.canGoBack) history.back();
      else if (P.App.minimizeApp) P.App.minimizeApp();
    });
  }
})();
