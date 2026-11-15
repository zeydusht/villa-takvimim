# Açılış animasyonu — Wise ölçümleri (kare kare, 60 fps, 390×844 pt ekran)

_Claude, 15 Kasım 2026. Önceki tarifte şerit genişliği (%14) ve yükseliş eğrisi yanlıştı; bu tablo onların yerine geçer. **Eğri tahmini YOK: aşağıdaki anahtar kareleri Web Animations API'de `offset` ile, kareler arası `linear` olarak birebir uygula.**_

Birimler: **yükseklik = şeridin/kapsülün tepesinin ekranın altından uzaklığı, ekran yüksekliğinin %'si** · **genişlik = ekran genişliğinin %'si** · zaman = ms.

## 0. Logo bekleme (değişmez)
0–800 ms: koyu zemin #10180D, ortada logo (#9FE870), kıpırtısız. (Şerit logonun ÖNÜNDEN geçer.)

## 1. Baş gösterme — 300 ms (t = 0 → 300)
İki parça, ikisi de ekranın yatay ortasında:
- **Limon kapsül** (düz #9FE870, tam yuvarlak uçlu, genişlik **%29**): tepe yüksekliği
  | t | 0 | 50 | 100 | 150 | 200 | 250 | 300 |
  |---|---|---|---|---|---|---|---|
  | % | 0 | 4.0 | 6.8 | 8.9 | 10.5 | 11.6 | 12.4 |
- **Koyu daire** (#163300, çap = genişliğin %92'si, yani kapsülden ~%4 dar; içinde #9FE870 yukarı ok ya da ev ikonu, çapın %42'si, çizgi kalın): kapsülün İÇİNDE, aşağıdan gelir. Dairenin tepesi:
  | t | 0 | 60 | 100 | 150 | 200 | 250 | 300 |
  |---|---|---|---|---|---|---|---|
  | % | -14 | -14 | -6 | 1.5 | 6.5 | 10.0 | 12.0 |
  (300 ms'de daire kapsülün tepesine oturur, etrafında ~3 pt limon halka kalır.)
- Dairenin **altında** kalan kapsül gövdesi desen (`acilis-doku.webp`) gösterir; dairenin **üstünde** kalan kısım düz limon. Yani desen dairenin arkasından açığa çıkar.

## 2. Yükseliş — 516 ms (t = 300 → 816)
Daire+halka birlikte (tek "baş") yükselir, arkasında desenli gövde. Baş tepesi yüksekliği ve gövde genişliği:
| t (ms) | 300 | 350 | 400 | 450 | 500 | 516 | 550 | 600 | 650 | 700 | 750 | 783 | 800 | 816 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| tepe % | 12.4 | 17.4 | 24.5 | 32.1 | 40.3 | 43.0 | 48.6 | 56.8 | 65.6 | 74.8 | 84.7 | 91.6 | 95.5 | 100 |
| genişlik % | 29 | 29 | 29 | 29 | 29 | 29.2 | 30.5 | 33.8 | 38.5 | 43.1 | 47.2 | 48.7 | 49.2 | 49.7 |
- Daire çapı SABİT kalır (gövde genişlese de), gövde yanlarda daireden taşar.
- 816 ms'de daire ekranın üstünden çıkıp kaybolur.

## 3. Tam açılma — 167 ms (t = 816 → 983)
Desenli gövde genişler, tüm ekranı kaplar:
| t | 816 | 833 | 850 | 867 | 883 | 900 | 917 | 933 | 950 | 967 | 983 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| genişlik % | 49.7 | 51 | 53.3 | 56.4 | 60 | 64.9 | 70.5 | 77.2 | 84.6 | 92.8 | 100 |

## 4. Bekleme + geçiş — 250 ms (t = 983 → 1233)
- 983–1000: tam ekran desen, sabit.
- 1000–1233 (233 ms): desen opaklığı 1 → 0, `cubic-bezier(0.4, 0, 0.2, 1)`; aynı anda ana ekran opaklık 0 → 1 ve 12 pt aşağıdan yerine.

**Toplam: 800 ms logo + 1233 ms animasyon ≈ 2,03 sn.**

## Akıcılık ve doğrulama
- Sadece `transform` ve `opacity` ile: gövde = tam ekran desen katmanı, görünen kısmı bir kap ile kırpılır; kabı translateY ile yükselt, içteki deseni ters translateY ile sabit tut. Genişleme için kabın genişliğini `transform: scaleX` ile değil (desen ve yuvarlak uç bozulur) — ya iki yarım kabı (sol/sağ) translateX ile dışa aç, ya da clip-path inset ile; iPhone Safari'de 60 fps hangisinde tutuyorsa onu seç.
- Başlamadan önce `img.decode()` + iki `requestAnimationFrame`.
- **Doğrulama zorunlu:** Playwright ile 390×844'te 60 fps video kaydı al, her karede kapsül/baş tepesini ve gövde genişliğini ölç; yukarıdaki tablolarla karşılaştır. Her satırda sapma ±1,5 puan / ±17 ms'den büyük olmasın. Ölçüm tablosunu `docs/ACILIS_DOGRULAMA.md`'ye yaz. Chrome DevTools'ta 4× CPU yavaşlatmada kare düşmesi olmasın.
- "Hareketi azalt": logo 400 ms → 200 ms solma → ana ekran (değişmez).

## Villa Takvimim sürümü (Zeyd, 15 Kasım): ortada nefes anı

_Yukarıdaki Wise tablolarının yerine bu ritim uygulanır (`www/acilis.js`). Önceki "ACILIS_YAVAS = 1.35" talimatının yerine geçer._

**ACILIS_YAVAS = 1.15:** aşağıdaki bütün süreler Wise hızında yazılı; ekranda hepsi 1,15 ile çarpılır. Logo beklemesi bunun dışında: **1000 ms, sabit**.

| Aşama | Wise hızında | Ekranda (× 1,15) | Ne olur |
|---|---|---|---|
| 0. Logo | – | 0–1000 ms | Koyu zemin, ortada logo, kıpırtısız |
| 1. Baş gösterme | 0–300 | 0–345 | Aynen yukarıdaki 1. aşama tabloları (kapsül + aşağıdan yetişen daire) |
| 2a. Yavaşlayarak ortaya | 300–600 | 345–690 | Baş %12,4'ten, dairenin MERKEZİ logonun merkezinin 30 pt altına gelene kadar yükselir. `cubic-bezier(0.2, 0.7, 0.3, 1)`. Gövde genişliği %29 sabit |
| 2b. Ortada nefes | 600–860 | 690–989 | Baş son 30 pt'yi çok yavaş alır, daire merkezi logonun merkezine tam oturur (`ease-out`) |
| 2c. Hızlanarak tepeye | 860–1280 | 989–1472 | Baş ortadan %100'e çıkar, `cubic-bezier(0.6, 0, 0.9, 0.45)`. Gövde %29 → %49,7 |
| 3. Tam açılma | 1280–1447 | 1472–1664 | Aynen yukarıdaki 3. aşama tablosu, süre × 1,15 |
| 4. Bekleme + geçiş | 1447–1697 | 1664–1952 | 17 ms tam desen; sonra 233 ms solma (`cubic-bezier(0.4, 0, 0.2, 1)`) + ana ekran 12 pt aşağıdan yerine |

**Toplam: 1000 ms logo + ~1952 ms animasyon ≈ 2,95 sn.**

**2b sırasında:**
- Logo opaklığı 1 → 0 ve boyu %100 → %85, 180 ms (ekranda 207 ms), `ease-out`. Logo dairenin içine "girer".
- Dairenin içindeki ev ikonu tek atış yapar: ölçek 1 → 1,12 → 1, 260 ms (ekranda 299 ms). İki yarının her biri `cubic-bezier(0.3, 0, 0.3, 1)`. Yalnızca ikon atar, daire atmaz.

**2c'deki gövde genişliği:** Wise tablosundaki artış kısmı (500–816 ms: 29 → 29,2 → 30,5 → 33,8 → 38,5 → 43,1 → 47,2 → 48,7 → 49,2 → 49,7) 2c'nin 420 ms'sine oranla yayılır. Wise'ta 500 ms 2c'nin başına (860), 816 ms sonuna (1280) denk gelir; aralar doğrusal.

**Logo ve ikon:**
- Logo başın önünde durur. Arkasında zemin renginde dolu bir siluet var; böylece baş altına girerken pencerelerinden daire görünmez, logo solunca daire ortaya çıkar.
- Logo ile ev ikonu aynı merkezde.
- Boyda ödünleşim: logo daireden büyük (iPhone 390×844'te logo 118 px, daire 104 px). Bu yüzden ikon logoyla aynı boyda olamıyor. Ev, atışın tepesinde (× 1,12) bile dairenin kenarına 4 px kalacak en büyük boyda (390 px genişlikte kutu 78 px, görünen ev ~66 px). Çizgi kalınlığı logonun çatı çizgisiyle aynı oranda.
- 2c'den sonra baş, 2c'nin bitiş hızıyla ekranın üstünden çıkar.
