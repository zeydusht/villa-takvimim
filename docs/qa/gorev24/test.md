# Görev 24: test sonuçları

_Claude Code, 17 Kasım 2026._

Ortam:
- Playwright, sahte sunucu;
- dokunuşlar gerçek dokunma olayı;
- her ölçüm her ekran karesinde (`requestAnimationFrame`) alındı.

Klavye iOS'a yakın taklit edildi. Alan türüne göre boy: metin 336, telefon 380 (web) / 336 (uygulama), sayı 300. Klavye 250 ms'de kademeli açılıyor. Üç model:
- **web:** görünen alan (`visualViewport`) her karede küçülür (Safari).
- **uygulama:** önce `keyboardWillShow`, animasyon bitince `keyboardDidShow`; görünen alan da küçülür. Telefon alanında "Otomatik doldur" çubuğu 400 ms sonra gelir (+44).
- **uygulama, görünen alan küçülmüyor:** Capacitor `resize: none` en kötü durum; yalnız klavye olayları gelir.

Betikler (geçici klasörde): `qa24klavye.js`, `qa24ucret.js`, `qa24takvim.js`, `acilis24.js`; ortak `qa24ortak.js`, `qa24kare.js`.

## 24.1 Tek klavye kuralı (rezervasyon formu, her yazı alanı)

Her alan için ölçülenler:
- **Mesafe:** klavye oturduktan sonra klavyenin üstü − alanın altı. Kaydırma olduysa 12 ± 2 olmalı; olmadıysa alan zaten görünüyordu (≥ 10).
- **Parça:** alanın kaç ayrı hareketle yerine gittiği. 1 = tek kaydırma; 0 = hiç kaymadı.
- **Yön değişimi:** alan bir yöne gidip geri döndü mü (sekme). 0 olmalı.
- **Arkadan sayfa:** panelin altının ekranın altından yukarı çıktığı, arkadaki sayfanın göründüğü kare sayısı. 0 olmalı.
- **Klavye arkasında:** klavye açılırken alanın klavyenin arkasında kaldığı son an (ms). Kural gereği (24.1.2, 24.1.6) alan klavye oturana kadar beklenir, sonra tek kaydırmayla gelir.

Klavye kapanışında ölçülenler: ücret kartının ekrandaki yeri her karede.
- Yön değişimi 0 olmalı ve arkadan sayfa görünmemeli.
- Hareket tek parça ve en fazla ~450 ms sürmeli (panelin 300 ms'lik inişi ya da rehberin 420 ms'lik adım geçişi).

| Boyut | Klavye | Rehber | Alanlar | Kapanışlar | Konsol hatası | Sonuç |
|---|---|---|---|---|---|---|
| iPhone 14 (390×664) | web | açık | 7/7 | 4/4 | 0 | ✓ |
| iPhone 14 (390×664) | web | kapalı | 8/8 | 2/2 | 0 | ✓ |
| iPhone 14 (390×664) | uygulama | açık | 7/7 | 4/4 | 0 | ✓ |
| iPhone 14 (390×664) | uygulama | kapalı | 8/8 | 2/2 | 0 | ✓ |
| iPhone 14 (390×664) | uygulama, görünen alan küçülmüyor | açık | 7/7 | 4/4 | 0 | ✓ |
| iPhone 14 (390×664) | uygulama, görünen alan küçülmüyor | kapalı | 8/8 | 2/2 | 0 | ✓ |
| 390×844 | web | açık | 7/7 | 4/4 | 0 | ✓ |
| 390×844 | web | kapalı | 8/8 | 2/2 | 0 | ✓ |
| 390×844 | uygulama | açık | 7/7 | 4/4 | 0 | ✓ |
| 390×844 | uygulama | kapalı | 8/8 | 2/2 | 0 | ✓ |
| 390×844 | uygulama, görünen alan küçülmüyor | açık | 7/7 | 4/4 | 0 | ✓ |
| 390×844 | uygulama, görünen alan küçülmüyor | kapalı | 8/8 | 2/2 | 0 | ✓ |
| 360×740 | web | açık | 7/7 | 4/4 | 0 | ✓ |
| 360×740 | web | kapalı | 8/8 | 2/2 | 0 | ✓ |
| 360×740 | uygulama | açık | 7/7 | 4/4 | 0 | ✓ |
| 360×740 | uygulama | kapalı | 8/8 | 2/2 | 0 | ✓ |
| 360×740 | uygulama, görünen alan küçülmüyor | açık | 7/7 | 4/4 | 0 | ✓ |
| 360×740 | uygulama, görünen alan küçülmüyor | kapalı | 8/8 | 2/2 | 0 | ✓ |

### iPhone 14 (390×664), web, rehber açık

| Alan | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında (son an) | Sonuç |
|---|---|---|---|---|---|---|
| ad soyad (metin) | 12 | 1 | 0 | 0 | 699 ms | ✓ |
| telefon (tel) | 12 | 1 | 0 | 0 | 701 ms | ✓ |
| telefon, klavye 300 | 92 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 380 | 12 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 336 | 56 | 0 | 0 | 0 | — | ✓ |
| kapora tutarı (numeric) | 12 | 1 | 0 | 0 | 724 ms | ✓ |
| not (metin) | 12 | 1 | 0 | 0 | 688 ms | ✓ |

| Klavye kapanışı | Yön değişimi | Kartın toplam hareketi | Süre | Arkadan sayfa | Sonuç |
|---|---|---|---|---|---|
| ad → İleri (klavye kapanır) | 0 | 67 px | 349 ms | 0 | ✓ |
| telefon → İleri (klavye kapanır) | 0 | 139 px | 383 ms | 0 | ✓ |
| kapora → Tamam (klavye kapanır) | 0 | 27 px | 200 ms | 0 | ✓ |
| klavye kapanır (odak gider) | 0 | 162 px | 250 ms | 0 | ✓ |

### iPhone 14 (390×664), web, rehber kapalı

| Alan | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında (son an) | Sonuç |
|---|---|---|---|---|---|---|
| ad soyad (metin) | 12 | 1 | 0 | 0 | 716 ms | ✓ |
| telefon (tel) | 12 | 1 | 0 | 0 | 685 ms | ✓ |
| telefon, klavye 300 | 92 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 380 | 12 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 336 | 56 | 0 | 0 | 0 | — | ✓ |
| kapora tutarı (numeric) | 12 | 1 | 0 | 0 | 712 ms | ✓ |
| not (metin) | 12 | 1 | 0 | 0 | 716 ms | ✓ |
| not → ad soyad (klavye açıkken) | 12 | 1 | 0 | 0 | 349 ms | ✓ |

| Klavye kapanışı | Yön değişimi | Kartın toplam hareketi | Süre | Arkadan sayfa | Sonuç |
|---|---|---|---|---|---|
| kapora → Tamam (klavye kapanır) | 0 | 105 px | 250 ms | 0 | ✓ |
| klavye kapanır (odak gider) | 0 | 0 px | 0 ms | 0 | ✓ |

### iPhone 14 (390×664), uygulama, rehber açık

| Alan | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında (son an) | Sonuç |
|---|---|---|---|---|---|---|
| ad soyad (metin) | 12 | 1 | 0 | 0 | 569 ms | ✓ |
| telefon (tel) | 12 | 2 (çubuk sonradan geldi) | 0 | 0 | 936 ms | ✓ |
| telefon, klavye 300 | 92 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 380 | 12 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 336 | 56 | 0 | 0 | 0 | — | ✓ |
| kapora tutarı (numeric) | 12 | 1 | 0 | 0 | 603 ms | ✓ |
| not (metin) | 12 | 1 | 0 | 0 | 568 ms | ✓ |

| Klavye kapanışı | Yön değişimi | Kartın toplam hareketi | Süre | Arkadan sayfa | Sonuç |
|---|---|---|---|---|---|
| ad → İleri (klavye kapanır) | 0 | 67 px | 350 ms | 0 | ✓ |
| telefon → İleri (klavye kapanır) | 0 | 139 px | 383 ms | 0 | ✓ |
| kapora → Tamam (klavye kapanır) | 0 | 27 px | 200 ms | 0 | ✓ |
| klavye kapanır (odak gider) | 0 | 162 px | 250 ms | 0 | ✓ |

### iPhone 14 (390×664), uygulama, rehber kapalı

| Alan | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında (son an) | Sonuç |
|---|---|---|---|---|---|---|
| ad soyad (metin) | 12 | 1 | 0 | 0 | 694 ms | ✓ |
| telefon (tel) | 12 | 2 (çubuk sonradan geldi) | 0 | 0 | 932 ms | ✓ |
| telefon, klavye 300 | 92 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 380 | 12 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 336 | 56 | 0 | 0 | 0 | — | ✓ |
| kapora tutarı (numeric) | 12 | 1 | 0 | 0 | 578 ms | ✓ |
| not (metin) | 12 | 1 | 0 | 0 | 582 ms | ✓ |
| not → ad soyad (klavye açıkken) | 12 | 1 | 0 | 0 | 518 ms | ✓ |

| Klavye kapanışı | Yön değişimi | Kartın toplam hareketi | Süre | Arkadan sayfa | Sonuç |
|---|---|---|---|---|---|
| kapora → Tamam (klavye kapanır) | 0 | 105 px | 250 ms | 0 | ✓ |
| klavye kapanır (odak gider) | 0 | 0 px | 0 ms | 0 | ✓ |

### iPhone 14 (390×664), uygulama, görünen alan küçülmüyor, rehber açık

| Alan | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında (son an) | Sonuç |
|---|---|---|---|---|---|---|
| ad soyad (metin) | 12 | 1 | 0 | 0 | 578 ms | ✓ |
| telefon (tel) | 12 | 1 | 0 | 0 | 565 ms | ✓ |
| telefon, klavye 300 | 48 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 380 | 12 | 1 | 0 | 0 | 471 ms | ✓ |
| telefon, klavye 336 | 56 | 0 | 0 | 0 | — | ✓ |
| kapora tutarı (numeric) | 12 | 1 | 0 | 0 | 591 ms | ✓ |
| not (metin) | 12 | 1 | 0 | 0 | 555 ms | ✓ |

| Klavye kapanışı | Yön değişimi | Kartın toplam hareketi | Süre | Arkadan sayfa | Sonuç |
|---|---|---|---|---|---|
| ad → İleri (klavye kapanır) | 0 | 67 px | 349 ms | 0 | ✓ |
| telefon → İleri (klavye kapanır) | 0 | 139 px | 383 ms | 0 | ✓ |
| kapora → Tamam (klavye kapanır) | 0 | 27 px | 200 ms | 0 | ✓ |
| klavye kapanır (odak gider) | 0 | 162 px | 251 ms | 0 | ✓ |

### iPhone 14 (390×664), uygulama, görünen alan küçülmüyor, rehber kapalı

| Alan | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında (son an) | Sonuç |
|---|---|---|---|---|---|---|
| ad soyad (metin) | 12 | 1 | 0 | 0 | 583 ms | ✓ |
| telefon (tel) | 12 | 1 | 0 | 0 | 518 ms | ✓ |
| telefon, klavye 300 | 48 | 0 | 0 | 0 | — | ✓ |
| telefon, klavye 380 | 12 | 1 | 0 | 0 | 483 ms | ✓ |
| telefon, klavye 336 | 56 | 0 | 0 | 0 | — | ✓ |
| kapora tutarı (numeric) | 12 | 1 | 0 | 0 | 570 ms | ✓ |
| not (metin) | 12 | 1 | 0 | 0 | 583 ms | ✓ |
| not → ad soyad (klavye açıkken) | 12 | 1 | 0 | 0 | 515 ms | ✓ |

| Klavye kapanışı | Yön değişimi | Kartın toplam hareketi | Süre | Arkadan sayfa | Sonuç |
|---|---|---|---|---|---|
| kapora → Tamam (klavye kapanır) | 0 | 105 px | 250 ms | 0 | ✓ |
| klavye kapanır (odak gider) | 0 | 0 px | 0 ms | 0 | ✓ |

Notlar:
- "Telefon, klavye 300 / 336": klavye küçülünce alan yukarıda ve görünür kalıyor. Kural gereği (24.1.3) kaydırılmıyor; mesafe 92 / 56.
- Uygulama modelinde telefonun "Otomatik doldur" çubuğu klavye oturduktan 400 ms sonra geliyor. Bu yüzden ikinci, aynı yönde küçük bir kaydırma oluyor (parça 2).

## 24.2 Ücret kartında düzenleme (3 satır: geceler, kısa konaklama, depozito)

Her satırda sırayla: "Değiştir" → 12345 yazıldı → "Tamam".
- **Değiştir:** alan klavyenin üstünde mi, tek hareket mi, arkadan sayfa görünüyor mu, rehber metni "Yeni tutarı yazın, sonra ‘Tamam’a dokunun." mu.
- **Tamam:** kart yön değiştirmeden (zıplamadan) yerinde ya da tek hareketle görünür kaldı mı, arkadan sayfa görünüyor mu, rehberin penceresi yine tüm kart mı (kenar payı 4/4), metin "Toplam ücret burada…" mı.

| Boyut | Klavye | Rehber | Satırlar | Konsol hatası | Sonuç |
|---|---|---|---|---|---|
| iPhone 14 (390×664) | web | açık | 3/3 | 0 | ✓ |
| iPhone 14 (390×664) | web | kapalı | 3/3 | 0 | ✓ |
| iPhone 14 (390×664) | uygulama | açık | 3/3 | 0 | ✓ |
| iPhone 14 (390×664) | uygulama | kapalı | 3/3 | 0 | ✓ |
| iPhone 14 (390×664) | uygulama, görünen alan küçülmüyor | açık | 3/3 | 0 | ✓ |
| iPhone 14 (390×664) | uygulama, görünen alan küçülmüyor | kapalı | 3/3 | 0 | ✓ |
| 390×844 | web | açık | 3/3 | 0 | ✓ |
| 390×844 | web | kapalı | 3/3 | 0 | ✓ |
| 390×844 | uygulama | açık | 3/3 | 0 | ✓ |
| 390×844 | uygulama | kapalı | 3/3 | 0 | ✓ |
| 390×844 | uygulama, görünen alan küçülmüyor | açık | 3/3 | 0 | ✓ |
| 390×844 | uygulama, görünen alan küçülmüyor | kapalı | 3/3 | 0 | ✓ |
| 360×740 | web | açık | 3/3 | 0 | ✓ |
| 360×740 | web | kapalı | 3/3 | 0 | ✓ |
| 360×740 | uygulama | açık | 3/3 | 0 | ✓ |
| 360×740 | uygulama | kapalı | 3/3 | 0 | ✓ |
| 360×740 | uygulama, görünen alan küçülmüyor | açık | 3/3 | 0 | ✓ |
| 360×740 | uygulama, görünen alan küçülmüyor | kapalı | 3/3 | 0 | ✓ |

### iPhone 14 (390×664), web, rehber açık

| Satır | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında | Tamam: kart üstü | Tamam: yön değişimi | Tamam: arkadan sayfa | Rehber penceresi, metin | Sonuç |
|---|---|---|---|---|---|---|---|---|---|---|
| Geceler | 67 | 0 | 0 | 0 | — | 194 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |
| Kısa konaklama | 12 | 1 | 0 | 0 | — | 189 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |
| Depozito | 12 | 1 | 0 | 0 | 699 ms | 82 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |

### iPhone 14 (390×664), web, rehber kapalı

| Satır | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında | Tamam: kart üstü | Tamam: yön değişimi | Tamam: arkadan sayfa | Rehber penceresi, metin | Sonuç |
|---|---|---|---|---|---|---|---|---|---|---|
| Geceler | 168 | 0 | 0 | 0 | — | 93 → 93 | 0 | 0 | — | ✓ |
| Kısa konaklama | 108 | 0 | 0 | 0 | — | 93 → 93 | 0 | 0 | — | ✓ |
| Depozito | 12 | 1 | 0 | 0 | — | 82 → 82 | 0 | 0 | — | ✓ |

### iPhone 14 (390×664), uygulama, rehber açık

| Satır | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında | Tamam: kart üstü | Tamam: yön değişimi | Tamam: arkadan sayfa | Rehber penceresi, metin | Sonuç |
|---|---|---|---|---|---|---|---|---|---|---|
| Geceler | 67 | 0 | 0 | 0 | — | 194 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |
| Kısa konaklama | 12 | 1 | 0 | 0 | — | 189 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |
| Depozito | 12 | 1 | 0 | 0 | 554 ms | 82 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |

### iPhone 14 (390×664), uygulama, rehber kapalı

| Satır | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında | Tamam: kart üstü | Tamam: yön değişimi | Tamam: arkadan sayfa | Rehber penceresi, metin | Sonuç |
|---|---|---|---|---|---|---|---|---|---|---|
| Geceler | 168 | 0 | 0 | 0 | — | 93 → 93 | 0 | 0 | — | ✓ |
| Kısa konaklama | 108 | 0 | 0 | 0 | — | 93 → 93 | 0 | 0 | — | ✓ |
| Depozito | 12 | 1 | 0 | 0 | — | 82 → 82 | 0 | 0 | — | ✓ |

### iPhone 14 (390×664), uygulama, görünen alan küçülmüyor, rehber açık

| Satır | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında | Tamam: kart üstü | Tamam: yön değişimi | Tamam: arkadan sayfa | Rehber penceresi, metin | Sonuç |
|---|---|---|---|---|---|---|---|---|---|---|
| Geceler | 67 | 0 | 0 | 0 | — | 194 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |
| Kısa konaklama | 12 | 1 | 0 | 0 | — | 189 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |
| Depozito | 12 | 1 | 0 | 0 | 557 ms | 82 → 194 | 0 | 0 | 4/4, «Toplam ücret burad…» | ✓ |

### iPhone 14 (390×664), uygulama, görünen alan küçülmüyor, rehber kapalı

| Satır | Mesafe | Parça | Yön değişimi | Arkadan sayfa | Klavye arkasında | Tamam: kart üstü | Tamam: yön değişimi | Tamam: arkadan sayfa | Rehber penceresi, metin | Sonuç |
|---|---|---|---|---|---|---|---|---|---|---|
| Geceler | 168 | 0 | 0 | 0 | — | 93 → 93 | 0 | 0 | — | ✓ |
| Kısa konaklama | 108 | 0 | 0 | 0 | — | 93 → 93 | 0 | 0 | — | ✓ |
| Depozito | 12 | 1 | 0 | 0 | — | 82 → 82 | 0 | 0 | — | ✓ |

Notlar:
- **Geceler ve kısa konaklama satırları:** alan klavyenin zaten üstünde kalıyor; kaydırma yok.
- **Depozito satırı:** kartın en altında.
  - Rehber açıkken kart odak hattında durduğu için klavye açılırken alan bir süre klavyenin arkasında kalıyor ("Klavye arkasında" sütunu).
  - Klavye oturunca tek kaydırmayla klavyenin 12 pt üstüne geliyor.
  - Klavye otururken alanı önceden kaydırmamak, 24.1'in istediği kural (kasmanın sebebi bu idi).
- **Tamam'dan sonra:** rehber açıkken depozitoda kart 82 → 194 tek hareketle iniyor. Sebep: kart klavyeyle yukarı kaymıştı ve baloncuğun kartın üstüne sığması gerekiyor. Yön değişimi yok, arkadan sayfa görünmüyor.

## 24.3 Takvim: ilk güne basınca takvim ortaya

Ayın son satırındaki ilk güne dokunuldu. İki başlangıç durumu denendi:
- sayfa en üstte;
- son satır ekranın altına (alt menünün hemen üstüne) gelecek kadar kaydırılmış.

Aralık'ta aynı satırda iki gün sonrası çıkış olarak da seçildi.
- **Ortada:** takvimin üstündeki boşluk ile panelin üstündeki boşluk eşit (± 6).
- **Panelin üstünde:** takvimin altı, panelin üstünden en az 4 yukarıda.
- **Satır görünür:** dokunulan günün satırındaki bütün günler panelin üstünde.

| Boyut | Ay | Başlangıç | Adım | Takvim | Panelin üstü | Üst / alt boşluk | Ortada | Panelin üstünde | Satır görünür | Kararma |
|---|---|---|---|---|---|---|---|---|---|---|
| iPhone 14 (390×664) | Kasım (son satır: 30) | sayfa en üstte | giriş 11-30 | -14–512 | 520 | -68 / 8 | ✗ | ✓ | ✓ | %35 ✓ |
| iPhone 14 (390×664) | Kasım (son satır: 30) | son satır ekranın altında | giriş 11-30 | -14–512 | 520 | -68 / 8 | ✗ | ✓ | ✓ | %35 ✓ |
| iPhone 14 (390×664) | Aralık (son satır: 28–31) | sayfa en üstte | giriş 12-28 | 46–512 | 520 | -8 / 8 | ✗ | ✓ | ✓ | %35 ✓ |
| iPhone 14 (390×664) | Aralık (son satır: 28–31) | sayfa en üstte | çıkış 12-30 | -49–417 | 425 | -103 / 8 | ✗ | ✓ | — | %35 ✓ |
| iPhone 14 (390×664) | Aralık (son satır: 28–31) | son satır ekranın altında | giriş 12-28 | 46–512 | 520 | -8 / 8 | ✗ | ✓ | ✓ | %35 ✓ |
| iPhone 14 (390×664) | Aralık (son satır: 28–31) | son satır ekranın altında | çıkış 12-30 | -49–417 | 425 | -103 / 8 | ✗ | ✓ | — | %35 ✓ |
| 390×844 | Kasım (son satır: 30) | sayfa en üstte | giriş 11-30 | 114–640 | 700 | 60 / 60 | ✓ | ✓ | ✓ | %35 ✓ |
| 390×844 | Kasım (son satır: 30) | son satır ekranın altında | giriş 11-30 | 114–640 | 700 | 60 / 60 | ✓ | ✓ | ✓ | %35 ✓ |
| 390×844 | Aralık (son satır: 28–31) | sayfa en üstte | giriş 12-28 | 144–610 | 700 | 90 / 90 | ✓ | ✓ | ✓ | %35 ✓ |
| 390×844 | Aralık (son satır: 28–31) | sayfa en üstte | çıkış 12-30 | 96–562 | 605 | 42 / 43 | ✓ | ✓ | — | %35 ✓ |
| 390×844 | Aralık (son satır: 28–31) | son satır ekranın altında | giriş 12-28 | 144–610 | 700 | 90 / 90 | ✓ | ✓ | ✓ | %35 ✓ |
| 390×844 | Aralık (son satır: 28–31) | son satır ekranın altında | çıkış 12-30 | 96–562 | 605 | 42 / 43 | ✓ | ✓ | — | %35 ✓ |
| 360×740 | Kasım (son satır: 30) | sayfa en üstte | giriş 11-30 | 62–588 | 596 | 8 / 8 | ✓ | ✓ | ✓ | %35 ✓ |
| 360×740 | Kasım (son satır: 30) | son satır ekranın altında | giriş 11-30 | 62–588 | 596 | 8 / 8 | ✓ | ✓ | ✓ | %35 ✓ |
| 360×740 | Aralık (son satır: 28–31) | sayfa en üstte | giriş 12-28 | 92–558 | 596 | 38 / 38 | ✓ | ✓ | ✓ | %35 ✓ |
| 360×740 | Aralık (son satır: 28–31) | sayfa en üstte | çıkış 12-30 | 27–493 | 501 | -27 / 8 | ✗ | ✓ | — | %35 ✓ |
| 360×740 | Aralık (son satır: 28–31) | son satır ekranın altında | giriş 12-28 | 92–558 | 596 | 38 / 38 | ✓ | ✓ | ✓ | %35 ✓ |
| 360×740 | Aralık (son satır: 28–31) | son satır ekranın altında | çıkış 12-30 | 27–493 | 501 | -27 / 8 | ✗ | ✓ | — | %35 ✓ |

Takvim sığmadığında 24.3'ün kuralı uygulanır: takvimin hiçbir satırı panelin altında kalmaz.
- Takvimin altı panelin 8 pt üstüne gelir.
- Takvimin üst kısmı üst çubuğun arkasına geçer.
- Dokunulan gün hep görünür.

Bu durum şu ekranlarda oluyor:
- iPhone 14 (Safari'de görünen 664 pt), Kasım'ın 6 satırlık takviminde;
- iPhone 14, Aralık'ta çıkış seçilince (panel üç butonla büyüyor);
- 360×740, Aralık'ta çıkış seçilince.

Bunlar tabloda "Ortada ✗" görünüyor. Kasım'ın son satırında yalnız 30 Kasım olduğu için Kasım'da çıkış günü seçilmedi.

Karartma, giriş günü seçilince de (20.6'da yalnız aralık seçilince vardı) takvim ve panel dışında %35. Dokunuşu ve kaydırmayı yutmuyor.

Konsol hatası: 0.

Görseller: `klavye/` (iPhone 14, web ve uygulama, rehber açık ve kapalı), `ucret/` (iPhone 14), `takvim/` (üç boyut). Gri şerit klavyenin yeridir.
