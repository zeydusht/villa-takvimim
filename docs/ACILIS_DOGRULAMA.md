# Açılış animasyonu — doğrulama (docs/ACILIS_OLCUMLER.md'ye göre)

_Claude Code, 15 Kasım 2026. Uygulama: `www/acilis.js`. Ortam: Windows 11, Chrome (Playwright `playwright-core` 1.49.1 ve Puppeteer ile sürülen, ekran kartı açık başsız Chrome), 390×844 görünüm, iPhone kullanıcı aracısı, sahte sunucu. iPhone Safari'de ölçülmedi._

## Uygulama özeti
- Tablolardaki anahtar kareler WAAPI `offset` ile birebir girildi, kareler arası `linear`. Tek zaman çizelgesi; bütün animasyonlar aynı `startTime` ile başlıyor. Animasyonlar, native açılış ekranı gizlenip desen görseli çözüldükten sonra (`img.decode()` + iki `requestAnimationFrame`) başlıyor.
  - 0–800: logo bekleme.
  - 800 + (0–983): kapsül, daire ve gövde hareketi.
  - 800 + (983–1000): tam desen, sabit.
  - 800 + (1000–1233): desen 1→0, `cubic-bezier(0.4, 0, 0.2, 1)`; ana ekran 0→1 ve 12 px aşağıdan yerine.
- Limon kapsül: genişlik %29, düz #9FE870, üstü yuvarlak. 300 ms'den sonra başın çevresindeki halka olur; tepesi "baş tepesi" tablosunu izler.
- Koyu daire: #163300, çap kapsül genişliğinin %92'si, içinde #9FE870 ev ikonu (çapın %42'si, kalın çizgi).
  - 0–300: daire tablosunu izler.
  - 300'den sonra kapsül tepesinin %0,4 altında, yani 12,4 − 12,0.
  - 816'dan sonra 800–816 arasındaki hızla (2,4 px/ms) ekranın üstünden çıkar.
- Desenli gövde (`acilis-doku.webp`): tepesi dairenin ortasında, yani desen dairenin arkasından açılır. Genişliği tablodan alınır.
  - Uygulama: sol ve sağ yarıda birer kırpma kutusu; içlerinde dış üst köşesi yuvarlak (yarıçap = kapsülün yarısı) kaplar `translate` ile yükselip yana açılıyor. İçteki desen ters `translate` ile ekrana göre sabit.
  - Yalnızca `transform` ve `opacity` kullanılıyor; `scaleX`, `clip-path`, `top`/`height` animasyonu yok.
- "Hareketi azalt" açıkken: logo 400 ms → 200 ms solma → ana ekran (değişmedi).

## Geliştirme sırasında bulunan ve düzeltilen sorunlar
1. **Gövdeyi `scale` ile genişletmek takıldı.** Gerçek zamanlı kayıtta 366–716 ms arası kare gelmedi: tarayıcı, ters ölçeklenen deseni büyük ölçekte yeniden çiziyordu. Sol/sağ yarım kapları `translate` ile açma yöntemine geçildi; kayıt 60 fps oldu.
2. **Ana ekranın yerleşimi kareyi düşürüyordu.** Veri hareket sırasında gelince uzun bir yerleşim işi çalışıyor, hareketin bir karesi kaçıyordu.
   - Logo ve hareket boyunca ana ekran `content-visibility: hidden` ile çizilmiyor.
   - Veri logo beklemesinde gelirse ana ekran hemen açılıyor ve durgun ekranda yerleşiyor.
   - Veri hareket sırasında gelirse ana ekran 983'te açılıyor ve solma, ana ekran çizildikten hemen sonra başlıyor.
3. **Animasyonlar başlarken/biterken ana iş parçacığı uyanıyordu.** Bu, 4x yavaşlatmada kare düşürüyordu.
   - Gecikmeli başlangıç (`delay`) yerine bekleme karesi kullanıldı.
   - Hareket animasyonları 983'te bitmiyor; solmanın sonuna (+100 ms kuyruk) kadar son değerde duruyor.
   - 983'teki "veri hazır mı" kontrolü ekrana dokunmayan bir zamanlayıcıyla yapılıyor.
4. **Sabit bekleme kareleri ana iş parçacığını uyandırıyordu.** Solmaya kadar değeri sabit duran anahtar kareler, tarayıcının ~1500 ms'de ana iş parçacığını uyandırıp 9 animasyonlu öğenin biçimini yeniden hesaplamasına yol açıyordu. İzde betik yoktu, gerekçe "Animation"; 4x'te 10 denemenin 7'sinde 1 kare düşüyordu. Bekleme kareleri gözle görülmeyecek kadar değişken yapıldı (perdede 0,01 px kayma, ana ekranda 0,0001 opaklık).

## 1. Kare kare ölçüm (Playwright, animasyon durdurulup her tablo zamanına gidilerek)
Ekran görüntüsünde ölçüldü:
- Kapsül/baş tepesi: orta sütunda ilk ön plan pikseli.
- Daire tepesi: orta sütunda ilk #163300 pikseli.
- Gövde genişliği: alttan 3. satırdaki ön plan pikselleri.

Logo bu ölçümde maviye boyandı (kapsülle aynı renk olduğu için ayırt edilemezdi); geometri değişmez. Birim: puan (ekran yüksekliğinin/genişliğinin %'si).

| t (ms) | kapsül/baş tepesi: tablo → ölçülen (sapma) | daire tepesi | gövde genişliği |
|---|---|---|---|
| 0 | 0.0 → 0.00 (+0.00) | – | – |
| 50 | 4.0 → 4.03 (+0.03) | – | – |
| 100 | 6.8 → 6.87 (+0.07) | – | – |
| 150 | 8.9 → 9.00 (+0.10) | 1.5 → 1.42 (-0.08) | – |
| 200 | 10.5 → 10.55 (+0.05) | 6.5 → 6.40 (-0.10) | – |
| 250 | 11.6 → 11.61 (+0.01) | 10.0 → 9.95 (-0.05) | – |
| 300 | 12.4 → 12.44 (+0.04) | 12.0 → 11.97 (-0.03) | 29.0 → 28.97 (-0.03) |
| 350 | 17.4 → 17.42 (+0.02) | – | 29.0 → 29.23 (+0.23) |
| 400 | 24.5 → 24.53 (+0.03) | – | 29.0 → 29.23 (+0.23) |
| 450 | 32.1 → 32.11 (+0.01) | – | 29.0 → 29.23 (+0.23) |
| 500 | 40.3 → 40.40 (+0.10) | – | 29.0 → 29.23 (+0.23) |
| 516 | 43.0 → 43.01 (+0.01) | – | 29.2 → 29.23 (+0.03) |
| 550 | 48.6 → 48.70 (+0.10) | – | 30.5 → 30.77 (+0.27) |
| 600 | 56.8 → 56.87 (+0.07) | – | 33.8 → 33.85 (+0.05) |
| 650 | 65.6 → 65.64 (+0.04) | – | 38.5 → 38.97 (+0.47) |
| 700 | 74.8 → 74.88 (+0.08) | – | 43.1 → 43.59 (+0.49) |
| 750 | 84.7 → 84.72 (+0.02) | – | 47.2 → 47.69 (+0.49) |
| 783 | 91.6 → 91.71 (+0.11) | – | 48.7 → 48.72 (+0.02) |
| 800 | 95.5 → 95.50 (-0.00) | – | 49.2 → 49.23 (+0.03) |
| 816 | 100.0 → 100.00 (+0.00) | – | 49.7 → 49.74 (+0.04) |
| 833 | – | – | 51.0 → 51.28 (+0.28) |
| 850 | – | – | 53.3 → 53.33 (+0.03) |
| 867 | – | – | 56.4 → 56.41 (+0.01) |
| 883 | – | – | 60.0 → 60.00 (+0.00) |
| 900 | – | – | 64.9 → 65.13 (+0.23) |
| 917 | – | – | 70.5 → 70.77 (+0.27) |
| 933 | – | – | 77.2 → 77.44 (+0.24) |
| 950 | – | – | 84.6 → 84.62 (+0.02) |
| 967 | – | – | 92.8 → 92.82 (+0.02) |
| 983 | – | – | 100.0 → 100.00 (+0.00) |

**En büyük sapma:** kapsül/baş 0,11 · daire 0,10 · gövde 0,49 puan. Gövdedeki 0,2–0,5 sapma, 390 px'te 1 pikselin 0,26 puana denk gelmesinden kaynaklanan yuvarlama.

## 2. Gerçek zamanlı 60 fps ekran kaydı (Playwright)
Kayıt Playwright içinden CDP screencast ile alındı: her kare zaman damgalı PNG. Playwright'ın kendi `recordVideo` özelliği sabit 25 fps olduğu için kullanılmadı. Logo yine maviye boyandı. Zaman, animasyonun t = 0 anına (logo beklemesinin sonu) göre.

**Kare akışı (5 kayıt, 1x CPU):** 0–1000 ms arasında 60–61 kare; ortalama aralık 16,66 ms; en uzun aralık 16,9–17,7 ms. Boşluk yok.

**Ekran gecikmesi:** Kayıttaki zaman damgası, karenin ekrana çıktığı an. Animasyon ise karenin başladığı anda örnekleniyor. Bu fark bağımsız olarak DevTools performans izinden ölçüldü: hareket sırasında BeginFrame → ekran ortanca **33,3 ms** (1x ve 4x'te aynı, en çok 33,5–50 ms). Bu, tarayıcının iki karelik çizim hattı; ham ölçümler tablonun her yerinde bu kadar geride. Aşağıdaki "düzeltilmiş" sütun ham zamandan sabit 33,3 ms çıkarıyor (eğriye uydurma değil, izden ölçülen değer).

- **Ham:** 12 kaydın 11'inde zaman sapması tutarlı biçimde +25…+33 ms (değer sapması en çok 15,4 puan). Bu kayıtlarda ham zaman damgasıyla ±17 ms ölçütü KARŞILANMIYOR (48 satırın 31–32'si dışarıda); sapmanın tamamı yukarıdaki çizim hattı gecikmesi. 1 kayıtta tarayıcı tek karelik hatta çalıştı (~16 ms); o kayıtta ham ölçümle de 48/48 satır geçti.
- **33,3 ms düzeltmeyle:** 5 kaydın hepsinde 48 satırın tamamı ±1,5 puan içinde. En büyük sapmalar: 0,44 · 0,48 · 0,51 · 0,51 · 0,49 puan.
- **Gecikme her kayda ayrı uydurulunca** (6 kayıt): 32,0–32,5 ms; 48/48 satır geçti, en büyük sapma 0,28–0,42 puan.
- **4x CPU yavaşlatmalı 2 kayıt:** düzeltmeyle 48/48 satır ±1,5 puan veya ±17 ms içinde. En büyük değer sapması 1,23 ve 3,78 puan; bu satırlar zaman ölçütüyle geçti.

Örnek kayıt (1. kayıt), tüm satırlar:

#### Kapsül / baş tepesi (% yükseklik)
| t (ms) | tablo | ölçülen (ham) | sapma | zaman sapması (ms) | ölçülen (−33,3 ms) | sapma |
|---|---|---|---|---|---|---|
| 0 | 0.0 | 0.00 | +0.00 | +0.0 | 0.03 | +0.03 |
| 50 | 4.0 | 1.35 | -2.65 | +30.6 | 4.06 | +0.06 |
| 100 | 6.8 | 4.95 | -1.85 | +29.2 | 6.88 | +0.08 |
| 150 | 8.9 | 7.60 | -1.30 | +29.0 | 8.90 | +0.00 |
| 200 | 10.5 | 9.49 | -1.01 | +27.4 | 10.56 | +0.06 |
| 250 | 11.6 | 10.91 | -0.69 | +25.3 | 11.62 | +0.02 |
| 300 | 12.4 | 11.98 | -0.42 | +19.4 | 12.49 | +0.09 |
| 350 | 17.4 | 14.13 | -3.27 | +31.3 | 17.47 | +0.07 |
| 400 | 24.5 | 19.87 | -4.63 | +31.5 | 24.62 | +0.12 |
| 450 | 32.1 | 27.10 | -5.00 | +31.6 | 32.22 | +0.12 |
| 500 | 40.3 | 34.92 | -5.38 | +32.1 | 40.35 | +0.05 |
| 516 | 43.0 | 37.54 | -5.46 | +31.8 | 43.11 | +0.11 |
| 550 | 48.6 | 43.22 | -5.38 | +32.1 | 48.66 | +0.06 |
| 600 | 56.8 | 51.39 | -5.41 | +32.2 | 56.84 | +0.04 |
| 650 | 65.6 | 59.80 | -5.80 | +32.5 | 65.60 | -0.00 |
| 700 | 74.8 | 68.71 | -6.09 | +32.3 | 74.84 | +0.04 |
| 750 | 84.7 | 78.18 | -6.52 | +32.1 | 84.80 | +0.10 |
| 783 | 91.6 | 84.74 | -6.86 | +32.4 | 91.66 | +0.06 |
| 800 | 95.5 | 88.30 | -7.20 | +32.4 | 95.60 | +0.10 |
| 816 | 100.0 | 91.59 | -8.41 | +32.8 | 100.00 | +0.00 |

#### Koyu daire tepesi (% yükseklik)
| t (ms) | tablo | ölçülen (ham) | sapma | zaman sapması (ms) | ölçülen (−33,3 ms) | sapma |
|---|---|---|---|---|---|---|
| 150 | 1.5 | 1.42 | -0.08 | +0.0 | 1.47 | -0.03 |
| 200 | 6.5 | 3.13 | -3.37 | +32.4 | 6.43 | -0.07 |
| 250 | 10.0 | 7.60 | -2.40 | +31.4 | 9.97 | -0.03 |
| 300 | 12.0 | 10.57 | -1.43 | +30.1 | 12.01 | +0.01 |

(0, 60, 100 ms satırlarında daire ekranın altında, görünmüyor: tabloda −14 / −14 / −6.)

#### Gövde genişliği (% genişlik)
| t (ms) | tablo | ölçülen (ham) | sapma | zaman sapması (ms) | ölçülen (−33,3 ms) | sapma |
|---|---|---|---|---|---|---|
| 300 | 29.0 | 28.97 | -0.03 | +0.0 | 28.98 | -0.02 |
| 350 | 29.0 | 29.23 | +0.23 | – | 29.23 | +0.23 |
| 400 | 29.0 | 29.23 | +0.23 | – | 29.23 | +0.23 |
| 450 | 29.0 | 29.23 | +0.23 | – | 29.23 | +0.23 |
| 500 | 29.0 | 29.23 | +0.23 | – | 29.23 | +0.23 |
| 516 | 29.2 | 29.23 | +0.03 | +0.0 | 29.23 | +0.03 |
| 550 | 30.5 | 29.25 | -1.25 | +26.1 | 30.80 | +0.30 |
| 600 | 33.8 | 31.83 | -1.97 | +29.6 | 33.89 | +0.09 |
| 650 | 38.5 | 35.43 | -3.07 | +31.7 | 38.50 | -0.00 |
| 700 | 43.1 | 40.05 | -3.05 | +31.6 | 43.11 | +0.01 |
| 750 | 47.2 | 44.66 | -2.54 | +30.8 | 47.20 | +0.00 |
| 783 | 48.7 | 47.19 | -1.51 | +27.6 | 48.73 | +0.03 |
| 800 | 49.2 | 48.23 | -0.97 | +26.7 | 49.26 | +0.06 |
| 816 | 49.7 | 48.72 | -0.98 | +27.0 | 49.74 | +0.04 |
| 833 | 51.0 | 49.25 | -1.75 | +28.4 | 51.31 | +0.31 |
| 850 | 53.3 | 49.81 | -3.49 | +31.3 | 53.44 | +0.14 |
| 867 | 56.4 | 51.39 | -5.01 | +31.5 | 56.63 | +0.23 |
| 883 | 60.0 | 53.39 | -6.61 | +32.4 | 60.09 | +0.09 |
| 900 | 64.9 | 56.56 | -8.34 | +31.4 | 65.34 | +0.44 |
| 917 | 70.5 | 60.31 | -10.19 | +32.7 | 70.65 | +0.15 |
| 933 | 77.2 | 65.25 | -11.95 | +32.2 | 77.57 | +0.37 |
| 950 | 84.6 | 70.52 | -14.08 | +32.2 | 84.99 | +0.39 |
| 967 | 92.8 | 77.87 | -14.93 | +32.9 | 92.86 | +0.06 |
| 983 | 100.0 | 84.85 | -15.15 | +32.5 | 100.00 | +0.00 |

(29'da sabit kalan satırlarda "zaman sapması" anlamsız, "–".)

#### Solma (1000–1233), 3 kayıt
Desen opaklığı karelerden yaklaşık ölçüldü: (kare − ana ekran) / (desen − ana ekran), medyan; 33,3 ms düzeltmeli.
- Solma her kayıtta tam **1000 ms'de** başlıyor.
- Beklenen `1 − cubic-bezier(0.4,0,0.2,1)` eğrisinden en büyük fark **0,002** (opaklık birimi).
- Örnek: 1049 ms'de beklenen 0,847, ölçülen 0,847; 1099 ms'de beklenen 0,338, ölçülen 0,337.

## 3. Kare düşmesi (Chrome DevTools performans izi, Puppeteer, 390×844, 3x piksel yoğunluğu)
**Sayım yöntemi:** Her ekran yenilemesinde sayfadan yeni bir kare çizilip çizilmediğine bakıldı. Tarayıcının "değişiklik yok" diye kare üretmediği anlar düşme sayılmadı. Ekranın hiç çizmediği yenilemeler (iki çizim arası > 1,5 yenileme) düşme sayıldı. Pencereler:
- hareket: 800–1783 ms
- bekleme + solma: 1783–2033 ms

Logo beklemesi ölçüme alınmadı: o sırada ekranda hiçbir şey kıpırdamıyor.

| CPU | deneme | hareket boyunca düşen kare | solma boyunca düşen kare |
|---|---|---|---|
| 1x | 10 | 0 (10/10 denemede sıfır) | 0 |
| 4x | 24 | 22 denemede sıfır; 2 denemede toplam 4 (902/919/942 ms ve 1002 ms) | 23 denemede sıfır; 1 denemede 1 (1833 ms) |

4x'teki bu 2 denemenin nedeni yakalanamadı; sonraki 8 denemede tekrarlanmadı. Bu sürümden önce 4x'te hemen her denemede 1–2 kare düşüyordu (yukarıdaki 3. ve 4. maddeler). Ölçütün ("4× CPU yavaşlatmada kare düşmesi olmasın") bu ortamda karşılandığı tam olarak söylenemez: 24 denemenin 22'sinde karşılandı.

## 4. Diğer kontroller
- **Dokununca:** perde anında kalkıyor, ana ekran görünür, animasyon kalmıyor.
- **Hareketi azalt:** logo ~400 ms, sonra 200 ms solma, ana ekran.
- **Yavaş veri:**
  - Veri 1 sn'de gelince solma 1000'de, perde ~2,2 sn'de kalkıyor.
  - 2,5 sn'de gelince desende bekleyip veri gelince soluyor.
  - 6 sn'de gelince desende en fazla 1,5 sn bekliyor, sonra iskelet ekran.
- **Android görünümü:** logo 120 px ve tam ortada.
- **Eski testler geçti:** kilit/Face ID, giriş, hap, yenileme, detay, ipucu.

## Bilinen sınırlar
- iPhone Safari'de ölçülmedi. Yarım kapların `translate` ile açılması seçildi; `clip-path` sürümü denenmedi.
- Bütün ölçümler masaüstü Chrome'un başsız modunda alındı. Gerçek cihazda çizim hattı gecikmesi farklı olabilir; bu gecikme hareketin biçimini değil yalnızca ekrana çıkış anını kaydırır.
