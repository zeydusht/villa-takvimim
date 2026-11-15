/* ============================================================
   VİLLA TAKVİM — açılış animasyonu (Görev 16.2) ve Face ID kilidi (16.3)
   Tek modül. <body>'nin en başında yüklenir.
   Sıra (docs/ACILIS_OLCUMLER.md "Villa Takvimim sürümü: ortada nefes anı"; süreler Wise hızında, hepsi
         ACILIS_YAVAS = 1,15 ile çarpılır, toplam ~2,88 sn): native açılış ekranı → aynı görünümde web perdesi
         (koyu zemin, logo; ortası ekran yüksekliğinin %49,5'i) → [kilit açıksa Face ID] → 1000 ms logo (sabit) →
         0–300 limon kapsül baş gösterir, koyu daire içinden yetişir (çap = şerit × 0,92) → 2a 300–600 daire
         yavaşlayarak alttan gelip logonun merkezine oturur; dairenin üst kenarı logonun alt kenarına değdiği anda logo
         küçülmeye başlar, daire oturduğu anda çapın %56'sına inmiş olur (logo dairenin önünde, yeri sabit) → 2b
         600–800 daire ve içindeki logo birlikte yumuşak yay (1 → 1,04 → 1) → 2c 800–1220 logo ve daire tek parça
         hızlanarak tepeye, birlikte 1 → 0,85 küçülür; desenli gövde tablo gibi genişler → 3) 1220–1387 gövde tüm
         ekranı kaplar → 1387–1404 tam desen → 1404–1637 desen solar, ana ekran belirir.
   Sadece transform / opacity, Web Animations API (offset'li anahtar kareler, aralar doğrusal).
   Dışarıya: window.VTAcilis = { hazir, kilitDestek, kilitAcik, kilitAyarla, cikisBagla }
   ============================================================ */
(function () {
  "use strict";

  var Cap = window.Capacitor;
  var native = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  var P = (Cap && Cap.Plugins) || {};
  var BIO = P.BiometricAuthNative || null;
  var KILIT_ANAHTAR = "vt-kilit";
  var ARKA_SINIR = 5 * 60 * 1000; // 5 dakikadan uzun arka planda kalınca kilit

  function ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  function girisli() { return !!ls("villa-takvim-oturum"); }
  function azHareket() {
    try { return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }
  function kilitAcik() { return native && !!BIO && ls(KILIT_ANAHTAR) === "1" && girisli(); }

  // index.html <head> başındaki koyu zemin (#vtIlkZemin) ve theme-color: ilk karede gri/beyaz görünmesin.
  // Koyu zemin, perde ekrana çizilince kalkar (perde kendi zeminiyle her yeri kaplıyor; solma sırasında arkada
  // koyu zemin kalmasın). theme-color açılış bitince normal temaya döner.
  function ilkZeminBirak() {
    var z = document.getElementById("vtIlkZemin");
    if (z && z.parentNode) z.parentNode.removeChild(z);
  }
  function temaGeriAl() {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m && m.getAttribute("data-normal")) m.setAttribute("content", m.getAttribute("data-normal"));
  }

  var splashGizlendi = false;
  function splashGizle() {
    if (splashGizlendi) return; splashGizlendi = true;
    try { if (P.SplashScreen && P.SplashScreen.hide) P.SplashScreen.hide({ fadeOutDuration: 0 }); } catch (e) {}
  }

  // ---------- stil ----------
  var ZEMIN = "#10180D";
  var CSS =
    "#acilis{position:fixed;inset:0;z-index:2147483000;background:" + ZEMIN + ";overflow:hidden;contain:strict;" +
      "-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:none}" +
    /* logo: native açılış ekranıyla aynı yer ve boyut; her an dairenin önünde (z-index), dairenin içindeki ikon logonun kendisi.
       assets/splash.png 2732'lik karede sembol 382 px genişlikte, yatayda ortada, dikeyde ortası 1352,5'te (%49,5); ekran onu
       kaplayacak şekilde ölçeklenir (iPhone 14'te genişliğin ~%30'u, ortası ekran yüksekliğinin %49,5'i). Logo
       assets/sembol-acik.svg'den satır içi vektör. */
    "#acilis .acLogo{position:absolute;left:50%;top:calc(50% - 13.5 / 2732 * max(100vw,100vh));width:calc(382 / 2732 * max(100vw,100vh));height:auto;aspect-ratio:656/640;" +
      "color:#9FE870;transform:translate(-50%,-50%);transform-origin:50% 50%;transform-box:border-box;pointer-events:none;display:block}" +
    /* logo ilk karesinden kendi katmanında: sonradan katmana alınırken yeniden çizilip soluk/bulanık görünmesin */
    "#acilis .acLogo{will-change:transform;z-index:2}" +
    /* Android: native açılış sistemin açılış ekranı (Android 12 API); sembol orada sabit 120dp genişlikte, ekranın ortasının
       4dp üstünde (android/app/src/main/res/values/styles.xml + drawable-xxxhdpi/splash_sembol.png) */
    "#acilis.acAndroid .acLogo{width:120px;top:calc(50% - 4px)}" +
    /* limon kapsül (düz #9FE870, üstü yuvarlak); yükselince başın çevresindeki halka olur */
    "#acilis .acKapsul{position:absolute;top:0;background:#9FE870;pointer-events:none}" +
    /* desenli gövde: ekranın sol ve sağ yarısında birer kırpma kutusu; her birinde dış üst köşesi yuvarlak (yarıçap = kapsülün
       yarısı) bir kap translate ile yükselir ve yana açılır, içindeki desen ters translate ile ekrana göre sabit kalır.
       (scale kullanılmaz: desen ve yuvarlak uç bozulur, tarayıcı deseni büyük ölçekte yeniden çizer.) */
    "#acilis .acYari{position:absolute;top:0;overflow:hidden;pointer-events:none}" +
    "#acilis .acGovde{position:absolute;left:0;top:0;overflow:hidden}" +
    "#acilis .acDesen{position:absolute;left:0;top:0}" +
    "#acilis .acDesen img{display:block;width:100%;height:100%;object-fit:cover}" +
    /* baş: #163300 daire (kapsül genişliğinin %92'si), logonun arkasında. İçinde ayrıca ikon yok: logo ikonun kendisi. */
    "#acilis .acBas{position:absolute;top:0;border-radius:50%;background:#163300;pointer-events:none}" +
    /* logo dışındaki bütün parçalar, baslat() boyut ve yerlerini verip görünür yapana kadar gizli (ilk karede yalnız logo) */
    "#acilis .acKapsul,#acilis .acYari,#acilis .acBas{visibility:hidden;opacity:0}" +
    /* kilit: Face ID başarısızsa */
    "#acilis .acKilit{position:absolute;z-index:3;left:0;right:0;bottom:calc(3rem + env(safe-area-inset-bottom));display:none;" +
      "flex-direction:column;align-items:center;gap:.75rem;padding:0 1.5rem;color:#9FE870;text-align:center}" +
    "#acilis.kilitli .acKilit{display:flex}" +
    "#acilis .acKilit p{margin:0 0 .25rem;font-size:.95rem;opacity:.85}" +
    "#acilis .acKilit button{width:100%;max-width:20rem;min-height:3.25rem;border-radius:999px;font:inherit;font-size:1rem;" +
      "font-weight:500;border:1.5px solid rgba(159,232,112,.55);background:transparent;color:#9FE870;cursor:pointer;text-align:center}" +
    "#acilis .acKilit button.acAna{background:#9FE870;color:#163300;border-color:#9FE870}";

  // uygulama sembolü (assets/sembol-acik.svg ile aynı şekil), rengi currentColor (#9FE870); pencereleri saydam (daire
  // arkasına gelince pencerelerde daire görünür: logo dairenin içindeki ikon olur)
  function sembol(sinif, id) {
    return "<svg class=\"" + sinif + "\" viewBox=\"184 191 656 640\" aria-hidden=\"true\" focusable=\"false\"><mask id=\"" + id + "\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"1024\" height=\"1024\"><rect x=\"0\" y=\"0\" width=\"1024\" height=\"1024\" fill=\"black\"/><g fill=\"white\"><rect x=\"629\" y=\"201\" width=\"97\" height=\"190\" rx=\"12\"/><rect x=\"250\" y=\"400\" width=\"522\" height=\"430\" rx=\"62\"/><polyline points=\"218.5,449 512,226 805.5,449\" fill=\"none\" stroke=\"white\" stroke-width=\"69\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polygon points=\"250,425 512,226 772,425 772,520 250,520\"/></g><g fill=\"black\"><path d=\"M512 280 L606 352 L606 398 Q606 411 593 411 L431 411 Q418 411 418 398 L418 352 Z\"/><rect x=\"360\" y=\"382\" width=\"44\" height=\"104\" rx=\"22\"/><rect x=\"619\" y=\"382\" width=\"44\" height=\"104\" rx=\"22\"/><rect x=\"312\" y=\"542\" width=\"101\" height=\"96\" rx=\"20\"/><rect x=\"460\" y=\"542\" width=\"103\" height=\"96\" rx=\"20\"/><rect x=\"609\" y=\"542\" width=\"102\" height=\"96\" rx=\"20\"/><rect x=\"312\" y=\"673\" width=\"101\" height=\"96\" rx=\"20\"/><rect x=\"460\" y=\"673\" width=\"103\" height=\"96\" rx=\"20\"/></g></mask><rect x=\"0\" y=\"0\" width=\"1024\" height=\"1024\" fill=\"currentColor\" mask=\"url(#" + id + ")\"/></svg>";
  }

  function cev(t) { try { return (window.DIL && DIL.cevir) ? DIL.cevir(t) : t; } catch (e) { return t; } }

  var stilEklendi = false;
  function stilEkle() {
    if (stilEklendi) return; stilEklendi = true;
    var s = document.createElement("style"); s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  // ---------- perde ----------
  var perde = null, bitti = true, animler = [], guvenlik = null;
  var DESEN = "img/acilis-doku.webp";

  function perdeKur() {
    stilEkle();
    var d = document.createElement("div");
    d.id = "acilis";
    if (native && Cap.getPlatform && Cap.getPlatform() === "android") d.className = "acAndroid";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML =
      '<div class="acKapsul"></div>' +
      '<div class="acYari acSol"><div class="acGovde"><div class="acDesen"><img alt="" decoding="async" src="' + DESEN + '"></div></div></div>' +
      '<div class="acYari acSag"><div class="acGovde"><div class="acDesen"><img alt="" decoding="async" src="' + DESEN + '"></div></div></div>' +
      '<div class="acBas"></div>' + sembol("acLogo", "vtSemAcilis") +
      '<div class="acKilit"><p class="acKilitYazi"></p>' +
      '<button type="button" class="acAna acTekrar"></button>' +
      '<button type="button" class="acSifre"></button></div>';
    // body'ye değil kök öğeye: ana ekranın transform'u perdeyi etkilemesin
    document.documentElement.appendChild(d);
    // desen görseli şimdiden çözülsün (ilk kare takılmasın)
    d._desenHazir = Promise.all([].map.call(d.querySelectorAll(".acDesen img"), function (im) {
      return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
    }));
    return d;
  }
  // logo (satır içi vektör, yüklenmesi beklenmez) ekrana çizilince native açılış ekranı gizlenir (geçiş fark edilmesin)
  function logoHazir(d, cb) {
    var tamam = false;
    var git = function () { if (tamam) return; tamam = true; cb(); };
    // iki kare + 50 ms: logonun ekrana tam parlaklıkta basıldığından emin olmadan native ekran kalkmasın (iPhone'da
    // erken kalkınca ilk karelerde gri zemin / soluk logo görünüyordu)
    if (window.requestAnimationFrame) requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(git, 50); }); });
    setTimeout(git, 180);
  }
  // bir sonraki kare çizildikten hemen sonra çalışır (rAF + kare sonrası görev)
  function kareSonrasi(cb) {
    if (!window.requestAnimationFrame || !window.MessageChannel) return setTimeout(cb, 16);
    requestAnimationFrame(function () {
      var k = new MessageChannel();
      k.port1.onmessage = function () { cb(); };
      k.port2.postMessage(0);
    });
  }
  function ikiKare(cb) {
    if (!window.requestAnimationFrame) return setTimeout(cb, 32);
    requestAnimationFrame(function () { requestAnimationFrame(cb); });
  }

  // ---------- veri hazır mı ----------
  var veriHazir = false, hazirBekleyen = null, veriGelince = null;
  function hazir() {
    veriHazir = true;
    if (veriGelince) { var g = veriGelince; veriGelince = null; try { g(); } catch (e) {} }
    if (hazirBekleyen) { var f = hazirBekleyen; hazirBekleyen = null; f(); }
  }
  // cb(true): veri zaten hazırdı; cb(false): beklendi
  function veriyiBekle(cb, enFazla) {
    if (veriHazir) return cb(true);
    var gitti = false;
    var git = function () { if (gitti) return; gitti = true; hazirBekleyen = null; cb(false); };
    hazirBekleyen = git;
    setTimeout(git, enFazla);
  }

  // ---------- zaman çizelgesi: docs/ACILIS_OLCUMLER.md ----------
  // "Villa Takvimim sürümü (Zeyd, 15 Kasım): ortada nefes anı". Aşağıdaki süreler/tablolar Wise hızında (w, ms);
  // ekranda hepsi ACILIS_YAVAS ile çarpılır (t = w × 1,15). Logo beklemesi 1000 ms sabit, çarpılmaz.
  // t = 0 anı logo beklemesinin sonu (native açılış gizlendikten LOGO ms sonra).
  // Yükseklik: tepenin ekranın altından uzaklığı, ekran yüksekliğinin %'si. Genişlik: ekran genişliğinin %'si.
  var ACILIS_YAVAS = 1.15, LOGO = 1000;
  var W_1 = 300, W_2A = 600, W_2B = 800, W_2C = 1220, W_3 = 1387, W_SON = 1404, W_SOLMA = 233;
  var ACIK = W_3 * ACILIS_YAVAS, SON = W_SON * ACILIS_YAVAS, SOLMA = W_SOLMA * ACILIS_YAVAS;
  var SOLMA_EGRI = "cubic-bezier(0.4, 0, 0.2, 1)";
  var E_2A = [0.2, 0.7, 0.3, 1], E_2C = [0.6, 0, 0.9, 0.45];
  // LOGO DAİREYE GİRER: daire boyu hep şerit × 0,92 (büyümez). Logo yerinde durur, daire alttan gelip merkezine oturur.
  // Dairenin üst kenarı logonun alt kenarına değdiği anda logo küçülmeye başlar; küçülme dairenin konumuna bağlıdır
  // (aynı eğri, aynı bitiş anı): daire logonun merkezine oturduğunda logo genişliği çapın %56'sı. Logo hep dairenin
  // önünde, opaklığı 1. 2b'de daire ve logo birlikte yumuşak yay: ölçek 1 → 1,04 → 1 (tepe %35'te, sinüs²: sert sekme
  // yok). 2c'de tek parça yükselir, birlikte 1 → 0,85 küçülür.
  var LOGO_DAIRE = 0.56, YAY = 0.04, YAY_TEPE = 0.35, KUCUK = 0.85;
  function yay(p) {
    if (p <= 0 || p >= 1) return 0;
    var s = p <= YAY_TEPE ? Math.sin(Math.PI / 2 * p / YAY_TEPE) : Math.cos(Math.PI / 2 * (p - YAY_TEPE) / (1 - YAY_TEPE));
    return s * s;
  }
  // desen tam ekranken veri için en fazla bu kadar beklenir; sonra iskelet ekranla geçilir (veri gelince yerini alır)
  var VERI_BEKLE = 300;
  var KAPSUL_GEN = 29, DAIRE_ORAN = 0.92;
  // 1) limon kapsülün tepesi ve koyu dairenin tepesi (0–300; daire kapsülün içinde aşağıdan gelir)
  var KAPSUL_TEPE = [[0, 0], [50, 4.0], [100, 6.8], [150, 8.9], [200, 10.5], [250, 11.6], [300, 12.4]];
  var DAIRE_TEPE = [[0, -14], [60, -14], [100, -6], [150, 1.5], [200, 6.5], [250, 10.0], [300, 12.0]];
  var HALKA = 0.4; // 300'den sonra daire, baş (halka) tepesinin bu kadar altında (12,4 − 12,0), % yükseklik
  // gövde genişliği, Wise tablosu: 500–816 artış (yeni ritimde 2c'ye, 860–1280, oranla yayılır), 816–1000 tam açılma
  var GOVDE_GEN = [[500, 29], [516, 29.2], [550, 30.5], [600, 33.8], [650, 38.5], [700, 43.1], [750, 47.2],
    [783, 48.7], [800, 49.2], [816, 49.7], [833, 51], [850, 53.3], [867, 56.4], [883, 60], [900, 64.9],
    [917, 70.5], [933, 77.2], [950, 84.6], [967, 92.8], [983, 100], [1000, 100]];
  // Wise zamanı (eski tablo) → yeni ritmin Wise zamanı
  function govdeZaman(t) { return t <= 816 ? W_2B + (t - 500) * (W_2C - W_2B) / 316 : t + (W_2C - 816); }

  function dogrusal(tablo, t) {
    if (t <= tablo[0][0]) return tablo[0][1];
    for (var i = 1; i < tablo.length; i++) {
      if (t <= tablo[i][0]) {
        var a = tablo[i - 1], b = tablo[i];
        return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
      }
    }
    return tablo[tablo.length - 1][1];
  }
  // CSS cubic-bezier(x1, y1, x2, y2): ilerleme x → değer y
  function bezier(p) {
    var bx = function (s) { return 3 * (1 - s) * (1 - s) * s * p[0] + 3 * (1 - s) * s * s * p[2] + s * s * s; };
    var by = function (s) { return 3 * (1 - s) * (1 - s) * s * p[1] + 3 * (1 - s) * s * s * p[3] + s * s * s; };
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var lo = 0, hi = 1;
      for (var i = 0; i < 40; i++) { var m = (lo + hi) / 2; if (bx(m) < x) lo = m; else hi = m; }
      return by((lo + hi) / 2);
    };
  }
  var e2a = bezier(E_2A), e2c = bezier(E_2C);
  // gövde genişliği (% genişlik), Wise zamanında (yeni ritim)
  var GOVDE_YENI = [[0, 29]].concat(GOVDE_GEN.map(function (r) { return [govdeZaman(r[0]), r[1]]; }));

  function anaEkranlar() {
    return [document.querySelector(".wrap"), document.getElementById("sekmeler")].filter(Boolean);
  }
  function anim(el, kareler, sec) {
    var a = el.animate(kareler, sec);
    animler.push(a);
    return a;
  }
  function animleriBitir() {
    animler.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    animler = [];
    anaGizle(false);
    temaGeriAl();
  }
  // ana ekranı çizme / çiz (content-visibility): gizliyken yerleşimi yapılmaz
  function anaGizle(gizle) {
    anaEkranlar().forEach(function (e) { e.style.contentVisibility = gizle ? "hidden" : ""; });
  }

  // desen solar; ana ekran belirir. kaydir: SOLMA (233 × 1,15 ms) cubic-bezier(0.4,0,0.2,1), ana ekran 12px aşağıdan yerine kayar
  // (hareketi azalt / kilit dönüşü: 200 ms ease-out, yalnız opaklık).
  // basla: zaman çizelgesindeki tam başlangıç anı, yoksa şimdi
  function solVeBitir(d, basla, kaydir) {
    if (bitti) return; bitti = true;
    if (guvenlik) { clearTimeout(guvenlik); guvenlik = null; }
    perde = null;
    d.style.pointerEvents = "none";
    var sec = kaydir ? { duration: SOLMA, easing: SOLMA_EGRI, fill: "both" } : { duration: 200, easing: "ease-out", fill: "both" };
    var yeni = [anim(d, [{ opacity: getComputedStyle(d).opacity }, { opacity: 0 }], sec)];
    anaEkranlar().forEach(function (e) {
      yeni.push(anim(e, kaydir ? [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }]
                               : [{ opacity: 0 }, { opacity: 1 }], sec));
    });
    var t = basla != null ? basla : (document.timeline ? document.timeline.currentTime : null);
    if (t != null) yeni.forEach(function (a) { a.startTime = t; });
    yeni[0].finished.then(function () { animleriBitir(); d.remove(); }, function () {});
  }

  function perdeKaldir(hemen) {
    if (bitti) return;
    if (!hemen && perde && perde.animate) return solVeBitir(perde, null, false);
    bitti = true;
    if (guvenlik) { clearTimeout(guvenlik); guvenlik = null; }
    animleriBitir();
    var d = perde; perde = null;
    if (d) d.remove();
  }

  // dokununca anında bitir (kilit ekranındayken değil)
  function atlanabilir(d) {
    d.addEventListener("pointerdown", function (e) {
      if (d.classList.contains("kilitli") || d.classList.contains("kilitBekle")) return;
      e.preventDefault();
      perdeKaldir(true);
    });
  }

  // ---------- animasyon ----------
  // Sadece transform ve opacity (compositor'da), Web Animations API. Tek zaman çizelgesi: hepsi aynı startTime ile başlar.
  function oynat(d) {
    if (guvenlik) clearTimeout(guvenlik);
    // güvenlik: perde hiçbir durumda 5 sn'den uzun kalmasın
    guvenlik = setTimeout(function () { if (!bitti && perde === d) perdeKaldir(true); }, 5000);
    if (azHareket() || !d.animate) {
      // hareketi azalt: logo 400 ms → (veri bekle, en fazla 300 ms; sonra iskelet ekran) → 200 ms solma → ana ekran
      setTimeout(function () {
        veriyiBekle(function () { if (perde === d) perdeKaldir(false); }, VERI_BEKLE);
      }, 400);
      return;
    }
    var ust = Promise.race([d._desenHazir, new Promise(function (r) { setTimeout(r, 400); })]);
    ust.then(function () { ikiKare(function () { if (perde === d && !bitti) baslat(d); }); });
  }

  function baslat(d) {
    var W = d.clientWidth, H = d.clientHeight, cx = W / 2;
    var px = function (v) { return Math.round(v * 1000) / 1000 + "px"; };
    var kG = W * KAPSUL_GEN / 100;          // 1. aşamada limon kapsül (şerit) genişliği
    var dC = kG * DAIRE_ORAN;               // 1. aşamada koyu daire çapı
    var yuk = function (yuzde) { return H - H * yuzde / 100; }; // yükseklik % → ekranda y (üstten)
    var halka = H * HALKA / 100;            // 1. aşamada halkanın (kapsül tepesi − daire tepesi) kalınlığı

    // logo: ekrandaki yeri ve boyu (native açılış ekranıyla aynı; Android'de 120 px). Ortası = dairenin oturacağı yer.
    var logo = d.querySelector(".acLogo");
    var lr = logo.getBoundingClientRect();
    var lx = lr.left + lr.width / 2, ly = lr.top + lr.height / 2;
    var sT = LOGO_DAIRE * dC / lr.width;   // daire oturduğunda logonun ölçeği (genişliği çapın %56'sı)
    var Dm = dC * (1 + YAY);                // en büyük çap (2b yayının tepesi): daire bu boyda çizilir, hep küçültülür
    var Km = Dm / DAIRE_ORAN;               // kapsül de en büyük boyunda çizilir (daire / 0,92)

    // her an (Wise zamanı w) için daire çapı (px): 2a sonuna kadar sabit
    function cap(w) {
      if (w <= W_2A) return dC;
      if (w <= W_2B) return dC * (1 + YAY * yay((w - W_2A) / (W_2B - W_2A)));
      if (w <= W_2C) return dC * (1 - (1 - KUCUK) * e2c((w - W_2B) / (W_2C - W_2B)));
      return dC * KUCUK;
    }
    // daire merkezinin (ekranda y) durakları: 300'de kapsülün tepesinde; 2a sonunda logonun ortasında; 2b'de yerinde;
    // 2c sonunda baş (halka) tepesi ekranın tepesinde
    var c1 = yuk(DAIRE_TEPE[DAIRE_TEPE.length - 1][1]) + dC / 2;
    var cC = halka * KUCUK + KUCUK * dC / 2;
    // 2c'nin sonundaki hız (px / Wise-ms); 1280'den sonra baş (ve logo) bu hızla ekranın üstünden çıkar
    var cikis = (ly - cC) * (1 - e2c(1 - 1e-4)) / 1e-4 / (W_2C - W_2B);
    function merkez(w) {
      if (w <= W_1) return yuk(dogrusal(DAIRE_TEPE, w)) + dC / 2;
      if (w <= W_2A) return c1 + (ly - c1) * e2a((w - W_1) / (W_2A - W_1));
      if (w <= W_2B) return ly;
      if (w <= W_2C) return ly + (cC - ly) * e2c((w - W_2B) / (W_2C - W_2B));
      return cC - cikis * (w - W_2C);
    }
    // logonun küçülmeye başladığı an (wDeg): dairenin üst kenarı (merkez − dC / 2) logonun alt kenarına değer
    var cDeg = ly + lr.height / 2 + dC / 2;
    var wDeg = W_1;
    if (merkez(W_1) > cDeg) {
      var aD = W_1, bD = W_2A;
      for (var iD = 0; iD < 50; iD++) { var mD = (aD + bD) / 2; if (merkez(mD) > cDeg) aD = mD; else bD = mD; }
      wDeg = (aD + bD) / 2;
    }
    // logonun ölçeği: değmeden önce 1; sonra dairenin logoya yaklaşmasıyla doğru orantılı (aynı eğri, aynı bitiş);
    // daire oturunca sT, ardından daireyle aynı oranda (2b yayı, 2c küçülmesi)
    function olcekL(w) {
      if (w <= wDeg) return 1;
      if (w <= W_2A) return 1 - (1 - sT) * Math.min(1, Math.max(0, (cDeg - merkez(w)) / (cDeg - ly)));
      return sT * cap(w) / dC;
    }
    // gövde genişliği: tablo, ama hiçbir an kapsülün (şeridin) o ana kadarki en geniş hâlinden dar değil
    // (böylece hep daire çapından da geniş; gövde daralmaz)
    var wTepe = W_2A + YAY_TEPE * (W_2B - W_2A); // çap en büyük bu anda (2b yayının tepesi); öncesinde hep artar
    var enGenis = function (w) { return cap(Math.min(w, wTepe)) / DAIRE_ORAN; };
    function durum(w) {
      var c = merkez(w), ca = cap(w), kt;
      if (w <= W_1) kt = yuk(dogrusal(KAPSUL_TEPE, w));
      else kt = c - ca / 2 - halka * ca / dC;
      return { kapsul: kt, merkez: c, cap: ca, gen: Math.max(W * dogrusal(GOVDE_YENI, w) / 100, enGenis(w)) };
    }

    var kap = d.querySelector(".acKapsul"), bas = d.querySelector(".acBas");
    var sol = d.querySelector(".acSol"), sag = d.querySelector(".acSag");
    var gS = sol.firstChild, gR = sag.firstChild, dS = gS.firstChild, dR = gR.firstChild;
    var r = kG / 2, boy = H * 2;
    var gor = "visibility:visible;opacity:1;";
    // kapsül ve daire en büyük boylarında çizilir, transform ile küçültülür (büyütülüp bulanıklaşmaz)
    // kapsülün boyu: yalnız gövdenin üstünde kalan kısım görünür (1. aşamada tepeden ekranın altına, sonra halkadan
    // dairenin ortasına kadar); gereğinden uzun çizilmez (GPU yükü)
    var kapBoy = Math.max(H * 0.125 * 1.25 * Dm / dC, Km * 0.75);
    kap.style.cssText = gor + "left:" + px(cx - Km / 2) + ";width:" + px(Km) + ";height:" + px(kapBoy) + ";border-radius:" + px(Km / 2) + " " + px(Km / 2) + " 0 0;transform-origin:50% 0";
    // kırpma kutuları: ekranın iki yarısı (ortada 1 px üst üste, dikiş görünmesin)
    sol.style.cssText = gor + "left:0;width:" + px(cx + 1) + ";height:" + px(H);
    sag.style.cssText = gor + "left:" + px(cx - 1) + ";width:" + px(W - cx + 1) + ";height:" + px(H);
    // kaplar: genişliği W; sol kabın sol üst, sağ kabın sağ üst köşesi yuvarlak. Kabın dış kenarı = gövdenin kenarı.
    gS.style.cssText = "width:" + px(W) + ";height:" + px(boy) + ";border-top-left-radius:" + px(r);
    gR.style.cssText = "left:" + px(-(cx - 1)) + ";width:" + px(W) + ";height:" + px(boy) + ";border-top-right-radius:" + px(r);
    dS.style.cssText = dR.style.cssText = "width:" + px(W) + ";height:" + px(H);
    bas.style.cssText = gor + "left:" + px(cx - Dm / 2) + ";width:" + px(Dm) + ";height:" + px(Dm) + ";transform-origin:50% 50%";
    // logo: kendi kutusunun ortasına göre (transform px ile; yüzde ve ölçek merkezi kaymasın), ek: dikey kayma
    var lT = function (s, ek) { return "translate(" + px(-lr.width / 2) + "," + px(-lr.height / 2 + (ek || 0)) + ") scale(" + Math.round(s * 1e5) / 1e5 + ")"; };
    var olc = function (s) { return Math.round(s * 1e5) / 1e5; };

    // anahtar kareler (Wise zamanı): 1) ve 3) tablo zamanları (aralar doğrusal); 2a–2c eğrili olduğu için ekranda
    // her 4 ms'de bir örnek (aralar doğrusal; eğriden sapma < 0,05 px), artı genişlik tablosunun zamanları
    var zam = {};
    KAPSUL_TEPE.concat(DAIRE_TEPE, GOVDE_YENI).forEach(function (r) { zam[r[0]] = 1; });
    for (var w = W_1; w < W_2C; w += 4 / ACILIS_YAVAS) zam[Math.round(w * 1000) / 1000] = 1;
    [wDeg, W_2A, W_2B, W_2C, W_3].forEach(function (w) { zam[w] = 1; });
    var anlar = Object.keys(zam).map(Number).filter(function (w) { return w >= 0 && w <= W_3; }).sort(function (a, b) { return a - b; });

    // Tek zaman çizelgesi (ekran zamanı, ms): 0 → LOGO logo bekler (parçalar başlangıç yerinde), sonra hareket
    // 0 → ACIK, ACIK–SON tam desen durur, SON → SON + SOLMA solma, ardından KUYRUK: her şey son değerinde durur.
    // · delay yerine bekleme karesi: başlarken ana iş parçacığına "animasyon başladı" bildirimi/commit gitmesin.
    // · KUYRUK: animasyonların bitişini işlemek için uyanan ana iş parçacığı solmanın son karelerine denk gelmesin.
    var KUYRUK = 100, TUM = LOGO + SON + SOLMA + KUYRUK;
    var o = function (t) { return Math.min(1, Math.max(0, (LOGO + t) / TUM)); };
    var kK = [], kD = [], kGS = [], kGR = [], kDS = [], kDR = [], kL = [];
    var ekle = function (dizi, t, tr) { dizi.push({ offset: o(t), transform: tr }); };
    var tr = function (x, y) { return "translate(" + px(x) + "," + px(y) + ")"; };
    var yer = function (w) {
      var s = durum(w);
      var gTepe = s.merkez;                        // gövdenin tepesi = dairenin ortası (desen dairenin arkasından açılır)
      var tx = cx - s.gen / 2;                     // gövdenin sol kenarı (sol kap bu kadar sağa, sağ kap bu kadar sola)
      var k = s.cap / Dm;                          // daire ve kapsülün ölçeği
      // logo daire değene kadar hiç kıpırdamaz (bekleme karesi 0,01 px değişir: tarayıcı ana iş parçacığını
      // uyandırmasın); sonra yerinde küçülür, 2b'de daireyle birlikte yaylanır, 2c'de dairenin ortasında yükselir
      var lo = w <= wDeg ? lT(1, 0.01 * w / wDeg) : lT(olcekL(w), w <= W_2B ? 0.01 : s.merkez - ly);
      return { kap: "translateY(" + px(s.kapsul) + ") scale(" + olc(k) + ")",
        bas: "translateY(" + px(s.merkez - Dm / 2) + ") scale(" + olc(k) + ")",
        gS: tr(tx, gTepe), dS: tr(-tx, -gTepe), gR: tr(-tx, gTepe), dR: tr(tx, -gTepe), logo: lo };
    };
    // hareket ACIK'ta biter; parçalar solmanın sonuna kadar (TUM) yerinde durur: animasyonlar ortada bitmez,
    // böylece tarayıcı hareket sırasında ana iş parçacığını uyandırmaz
    [-LOGO / ACILIS_YAVAS].concat(anlar, [(SON + SOLMA + KUYRUK) / ACILIS_YAVAS]).forEach(function (w) {
      var y = yer(Math.min(W_3, Math.max(0, w))), t = w * ACILIS_YAVAS;
      ekle(kK, t, y.kap); ekle(kD, t, y.bas); ekle(kGS, t, y.gS); ekle(kDS, t, y.dS); ekle(kGR, t, y.gR); ekle(kDR, t, y.dR);
      ekle(kL, t, w < 0 ? lT(1) : y.logo);
    });
    // başlangıç yerleri (animasyon başlamadan önce de aynı)
    var y0 = yer(0);
    kap.style.transform = y0.kap; bas.style.transform = y0.bas;
    gS.style.transform = y0.gS; dS.style.transform = y0.dS; gR.style.transform = y0.gR; dR.style.transform = y0.dR;
    logo.style.transform = lT(1);
    var t0 = document.timeline ? document.timeline.currentTime : null;
    d._t0 = t0;
    d._olcu = { W: W, H: H, kapsul: kG, daire: dC, logoSon: sT, degme: wDeg * ACILIS_YAVAS, logo: LOGO, yavas: ACILIS_YAVAS,
      logoKutu: { x: lx, y: ly, w: lr.width, h: lr.height }, son: SON, acik: ACIK, solma: SOLMA };
    var will = [kap, gS, gR, dS, dR, bas, logo];
    // katmanlar logo beklemesinde (ekran durgunken) hazırlanır
    will.forEach(function (e) { e.style.willChange = "transform"; });
    // ana ekran şimdilik çizilmez: veri hareket sırasında gelirse yerleşimi (uzun ana iş parçacığı işi) hareketi
    // takıltmasın. Veri logo beklemesinde gelirse ana ekran hemen açılır ve ekran durgunken yerleşir;
    // gelmezse desen ekranı kaplayınca (ACIK) açılır.
    var gizli = true;
    anaGizle(true);
    var logoda = function () {
      var n = document.timeline ? document.timeline.currentTime : null;
      return t0 == null || n == null || n < t0 + LOGO - 150;
    };
    var ac = function () { if (gizli) { gizli = false; anaGizle(false); } };
    if (veriHazir && logoda()) ac();
    else veriGelince = function () { if (perde === d && !bitti && logoda()) ac(); };

    // TEK ZAMAN ÇİZELGESİ: hepsi şimdi oluşturulur ve aynı anda başlar (hareketin ve solmanın başlaması ana iş
    // parçacığına bağlı kalmaz).
    var sec = { duration: TUM, fill: "forwards", easing: "linear" };
    anim(kap, kK, sec);
    anim(bas, kD, sec);
    anim(gS, kGS, sec); anim(dS, kDS, sec);
    anim(gR, kGR, sec); anim(dR, kDR, sec);
    anim(logo, kL, sec);
    // Bekleme kareleri tam sabit DEĞİL (0,01 px kayma, 0,0001 opaklık; gözle görülmez): değeri sabit duran bir
    // aralık görünce tarayıcı, değişimin başlayacağı ana yakın ana iş parçacığını uyandırıp animasyonlu öğelerin
    // biçimini yeniden hesaplıyor ve 4x yavaşlatmada hareketin ortasında kare düşüyordu.
    var kS = (LOGO + SON) / TUM;
    var secS = { duration: TUM, fill: "forwards" };
    var kB = (LOGO + SON + SOLMA) / TUM;
    // solma: desen 1 → 0, ana ekran 0 → 1 ve 12 px aşağıdan yerine (ana ekran solmaya kadar saydam)
    var perdeSol = anim(d, [{ offset: 0, opacity: 1, transform: "translateY(0px)" },
      { offset: kS, opacity: 1, transform: "translateY(0.01px)", easing: SOLMA_EGRI },
      { offset: kB, opacity: 0, transform: "translateY(0.01px)" }, { offset: 1, opacity: 0, transform: "translateY(0.01px)" }], secS);
    var solmalar = [perdeSol];
    anaEkranlar().forEach(function (e) {
      solmalar.push(anim(e, [{ offset: 0, opacity: 0, transform: "translateY(12px)" },
        { offset: kS, opacity: 0.0001, transform: "translateY(12px)", easing: SOLMA_EGRI },
        { offset: kB, opacity: 1, transform: "translateY(0px)" }, { offset: 1, opacity: 1, transform: "translateY(0px)" }], secS));
    });
    if (t0 != null) animler.forEach(function (a) { a.startTime = t0; });
    d._solma = SON;
    perdeSol.finished.then(function () {
      if (perde !== d || bitti) return;
      bitti = true; perde = null;
      if (guvenlik) { clearTimeout(guvenlik); guvenlik = null; }
      animleriBitir(); d.remove();
    }, function () {});
    // ACIK − 30'da (hareket bitmeden, ekrana dokunmadan) bakılır: veri hazır ve ana ekran çizildiyse iş yok, solma
    // SON'da kendiliğinden başlar. Değilse solma bekletilir; ACIK'tan sonra (desen ekranı kaplamış, durgun) veri gelince
    // (en fazla VERI_BEKLE = 300 ms; sonra iskelet ekran, veri gelince yerini alır) ana ekran açılır, çizildiği kareden hemen sonra solma kaldığı yerden sürer.
    var simdi0 = function () { return document.timeline && t0 != null ? document.timeline.currentTime - t0 : 0; };
    setTimeout(function () {
      if (perde !== d || bitti) return;
      if (veriHazir && !gizli) { veriGelince = null; return; }
      solmalar.forEach(function (a) { a.pause(); a.currentTime = LOGO + SON; });
      setTimeout(function () {
        veriGelince = null;
        veriyiBekle(function () {
          if (perde !== d || bitti) return;
          ac();
          kareSonrasi(function () {
            if (perde !== d || bitti) return;
            var n = document.timeline ? document.timeline.currentTime : null;
            d._solma = n != null && t0 != null ? Math.max(SON, n - t0 - LOGO) : null;
            if (n != null) solmalar.forEach(function (a) { a.startTime = n - (LOGO + SON); });
            else solmalar.forEach(function (a) { a.play(); });
          });
        }, VERI_BEKLE);
      }, Math.max(0, LOGO + ACIK - simdi0()));
    }, Math.max(0, LOGO + ACIK - 30 - simdi0()));
  }

  // ---------- Face ID / parmak izi ----------
  function kilitYazilari(d) {
    d.querySelector(".acKilitYazi").textContent = cev("Villa Takvimim kilitli");
    d.querySelector(".acTekrar").textContent = cev("Tekrar dene");
    d.querySelector(".acSifre").textContent = cev("Şifreyle giriş");
  }
  function dogrula() {
    if (!BIO || !BIO.internalAuthenticate) return Promise.reject(new Error("yok"));
    return BIO.internalAuthenticate({
      reason: cev("Villa Takvimim'i açmak için"),
      cancelTitle: cev("Vazgeç"),
      allowDeviceCredential: false,
      androidTitle: "Villa Takvimim",
      androidSubtitle: cev("Villa Takvimim'i açmak için"),
      androidConfirmationRequired: false
    });
  }
  var cikisFn = null;
  function kilitSor(d, basarili) {
    d.classList.add("kilitBekle"); d.classList.remove("kilitli");
    kilitYazilari(d);
    dogrula().then(function () {
      d.classList.remove("kilitBekle", "kilitli");
      basarili();
    }, function () {
      d.classList.remove("kilitBekle");
      d.classList.add("kilitli");
    });
    d.querySelector(".acTekrar").onclick = function () { kilitSor(d, basarili); };
    d.querySelector(".acSifre").onclick = function () {
      // çıkış yapıp giriş ekranına dön
      var son = function () { d.classList.remove("kilitli"); perdeKaldir(true); };
      try { if (cikisFn) { var r = cikisFn(); if (r && r.then) return r.then(son, son); } } catch (e) {}
      son();
    };
  }

  // ---------- soğuk açılış ----------
  function sogukAcilis() {
    var webIlk = false;
    if (!native) {
      try {
        if (!sessionStorage.getItem("vt-acilis")) { sessionStorage.setItem("vt-acilis", "1"); webIlk = true; }
      } catch (e) { webIlk = false; }
    }
    // animasyon herkes için (girişsiz kullanıcıda da; perde açılınca kayıt / giriş ekranı gelir). Web'de oturum başına bir kez.
    if (!native && !webIlk) { ilkZeminBirak(); temaGeriAl(); splashGizle(); return; }

    bitti = false;
    perde = perdeKur();
    atlanabilir(perde);
    var d = perde;
    logoHazir(d, function () {
      ilkZeminBirak();
      splashGizle();
      if (kilitAcik()) kilitSor(d, function () { oynat(d); });
      else oynat(d);
    });
  }

  // ---------- arka plandan dönüş: 5 dk'dan uzun kaldıysa kilit ----------
  var gizlenme = 0;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { gizlenme = Date.now(); return; }
    if (!gizlenme || !kilitAcik() || !bitti) return;
    var gecen = Date.now() - gizlenme; gizlenme = 0;
    if (gecen < ARKA_SINIR) return;
    bitti = false;
    perde = perdeKur();
    var d = perde;
    kilitSor(d, function () { perdeKaldir(false); });
  });

  // ---------- ayar (Hesap → Güvenlik) ----------
  function kilitDestek() { return native && !!BIO; }
  // açarken bir kez doğrulanır; cihazda Face ID / parmak izi yoksa reddedilir
  function kilitAyarla(ac) {
    if (!ac) { ls(KILIT_ANAHTAR, null); return Promise.resolve(false); }
    if (!kilitDestek()) return Promise.reject(new Error(cev("Bu cihazda kullanılamıyor.")));
    return BIO.checkBiometry().then(function (b) {
      if (!b || !b.isAvailable) throw new Error(cev("Bu cihazda Face ID veya parmak izi ayarlı değil."));
      return dogrula();
    }).then(function () { ls(KILIT_ANAHTAR, "1"); return true; });
  }

  window.VTAcilis = {
    hazir: hazir,
    kilitDestek: kilitDestek,
    kilitAcik: function () { return native && ls(KILIT_ANAHTAR) === "1"; },
    kilitAyarla: kilitAyarla,
    cikisBagla: function (fn) { cikisFn = fn; }
  };

  try { sogukAcilis(); } catch (e) { ilkZeminBirak(); temaGeriAl(); splashGizle(); try { if (perde) perde.remove(); } catch (x) {} }
})();
