# Görev 20: test raporu

_Claude Code, 16 Kasım 2026._

## Nasıl test edildi

Testler Playwright'ta yapıldı:
- sahte sunucu kullanıldı;
- saat 16 Kasım 2026 10:00 olarak sabitlendi;
- ekran boyutları 390×844, 360×740 ve klavye için iPhone 14 (390×664) idi;
- dokunuşlar gerçek dokunma olayıyla verildi (`touchscreen.tap`, sürüklemeler CDP dokunma olayları).

**Klavye** iPhone'daki gibi taklit edildi. `window.visualViewport` sahte bir nesneyle değiştirildi. Klavye açılınca yalnız görünen alan küçülüyor (`height = innerHeight − 336`), sayfanın boyu değişmiyor. iOS'un görünen alanı ayrıca kaydırdığı durum için `offsetTop` 120, 160 ve 200 px ile de denendi.

Test betiği `qa20.js` (yardımcı dosya: `qa20ortak.js`). Görüntüler `klavye/`, `perde/`, `kapat/`, `tamam/`, `panel/` ve `regresyon/` klasörlerinde.

## Sonuçlar

### 20.1: Baloncuk yazılan alanı kapatmıyor

Her alanda klavye açıkken iki şey ölçüldü:
- baloncuğun dikdörtgeni ile yazı kutusunun dikdörtgeni kesişiyor mu (kesişim alanı, px²);
- yazı kutusunun ortasında en üstte hangi öğe var (`elementFromPoint`).

| Alan | 390×844 | 360×740 | iPhone 14 |
|---|---|---|---|
| Ad soyad | kesişim 0, üstte alan | 0, alan | 0, alan |
| Ad soyad (görünen alan 120 px kaymış) | 0, alan | 0, alan | 0, alan (şerit) |
| Ad soyad (görünen alan 160 px kaymış) | 0, alan | 0, alan (şerit) | 0, alan (şerit) |
| Telefon | 0, alan | 0, alan | 0, alan |
| Kapora | 0, alan | 0, alan | 0, alan |
| Not | 0, alan | 0, alan | 0, alan (şerit) |
| Fiyat (Fiyatlar rehberi) | 0, alan | 0, alan | 0, alan |

Tek istisna gerçek dışı derecede dar bir alan: iPhone 14'te görünen yükseklik 128 px'e indirildi. Orada yazı kutusu yine açık kaldı (kesişim 0), ama etiketin ("Ad soyad") bir kısmı şeridin altında kaldı.

Testte bulunan iki sorun:
- Panelin altında sabit duran "Rezervasyonu kaydet" çubuğu, klavye açıkken yazı kutusunun üstüne biniyordu. Baloncuk kesişim ölçümü bunu göstermiyordu; "üstte ne var" ölçümü buldu. Klavye açıkken bu çubuk artık formun sonunda akıyor.
- Görünen alan çok darken etiket ve kutu birlikte sığmıyordu. Bu durumda yazı kutusu esas alınıyor.

### 20.2: Karartılmış yerden kaydırma

| Ölçüm | 390 | 360 |
|---|---|---|
| Sayfada karartılmış yerden sürükleme | kaydı (399 → 588) | kaydı (399 → 551) |
| Panelde karartılmış yerden sürükleme | kaydı (0 → 142) | kaydı (0 → 172) |
| Kaydırmadan sonra çerçeve–hedef farkı | 0 px | 0 px |
| Karartılmış "geri" düğmesine dokunuş | engellendi, takvimde kalındı | engellendi |
| Karartılmış panel kapatma (✕) düğmesine dokunuş | engellendi, panel açık kaldı | engellendi |

### 20.3: Sorma yok, "Yardımı kapat" modu kapatıyor

"Yardımı kapat"a basınca:
- rehber kapandı, soru kartı çıkmadı;
- tercih `{"acik":false}` oldu;
- bildirim "Yardım kapatıldı. Hesap → Yardım'dan tekrar açabilirsiniz." çıktı ve 2 saniyede kalktı;
- Hesap'taki anahtar kapalı görünüyor; "Kapatılan yardımları geri aç" satırı yok.

### 20.4: "Değiştir" ve "Tamam"

- Ücret kartında "Değiştir"e basınca tutar alanı ve "Tamam" çıktı. Rehberin "İleri" düğmesi pasif oldu.
- 15000 yazıp "Tamam"a basınca alan kapandı, klavye kapandı (odakta alan kalmadı), satır "15.000 ₺" oldu, toplam güncellendi ve "İleri" etkinleşti.
- Kapora alanına 3000 yazıp "Tamam"a basınca alan kapandı ve yerine "Alınan kapora 3.000 ₺ · Değiştir" satırı geldi.

### 20.5–20.7: Takvimde normal seçim (rehber kapalı)

Denemede villaya kısa konaklama ücreti olarak 3 gece ve altı için 5.000 ₺ verildi.

| Ölçüm | 390 | 360 |
|---|---|---|
| İlk dokunuş: takvim görünür alana geldi mi | evet (114–640, panel 700'de) | evet (62–588, panel 596'da) |
| Başlık | "Çıkış gününü seçin", 20 px, kalın (600), yeşil | aynı |
| Alt satır | "Giriş: 27 Kasım Cuma · 16:00" | aynı |
| Aralık başlığı | "27 → 28 Kasım · 1 gece" | aynı |
| Toplam | 13.000 ₺ | 13.000 ₺ |
| Döküm | "8.000 ₺ konaklama + 5.000 ₺ kısa konaklama · depozito ayrıca" | aynı |
| Butonlar | 3 eşit genişlik (114 px) | 3 eşit (104 px) |
| Kararma | var (opaklık 1) | var |
| Karartılmış yerden kaydırma | kaydı, seçim duruyor | aynı |
| Karartılmış "Hesap" sekmesine dokunuş | seçim kalktı, kararma kalktı, Hesap açılmadı | aynı |
| Seçili günler panelin üstünde mi | evet (gün 518–574, panel 586) | evet (gün 414–470, panel 482) |
| Teklif panelindeki konaklama ücreti | 13.000 ₺ | 13.000 ₺ |
| Opsiyon paneli | "27–28 Kasım · 1 gece · 13.000 ₺" | aynı |
| Rezervasyon formu | 13.000 ₺ | 13.000 ₺ |
| Misafir sayfası (1.200 ₺ gece, 1 gece + 5.000 ₺) | alt çubuk 6.200 ₺, fiyat kutusu 6.200 ₺ | aynı |

Testte bulunan sorun: 360 px'te takvim panelle birlikte sığmıyor ve seçili günler panelin arkasında kalıyordu. Takvim sığmadığında artık seçili satırlar panelin üstünde tutuluyor.

### 20.8

Ayrıntı: `capraz-butonlar.md`.

### 20.9: Dokunarak odak ve klavye (rehber kapalı)

| Ölçüm | 390 | 360 |
|---|---|---|
| Sayfa konumu (panel açıkken, klavye açılıp kapanınca) | değişmedi | değişmedi |
| Ad soyad (klavyenin üstünde kalacak yerde) | klavye açılınca kaymadı | 25 px kaydı |
| Not (aşağıda) | önce panel kaydı, klavye açılınca alan 376–424'te, görünür (klavyenin üstü 508) | 272–320'de, görünür (404) |
| Klavye kapanırken alanın yeri | her karede aynı (376), en büyük kare farkı 0 px | aynı (272), 0 px |

Testte bulunan iki sorun:
- Panel klavyeyle birlikte 250 ms'de küçülüyor; alanı gösterme hesabı küçülme bitmeden yapıldığı için "Not" alanı klavyenin altında kalıyordu. Hesap artık küçülme bitince de yapılıyor.
- Klavye kapanınca panel 312 px aşağı kayıyordu. Artık panelin altına gereken kadar boşluk ekleniyor ve içerik yerinde duruyor.

## Görev 19 ve 18 testleri yeni kodla (regresyon)

Görüntüler `regresyon/` klasöründe.

**Görev 19 akışları** iki boyutta baştan sona geçti:
- rezervasyon (yeni "Not" adımıyla 13 adım), teklif, opsiyon ("Not" adımıyla), fiyat, paylaş;
- ödemeyi al ve yerleştir, alınan ödemeyi gir, gider, bakıcı, Drive, sihirbaz ipucu;
- Yardımlı mod kapalıyken işlem rehbersiz açılıyor;
- uygulama turu ve "Nasıl yapılır?";
- villa sürükleme: yenileme göstergesi 0, sıra değişti;
- 19B çerçeve testi: kaydırmada fark 0 px, kareler ortalama 16,7 ms.

İki test güncellendi:
- **Rezervasyon testi:** artık fiyatı girilmiş günleri seçiyor. Fiyatı girilmemiş gece varken tutar alanı açık geliyor ve 20.4 gereği "İleri" pasif kalıyor; bu beklenen davranış.
- **Opsiyon testi:** yeni "Not" adımını da geçiyor.

**Görev 18 tarih seçimi testi:** 38/40. Kalan 2 sonuç paneldeki başlangıç yazısı. Test eski yazıyı ("Giriş: 24 Aralık · Şimdi çıkış gününe dokunun") bekliyor; yeni yazı 20.5'in istediği "Çıkış gününü seçin · Giriş: 24 Aralık Perşembe · 16:00".

Testte bulunan bir sorun daha: takvimi ortalayan 400 ms'lik kaydırma, o sırada kullanıcı sayfayı kaydırırsa onunla çekişiyordu. Artık biri kaydırınca animasyon bırakılıyor.

## Denenemeyenler

- Gerçek iPhone. iOS'un dokununca odaklanma, klavye animasyonu ve kendi kaydırması emülasyonda birebir yok. Dokunma ile odaklanmayı biz yönettiğimiz için (`focus({preventScroll:true})`) iOS'un kaydırması devre dışı kalmalı; bu gerçek iPhone'da test edilecek.
- Dokunarak odaklanmayı biz yaptığımız için imleç, kutuda dokunulan yere değil alanın sonuna konuyor. Bu yalnız ilk odaklanmada oluyor; alan zaten seçiliyken dokununca tarayıcı imleci dokunulan yere koyuyor.
