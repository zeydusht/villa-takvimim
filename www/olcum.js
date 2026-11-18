/* ============================================================
   VİLLA TAKVİM — kullanım ölçümü (Görev 29.1–29.2)
   VT.olay(ad, veri): olay kuyruğa girer, toplu olarak rest/v1/olaylar'a gönderilir.
   KVKK: veri içinde isim, telefon, e-posta, misafir adı, villa adı, fiyat, tutar, adres, tarih, not ya da serbest metin
   OLMAZ. Yalnız aşağıdaki listede tanımlı alanlar ve türler geçer: sayı, evet/hayır, listeden seçilmiş kısa değer.
   Ölçüm asla beklenmez, hata göstermez, uygulamayı yavaşlatmaz.
   ============================================================ */
(function () {
  "use strict";
  var C = window.VILLA_CONFIG || {};
  var URL_ = String(C.supabaseUrl || "").replace(/\/+$/, "");
  var KEY = String(C.supabaseKey || "");
  var TERCIH = "vt-olcum";              // "0" = kapalı (Hesap → Kullanım istatistiklerini paylaş)
  var EN_COK = 100, TOPLU = 20, ARALIK = 15000, HATA_SINIRI = 5;

  // ---- izinli olaylar ve alanları ----
  // s: sayı (0–100000, tam sayı) · b: evet/hayır · k: kısa anahtar (a-z, 0-9, _; en çok 30) · dizi: yalnız bu değerler
  var KISA = /^[a-z0-9_]{1,30}$/;
  var IZIN = {
    uygulama_ac: {}, ekran_gor: {},
    villa_ekle: {}, villa_sil: {},
    rez_ekle: { gece: "s", kisi: "s" }, rez_duzenle: {}, rez_sil: {},
    opsiyon_ekle: {}, teklif_olustur: {}, teklif_paylas: {}, paylasim_linki: {},
    foto_yukle: { adet: "s" },
    bakici_davet: {}, bakici_katildi: {},
    musaitlik_ara: { villa_sayisi: "s", sonuc: "s" }, secip_gonder: { adet: "s" },
    odeme_ekle: {}, gider_ekle: {}, pdf_indir: {},
    rehber_basla: { konu: "k" }, rehber_bitir: { konu: "k" }, rehber_kapat: { konu: "k", adim: "s" },
    yazi_boyutu: { deger: ["normal", "buyuk", "cokbuyuk"] }, dil: { deger: ["tr", "en"] },
    bildirim_izni: { verildi: "b" },
    ilk_an: { tur: ["rez", "villa", "teklif"] },
    cakisma_acildi: {}, cakisma_cozuldu: { nasil: ["ayni_rez", "baska_villa", "dis_iptal", "biz_iptal", "diger"] },
    pro_goster: {}, pro_satin_al: { sonuc: ["tamam", "iptal", "hata"] }, pro_geri_yukle: { sonuc: ["tamam", "yok", "hata"] },
    hata: { tur: "hataTur", yer: "hataYer" }
  };
  function temizle(ad, veri) {
    var sema = IZIN[ad], o = {};
    if (!veri || typeof veri !== "object") return o;
    Object.keys(sema).forEach(function (k) {
      var t = sema[k], v = veri[k];
      if (v === undefined || v === null) return;
      if (t === "s") { v = Number(v); if (isFinite(v)) o[k] = Math.max(0, Math.min(100000, Math.round(v))); }
      else if (t === "b") o[k] = !!v;
      else if (t === "k") { v = String(v).toLowerCase(); if (KISA.test(v)) o[k] = v; }
      else if (t === "hataTur") { v = String(v); if (/^[A-Za-z]{1,40}$/.test(v)) o[k] = v; }
      else if (t === "hataYer") { v = String(v); if (/^[A-Za-z0-9_.-]{1,40}:\d{1,7}$/.test(v)) o[k] = v; }
      else if (Array.isArray(t)) { v = String(v); if (t.indexOf(v) >= 0) o[k] = v; }
    });
    return o;
  }

  // ---- ortam ----
  var oturum = (function () {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8; return v.toString(16); });
  })();
  function platform() {
    try { var p = window.Capacitor && Capacitor.getPlatform && Capacitor.getPlatform(); if (p === "ios" || p === "android") return p; } catch (e) {}
    return "web";
  }
  var surum = String(C.surum || "").slice(0, 20) || null;
  function ekran() {
    try { var e = window.VT && VT.olcumEkran ? String(VT.olcumEkran() || "") : ""; return /^[a-z][a-z0-9_]{0,29}$/.test(e) ? e : null; }
    catch (x) { return null; }
  }
  function acik() { try { return localStorage.getItem(TERCIH) !== "0"; } catch (e) { return true; } }

  // ---- kuyruk ----
  var K = [], tekrar = null, gidiyor = false;
  function olay(ad, veri) {
    try {
      if (!IZIN.hasOwnProperty(ad) || !acik()) return;
      var VT = window.VT;
      if (!VT || !VT.kurulu || !VT.kurulu()) return;
      K.push({ ad: ad, ekran: ekran(), veri: temizle(ad, veri), platform: platform(), surum: surum, oturum: oturum });
      if (K.length > EN_COK) K.splice(0, K.length - EN_COK);
      if (K.length >= TOPLU) setTimeout(gonder, 0);
    } catch (e) {}
  }
  // gönderilebilir mi: oturum açık ve hesap onaylı. Profil henüz yüklenmediyse bekle (kuyruk korunur); diğer durumlarda at.
  function durum() {
    var VT = window.VT;
    if (!acik() || !VT || !VT.girisli || !VT.girisli()) return "at";
    if (!VT.profil) return "bekle";
    return VT.onayli && VT.onayli() ? "gonder" : "at";
  }
  function post(parti, son) {
    var t = window.VT && VT.oturum && VT.oturum.access_token;
    if (!t) return Promise.reject(new Error("oturum yok"));
    return fetch(URL_ + "/rest/v1/olaylar", {
      method: "POST", keepalive: !!son,
      headers: { apikey: KEY, Authorization: "Bearer " + t, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(parti)
    }).then(function (r) { if (!r.ok) throw new Error("olay " + r.status); });
  }
  function gonder(son) {
    try {
      var d = durum();
      if (d === "at") { K = []; tekrar = null; return; }
      if (d === "bekle" || gidiyor) return;
      if (navigator.onLine === false) return;            // çevrimdışı: kuyrukta bekler (en çok 100)
      // önce bir kez başarısız olan parti (ikinci deneme), sonra yeni olaylar
      var parti, ikinci = false;
      if (tekrar) { parti = tekrar; tekrar = null; ikinci = true; }
      else { if (!K.length) return; parti = K.splice(0, K.length); }
      gidiyor = true;
      post(parti, son).then(function () { gidiyor = false; }, function () {
        gidiyor = false;
        if (!ikinci) tekrar = parti;                      // ağ hatası: bir kez daha dene, sonra at
      });
    } catch (e) { gidiyor = false; }
  }
  setInterval(function () { gonder(false); }, ARALIK);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") gonder(true); });
  window.addEventListener("pagehide", function () { gonder(true); });

  // ---- 29.2 hata yakalama: yalnız hata adı ve dosya:satır (mesaj gönderilmez; içinde kişisel veri olabilir) ----
  var hataSay = 0, hataGoruldu = {};
  function dosyaSatir(dosya, satir) {
    var d = String(dosya || "").split(/[?#]/)[0].split("/").pop() || "satir_ici";
    return d + ":" + (parseInt(satir, 10) || 0);
  }
  function hataGonder(tur, yer) {
    if (hataSay >= HATA_SINIRI) return;                  // oturum başına en çok 5
    var anahtar = tur + "@" + yer;
    if (hataGoruldu[anahtar]) return;                    // aynı hata bir kez sayılır (döngüdeki hata 5 hakkı yemesin)
    hataGoruldu[anahtar] = true;
    hataSay++;
    olay("hata", { tur: tur, yer: yer });
  }
  window.addEventListener("error", function (e) {
    try {
      if (!e || (e.target && e.target !== window)) return;   // yüklenemeyen resim vb. değil, yalnız betik hataları
      // yalnız uygulamanın kendi dosyaları: tarayıcı eklentileri ve başka sitelerden gelen ("Script error.") hatalar sayılmaz
      if (!e.error && !e.filename) return;                // başka kaynaktan gelen içi boş "Script error."
      if (e.filename && /^(https?:)?\/\//.test(e.filename) && e.filename.indexOf(location.origin) !== 0) return;
      var tur = (e.error && e.error.name) || "Error";
      hataGonder(tur, dosyaSatir(e.filename, e.lineno));
    } catch (x) {}
  });
  window.addEventListener("unhandledrejection", function (e) {
    try {
      var r = e && e.reason, tur = (r && r.name) || "Rejection", yer = "bilinmiyor:0";
      var m = r && r.stack && String(r.stack).match(/([A-Za-z0-9_.-]+\.(?:js|html))(?:\?[^:\s)]*)?:(\d+)/);
      if (m) yer = m[1] + ":" + m[2];
      hataGonder(tur, yer);
    } catch (x) {}
  });

  // ---- dışa açılan ----
  function bagla() {
    var VT = window.VT; if (!VT) return;
    VT.olay = olay;
    VT.olcumAcik = acik;
    VT.olcumAyarla = function (a) {
      try { if (a) localStorage.removeItem(TERCIH); else localStorage.setItem(TERCIH, "0"); } catch (e) {}
      if (!a) { K = []; tekrar = null; }
    };
    VT.olcumIzinli = function () { return Object.keys(IZIN); };   // test ve belge için
  }
  bagla();
  if (!window.VT) document.addEventListener("DOMContentLoaded", bagla);
})();
