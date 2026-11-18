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
     ileri_eger: fn                               "İleri" yalnız bu doğruysa etkin (ör. kartta açık düzenleme yoksa)
     soluk     : fn → [öğe]                       deliğin içinde kalan ama bu adımla ilgisi olmayan öğeler (karartılır, dokunulmaz)
     gizli     : true                             perde ve baloncuk yok; yalnız olayı bekler (ör. fotoğraflar yüklenince ✓)
     gec_olay  : "olay" | [..]                    (23.2) bekleme türü ne olursa olsun bu olay gelince sıradaki adıma geçilir
     serbest   : fn → [öğe]                       (28.2) deliğin dışında kalan ama dokunulabilen yerler (vurgulanmaz). Seçim
                                                  değiştirebilen yerler buraya yazılır: rehber kullanıcıyı kilitlemez
   }
   Kullanım: Rehber.ayarla({cevir, titret, ikon, bildir, kenar}); Rehber.baslat(tanim); Rehber.bildir("olay");
   Yardımlı mod tercihi cihazda (localStorage "vt-yardim"; okunamazsa varsayılan: açık).
   Görev 20: perde dokunuşu/kaydırmayı yutmaz (pointer-events:none); hedef dışındaki dokunuşlar belge düzeyinde yakalanıp
   iptal edilir (kaydırma ve sürükleme serbest).
   Görev 21: sabit ODAK HATTI. Hedefin alt kenarı ekranda sabit bir hatta durur (klavye açıkken klavyenin 12 px üstü,
   kapalıyken görünen alanın alttan %28'i; panelde sabit "Kaydet" varsa onun 16 px üstü). Baloncuk hedefin hemen üstünde
   (8 px), hedefin genişliğinde. "İleri"de pencere ve baloncuk yerinde kalır, ARKADAKİ İÇERİK kayar (420 ms, --egri-gecis);
   pencere yeni hedefin boyuna aynı anda, aynı eğriyle uyar. Kaydırma yetmezse kaba geçici boşluk eklenir.
   Görev 22: baloncuktaki ✕ yalnız o anki rehberi kapatır (Yardımlı mod değişmez, bildirim yok); kalınan adım panelde saklanır
   (panelin "?" düğmesi oradan devam ettirir). Kalıcı kapatma yalnız Hesap → Yardım'dan.
   Görev 23: hedef her karede seçiciyle yeniden bulunur. Hedef 300 ms'de
   bulunmazsa adım atlanır (konsola uyarı). Rehberde yakalanmamış hata olursa rehber sessizce kapanır, ekran kullanılabilir kalır.
   Görev 24: klavye hizalaması TEK yerde (index.html klavyeyeHizala): rehber klavyenin oturmuş hâlini kullanır (A.klavye), klavye
   açılırken ara karelerde hiçbir şey hizalamaz. Odaktaki alan rehberin hedefindeyse kaydırmayı klavyeyeHizala yapar; rehber
   yalnız pencereyi ve baloncuğu hedefle birlikte çizer (Rehber.klavyeKutu baloncuğun yerini verir). Görünen alan dinleyicileri,
   ResizeObserver ve geçiş sonrası düzeltme kaldırıldı. Hedef değişince (ör. ücret kartında satır içi düzenleme açıldı) pencere
   300 ms'de yeni hedefe uyar; hedef görünmüyorsa bir kez hizalanır. */
(function () {
  "use strict";
  var R = {};
  var A = { cevir: function (s) { return s; }, titret: function () {}, ikon: null, bildir: null, kenar: null };
  R.ayarla = function (o) { for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) A[k] = o[k]; };
  var azH = function () { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var cev = function (s) { try { return A.cevir(s); } catch (e) { return s; } };
  var titret = function (t) { try { A.titret(t); } catch (e) {} };
  var olcum = function (ad, v) { try { if (A.olay) A.olay(ad, v); } catch (e) {} };
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
    not: "Not eklemek isterseniz yazın (isteğe bağlı).",
    kisi: "Kaç kişi gelecek? − ve + ile ayarlayın.",
    // tutarlar
    ucret: "Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.",
    ucretDuzen: "Yeni tutarı yazın, sonra ‘Tamam’a dokunun.",
    kapora: "Kapora aldıysanız açın ve tutarı yazın.",
    kaporaAc: "Kapora aldıysanız düğmeyi açın.",
    kaporaTutar: "Alınan kapora tutarını yazın.",
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
    // 32.3 dış takvim bağlama
    dtEkle: "Başka sitedeki takvimi bağlamak için ‘Site takvimi bağla’ya dokunun.",
    dtKaynak: "Takvimin geleceği siteye dokunun.",
    dtAdres: "Sitenin verdiği takvim linkini buraya yapıştırın.",
    dtBagla: "‘Bağla’ya dokunun. Link hemen denenir.",
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
    // 26.6 (denetim): rehberi olmayan işlemler
    gelirAd: "Gelirin ne olduğunu yazın (örn. ek hizmet).",
    misafirSec: "Birden fazla misafire teklif göndermek için ‘Birden fazla seç’e dokunun.",
    misafirIsaretle: "Teklif göndereceğiniz misafirlere dokunun.",
    misafirTeklif: "Sonra ‘Teklif hazırla’ya dokunun.",
    fotoSira: "Sırayı değiştirmek için fotoğrafa basılı tutun ve sürükleyin.",
    fotoSec: "Kapak yapmak ya da silmek için ‘Birden fazla seç’e dokunun; fotoğrafı seçip ‘Kapak yap’a ya da ‘Sil’e dokunun.",
    bilgiOda: "Odaları buradan ekleyin: türü, katı ve yatakları.",
    bilgiKural: "Ev kurallarınızı buradan ekleyin; misafirler villa sayfasında görür.",
    bilgiKonum: "Haritadaki konum bağlantısını kopyalayıp buraya yapıştırın.",
    opsCevir: "Misafir kesinleşince ‘Rezervasyona çevir’e dokunun; bilgiler forma kendiliğinden gelir.",
    opsUzat: "Misafir biraz daha düşünecekse süreyi buradan uzatın.",
    teklifCevir: "Misafir kabul edince ‘Rezervasyona çevir’e dokunun; teklif fiyatı forma gelir.",
    teklifTekrar: "Misafire yeniden göndermek için ‘Teklifi tekrar gönder’e dokunun.",
    rezOdeme: "Misafirden ödeme alınca buradan kaydedin.",
    rezDepozito: "Depozitoyu iade ettiyseniz buradan işaretleyin.",
    rezPdf: "Rezervasyon formunu (PDF) misafire göndermek için dokunun.",
    pdfGonder: "Formu misafire göndermek için dokunun.",
    sayfaKaldir: "Sayfayı kapatmak isterseniz en alttaki ‘Villa sayfasını yayından kaldır’a dokunun.",
    // 27.6 müsaitlik arama ("Hangi villam boş?")
    musaitGiris: "Müşterinin istediği *giriş* gününe dokunun.",
    musaitCikis: "Şimdi *çıkış* gününe dokunun.",
    musaitCikisGiris: "Giriş: {g} · şimdi *çıkış* gününe dokunun.",
    musaitGoster: "‘Boş villaları göster’e dokunun.",
    musaitSonuc: "Boş villalar ve toplam fiyatları burada. Göndermek için ‘Seç ve gönder’.",
    musaitSonucSade: "Bu tarihlerde boş olan villalar burada.",
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
  // 22.4: Görev 19–21 sürümlerinde baloncuktaki "Yardımı kapat" Yardımlı modu farkında olmadan kapatıyordu. Bu sürüme geçişte
  // cihazdaki kayıt bir kez sıfırlanır (mod açık; eski işlem başına kapatma kayıtları silinir). s:22 = göç yapıldı.
  var ANAHTAR = "vt-yardim", P = null;
  function tercih() {
    if (P) return P;
    var x = null;
    try { x = JSON.parse(localStorage.getItem(ANAHTAR) || "null"); } catch (e) { x = null; }
    if (!x || typeof x !== "object") x = {};
    if (x.s !== 22) { P = { acik: true, s: 22 }; tercihYaz(); return P; }
    P = { acik: x.acik !== false, s: 22 };
    return P;
  }
  function tercihYaz() { try { localStorage.setItem(ANAHTAR, JSON.stringify(P)); } catch (e) {} }
  R.modAcik = function () { return tercih().acik; };
  R.modAyarla = function (ac) { tercih().acik = !!ac; tercihYaz(); };
  // işlem rehberle mi başlasın: Yardımlı mod açık mı (20.3: işlem bazında kapatma yok)
  R.gerekli = function () { return tercih().acik; };

  // ================= GÖRÜNÜM =================
  // 19B.5: uygulamanın iki standart eğrisi (index.html :root'ta tanımlı; yoksa aynı değerler)
  var EG = "var(--egri-gecis,cubic-bezier(0.65,0,0.35,1))", EI = "var(--egri-giris,cubic-bezier(0.22,1,0.36,1))";
  function egri(ad) {
    var v = ""; try { v = getComputedStyle(document.documentElement).getPropertyValue("--egri-" + ad).trim(); } catch (e) {}
    return v || (ad === "gecis" ? "cubic-bezier(0.65,0,0.35,1)" : "cubic-bezier(0.22,1,0.36,1)");
  }
  // --egri-gecis değerini çözen küçük kübik Bezier (kaydırma ve pencere aynı eğriyle, aynı karede)
  function bezier(x1, y1, x2, y2) {
    var c = function (t, a, b) { return 3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t; };
    return function (x) { if (x <= 0) return 0; if (x >= 1) return 1; var lo = 0, hi = 1, t = x;
      for (var i = 0; i < 24; i++) { t = (lo + hi) / 2; if (c(t, x1, x2) < x) lo = t; else hi = t; } return c(t, y1, y2); };
  }
  var EGRI = null;
  function egriFn() {
    if (EGRI) return EGRI;
    var m = egri("gecis").match(/cubic-bezier\(([^)]+)\)/), v = m ? m[1].split(",").map(parseFloat) : [0.65, 0, 0.35, 1];
    EGRI = bezier(v[0], v[1], v[2], v[3]);
    return EGRI;
  }
  var CSS =
    // 19B: katman hedefin kaydırma kabının içinde (sayfa: belge koordinatı; panel: panelin kaydırma kabı; sabit öğe: ekran)
    // böylece tarayıcının kendi kaydırmasıyla aynı karede hareket eder. Eğriler: --egri-gecis (yer değiştirme), --egri-giris (belirme)
    // katman içeriğin boyunda ve kırpılmış: kendisi kabın kaydırma alanını büyütmez
    ".rh{position:absolute;left:0;top:0;width:100%;height:0;overflow:hidden;z-index:74;pointer-events:none}" +
    ".rh.sabit{position:fixed}.rh.icte{z-index:5}" +
    ".rh.kapaniyor{opacity:0;transition:opacity 200ms " + EG + "}" +
    ".rh.duraklat,.rh.gizli{visibility:hidden}" +
    ".rh.duraklat *,.rh.gizli *{pointer-events:none!important}" +
    // tek "delik": konum transform ile, boyut genişlik/yükseklik ile; perde = büyük box-shadow; çerçeve sabit (nabız yok)
    ".rhDelik{position:absolute;left:0;top:0;width:0;height:0;border-radius:14px;pointer-events:none;will-change:transform;" +
      "box-shadow:0 0 0 3px #9FE0C9,0 0 0 200vmax rgba(16,22,19,.6);transition:opacity 200ms " + EI + "}" +
    ".rh.yok .rhDelik{box-shadow:0 0 0 200vmax rgba(16,22,19,.6)}" +
    // 20.2: perde dokunuşu ve kaydırmayı yutmaz; hedef dışındaki dokunuşu belge düzeyinde yakalayıcı iptal eder
    ".rhSoluk{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;background:rgba(16,22,19,.6);border-radius:12px}" +
    // 21: baloncuk hedefin hemen üstünde, hedefin genişliğinde (konum ve genişlik her karede motor tarafından yazılır)
    ".rhBalon{position:absolute;left:0;top:0;width:300px;pointer-events:auto;transition:opacity 200ms " + EI + "}" +
    ".rh.araniyor .rhBalon,.rh.araniyor .rhDelik{opacity:0;pointer-events:none}" +
    ".rhIc{background:#fff;color:#101613;border-radius:18px;padding:.25rem 1rem 1rem;box-shadow:0 12px 32px rgba(0,0,0,.28);position:relative}" +
    ".rhUst{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-right:-.625rem}" +
    ".rhSay{font-size:.875rem;letter-spacing:.18em;color:#B8C2BC;white-space:nowrap}" +
    ".rhSay .on{color:#0B5B57}" +
    // 22.1: sağ üstte ✕ ve yanında küçük "Kapat": yalnız bu rehberi kapatır
    ".rhKapat{display:inline-flex;align-items:center;gap:.25rem;min-height:3rem;padding:0 .625rem;border:0;background:none;color:#5F6A64;" +
      "font:inherit;font-size:.875rem;white-space:nowrap;border-radius:99px;cursor:pointer}" +
    ".rhKapat:active{background:#F1F5F3}" +
    ".rhKapatX{display:inline-flex;font-size:1.25rem;line-height:1}" +
    ".rhIleri:disabled{opacity:.45}" +
    // 21.1: klavye açıkken yer dar: baloncuk hedefin hemen üstünde tek satır ("Misafirin adını yazın · Tamam ×")
    ".rh.dar .rhIc{display:flex;align-items:center;gap:.5rem;padding:.25rem .25rem .25rem 1rem;border-radius:14px}" +
    ".rh.dar .rhUst{order:3;margin:0}.rh.dar .rhSay,.rh.dar .rhKapatYazi,.rh.dar .rhGeri{display:none}" +
    ".rh.dar .rhKapat{min-width:3rem;padding:0;justify-content:center}" +
    ".rh.dar .rhMetin{flex:1;min-width:0;margin:0;font-size:1rem;line-height:1.3}" +
    ".rh.dar .rhAlt{margin:0}.rh.dar .rhIleri{flex:none;padding:0 1rem}" +
    ".rhUst .rhGeri{min-height:3rem;padding:0 1rem;border-radius:.75rem;font:inherit;font-size:.9375rem;margin-left:auto;background:#fff;color:#101613;border:2px solid #5F6A64}" +
    ".rhMetin{font-size:1.125rem;line-height:1.4;margin-top:.125rem}" +
    ".rhMetinEski{position:absolute;left:1rem;right:1rem;font-size:1.125rem;line-height:1.4;pointer-events:none}" +
    ".rhVurgu{color:#0B5B57;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}" +
    ".rhAlt{display:flex;gap:.5rem;margin-top:.875rem}" +
    ".rhAlt.hide,.rhAlt .hide{display:none}" +
    ".rhAlt button{min-height:3rem;border-radius:.75rem;font:inherit;font-size:1rem;padding:0 1.125rem;cursor:pointer;text-align:center}" +
    ".rhGeri{background:#fff;color:#101613;border:2px solid #5F6A64}" +
    ".rhIleri{flex:1;background:#0B5B57;color:#fff;border:0}" +
    ".rhAlt button:active{transform:scale(.97)}" +
    ".rhOk{display:none}" +
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
    // sihirbaz ipucu baloncuğu (perdesiz)
    ".rhIpucu{display:flex;gap:.625rem;align-items:flex-start;background:#E3EFEC;color:#0B3E3B;border-radius:14px;" +
      "padding:.75rem .875rem;font-size:1rem;line-height:1.4;margin:0 0 1rem;position:relative}" +
    ".rhIpucu svg{flex:none;margin-top:.0625rem}" +
    // 21.3: kaydırma yetmeyince eklenen geçici boşluk (sayfa ya da panel içinde)
    ".rhBosluk{display:block;width:100%;pointer-events:none}" +
    // 22.2: rehber açıkken panellerdeki "?" görünmez (yer tutar, başlık kaymaz)
    "html.rhAcik .rhSoru{visibility:hidden}" +
    "@media (prefers-reduced-motion: reduce){.rhDelik,.rhBalon{transition:none}" +
      ".rh.kapaniyor,.rhSon.kapaniyor{transition:none}}";
  function cssKur() {
    if (document.getElementById("rhCss")) return;
    // 31.10: uygulamanın gövde yazısı 17 px oldu; rehber katmanı eski ölçülerinde kalsın diye bütün rem değerleri
    // --rh-olcek ile çarpılır (index.html: 16/17). Yazı boyutu ayarıyla (Büyük, Çok büyük) yine birlikte büyür.
    var s = document.createElement("style"); s.id = "rhCss";
    s.textContent = CSS.replace(/(-?\d*\.?\d+)rem/g, function (m, n) { return "calc(" + n + "rem * var(--rh-olcek, 1))"; });
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
  // 24.1: klavyenin OTURMUŞ yüksekliği (uygulamadan; açılırken ara karelerde değişmez). Uygulama vermezse görünen alandan.
  function klavyeH() {
    if (A.klavye) { try { return A.klavye() || 0; } catch (e) { return 0; } }
    var vv = window.visualViewport;
    return (vv && window.innerHeight - vv.height > 80) ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;
  }
  // 19B.4: klavye açıkken hedefin içindeki odaklı alan (etiketiyle) asıl hedef olur: baloncuk onu kapatmaz
  function klavyeAcik() { return klavyeH() > 0; }
  function odakGirdi() {
    var ae = document.activeElement;
    return (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName) && klavyeAcik() && D && D.a && hedefler(D.a).some(function (x) { return x.contains(ae); })) ? ae : null;
  }
  function odakAlani(els) {
    var ae = document.activeElement;
    if (!els.length || !ae || !/^(INPUT|TEXTAREA)$/.test(ae.tagName) || !klavyeAcik()) return els;
    if (!els.some(function (x) { return x.contains(ae); })) return els;
    return [ae.closest(".field") || ae.closest(".ucDuzen") || ae];
  }
  R.hedefte = function (el) {
    if (!D || !D.a || D.a.gizli || !el) return false;
    return hedefler(D.a).some(function (x) { return x.contains(el); });
  };
  // panel açılırken (alttan kayma animasyonu) hedefin VARACAĞI yer: panelin transform'u çıkarılır
  function durgunKayma(el) {
    var sh = el.closest && el.closest(".sheet"), ov = sh && sh.parentElement;
    if (!sh || !ov || !ov.classList.contains("overlay")) return 0;
    return sh.getBoundingClientRect().top - (ov.getBoundingClientRect().top + sh.offsetTop - ov.scrollTop);
  }
  function durgunBirlesik(els) {
    var r = birlesik(els), k = durgunKayma(els[0]);
    if (k) { r.top -= k; r.bottom -= k; }
    return r;
  }
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
  // görünen alan (klavye açıkken klavyenin üstü, aksesuar / "Otomatik doldur" çubuğu dahil). 24.1: oturmuş klavyeye göre.
  function alan() {
    var H = window.innerHeight, kl = klavyeH(), ust = 0;
    if (kl && A.klavyeUst) { try { ust = A.klavyeUst() || 0; } catch (e) {} }
    return { ust: ust, alt: H - kl, W: window.innerWidth, H: H };
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
      '<div class="rhBalon" role="dialog" aria-modal="true" aria-live="polite"><div class="rhIc">' +
        '<div class="rhUst"><span class="rhSay"></span><button type="button" class="rhKapat" aria-label="' + esc(cev("Kapat")) + '">' +
          '<span class="rhKapatX" aria-hidden="true">' + (ikonHTML("x", 18) || "×") + '</span><span class="rhKapatYazi">' + esc(cev("Kapat")) + '</span></button></div>' +
        '<div class="rhMetin"></div>' +
        '<div class="rhAlt"><button type="button" class="rhGeri">' + esc(cev("Geri")) + '</button><button type="button" class="rhIleri"></button></div>' +
      '</div><span class="rhOk ust"></span></div>';
    document.body.appendChild(o);
    olcum("rehber_basla", { konu: t.ad });
    var q = function (s) { return o.querySelector(s); };
    D = {
      t: t, o: o, i: -1, a: null, gecmis: [], raf: 0, anahtar: "", basari: null, basariAlt: null,
      delik: q(".rhDelik"), balon: q(".rhBalon"), ic: q(".rhIc"), ok: q(".rhOk"), ilk: true, pay: 4,
      say: q(".rhSay"), metin: q(".rhMetin"), alt: q(".rhAlt"), geri: q(".rhGeri"), ileri: q(".rhIleri"), ust: q(".rhUst"),
      a_gizli: function () { return !!(this.a && this.a.gizli); }
    };
    o.addEventListener("click", guvenli(function (e) {
      if (!D || D.o !== o) return;
      if (e.target.closest(".rhKapat")) { bitir(false, true); return; }
      if (e.target.closest(".rhGeri")) { geri(); return; }
      if (e.target.closest(".rhIleri")) { if (!D.ileri.disabled) ilerle(); else salla(); return; }
    }));
    document.documentElement.classList.add("rhAcik");
    try {
      adimaGit(sec.bas === "bos" ? ilkBos(t) : (sec.bas || 0), 1);
    } catch (e) { cokme(e); return false; }
    if (!D) return true;
    D.raf = requestAnimationFrame(dongu);
    return true;
  };
  // 22.2: "?" ile kalınan adım bilinmiyorsa: ilk boş yazı alanının adımı (yoksa ilk adım)
  function ilkBos(t) {
    var l = t.adimlar;
    for (var i = 0; i < l.length; i++) {
      var a = l[i]; if (a.gizli || atlaMi(a)) continue;
      var e = null;
      if (a.deger) { var up = ustPanel(); e = (up && up.querySelector(a.deger)) || document.querySelector(a.deger); }
      if (!e) hedefler(a).some(function (h) {
        e = h.matches && h.matches("input,textarea") ? h : h.querySelector("input:not([type=hidden]),textarea"); return !!e; });
      if (e && gorunur(e) && !String(e.value || "").trim()) return i;
    }
    return 0;
  }
  // 23.2: rehberde yakalanmamış hata: rehber sessizce kapanır, ekran (form) açık ve kullanılabilir kalır; hata konsola yazılır
  function cokme(e) {
    try { console.error("Rehber hatası (rehber kapatıldı):", e); } catch (x) {}
    try { bitir(false); } catch (x) {
      var d = D; D = null;
      try { if (d) { cancelAnimationFrame(d.raf); if (d.o && d.o.parentNode) d.o.remove(); } } catch (y) {}
      document.documentElement.classList.remove("rhAcik");
    }
  }
  function guvenli(f) {
    return function () { try { return f.apply(this, arguments); } catch (e) { cokme(e); } };
  }

  function adimaGit(i, yon, gecmiseYazma, eksik) {
    if (!D) return;
    var l = D.t.adimlar, n = l.length;
    while (i >= 0 && i < n && atlaMi(l[i])) i += yon;
    if (i < 0) return;                       // geri gidilecek adım yok
    if (i >= n) { bitir(!eksik); return; }   // hedefi bulunamayan adım atlanarak sona gelindiyse "kaydedildi" denmez
    var onceki = D.i;
    if (D.a && D.a.cikis) { try { D.a.cikis(); } catch (e) {} }
    if (onceki >= 0 && !gecmiseYazma && yon > 0) D.gecmis.push(onceki);
    D.i = i; D.a = l[i];
    var a = D.a;
    if (a.hazirla) { try { a.hazirla(); } catch (e) {} }
    D.bulundu = false; D.bas = simdi(); D.yokBas = 0; D.anahtar = ""; D.sabitK = ""; D.sabitN = 0; D.elsK = ""; D.degisti = false;
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
    var m = metinAl(a);
    D.metinSon = m;
    D.metin.innerHTML = metinHTML(m || "");
    var sonAdim = D.i === sonGorunen();
    D.ileri.textContent = cev(a.bekle === "deger" ? "Tamam" : (sonAdim ? "Bitir" : "İleri"));
    D.ileri.classList.toggle("hide", !(a.bekle === "ileri" || (a.bekle === "deger" && degerVar())));
    D.ileri.disabled = !ileriEtkin();
    D.geri.classList.toggle("hide", !geriGosterilir());
    altDuzen();
  }
  function metinAl(a) { try { return (typeof a.metin === "function" ? a.metin() : a.metin) || ""; } catch (e) { return ""; } }
  // 21.1: yalnız "Geri" varsa üst satıra geçer (baloncuk kısa kalır, uzun hedeflerle birlikte sığar)
  function altDuzen() {
    var tekGeri = D.ileri.classList.contains("hide") && !D.geri.classList.contains("hide");
    if (tekGeri && D.geri.parentNode !== D.ust) D.ust.insertBefore(D.geri, D.ust.querySelector(".rhKapat"));
    if (!tekGeri && D.geri.parentNode !== D.alt) D.alt.insertBefore(D.geri, D.ileri);
    D.alt.classList.toggle("hide", D.ileri.classList.contains("hide") && (D.geri.classList.contains("hide") || tekGeri));
  }
  function ileriEtkin() { var a = D.a; try { return !a.ileri_eger || !!a.ileri_eger(); } catch (e) { return true; } }
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
    titret("eksik");   // 31.4: yanlış yere dokunuldu (baloncuk sallanır)
    if (azH() || !D.ic.animate) return;
    D.ic.animate([{ transform: "translateX(0)" }, { transform: "translateX(-8px)" }, { transform: "translateX(7px)" },
      { transform: "translateX(-4px)" }, { transform: "translateX(0)" }], { duration: 320, easing: egri("giris") });
  }

  // ================= DÖNGÜ: hedefi izle, deliği ve baloncuğu yerleştir =================
  function dongu() {
    if (!D) return;
    D.raf = requestAnimationFrame(dongu);
    D.kare = (D.kare || 0) + 1;
    try { donguIc(); } catch (e) { cokme(e); }
  }
  function donguIc() {
    var d = D;
    var a = D.a; if (!a) return;
    // katman kabının içeriğiyle aynı boyda kalır (beklerken de): eski boyu panelin kaydırma alanını uzatmasın
    if (D.o.parentNode) katmanBoyu();
    // görünmez bekleme (ör. fotoğraflar yükleniyor): 10 dakikada olay gelmezse sessizce biter
    if (a.gizli) { if (simdi() - D.bas > 600000) bitir(false); return; }
    if (a.bekle === "olay" && a.kosul) {
      var ok = false; try { ok = !!a.kosul(); } catch (e) {}
      if (ok) { ilerle(); return; }
    }
    var els = odakAlani(hedefler(a)), t = simdi();
    if (a.hedef && !els.length) {
      if (!D.bulundu) {
        // 23.2: hedef hiç çıkmadı: her karede seçiciyle yeniden aranır; 300 ms'de de yoksa adım atlanır (çökme yok)
        if (t - D.bas > 300) {
          if (!a.istege) { try { console.warn("Rehber: hedef bulunamadı, adım atlandı (" + D.t.ad + " / " + (a.id || D.i) + ")"); } catch (e) {} }
          adimaGit(D.i + 1, 1, false, true);
        }
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
      // 24.1: klavye oturmayı bekliyor ya da panel klavye payını değiştiriyor: yerleşim henüz son hâlinde değil, beklenir.
      // (odaktaki alan bu adımın hedefindeyse klavye oturunca adımı klavyeyeHizala yerleştirir: R.klavyeKutu)
      var kh = false; try { kh = !!(A.klavyeHareketli && A.klavyeHareketli()); } catch (e) {}
      if (kh && t - D.bas < 1500) return;
      // hedef yerine oturana kadar (panel açılırken kayıyor olabilir) bekle: 3 kare aynı yerde ya da 600 ms
      var q = durgunBirlesik(els), k = [q.left, q.top, q.width, q.height].map(Math.round).join(",");
      if (k !== D.sabitK) { D.sabitK = k; D.sabitN = 0; }
      if (++D.sabitN < 2 && t - D.bas < 600) return;
      D.bulundu = true; D.boy = q.height;
      if (D.metinBekliyor) { D.metinBekliyor = false; icerik(!D.ilk); }
      // 21.2: yeni hedef odak hattına: içerik kayar, pencere yerinde boy değiştirir (420 ms)
      hizala(els, 420, D.ilk);
      D.ilk = false;
      D.o.classList.remove("araniyor");
      D.elsK = elsAnahtar(els);
    } else if (!D.tw || D.tw.takip) {
      // 24.2: hedef değişti (satır içi düzenleme açıldı / kapandı, klavye oturdu / kapandı): pencere hemen, 300 ms'de yeni
      // hedefe uyar. Kaydırma gerekip gerekmediğine klavye durunca (yerleşim son hâlindeyken) bir kez bakılır.
      var ek = elsAnahtar(els);
      if (ek !== D.elsK) { D.elsK = ek; D.degisti = true; darAyarla(els, odakAlan(els[0])); D.boy = birlesik(els).height; takip(300); }
      if (D.degisti && !D.tw) {
        var kh2 = false; try { kh2 = !!(A.klavyeHareketli && A.klavyeHareketli()); } catch (e) {}
        if (!kh2) { D.degisti = false; hedefDegisti(els); }
      }
    }
    // metni duruma bağlı adım (ör. ücret kartında düzenleme açıkken "Yeni tutarı yazın…"): metin değişince çapraz geçiş
    if (typeof a.metin === "function" && !D.metinBekliyor && metinAl(a) !== D.metinSon) icerik(true);
    var ie = ileriEtkin();
    if (D.ileri.disabled === ie) D.ileri.disabled = !ie;
    if (a.bekle === "deger") {
      var dv = degerVar();
      if (dv === D.ileri.classList.contains("hide")) {
        D.ileri.classList.toggle("hide", !dv);
        altDuzen();
        D.anahtar = "";
      }
    }
    if (d === D) { if (D.tw) gecisAdim(); else yerlestir(els); }
  }
  var KIMLIK = 0;
  function elsAnahtar(els) {
    return els.map(function (e) { return e._rhK || (e._rhK = ++KIMLIK); }).join(",") + (klavyeAcik() ? "k" : "");
  }
  // 24.2: hedef değişti ve klavye durdu. Odaktaki alan hedefteyse kaydırma klavyeyeHizala'nın; hedef baloncuğuyla görünüyorsa
  // kaydırma yok; görünmüyorsa bir kez hizalanır.
  function hedefDegisti(els) {
    if (odakGirdi()) return;
    var g = odakAlan(els[0]), bh = darAyarla(els, g), r = birlesik(els);
    if (r.top - bh - 8 < g.ust + 4 || r.bottom > g.alt - 4) hizala(els, 300);
  }
  // pencere ve baloncuk şimdiki yerlerinden, hedefi her karede izleyerek ona uyar (içeriği kaydırmaz)
  function takip(sure) {
    var dr = D.delik.getBoundingClientRect(), br = D.balon.getBoundingClientRect();
    if (!(dr.width > 0) || D.o.classList.contains("araniyor")) { D.tw = null; return; }
    D.tw = { takip: true, t0: simdi(), sure: azH() ? 0 : sure, S: null,
      eskiD: { l: dr.left, t: dr.top, w: dr.width, h: dr.height }, eskiB: { l: br.left, w: br.width } };
  }
  // baloncuk: klavye açıkken tam biçim hedefin üstüne sığmıyorsa tek satırlık kısa biçim. Baloncuğun boyu döner.
  function darAyarla(els, g) {
    var r = birlesik(els), pay = D.pay, yeniB = balonOlcu(r.left - pay, r.width + 2 * pay, g.W);
    var ew = D.balon.style.width; D.balon.style.width = yeniB.w + "px";
    D.o.classList.remove("dar");
    var bh = D.balon.offsetHeight;
    if (klavyeAcik() && g.ust + 12 + bh + r.height > odakHatti(els[0], g)) { D.o.classList.add("dar"); bh = D.balon.offsetHeight; }
    D.balon.style.width = ew;
    return bh;
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
    // kap değişti (ör. takvimden panele): katman yeni kaba geçer; görsel konum hizala()'da eski yerinden sürdürülür
    k.el.appendChild(D.o);
    D.kapTur = k.tur;
    D.o.classList.toggle("sabit", k.tur === "sabit");
    D.o.classList.toggle("icte", k.tur === "icte");
    D.anahtar = "";
    [D.delik, D.balon].forEach(function (x) { x._rh = {}; });
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
  // 26.1: bir karede bir kez (döngü, yerleştirme ve geçiş aynı karede çağırıyordu); zorla: kap değişti / hizalama
  function katmanBoyu(zorla) {
    if (!zorla && D.kbKare === D.kare) return;
    D.kbKare = D.kare;
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
  // ---------- 21.1 odak hattı ----------
  // kaydırma kabı: panel (overlay) ya da sayfa; hedef sabit ya da yapışkan (sticky) bir öğedeyse kaydırılmaz
  function kaydirKabi(el) {
    for (var p = el; p && p !== document.body; p = p.parentElement) {
      var ps = getComputedStyle(p).position;
      if (ps === "sticky") return null;
      if (ps === "fixed") return p.classList.contains("overlay") ? p : null;
    }
    return window;
  }
  function kabY(S) { return S === window ? (window.scrollY || 0) : S.scrollTop; }
  function kabaYaz(S, y) { if (S === window) window.scrollTo(0, y); else S.scrollTop = y; }
  // 24.1: panelin klavye payı geçişteyse (klavye kapanıyor / açıldı) kaydırma sınırı geçişin SONUNDAKİ değer
  function kabMax(S) {
    if (S === window) return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    var k = 0; try { if (A.klavyeKalan) k = A.klavyeKalan() || 0; } catch (e) {}
    return Math.max(0, S.scrollHeight - S.clientHeight - k);
  }
  // hedefin görünebileceği alan: ekran (klavye hariç) ∩ panel; sayfada üst çubuk ve alt menü/panel hariç
  function odakAlan(el) {
    var g = alan(), k = { ust: 0, alt: 0 };
    try { if (A.kenar) k = A.kenar(el) || k; } catch (e) {}
    var ov = el.closest && el.closest(".overlay");
    var ust = g.ust + (ov ? 0 : (k.ust || 0)), alt = g.alt - (ov ? 0 : (k.alt || 0));
    // panel klavyenin üstünde biter (alt kenarı --klavye ile 250 ms'de iner / çıkar): hat panelin içinde kalır
    if (ov) { var orr = ov.getBoundingClientRect(); ust = Math.max(ust, orr.top); alt = Math.min(alt, orr.bottom); }
    return { ust: ust, alt: alt, W: g.W, ov: ov };
  }
  // hedefin alt kenarının durduğu hat (ekran koordinatı)
  function odakHatti(el, g) {
    if (klavyeAcik()) return g.alt - 12;                              // klavyenin üst kenarının 12 px üstü
    var y = g.alt - 0.28 * (g.alt - g.ust);                         // başparmak hizası: görünen alanın alttan %28'i
    if (g.ov) {
      // panelin sabit "Kaydet" çubuğu varsa onun 16 px üstü
      var as = g.ov.querySelector(".altSabit");
      if (as && !as.contains(el) && getComputedStyle(as).position === "sticky") y = Math.min(y, g.alt - as.offsetHeight - 16);
    }
    return y;
  }
  function balonOlcu(hl, hw, W) {
    var bw = Math.min(Math.max(hw, 260), W - 16);
    var bl = Math.max(8, Math.min(W - 8 - bw, hl + hw / 2 - bw / 2));
    if (hw >= 260 && hl >= 8 && hl + hw <= W - 8) { bl = hl; bw = hw; }
    return { l: bl, w: bw };
  }
  // ekran koordinatındaki pencere + baloncuk → kap koordinatı (kaydırmada değişmez → tarayıcı kaydırmasıyla aynı karede)
  function ciz(d, b) {
    var o = D.o.getBoundingClientRect(), ox = o.left, oy = o.top, pay = D.pay;
    yaz(D.delik, "transform", "translate(" + Math.round(d.l - ox) + "px," + Math.round(d.t - oy) + "px)");
    yaz(D.delik, "width", Math.max(0, Math.round(d.w)) + "px"); yaz(D.delik, "height", Math.max(0, Math.round(d.h)) + "px");
    yaz(D.balon, "left", Math.round(b.l - ox) + "px"); yaz(D.balon, "width", Math.round(b.w) + "px");
    var bh = D.balon.offsetHeight, g = alan();
    // baloncuğun alt kenarı hedefin üst kenarının 8 px üstünde. 31.10: üstte yer yoksa (yazı 17 px olunca hedefler büyüdü)
    // hedefin 8 px altına; altta da yer yoksa ekranın üst kenarına yapışır (ekrandan taşmaz)
    var bt = d.t + pay - 8 - bh;
    if (bt < g.ust + 4) bt = (d.t + d.h - pay + 8 + bh <= g.alt - 4) ? d.t + d.h - pay + 8 : g.ust + 4;
    yaz(D.balon, "top", Math.round(bt - oy) + "px");
    D.delikEkran = d; D.balonEkran = b;
  }
  function solukCiz(d) {
    var a = D.a, sl = [];
    if (a.soluk) { try { sl = (a.soluk() || []).filter(gorunur); } catch (e) { sl = []; } }
    D.soluk = D.soluk || [];
    while (D.soluk.length < sl.length) {
      var yeni = document.createElement("div"); yeni.className = "rhSoluk"; D.o.insertBefore(yeni, D.balon); D.soluk.push(yeni);
    }
    var o = D.o.getBoundingClientRect();
    D.soluk.forEach(function (el, i) {
      if (i >= sl.length) { el.style.display = "none"; return; }
      var q = sl[i].getBoundingClientRect();
      var l = Math.max(d.l, q.left - 4), u = Math.max(d.t, q.top - 4), rr = Math.min(d.l + d.w, q.right + 4), aa = Math.min(d.t + d.h, q.bottom + 4);
      el.style.display = ""; kutu(el, l - o.left, u - o.top, rr - l, aa - u);
    });
  }
  // her kare: pencere hedefi izler (kullanıcı elle kaydırırsa gecikmesiz — 19B.3 / 21.5)
  function yerlestir(els) {
    katmanBoyu();
    var g = alan();
    D.o.classList.toggle("yok", !els.length);
    if (!els.length) {
      var bw = Math.min(360, g.W - 32), bh = D.balon.offsetHeight, cy = (g.ust + g.alt) / 2;
      ciz({ l: g.W / 2, t: cy + bh / 2 + 8 - D.pay, w: 0, h: 0 }, { l: (g.W - bw) / 2, w: bw });
      return;
    }
    var r = birlesik(els), pay = D.pay;
    var d = { l: r.left - pay, t: r.top - pay, w: r.width + 2 * pay, h: r.height + 2 * pay };
    ciz(d, balonOlcu(d.l, d.w, g.W));
    solukCiz(d);
  }
  // 21.2: yeni hedefi odak hattına getir. Pencere ve baloncuk eski ekran yerinden yeni boya geçer; içerik kayar.
  function hizala(els, sure, ilk) {
    if (!els.length) return;
    var a = D.a; D.pay = a.pay != null ? a.pay : 4;
    var pay = D.pay;
    // eski görsel durum (ekran koordinatı): pencere ve baloncuk buradan başlar
    var eskiD = null, eskiB = null;
    if (!ilk) {
      var dr = D.delik.getBoundingClientRect();
      if (dr.width > 0) { eskiD = { l: dr.left, t: dr.top, w: dr.width, h: dr.height }; }
      var br = D.balon.getBoundingClientRect();
      if (br.width > 0) eskiB = { l: br.left, w: br.width };
    }
    kapYerles(els[0]);
    katmanBoyu(true);
    // 24.1: odaktaki yazı alanı bu hedefteyse kaydırma klavyeyeHizala'nın: pencere yalnız hedefe uyar
    if (odakGirdi()) { darAyarla(els, odakAlan(els[0])); takip(sure); return; }
    var S = kaydirKabi(els[0]), g = odakAlan(els[0]), r = durgunBirlesik(els);
    // yapışkan (sticky) hedef (ör. panelin "Kaydet"i): o paneldeki alt boşluk kalkar ki hedef panelin altına otursun
    if (!S && D.bosluk) {
      var ov0 = els[0].closest && els[0].closest(".overlay");
      var kal = D.bosluk.filter(function (b) { return b.S === ov0 && b.yer === "alt"; });
      if (kal.length) { D.bosluk = D.bosluk.filter(function (b) { return kal.indexOf(b) < 0; }); boslukKaldir(kal); }
    }
    var hw = r.width + 2 * pay, hl = r.left - pay, yeniB = balonOlcu(hl, hw, g.W);
    // baloncuğun son genişlikteki boyu (aynı karede ölçülür, ekrana yansımaz); klavye açıkken sığmazsa kısa biçim
    var kl = klavyeAcik(), bh = darAyarla(els, g);
    var dy = 0;
    if (S) {
      var Y = odakHatti(els[0], g);
      // klavye açıkken hedef her zaman klavyenin 12 px üstünde (yazılan görünür kalır);
      // klavye kapalı ve hedef + baloncuk hatta sığmıyorsa (uzun hedef): ikisinin birlikte görünebileceği en düşük konum
      var B = kl ? Y : Math.max(Y, g.ust + 12 + bh + r.height);
      dy = r.bottom - B;
      var s0 = kabY(S), s1 = s0 + dy;
      // 21.3: kaydırma alanı yetmezse geçici boşluk
      if (s1 > kabMax(S) + 0.5) bosluk(S, "alt", s1 - kabMax(S), els[0]);
      for (var n = 0; n < 4 && s0 + dy < -0.5; n++) { bosluk(S, "ust", -(s0 + dy), els[0]); s0 = kabY(S); }
      s1 = Math.max(0, Math.min(kabMax(S), s0 + dy));
      dy = s1 - s0;
      // panel o an açılıyorsa (alttan kayıyor) içerik hemen son yerine konur: panel hedef odak hattında olacak şekilde gelir
      if (Math.abs(durgunKayma(els[0])) > 1) { kabaYaz(S, s1); s0 = s1; }
      D.tw = { t0: simdi(), sure: azH() ? 0 : sure, S: S, s0: s0, s1: s1 };
    } else D.tw = { t0: simdi(), sure: azH() ? 0 : sure, S: null };
    r = durgunBirlesik(els);   // boşluk eklenince hedef yeri (ekranda) değişmez; yine de taze ölç
    var yeniD = { l: hl, t: r.top - dy - pay, w: hw, h: r.height + 2 * pay };
    D.tw.eskiD = eskiD || yeniD; D.tw.yeniD = yeniD;
    D.tw.eskiB = eskiB || yeniB; D.tw.yeniB = yeniB;
    gecisAdim();
  }
  function ara(a, b, e) { return a + (b - a) * e; }
  function gecisAdim() {
    var tw = D.tw, k = tw.sure ? Math.min(1, (simdi() - tw.t0) / tw.sure) : 1, e = egriFn()(k);
    if (tw.takip) {
      // hedef her karede yeniden ölçülür (bu arada klavyeyeHizala içeriği kaydırıyor olabilir)
      var hs = odakAlani(hedefler(D.a)); if (!hs.length) { D.tw = null; return; }
      var q = birlesik(hs), p = D.pay;
      tw.yeniD = { l: q.left - p, t: q.top - p, w: q.width + 2 * p, h: q.height + 2 * p };
      tw.yeniB = balonOlcu(tw.yeniD.l, tw.yeniD.w, alan().W);
    }
    // içerik kaydırması ve pencere boyu aynı karede, aynı eğriyle
    if (tw.S) kabaYaz(tw.S, ara(tw.s0, tw.s1, e));
    katmanBoyu();
    var d = { l: ara(tw.eskiD.l, tw.yeniD.l, e), t: ara(tw.eskiD.t, tw.yeniD.t, e), w: ara(tw.eskiD.w, tw.yeniD.w, e), h: ara(tw.eskiD.h, tw.yeniD.h, e) };
    ciz(d, { l: ara(tw.eskiB.l, tw.yeniB.l, e), w: ara(tw.eskiB.w, tw.yeniB.w, e) });
    if (k >= 1) D.tw = null;
  }
  // ---------- 21.3 geçici boşluk ----------
  // alt: içerik sonuna boşluk (panelde panelin sonuna, sayfada belgenin sonuna)
  // üst: içerik başına boşluk; görsel kayma olmasın diye kaydırma konumu aynı anda telafi edilir
  function bosluk(S, yer, n, ref) {
    if (!(n > 0.5)) return;
    D.bosluk = D.bosluk || [];
    var b = D.bosluk.filter(function (x) { return x.S === S && x.yer === yer; })[0];
    if (!b) {
      var el = document.createElement("div"); el.className = "rhBosluk"; el.setAttribute("aria-hidden", "true"); el.style.height = "0px";
      // sayfada body'nin dolgusu kullanılır (body yatay flex: araya öğe girerse sayfa daralır)
      if (S === window) el = null;
      else {
        var sh = S.querySelector(".sheet") || S.firstElementChild;
        if (yer === "alt") sh.appendChild(el);
        else { el = null; }                               // panelde üst boşluk: panelin üst dolgusu
      }
      b = { S: S, yer: yer, el: el, n: 0 }; D.bosluk.push(b);
    }
    var v0 = ref.getBoundingClientRect().top, y0 = kabY(S);
    b.n += Math.ceil(n);
    boslukYaz(b);
    if (yer === "ust") {
      var v1 = ref.getBoundingClientRect().top;
      if (Math.abs(v1 - v0) > 0.5) kabaYaz(S, y0 + (v1 - v0));
    }
  }
  function boslukYaz(b) {
    var n = b.n;
    if (b.el) { b.el.style.height = n + "px"; return; }
    var hedef = b.S === window ? document.body : b.S;
    if (b.yer === "ust") hedef.style.paddingTop = n ? n + "px" : "";
    // sayfanın alt dolgusu: klavye dolgusuyla toplanır (body.klavyeAcik --rhKlavyePb verir)
    else hedef.style.paddingBottom = n ? "calc(" + n + "px + var(--rhKlavyePb, 0px))" : "";
  }
  // rehber bitince boşluklar yumuşakça kalkar (üst boşlukta içerik yerinde kalsın diye kaydırma telafi edilir)
  function boslukKaldir(list) {
    if (!list || !list.length) return;
    var t0 = simdi(), SURE = azH() ? 0 : 300, f = egriFn();
    var ilk = list.map(function (b) { return b.n; });
    var adim = function () {
      var k = SURE ? Math.min(1, (simdi() - t0) / SURE) : 1, e = f(k);
      list.forEach(function (b, i) {
        var n = Math.round(ilk[i] * (1 - e));
        var ref = b.S === window ? null : (b.S.querySelector(".sheet") || b.S.firstElementChild);
        if (b.yer === "ust" && b.S === window && A.sayfaKaydir) {
          var eski = b.n; b.n = n; boslukYaz(b);
          try { A.sayfaKaydir(n - eski); } catch (e2) {}
          return;
        }
        var v0 = ref ? ref.getBoundingClientRect().top : 0, y0 = kabY(b.S);
        b.n = n; boslukYaz(b);
        if (b.yer === "ust" && ref) { var v1 = ref.getBoundingClientRect().top; if (Math.abs(v1 - v0) > 0.5) kabaYaz(b.S, y0 + (v1 - v0)); }
      });
      if (k < 1) requestAnimationFrame(adim);
      else list.forEach(function (b) { if (b.el && b.el.parentNode) b.el.remove(); });
    };
    adim();
  }
  // ölçüm (testler için): hedef, pencere, baloncuk, odak hattı, klavye üstü
  R.olcum = function () {
    if (!D || !D.a) return null;
    var els = odakAlani(hedefler(D.a)); if (!els.length) return null;
    var r = birlesik(els), d = D.delik.getBoundingClientRect(), b = D.balon.getBoundingClientRect(), g = odakAlan(els[0]);
    var klavyeUst = klavyeAcik() ? window.innerHeight - klavyeH() : null;
    return { hedef: { ust: r.top, alt: r.bottom, sol: r.left, sag: r.right }, pencere: { ust: d.top, alt: d.bottom, sol: d.left, sag: d.right },
      balon: { ust: b.top, alt: b.bottom, sol: b.left, sag: b.right }, hat: odakHatti(els[0], g), alanUst: g.ust, alanAlt: g.alt,
      klavyeUst: klavyeUst, gecis: !!D.tw, adim: D.i };
  };
  // 20.2: rehber açıkken hedefin dışındaki dokunuşlar iptal edilir, baloncuk sallanır. Kaydırma ve sürükleme serbest:
  // parmak 10 px'ten fazla kaydıysa dokunuş sayılmaz. touchend iptal edilince ne tıklama ne odak (klavye) oluşur.
  function engelVar() { return !!(D && D.a && !D.a.gizli && !D.ortu && D.bulundu); }
  function izinli(t) {
    if (!t || !t.closest) return true;
    if (D.o.contains(t) || t.closest(".rhSon")) return true;
    var a = D.a;
    if (a.serbest) { try { if ((a.serbest() || []).some(function (x) { return x && x.contains(t); })) return true; } catch (e) {} }
    if (a.dokunulmaz) return false;
    if (a.soluk) { try { if ((a.soluk() || []).some(function (x) { return x && x.contains(t); })) return false; } catch (e) {} }
    return hedefler(a).some(function (x) { return x.contains(t); });
  }
  var DOK = null;
  document.addEventListener("touchstart", function (e) {
    DOK = null;
    if (!engelVar() || !e.touches || e.touches.length !== 1) return;
    DOK = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: e.target, kaydi: false };
  }, { capture: true, passive: true });
  document.addEventListener("touchmove", function (e) {
    if (!DOK || !e.touches[0]) return;
    if (Math.abs(e.touches[0].clientX - DOK.x) > 10 || Math.abs(e.touches[0].clientY - DOK.y) > 10) DOK.kaydi = true;
  }, { capture: true, passive: true });
  document.addEventListener("touchend", function (e) {
    var d = DOK; DOK = null;
    if (!d || d.kaydi || !engelVar() || izinli(d.t)) return;
    if (e.cancelable) e.preventDefault();
    salla();
  }, { capture: true, passive: false });
  document.addEventListener("click", function (e) {
    // uygulamanın kendi programla tıklamaları (ör. dosya seçiciyi açmak) engellenmez; yalnız kullanıcı dokunuşu
    if (!e.isTrusted || !engelVar() || izinli(e.target)) return;
    e.preventDefault(); e.stopPropagation(); if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    salla();
  }, true);
  // dokunuş bekleyen adım: hedefe dokunulunca (uygulamanın kendi işi bittikten sonra) geçilir
  document.addEventListener("click", guvenli(function (e) {
    if (!D || !D.a || D.a.bekle !== "dokunus" || D.a.gizli || D.ortu) return;
    var els = hedefler(D.a), t = e.target;
    var ic = els.some(function (x) { return x.contains(t); });
    if (ic && D.a.dokun) ic = !!(t.closest && t.closest(D.a.dokun));
    if (!ic) return;
    var i = D.i, d = D;
    setTimeout(guvenli(function () { if (D === d && D.i === i) ilerle(); }), 80);
  }), true);
  // yazı adımında klavyedeki "Git / Enter" de "Tamam" gibi çalışır
  document.addEventListener("keydown", guvenli(function (e) {
    if (!D || !D.a || D.a.bekle !== "deger" || e.key !== "Enter") return;
    var el = degerAlani();
    if (el && e.target === el && el.tagName === "INPUT" && String(el.value || "").trim()) { e.preventDefault(); ilerle(); }
  }), true);
  // 24.1: klavye oturdu ve odaktaki alan rehberin hedefinde (index.html klavyeyeHizala çağırır). Rehber pencereyi ve baloncuğu
  // hedefle birlikte çizer; kaydırmayı klavyeyeHizala yapar. Dönen: hizalanacak kutu ve üstünde baloncuk için gereken yer.
  R.klavyeKutu = function (el) {
    try {
      if (!D || !D.a || D.a.gizli || D.ortu || !R.hedefte(el)) return null;
      var els = odakAlani(hedefler(D.a)); if (!els.length) return null;
      D.pay = D.a.pay != null ? D.a.pay : 4;
      kapYerles(els[0]);
      if (!D.bulundu) {
        // adım klavye açılırken başladı (ör. kapora düğmesi açıldı): adım burada, kaydırmayla aynı anda yerleşir
        D.bulundu = true;
        if (D.metinBekliyor) { D.metinBekliyor = false; icerik(!D.ilk); }
        D.ilk = false;
        D.o.classList.remove("araniyor");
      }
      var g = odakAlan(els[0]), bh = darAyarla(els, g), r = birlesik(els);
      D.boy = r.height;
      takip(300);
      D.elsK = elsAnahtar(els);
      return { kutu: r, ust: bh + 8 };
    } catch (e) { cokme(e); return null; }
  };

  // uygulamadan gelen olay: "baslangic", "aralik", "secimTemizlendi", "panel:fiyat", "kaydedildi:rez"…
  R.bildir = function (olay, veri) { try { bildirIc(olay, veri); } catch (e) { cokme(e); } };
  function bildirIc(olay, veri) {
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
    if (a && ((a.bekle === "olay" && esles(a.olay, olay)) || esles(a.gec_olay, olay))) {
      var i = D.i, d = D;
      // uygulama yeni ekranı / paneli çizsin, sonra sıradaki adım
      requestAnimationFrame(guvenli(function () { if (D === d && D.i === i) ilerle(); }));
    }
  }
  R.kapat = function () { bitir(false); };

  // ================= BİTİŞ: ✓ + "… kaydedildi" + başarı titreşimi =================
  // elle: baloncuktaki ✕ (22.1): yalnız bu rehber kapanır, Yardımlı mod değişmez, bildirim yok. Kalınan adım hedefin
  // panelinde saklanır; panelin "?" düğmesi rehberi oradan sürdürür (22.2).
  function bitir(tamamlandi, elle) {
    if (!D) return;
    var d = D; D = null;
    // 29.1 ölçüm: yalnız rehberin adı ve kalınan adımın sırası
    if (tamamlandi) olcum("rehber_bitir", { konu: d.t.ad }); else olcum("rehber_kapat", { konu: d.t.ad, adim: Math.max(0, d.i) + 1 });
    document.documentElement.classList.remove("rhAcik");
    if (elle && d.a) {
      try {
        var hs = hedefler(d.a), ov = (hs[0] && hs[0].closest && hs[0].closest(".overlay")) || ustPanel();
        if (ov) ov._rhKaldi = { ad: d.t.ad, i: d.i };
      } catch (e) {}
    }
    cancelAnimationFrame(d.raf); clearTimeout(d.balT);
    boslukKaldir(d.bosluk);
    if (d.a && d.a.cikis) { try { d.a.cikis(); } catch (e) {} }
    var o = d.o;
    if (azH()) o.remove();
    else { o.classList.add("kapaniyor"); setTimeout(function () { if (o.parentNode) o.remove(); }, 230); }
    var t = d.t;
    if (tamamlandi) {
      var m = d.basari || t.basari;
      if (m) basariGoster(m, d.basariAlt || t.basariAlt);
    }
    if (t.bitince) { try { t.bitince(!!tamamlandi); } catch (e) {} }
  }
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
      if (azH()) o.remove(); else { o.classList.add("kapaniyor"); setTimeout(function () { if (o.parentNode) o.remove(); }, 230); }
      if (sonra) sonra();
    };
    o._kapa = kapa;
    if (sure) { o._z = setTimeout(kapa, sure); o.addEventListener("click", kapa); }
    return { o: o, kapa: kapa };
  }
  function sonKaldir(anlik) { if (B) { var b = B; B = null; clearTimeout(b._z); if (anlik) b.remove(); else if (b._kapa) b._kapa(); } }
  function basariGoster(m, alt) {
    titret("kaydedildi");
    var tik = ikonHTML("tik", 38) || "✓";
    sonKart('<div class="rhTik" aria-hidden="true">' + tik + "</div>" +
      '<div class="rhKartBas">' + esc(cev(m)) + "</div>" +
      (alt ? '<div class="rhKartAlt">' + esc(cev(alt)) + "</div>" : ""),
      alt ? 2200 : 1400, null);
  }
  // 19.9: perdesiz küçük ipucu (sihirbazın her adımında üstte)
  // 22.2: panelin "?" düğmesi: o işlemin rehberi tek seferlik, kalınan adımdan (bilinmiyorsa ilk boş alandan)
  R.panelden = function (ov, tanim) {
    if (!tanim) return false;
    // 26.6: bilgi veren rehberler (tanim.bastan) kalınan adım bilinmiyorsa ilk boş alandan değil baştan başlar
    var k = ov && ov._rhKaldi, bas = (k && k.ad === tanim.ad) ? k.i : (tanim.bastan ? 0 : "bos");
    if (D) bitir(false);
    return R.baslat(tanim, { bas: bas });
  };
  R.ipucuHTML = function (m) {
    return '<div class="rhIpucu" role="note">' + ikonHTML("bilgi-i", 20) + "<span>" + metinHTML(m) + "</span></div>";
  };
  R.metinHTML = metinHTML;

  window.Rehber = R;
  // görünüm baştan kurulur (sihirbaz ipucu rehber başlamadan da kullanılır)
  cssKur();
})();
