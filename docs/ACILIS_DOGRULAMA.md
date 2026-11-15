# Açılış animasyonu — doğrulama (logo daireye girer)

_Claude Code, 16 Kasım 2026. Uygulama: `www/acilis.js`. Şartname: `docs/ACILIS_OLCUMLER.md` → "Villa Takvimim sürümü … logo daireye girer"._

_Ortam: Windows 11 ve Chrome. Chrome'u Playwright (`playwright-core` 1.49.1) ve Puppeteer sürdü; başsız mod, ekran kartı açık. 390×844 görünüm, iPhone kullanıcı aracısı, sahte sunucu. iPhone Safari'de ve gerçek cihazda ölçülmedi. Önceki turların ölçümleri (logo yeri %49,5, ilk kareler, giriş/kayıt ekranı) git geçmişinde; bu turda o kısımlar değişmedi._

## Bu turda yapılanlar (Zeyd: "daire çok büyük oldu")
1. **Daire boyu eski hâline döndü:** çap = şerit × 0,92 = 104,05 px (ekran genişliğinin %26,7'si). 2a'da büyümüyor; D = logo × 1,42 kuralı kaldırıldı.
2. **Logo daireye giriyor:**
   - Logo yerinde (ortası %49,5); daire alttan gelip merkezine oturuyor (2a eğrisi aynı).
   - Dairenin üst kenarı logonun alt kenarına değdiği anda logo küçülmeye başlıyor. 390×844'te bu an Wise 381,5 ms, ekranda 438,8 ms.
   - Logonun ölçeği dairenin konumuna bağlı: küçülme oranı = dairenin değmeden oturmaya aldığı yolun oranı. Bu yüzden eğri ve bitiş anı dairenin hareketiyle aynı.
   - Daire oturduğunda (690 ms) logo genişliği çapın %56'sı (58,27 px, ölçek 0,4938).
   - Logo `z-index` ile her an dairenin önünde, opaklığı 1.
3. **2b:** 200 ms (ekranda 230 ms). Daire, halka ve logo birlikte 1 → 1,04 → 1 (sinüs², tepe %35'te).
4. **2c:** 800–1220 (ekranda 920–1403). Logo ve daire tek parça yükseliyor, birlikte 1 → 0,85 küçülüyor.
5. **Sonraki aşamalar** 60 ms (Wise) öne kaydı. Tam açılma 1595 ms'de, solma 1614,6 ms'de başlıyor; toplam ~2,88 sn.
6. Yalnızca `transform` ve `opacity`; tek zaman çizelgesi (önceki turlarla aynı yapı).

## 1. Kare kare ölçüm (Playwright; animasyon durdurulup her ana gidildi)
**Anlar:**
- 2a'da her 2 ms; değme ve oturma çevresinde her 1 ms (430–450, 680–700).
- 2b'de her 10 ms, 2c ve sonrasında her 20 ms.
- Toplam 255 an.

**İki çekim:**
- Geometri, logo gizli. Daireye, üst yarısının kenarından alt piksel duyarlılıkla çember uyduruldu.
- Yalnızca logo. Ölçek, logonun toplam parlaklığından √(kütle / ilk kütle) ile alt piksel duyarlılıkla bulundu. Kutu ortası da ölçüldü.

**Beklenen değerler:** Şartnameden ayrı yazılmış bir Python modeliyle hesaplandı.

**Modelden en büyük sapmalar:**
- Baş tepesi 0,11 puan, daire tepesi 0,12 puan, gövde 0,46 puan (390 px'te 1 piksel 0,26 puan).
- Daire merkezi 0,53 px, daire çapı 0,80 px.
- Logo ölçeği 0,003; logo opaklığı 0 (hep 1).
- Logo ortası 0,68 px (kutu tam piksele yuvarlanıyor).

| Ölçüt | Sınır | Ölçülen |
|---|---|---|
| Küçülme başlangıcı − dairenin logoya değme anı | ± 1 kare (16,7 ms) | **aynı kare**. 439 ms'de daire üst kenarı 475,50 px, logo alt kenarı 475,42 px (değmemiş), ölçek 0,9983 (≈1, örnekleme kenarı). 440 ms'de değmiş, ölçek 0,9911. Model: 438,8 ms |
| Küçülme bitişi − dairenin oturma anı | ± 1 kare | **aynı an (690 ms)**, iki ölçüye göre. (a) "Son değerine 0,5 px'ten yakın" ölçütüyle logo genişliği 657 ms'de, daire merkezi 669 ms'de (fark 12 ms < 1 kare). Fark, iki eşiğin farklı yol uzunluklarına denk gelmesinden. (b) İlerleme oranıyla (değmeden oturmaya, 0 → 1) logo ve daire her karede aynı: en büyük fark 0,009 (gerçek zamanlı kayıt, aşağıda) |
| Oturduğunda (690 ms) logo merkezi − daire merkezi | ± 1 pt | x 0,00 px, y +0,18 px |
| Oturduğunda logo genişliği / daire çapı | %56 ± 2 | %56,1 (58,28 / 103,84 px) |
| 2b–2c boyunca (590–1220 Wise, 68 an) logo merkezi − daire merkezi | ± 1 pt | en çok x 0,02 px, y 0,73 px |
| 2b–2c boyunca logo / çap | %56 ± 2 | %56,0–56,6 |

**2a'da küçülme (kare kare; ölçülen / model):**

| t (ms) | daire merkezi y (px) | logo ölçeği |
|---|---|---|
| 440 | 525,94 / 525,47 | 0,9911 / 0,9910 |
| 461 | 497,75 / 497,36 | 0,8614 / 0,8611 |
| 481 | 477,50 / 477,19 | 0,7672 / 0,7680 |
| 501 | 462,13 / 461,77 | 0,6977 / 0,6967 |
| 521 | 450,23 / 449,90 | 0,6408 / 0,6419 |
| 541 | 441,13 / 440,76 | 0,5995 / 0,5997 |
| 561 | 434,12 / 433,74 | 0,5683 / 0,5673 |
| 581 | 428,90 / 428,41 | 0,5437 / 0,5426 |
| 601 | 424,91 / 424,42 | 0,5250 / 0,5242 |
| 621 | 422,00 / 421,55 | 0,5106 / 0,5110 |
| 641 | 420,04 / 419,60 | 0,5038 / 0,5019 |
| 661 | 418,91 / 418,42 | 0,4970 / 0,4965 |
| 681 | 418,22 / 417,88 | 0,4941 / 0,4940 |

Daire merkezindeki sabit +0,35–0,5 px, çember uydurmanın kenar örtme payı (her anda aynı yönde).

**Oturma, 2b ve 2c (kare kare):**

| t (ms) | Wise | fark x, y (px) | daire çapı ölçülen / model (px) | logo genişliği (px) | logo / çap |
|---|---|---|---|---|---|
| 690 | 600 | +0,00, +0,18 | 103,84 / 104,05 | 58,28 | 0,561 |
| 750 | 652 | +0,00, −0,18 | 106,78 / 107,58 | 60,22 | 0,564 |
| 800 | 696 | −0,00, −0,22 | 107,07 / 107,83 | 60,30 | 0,563 |
| 860 | 748 | +0,01, −0,33 | 104,70 / 105,50 | 59,28 | 0,566 |
| 920 | 800 | +0,00, +0,18 | 103,84 / 104,05 | 58,27 | 0,561 |
| 1010 | 878 | +0,01, +0,17 | 103,35 / 103,81 | 58,20 | 0,563 |
| 1090 | 948 | +0,00, +0,24 | 102,42 / 103,10 | 57,91 | 0,565 |
| 1170 | 1017 | +0,02, −0,06 | 101,38 / 101,77 | 57,29 | 0,565 |
| 1250 | 1087 | +0,01, −0,20 | 99,04 / 99,54 | 55,65 | 0,562 |
| 1330 | 1157 | +0,02, −0,49 | 95,36 / 95,74 | 53,56 | 0,562 |
| 1390 | 1209 | +0,01, +0,29 | 89,96 / 90,41 | 50,57 | 0,562 |

**2b yayı:**
- En büyük daire çapı 108,03 px (770 ms; model 108,21). En büyük logo ölçeği 0,5124 (770 ms; model 0,5135).
- İkisi aynı anda tepeye çıkıyor ve aynı oranda büyüyor: daire × 1,038, logo × 1,038.

**Android görünümü (logo 120 px):** oturduğunda logo / çap %55,9 (58 / 103,82 px, kutu tam piksel), merkez farkı y 0,35 px.

**Gerçek renklerle bakıldı (12 an):**
- Logo değene kadar yerinde, sonra dairenin önünde küçülerek içine giriyor.
- 2b'de daireyle birlikte hafifçe yaylanıyor, 2c'de daireyle tek parça yükseliyor.
- Değme ile oturma arasında logonun limon kenarı şeridin limon halkasının üstüne biniyor. Ayrı bir kenar görünmüyor, aynı renk.

## 2. Gerçek zamanlı 60 fps kayıt (Playwright, CDP screencast; yalnız daire ve logo görünür)
Her karede daire ve logo AYNI karede ölçüldü, bu yüzden ekran gecikmesinden etkilenmez.
- Daire: logonun kapladığı satırlar dışındaki kenarlarından çember.
- Logo: limon kutusu ve parlaklık kütlesinden ölçek.

İki kayıt alındı. Değme ve küçülme başı her iki kayıtta aynı karede:

| Kayıt | Son "değmedi" karesi | İlk "değdi" karesi |
|---|---|---|
| 1 | 466,1 ms: daire üst kenarı 485,65 px > logo alt kenarı 475,40 px, ölçek 1,0000 | 482,9 ms: üst kenar 459,73 px, ölçek 0,9288 |
| 2 | bir kare önce, aynı düzen | bir kare önce, aynı düzen |

- **Aynı eğri:** her karede dairenin yol oranı ile logonun küçülme oranı karşılaştırıldı (değmeden oturmaya 0 → 1). 2a boyunca en büyük fark 0,009 (iki kayıtta da). Bir karelik ilerleme oturmaya yakın ~0,01–0,03, başta ~0,15–0,18.
- **2b–2c hizası (43 kare):** en çok x 0,03 px, y 0,72 px. Logo / çap %55,9–56,8.
- **Kare akışı:** iki kayıtta da kesintisiz. Solma 1614,6 ms'de başlıyor, perde sonunda kalkıyor, hata yok.

## 3. Kare düşmesi (Chrome DevTools performans izi, Puppeteer, 390×844, 3x piksel yoğunluğu)
**Sayım yöntemi (önceki doğrulamalarla aynı):**
- Her ekran yenilemesinde sayfadan yeni kare çizilip çizilmediğine bakıldı.
- "Değişiklik yok" anları düşme sayılmadı; ekranın hiç çizmediği yenilemeler düşme sayıldı.

**Karşılaştırma:** Yeni sürüm ile önceki tur (d84a7ec) aynı makinede sırayla, dönüşümlü kaydedildi.

**Pencereler (sayfa zamanı, logo dahil):**
- Yeni: hareket 1000–2595, solma 2595–2911.
- Önceki: hareket 1000–2664, solma 2664–2980.

| Koşul | Sürüm | Deneme | Hareket: kare düşmesi | Solma: kare düşmesi |
|---|---|---|---|---|
| 1x | yeni | 10 | 3 (2 denemede: 1800; 1800 + 1817) | 0 |
| 1x | önceki | 10 | 1 (1 denemede: 1800) | 0 |
| 4x CPU | yeni | 4 | 0 | 0 |
| 4x CPU | önceki | 4 | 0 | 0 |

**Değerlendirme:**
- Düşmelerin hepsi sayfa zamanı ~1800 ms'de, yani iki sürümde de aynı saat anında. Bu an yeni sürümde 2b'nin ortasına, önceki sürümde 2a sonuna denk geliyor; yani animasyonun belli bir aşamasına bağlı değil.
- Önceki turda benzer düşmelerin nedeni, tarayıcının ekran kartı işleminde ~1 sn aralıkla gelen 14–40 ms'lik beklemelerdi. Bu turun izlerinde nedene ayrıca bakılmadı.
- İlk 1x serisinde iki sürüm, aynı deneme çiftinde aynı ~1800 ms anında birer kare düşürdü.
- "Hiç kare düşmesi yok" bu ortamda iki sürümde de tam sağlanmıyor. Yeni sürüm 10 denemenin 8'inde temiz.

## 4. Diğer kontroller
- **Dokununca:** perde anında kalkıyor; ana ekran görünür, animasyon kalmıyor.
- **Hareketi azalt:** logo ~400 ms, sonra 200 ms solma.
- **Giriş durumları:**
  - Hiç giriş yapılmamış: perde oynuyor, sonra "Kayıt ol" görünümü ve "Zaten hesabın var mı? Giriş yap" bağlantısı.
  - Daha önce giriş yapılmış: "Giriş yap".
  - Oturum var: ana ekran.
  - Üçünde de açılış sonunda `theme-color` #0B5B57, zemin beyaz, hata yok.

## Bilinen sınırlar
- iPhone Safari'de ve gerçek cihazda ölçülmedi.
- Değme anı ekran oranına bağlı: daire alttan geldiği için değme, uzun ekranlarda biraz daha geç, kısa ekranlarda biraz daha erken. Küçülme her ekranda değme anında başlar, 690 ms'de biter.
- "2b ~200 ms", önceki turlardaki gibi Wise hızında 200 ms alındı (ekranda 230 ms).
