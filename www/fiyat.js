/* Görev 20.7: konaklama ücreti tek yerde hesaplanır. Uygulama (index.html) ve misafir sayfası (g.html) bu dosyayı kullanır.
   Konaklama ücreti = gecelerin fiyatı + kısa konaklama ücreti (gece sayısı sınırın altındaysa).
   Hasar depozitosu bu toplama DAHİL DEĞİLDİR; her yerde ayrıca yazılır. */
(function () {
  "use strict";
  function parse(k) { var p = String(k).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iki(n) { return (n < 10 ? "0" : "") + n; }
  function fmt(d) { return d.getFullYear() + "-" + iki(d.getMonth() + 1) + "-" + iki(d.getDate()); }
  // kısa konaklama ücreti: gece sayısı sınırın altında ya da eşitse
  function ek(sinir, ucret, gece) { sinir = +sinir || 0; ucret = +ucret || 0; return (sinir && ucret && gece <= sinir) ? ucret : 0; }
  // o: {fiyatlar: {"2026-11-27": 1200, …}, bas, bit ("YYYY-AA-GG"), kisaSinir, kisaUcret}
  // → {gece, geceler (gecelerin toplamı), eksik (fiyatı girilmemiş gece sayısı), ek (kısa konaklama), toplam, tek (tüm geceler aynıysa o fiyat)}
  function konaklama(o) {
    var gece = 0, geceler = 0, eksik = 0, tek = null, f = o.fiyatlar || {};
    if (o.bas && o.bit) for (var d = parse(o.bas); fmt(d) < o.bit; d.setDate(d.getDate() + 1)) {
      var x = +f[fmt(d)] || 0;
      gece++;
      if (x) geceler += x; else eksik++;
      if (tek === null) tek = x; else if (tek !== x) tek = false;
    }
    var e = ek(o.kisaSinir, o.kisaUcret, gece);
    return { gece: gece, geceler: geceler, eksik: eksik, ek: e, toplam: geceler + e, tek: (eksik || !tek) ? null : tek };
  }
  window.VTFiyat = { konaklama: konaklama, ek: ek };
})();
