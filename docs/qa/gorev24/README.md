# Görev 24: test raporu

_Claude Code, 17 Kasım 2026._

- **24.1 ne kaldırıldı:** `sadelestirme.md`.
- **24.1–24.3 test sonuçları:** `test.md`. Görseller:
  - `klavye/`: iPhone 14, web ve uygulama, rehber açık ve kapalı;
  - `ucret/`: iPhone 14;
  - `takvim/`: üç boyut.
  - Gri şerit klavyenin yeridir.
- **24.4 açılış görselleri:** `acilis.md`.
- **Eski görevlerin testleri yeni kodla:** `regresyon/`.

## Özet

| Madde | Sonuç |
|---|---|
| 24.1 Tek klavye kuralı | 18 durum geçti: 3 boyut × 3 klavye modeli × rehber açık/kapalı. Her alanda tek kaydırma, yön değişimi (sekme) 0, arkadan sayfa görünen kare 0. Klavye kapanınca içerik tek yönde, ~300 ms'de iniyor. |
| 24.2 Ücret kartında düzenleme | 18 durum geçti, her birinde 3 satır. Alan klavye oturunca klavyenin üstünde. Tamam'da kart zıplamıyor. Rehberin penceresi ve metni alana, sonra karta dönüyor. |
| 24.3 Takvim ortaya | 3 boyut, Kasım ve Aralık, iki başlangıç durumu. Takvimin hiçbir satırı panelin altında kalmıyor; giriş ve çıkış günleri hep görünür; karartma %35. Sığdığı her durumda tam ortada; sığmadığı yerde son satırları panelin hemen üstünde. |
| 24.4 Açılış görselleri | 11 boyut. Logo web açılışının ilk karesiyle en fazla 2 cihaz pikseli farklı. |
| Konsol hatası | Hiçbir testte yok. |

## Eski görevlerin testleri (regresyon)

Görseller `regresyon/` klasöründe.

**Görev 21 ölçümleri** birebir aynı çıktı. Ayrıntı: `regresyon/g21-olcum.md`.

| Boyut | Klavye 12 ± 2 | Baloncuk 8 ± 2 | Pencere ± 1 | Üst %20 |
|---|---|---|---|---|
| iPhone 14 / 390 / 360, klavyeli tur | 4/4 | 13/13 | 1/1 | 12/12 |
| iPhone 14 / 390 / 360, klavyesiz tur | — | 11/11 | 6/6 | 10/10 |

Elle kaydırma (21.5): pencere ile hedef arası her karede 4 px, aynı.

**Görev 22:** 390 ve 360'ta 21/21.

**Görev 23.3:** 24 durumdan 18'i birebir aynı. Ayrıntı: `regresyon/g23/test.md`.
- Geçmeyen 6 durumun hepsi "telefon adımında klavye boyu değişir (300 → 380 → 336)" senaryosu.
- Klavye 300'e ve 336'ya küçülünce alan yukarıda ve görünür kalıyor. 24.1.3 gereği artık kaydırılmıyor: mesafe 92 ve 56 (Görev 23'te her seferinde 12'ye çekiliyordu).
- Bilerek yapılan değişiklik; rezervasyon her durumda kaydedildi, konsol hatası yok.

**Görev 19 akışları:** önceki çalıştırmayla aynı sonuç. Kapsananlar:
- rezervasyon, işlemler, uygulama turu, sürükleme, fotoğraf, klavye.

İki beklenen fark var:
- **Ücret adımının metni:** testte fiyatı girilmemiş geceler seçiliyor. Ücret kartında tutar alanı kendiliğinden açık geliyor, rehber de (24.2) "Yeni tutarı yazın, sonra ‘Tamam’a dokunun." diyor.
- **İşlem testindeki "soru yok":** Görev 23'te de vardı. Eski "soru kartı" beklentisi.

**Görev 19B:** testin uygulama klavyesi taklidine `keyboardDidShow` eklendi (gerçek uygulama gönderiyor). Bundan sonra:
- Akış testin amaçladığı sırayla ilerliyor. Görev 23 çalıştırmasında test "Tamam"a erken basıp bir adım geride kalıyordu.
- Ad soyad klavyenin 12 pt üstünde.
- Panelin altı artık ekranın altı (panel ekranı kaplıyor; klavye payı panelin içinde).

**Görev 20:**
- Baloncuk, perde, Tamam, panel ve kapat testleri aynı. Fiyat alanında bir fark var: alan zaten görünür olduğu için kaydırılmıyor (24.1.3).
- 20.9 klavye testinde iki fark var, ikisi de bilerek:
  - Dokununca alan önceden kaydırılmıyor (24.1.1).
  - Klavye kapanınca not alanı 300 ms'de panelin doğal yerine iniyor (24.1.5); 20.9'da hiç kıpırdamıyordu.
- Not alanı, sabit "Kaydet" çubuğunun arkasında kaldığında test önce kaydırıp sonra dokunuyor.

**Görev 18 tarih seçimi:** 38/40, önceki gibi.

## Testte bulunup düzeltilenler

- **Klavye kapanınca panel alt payı geçişsiz küçülüyordu.** Panelin eski `transition: transform` kuralı yeni geçişi eziyordu.
  - Sonuç: rehberin katmanı eski boyda kalıyor, panelin altında bir an sayfa görünüyor, sonra içerik 126 px zıplıyordu.
  - Geçişler tek kuralda birleştirildi.
  - Rehber katmanının boyu beklerken de güncelleniyor.
- **Ücret kartında Tamam'dan sonra kart önce yukarı gidip geri iniyordu (sekme).** Rehber, klavye kapanırken hedef değişimini eski klavye yüksekliğiyle hesaplıyordu.
  - Artık pencere hemen hedefe uyuyor.
  - Kaydırma kararı klavye durunca bir kez veriliyor.
- **Kapora düğmesine dokununca içerik önce inip sonra çıkıyordu.** Telefon alanından çıkış "klavye kapanıyor" sanılıyordu.
  - Odak aynı dokunuşta başka bir yazı alanına geçerse kapanış sayılmıyor.
- **Kapora tutarında baloncuk "Alınan kapora (₺)" yazısının üstüne biniyordu (Görev 20 testi).**
  - Rehberin penceresi yine etiketli alan kutusu.
- **Klavyesi olmayan ortamda (masaüstü) rehber hiç gelmeyecek bir klavyeyi 600 ms bekliyordu ve alanı yine de kaydırıyordu.**
  - Artık 300 ms; klavye yoksa kaydırma yok.

## Denenemeyen

Gerçek iPhone. Cihazda görülmesi gerekenler:
- iOS'un klavye olaylarının sırası ve "Otomatik doldur" çubuğunun zamanı;
- açılış görsellerinin ana ekrandan açılışta gerçekten gösterilmesi ve durum çubuğu payı.
