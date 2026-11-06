/* Villa Takvim — bildirim servisi
   Uygulama kapalıyken bile bildirimleri karşılar ve ekrana getirir. */

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (e) {
  var d = { baslik: "Villa Takvim", metin: "", yol: "/" };
  try {
    if (e.data) {
      var g = e.data.json();
      d.baslik = g.baslik || d.baslik;
      d.metin = g.metin || "";
      d.yol = g.yol || "/";
      d.etiket = g.etiket;
    }
  } catch (x) {
    d.metin = e.data ? e.data.text() : "";
  }

  e.waitUntil(
    self.registration.showNotification(d.baslik, {
      body: d.metin,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: d.etiket || undefined,
      data: { yol: d.yol },
      dir: "ltr",
      lang: "tr"
    })
  );
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var yol = (e.notification.data && e.notification.data.yol) || "/";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (liste) {
      for (var i = 0; i < liste.length; i++) {
        if ("focus" in liste[i]) return liste[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(yol);
    })
  );
});
