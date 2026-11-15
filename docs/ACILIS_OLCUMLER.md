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
