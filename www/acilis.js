/* ============================================================
   VİLLA TAKVİM — açılış animasyonu (Görev 16.2) ve Face ID kilidi (16.3)
   Tek modül. <body>'nin en başında yüklenir.
   Sıra (Wise ölçümleri, docs/ACILIS_OLCUMLER.md, toplam ~2,03 sn): native açılış ekranı → aynı
         görünümde web perdesi (koyu zemin, logo) → [kilit açıksa Face ID] → 800 ms logo → 0–300 limon
         kapsül baş gösterir, koyu daire içinden yetişir → 300–816 baş yükselir, desenli gövde genişler →
         816–983 gövde tüm ekranı kaplar → 983–1000 tam desen → 1000–1233 desen solar, ana ekran belirir.
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
    /* logo: native açılış ekranıyla aynı yer ve boyut. assets/splash.png 2732'lik karede sembol 382 px genişlikte ve tam ortada;
       ekran onu kaplayacak şekilde ölçeklenir (iPhone 14'te genişliğin ~%30'u). Logo assets/sembol-acik.svg'den satır içi vektör. */
    "#acilis .acLogo{position:absolute;left:50%;top:50%;width:calc(382 / 2732 * max(100vw,100vh));height:auto;aspect-ratio:656/640;" +
      "color:#9FE870;transform:translate(-50%,-50%);pointer-events:none;display:block}" +
    /* Android: native açılış sistemin açılış ekranı (Android 12 API); sembol orada sabit 120dp genişlikte, ekranın ortasında
       (android/app/src/main/res/values/styles.xml + drawable-xxxhdpi/splash_sembol.png) */
    "#acilis.acAndroid .acLogo{width:120px}" +
    /* limon kapsül (düz #9FE870, üstü yuvarlak); yükselince başın çevresindeki halka olur */
    "#acilis .acKapsul{position:absolute;top:0;background:#9FE870;pointer-events:none}" +
    /* desenli gövde: ekranın sol ve sağ yarısında birer kırpma kutusu; her birinde dış üst köşesi yuvarlak (yarıçap = kapsülün
       yarısı) bir kap translate ile yükselir ve yana açılır, içindeki desen ters translate ile ekrana göre sabit kalır.
       (scale kullanılmaz: desen ve yuvarlak uç bozulur, tarayıcı deseni büyük ölçekte yeniden çizer.) */
    "#acilis .acYari{position:absolute;top:0;overflow:hidden;pointer-events:none}" +
    "#acilis .acGovde{position:absolute;left:0;top:0;overflow:hidden}" +
    "#acilis .acDesen{position:absolute;left:0;top:0}" +
    "#acilis .acDesen img{display:block;width:100%;height:100%;object-fit:cover}" +
    /* baş: #163300 daire (kapsül genişliğinin %92'si), içinde #9FE870 ev (çapın %42'si, kalın çizgi) */
    "#acilis .acBas{position:absolute;top:0;border-radius:50%;background:#163300;display:flex;align-items:center;justify-content:center;pointer-events:none}" +
    "#acilis .acBas svg{width:42%;height:42%;fill:none;stroke:#9FE870;stroke-width:2.75;stroke-linecap:round;stroke-linejoin:round}" +
    /* kilit: Face ID başarısızsa */
    "#acilis .acKilit{position:absolute;left:0;right:0;bottom:calc(3rem + env(safe-area-inset-bottom));display:none;" +
      "flex-direction:column;align-items:center;gap:.75rem;padding:0 1.5rem;color:#9FE870;text-align:center}" +
    "#acilis.kilitli .acKilit{display:flex}" +
    "#acilis .acKilit p{margin:0 0 .25rem;font-size:.95rem;opacity:.85}" +
    "#acilis .acKilit button{width:100%;max-width:20rem;min-height:3.25rem;border-radius:999px;font:inherit;font-size:1rem;" +
      "font-weight:500;border:1.5px solid rgba(159,232,112,.55);background:transparent;color:#9FE870;cursor:pointer;text-align:center}" +
    "#acilis .acKilit button.acAna{background:#9FE870;color:#163300;border-color:#9FE870}";

  var EV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>' +
    '<path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

  // uygulama sembolü (assets/sembol-acik.svg ile aynı şekil), rengi currentColor (#9FE870)
  var SEMBOL = "<svg class=\"acLogo\" viewBox=\"184 191 656 640\" aria-hidden=\"true\" focusable=\"false\"><mask id=\"vtSemAcilis\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"1024\" height=\"1024\"><rect x=\"0\" y=\"0\" width=\"1024\" height=\"1024\" fill=\"black\"/><g fill=\"white\"><rect x=\"629\" y=\"201\" width=\"97\" height=\"190\" rx=\"12\"/><rect x=\"250\" y=\"400\" width=\"522\" height=\"430\" rx=\"62\"/><polyline points=\"218.5,449 512,226 805.5,449\" fill=\"none\" stroke=\"white\" stroke-width=\"69\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polygon points=\"250,425 512,226 772,425 772,520 250,520\"/></g><g fill=\"black\"><path d=\"M512 280 L606 352 L606 398 Q606 411 593 411 L431 411 Q418 411 418 398 L418 352 Z\"/><rect x=\"360\" y=\"382\" width=\"44\" height=\"104\" rx=\"22\"/><rect x=\"619\" y=\"382\" width=\"44\" height=\"104\" rx=\"22\"/><rect x=\"312\" y=\"542\" width=\"101\" height=\"96\" rx=\"20\"/><rect x=\"460\" y=\"542\" width=\"103\" height=\"96\" rx=\"20\"/><rect x=\"609\" y=\"542\" width=\"102\" height=\"96\" rx=\"20\"/><rect x=\"312\" y=\"673\" width=\"101\" height=\"96\" rx=\"20\"/><rect x=\"460\" y=\"673\" width=\"103\" height=\"96\" rx=\"20\"/></g></mask><rect x=\"0\" y=\"0\" width=\"1024\" height=\"1024\" fill=\"currentColor\" mask=\"url(#vtSemAcilis)\"/></svg>";

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
      SEMBOL + '<div class="acKapsul"></div>' +
      '<div class="acYari acSol"><div class="acGovde"><div class="acDesen"><img alt="" decoding="async" src="' + DESEN + '"></div></div></div>' +
      '<div class="acYari acSag"><div class="acGovde"><div class="acDesen"><img alt="" decoding="async" src="' + DESEN + '"></div></div></div>' +
      '<div class="acBas">' + EV + "</div>" +
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
    if (window.requestAnimationFrame) requestAnimationFrame(function () { requestAnimationFrame(git); });
    setTimeout(git, 120);
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

  // ---------- zaman çizelgesi: docs/ACILIS_OLCUMLER.md (Wise, kare kare ölçüm) ----------
  // t = 0 anı logo beklemesinin sonu (native açılış gizlendikten LOGO ms sonra). Tablolar arası doğrusal (linear).
  // Yükseklik: tepenin ekranın altından uzaklığı, ekran yüksekliğinin %'si. Genişlik: ekran genişliğinin %'si.
  var LOGO = 800, ACIK = 983, SON = 1000, SOLMA = 233, SOLMA_EGRI = "cubic-bezier(0.4, 0, 0.2, 1)";
  var KAPSUL_GEN = 29, DAIRE_ORAN = 0.92;
  // 1) limon kapsülün tepesi (0–300) + 2) başın (halka + daire) tepesi (300–816)
  var KAPSUL_TEPE = [[0, 0], [50, 4.0], [100, 6.8], [150, 8.9], [200, 10.5], [250, 11.6], [300, 12.4],
    [350, 17.4], [400, 24.5], [450, 32.1], [500, 40.3], [516, 43.0], [550, 48.6], [600, 56.8], [650, 65.6],
    [700, 74.8], [750, 84.7], [783, 91.6], [800, 95.5], [816, 100]];
  // 1) koyu dairenin tepesi (kapsülün içinde aşağıdan gelir, 300'de kapsülün tepesine oturur)
  var DAIRE_TEPE = [[0, -14], [60, -14], [100, -6], [150, 1.5], [200, 6.5], [250, 10.0], [300, 12.0]];
  var HALKA = 0.4; // 300 ms'den sonra daire kapsül tepesinin bu kadar altında (12,4 − 12,0)
  // 2) + 3) desenli gövdenin genişliği
  var GOVDE_GEN = [[0, 29], [516, 29], [550, 30.5], [600, 33.8], [650, 38.5], [700, 43.1], [750, 47.2],
    [783, 48.7], [800, 49.2], [816, 49.7], [833, 51], [850, 53.3], [867, 56.4], [883, 60], [900, 64.9],
    [917, 70.5], [933, 77.2], [950, 84.6], [967, 92.8], [983, 100], [1000, 100]];
  var CIKIS_HIZ = 2.4; // px/ms: 816'dan sonra baş aynı hızla ekranın üstünden çıkar (800–816 arasındaki hız)

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
  }
  // ana ekranı çizme / çiz (content-visibility): gizliyken yerleşimi yapılmaz
  function anaGizle(gizle) {
    anaEkranlar().forEach(function (e) { e.style.contentVisibility = gizle ? "hidden" : ""; });
  }

  // desen solar; ana ekran belirir. kaydir: 233 ms cubic-bezier(0.4,0,0.2,1), ana ekran 12px aşağıdan yerine kayar
  // (hareketi azalt / kilit dönüşü: 200 ms ease-out, yalnız opaklık).
  // basla: zaman çizelgesindeki tam başlangıç anı (veri hazırsa t0 + 800 + 1000), yoksa şimdi
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
      // hareketi azalt: logo 400 ms → (veri bekle, en fazla 1,5 sn) → 200 ms solma → ana ekran
      setTimeout(function () {
        veriyiBekle(function () { if (perde === d) perdeKaldir(false); }, 1500);
      }, 400);
      return;
    }
    var ust = Promise.race([d._desenHazir, new Promise(function (r) { setTimeout(r, 400); })]);
    ust.then(function () { ikiKare(function () { if (perde === d && !bitti) baslat(d); }); });
  }

  function baslat(d) {
    var W = d.clientWidth, H = d.clientHeight, cx = W / 2;
    var px = function (v) { return Math.round(v * 1000) / 1000 + "px"; };
    var kG = W * KAPSUL_GEN / 100;          // limon kapsül genişliği (sabit)
    var dC = kG * DAIRE_ORAN;               // koyu daire çapı (sabit)
    var yuk = function (yuzde) { return H - H * yuzde / 100; }; // yükseklik % → ekranda y (üstten)
    var y816 = yuk(100);

    // her an için: limon kapsül tepesi, daire tepesi (ekranda y, px) ve gövde genişliği (px)
    function durum(t) {
      var kt = t <= 816 ? yuk(dogrusal(KAPSUL_TEPE, t)) : y816 - CIKIS_HIZ * (t - 816);
      var dt = t <= 300 ? yuk(dogrusal(DAIRE_TEPE, t)) : kt + H * HALKA / 100;
      return { kapsul: kt, daire: dt, gen: W * dogrusal(GOVDE_GEN, t) / 100 };
    }

    var kap = d.querySelector(".acKapsul"), bas = d.querySelector(".acBas");
    var sol = d.querySelector(".acSol"), sag = d.querySelector(".acSag");
    var gS = sol.firstChild, gR = sag.firstChild, dS = gS.firstChild, dR = gR.firstChild;
    var r = kG / 2, boy = H * 2;
    kap.style.cssText = "left:" + px(cx - kG / 2) + ";width:" + px(kG) + ";height:" + px(H * 0.25) + ";border-radius:" + px(r) + " " + px(r) + " 0 0";
    // kırpma kutuları: ekranın iki yarısı (ortada 1 px üst üste, dikiş görünmesin)
    sol.style.cssText = "left:0;width:" + px(cx + 1) + ";height:" + px(H);
    sag.style.cssText = "left:" + px(cx - 1) + ";width:" + px(W - cx + 1) + ";height:" + px(H);
    // kaplar: genişliği W; sol kabın sol üst, sağ kabın sağ üst köşesi yuvarlak. Kabın dış kenarı = gövdenin kenarı.
    gS.style.cssText = "width:" + px(W) + ";height:" + px(boy) + ";border-top-left-radius:" + px(r);
    gR.style.cssText = "left:" + px(-(cx - 1)) + ";width:" + px(W) + ";height:" + px(boy) + ";border-top-right-radius:" + px(r);
    dS.style.cssText = dR.style.cssText = "width:" + px(W) + ";height:" + px(H);
    bas.style.cssText = "left:" + px(cx - dC / 2) + ";width:" + px(dC) + ";height:" + px(dC);

    // anahtar kareler: yalnızca tablo zamanları (aralar doğrusal)
    var zam = {};
    [KAPSUL_TEPE, DAIRE_TEPE, GOVDE_GEN].forEach(function (tb) { tb.forEach(function (r) { zam[r[0]] = 1; }); });
    zam[SON] = 1;
    var anlar = Object.keys(zam).map(Number).sort(function (a, b) { return a - b; });

    // Tek zaman çizelgesi: 0 → LOGO logo bekler (parçalar başlangıç yerinde), sonra hareket 0 → 983 (tablo),
    // 983–1000 tam desen durur, 1000–1233 solma, ardından KUYRUK: her şey son değerinde durur.
    // · delay yerine bekleme karesi: başlarken ana iş parçacığına "animasyon başladı" bildirimi/commit gitmesin.
    // · KUYRUK: animasyonların bitişini işlemek için uyanan ana iş parçacığı solmanın son karelerine denk gelmesin.
    var KUYRUK = 100, TUM = LOGO + SON + SOLMA + KUYRUK;
    var o = function (t) { return (LOGO + t) / TUM; };
    var kK = [], kD = [], kGS = [], kGR = [], kDS = [], kDR = [];
    var ekle = function (dizi, t, tr) { dizi.push({ offset: o(t), transform: tr }); };
    var tr = function (x, y) { return "translate(" + px(x) + "," + px(y) + ")"; };
    var yer = function (t) {
      var s = durum(t);
      var gTepe = s.daire + dC / 2;                // gövdenin tepesi = dairenin ortası (desen dairenin arkasından açılır)
      var tx = cx - s.gen / 2;                     // gövdenin sol kenarı (sol kap bu kadar sağa, sağ kap bu kadar sola)
      return { kap: "translateY(" + px(s.kapsul) + ")", bas: "translateY(" + px(s.daire) + ")",
        gS: tr(tx, gTepe), dS: tr(-tx, -gTepe), gR: tr(-tx, gTepe), dR: tr(tx, -gTepe) };
    };
    // hareket 983'te biter; parçalar solmanın sonuna kadar (TUM) yerinde durur: animasyonlar ortada bitmez,
    // böylece tarayıcı hareket sırasında ana iş parçacığını uyandırmaz
    [-LOGO].concat(anlar.filter(function (t) { return t <= ACIK; }), [SON + SOLMA + KUYRUK]).forEach(function (t) {
      var y = yer(Math.min(ACIK, Math.max(0, t)));
      ekle(kK, t, y.kap); ekle(kD, t, y.bas); ekle(kGS, t, y.gS); ekle(kDS, t, y.dS); ekle(kGR, t, y.gR); ekle(kDR, t, y.dR);
    });
    // başlangıç yerleri (animasyon başlamadan önce de aynı)
    var y0 = yer(0);
    kap.style.transform = y0.kap; bas.style.transform = y0.bas;
    gS.style.transform = y0.gS; dS.style.transform = y0.dS; gR.style.transform = y0.gR; dR.style.transform = y0.dR;
    var t0 = document.timeline ? document.timeline.currentTime : null;
    d._t0 = t0; d._olcu = { W: W, H: H, kapsul: kG, daire: dC, logo: LOGO };
    var will = [kap, gS, gR, dS, dR, bas];
    // katmanlar logo beklemesinde (ekran durgunken) hazırlanır
    will.forEach(function (e) { e.style.willChange = "transform"; });
    // ana ekran şimdilik çizilmez: veri hareket sırasında gelirse yerleşimi (uzun ana iş parçacığı işi) hareketi
    // takıltmasın. Veri logo beklemesinde gelirse ana ekran hemen açılır ve ekran durgunken yerleşir;
    // gelmezse desen ekranı kaplayınca (983) açılır.
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
    // parçacığına bağlı kalmaz). Kapsül, daire, gövde: 0 → LOGO + 983. Solma: LOGO + 1000 → + 233, desen 1 → 0,
    // ana ekran 0 → 1 ve 12px aşağıdan yerine (ana ekran solmaya kadar saydam).
    var sec = { duration: TUM, fill: "forwards", easing: "linear" };
    anim(kap, kK, sec);
    anim(bas, kD, sec);
    anim(gS, kGS, sec); anim(dS, kDS, sec);
    anim(gR, kGR, sec); anim(dR, kDR, sec);
    var kS = (LOGO + SON) / TUM;
    var secS = { duration: TUM, fill: "forwards" };
    var kB = (LOGO + SON + SOLMA) / TUM;
    // Solmaya kadarki bekleme kareleri tam sabit DEĞİL (perdede 0,01 px kayma, ana ekranda 0,0001 opaklık; gözle
    // görülmez): değeri sabit duran bir aralık görünce tarayıcı, değişimin başlayacağı ana yakın ana iş parçacığını
    // uyandırıp animasyonlu öğelerin biçimini yeniden hesaplıyor ve 4x yavaşlatmada hareketin ortasında kare düşüyordu.
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
    // 953'te (hareket bitmeden, ekrana dokunmadan) bakılır: veri hazır ve ana ekran çizildiyse iş yok, solma 1000'de
    // kendiliğinden başlar. Değilse solma bekletilir; 983'ten sonra (desen ekranı kaplamış, durgun) veri gelince
    // (en fazla 1,5 sn; sonra iskelet ekran) ana ekran açılır, çizildiği kareden hemen sonra solma kaldığı yerden sürer.
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
        }, 1500);
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
    if (!girisli() || (!native && !webIlk)) { splashGizle(); return; }

    bitti = false;
    perde = perdeKur();
    atlanabilir(perde);
    var d = perde;
    logoHazir(d, function () {
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

  try { sogukAcilis(); } catch (e) { splashGizle(); try { if (perde) perde.remove(); } catch (x) {} }
})();
