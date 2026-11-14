// Villa özellikleri ve ev olanakları için ikon tablosu (Görev 12.10: emoji yerine Lucide ikonları).
// Uygulama (index.html) ve misafir sayfası (g.html) aynı tabloyu kullanır.
// Lucide (https://lucide.dev, ISC lisansı) çizimleri dosyaya gömülüdür; internet gerekmez.
(function () {
  var A = {
    // Özellikler
    "Özel havuz": "waves",
    "Korunaklı havuz": "shield",
    "Isıtmalı havuz": "thermometer-sun",
    "Çocuk havuzu": "baby",
    "Jakuzi": "bath",
    "Deniz manzarası": "sailboat",
    "Doğa manzarası": "mountain",
    "Otopark": "square-parking",
    "Sessiz konum": "volume-x",
    "Araç gerekli": "car",
    "Bebek ekipmanı": "baby",
    "Engelli erişimi": "accessibility",
    // Ev olanakları
    "Buzdolabı": "refrigerator",
    "Bulaşık makinesi": "utensils",
    "Çamaşır makinesi": "washing-machine",
    "Fırın": "cooking-pot",
    "Su ısıtıcı": "coffee",
    "Tost makinesi": "sandwich",
    "Mikrodalga": "microwave",
    "TV": "tv",
    "Televizyon": "tv",
    "İnternet": "wifi",
    "Wi-Fi": "wifi",
    "Klima": "snowflake",
    "Saç kurutma makinesi": "wind",
    "Ütü": "shirt",
    "Sineklik": "bug",
    "Barbekü / Mangal": "flame",
    "Mangal": "flame",
    "Barbekü": "flame",
    "Hamak": "tree-palm",
    "Şömine": "flame-kindling",
    "Bebek yatağı": "bed-single",
    "Mama sandalyesi": "armchair"
  };
  var C = {
    "accessibility": "<circle cx=\"16\" cy=\"4\" r=\"1\"/><path d=\"m18 19 1-7-6 1\"/><path d=\"m5 8 3-3 5.5 3-2.36 3.5\"/><path d=\"M4.24 14.5a5 5 0 0 0 6.88 6\"/><path d=\"M13.76 17.5a5 5 0 0 0-6.88-6\"/>",
    "armchair": "<path d=\"M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3\"/><path d=\"M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"/><path d=\"M5 18v2\"/><path d=\"M19 18v2\"/>",
    "baby": "<path d=\"M9 12h.01\"/><path d=\"M15 12h.01\"/><path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\"/><path d=\"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\"/>",
    "bath": "<path d=\"M10 4 8 6\"/><path d=\"M17 19v2\"/><path d=\"M2 12h20\"/><path d=\"M7 19v2\"/><path d=\"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5\"/>",
    "bed-single": "<path d=\"M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8\"/><path d=\"M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4\"/><path d=\"M3 18h18\"/>",
    "bug": "<path d=\"m8 2 1.88 1.88\"/><path d=\"M14.12 3.88 16 2\"/><path d=\"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1\"/><path d=\"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6\"/><path d=\"M12 20v-9\"/><path d=\"M6.53 9C4.6 8.8 3 7.1 3 5\"/><path d=\"M6 13H2\"/><path d=\"M3 21c0-2.1 1.7-3.9 3.8-4\"/><path d=\"M20.97 5c0 2.1-1.6 3.8-3.5 4\"/><path d=\"M22 13h-4\"/><path d=\"M17.2 17c2.1.1 3.8 1.9 3.8 4\"/>",
    "car": "<path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\"/><circle cx=\"7\" cy=\"17\" r=\"2\"/><path d=\"M9 17h6\"/><circle cx=\"17\" cy=\"17\" r=\"2\"/>",
    "coffee": "<path d=\"M10 2v2\"/><path d=\"M14 2v2\"/><path d=\"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1\"/><path d=\"M6 2v2\"/>",
    "cooking-pot": "<path d=\"M2 12h20\"/><path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"/><path d=\"m4 8 16-4\"/><path d=\"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8\"/>",
    "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\"/>",
    "flame-kindling": "<path d=\"M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z\"/><path d=\"m5 22 14-4\"/><path d=\"m5 18 14 4\"/>",
    "microwave": "<rect width=\"20\" height=\"15\" x=\"2\" y=\"4\" rx=\"2\"/><rect width=\"8\" height=\"7\" x=\"6\" y=\"8\" rx=\"1\"/><path d=\"M18 8v7\"/><path d=\"M6 19v2\"/><path d=\"M18 19v2\"/>",
    "mountain": "<path d=\"m8 3 4 8 5-5 5 15H2L8 3z\"/>",
    "refrigerator": "<path d=\"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z\"/><path d=\"M5 10h14\"/><path d=\"M15 7v6\"/>",
    "sailboat": "<path d=\"M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z\"/><path d=\"M21 14 10 2 3 14h18Z\"/><path d=\"M10 2v16\"/>",
    "sandwich": "<path d=\"m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777\"/><path d=\"M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25\"/><path d=\"M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9\"/><path d=\"m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2\"/><rect width=\"20\" height=\"4\" x=\"2\" y=\"11\" rx=\"1\"/>",
    "shield": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>",
    "shirt": "<path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\"/>",
    "snowflake": "<line x1=\"2\" x2=\"22\" y1=\"12\" y2=\"12\"/><line x1=\"12\" x2=\"12\" y1=\"2\" y2=\"22\"/><path d=\"m20 16-4-4 4-4\"/><path d=\"m4 8 4 4-4 4\"/><path d=\"m16 4-4 4-4-4\"/><path d=\"m8 20 4-4 4 4\"/>",
    "square-parking": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M9 17V7h4a3 3 0 0 1 0 6H9\"/>",
    "thermometer-sun": "<path d=\"M12 9a4 4 0 0 0-2 7.5\"/><path d=\"M12 3v2\"/><path d=\"m6.6 18.4-1.4 1.4\"/><path d=\"M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"/><path d=\"M4 13H2\"/><path d=\"M6.34 7.34 4.93 5.93\"/>",
    "tree-palm": "<path d=\"M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4\"/><path d=\"M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3\"/><path d=\"M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35\"/><path d=\"M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14\"/>",
    "tv": "<rect width=\"20\" height=\"15\" x=\"2\" y=\"7\" rx=\"2\" ry=\"2\"/><polyline points=\"17 2 12 7 7 2\"/>",
    "utensils": "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\"/><path d=\"M7 2v20\"/><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\"/>",
    "volume-x": "<path d=\"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z\"/><line x1=\"22\" x2=\"16\" y1=\"9\" y2=\"15\"/><line x1=\"16\" x2=\"22\" y1=\"9\" y2=\"15\"/>",
    "washing-machine": "<path d=\"M3 6h3\"/><path d=\"M17 6h.01\"/><rect width=\"18\" height=\"20\" x=\"3\" y=\"2\" rx=\"2\"/><circle cx=\"12\" cy=\"13\" r=\"5\"/><path d=\"M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5\"/>",
    "waves": "<path d=\"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/><path d=\"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/><path d=\"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1\"/>",
    "wifi": "<path d=\"M12 20h.01\"/><path d=\"M2 8.82a15 15 0 0 1 20 0\"/><path d=\"M5 12.859a10 10 0 0 1 14 0\"/><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"/>",
    "wind": "<path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"/><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"/><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"/>"
  };
  function bul(ad) { return A[String(ad || "").trim()] || ""; }
  window.OZ_IKON = A;
  // Ozellik ikonu: <svg>; tabloda yoksa genel "tik" ikonu
  window.ozIkon = function (ad, boy, sinif) {
    var k = bul(ad), ic = C[k] || '<path d="M20 6 9 17l-5-5"/>';
    boy = boy || 20;
    return '<svg class="ozIk' + (sinif ? " " + sinif : "") + '" width="' + boy + '" height="' + boy +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ic + "</svg>";
  };
  // Eski adla çağıran yer kalırsa boş döner (emoji artık yok)
  window.ozEmoji = function () { return ""; };
})();
