# Uygulama ikonu — 2. tur: "Çatılı takvim" (aday 2) Wise tarzı yeniden tasarım

_Hazırlayan: Claude, 15 Kasım 2026. Zeyd 1. turdan **ikon-02-takvim-cati**'yi seçti ve Wise ikonunun netliğini istiyor._

**Wise ikonundan alınan ilkeler (kopya değil):** parlak tek renk zemin + çok koyu tek renk sembol · sembol iri ve tıknaz (kanvasın ~%62–68'i) · ince detay yok, çizgi yok, gölge yok, geçiş yok · hafif dinamik duruş.
**Wise'tan ALINMAYACAKLAR:** onların limon-sarımsı yeşili (#9FE870) ve neredeyse siyah yeşili, "7" bayrak şekli. Bizim renklerimiz ve sembolümüz kullanılacak.

## Ortak kural (her isteğin başına aynen koy)
App icon for "Villa Takvimim", a villa calendar and booking app. 1024x1024 PNG, square, full-bleed solid background, NO rounded corners (the phone adds them), NO transparency, NO text, NO gradients, NO shadows, NO outlines, NO 3D. A single bold flat symbol: a calendar with a house roof. The symbol is chunky and simple, filling about 62–68% of the canvas, perfectly readable at 60x60 px. Soft but crisp geometry: slightly rounded corners on shapes (corner radius about 6–10% of shape size), very few details. Two colors only unless told otherwise: background bright fresh mint #8FE3B6, symbol very deep green #063B35. Feels confident, friendly and premium, in the spirit of the cleanest fintech app icons.

## 10 varyasyon — her biri ayrı istek
1. `ikon2-01.png` — Calendar body (rounded rectangle) with a pitched roof on top instead of the binding bar; inside the body exactly ONE day square cut out as negative space (background shows through), lower right. No other grid cells.
2. `ikon2-02.png` — Same as 1 but the whole symbol leans forward about 8 degrees (italic, dynamic), roof peak slightly off-center to the right.
3. `ikon2-03.png` — Calendar body with roof; the two calendar binding rings become one chunky chimney on the roof. Inside: a 2x2 grid of day squares as negative space, one of them filled back in (booked).
4. `ikon2-04.png` — A solid calendar square with a triangle notch roof shape rising from its top edge, all one continuous silhouette (house = calendar). Inside, a single diagonal half-cell: one day square split diagonally, upper-left half negative space (check-out/check-in day).
5. `ikon2-05.png` — Negative-space version: a big solid deep green rounded square (the calendar page) with a white-mint house silhouette (roof + body + arched door) cut out of it, and two small binding tabs on top.
6. `ikon2-06.png` — Calendar with roof, body has 3x2 day grid as negative space, middle bottom cell replaced by a small arched door. Very chunky, thick walls.
7. `ikon2-07.png` — Inverse colors: background very deep green #063B35, symbol bright mint #8FE3B6. Design: the cleanest of the above — roof + calendar body + one negative-space day.
8. `ikon2-08.png` — Roof drawn as a thick chevron stroke separated by a small gap from a rounded calendar body below; body contains one large check mark as negative space.
9. `ikon2-09.png` — Minimal: only a thick roof chevron on top and a rounded square below with ONE small filled dot day in its upper left; generous breathing room. Background warm light mint #CDEFDD instead, symbol #063B35.
10. `ikon2-10.png` — Bold geometric: house silhouette whose lower body is a calendar page with a folded corner (bottom right), one negative-space day square, slight forward lean (5 degrees).

## Kontrol sayfası
`docs/ikon-adaylari-2.html` (görseller `docs/ikonlar2/`): her biri 256 px + 60 px iOS köşeli + beyaz ve koyu duvar kağıdında 60 px; en altta 10'u bir iPhone ana ekranı satırında, aralarında referans olarak 1. turdaki `ikon-02-takvim-cati.png` de bulunsun.
