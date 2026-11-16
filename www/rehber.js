/* Görev 19: Rehber motoru — tek ve yeniden kullanılabilir.
   Ekranın geri kalanı koyu perdeyle kapanır, sadece ilgili yer ("delik") açık kalır; baloncuk ne yapılacağını söyler.
   Her işlemin rehberi VERİ olarak tanımlanır (index.html → "19 REHBERLER"); bu dosyada işleme özel kod yoktur.

   Rehber = { ad, adimlar:[…], basari:"Rezervasyon kaydedildi", basariAlt:"…", bitis_olayi:"kaydedildi:rez", sormaz, bitince(fn) }
   Adım   = {
     id        : "tarih1"                        (isteğe bağlı; donus için)
     hedef     : "seçici" | fn → öğe | [öğe…]     vurgulanır; birden çok öğe → hepsini kapsayan tek delik; null → delik yok
                 gerekirse önce ekrana kaydırılır.
     metin     : "…" | fn                         büyük, sade cümle (18 px, en fazla 2 satır); *kelime* vurgulanır (renkli, kalın değil)
     bekle     : "dokunus" | "deger" | "olay" | "ileri"
                 dokunus → hedefe (ya da adim.dokun seçicisine uyan öğeye) dokununca geçer
                 deger   → alana (adim.deger; yoksa hedefteki ilk input) yazı girilince baloncukta "Tamam" çıkar
                 olay    → Rehber.bildir(adim.olay) gelince ya da adim.kosul() doğru olunca geçer ("tarih seçildi", "kaydedildi"…)
                 ileri   → sadece bilgi; "İleri"
     atla_eger : fn → true ise adım atlanır (adıma gelince bakılır; ör. tarihler zaten seçiliyse)
     hazirla   : fn                               adım görünmeden önce çalışır
     cikis     : fn                               adımdan çıkılınca (sonraki adıma geçince ya da rehber bitince) çalışır
     donus     : {olay:"adimId"}                  bu olay gelirse o adıma dönülür (ör. seçim temizlendi → 1. adım)
     geri      : fn                               "Geri"de önce bu çalışır (ör. başlangıç seçimini kaldır)
     istege    : true                             hedef yoksa adım atlanır (yoksa rehber sessizce kapanır)
     dokunulmaz: true                             delik görünür ama dokunuş geçmez
     soluk     : fn → [öğe]                       deliğin içinde kalan ama bu adımla ilgisi olmayan öğeler (karartılır, dokunulmaz)
     gizli     : true                             perde ve baloncuk yok; yalnız olayı bekler (ör. fotoğraflar yüklenince ✓)
   }
   Kullanım: Rehber.ayarla({cevir, titret, ikon, bildir, kenar}); Rehber.baslat(tanim); Rehber.bildir("olay");
   Yardımlı mod tercihleri cihazda (localStorage "vt-yardim"; okunamazsa varsayılan: açık). */
(function () {
  "use strict";
  var R = {};
  var A = { cevir: function (s) { return s; }, titret: function () {}, ikon: null, bildir: null, kenar: null };
  R.ayarla = function (o) { for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) A[k] = o[k]; };
  var azH = function () { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var cev = function (s) { try { return A.cevir(s); } catch (e) { return s; } };
  var titret = function (t) { try { A.titret(t); } catch (e) {} };
  var simdi = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };

  // ================= 19.10 SÖZLÜK: aynı tür adım hep aynı cümle =================
  // İngilizceleri dil.js'te (anahtar = bu cümlenin kendisi).
  var M = R.M = {
    // tarih adımları (rezervasyon, teklif, opsiyon, uygulama turu: birebir aynı)
    tarihGiris: "Misafirin *gireceği* güne dokunun.",
    tarihCikis: "Şimdi misafirin *çıkacağı* güne dokunun.",
    tarihSec: "Giriş ve çıkış tarihini seçin.",
    // misafir bilgileri
    adYaz: "Misafirin adını yazın.",
    adIstege: "Misafirin adı (isteğe bağlı).",
    telefon: "Misafirin telefonu (isteğe bağlı).",
    kisi: "Kaç kişi gelecek? − ve + ile ayarlayın.",
    // tutarlar
    ucret: "Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.",
    kapora: "Kapora aldıysanız açın ve tutarı yazın.",
    tutarYaz: "Tutarı yazın.",
    odemeTutar: "Tamamını aldıysanız bu düğmeye dokunun. Farklıysa tutarı yazın.",
    odemeTutarYaz: "Alınan tutarı yazın.",
    // kaydet
    kaydet: "Kaydetmek için dokunun.",
    rezKaydet: "Rezervasyonu kaydetmek için dokunun.",
    // teklif
    teklifFiyat: "İndirim yapmak için %5, %10 ya da %15'e dokunun ya da fiyatı yazın.",
    teklifGecerlilik: "Teklif ne kadar geçerli olsun?",
    teklifMesaj: "Misafire gidecek mesaj bu. İsterseniz değiştirebilirsiniz.",
    teklifGonder: "Göndermek için ‘WhatsApp'ta gönder’e dokunun.",
    // opsiyon
    opsGecerlilik: "Opsiyon ne kadar geçerli? 1, 2 ya da 3 gün seçin.",
    // fiyat
    fiyatAy: "Fiyat girmek istediğiniz aya dokunun.",
    fiyatHaftaici: "Hafta içi gecelik fiyatı yazın.",
    fiyatHaftasonuAc: "Cuma ve cumartesi geceleri farklıysa buraya dokunup fiyatı yazın.",
    fiyatHaftasonu: "Cuma ve cumartesi gecelerinin fiyatını yazın.",
    // paylaş
    paylasBilgi: "Bu bağlantıyı misafirlerinize gönderin. Fotoğrafları, boş günleri ve fiyatları görürler.",
    paylasDokun: "‘Bağlantıyı paylaş’a dokunun.",
    // ödeme ve yerleştirme
    yerlestir: "Misafiri yerleştirdiniz mi? Yerleştirdiyseniz ‘Evet’e dokunun.",
    // gider
    giderTur: "Giderin türüne dokunun.",
    giderFis: "Fişin fotoğrafını ekleyebilirsiniz (isteğe bağlı).",
    // fotoğraf
    fotoKaynak: "Telefondaki fotoğraflar için ‘Telefondan seç’e, Drive'dakiler için ‘Google Drive'dan al’a dokunun.",
    driveLink: "Drive klasörünün bağlantısını yapıştırın.",
    driveBul: "‘Fotoğrafları bul’a dokunun.",
    driveEkle: "‘Hepsini ekle’ye dokunun.",
    // bakıcı
    bakiciVilla: "Bakıcı eklemek istediğiniz villaya dokunun.",
    bakiciDavet: "Yeni bakıcı davet etmek için dokunun.",
    bakiciGonder: "Bu kodu ya da bağlantıyı bakıcınıza WhatsApp'tan gönderin.",
    // uygulama turu
    turSira: "Burada her zaman sıradaki iş yazar: kim girecek, ne kadar alınacak.",
    turPanel: "Rezervasyon, teklif ya da opsiyon buradan seçilir.",
    turSekme: "Takvim sekmesinde tüm villalarınızın giriş-çıkışları, Hesap'ta ayarlar.",
    // villa ekleme sihirbazı (19.9: her adımda üstte küçük ipucu)
    villa1: "Villanızın adını ve bulunduğu yeri yazın.",
    villa2: "Kaç kişi kalabilir? − ve + ile ayarlayın.",
    villa3: "Villanızda olanlara dokunun. Sonra ‘İleri’ye dokunun.",
    villa4: "Bu ayın gecelik fiyatını yazın.",
    villa5: "Villanızın fotoğraflarını ekleyin. Sonra da ekleyebilirsiniz.",
    villa6: "Misafirlerin size yazacağı WhatsApp numarasını yazın.",
    villa7: "Misafirlere göndereceğiniz sayfayı tek dokunuşla oluşturun."
  };

  // ================= 19.2 YARDIMLI MOD TERCİHLERİ (cihazda) =================
  var ANAHTAR = "vt-yardim", P = null;
  function tercih() {
    if (P) return P;
    var x = null;
    try { x = JSON.parse(localStorage.getItem(ANAHTAR) || "null"); } catch (e) { x = null; }
    if (!x || typeof x !== "object") x = {};
    P = { acik: x.acik !== false, kapali: x.kapali || {}, tamam: x.tamam || {}, soruldu: x.soruldu || {} };
    return P;
  }
  function tercihYaz() { try { localStorage.setItem(ANAHTAR, JSON.stringify(P)); } catch (e) {} }
  R.modAcik = function () { return tercih().acik; };
  R.modAyarla = function (ac) { tercih().acik = !!ac; tercihYaz(); };
  // bu işlem rehberle mi başlasın: mod açık ve bu işlemin yardımı kapatılmamış
  R.gerekli = function (ad) { var p = tercih(); return p.acik && !p.kapali[ad]; };
  R.kapaliSayisi = function () { return Object.keys(tercih().kapali).length; };
  R.hepsiniAc = function () { var p = tercih(); p.kapali = {}; p.soruldu = {}; p.tamam = {}; tercihYaz(); };

  // ================= GÖRÜNÜM =================
  // 19B.5: uygulamanın iki standart eğrisi (index.html :root'ta tanımlı; yoksa aynı değerler)
  var EG = "var(--egri-gecis,cubic-bezier(0.65,0,0.35,1))", EI = "var(--egri-giris,cubic-bezier(0.22,1,0.36,1))";
  function egri(ad) {
    var v = ""; try { v = getComputedStyle(document.documentElement).getPropertyValue("--egri-" + ad).trim(); } catch (e) {}
    return v || (ad === "gecis" ? "cubic-bezier(0.65,0,0.35,1)" : "cubic-bezier(0.22,1,0.36,1)");
  }
  var CSS =
    // 19B: katman hedefin kaydırma kabının içinde (sayfa: belge koordinatı; panel: panelin kaydırma kabı; sabit öğe: ekran)
    // böylece tarayıcının kendi kaydırmasıyla aynı karede hareket eder. Eğriler: --egri-gecis (yer değiştirme), --egri-giris (belirme)
    // katman içeriğin boyunda ve kırpılmış: kendisi kabın kaydırma alanını büyütmez
    ".rh{position:absolute;left:0;top:0;width:100%;height:0;overflow:hidden;z-index:74;pointer-events:none}" +
    ".rh.sabit{position:fixed}.rh.icte{z-index:5}" +
    ".rh.kapaniyor{opacity:0;transition:opacity 180ms " + EG + "}" +
    ".rh.duraklat,.rh.gizli{visibility:hidden}" +
    ".rh.duraklat *,.rh.gizli *{pointer-events:none!important}" +
    // tek "delik": konum transform ile, boyut genişlik/yükseklik ile; perde = büyük box-shadow; çerçeve sabit (nabız yok)
    ".rhDelik{position:absolute;left:0;top:0;width:0;height:0;border-radius:14px;pointer-events:none;will-change:transform;" +
      "box-shadow:0 0 0 3px #9FE0C9,0 0 0 200vmax rgba(16,22,19,.6);transition:opacity 200ms " + EI + "}" +
    ".rh.yok .rhDelik{box-shadow:0 0 0 200vmax rgba(16,22,19,.6)}" +
    ".rh.kayar .rhDelik{transition:transform 450ms " + EG + ",width 450ms " + EG + ",height 450ms " + EG + ",opacity 200ms " + EI + "}" +
    ".rhEngel{position:absolute;left:0;top:0;width:0;height:0;pointer-events:auto;touch-action:none}" +
    ".rhEngel.rhOrta{display:none}.rh.dokunulmaz .rhEngel.rhOrta{display:block}" +
    ".rhSoluk{position:absolute;left:0;top:0;width:0;height:0;pointer-events:auto;touch-action:none;background:rgba(16,22,19,.6);border-radius:12px}" +
    ".rhBalon{position:absolute;left:16px;right:16px;top:0;margin:0 auto;max-width:26rem;pointer-events:auto;transition:opacity 200ms " + EI + "}" +
    // baloncuk çerçeveyle aynı eğri ve sürede, aynı anda kayar
    ".rh.kayar .rhBalon{transition:top 450ms " + EG + ",opacity 200ms " + EI + "}" +
    ".rh.araniyor .rhBalon,.rh.araniyor .rhDelik{opacity:0;pointer-events:none}" +
    ".rhIc{background:#fff;color:#101613;border-radius:18px;padding:.25rem 1rem 1rem;box-shadow:0 12px 32px rgba(0,0,0,.28);position:relative}" +
    ".rhUst{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-right:-.625rem}" +
    ".rhSay{font-size:.875rem;letter-spacing:.18em;color:#B8C2BC;white-space:nowrap}" +
    ".rhSay .on{color:#0B5B57}" +
    ".rhKapat{min-height:3rem;padding:0 .625rem;border:0;background:none;color:#5F6A64;font:inherit;font-size:.9375rem;" +
      "white-space:nowrap;border-radius:99px;cursor:pointer}" +
    ".rhKapat:active{background:#F1F5F3}" +
    ".rhMetin{font-size:1.125rem;line-height:1.4;margin-top:.125rem}" +
    ".rhMetinEski{position:absolute;left:1rem;right:1rem;font-size:1.125rem;line-height:1.4;pointer-events:none}" +
    ".rhVurgu{color:#0B5B57;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}" +
    ".rhAlt{display:flex;gap:.5rem;margin-top:.875rem}" +
    ".rhAlt.hide,.rhAlt .hide{display:none}" +
    ".rhAlt button{min-height:3rem;border-radius:.75rem;font:inherit;font-size:1rem;padding:0 1.125rem;cursor:pointer;text-align:center}" +
    ".rhGeri{background:#fff;color:#101613;border:2px solid #5F6A64}" +
    ".rhIleri{flex:1;background:#0B5B57;color:#fff;border:0}" +
    ".rhAlt button:active{transform:scale(.97)}" +
    ".rhOk{position:absolute;left:50%;width:16px;height:16px;margin-left:-8px;background:#fff;transform:rotate(45deg);border-radius:3px}" +
    ".rhOk.ust{top:-7px}.rhOk.alt{bottom:-7px}.rhOk.yok{display:none}" +
    // başarı ve soru kartı
    ".rhSon{position:fixed;inset:0;z-index:76;display:flex;align-items:center;justify-content:center;padding:1.5rem;" +
      "background:rgba(16,22,19,.35)}" +
    ".rhSon.kapaniyor{opacity:0;transition:opacity 180ms " + EG + "}" +
    ".rhKart{background:#fff;border-radius:24px;padding:1.75rem 1.5rem 1.5rem;text-align:center;width:100%;max-width:21rem;" +
      "box-shadow:0 16px 40px rgba(0,0,0,.25)}" +
    ".rhTik{width:4.5rem;height:4.5rem;border-radius:50%;background:#0B5B57;color:#fff;display:flex;align-items:center;" +
      "justify-content:center;margin:0 auto 1rem;font-size:2.25rem;line-height:1}" +
    ".rhKartBas{font-family:var(--serif,Georgia,serif);font-weight:400;font-size:1.5rem;line-height:1.25}" +
    ".rhKartAlt{font-size:1rem;line-height:1.45;color:#5F6A64;margin-top:.5rem}" +
    ".rhKart .rhSoruBtn{display:block;width:100%;min-height:3.25rem;border-radius:.75rem;font:inherit;font-size:1rem;margin-top:.625rem;cursor:pointer;text-align:center}" +
    ".rhKart .rhEvet{background:#0B5B57;color:#fff;border:0;margin-top:1.25rem}" +
    ".rhKart .rhHayir{background:#fff;color:#101613;border:2px solid #5F6A64}" +
    // sihirbaz ipucu baloncuğu (perdesiz)
    ".rhIpucu{display:flex;gap:.625rem;align-items:flex-start;background:#E3EFEC;color:#0B3E3B;border-radius:14px;" +
      "padding:.75rem .875rem;font-size:1rem;line-height:1.4;margin:0 0 1rem;position:relative}" +
    ".rhIpucu svg{flex:none;margin-top:.0625rem}" +
    "@media (prefers-reduced-motion: reduce){.rhDelik,.rhBalon,.rh.kayar .rhDelik,.rh.kayar .rhBalon{transition:none}" +
      ".rh.kapaniyor,.rhSon.kapaniyor{transition:none}}";
  function cssKur() {
    if (document.getElementById("rhCss")) return;
    var s = document.createElement("style"); s.id = "rhCss"; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }
  // *kelime* → vurgulu (kalın değil)
  function metinHTML(m) {
    return esc(cev(m)).replace(/\*([^*]+)\*/g, '<span class="rhVurgu">$1</span>');
  }
  function ikonHTML(ad, boy) {
    try { if (A.ikon) return A.ikon(ad, { boy: boy || 20 }); } catch (e) {}
    return "";
  }

  // ================= DURUM =================
  var D = null;   // etkin rehber
  var B = null;   // ekrandaki başarı / soru kartı
  R.aktif = function (ad) { return !!D && !D.a_gizli() && (!ad || D.t.ad === ad); };
  R.calisiyor = function (ad) { return !!D && (!ad || D.t.ad === ad); };
  R.basariVar = function () { return !!B; };

  function gorunur(e) {
    if (!e || !e.getBoundingClientRect || !e.isConnected) return false;
    var r = e.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return false;
    var s = getComputedStyle(e);
    return s.visibility !== "hidden" && s.display !== "none";
  }
  function ustPanel() {
    var l = document.querySelectorAll(".overlay:not(.kapaniyor)");
    return l.length ? l[l.length - 1] : null;
  }
  // hedef: seçici (önce en üstteki panelde aranır) | fonksiyon | öğe | dizi → görünür öğeler
  function hedefler(a) {
    var h = a && a.hedef; if (!h) return [];
    var l;
    try { l = typeof h === "function" ? h() : h; } catch (e) { l = null; }
    if (typeof l === "string") {
      var ov = document.querySelectorAll(".overlay:not(.kapaniyor)"), x = null;
      for (var i = ov.length - 1; i >= 0 && !x; i--) x = ov[i].querySelector(l);
      x = x || document.querySelector(l);
      l = x ? [x] : [];
    }
    if (!l) return [];
    if (!Array.isArray(l)) l = [l];
    return l.filter(gorunur);
  }
  // 19B.4: klavye açıkken hedefin içindeki odaklı alan (etiketiyle) asıl hedef olur: baloncuk onu kapatmaz
  function klavyeAcik() {
    var kl = 0; try { if (A.klavye) kl = A.klavye() || 0; } catch (e) {}
    var vv = window.visualViewport;
    return kl > 0 || !!(vv && window.innerHeight - vv.height > 80);
  }
  function odakAlani(els) {
    var ae = document.activeElement;
    if (!els.length || !ae || !/^(INPUT|TEXTAREA)$/.test(ae.tagName) || !klavyeAcik()) return els;
    if (!els.some(function (x) { return x.contains(ae); })) return els;
    return [ae.closest(".field") || ae];
  }
  R.hedefte = function (el) {
    if (!D || !D.a || D.a.gizli || !el) return false;
    return hedefler(D.a).some(function (x) { return x.contains(el); });
  };
  function birlesik(els) {
    var r = null;
    els.forEach(function (e) {
      var q = e.getBoundingClientRect();
      if (!r) r = { left: q.left, top: q.top, right: q.right, bottom: q.bottom };
      else { r.left = Math.min(r.left, q.left); r.top = Math.min(r.top, q.top); r.right = Math.max(r.right, q.right); r.bottom = Math.max(r.bottom, q.bottom); }
    });
    if (r) { r.width = r.right - r.left; r.height = r.bottom - r.top; }
    return r;
  }
  // görünen alan (klavye açıkken klavyenin üstü)
  function alan() {
    var vv = window.visualViewport, H = window.innerHeight, ust = 0, yuk = H;
    if (vv) { ust = vv.offsetTop; yuk = vv.height; }
    var alt = ust + yuk, kl = 0;
    try { if (A.klavye) kl = A.klavye() || 0; } catch (e) {}
    if (kl) alt = Math.min(alt, H - kl);   // uygulamada (resize: none) klavye görünen alanı küçültmez
    return { ust: ust, alt: alt, W: window.innerWidth, H: Math.max(H, ust + yuk) };
  }
  function atlaMi(a) { try { return !!(a.atla_eger && a.atla_eger()); } catch (e) { return false; } }
  function esles(beklenen, olay) {
    if (!beklenen) return false;
    return Array.isArray(beklenen) ? beklenen.indexOf(olay) >= 0 : beklenen === olay;
  }

  // ================= BAŞLAT / ADIMLAR =================
  R.baslat = function (t, sec) {
    if (!t || !t.adimlar || !t.adimlar.length) return false;
    sec = sec || {};
    if (D && D.t.ad === t.ad && !D.a_gizli()) return false;   // aynı rehber zaten sürüyor
    if (D) bitir(false);
    cssKur();
    var o = document.createElement("div");
    o.className = "rh araniyor yok";
    o.innerHTML = '<div class="rhDelik"></div>' +
      '<div class="rhEngel"></div><div class="rhEngel"></div><div class="rhEngel"></div><div class="rhEngel"></div><div class="rhEngel rhOrta"></div>' +
      '<div class="rhBalon" role="dialog" aria-modal="true" aria-live="polite"><div class="rhIc">' +
        '<div class="rhUst"><span class="rhSay"></span><button type="button" class="rhKapat">' + esc(cev("Yardımı kapat")) + "</button></div>" +
        '<div class="rhMetin"></div>' +
        '<div class="rhAlt"><button type="button" class="rhGeri">' + esc(cev("Geri")) + '</button><button type="button" class="rhIleri"></button></div>' +
      '</div><span class="rhOk ust"></span></div>';
    document.body.appendChild(o);
    var q = function (s) { return o.querySelector(s); };
    D = {
      t: t, o: o, i: -1, a: null, gecmis: [], raf: 0, anahtar: "", basari: null, basariAlt: null,
      delik: q(".rhDelik"), balon: q(".rhBalon"), ic: q(".rhIc"), ok: q(".rhOk"), ilk: true,
      say: q(".rhSay"), metin: q(".rhMetin"), alt: q(".rhAlt"), geri: q(".rhGeri"), ileri: q(".rhIleri"),
      engel: o.querySelectorAll(".rhEngel"),
      a_gizli: function () { return !!(this.a && this.a.gizli); }
    };
    o.addEventListener("click", function (e) {
      if (!D || D.o !== o) return;
      if (e.target.closest(".rhKapat")) { titret("hafif"); bitir(false); return; }
      if (e.target.closest(".rhGeri")) { titret("hafif"); geri(); return; }
      if (e.target.closest(".rhIleri")) { titret("hafif"); ilerle(); return; }
      if (e.target.closest(".rhEngel,.rhSoluk")) { salla(); }
    });
    // perde üstünde kaydırma yok (sayfa hedeften kaçmasın)
    o.addEventListener("touchmove", function (e) { if (e.target.closest(".rhEngel,.rhSoluk") && e.cancelable) e.preventDefault(); }, { passive: false });
    adimaGit(sec.bas || 0, 1);
    D.raf = requestAnimationFrame(dongu);
    return true;
  };

  function adimaGit(i, yon, gecmiseYazma) {
    if (!D) return;
    var l = D.t.adimlar, n = l.length;
    while (i >= 0 && i < n && atlaMi(l[i])) i += yon;
    if (i < 0) return;                       // geri gidilecek adım yok
    if (i >= n) { bitir(true); return; }
    var onceki = D.i;
    if (D.a && D.a.cikis) { try { D.a.cikis(); } catch (e) {} }
    if (onceki >= 0 && !gecmiseYazma && yon > 0) D.gecmis.push(onceki);
    D.i = i; D.a = l[i];
    var a = D.a;
    if (a.hazirla) { try { a.hazirla(); } catch (e) {} }
    D.bulundu = false; D.bas = simdi(); D.yokBas = 0; D.anahtar = ""; D.sabitK = ""; D.sabitN = 0;
    D.o.classList.toggle("gizli", !!a.gizli);
    D.o.classList.toggle("dokunulmaz", !!a.dokunulmaz);
    // sadece ilk adımda gizli başlar (200 ms'de solarak belirir); sonraki adımlarda delik eski yerinde bekler, sonra kayar
    if (D.ilk) D.o.classList.add("araniyor");
    // yazı alanından başka bir adıma geçince klavye kapanır (sıradaki yer görünsün)
    if (a.bekle !== "deger") {
      var ae = document.activeElement;
      if (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName)) { try { ae.blur(); } catch (e) {} }
    }
    D.metinBekliyor = true;
    if (a.gizli || !a.hedef) { icerik(false); D.metinBekliyor = false; }
  }
  // 19B.2: delik ve baloncuk yeni hedefe 450 ms'de (--egri-gecis) aynı anda, tek harekette kayar
  function kaydir() {
    if (azH()) return;
    D.o.classList.add("kayar"); clearTimeout(D.kayT);
    D.kayT = setTimeout(function () { if (D) D.o.classList.remove("kayar"); }, 480);
  }
  function ilerle() { if (D) adimaGit(D.i + 1, 1); }
  function geri() {
    if (!D || !D.gecmis.length) return;
    var a = D.a;
    if (a && a.geri) { try { a.geri(); } catch (e) {} }
    var j = D.gecmis.pop();
    adimaGit(j, -1, true);
  }
  function idBul(id) {
    var l = D.t.adimlar;
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return i;
    return -1;
  }
  function geriGosterilir() {
    if (!D.gecmis.length) return false;
    var onceki = D.t.adimlar[D.gecmis[D.gecmis.length - 1]];
    // önceki adım bir şey değiştirdiyse (tarih seçildi, panel açıldı) "Geri" ancak adımın kendi geri işiyle olur
    return !!(D.a.geri || (onceki && (onceki.bekle === "ileri" || onceki.bekle === "deger")));
  }

  // gecis: metin 120 ms çapraz geçişle değişir (eski solarken yeni belirir)
  function icerik(gecis) {
    var a = D.a, l = D.t.adimlar, h = "";
    if (gecis && !azH() && D.metin.innerHTML && D.metin.animate) {
      var eski = document.createElement("div");
      eski.className = "rhMetinEski"; eski.setAttribute("aria-hidden", "true");
      eski.innerHTML = D.metin.innerHTML; eski.style.top = D.metin.offsetTop + "px";
      D.ic.appendChild(eski);
      eski.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: "linear", fill: "forwards" })
        .finished.then(function () { eski.remove(); }, function () { eski.remove(); });
      D.metin.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: "linear" });
    }
    // adım sayacı ●●○○: geçilen + şimdiki + atlanmayacak sonrakiler
    var top = 0, sira = 0;
    for (var j = 0; j < l.length; j++) {
      var say = j === D.i || D.gecmis.indexOf(j) >= 0 || (j > D.i && !l[j].gizli && !atlaMi(l[j]));
      if (!say) continue;
      top++; if (j <= D.i) sira++;
      h += '<span class="' + (j <= D.i ? "on" : "") + '">' + (j <= D.i ? "●" : "○") + "</span>";
    }
    D.say.innerHTML = top > 1 ? h : "";
    D.say.setAttribute("aria-label", cev(sira + "/" + top));
    var m = typeof a.metin === "function" ? a.metin() : a.metin;
    D.metin.innerHTML = metinHTML(m || "");
    var sonAdim = D.i === sonGorunen();
    D.ileri.textContent = cev(a.bekle === "deger" ? "Tamam" : (sonAdim ? "Bitir" : "İleri"));
    D.ileri.classList.toggle("hide", !(a.bekle === "ileri" || (a.bekle === "deger" && degerVar())));
    D.geri.classList.toggle("hide", !geriGosterilir());
    D.alt.classList.toggle("hide", D.ileri.classList.contains("hide") && D.geri.classList.contains("hide"));
  }
  function sonGorunen() {
    var l = D.t.adimlar;
    for (var j = l.length - 1; j > D.i; j--) if (!l[j].gizli && !atlaMi(l[j])) return j;
    return D.i;
  }
  function degerAlani() {
    var a = D.a, e = null;
    if (a.deger) { var up = ustPanel(); e = (up && up.querySelector(a.deger)) || document.querySelector(a.deger); }
    if (!e) { var h = hedefler(a)[0]; e = h && (h.matches && h.matches("input,textarea") ? h : h.querySelector("input,textarea")); }
    return e;
  }
  function degerVar() { var e = degerAlani(); return !!(e && String(e.value || "").trim()); }

  // yanlış yere dokunuldu: baloncuk hafifçe sallanır
  function salla() {
    if (!D) return;
    titret("hafif");
    if (azH() || !D.ic.animate) return;
    D.ic.animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(7px)" },
      { transform: "translateX(-4px)" }, { transform: "translateX(0)" }], { duration: 320, easing: egri("giris") });
  }

  // ================= DÖNGÜ: hedefi izle, deliği ve baloncuğu yerleştir =================
  function dongu() {
    if (!D) return;
    var d = D;
    D.raf = requestAnimationFrame(dongu);
    var a = D.a; if (!a) return;
    // görünmez bekleme (ör. fotoğraflar yükleniyor): 10 dakikada olay gelmezse sessizce biter
    if (a.gizli) { if (simdi() - D.bas > 600000) bitir(false); return; }
    if (a.bekle === "olay" && a.kosul) {
      var ok = false; try { ok = !!a.kosul(); } catch (e) {}
      if (ok) { ilerle(); return; }
    }
    var els = odakAlani(hedefler(a)), t = simdi();
    if (a.hedef && !els.length) {
      if (!D.bulundu) {
        // hedef hiç çıkmadı: isteğe bağlı adım atlanır (ör. bakıcıda ücret kartı yok); değilse rehber sessizce kapanır
        if (t - D.bas > 700) { if (a.istege) adimaGit(D.i + 1, 1); else bitir(false); }
      } else {
        // hedef kayboldu (panel kapandı, başka ekrana geçildi): bir süre bekle, gelmezse rehber sessizce kapanır
        if (!D.yokBas) D.yokBas = t;
        if (t - D.yokBas > 1500) bitir(false);
      }
      return;
    }
    D.yokBas = 0;
    // başka bir panel (uyarı, ayrıntı) hedefin üstünü kapattıysa rehber o kapanana kadar bekler
    var up = ustPanel();
    var ortu = !!(up && els.length && !els.some(function (x) { return up.contains(x); }));
    if (ortu !== !!D.ortu) { D.ortu = ortu; D.o.classList.toggle("duraklat", ortu); D.anahtar = ""; }
    if (ortu) return;
    if (!D.bulundu) {
      // hedef yerine oturana kadar (panel açılırken kayıyor olabilir) bekle: 3 kare aynı yerde ya da 600 ms
      var q = birlesik(els), k = [q.left, q.top, q.width, q.height].map(Math.round).join(",");
      if (k !== D.sabitK) { D.sabitK = k; D.sabitN = 0; }
      if (++D.sabitN < 3 && t - D.bas < 600) return;
      kapYerles(els[0]);
      D.bulundu = true; D.boy = q.height; gorunurYap(els);
      if (D.metinBekliyor) { D.metinBekliyor = false; icerik(!D.ilk); }
      if (!D.ilk) kaydir();
      D.ilk = false; D.anahtar = "";
      D.o.classList.remove("araniyor");
    } else {
      // hedef büyüdüyse (ör. kapora alanı açıldı) ya da görünen alan değiştiyse (klavye açıldı/kapandı) yeniden ekrana getir
      var hb = birlesik(els).height, ga = alan().alt;
      if (Math.abs(hb - D.boy) > 40 || (D.alanAlt && Math.abs(ga - D.alanAlt) > 40)) { D.boy = hb; D.alanAlt = ga; gorunurYap(els); }
      D.alanAlt = ga;
    }
    if (a.bekle === "deger") {
      var dv = degerVar();
      if (dv === D.ileri.classList.contains("hide")) {
        D.ileri.classList.toggle("hide", !dv);
        D.alt.classList.toggle("hide", !dv && D.geri.classList.contains("hide"));
        D.anahtar = "";
      }
    }
    if (d === D) yerlestir(els);
  }
  // hedefin kabı: sabit (position:fixed) bir panelin içindeyse o panel (kaydırma kabı), sabit başka bir öğeyse ekran,
  // değilse sayfa (belge). Katman bu kaba yerleşir; kaydırmada tarayıcı katmanı hedefle aynı karede taşır.
  function kapBul(el) {
    for (var p = el; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
      if (getComputedStyle(p).position === "fixed") return p.classList.contains("overlay") ? { el: p, tur: "icte" } : { el: document.body, tur: "sabit" };
    }
    return { el: document.body, tur: "sayfa" };
  }
  function kapYerles(el) {
    var k = kapBul(el);
    if (D.o.parentNode === k.el && D.kapTur === k.tur) return;
    // kap değişti (ör. takvimden panele): delik eski ekran yerinden yeni kaba kayarak geçsin
    var eski = D.kapTur ? D.delik.getBoundingClientRect() : null;
    D.o.classList.remove("kayar");
    k.el.appendChild(D.o);
    D.kapTur = k.tur;
    D.o.classList.toggle("sabit", k.tur === "sabit");
    D.o.classList.toggle("icte", k.tur === "icte");
    D.anahtar = ""; D.yaz = {};
    if (eski && eski.width) {
      var o = D.o.getBoundingClientRect();
      yaz(D.delik, "transform", "translate(" + Math.round(eski.left - o.left) + "px," + Math.round(eski.top - o.top) + "px)");
      yaz(D.delik, "width", Math.round(eski.width) + "px"); yaz(D.delik, "height", Math.round(eski.height) + "px");
      void D.delik.offsetWidth;
      kaydir();
    }
  }
  // stil yazımı yalnız değer değişince (her karede gereksiz yazım yok; geçiş baştan başlamaz)
  function yaz(el, ozellik, deger) {
    var k = el._rh || (el._rh = {});
    if (k[ozellik] === deger) return;
    k[ozellik] = deger; el.style[ozellik] = deger;
  }
  function kutu(el, l, t, w, h) {
    yaz(el, "left", Math.round(l) + "px"); yaz(el, "top", Math.round(t) + "px");
    yaz(el, "width", Math.max(0, Math.round(w)) + "px"); yaz(el, "height", Math.max(0, Math.round(h)) + "px");
  }
  // görünen alan: ekran (klavye açıkken klavyenin üstü) ∩ kabın kutusu (panel klavyenin üstünde biter)
  function gorunenAlan() {
    var g = alan();
    if (D.kapTur === "icte" && D.o.parentNode) {
      var k = D.o.parentNode.getBoundingClientRect();
      g.ust = Math.max(g.ust, k.top); g.alt = Math.min(g.alt, k.bottom);
    }
    return g;
  }
  // katmanın boyu = kabın içeriği (katman hariç); sabit kapta ekran
  function katmanBoyu() {
    var kap = D.o.parentNode, h = window.innerHeight, c;
    if (!kap) return;
    if (D.kapTur === "icte") {
      h = kap.clientHeight;
      for (c = kap.firstElementChild; c; c = c.nextElementSibling) if (c !== D.o) h = Math.max(h, c.offsetTop + c.offsetHeight);
    } else if (D.kapTur !== "sabit") {
      var org = D.o.getBoundingClientRect().top;
      h = window.innerHeight - org;
      for (c = document.body.firstElementChild; c; c = c.nextElementSibling) {
        if (c === D.o || c.tagName === "SCRIPT" || c.tagName === "STYLE") continue;
        var cs = getComputedStyle(c); if (cs.position === "fixed" || cs.display === "none") continue;
        h = Math.max(h, c.getBoundingClientRect().bottom - org);
      }
    }
    yaz(D.o, "height", Math.ceil(h) + "px");
  }
  function yerlestir(els) {
    var a = D.a, pay = a.pay != null ? a.pay : 8;
    if (els.length) kapYerles(els[0]);
    katmanBoyu();
    var g = gorunenAlan(), W = g.W;
    var o = D.o.getBoundingClientRect(), ox = o.left, oy = o.top;   // kabın başlangıcı (ekran koordinatı)
    var r = els.length ? birlesik(els) : null;
    var bw = D.balon.offsetWidth, bh = D.balon.offsetHeight, bl = D.balon.offsetLeft;
    var x, y, x2, y2, by, okYon;
    if (r) {
      // delik ekrana kırpılmaz (kenarları ekran dışında kalabilir): böylece kaydırmada hedefle birlikte hareket eder
      x = r.left - pay; x2 = r.right + pay; y = r.top - pay; y2 = r.bottom + pay;
      var vy = Math.max(g.ust + 6, y), vy2 = Math.min(g.alt - 6, y2);
      var altBos = g.alt - vy2, ustBos = vy - g.ust;
      if (altBos >= bh + 22) { by = y2 + 14; okYon = "ust"; }
      else if (ustBos >= bh + 22) { by = y - 14 - bh; okYon = "alt"; }
      else {
        // hedef ekrandan büyük: baloncuk altta, delik onun üstünde kalan kısım
        by = g.alt - bh - 10; okYon = "ust";
        if (y2 > by - 14) y2 = Math.max(vy + 24, by - 14);
      }
    } else {
      x = x2 = W / 2; y = y2 = (g.ust + g.alt) / 2; by = Math.round((g.ust + g.alt - bh) / 2); okYon = "yok";
    }
    D.o.classList.toggle("yok", !r);
    var w = x2 - x, h = y2 - y;
    // delik: kap koordinatı (kaydırmada değişmez → yazılmaz → tarayıcı kaydırmasıyla aynı karede)
    yaz(D.delik, "transform", "translate(" + Math.round(x - ox) + "px," + Math.round(y - oy) + "px)");
    yaz(D.delik, "width", Math.max(0, Math.round(w)) + "px"); yaz(D.delik, "height", Math.max(0, Math.round(h)) + "px");
    // dokunuşu yutan perde parçaları: ekranın deliğin dışında kalan kısmı (görünmez; kap koordinatında)
    var H = g.H, ex = -ox, ey = -oy, ex2 = ex + W, ey2 = ey + H, cx = x - ox, cy = y - oy, cx2 = x2 - ox, cy2 = y2 - oy;
    kutu(D.engel[0], ex, ey, W, Math.max(0, cy - ey));
    kutu(D.engel[1], ex, cy2, W, Math.max(0, ey2 - cy2));
    kutu(D.engel[2], ex, cy, Math.max(0, cx - ex), cy2 - cy);
    kutu(D.engel[3], cx2, cy, Math.max(0, ex2 - cx2), cy2 - cy);
    kutu(D.engel[4], cx, cy, cx2 - cx, cy2 - cy);
    var sl = [];
    if (a.soluk) { try { sl = (a.soluk() || []).filter(gorunur); } catch (e) { sl = []; } }
    D.soluk = D.soluk || [];
    while (D.soluk.length < sl.length) {
      var yeni = document.createElement("div"); yeni.className = "rhSoluk"; D.o.insertBefore(yeni, D.balon); D.soluk.push(yeni);
    }
    D.soluk.forEach(function (el, i) {
      if (i >= sl.length) { el.style.display = "none"; return; }
      var q = sl[i].getBoundingClientRect();
      var l = Math.max(x, q.left - 4), u = Math.max(y, q.top - 4), rr = Math.min(x2, q.right + 4), aa = Math.min(y2, q.bottom + 4);
      el.style.display = ""; kutu(el, l - ox, u - oy, rr - l, aa - u);
    });
    // baloncuk: kap koordinatında "top" (transform değil: "hareketi azalt" açıkken basılı öğelerin transform'u sıfırlanıyor)
    yaz(D.balon, "top", Math.round(by - oy) + "px");
    D.ok.className = "rhOk " + okYon;
    if (r) {
      var cxo = Math.max(22, Math.min(bw - 22, (x + x2) / 2 - ox - bl));
      yaz(D.ok, "left", Math.round(cxo) + "px");
    }
  }
  // hedef görünmüyorsa (ya da baloncuğa yer yoksa) önce ona kaydır
  function kaydirici(el) {
    for (var p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
      var s = getComputedStyle(p);
      if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 1) return p;
    }
    return null;
  }
  function gorunurYap(els) {
    if (D.a.kaydirma === false) return;
    var r = birlesik(els), g = alan(), k = { ust: 0, alt: 0 };
    try { if (A.kenar) k = A.kenar(els[0]) || k; } catch (e) {}
    // hedef [ust, alt] içinde görünmeli (üstte sabit çubuk, altta menü/panel); baloncuk perdenin üstünde her yere girebilir
    var ust = g.ust + (k.ust || 0), alt = g.alt - (k.alt || 0);
    var bh = D.balon.offsetHeight || 150, ARA = 24, hedefUst = null;
    var icinde = function (top) { return top >= ust + 8 && top + r.height <= alt - 8; };
    var altta = function (top) { return top + r.height + ARA + bh <= g.alt - 8; };
    var ustte = function (top) { return top - ARA - bh >= g.ust + 8; };
    if (icinde(r.top) && (altta(r.top) || ustte(r.top))) return;
    if (r.height <= alt - ust - 16) {
      // önce: hedef üstte, baloncuk altında; olmazsa baloncuk üstte, hedef altında; o da olmazsa hedef ortada
      var t1 = ust + 12, t2 = Math.max(ust + 8, g.ust + 8 + bh + ARA);
      if (altta(t1)) hedefUst = t1;
      else if (t2 + r.height <= alt - 8) hedefUst = t2;
      else hedefUst = ust + (alt - ust - r.height) / 2;
    } else {
      if (r.top >= ust - 4 && r.top <= ust + 40) return;
      hedefUst = ust + 8;
    }
    var dy = Math.round(r.top - hedefUst);
    if (Math.abs(dy) < 4) return;
    var kap = kaydirici(els[0]), dav = azH() ? "auto" : "smooth";
    if (A.kaydir) { try { A.kaydir(kap || window, dy); return; } catch (e) {} }
    try {
      if (kap) kap.scrollBy({ top: dy, behavior: dav });
      else window.scrollBy({ top: dy, behavior: dav });
    } catch (e) { if (kap) kap.scrollTop += dy; else window.scrollBy(0, dy); }
  }

  // dokunuş bekleyen adım: hedefe dokunulunca (uygulamanın kendi işi bittikten sonra) geçilir
  document.addEventListener("click", function (e) {
    if (!D || !D.a || D.a.bekle !== "dokunus" || D.a.gizli || D.ortu) return;
    var els = hedefler(D.a), t = e.target;
    var ic = els.some(function (x) { return x.contains(t); });
    if (ic && D.a.dokun) ic = !!(t.closest && t.closest(D.a.dokun));
    if (!ic) return;
    var i = D.i, d = D;
    setTimeout(function () { if (D === d && D.i === i) ilerle(); }, 80);
  }, true);
  // yazı adımında klavyedeki "Git / Enter" de "Tamam" gibi çalışır
  document.addEventListener("keydown", function (e) {
    if (!D || !D.a || D.a.bekle !== "deger" || e.key !== "Enter") return;
    var el = degerAlani();
    if (el && e.target === el && el.tagName === "INPUT" && String(el.value || "").trim()) { e.preventDefault(); ilerle(); }
  }, true);

  // uygulamadan gelen olay: "baslangic", "aralik", "secimTemizlendi", "panel:fiyat", "kaydedildi:rez"…
  R.bildir = function (olay, veri) {
    if (!D) return;
    var a = D.a, t = D.t;
    if (veri && veri.basari) D.basari = veri.basari;
    if (veri && veri.basariAlt) D.basariAlt = veri.basariAlt;
    if (a && a.donus && a.donus[olay]) {
      var j = idBul(a.donus[olay]);
      if (j >= 0 && j !== D.i) { D.gecmis = D.gecmis.filter(function (x) { return x < j; }); adimaGit(j, 1, true); }
      return;
    }
    if (t.bitis_olayi && esles(t.bitis_olayi, olay)) { bitir(true); return; }
    if (a && a.bekle === "olay" && esles(a.olay, olay)) {
      var i = D.i, d = D;
      // uygulama yeni ekranı / paneli çizsin, sonra sıradaki adım
      requestAnimationFrame(function () { if (D === d && D.i === i) ilerle(); });
    }
  };
  R.kapat = function () { bitir(false); };

  // ================= BİTİŞ: ✓ + "… kaydedildi" + başarı titreşimi =================
  function bitir(tamamlandi) {
    if (!D) return;
    var d = D; D = null;
    cancelAnimationFrame(d.raf); clearTimeout(d.kayT); clearTimeout(d.balT);
    if (d.a && d.a.cikis) { try { d.a.cikis(); } catch (e) {} }
    var o = d.o;
    if (azH()) o.remove();
    else { o.classList.add("kapaniyor"); setTimeout(function () { if (o.parentNode) o.remove(); }, 190); }
    var t = d.t;
    if (tamamlandi) {
      var p = tercih(), sor = false;
      if (!t.sormaz) {
        p.tamam[t.ad] = (p.tamam[t.ad] || 0) + 1;
        if (p.tamam[t.ad] >= 3 && !p.soruldu[t.ad] && p.acik) { p.soruldu[t.ad] = 1; sor = true; }
        tercihYaz();
      }
      var m = d.basari || t.basari;
      if (m) basariGoster(m, d.basariAlt || t.basariAlt, sor ? t.ad : null);
      else if (sor) soruGoster(t.ad);
    }
    if (t.bitince) { try { t.bitince(!!tamamlandi); } catch (e) {} }
  }
  // dışarıdan: rehbersiz biten işlem için de aynı başarı ve sayım (ör. sihirbaz)
  R.tamamla = function (ad, m, alt) {
    var p = tercih(), sor = false;
    p.tamam[ad] = (p.tamam[ad] || 0) + 1;
    if (p.tamam[ad] >= 3 && !p.soruldu[ad] && p.acik) { p.soruldu[ad] = 1; sor = true; }
    tercihYaz();
    if (m) basariGoster(m, alt, sor ? ad : null); else if (sor) soruGoster(ad);
  };
  function sonKart(html, sure, sonra) {
    sonKaldir(true);
    cssKur();
    var o = document.createElement("div");
    o.className = "rhSon"; o.setAttribute("role", "status");
    o.innerHTML = '<div class="rhKart">' + html + "</div>";
    document.body.appendChild(o);
    B = o;
    var k = o.firstChild;
    if (!azH() && k.animate) {
      k.animate([{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1)" }], { duration: 240, easing: egri("giris") });
      o.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: egri("giris") });
    }
    var bitti = false;
    var kapa = function () {
      if (bitti) return; bitti = true; clearTimeout(o._z);
      if (B === o) B = null;
      if (azH()) o.remove(); else { o.classList.add("kapaniyor"); setTimeout(function () { if (o.parentNode) o.remove(); }, 190); }
      if (sonra) sonra();
    };
    o._kapa = kapa;
    if (sure) { o._z = setTimeout(kapa, sure); o.addEventListener("click", kapa); }
    return { o: o, kapa: kapa };
  }
  function sonKaldir(anlik) { if (B) { var b = B; B = null; clearTimeout(b._z); if (anlik) b.remove(); else if (b._kapa) b._kapa(); } }
  function basariGoster(m, alt, sorAd) {
    titret("basari");
    var tik = ikonHTML("tik", 38) || "✓";
    sonKart('<div class="rhTik" aria-hidden="true">' + tik + "</div>" +
      '<div class="rhKartBas">' + esc(cev(m)) + "</div>" +
      (alt ? '<div class="rhKartAlt">' + esc(cev(alt)) + "</div>" : ""),
      alt ? 2200 : 1400,
      sorAd ? function () { setTimeout(function () { soruGoster(sorAd); }, 60); } : null);
  }
  // 19.2: aynı rehber 3 kez sonuna kadar bitince bir kez sorulur
  function soruGoster(ad) {
    var k = sonKart('<div class="rhKartBas">' + esc(cev("Bu işlemi artık biliyor musunuz?")) + "</div>" +
      '<div class="rhKartAlt">' + esc(cev("Bu işlem için yardımı kapatayım mı?")) + "</div>" +
      '<button type="button" class="rhSoruBtn rhEvet">' + esc(cev("Evet, kapat")) + "</button>" +
      '<button type="button" class="rhSoruBtn rhHayir">' + esc(cev("Hayır, açık kalsın")) + "</button>", 0, null);
    k.o.querySelector(".rhEvet").onclick = function () {
      titret("hafif");
      var p = tercih(); p.kapali[ad] = 1; tercihYaz(); k.kapa();
      try { if (A.bildir) A.bildir(cev("Bu işlemin yardımı kapandı. Hesap → Yardım'dan yeniden açabilirsiniz.")); } catch (e) {}
    };
    k.o.querySelector(".rhHayir").onclick = function () { titret("hafif"); k.kapa(); };
  }

  // 19.9: perdesiz küçük ipucu (sihirbazın her adımında üstte)
  R.ipucuHTML = function (m) {
    return '<div class="rhIpucu" role="note">' + ikonHTML("bilgi-i", 20) + "<span>" + metinHTML(m) + "</span></div>";
  };
  R.metinHTML = metinHTML;

  window.Rehber = R;
  // görünüm baştan kurulur (sihirbaz ipucu rehber başlamadan da kullanılır)
  cssKur();
})();
