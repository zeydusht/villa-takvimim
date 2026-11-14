// Villa özellikleri ve ev olanakları → ikon adı (çizimler www/ikonlar.js içinde; Görev 12.10, 13.3).
// Uygulama (index.html) ve misafir sayfası (g.html) aynı tabloyu kullanır; ikonlar.js bu dosyadan önce yüklenir.
// Tam karşılığı olmayan özellikler için alakasız ikon yerine genel "tik" kullanılır.
(function () {
  var A = {
    // Özellikler
    "Özel havuz": "oz-havuz",
    "Korunaklı havuz": "oz-cit",
    "Isıtmalı havuz": "oz-isitma",
    "Çocuk havuzu": "oz-bebek",
    "Jakuzi": "oz-jakuzi",
    "Deniz manzarası": "oz-deniz",
    "Doğa manzarası": "oz-dag",
    "Otopark": "oz-otopark",
    "Sessiz konum": "oz-sessiz",
    "Araç gerekli": "oz-araba",
    "Bebek ekipmanı": "oz-puset",
    "Engelli erişimi": "oz-erisim",
    // Ev olanakları
    "Buzdolabı": "oz-buzdolabi",
    "Bulaşık makinesi": "oz-catal",
    "Çamaşır makinesi": "oz-camasir",
    "Fırın": "oz-firin",
    "Su ısıtıcı": "oz-caydanlik",
    "Tost makinesi": "oz-tost",
    "Mikrodalga": "oz-mikrodalga",
    "TV": "oz-tv",
    "Televizyon": "oz-tv",
    "İnternet": "oz-wifi",
    "Wi-Fi": "oz-wifi",
    "Klima": "oz-klima",
    "Saç kurutma makinesi": "oz-fon",
    "Ütü": "oz-utu",
    "Sineklik": "oz-sineklik",
    "Barbekü / Mangal": "oz-mangal",
    "Mangal": "oz-mangal",
    "Barbekü": "oz-mangal",
    "Hamak": "oz-hamak",
    "Şömine": "oz-somine",
    "Bebek yatağı": "oz-besik",
    "Mama sandalyesi": "oz-mama"
  };
  function bul(ad) { return A[String(ad || "").trim()] || ""; }
  window.OZ_IKON = A;
  window.ozIkon = function (ad, boy, sinif) {
    if (!window.ikon) return "";
    return window.ikon(bul(ad) || "tik", { boy: boy || 20, sinif: "ozIk" + (sinif ? " " + sinif : "") });
  };
  window.ozEmoji = function () { return ""; };
})();
