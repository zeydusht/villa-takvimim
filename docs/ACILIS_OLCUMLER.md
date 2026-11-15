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

## Villa Takvimim sürümü (Zeyd, 15 Kasım): ortada nefes anı + daire–logo buluşması

_Yukarıdaki Wise tablolarının yerine bu ritim uygulanır (`www/acilis.js`). Önceki "ACILIS_YAVAS = 1.35" talimatının yerine geçer._

**ACILIS_YAVAS = 1.15:** aşağıdaki bütün süreler Wise hızında yazılı; ekranda hepsi 1,15 ile çarpılır. Logo beklemesi bunun dışında: **1000 ms, sabit**.

| Aşama | Wise hızında | Ekranda (× 1,15) | Ne olur |
|---|---|---|---|
| 0. Logo | – | 0–1000 ms | Koyu zemin, logo kıpırtısız. Logo ortası ekran yüksekliğinin %49,5'inde (tam ekran üzerinden; native açılış ekranı da aynı yerde) |
| 1. Baş gösterme | 0–300 | 0–345 | Aynen yukarıdaki 1. aşama tabloları (kapsül + aşağıdan yetişen daire) |
| 2a. Yavaşlayarak ortaya | 300–600 | 345–690 | Daire yükselirken çapı şerit içindeki boyundan D = logo genişliği × 1,42'ye büyür. Konum ve çap AYNI eğriyle ilerler (`cubic-bezier(0.2, 0.7, 0.3, 1)`): ortaya vardığı anda tam D, merkezi logonun merkezinde |
| 2b. Oturma | 600–860 | 690–989 | Daire yerinde, çap yumuşak bir yayla D → D × 1,04 → D. Logo hiç değişmez |
| 2c. Hızlanarak tepeye | 860–1280 | 989–1472 | Logo ve daire tek parça gibi birlikte yükselir, `cubic-bezier(0.6, 0, 0.9, 0.45)`. İkisi aynı oranda 1 → 0,7 küçülür; 2c sonunda baş tepesi ekranın tepesinde |
| 3. Tam açılma | 1280–1447 | 1472–1664 | Aynen yukarıdaki 3. aşama tablosu, süre × 1,15 |
| 4. Bekleme + geçiş | 1447–1697 | 1664–1952 | 17 ms tam desen; sonra 233 ms solma (`cubic-bezier(0.4, 0, 0.2, 1)`) + ana ekran 12 pt aşağıdan yerine |

**Toplam: 1000 ms logo + ~1952 ms animasyon ≈ 2,95 sn.**

**Daire–logo buluşması (Zeyd, 15 Kasım; önceki "logo daireye girer / dairede sembol" düzenini kaldırır):**
- D = logonun genişliği × 1,42: logoyu iç boşluklu rahat alan daire çapı (iPhone 390×844'te logo 118 px, D 167,6 px).
- Daire logonun ARKASINDA, logoyu asla örtmez. Dairenin içinde ayrıca ikon yok: logo, dairenin içindeki ikonun kendisi olur. Logonun pencereleri saydam; daire arkasına gelince pencerelerde daire görünür.
- **1. aşama:** daire çapı şeridin %92'si (Wise tablosu).
- **2a:** çap büyürken limon kapsül (halka) da aynı oranda büyür. Şerit/gövde genişliği her an kapsül genişliğinden (çap / 0,92) dar değildir, dolayısıyla daire çapından da dar değildir.
- **2b, yumuşak yay:** çap 260 ms'de (ekranda 299 ms) D → D × 1,04 → D. Yükseliş ilk %35'te, oturma kalan %65'te; iki parça da sinüs² (başı ve sonu hızsız). `cubic-bezier(0.34, 1.56, 0.64, 1)` benzeri yumuşak yay, sert sekme yok. Daire yerinden kıpırdamaz.
- **Logo 0–2b:** boyunu, yerini ve opaklığını HİÇ değiştirmez. Atış, küçülme, solma yok.
- **2c:** logo ve daire aynı translateY ile birlikte yükselir ve aynı oranda küçülür (1 → 0,7, yükselişle aynı eğri). Logo dairenin tam ortasında kalır. 2c'den sonra ikisi birlikte, 2c'nin bitiş hızıyla ekranın üstünden çıkar.
- **Gövde genişliği:** aşağıdaki tablo gibi artar, ama hiçbir an kapsülün o ana kadarki en geniş hâlinden (2b tepesinde D × 1,04 / 0,92 ≈ %48,5) dar olmaz. Böylece gövde hep en az daire çapı kadardır ve hiç daralmaz.

**2c'deki gövde genişliği:** Wise tablosundaki artış kısmı (500–816 ms: 29 → 29,2 → 30,5 → 33,8 → 38,5 → 43,1 → 47,2 → 48,7 → 49,2 → 49,7) 2c'nin 420 ms'sine oranla yayılır. Wise'ta 500 ms 2c'nin başına (860), 816 ms sonuna (1280) denk gelir; aralar doğrusal.

**İlk kare ve bekleme (15 Kasım düzeltmesi):**
- İlk karede logo dışında hiçbir açılış parçası görünmez. Kapsül, gövde, daire ve sembol CSS'te gizli başlar; animasyon başlarken boyut ve yerleri verilip görünür yapılır.
- `index.html` `<head>` başında koyu zemin (#10180D) ve `theme-color` #10180D. Koyu zemin, perde ekrana çizilince kalkar; `theme-color` açılış bitince normal temaya (#0B5B57) döner.
- Native uygulamada açılış ekranı boyunca durum çubuğu yazısı beyaz. Ana ekrana eklenen web sürümünde `apple-mobile-web-app-status-bar-style` "black".
- Veri, sayfa açılır açılmaz yüklenmeye başlar: oturum yenilemesi beklenmez, profil ve villalar aynı anda istenir.
- Desen tam ekranken veri için en fazla 300 ms beklenir. Veri hazır değilse yine geçilir ve ana ekranda iskelet satırlar görünür; veri gelince yerini alır.
- Animasyon herkes için oynar (girişsiz kullanıcıda da; web'de oturum başına bir kez, uygulamada her soğuk açılışta).
- Perde açılınca: oturum varsa ana ekran; bu cihazda daha önce giriş yapılmış ama oturum düşmüşse "Giriş yap" ekranı; hiç giriş yapılmamışsa "Kayıt ol" ekranı, altında "Zaten hesabın var mı? Giriş yap" bağlantısı.
