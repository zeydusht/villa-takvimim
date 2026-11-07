// Villa özellikleri ve ev olanakları için emoji tablosu.
// Uygulama (index.html) ve misafir sayfası (g.html) aynı tabloyu kullanır.
(function () {
  var E = {
    // Özellikler
    "Özel havuz": "🏊",
    "Korunaklı havuz": "🌿",
    "Isıtmalı havuz": "♨️",
    "Çocuk havuzu": "🧒",
    "Jakuzi": "🛁",
    "Deniz manzarası": "🌊",
    "Doğa manzarası": "⛰️",
    "Otopark": "🅿️",
    "Sessiz konum": "🤫",
    "Araç gerekli": "🚗",
    "Bebek ekipmanı": "👶",
    "Engelli erişimi": "♿",
    // Ev olanakları
    "Buzdolabı": "🧊",
    "Bulaşık makinesi": "🍽️",
    "Çamaşır makinesi": "🧺",
    "Fırın": "🍳",
    "Su ısıtıcı": "☕",
    "Tost makinesi": "🥪",
    "Mikrodalga": "🍲",
    "TV": "📺",
    "Televizyon": "📺",
    "İnternet": "📶",
    "Wi-Fi": "📶",
    "Klima": "❄️",
    "Saç kurutma makinesi": "💨",
    "Ütü": "👔",
    "Sineklik": "🦟",
    "Barbekü / Mangal": "🔥",
    "Mangal": "🔥",
    "Hamak": "🌴",
    "Şömine": "🪵",
    "Bebek yatağı": "🛏️",
    "Mama sandalyesi": "🪑"
  };
  window.OZ_EMOJI = E;
  window.ozEmoji = function (ad) { return E[String(ad || "").trim()] || ""; };
})();
