// Görev 42.4 kalıcı test için ortak düzen (Görev 19–41 test altyapısı): Playwright, sahte sunucu, sabit saat, iki ekran boyutu; ekran görüntüsü + taşma/kesilme/üst üste binme denetimi
const { chromium } = require("playwright-core"); const fs = require("fs"); const path = require("path");
const SB = "https://sahte.supabase.co";
const VID = "5afd01e0-0f45-4a5a-bbe9-0de986306501", VID2 = "6b0e01e0-0f45-4a5a-bbe9-0de986306502", VID3 = "7c0e01e0-0f45-4a5a-bbe9-0de986306503";
const RID = "11111111-1111-4111-8111-111111111111";
const b64 = s => Buffer.from(s).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
const jwt = "x." + b64(JSON.stringify({ sub: "u1", email: "s@o.com", exp: Math.floor(Date.now() / 1000) + 3600 })) + ".y";
const oturum = { access_token: jwt, refresh_token: "r", user: { id: "u1", email: "s@o.com" } };
const bk = ms => new Promise(z => setTimeout(z, ms));
const QA = process.env.QA_KLASOR || require("os").tmpdir() + "/villa-qa";
const BOYUT = { "iphone13": { width: 390, height: 664 }, "320": { width: 320, height: 640 }, "390": { width: 390, height: 844 }, "360": { width: 360, height: 740 }, "iphone14": { width: 390, height: 664 }, "430": { width: 430, height: 932 }, "440": { width: 440, height: 956 }, "se": { width: 375, height: 667 }, "iphone15": { width: 393, height: 852 } };

function veri(o) {
  const v1 = { id: VID, ad: "Villa Salta", renk: "#0B5B57", bilgi: Object.assign({ konum: "Kalkan", kurulumGizli: true, depozito: "5000", kapasite: "6", oda: "3", whatsapp: "05320000000" }, o.bilgi || {}), paylasim: { ad: "villa-salta-x", yayin: true, imza: "x" }, silindi_tarih: null };
  const v2 = { id: VID2, ad: "Villa Deniz Manzaralı", renk: "#3C4E8C", bilgi: { konum: "Kaş", kurulumGizli: true }, silindi_tarih: null };
  const v3 = { id: VID3, ad: "Villa Zeytin", renk: "#7A4E8C", bilgi: { konum: "Kalkan" }, silindi_tarih: null };
  const villalar = o.villalar || (o.tekVilla ? [v1] : (o.ucVilla ? [v1, v2, v3] : [v1, v2]));
  const rez = o.rezler || [
    { id: RID, villa_id: VID, baslangic: "2026-11-20", bitis: "2026-11-23", misafir: "Hasan Demir", kisi: 3, telefon: "05329998877", renk: "#3C4E8C" },
    { id: "11111111-1111-4111-8111-111111111112", villa_id: VID, baslangic: "2026-11-25", bitis: "2026-11-27", misafir: "Ayşe Yılmaz", kisi: 2, renk: "#0B5B57" },
    { id: "11111111-1111-4111-8111-111111111113", villa_id: VID2, baslangic: "2026-11-15", bitis: "2026-11-18", misafir: "Mehmet Kaya", kisi: 4, renk: "#9B2C4A" }];
  const fiyat = [];
  if (!o.fiyatsiz) for (let y of [2025, 2026]) for (let m = 0; m < 12; m++) for (let d = 1; d <= 28; d++) {
    const k = y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    fiyat.push({ villa_id: VID, tarih: k, tutar: (y === 2025 ? 7000 : 8000) + ((new Date(k).getDay() % 6 === 0) ? 2000 : 0) });
  }
  return { villalar, rez, fiyat: o.fiyatlar || fiyat };
}

async function ac(o = {}) {
  const boyut = BOYUT[o.boyut || "390"];
  // Görev 38: o.motor === "webkit" → Playwright WebKit (iOS Safari motoru)
  const b = o.motor === "webkit" ? await require("playwright-core").webkit.launch({ headless: true }) : await chromium.launch({ executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const ctx = await b.newContext({ viewport: boyut, colorScheme: o.koyu ? "dark" : "light", reducedMotion: o.azalt ? "reduce" : "no-preference", deviceScaleFactor: o.dsf || 2, isMobile: true, hasTouch: true, timezoneId: "Europe/Istanbul", locale: "tr-TR", ...(o.video ? { recordVideo: { dir: o.video, size: boyut } } : {}),
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148" });
  const p = await ctx.newPage();
  const V = veri(o), rol = o.rol || "sahip";
  const S = { hata: [], yazilan: [], V };
  p.on("pageerror", e => S.hata.push(e.message));
  S.konsol = []; p.on("console", m => { if (m.type() === "error" || m.type() === "warning") S.konsol.push(m.type() + ": " + m.text().slice(0, 300)); });
  const cevap = (r, d, st = 200) => r.fulfill({ status: st, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*" }, body: typeof d === "string" ? d : JSON.stringify(d) });
  await p.route("**/config.js*", r => r.fulfill({ status: 200, contentType: "text/javascript", body: 'window.VILLA_CONFIG={supabaseUrl:"' + SB + '",supabaseKey:"pk",siteUrl:"https://villatakvim.netlify.app",surum:"1.0.0"};' }));
  await p.route(SB + "/**", r => {
    const u = r.request().url(), m = r.request().method();
    if (m === "OPTIONS") return cevap(r, "");
    const yol = u.replace(SB + "/rest/v1/", "").split("?")[0];
    if (u.includes("/auth/v1/")) return cevap(r, oturum);
    if (u.includes("/storage/v1/")) return cevap(r, { Key: "x" });
    if (u.includes("/functions/v1/")) return cevap(r, {});
    if (m !== "GET") S.yazilan.push(m + " " + u.replace(SB + "/rest/v1/", "") + " " + (r.request().postData() || "").slice(0, 300));
    if (yol === "profiller") return cevap(r, [Object.assign({ id: "u1", ad: "Deneme Kullanıcı", telefon: "05320000000", eposta: "s@o.com", onay: true }, o.profil || {})]);
    if (o.ozelYol && o.ozelYol[yol]) { const x = o.ozelYol[yol](r, m); if (x) return cevap(r, x.govde, x.durum || 200); }
    if (yol === "villa_erisim") return cevap(r, V.villalar.map(v => ({ villa_id: v.id, rol })));
    if (yol === "villalar") { if (m === "GET") return cevap(r, V.villalar); return cevap(r, m === "PATCH" ? [{ id: VID }] : ""); }
    if (yol === "rezervasyonlar") return cevap(r, m === "GET" ? V.rez : [{ id: RID }]);
    if (yol === "fiyatlar") return cevap(r, m === "GET" ? V.fiyat : "");
    if (yol === "rezervasyon_mali") return cevap(r, rol === "sahip" ? [{ rezervasyon_id: RID, villa_id: VID, tutar: 24000, ek_ucret: 0, depozito_tutar: 5000 }] : []);
    if (yol === "odemeler") return cevap(r, m === "GET" ? (o.odemeler || []) : "");
    if (yol === "giderler") return cevap(r, m === "GET" ? (o.giderler || []) : "");
    if (yol === "gelirler") return cevap(r, m === "GET" ? (o.gelirler || []) : "");
    if (yol === "villa_fotograflar") return cevap(r, m === "GET" ? (o.fotolar || []) : "");
    if (yol === "teklifler") return cevap(r, m === "GET" ? (o.teklifler || []) : [{}]);
    if (yol === "rpc/kilit_al") return cevap(r, true);
    if (yol === "rpc/villa_erisimleri") return cevap(r, o.erisimler || []);
    if (yol === "rpc/bakici_kalanlar") return cevap(r, []);
    if (yol === "davetler") return cevap(r, [{ kod: "AB12CD" }]);
    // GOREV32_YOK: dış takvim tabloları bugünkü canlı veritabanında yok (VERITABANI_GOREV32 uygulanmadı) → 404
    if (/^(dis_bloklar|dis_takvimler|cakismalar|rez_tutmalar|villa_ical|rpc\/(takvim_durumlari|tutma_al|tutma_birak|ical_anahtarim|blok_rez_olustur|blok_eslestir|cakisma_coz))$/.test(yol))
      return cevap(r, { code: "PGRST205", message: "Could not find the table 'public." + yol + "' in the schema cache" }, 404);
    return cevap(r, []);
  });
  const hedef = Date.parse(o.saat || "2026-11-16T10:00:00+03:00");
  await p.addInitScript(([o, hedef, ek]) => {
    if (!ek.oturumsuz) localStorage.setItem("villa-takvim-oturum", o); localStorage.setItem("villa-takvim-kurulum", "kuruldu"); localStorage.setItem("vt-dt-yok", String(Date.now()));
    if (!ek.acilis) try { sessionStorage.setItem("vt-acilis", "1"); } catch (e) {}
    if (!ek.ipucu) { localStorage.setItem("vt-hap-ipucu", "1"); localStorage.setItem("vt-tur", "1"); localStorage.setItem("vt-sira-ipucu", "1"); }
    if (!ek.yardim) localStorage.setItem("vt-yardim", JSON.stringify({ acik: false, s: 22 }));
    if (ek.eskiYardim) localStorage.setItem("vt-yardim", ek.eskiYardim);
    // Görev 20: sahte visualViewport (iOS gibi: klavye açılınca yalnız görünen alan küçülür, sayfa boyu değişmez)
    if (ek.sahteVV) {
      const et = new EventTarget(); let vh = null, vt = 0;
      const vv = { get width() { return innerWidth; }, get height() { return vh == null ? innerHeight : vh; }, get offsetTop() { return vt; },
        offsetLeft: 0, get pageTop() { return scrollY + vt; }, pageLeft: 0, scale: 1,
        addEventListener: et.addEventListener.bind(et), removeEventListener: et.removeEventListener.bind(et), dispatchEvent: et.dispatchEvent.bind(et) };
      Object.defineProperty(window, "visualViewport", { configurable: true, get: () => vv });
      window.__vv = (h, ust) => { vh = h == null ? null : h; vt = ust || 0; et.dispatchEvent(new Event("resize")); };
      // Görev 23: iOS gibi klavye. Alan türüne göre yükseklik (metin / tel / numeric), 250 ms'de kademeli açılır
      // (her karede resize), isteğe bağlı: sonradan gelen "Otomatik doldur" çubuğu (+ek, gecikmeli), görünen alanın kayması (pan),
      // uygulama modu (VTKlavye: keyboardWillShow yüksekliği; "bayat" = önceki klavyenin yüksekliği).
      if (ek.klavye) {
        const K = ek.klavye; window.__K = K;
        const yazi = t => t && (t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && /^(text|tel|number|email|url|search|password)$/.test(t.type || "text")));
        const tur = t => t.getAttribute("inputmode") === "tel" ? "tel" : (t.getAttribute("inputmode") === "numeric" ? "numeric" : "metin");
        let anim = 0, cur = 0, sonH = 0;
        // Görev 24: klavyenin gerçek yeri (görselde ve ölçümde) __kl; uygulama modelinde animasyon bitince keyboardDidShow
        window.__kl = 0;
        const git = (h2, sure, pan, bitti) => { cancelAnimationFrame(anim); const h1 = cur, t0 = performance.now();
          const ad = () => { const k = sure ? Math.min(1, (performance.now() - t0) / sure) : 1; cur = Math.round(h1 + (h2 - h1) * k); window.__kl = cur;
            if (!K.vvYok) window.__vv(cur ? innerHeight - cur : null, cur ? Math.round((pan || 0) * k) : 0);
            if (k < 1) anim = requestAnimationFrame(ad); else if (bitti) bitti(); }; ad(); };
        window.__klavyeAc = (h, pan) => { if (K.native && window.VTKlavye) window.VTKlavye(h);
          git(h, K.anim === false ? 0 : 250, pan, () => { if (K.native && window.VTKlavye) window.VTKlavye(h, true); }); };
        document.addEventListener("focusin", e => { const t = e.target; if (!yazi(t)) return;
          const h = (K[tur(t)] || K.metin || 336);
          setTimeout(() => {
            if (K.native) { const bildir = K.bayat && sonH ? sonH : h; window.VTKlavye && window.VTKlavye(bildir); }
            sonH = h; git(h, K.anim === false ? 0 : 250, K.pan || 0, () => { if (K.native && window.VTKlavye && document.activeElement === t) window.VTKlavye(h, true); });
            if (K.ek && tur(t) === (K.ekTur || "tel")) setTimeout(() => { if (document.activeElement === t) { git(h + K.ek, K.anim === false ? 0 : 120, K.pan || 0); } }, K.ekGecikme || 400);
          }, 30); }, true);
        document.addEventListener("focusout", () => setTimeout(() => { if (!yazi(document.activeElement) && cur) { if (K.native && window.VTKlavye) window.VTKlavye(0); git(0, K.anim === false ? 0 : 250, 0); } }, 30), true);
      }
      // otomatik klavye (iOS gibi): yazı alanına odaklanınca açılır, odak gidince kapanır
      if (ek.otoKlavye) {
        const yazi = t => t && (t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && /^(text|tel|number|email|url|search|password)$/.test(t.type || "text")));
        document.addEventListener("focusin", e => { if (yazi(e.target) && vh == null) setTimeout(() => window.__vv(innerHeight - ek.otoKlavye, 0), 30); }, true);
        document.addEventListener("focusout", () => setTimeout(() => { if (!yazi(document.activeElement) && vh != null) window.__vv(null); }, 30), true);
      }
    }
    if (ek.ls) Object.keys(ek.ls).forEach(k => localStorage.setItem(k, ek.ls[k]));
    // Görev 26: animate kancası — kademeli girişleri ve açılışın .wrap solmasını zamanıyla kaydeder
    if (ek.kanca) { window.__anim = []; const asil = Element.prototype.animate;
      Element.prototype.animate = function (k, o) { const a = asil.call(this, k, o);
        try { const ilk = Array.isArray(k) ? k[0] : null;
          if (ilk && /translateY\(10px\)/.test(ilk.transform || "")) { const ek2 = this.closest("#ana,#takvim,#ajanda,#kasa,#hesapEkran");
            window.__anim.push({ ekran: ek2 && ek2.id, gecikme: Math.round((o && o.delay) || 0), sure: o && o.duration, basla: Math.round(document.timeline.currentTime + ((o && o.delay) || 0)) }); }
          if (this.classList && this.classList.contains("wrap") && Array.isArray(k) && k.length >= 3) setTimeout(() => { try { const t = a.effect.getComputedTiming(), kk = a.effect.getKeyframes(); window.__solma = Math.round(a.startTime + kk[1].computedOffset * t.duration); } catch (e) {} }, 50);
        } catch (e) {}
        return a; }; }
    var D = Date, fark = hedef - D.now();
    function F() { if (!(this instanceof F)) return new D(D.now() + fark).toString();
      if (arguments.length === 0) return new D(D.now() + fark);
      return new (Function.prototype.bind.apply(D, [null].concat([].slice.call(arguments))))(); }
    F.prototype = D.prototype; F.now = function () { return D.now() + fark; }; F.parse = D.parse; F.UTC = D.UTC;
    window.Date = F;
  }, [JSON.stringify(oturum), hedef, { ipucu: !!o.ipucu, ls: o.ls || null, yardim: !!o.yardim, sahteVV: !!o.sahteVV, otoKlavye: o.otoKlavye || 0, klavye: o.klavye || null, eskiYardim: o.eskiYardim || null, acilis: !!o.acilis, kanca: !!o.kanca, oturumsuz: !!o.oturumsuz }]);
  await p.goto("http://localhost:" + (o.port || process.env.QA_PORT || 5077) + "/" + (o.yol || ""), { waitUntil: "networkidle" }); await bk(500);
  const t = async s => { await p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error("yok: " + s); e.click(); }, s); };
  const yazi = s => p.evaluate(s => { const e = document.querySelector(s); return e ? e.innerText.replace(/\s+/g, " ").trim() : null; }, s);
  const gun = async k => { await p.evaluate(k => { const c = document.querySelector('#grid .cell[data-k="' + k + '"]'); if (!c) throw new Error("gün yok " + k); c.click(); }, k); await bk(120); };
  return { b, ctx, p, S, t, yazi, gun, bk };
}

// sayfa denetimi: yatay taşma, kesilen yazı/buton, üst üste binen dokunulabilir öğeler, küçük dokunma alanı
async function denetle(p) {
  return p.evaluate(() => {
    const W = innerWidth, sorun = [];
    if (document.documentElement.scrollWidth > W + 0.5) sorun.push("yatay taşma: scrollWidth " + document.documentElement.scrollWidth + " > " + W);
    const gorunur = e => { const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
      const s = getComputedStyle(e); if (s.visibility === "hidden" || s.opacity === "0" || s.display === "none") return false;
      for (let x = e; x; x = x.parentElement) { const st = getComputedStyle(x); if (st.display === "none" || st.visibility === "hidden" || +st.opacity === 0) return false; }
      return r.bottom > 0 && r.top < innerHeight; };
    const ad = e => (e.id ? "#" + e.id : e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : "")) + " «" + (e.innerText || e.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 30) + "»";
    // kaydırılan kaplar (yatay kaydırma bilerek) içindekiler sayfadan taşma sayılmaz
    const kaydirmaIcinde = e => { for (let x = e.parentElement; x; x = x.parentElement) { const s = getComputedStyle(x); if ((s.overflowX === "auto" || s.overflowX === "scroll") && x.scrollWidth > x.clientWidth) return x; } return null; };
    // açık panel (sheet) varsa yalnız onun içi denetlenir (arkadaki ekran kararmış, dokunulamaz)
    const kok = document.querySelector(".overlay:not(.kapaniyor)") || document.querySelector(".rhSon") || document.querySelector(".rh:not(.gizli):not(.duraklat) .rhBalon") || document;
    const etkin = [...kok.querySelectorAll("button, a, input, select, textarea, [role=button]")].filter(gorunur);
    etkin.forEach(e => {
      const r = e.getBoundingClientRect(), kap = kaydirmaIcinde(e);
      if (!kap && (r.right > W + 1 || r.left < -1)) sorun.push("ekrandan taşıyor: " + ad(e) + " [" + Math.round(r.left) + "," + Math.round(r.right) + "]");
      if (e.tagName !== "INPUT" && e.tagName !== "TEXTAREA" && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== "visible") sorun.push("yazısı kesik: " + ad(e));
      // içindeki yazı kutusundan taşıyor mu
      [...e.querySelectorAll("span")].forEach(s => { if (!gorunur(s) || !s.innerText.trim()) return; const q = s.getBoundingClientRect();
        if (q.right > r.right + 1.5 || q.left < r.left - 1.5) sorun.push("yazı kutudan taşıyor: " + ad(e) + " → «" + s.innerText.trim().slice(0, 20) + "»");
        if (s.scrollWidth > s.clientWidth + 2 && /ellipsis|hidden/.test(getComputedStyle(s).overflow + getComputedStyle(s).textOverflow) && !s.closest(".rkAd,.kad,.kalt,.satirAlt,.vbAd,.durumEt,.tkAd,.kTek")) sorun.push("yazı kesik (…): " + ad(e) + " → «" + s.innerText.trim().slice(0, 24) + "»"); });
      if ((r.height < 47.5 || r.width < 47.5) && !e.closest(".grid,.fyIzgara,.ftIzgara") && e.tagName !== "INPUT" && e.tagName !== "TEXTAREA" && !e.classList.contains("linkSatir"))
        sorun.push("dokunma alanı küçük (" + Math.round(r.width) + "×" + Math.round(r.height) + "): " + ad(e));
    });
    // üst üste binme: dokunulabilir öğe çiftleri (biri diğerinin içinde değilse)
    for (let i = 0; i < etkin.length; i++) for (let j = i + 1; j < etkin.length; j++) {
      const a = etkin[i], c = etkin[j]; if (a.contains(c) || c.contains(a)) continue;
      const r1 = a.getBoundingClientRect(), r2 = c.getBoundingClientRect();
      const ox = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left), oy = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
      if (ox > 3 && oy > 3) {
        // sabit alt menünün altında kalan içerik (kaydırılınca çıkar) sayılmaz
        const sabit = x => { for (let y = x; y; y = y.parentElement) { const s = getComputedStyle(y).position; if (s === "fixed" || s === "sticky") return true; } return false; };
        if (sabit(a) !== sabit(c)) continue;
        sorun.push("üst üste: " + ad(a) + " ↔ " + ad(c));
      }
    }
    return [...new Set(sorun)];
  });
}
async function cek(p, klasor, ad, boyut, tamSayfa) {
  const yol = QA + "/" + klasor; fs.mkdirSync(yol, { recursive: true });
  // görselde klavyenin yeri gri şeritle gösterilir (sahte klavye ekrana çizilmez)
  await p.evaluate(() => { const vv = window.visualViewport, kl = window.__kl || 0; if (!kl && (!vv || innerHeight - vv.height < 80)) return;
    const k = document.createElement("div"); k.id = "qaKlavye"; const ust = kl ? innerHeight - kl : vv.offsetTop + vv.height;
    k.style.cssText = "position:fixed;left:0;right:0;top:" + ust + "px;bottom:0;background:#C9CED6;z-index:2147483647;pointer-events:none;" +
      "display:flex;align-items:center;justify-content:center;font:500 15px system-ui;color:#5B626B";
    k.textContent = "klavye (" + Math.round(innerHeight - ust) + " pt)"; document.body.appendChild(k); });
  await p.screenshot({ path: yol + "/" + ad + "-" + boyut + ".png", fullPage: !!tamSayfa });
  await p.evaluate(() => { const k = document.getElementById("qaKlavye"); if (k) k.remove(); });
  return denetle(p);
}
// rehber: baloncuk metni, adım, delik
async function rh(p) {
  return p.evaluate(() => {
    const o = document.querySelector(".rh"); if (!o) return null;
    const d = o.querySelector(".rhDelik").getBoundingClientRect(), b = o.querySelector(".rhBalon").getBoundingClientRect();
    return { metin: o.querySelector(".rhMetin").innerText, say: o.querySelector(".rhSay").innerText, sinif: o.className,
      ileri: !o.querySelector(".rhIleri").classList.contains("hide") ? o.querySelector(".rhIleri").innerText : null,
      geri: !o.querySelector(".rhGeri").classList.contains("hide"),
      delik: [d.left, d.top, d.right, d.bottom].map(Math.round), balon: [b.left, b.top, b.right, b.bottom].map(Math.round) };
  });
}
// öğenin ortasına gerçek dokunuş (perde varsa delikten geçmeli)
async function dokun(p, sec) {
  const r = await p.evaluate(async s => { const e = typeof s === "string" ? document.querySelector(s) : null; if (!e) return null;
    let q = e.getBoundingClientRect();
    // rehber yokken ekran dışındaki öğeye önce kaydırılır (kullanıcı da kaydırır); rehber varken kaydırmayı rehber yapar
    if ((q.top < 0 || q.bottom > innerHeight) && !document.querySelector(".rh:not(.gizli)")) {
      e.scrollIntoView({ block: "center" }); await new Promise(z => setTimeout(z, 150)); q = e.getBoundingClientRect(); }
    return { x: q.left + q.width / 2, y: q.top + q.height / 2 }; }, sec);
  if (!r) throw new Error("yok: " + sec);
  await p.touchscreen.tap(r.x, r.y); await bk(160);
}
async function dokunXY(p, x, y) { await p.touchscreen.tap(x, y); await bk(160); }
module.exports = { ac, bk, cek, denetle, rh, dokun, dokunXY, QA, VID, VID2, VID3, RID };
