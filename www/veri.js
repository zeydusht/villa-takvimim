/* ============================================================
   VİLLA TAKVİM — kimlik ve bulut katmanı
   Harici kütüphane yok; Supabase'in REST uçlarına doğrudan bağlanır.
   Uygulama bu dosyayı window.VT üzerinden kullanır.
   ============================================================ */
(function () {
  "use strict";

  var C = window.VILLA_CONFIG || {};
  var URL_ = String(C.supabaseUrl || "").replace(/\/+$/, "");
  var KEY = String(C.supabaseKey || "");
  var OTURUM_ANAHTAR = "villa-takvim-oturum";

  var VT = {
    oturum: null,
    profil: null,
    kurulu: function () { return !!(URL_ && KEY); },
    girisli: function () { return !!(VT.oturum && VT.oturum.access_token); }
  };

  // ---------------- yardımcılar ----------------
  function yeniId() {
    try { if (crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  VT.yeniId = yeniId;

  function oturumYaz(o) {
    VT.oturum = o;
    try {
      if (o) localStorage.setItem(OTURUM_ANAHTAR, JSON.stringify(o));
      else localStorage.removeItem(OTURUM_ANAHTAR);
    } catch (e) {}
  }
  function oturumOku() {
    try { return JSON.parse(localStorage.getItem(OTURUM_ANAHTAR) || "null"); }
    catch (e) { return null; }
  }

  function hataMetni(o, varsayilan) {
    var m = (o && (o.msg || o.message || o.error_description || o.error || o.hint)) || "";
    m = String(m);
    if (/invalid login credentials/i.test(m)) return "E-posta veya şifre hatalı.";
    if (/email not confirmed/i.test(m)) return "E-postanızı onaylamanız gerekiyor. Gelen kutunuza bakın.";
    if (/user already registered/i.test(m)) return "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.";
    if (/password should be at least/i.test(m)) return "Şifre en az 6 karakter olmalı.";
    if (/rate limit|too many/i.test(m)) return "Çok fazla deneme yapıldı, biraz sonra tekrar deneyin.";
    if (/row-level security/i.test(m)) return "Bu kayıt için yetkiniz görünmüyor. Çıkış yapıp tekrar giriş yapın.";
    if (/oturum bulunamadi/i.test(m)) return "Oturum bulunamadı, tekrar giriş yapın.";
    if (/geçersiz veya süresi/i.test(m)) return m;
    return m || varsayilan || "Bir sorun oluştu, tekrar deneyin.";
  }

  // ---------------- kimlik ----------------
  function authIstek(yol, govde) {
    return fetch(URL_ + "/auth/v1/" + yol, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: KEY },
      body: JSON.stringify(govde)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(hataMetni(d));
        return d;
      });
    });
  }

  VT.kayitOl = function (eposta, sifre, ad) {
    return authIstek("signup", { email: eposta, password: sifre, data: { ad: ad || "" } })
      .then(function (d) {
        if (d.access_token) { oturumYaz(d); return { girisYapildi: true }; }
        return { girisYapildi: false, onayGerekli: true };
      });
  };

  VT.girisYap = function (eposta, sifre) {
    return authIstek("token?grant_type=password", { email: eposta, password: sifre })
      .then(function (d) { oturumYaz(d); return d; });
  };

  VT.sifreSifirla = function (eposta) {
    var don = (C.siteUrl || (location.origin + location.pathname)).replace(/\/+$/, "");
    return authIstek("recover?redirect_to=" + encodeURIComponent(don), { email: eposta });
  };

  // e-postadaki bağlantıdan dönen bilgiyi okur
  VT.adrestenOturum = function () {
    var ham = (location.hash || "").replace(/^#/, "");
    if (!ham) return null;
    var p = {};
    ham.split("&").forEach(function (x) {
      var i = x.indexOf("=");
      if (i > 0) p[decodeURIComponent(x.slice(0, i))] = decodeURIComponent(x.slice(i + 1).replace(/\+/g, " "));
    });
    if (p.error || p.error_description) {
      return { hata: /expired|invalid/i.test(p.error_code || p.error_description || "")
        ? "Bağlantının süresi dolmuş. Yeni bir sıfırlama bağlantısı isteyin."
        : (p.error_description || "Bağlantı geçersiz.") };
    }
    if (p.access_token) {
      oturumYaz({ access_token: p.access_token, refresh_token: p.refresh_token || "" });
      return { tur: p.type || "", oturum: VT.oturum };
    }
    return null;
  };

  VT.adresiTemizle = function () {
    try { history.replaceState(null, "", location.pathname + location.search); }
    catch (e) { location.hash = ""; }
  };

  VT.sifreGuncelle = function (yeni) {
    if (!VT.girisli()) return Promise.reject(new Error("Oturum bulunamadı."));
    return fetch(URL_ + "/auth/v1/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json", apikey: KEY,
                 Authorization: "Bearer " + VT.oturum.access_token },
      body: JSON.stringify({ password: yeni })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(hataMetni(d, "Şifre güncellenemedi."));
        return d;
      });
    });
  };

  VT.cikis = function () {
    var t = VT.oturum && VT.oturum.access_token;
    oturumYaz(null); VT.profil = null;
    if (!t) return Promise.resolve();
    return fetch(URL_ + "/auth/v1/logout", {
      method: "POST",
      headers: { apikey: KEY, Authorization: "Bearer " + t }
    }).catch(function () {});
  };

  function tokenYenile() {
    var o = VT.oturum;
    if (!o || !o.refresh_token) return Promise.reject(new Error("Oturum yok"));
    return authIstek("token?grant_type=refresh_token", { refresh_token: o.refresh_token })
      .then(function (d) { oturumYaz(d); return d; });
  }

  // Uygulama, sunucu fonksiyonlarına (ör. drive-aktar) giderken süresi dolan oturumu yenileyebilsin
  VT.jetonYenile = tokenYenile;

  function jetonGecerliMi(t) {
    try {
      var g = JSON.parse(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return g.exp ? (g.exp * 1000 > Date.now() + 30000) : true;
    } catch (e) { return false; }
  }

  VT.oturumuGeriYukle = function () {
    var o = oturumOku();
    if (!o) return Promise.resolve(null);
    VT.oturum = o;
    return tokenYenile().then(function () { return VT.oturum; })
      .catch(function (e) {
        var m = String((e && e.message) || "");
        // Sunucu oturumu açıkça reddettiyse çıkış yap
        if (/refresh|invalid|geçersiz|expired|not found/i.test(m) && !/ulaşılamadı|network|failed to fetch/i.test(m)) {
          oturumYaz(null);
          return null;
        }
        // İnternet koptuysa veya sunucuya ulaşılamadıysa oturumu koru
        if (o.access_token && jetonGecerliMi(o.access_token)) return VT.oturum;
        return VT.oturum;   // yine de koru; ilk istek 401 verirse orada yenilenir
      });
  };

  VT.kullanici = function () {
    var o = VT.oturum;
    if (!o) return null;
    if (o.user) return o.user;
    try {
      var g = JSON.parse(atob(o.access_token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return { id: g.sub, email: g.email };
    } catch (e) { return null; }
  };

  // ---------------- veri ----------------
  function api(yol, secenek, tekrar) {
    var o = secenek || {};
    var b = {
      apikey: KEY,
      Authorization: "Bearer " + (VT.oturum ? VT.oturum.access_token : KEY),
      "Content-Type": "application/json"
    };
    if (o.donus) b.Prefer = o.donus;
    return fetch(URL_ + "/rest/v1/" + yol, {
      method: o.method || "GET",
      headers: b,
      body: o.body ? JSON.stringify(o.body) : undefined
    }).then(function (r) {
      if (r.status === 401 && !tekrar) {
        return tokenYenile().then(function () { return api(yol, secenek, true); })
          .catch(function (e) { throw new Error("Oturumunuzun süresi dolmuş. Tekrar giriş yapın."); });
      }
      if (r.status === 204) return null;
      return r.text().then(function (t) {
        var d = null;
        try { d = t ? JSON.parse(t) : null; } catch (e) { d = null; }
        if (!r.ok) {
          var tablo = String(yol).split("?")[0];
          throw new Error(tablo + ": " + hataMetni(d, "Sunucuya ulaşılamadı (" + r.status + ")"));
        }
        return d;
      });
    });
  }
  VT.api = api;

  VT.rpc = function (ad, arg) {
    return api("rpc/" + ad, { method: "POST", body: arg || {} });
  };

  // ---------------- profil / onay ----------------
  VT.profilYukle = function () {
    var k = VT.kullanici();
    if (!k) return Promise.resolve(null);
    return api("profiller?select=id,ad,telefon,eposta,onay,askida,yonetici,onayci&id=eq." + k.id)
      .then(function (d) {
        VT.profil = (d && d[0]) || { id: k.id, eposta: k.email, onay: false, yonetici: false };
        return VT.profil;
      })
      .catch(function () {
        VT.profil = { id: k.id, eposta: k.email, onay: false, yonetici: false };
        return VT.profil;
      });
  };
  VT.onayli = function () { return !!(VT.profil && VT.profil.onay); };
  VT.yonetici = function () { return !!(VT.profil && VT.profil.yonetici); };
  VT.onayci = function () {
    return !!(VT.profil && (VT.profil.onayci || VT.profil.yonetici));
  };
  VT.bekleyenKayitlar = function () { return VT.rpc("bekleyen_kayitlar"); };
  VT.bekleyenler = function () { return VT.rpc("bekleyenler"); };
  VT.profilGuncelle = function (ad, telefon) {
    return VT.rpc("profil_guncelle", { p_ad: ad || "", p_telefon: telefon || "" })
      .then(function () {
        if (VT.profil) { VT.profil.ad = ad || ""; VT.profil.telefon = telefon || ""; }
      });
  };
  VT.tumKullanicilar = function () { return VT.rpc("tum_kullanicilar"); };
  VT.kullaniciAskiyaAl = function (id) { return VT.rpc("kullanici_askiya_al", { p_id: id }); };
  VT.villaErisimleri = function (villaId) { return VT.rpc("villa_erisimleri", { p_villa: villaId }); };
  VT.kullaniciVillalari = function (id) { return VT.rpc("kullanici_villalari", { p_id: id }); };
  VT.villaDetay = function (villaId) { return VT.rpc("villa_detay", { p_villa: villaId }); };
  VT.erisimKaldir = function (villaId, kullaniciId) {
    return VT.rpc("erisim_kaldir", { p_villa: villaId, p_kullanici: kullaniciId });
  };
  VT.kullaniciOnayla = function (id) { return VT.rpc("kullanici_onayla", { p_id: id }); };
  VT.kullaniciReddet = function (id) { return VT.rpc("kullanici_reddet", { p_id: id }); };

  // ---------------- villaları yükle ----------------
  function say(x) { var n = parseInt(x, 10); return isNaN(n) ? 0 : n; }

  VT.villalariYukle = function () {
    var k = VT.kullanici();
    VT.silinenler = [];
    if (!k) return Promise.resolve([]);
    return api("villa_erisim?select=villa_id,rol&kullanici=eq." + k.id).then(function (er) {
      if (!er || !er.length) return [];
      var roller = {}, idler = [];
      er.forEach(function (e) {
        // aynı villa için birden çok satır gelirse sahiplik her zaman önceliklidir
        if (roller[e.villa_id] === "sahip") return;
        if (!roller[e.villa_id]) idler.push(e.villa_id);
        roller[e.villa_id] = e.rol;
      });
      var listesi = "in.(" + idler.join(",") + ")";
      var liste = function (l) { return "in.(" + l.join(",") + ")"; };
      // Para bilgileri (mali, ödemeler) yalnız sahibin villalarında okunur; bakıcı ve destek modunda istenmez.
      // Gecelik fiyatlar bakıcıya kapalı; sahip ve destek modunda okunur.
      var sahipIdler = idler.filter(function (i) { return roller[i] === "sahip"; });
      var fiyatIdler = idler.filter(function (i) { return roller[i] !== "bakici"; });

      var sorgular = [
        api("villalar?select=*&id=" + listesi),
        api("rezervasyonlar?select=*&villa_id=" + listesi),
        api("giderler?select=*&villa_id=" + listesi),
        fiyatIdler.length ? api("fiyatlar?select=*&villa_id=" + liste(fiyatIdler)) : Promise.resolve([]),
        api("villa_fotograflar?select=*&villa_id=" + listesi + "&order=sira"),
        api("misafir_notlari?select=*&villa_id=" + listesi),
        sahipIdler.length ? api("rezervasyon_mali?select=*&villa_id=" + liste(sahipIdler)) : Promise.resolve([]),
        sahipIdler.length ? api("odemeler?select=*&villa_id=" + liste(sahipIdler)) : Promise.resolve([]),
        sahipIdler.length ? api("gelirler?select=*&villa_id=" + liste(sahipIdler)) : Promise.resolve([])
      ];

      return Promise.all(sorgular).then(function (s) {
        // Silinen (çöp kutusundaki) villalar normal listede görünmez; sahibine "Silinen villalar"da gösterilir
        // 30 günü geçen silinmiş villalar: yalnız SAHİBİ açtığında kalıcı silinir (bakıcı için yapılmaz)
        var SINIR = 30 * 864e5, simdi = Date.now();
        var eskiMi = function (v) { return simdi - Date.parse(v.silindi_tarih) >= SINIR; };
        (s[0] || []).forEach(function (v) {
          if (v.silindi_tarih && roller[v.id] === "sahip" && eskiMi(v))
            api("villalar?id=eq." + v.id + "&silindi_tarih=not.is.null", { method: "DELETE" }).catch(function () {});
        });
        VT.silinenler = (s[0] || []).filter(function (v) { return v.silindi_tarih && roller[v.id] === "sahip" && !eskiMi(v); })
          .map(function (v) { return { id: v.id, ad: v.ad, silindi_tarih: v.silindi_tarih }; });
        var villalar = (s[0] || []).filter(function (v) { return !v.silindi_tarih; }), rez = s[1] || [], gider = s[2] || [], fiyat = s[3] || [],
            foto = s[4] || [], notlar = s[5] || [], mali = s[6] || [], odeme = s[7] || [], gelir = s[8] || [];

        var maliHar = {}; mali.forEach(function (m) { maliHar[m.rezervasyon_id] = m; });
        var odemeHar = {};
        odeme.forEach(function (o) {
          (odemeHar[o.rezervasyon_id] = odemeHar[o.rezervasyon_id] || []).push({
            id: o.id, tarih: o.tarih, tutar: say(o.tutar), not: o.aciklama || ""
          });
        });

        return villalar.map(function (v) {
          var m = {
            id: v.id, ad: v.ad, color: v.renk || "#0B5B57",
            bilgi: v.bilgi || {}, paylasim: v.paylasim && v.paylasim.ad ? v.paylasim : undefined,
            rol: roller[v.id] || "bakici",
            rez: [], fiyatlar: {}, giderler: [], gelirler: [], fotolar: [], misafirNot: {}
          };
          rez.filter(function (r) { return r.villa_id === v.id; }).forEach(function (r) {
            var mm = maliHar[r.id] || {};
            var od = odemeHar[r.id] || [];
            m.rez.push({
              id: r.id, start: r.baslangic, end: r.bitis, guest: r.misafir,
              phone: r.telefon || "", people: r.kisi ? String(r.kisi) : "",
              note: r.aciklama || "", color: r.renk || "#0B5B57", kod: r.kod || undefined,
              tutar: say(mm.tutar), ekUcret: say(mm.ek_ucret),
              // depozito_tutar: bu rezervasyonun depozito tutarı (0 da geçerli); tarihli eski kayıtlar uygulamada taşınır
              depozito: (mm.depozito_tutar !== null && mm.depozito_tutar !== undefined) ? { tutar: say(mm.depozito_tutar), tarih: mm.depozito_tarih || undefined } : undefined,
              odemeler: od, odenen: od.reduce(function (t, x) { return t + x.tutar; }, 0)
            });
          });
          fiyat.filter(function (f) { return f.villa_id === v.id; })
               .forEach(function (f) { m.fiyatlar[f.tarih] = say(f.tutar); });
          gider.filter(function (g) { return g.villa_id === v.id; }).forEach(function (g) {
            m.giderler.push({ id: g.id, aciklama: g.aciklama, tutar: say(g.tutar), tarih: g.tarih, ekleyen: g.ekleyen || undefined,
                              foto: g.fis_yol ? { id: g.id, tam: g.fis_yol, thumb: g.fis_yol } : undefined });
          });
          gelir.filter(function (g) { return g.villa_id === v.id; }).forEach(function (g) {
            m.gelirler.push({ id: g.id, aciklama: g.aciklama, tutar: say(g.tutar), tarih: g.tarih });
          });
          foto.filter(function (f) { return f.villa_id === v.id; }).forEach(function (f) {
            m.fotolar.push({ id: f.id, url: f.yol, tam: f.yol, thumb: f.yol, sira: f.sira });
          });
          notlar.filter(function (n) { return n.villa_id === v.id; }).forEach(function (n) {
            m.misafirNot[n.anahtar] = { not: n.aciklama || "", sonTeklif: n.son_teklif || "" };
          });
          m.__anlik = anlik(m);
          return m;
        });
      }).then(function (l) {
        // Bakıcı villaları: girişte alınacak kalan tutar sunucudan gelir (bakici_kalanlar)
        return Promise.all(l.filter(function (v) { return v.rol === "bakici"; }).map(VT.bakiciKalanlar))
          .then(function () { return l; });
      });
    });
  };

  // Bakıcının göreceği kalan tutarlar: r.kalanSunucu (depozito dahil), r.depozitoSunucu
  VT.bakiciKalanlar = function (v) {
    return VT.rpc("bakici_kalanlar", { p_villa: v.id }).then(function (satirlar) {
      var m = {};
      (satirlar || []).forEach(function (x) { m[x.rezervasyon_id] = x; });
      (v.rez || []).forEach(function (r) {
        var x = m[r.id];
        r.kalanSunucu = x ? Math.max(0, Math.round(Number(x.kalan) || 0)) : 0;
        r.depozitoSunucu = x ? Math.max(0, Math.round(Number(x.depozito) || 0)) : 0;
      });
    }).catch(function () {});
  };

  // ---------------- bildirim aboneliği ----------------
  function b64Dizi(s) {
    var d = (s + "=".repeat((4 - s.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
    var ham = atob(d), dizi = new Uint8Array(ham.length);
    for (var i = 0; i < ham.length; i++) dizi[i] = ham.charCodeAt(i);
    return dizi;
  }
  function diziB64(buf) {
    var b = new Uint8Array(buf), s = "";
    for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  }

  VT.bildirimDestekli = function () {
    return !!(window.Notification && navigator.serviceWorker &&
              window.PushManager && C.pushAnahtar);
  };
  VT.bildirimDurumu = function () {
    if (!VT.bildirimDestekli()) return "yok";
    return Notification.permission;   // default | granted | denied
  };

  VT.bildirimAc = function () {
    if (!VT.bildirimDestekli()) return Promise.reject(new Error("Bu cihaz bildirimi desteklemiyor."));
    return Notification.requestPermission().then(function (izin) {
      if (izin !== "granted") throw new Error("Bildirim izni verilmedi.");
      return navigator.serviceWorker.register("/sw.js");
    }).then(function () {
      return navigator.serviceWorker.ready;
    }).then(function (kayit) {
      return kayit.pushManager.getSubscription().then(function (mevcut) {
        if (mevcut) return mevcut;
        return kayit.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: b64Dizi(C.pushAnahtar)
        });
      });
    }).then(function (abone) {
      var j = abone.toJSON ? abone.toJSON() : {};
      var anahtarlar = j.keys || {};
      return api("push_abonelik", {
        method: "POST", donus: "resolution=merge-duplicates",
        body: [{
          kullanici: VT.kullanici().id,
          adres: abone.endpoint,
          p256dh: anahtarlar.p256dh || diziB64(abone.getKey("p256dh")),
          auth: anahtarlar.auth || diziB64(abone.getKey("auth")),
          cihaz: (navigator.userAgent || "").slice(0, 120)
        }]
      });
    });
  };

  VT.bildirimKapat = function () {
    if (!navigator.serviceWorker) return Promise.resolve();
    return navigator.serviceWorker.ready.then(function (k) {
      return k.pushManager.getSubscription();
    }).then(function (a) {
      if (!a) return null;
      var adres = a.endpoint;
      return a.unsubscribe().then(function () {
        return api("push_abonelik?adres=eq." + encodeURIComponent(adres), { method: "DELETE" });
      });
    });
  };

  // ---------------- destek modu: tek villa ----------------
  VT.kilitAl = function (villaId) { return VT.rpc("kilit_al", { p_villa: villaId }); };
  VT.kilitBirak = function (villaId) { return VT.rpc("kilit_birak", { p_villa: villaId }); };
  VT.destekGir = function (villaId) { return VT.rpc("destek_gir", { p_villa: villaId }); };

  VT.villaTekYukle = function (villaId) {
    return Promise.all([
      api("villalar?select=*&id=eq." + villaId),
      api("rezervasyonlar?select=*&villa_id=eq." + villaId),
      api("giderler?select=*&villa_id=eq." + villaId),
      api("fiyatlar?select=*&villa_id=eq." + villaId),
      api("villa_fotograflar?select=*&villa_id=eq." + villaId + "&order=sira"),
      api("misafir_notlari?select=*&villa_id=eq." + villaId),
      // destek modunda yönetici sahip gibi: para bilgileri de okunur (izin yoksa boş gelir)
      api("rezervasyon_mali?select=*&villa_id=eq." + villaId).catch(function () { return []; }),
      api("odemeler?select=*&villa_id=eq." + villaId).catch(function () { return []; }),
      api("gelirler?select=*&villa_id=eq." + villaId).catch(function () { return []; })
    ]).then(function (s) {
      var maliHar = {}; (s[6] || []).forEach(function (x) { maliHar[x.rezervasyon_id] = x; });
      var odemeHar = {};
      (s[7] || []).forEach(function (o) {
        (odemeHar[o.rezervasyon_id] = odemeHar[o.rezervasyon_id] || []).push({
          id: o.id, tarih: o.tarih, tutar: say(o.tutar), not: o.aciklama || "" });
      });
      var v0 = (s[0] || [])[0];
      if (!v0) throw new Error("Villa bulunamadı.");
      var m = {
        id: v0.id, ad: v0.ad, color: v0.renk || "#0B5B57",
        bilgi: v0.bilgi || {},
        paylasim: v0.paylasim && v0.paylasim.ad ? v0.paylasim : undefined,
        rol: "destek",
        rez: [], fiyatlar: {}, giderler: [], gelirler: [], fotolar: [], misafirNot: {}
      };
      (s[1] || []).forEach(function (r) {
        m.rez.push({
          id: r.id, start: r.baslangic, end: r.bitis, guest: r.misafir,
          phone: r.telefon || "", people: r.kisi ? String(r.kisi) : "",
          note: r.aciklama || "", color: r.renk || "#0B5B57", kod: r.kod || undefined,
          tutar: say((maliHar[r.id] || {}).tutar), ekUcret: say((maliHar[r.id] || {}).ek_ucret),
          depozito: (maliHar[r.id] && maliHar[r.id].depozito_tutar !== null && maliHar[r.id].depozito_tutar !== undefined)
            ? { tutar: say(maliHar[r.id].depozito_tutar), tarih: maliHar[r.id].depozito_tarih || undefined } : undefined,
          odemeler: odemeHar[r.id] || [],
          odenen: (odemeHar[r.id] || []).reduce(function (t, x) { return t + x.tutar; }, 0)
        });
      });
      (s[8] || []).forEach(function (g) {
        m.gelirler.push({ id: g.id, aciklama: g.aciklama, tutar: say(g.tutar), tarih: g.tarih });
      });
      (s[3] || []).forEach(function (f) { m.fiyatlar[f.tarih] = say(f.tutar); });
      (s[2] || []).forEach(function (g) {
        m.giderler.push({ id: g.id, aciklama: g.aciklama, tutar: say(g.tutar), tarih: g.tarih,
                          foto: g.fis_yol ? { id: g.id, tam: g.fis_yol, thumb: g.fis_yol } : undefined });
      });
      (s[4] || []).forEach(function (f) {
        m.fotolar.push({ id: f.id, url: f.yol, tam: f.yol, thumb: f.yol, sira: f.sira });
      });
      (s[5] || []).forEach(function (n) {
        m.misafirNot[n.anahtar] = { not: n.aciklama || "", sonTeklif: n.son_teklif || "" };
      });
      m.__anlik = anlik(m);
      return m;
    });
  };

  // ---------------- değişiklik karşılaştırma ----------------
  function anlik(v) {
    var o = { villa: JSON.stringify([v.ad, v.color, v.bilgi || {}, v.paylasim || null]),
              rez: {}, mali: {}, odeme: {}, fiyat: {}, gider: {}, gelir: {}, foto: {}, not: {} };
    (v.rez || []).forEach(function (r) {
      o.rez[r.id] = JSON.stringify([r.start, r.end, r.guest, r.phone, r.people, r.note, r.color, r.kod]);
      o.mali[r.id] = JSON.stringify([r.tutar || 0, r.ekUcret || 0,
        r.depozito ? r.depozito.tutar : null, r.depozito ? r.depozito.tarih : null]);
      (r.odemeler || []).forEach(function (x) {
        o.odeme[x.id] = JSON.stringify([r.id, x.tutar, x.tarih, x.not || ""]);
      });
    });
    Object.keys(v.fiyatlar || {}).forEach(function (k) { o.fiyat[k] = String(v.fiyatlar[k]); });
    (v.giderler || []).forEach(function (g) {
      o.gider[g.id] = JSON.stringify([g.aciklama, g.tutar, g.tarih, (g.foto && g.foto.tam) || null]);
    });
    (v.gelirler || []).forEach(function (g) {
      o.gelir[g.id] = JSON.stringify([g.aciklama, g.tutar, g.tarih]);
    });
    (v.fotolar || []).forEach(function (f, i) { if (f.url) o.foto[f.id] = JSON.stringify([f.url, i]); });
    Object.keys(v.misafirNot || {}).forEach(function (k) {
      o.not[k] = JSON.stringify([v.misafirNot[k].not || "", v.misafirNot[k].sonTeklif || ""]);
    });
    return o;
  }

  function fark(eski, yeni) {
    var ekle = [], sil = [];
    Object.keys(yeni).forEach(function (k) { if (eski[k] !== yeni[k]) ekle.push(k); });
    Object.keys(eski).forEach(function (k) { if (!(k in yeni)) sil.push(k); });
    return { ekle: ekle, sil: sil };
  }

  // ---------------- kaydet ----------------
  VT.villaYaz = function (v) {
    // yeni villa: önce ana kaydı oluştur
    var k = VT.kullanici();
    if (!k) return Promise.reject(new Error("Oturum bulunamadı, tekrar giriş yapın."));
    return api("villalar", {
      method: "POST", donus: "return=minimal",
      body: { id: v.id, sahip: k.id, ad: v.ad, renk: v.color,
              bilgi: v.bilgi || {}, paylasim: v.paylasim || {} }
    }).then(function (d) { v.rol = "sahip"; v.__anlik = anlik(v); return d; });
  };

  // İlk paylaşımda: sayfa dosyası yüklenmeden önce paylaşım bilgisi villa kaydına yazılır
  VT.paylasimYaz = function (v) {
    return api("villalar?id=eq." + v.id, {
      method: "PATCH", donus: "return=representation",
      body: { paylasim: v.paylasim || {}, guncelleme: new Date().toISOString() }
    }).then(function (d) {
      if (Array.isArray(d) && !d.length) throw new Error("Paylaşım bilgisi kaydedilemedi.");
      return d;
    });
  };

  VT.senkron = function (v) {
    if (!VT.girisli() || !v) return Promise.resolve();
    var sahip = v.rol === "sahip";
    var y = anlik(v), e = v.__anlik || { villa: "", rez: {}, mali: {}, odeme: {}, fiyat: {}, gider: {}, gelir: {}, foto: {}, not: {} };
    var isler = [];

    var destek = v.rol === "destek";
    if (y.villa !== e.villa && (sahip || destek)) {
      isler.push(api("villalar?id=eq." + v.id, {
        method: "PATCH",
        body: { ad: v.ad, renk: v.color, bilgi: v.bilgi || {}, paylasim: v.paylasim || {},
                guncelleme: new Date().toISOString() }
      }));
    }

    var rz = fark(e.rez, y.rez);
    if (rz.ekle.length) {
      isler.push(api("rezervasyonlar", { method: "POST", donus: "resolution=merge-duplicates",
        body: rz.ekle.map(function (id) {
          var r = v.rez.filter(function (x) { return x.id === id; })[0];
          return { id: r.id, villa_id: v.id, baslangic: r.start, bitis: r.end, misafir: r.guest,
                   telefon: r.phone || null, kisi: parseInt(r.people, 10) || null,
                   aciklama: r.note || null, renk: r.color, kod: r.kod || null,
                   guncelleme: new Date().toISOString() };
        }) }));
    }
    rz.sil.forEach(function (id) { isler.push(api("rezervasyonlar?id=eq." + id, { method: "DELETE" })); });

    // Para bilgileri (mali, ödemeler) yalnız sahip yazar. Bakıcı hiç göndermez: tutarı sunucu hesaplar.
    // Destek modunda (yönetici) önceden de yazılmıyordu; değişmedi.
    var bakici = v.rol === "bakici";
    var para = sahip || destek;   // destek modunda yönetici de yazar (izni veritabanı verir)
    if (para) {
      var ml = fark(e.mali, y.mali);
      ml.ekle.forEach(function (id) {
        var r = v.rez.filter(function (x) { return x.id === id; })[0];
        if (!r) return;
        isler.push(api("rezervasyon_mali", { method: "POST", donus: "resolution=merge-duplicates",
          body: [{ rezervasyon_id: r.id, villa_id: v.id, tutar: r.tutar || 0, ek_ucret: r.ekUcret || 0,
                   depozito_tutar: r.depozito ? r.depozito.tutar : null,
                   depozito_tarih: r.depozito ? r.depozito.tarih : null }] }));
      });

      var od = fark(e.odeme, y.odeme);
      if (od.ekle.length) {
        var satirlar = [];
        v.rez.forEach(function (r) {
          (r.odemeler || []).forEach(function (x) {
            if (od.ekle.indexOf(x.id) >= 0)
              satirlar.push({ id: x.id, villa_id: v.id, rezervasyon_id: r.id,
                              tutar: x.tutar, tarih: x.tarih, aciklama: x.not || null });
          });
        });
        if (satirlar.length) isler.push(api("odemeler", { method: "POST", donus: "resolution=merge-duplicates", body: satirlar }));
      }
      od.sil.forEach(function (id) { isler.push(api("odemeler?id=eq." + id, { method: "DELETE" })); });

    }
    if (sahip || destek) {
      var fy = fark(e.fiyat, y.fiyat);
      if (fy.ekle.length) {
        isler.push(api("fiyatlar", { method: "POST", donus: "resolution=merge-duplicates",
          body: fy.ekle.map(function (t) { return { villa_id: v.id, tarih: t, tutar: v.fiyatlar[t] }; }) }));
      }
      fy.sil.forEach(function (t) {
        isler.push(api("fiyatlar?villa_id=eq." + v.id + "&tarih=eq." + t, { method: "DELETE" }));
      });

      var gl = fark(e.gelir, y.gelir);
      if (gl.ekle.length) {
        isler.push(api("gelirler", { method: "POST", donus: "resolution=merge-duplicates",
          body: gl.ekle.map(function (id) {
            var g = v.gelirler.filter(function (x) { return x.id === id; })[0];
            return { id: g.id, villa_id: v.id, aciklama: g.aciklama, tutar: g.tutar, tarih: g.tarih };
          }) }));
      }
      gl.sil.forEach(function (id) { isler.push(api("gelirler?id=eq." + id, { method: "DELETE" })); });
    }

    var gd = fark(e.gider, y.gider);
    if (gd.ekle.length) {
      isler.push(api("giderler", { method: "POST", donus: "resolution=merge-duplicates",
        body: gd.ekle.map(function (id) {
          var g = v.giderler.filter(function (x) { return x.id === id; })[0];
          return { id: g.id, villa_id: v.id, aciklama: g.aciklama, tutar: g.tutar, tarih: g.tarih,
                   fis_yol: (g.foto && /^https?:/.test(g.foto.tam)) ? g.foto.tam : null,
                   ekleyen: g.ekleyen || VT.kullanici().id };
        }) }));
    }
    gd.sil.forEach(function (id) { isler.push(api("giderler?id=eq." + id, { method: "DELETE" })); });

    var ft = fark(e.foto, y.foto);
    if (ft.ekle.length) {
      isler.push(api("villa_fotograflar", { method: "POST", donus: "resolution=merge-duplicates",
        body: ft.ekle.map(function (id) {
          var f = v.fotolar.filter(function (x) { return x.id === id; })[0];
          return { id: f.id, villa_id: v.id, yol: f.url, sira: v.fotolar.indexOf(f) };
        }) }));
    }
    ft.sil.forEach(function (id) { isler.push(api("villa_fotograflar?id=eq." + id, { method: "DELETE" })); });

    var nt = fark(e.not, y.not);
    if (nt.ekle.length) {
      isler.push(api("misafir_notlari", { method: "POST", donus: "resolution=merge-duplicates",
        body: nt.ekle.map(function (k) {
          var n = v.misafirNot[k];
          return { villa_id: v.id, anahtar: k, aciklama: n.not || null, son_teklif: n.sonTeklif || null };
        }) }));
    }

    if (bakici) {
      isler = isler.map(function (pr) {
        return pr.catch(function (er) {
          if (/row-level security|permission denied|\(403\)/i.test(String((er && er.message) || ""))) return null;
          throw er;
        });
      });
    }
    return Promise.all(isler).then(function () {
      v.__anlik = y;
      // bakıcı rezervasyon ekledi/sildi: kalan tutarları sunucudan tazele
      if (bakici && (rz.ekle.length || rz.sil.length)) {
        VT.bakiciKalanlar(v).then(function () {
          try { window.dispatchEvent(new CustomEvent("vt-kalanlar", { detail: v.id })); } catch (e) {}
        });
      }
    });
  };

  // Kalıcı silme yok: silindi_tarih doldurulur, 30 gün "Silinen villalar"da kalır
  VT.silinenler = [];
  VT.villaSil = function (v) {
    return api("villalar?id=eq." + v.id, { method: "PATCH", donus: "return=representation",
      body: { silindi_tarih: new Date().toISOString() } });
  };
  VT.villaGeriGetir = function (id) {
    return api("villalar?id=eq." + id, { method: "PATCH", donus: "return=representation",
      body: { silindi_tarih: null } }).then(function (d) {
      if (Array.isArray(d) && !d.length) throw new Error("Bu villayı geri getirme yetkiniz yok.");
      return d;
    });
  };

  // ---------------- davet ----------------
  VT.davetOlustur = function (villaId) {
    var harf = "ABCDEFGHJKLMNPRSTUVYZ23456789", kod = "";
    for (var i = 0; i < 6; i++) kod += harf[Math.floor(Math.random() * harf.length)];
    return api("davetler", {
      method: "POST", donus: "return=representation",
      body: { kod: kod, villa_id: villaId, rol: "bakici", olusturan: VT.kullanici().id }
    }).then(function () { return kod; });
  };

  VT.davetiKullan = function (kod) {
    return VT.rpc("daveti_kullan", { p_kod: String(kod || "").toUpperCase().trim() });
  };

  VT.hesabiSil = function () {
    return VT.rpc("hesabimi_sil").then(function () { oturumYaz(null); });
  };

  // ---------------- yerel veriyi taşıma ----------------
  VT.yereliTasi = function (yerelVillalar, ilerle) {
    var sira = Promise.resolve(), toplam = yerelVillalar.length, n = 0;
    yerelVillalar.forEach(function (v) {
      sira = sira.then(function () {
        n++; if (ilerle) ilerle(n, toplam, v.ad);
        var eski = {};
        v.id = yeniId();
        (v.rez || []).forEach(function (r) {
          eski[r.id] = yeniId(); r.id = eski[r.id];
          (r.odemeler || []).forEach(function (o) { o.id = yeniId(); });
        });
        (v.giderler || []).forEach(function (g) { g.id = yeniId(); });
        (v.gelirler || []).forEach(function (g) { g.id = yeniId(); });
        (v.fotolar || []).forEach(function (f) { f.id = yeniId(); });
        v.__anlik = null;
        return VT.villaYaz(v).then(function () {
          v.__anlik = { villa: "", rez: {}, mali: {}, odeme: {}, fiyat: {}, gider: {}, gelir: {}, foto: {}, not: {} };
          return VT.senkron(v);
        });
      });
    });
    return sira.then(function () { return yerelVillalar; });
  };

  window.VT = VT;
})();
