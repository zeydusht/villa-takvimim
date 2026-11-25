# Görev 43 — Ödeme renkleri tek kural, kaydırarak geri, yeni geri düğmesi

## 43.1 Ödeme durumu: tek kural, her yerde aynı renk

| Durum | Renk | İkon | Yazı |
|---|---|---|---|
| Tam alındı | yeşil | ✓ | "Ödemenin tamamı alındı" |
| Eksik alındı | amber | ! | "5.000 ₺ eksik · 8.000 ₺ alındı" |
| Hiç alınmadı | amber | ! | "Henüz ödeme alınmadı · 13.000 ₺" |
| Fazla alındı | kırmızı | ⚠ | "15.000 ₺ fazla alındı" |
| Tutar yok | nötr | – | – |

- **Kod:** karar `odemeDurumu(v,r)` (bakıcıda `kalanSunucu`), görünüm `odGor(od)`, yazı `odYazi(od)`.
- **Amber tokenleri:**
  - `--od-amber-yazi` #7A5200: açık amber zeminde 6,3:1, beyazda 6,9:1;
  - `--od-amber-zemin` #FFF3D1;
  - `--od-amber-kenar` #E3A400.
- **Kırmızı** artık ödemede yalnız fazla alınan tutar için.
- **Uygulandığı yerler:**
  - rezervasyon detayının durum satırı (fazlada "Alınan" altında kırmızı "Fazla alındı: 15.000 ₺");
  - "Ödemeler" düğmesi: durum renginde, ✓ / ! / ⚠ rozetiyle;
  - üstteki "… alınacak" kartı;
  - Ödemeler ekranı;
  - Sıradaki kartı;
  - Ajanda;
  - villa sayfasındaki rezervasyon listesi;
  - Gelir & gider;
  - yeni rezervasyondaki "Kalan ödeme".
- **Görüntüler:** `431-detay-*`, `431-odemeler-*`, `431-siradaki-giris-*`, `431-siradaki-yerlesti-*`, `431-ajanda-eksik`. Her biri 390 pt ve
  `-320-cokbuyuk`.

## 43.2 Soldan kaydırarak geri

- **Önceki durum:**
  - Uygulamanın kendi kenar hareketi vardı ama yalnız parmak kalkınca bakıyordu (32 pt, ekran takip etmiyordu).
  - Safari geçmişi (history) kullanılmıyor.
- **Şimdi:**
  - Sol kenardan (24 pt) başlayan harekette villa sayfası parmağı takip ediyor.
  - Arkadan Villalarım −%25'ten geliyor ve karartma açılıyor.
  - Bırakınca hareket %35'i geçtiyse ya da hızlı fiske atıldıysa geri dönüyor. Değilse ekran yerine dönüyor.
- **Görüntü:** `432-surukle-orta.jpg` (390) ve `432-surukle-orta-320-cokbuyuk.jpg`, sürüklemenin ortası; arkadaki ekran görünüyor.

## 43.3 Geri düğmesi

- **Yeni hâli:** "‹ Villalar", Ajanda'dan gelindiyse "‹ Takvim", iç ekranlarda villa adı. Çerçeve yok, %14 yarı saydam zemin,
  48 pt dokunma alanı.
- **Sığmayınca:** 320 + Çok büyük yazıda yalnız ok kalıyor. `aria-label` "Geri: Villalar".
- **Görüntüler:** `433-geri-*`.

## 43.4 Tutarlarda bölünmez boşluk

- `para()` sayı ile ₺ arasına bölünmez boşluk koyuyor. Elle yazılmış tutarlar ve misafir sayfası da aynı.
- **Görüntü:** `434-kapora*`. "Önerilen kapora · 3.900 ₺" düğmesinde ₺ sayıyla aynı satırda.

## Testler

- **Kapsam:** chromium; 390 normal ve 320 + Çok büyük; webkit en sonda bir kez.
- **Sonuçlar:**
  - **chromium:** 144 kontrol, 0 hata.
  - **webkit:** 124 kontrol, 0 hata, 159 sn. 43.2 yalnız chromium'da: dokunma olayları sayfada üretiliyor.
  - **Okunabilirlik taraması** (Görev 42 testi, ilgili ekranlar, 320 + Çok büyük): 0 bölünmüş kelime, 0 dar, 0 taşma.
- **Kontroller:**
  - **43.1:** 4 durumun her birinde renk sınıfı, renk, ikon ve yazı doğru durumda. Kontrast en az 4,5. 320'de taşma yok.
  - **43.2:** dokunma olayları sayfada üretildi, bu yüzden yalnız chromium. Kontrol edilenler:
    - sürüklerken takip ediyor;
    - %40 bırakınca dönüyor, Villalarım kaldığı kaydırma yerinde;
    - %25 bırakınca yerine dönüyor;
    - hızlı fiske dönüyor;
    - kenardan başlamayan ve dikey hareket bir şey yapmıyor;
    - pencere açıkken çalışmıyor;
    - Gelir & gider → villa sayfası;
    - hareketi azalt açıkken takip yok, bırakınca geri dönüyor;
    - Safari sekmesinde çalışmıyor.
  - **43.3:** yazı ya da yalnız ok, `aria-label`, çerçeve, zemin, 44 pt'den büyük alan. "Villa Takvimim" ve küçük başlıkla çakışma yok.
    Basma ve odak kuralları var.
  - **43.4:** görünen metinde düz boşluklu tutar yok. Kapora düğmesinde ₺ sayıyla aynı satırda. İngilizce çeviri çalışıyor.

## Görevden sapmalar

- **Misafir kartı:**
  - Görevde hareketin çalışacağı ekranlar arasında sayılıyor, ama misafir kartı alttan açılan bir pencere (Kapat düğmeli).
  - Görevdeki "pencere açıkken çalışmasın" kuralı gereği orada kenar hareketi yok; pencere aşağı çekilerek kapanıyor (41.5).
- **Sıradaki kartı, çıkış:**
  - Misafir yerleştirildiyse kart ödeme renginde ve "Yerleşti · 11:45" satırı var.
  - Yerleştirme onayı yoksa (ya da tutar yoksa) nötr.
- **Geri düğmesi:** dokunma alanı 48 pt. Görev en az 44 diyor, uygulamanın kuralı 48.
- **Safari sekmesi:** iPhone'da Safari sekmesinde uygulamanın kenar hareketi kapalı, Safari'ninki kalıyor. Bu yüzden orada kenardan
  kaydırmak uygulamadan çıkıp önceki sayfaya gidebilir.
- **Giriş / çıkış renkleri:** Görev 40.5'teki giriş yeşil, çıkış kırmızı renkleri tarih işareti; ödeme değil, değişmedi.
