# Uygulama ikonu adayları (Codex ile 10 çizim)

_Hazırlayan: Claude, 15 Kasım 2026. Amaç: eski ikonun yerine bizi anlatan, telefonda 60 px'te bile net okunan bir ikon. Wise ikonundan ALINAN ders (kopya değil): tek renk zemin + tek, kalın, sade sembol + yüksek kontrast + yazı yok._

## Codex'e verilecek ortak kural (her isteğin başına aynen koy)
App icon design for a mobile app called "Villa Takvimim" — a simple calendar and booking manager for holiday villa owners in Kalkan, Turkey. Requirements: 1024x1024 PNG, square, full-bleed solid background edge to edge, NO rounded corners (the phone adds them), NO transparency, NO text or letters unless the concept says so, NO gradients unless the concept says so, NO shadows, NO photo realism. One bold, flat, geometric symbol, centered, occupying about 55–60% of the canvas, thick shapes that stay readable at 60x60 pixels. Brand colors only: deep green #0B5B57, bright mint #9FE2BF, light mint #DCEBE5, white #FFFFFF, and (only if the concept asks) terracotta #C8734F or turquoise #2FB5B0. Modern, confident, calm, premium, like top apps on the App Store.

## 10 fikir — her biri ayrı istek, dosya adıyla kaydet
1. `ikon-01-ev-takvim.png` — A simple house silhouette (pitched roof) whose front is a 3×2 calendar grid of rounded squares; one square filled. Mint house on deep green background.
2. `ikon-02-takvim-cati.png` — A calendar page whose top binding bar is shaped like a pitched roof with a small chimney. White calendar, deep green roof, on bright mint background.
3. `ikon-03-yarim-gun.png` — Our signature: a single rounded square calendar day cell split diagonally from bottom-left to top-right, upper-left half mint, lower-right half white (meaning check-out and check-in on the same day). Deep green background. Very minimal.
4. `ikon-04-anahtar.png` — A bold house key whose bow (handle) is a small house shape with an arched door cut out. Bright mint key on deep green background.
5. `ikon-05-kemer-kapi.png` — A Mediterranean arched doorway (tall arch) in deep green, with a small mint half-circle sun peeking over its top. On light mint background.
6. `ikon-06-havuz-tik.png` — Two stacked soft wave lines (a pool) with a bold check mark rising out of them. White and mint shapes on deep green background.
7. `ikon-07-v-cati.png` — The letter "V" formed by two thick diagonal bars that also read as an upside-down roof / valley, with a small dot above (a sun). Mint on deep green. (Letter allowed in this concept only.)
8. `ikon-08-gunes-cati.png` — A minimal roof line (one thick inverted V stroke) with a large half sun rising behind it. Terracotta sun, deep green roof, on light mint background.
9. `ikon-09-zeytin-ev.png` — A small simple house with a single olive branch (3 leaves) curving over the roof. Deep green on bright mint background.
10. `ikon-10-konum-ev.png` — A map pin whose inner hole is a tiny house shape. Bright mint pin on deep green background, with one subtle calendar-tick mark at the bottom of the pin.

## Kontrol sayfası
Hepsi bitince `docs/ikon-adaylari.html` oluştur (tek dosya, görseller `docs/ikonlar/` klasöründen):
- Her aday için: numara + ad, 1024 px'in 256 px gösterimi, **iPhone ana ekranı boyutunda 60 px** (iOS köşe yuvarlaması ile: border-radius %22.5), ve **beyaz** ve **koyu duvar kağıdı** üzerinde 60 px.
- En altta 10 adayın hepsi yan yana, sahte bir iPhone ana ekranı satırında (diğer uygulama simgeleri yerine gri kareler), yazı olarak "Villa Takvimim".
