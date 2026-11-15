/* ============================================================
   VİLLA TAKVİM — açılış animasyonu (Görev 16.2) ve Face ID kilidi (16.3)
   Tek modül. <body>'nin en başında yüklenir.
   Sıra: native açılış ekranı → aynı görünümde web perdesi (logo) →
         [kilit açıksa Face ID] → altta hap şerit yükselir → yanlara açılıp
         ekranı desenle kaplar → veri hazırsa desen solar, ana ekran belirir.
   Sadece transform / opacity / clip-path (layout tetiklemez).
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
  var CSS =
    "#acilis{position:fixed;inset:0;z-index:2147483000;background:#9FE870;overflow:hidden;" +
      "-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:none}" +
    /* logo: native açılış ekranıyla aynı yer ve boyut. assets/splash.png 2732'lik karede sembol %22 genişlikte (601 px) ve ortada;
       ekran onu kaplayacak şekilde ölçeklenir. Logo assets/sembol.svg'den satır içi vektör (her boyutta net). */
    "#acilis .acLogo{position:absolute;left:50%;top:50%;width:calc(601.04 / 2732 * max(100vw,100vh));height:auto;aspect-ratio:656/640;" +
      "color:#163300;transform:translate(-50%,-50%);pointer-events:none;display:block}" +
    /* hap şerit: açık yeşil kenar katmanı + desen katmanı, ikisi de clip-path ile */
    "#acilis .acKat{position:absolute;inset:0;will-change:clip-path}" +
    "#acilis .acYesil{background:#9FE2BF;clip-path:inset(100% calc(50% - 32px) 0 calc(50% - 32px) round 32px)}" +
    "#acilis .acDoku{background:#9FE2BF url(img/acilis-doku.webp) center/cover no-repeat;" +
      "clip-path:inset(calc(100% + 60px) calc(50% - 28px) 0 calc(50% - 28px) round 28px)}" +
    /* hapın tepesi: 56px koyu (#163300) daire, içinde beyaz ev */
    "#acilis .acBas{position:absolute;left:50%;top:0;width:64px;height:64px;margin-left:-32px;" +
      "display:flex;align-items:center;justify-content:center;transform:translateY(calc(100vh + 72px));visibility:hidden;will-change:transform,opacity}" +
    "#acilis .acDaire{width:56px;height:56px;border-radius:50%;background:#163300;display:flex;align-items:center;justify-content:center}" +
    "#acilis .acDaire svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
    /* 2) yüksel — 550 ms */
    "#acilis.yuksel .acYesil,#acilis.yuksel .acDoku,#acilis.yuksel .acBas{transition:clip-path 550ms cubic-bezier(.2,.8,.2,1),transform 550ms cubic-bezier(.2,.8,.2,1)}" +
    "#acilis.yuksel .acYesil{clip-path:inset(0 calc(50% - 32px) 0 calc(50% - 32px) round 32px)}" +
    "#acilis.yuksel .acDoku{clip-path:inset(60px calc(50% - 28px) 0 calc(50% - 28px) round 28px)}" +
    "#acilis.yuksel .acBas{transform:translateY(0);visibility:visible}" +
    /* 3) yanlara açıl — 300 ms; daire yukarı çıkıp kaybolur */
    "#acilis.acil .acYesil,#acilis.acil .acDoku{transition:clip-path 300ms cubic-bezier(.4,0,.2,1)}" +
    "#acilis.acil .acBas{transition:transform 300ms cubic-bezier(.4,0,.2,1),opacity 200ms ease-out}" +
    "#acilis.acil .acYesil,#acilis.acil .acDoku{clip-path:inset(0 0 0 0 round 0)}" +
    "#acilis.acil .acBas{transform:translateY(-96px);opacity:0}" +
    /* 4) desen solar — 250 ms */
    "#acilis.sol{transition:opacity 250ms ease-out;opacity:0;pointer-events:none}" +
    "#acilis.sade{transition:opacity 200ms ease-out}" +
    "#acilis.sade.sol{opacity:0}" +
    /* ana ekran %96 → %100, 12px aşağıdan */
    ".acGiris{transform:translateY(12px) scale(.96);opacity:.001;transform-origin:50% 0}" +
    ".acGiris.acGel{transition:transform 250ms cubic-bezier(.2,.8,.2,1),opacity 250ms ease-out;transform:none;opacity:1}" +
    /* kilit: Face ID başarısızsa */
    "#acilis .acKilit{position:absolute;left:0;right:0;bottom:calc(3rem + env(safe-area-inset-bottom));display:none;" +
      "flex-direction:column;align-items:center;gap:.75rem;padding:0 1.5rem;color:#163300;text-align:center}" +
    "#acilis.kilitli .acKilit{display:flex}" +
    "#acilis .acKilit p{margin:0 0 .25rem;font-size:.95rem;opacity:.85}" +
    "#acilis .acKilit button{width:100%;max-width:20rem;min-height:3.25rem;border-radius:999px;font:inherit;font-size:1rem;" +
      "font-weight:500;border:1.5px solid rgba(22,51,0,.55);background:transparent;color:#163300;cursor:pointer;text-align:center}" +
    "#acilis .acKilit button.acAna{background:#163300;color:#fff;border-color:#163300}";

  var EV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>' +
    '<path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

  // uygulama sembolü (assets/sembol.svg), rengi currentColor
  var SEMBOL = "<svg class=\"acLogo\" viewBox=\"184 191 656 640\" aria-hidden=\"true\" focusable=\"false\"><mask id=\"vtSemAcilis\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"1024\" height=\"1024\"><rect x=\"0\" y=\"0\" width=\"1024\" height=\"1024\" fill=\"black\"/><g fill=\"white\"><rect x=\"629\" y=\"201\" width=\"97\" height=\"190\" rx=\"12\"/><rect x=\"250\" y=\"400\" width=\"522\" height=\"430\" rx=\"62\"/><polyline points=\"218.5,449 512,226 805.5,449\" fill=\"none\" stroke=\"white\" stroke-width=\"69\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><polygon points=\"250,425 512,226 772,425 772,520 250,520\"/></g><g fill=\"black\"><path d=\"M512 280 L606 352 L606 398 Q606 411 593 411 L431 411 Q418 411 418 398 L418 352 Z\"/><rect x=\"360\" y=\"382\" width=\"44\" height=\"104\" rx=\"22\"/><rect x=\"619\" y=\"382\" width=\"44\" height=\"104\" rx=\"22\"/><rect x=\"312\" y=\"542\" width=\"101\" height=\"96\" rx=\"20\"/><rect x=\"460\" y=\"542\" width=\"103\" height=\"96\" rx=\"20\"/><rect x=\"609\" y=\"542\" width=\"102\" height=\"96\" rx=\"20\"/><rect x=\"312\" y=\"673\" width=\"101\" height=\"96\" rx=\"20\"/><rect x=\"460\" y=\"673\" width=\"103\" height=\"96\" rx=\"20\"/></g></mask><rect x=\"0\" y=\"0\" width=\"1024\" height=\"1024\" fill=\"currentColor\" mask=\"url(#vtSemAcilis)\"/></svg>";

  function cev(t) { try { return (window.DIL && DIL.cevir) ? DIL.cevir(t) : t; } catch (e) { return t; } }

  var stilEklendi = false;
  function stilEkle() {
    if (stilEklendi) return; stilEklendi = true;
    var s = document.createElement("style"); s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  // ---------- perde ----------
  var perde = null, bitti = true, zamanlar = [];
  function zaman(fn, ms) { var z = setTimeout(fn, ms); zamanlar.push(z); return z; }
  function zamanlariSil() { zamanlar.forEach(clearTimeout); zamanlar = []; }

  function perdeKur() {
    stilEkle();
    var d = document.createElement("div");
    d.id = "acilis";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML =
      SEMBOL +
      '<div class="acKat acYesil"></div><div class="acKat acDoku"></div>' +
      '<div class="acBas"><div class="acDaire">' + EV + "</div></div>" +
      '<div class="acKilit"><p class="acKilitYazi"></p>' +
      '<button type="button" class="acAna acTekrar"></button>' +
      '<button type="button" class="acSifre"></button></div>';
    // body'ye değil kök öğeye: ana ekranın transform'u perdeyi etkilemesin
    document.documentElement.appendChild(d);
    return d;
  }
  // logo (satır içi vektör, yüklenmesi beklenmez) ekrana çizilince native açılış ekranı gizlenir (geçiş fark edilmesin)
  function logoHazir(d, cb) {
    var tamam = false;
    var git = function () { if (tamam) return; tamam = true; cb(); };
    if (window.requestAnimationFrame) requestAnimationFrame(function () { requestAnimationFrame(git); });
    setTimeout(git, 120);
  }

  // ---------- veri hazır mı ----------
  var veriHazir = false, hazirBekleyen = null;
  function hazir() {
    veriHazir = true;
    if (hazirBekleyen) { var f = hazirBekleyen; hazirBekleyen = null; f(); }
  }
  function veriyiBekle(cb, enFazla) {
    if (veriHazir) return cb();
    var gitti = false;
    var git = function () { if (gitti) return; gitti = true; hazirBekleyen = null; cb(); };
    hazirBekleyen = git;
    zaman(git, enFazla);
  }

  // ---------- ana ekranın girişi ----------
  // perde solarken ana ekran %96'dan büyüyerek, 12px aşağıdan gelir
  function anaEkranGelsin() {
    var l = [document.querySelector(".wrap"), document.getElementById("sekmeler")].filter(Boolean);
    l.forEach(function (e) { e.classList.add("acGiris"); });
    // iki kare bekle ki geçiş başlangıç değerinden başlasın
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      l.forEach(function (e) { e.classList.add("acGel"); });
    }); });
    setTimeout(function () { l.forEach(function (e) { e.classList.remove("acGiris", "acGel"); }); }, 360);
  }
  function anaEkranAnında() {
    [document.querySelector(".wrap"), document.getElementById("sekmeler")].forEach(function (e) {
      if (e) e.classList.remove("acGiris", "acGel");
    });
  }

  function perdeKaldir(hemen) {
    if (bitti) return; bitti = true;
    zamanlariSil();
    var d = perde; perde = null;
    if (!d) return;
    if (hemen) { anaEkranAnında(); d.remove(); return; }
    d.classList.add("sol");
    anaEkranGelsin();
    setTimeout(function () { d.remove(); }, 300);
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
  function oynat(d) {
    if (azHareket()) {
      // logo → 200 ms solma → ana ekran
      d.classList.add("sade");
      veriyiBekle(function () { perdeKaldir(false); }, 1500);
      return;
    }
    zaman(function () {
      d.classList.add("yuksel");                        // 2) şerit yükselir (550 ms)
      zaman(function () {
        d.classList.add("acil");                        // 3) yanlara açılır (300 ms)
        zaman(function () {
          veriyiBekle(function () { perdeKaldir(false); }, 1500); // 4) veri hazırsa solar
        }, 300);
      }, 550);
    }, 120);
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
    // güvenlik: perde hiçbir durumda 6 sn'den uzun kalmasın (kilit hariç)
    setTimeout(function () {
      if (!bitti && perde === d && !d.classList.contains("kilitli") && !d.classList.contains("kilitBekle")) perdeKaldir(true);
    }, 6000);
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
    d.classList.add("sade");
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
