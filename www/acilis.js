/* ============================================================
   VİLLA TAKVİM — açılış animasyonu (Görev 16.2) ve Face ID kilidi (16.3)
   Tek modül. <body>'nin en başında yüklenir.
   Sıra (Wise ritmi, toplam ~1,83 sn): native açılış ekranı → aynı görünümde web perdesi
         (koyu zemin, logo) → [kilit açıksa Face ID] → 0–600 ms logo → 600–900 şerit %8'e
         baş gösterir → 900–1430 hızlanarak %100'e yükselir → 1430–1600 yanlara açılıp
         ekranı desenle kaplar → 1600–1630 tam desen → 1630–1830 desen solar, ana ekran belirir.
   Sadece transform / opacity, Web Animations API (compositor'da, layout tetiklemez).
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
    /* şerit: ekranın sol ve sağ yarısında birer kırpma kutusu; her birinde üst köşesi yuvarlak bir panel (translate ile yükselir,
       yanlara açılır) ve panelin içinde ters yönde kayan desen (desen ekrana göre sabit kalır). Ölçüler JS'te px olarak verilir. */
    "#acilis .acYari{position:absolute;top:0;overflow:hidden;pointer-events:none}" +
    "#acilis .acPanel{position:absolute;left:0;top:0;overflow:hidden;background:" + ZEMIN + "}" +
    "#acilis .acDesen{position:absolute;left:0;top:0}" +
    "#acilis .acDesen img{display:block;width:100%;height:100%;object-fit:cover}" +
    /* şeridin tepesi: şerit genişliğinde #163300 daire, içinde #9FE870 ev */
    "#acilis .acBas{position:absolute;top:0;border-radius:50%;background:#163300;display:flex;align-items:center;justify-content:center;pointer-events:none}" +
    "#acilis .acBas svg{width:46%;height:46%;fill:none;stroke:#9FE870;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
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
    var yari = function (yon) {
      return '<div class="acYari ac' + yon + '"><div class="acPanel"><div class="acDesen">' +
        '<img alt="" decoding="async" src="' + DESEN + '"></div></div></div>';
    };
    d.innerHTML =
      SEMBOL + yari("Sol") + yari("Sag") +
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
  function ikiKare(cb) {
    if (!window.requestAnimationFrame) return setTimeout(cb, 32);
    requestAnimationFrame(function () { requestAnimationFrame(cb); });
  }

  // ---------- veri hazır mı ----------
  var veriHazir = false, hazirBekleyen = null;
  function hazir() {
    veriHazir = true;
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

  // ---------- zaman çizelgesi (ms, native açılış ekranı gizlendikten sonra) ----------
  var T = { dur: 600, bas: 900, yuk: 1430, acil: 1600, son: 1630, sol: 200 };
  var E_BAS = "cubic-bezier(0.2, 0.0, 0.2, 1)";      // 2) baş gösterme: yumuşak, yavaş
  var E_YUK = "cubic-bezier(0.55, 0.0, 0.85, 0.45)"; // 3) yükseliş: yavaş başlar, hızlanır
  var E_ACIL = "cubic-bezier(0.5, 0, 0.9, 0.5)";     // 4) açılma: hızlanarak
  var BAS_ORAN = 0.08, SERIT_ORAN = 0.14;

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
    anaHazirla(false);
  }
  // ana ekran perdenin arkasında önceden kendi katmanında çizilsin (solma başlarken kare kaçmasın).
  // Perde %99,9 opak: tam opak olsa tarayıcı arkasını hiç çizmez.
  function anaHazirla(ac) {
    anaEkranlar().forEach(function (e) { e.style.willChange = ac ? "transform,opacity" : ""; });
    if (perde) perde.style.opacity = ac ? "0.999" : "";
  }

  // 6) desen solar; ana ekran belirir (kaydir: 12px aşağıdan yerine kayar). 200 ms, ease-out.
  // basla: zaman çizelgesindeki tam başlangıç anı (veri hazırsa t0 + 1630), yoksa şimdi
  function solVeBitir(d, basla, kaydir) {
    if (bitti) return; bitti = true;
    if (guvenlik) { clearTimeout(guvenlik); guvenlik = null; }
    perde = null;
    d.style.pointerEvents = "none";
    var sec = { duration: T.sol, easing: "ease-out", fill: "both" };
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
    var W = d.clientWidth, H = d.clientHeight;
    var S = Math.round(W * SERIT_ORAN), r = S / 2, cx = W / 2;
    var D0 = cx - r;                                              // kapalıyken panelin yatay kayıklığı
    var Y0 = H, Y1 = H * (1 - BAS_ORAN), Y2 = 0, Y3 = -r;     // şerit tepesinin ekrandaki yeri
    var px = function (v) { return v + "px"; };
    var sol = d.querySelector(".acSol"), sag = d.querySelector(".acSag");
    // kırpma kutuları: ekranın iki yarısı (ortada 1 px üst üste, dikiş görünmesin)
    sol.style.cssText = "left:0;width:" + px(cx + 1) + ";height:" + px(H);
    sag.style.cssText = "left:" + px(cx - 1) + ";width:" + px(W - cx + 1) + ";height:" + px(H);
    var pS = sol.firstChild, pR = sag.firstChild, dS = pS.firstChild, dR = pR.firstChild;
    // paneller ekrandan S kadar uzun (alt kenar hep ekranın dışında); üst köşe yarıçapı şeridin yarısı
    pS.style.cssText = "width:" + px(W) + ";height:" + px(H + S) + ";border-top-left-radius:" + px(r);
    pR.style.cssText = "left:" + px(-(cx - 1)) + ";width:" + px(W) + ";height:" + px(H + S) + ";border-top-right-radius:" + px(r);
    dS.style.cssText = dR.style.cssText = "width:" + px(W) + ";height:" + px(H);
    var bas = d.querySelector(".acBas");
    bas.style.cssText = "left:" + px(cx - r - 0.5) + ";top:-0.5px;width:" + px(S + 1) + ";height:" + px(S + 1);

    var o = function (ms) { return ms / T.son; };
    var tr = function (x, y) { return "translate(" + px(x) + "," + px(y) + ")"; };
    // [zaman, yatay kayıklık, şerit tepesi, bir sonraki adıma kadar easing]
    var adim = [
      [0, D0, Y0, "linear"],
      [T.dur, D0, Y0, E_BAS],   // 1) 0–600: sadece logo
      [T.bas, D0, Y1, E_YUK],   // 2) 600–900: %8'e baş gösterir
      [T.yuk, D0, Y2, E_ACIL],  // 3) 900–1430: %100'e hızlanarak yükselir
      [T.acil, 0, Y3, "linear"],// 4) 1430–1600: yanlara açılır (köşeler ekran dışına çıkar)
      [T.son, 0, Y3, "linear"]  // 5) 1600–1630: tam ekran desen
    ];
    var kare = function (fx, fy) {
      return adim.map(function (a) { return { offset: o(a[0]), easing: a[3], transform: tr(fx(a[1]), fy(a[2])) }; });
    };
    var ayni = function (v) { return v; }, ters = function (v) { return -v; };
    var sec = { duration: T.son, fill: "forwards" };
    var will = [pS, pR, dS, dR, bas];
    will.forEach(function (e) { e.style.willChange = "transform"; });
    bas.style.willChange = "transform,opacity";
    anaHazirla(true);
    var ana = anim(pS, kare(ayni, ayni), sec);
    anim(dS, kare(ters, ters), sec);   // desen ters yönde: ekrana göre sabit
    anim(pR, kare(ters, ayni), sec);
    anim(dR, kare(ayni, ters), sec);
    // daire: şeridin tepesinde yükselir; açılırken tepeden çıkıp kaybolur
    anim(bas, [
      { offset: 0, transform: tr(0, Y0), opacity: 1 },
      { offset: o(T.dur), transform: tr(0, Y0), opacity: 1, easing: E_BAS },
      { offset: o(T.bas), transform: tr(0, Y1), opacity: 1, easing: E_YUK },
      { offset: o(T.yuk), transform: tr(0, Y2), opacity: 1, easing: E_ACIL },
      { offset: o(T.acil), transform: tr(0, -S - 8), opacity: 0 },
      { offset: 1, transform: tr(0, -S - 8), opacity: 0 }
    ], sec);
    var t0 = document.timeline ? document.timeline.currentTime : null;
    if (t0 != null) animler.forEach(function (a) { a.startTime = t0; });
    d._t0 = t0;
    ana.finished.then(function () {
      will.forEach(function (e) { e.style.willChange = "auto"; });
      if (perde !== d || bitti) return;
      // 6) veri hazırsa tam 1630 ms'de solar; değilse desen ekranında en fazla 1,5 sn bekler (sonra iskelet ekran)
      veriyiBekle(function (zatenHazir) {
        if (perde !== d || bitti) return;
        solVeBitir(d, zatenHazir && t0 != null ? t0 + T.son : null, true);
      }, 1500);
    }, function () {});
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
