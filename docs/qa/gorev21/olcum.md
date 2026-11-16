# Görev 21.6: Ölçümler

_Claude Code, 16 Kasım 2026. Playwright: dokunuşlar gerçek dokunma olayı. Klavye iOS gibi taklit edildi: sahte `visualViewport`, 336 px. Bir yazı alanına odaklanınca açılıyor, odak gidince kapanıyor. Betik: `qa21.js`._

Ölçüm `Rehber.olcum()` ile alındı. Değerler ekran pikselidir (CSS px = pt):
- hedef: rehberin vurguladığı alan;
- pencere: aydınlık çerçeve;
- baloncuk;
- odak hattı;
- klavyenin üst kenarı.

Kriterler (21.6):
1. Klavye açıkken klavyenin üst kenarı ile hedefin alt kenarı arası 12 ± 2.
2. Baloncuğun alt kenarı ile hedefin üst kenarı arası 8 ± 2.
3. Adım geçişinde pencerenin alt kenarı oynamıyor (± 1).
4. Geçişin ara karelerinde hedef ekranın üst %20'sine çıkmıyor.

## Özet

| Boyut | 1. Klavye 12 ± 2 | 2. Baloncuk 8 ± 2 | 3. Pencere alt kenarı ± 1 | 4. Üst %20'ye çıkmıyor |
|---|---|---|---|---|
| iPhone 14 (390×664) | 4/4 | 13/13 | 1/1 | 12/12 |
| 390×844 | 4/4 | 13/13 | 1/1 | 12/12 |
| 360×740 | 4/4 | 13/13 | 1/1 | 12/12 |
| iPhone 14 (390×664) (klavyesiz) | 0/0 | 11/11 | 6/6 | 10/10 |
| 390×844 (klavyesiz) | 0/0 | 11/11 | 6/6 | 10/10 |
| 360×740 (klavyesiz) | 0/0 | 11/11 | 6/6 | 10/10 |

Kriter 3'ün bilerek uygulanmadığı geçişler var. Bunlar tabloda "—" ile gösterildi.
- **Klavye açılıp kapanırken:** odak hattının kendisi klavyeyle birlikte iniyor ya da çıkıyor (21.4).
- **Uzun hedefler (takvim, ücret kartı):** baloncukla birlikte hatta sığmıyor. Bu durumda ikisinin birlikte görünebileceği en düşük konum kullanılıyor (21.1).
- **Sabit "Kaydet":** panelin altına yapışık olduğu için kaydırılamıyor.

## iPhone 14 (390×664)

### Adımlar (yerine oturduktan sonra)

| Adım | Klavye | Klavye üstü − hedef altı (12 ± 2) | Hedef üstü − baloncuk altı (8 ± 2) | Hedef altı / odak hattı |
|---|---|---|---|---|
| 1-giris-gunu | kapalı | — | 8.2 ✓ | 621 / 493 (istisna) |
| 2-cikis-gunu | kapalı | — | 8.2 ✓ | 621 / 493 (istisna) |
| 3-ucret | kapalı | — | 7.6 ✓ | 499 / 478 (istisna) |
| 4-ad (klavye kapalı) | kapalı | — | 7.8 ✓ | 478 / 478 |
| 4-ad (klavye açık) | açık | 12 ✓ | 7.8 ✓ | 316 / 316 |
| 5-kisi | kapalı | — | 7.8 ✓ | 478 / 478 |
| 6-telefon | kapalı | — | 7.8 ✓ | 478 / 478 |
| 6-telefon (klavye açık) | açık | 12 ✓ | 7.8 ✓ | 316 / 316 |
| 7-kapora | kapalı | — | 7.8 ✓ | 478 / 478 |
| 7-kapora (klavye açık) | açık | 12 ✓ | 7.8 ✓ | 316 / 316 |
| 8-not | kapalı | — | 7.6 ✓ | 478 / 478 |
| 8-not (klavye açık) | açık | 12 ✓ | 7.6 ✓ | 316 / 316 |
| 9-kaydet | kapalı | — | 7.8 ✓ | 636 / 478 (istisna) |

### Geçişler (her kare ölçüldü)

| Geçiş | Klavye değişti | Pencere alt kenarı (ilk → son) | Yeni adımda oynama (± 1) | Hedefin en üst noktası (üst %20 sınırı) |
|---|---|---|---|---|
| 1-giris-gunu → 2-cikis-gunu (gün seçimi) | hayır | 625 → 625 | — (0) | 161 (sınır 133) ✓ |
| 2-cikis-gunu → 3-ucret (aralık → form) | hayır | 625 → 503 | — (122) | 194 (sınır 133) ✓ |
| 3-ucret → 4-ad (klavye kapalı) (İleri) | hayır | 503 → 482 | — (21) | 403 (sınır 133) ✓ |
| 4-ad (klavye kapalı) → 4-ad (klavye açık) (ad alanına dokunma (klavye açılır)) | evet | 482 → 320 | — (162) | 241 (sınır 133) ✓ |
| 4-ad (klavye açık) → 5-kisi (Tamam) | evet | 320 → 482 | — (162) | 332 (sınır 133) ✓ |
| 5-kisi → 6-telefon (İleri) | hayır | 482 → 482 | 0 ✓ | 403 (sınır 133) ✓ |
| 6-telefon → 6-telefon (klavye açık) (telefon alanına dokunma) | evet | 482 → 320 | — (162) | 241 (sınır 133) ✓ |
| 6-telefon (klavye açık) → 7-kapora (İleri) | evet | 320 → 482 | — (162) | 332 (sınır 133) ✓ |
| 7-kapora → 7-kapora (klavye açık) (kapora anahtarı (alan açılır, klavye açılır)) | evet | 482 → 320 | — (162) | 241 (sınır 133) ✓ |
| 7-kapora (klavye açık) → 8-not (İleri) | evet | 320 → 482 | — (162) | 359 (sınır 133) ✓ |
| 8-not → 8-not (klavye açık) (not alanına dokunma) | evet | 482 → 320 | — (162) | 241 (sınır 133) ✓ |
| 8-not (klavye açık) → 9-kaydet (İleri) | evet | 320 → 640 | — (320) | 272 (sınır 133) ✓ |

## 390×844

### Adımlar (yerine oturduktan sonra)

| Adım | Klavye | Klavye üstü − hedef altı (12 ± 2) | Hedef üstü − baloncuk altı (8 ± 2) | Hedef altı / odak hattı |
|---|---|---|---|---|
| 1-giris-gunu | kapalı | — | 8.2 ✓ | 622 / 623 (istisna) |
| 2-cikis-gunu | kapalı | — | 8.2 ✓ | 622 / 623 (istisna) |
| 3-ucret | kapalı | — | 7.6 ✓ | 608 / 608 (istisna) |
| 4-ad (klavye kapalı) | kapalı | — | 7.8 ✓ | 608 / 608 |
| 4-ad (klavye açık) | açık | 12 ✓ | 7.8 ✓ | 496 / 496 |
| 5-kisi | kapalı | — | 7.8 ✓ | 608 / 608 |
| 6-telefon | kapalı | — | 7.8 ✓ | 608 / 608 |
| 6-telefon (klavye açık) | açık | 12 ✓ | 7.8 ✓ | 496 / 496 |
| 7-kapora | kapalı | — | 7.8 ✓ | 608 / 608 |
| 7-kapora (klavye açık) | açık | 12 ✓ | 7.8 ✓ | 496 / 496 |
| 8-not | kapalı | — | 7.6 ✓ | 608 / 608 |
| 8-not (klavye açık) | açık | 12 ✓ | 7.6 ✓ | 496 / 496 |
| 9-kaydet | kapalı | — | 7.8 ✓ | 816 / 608 (istisna) |

### Geçişler (her kare ölçüldü)

| Geçiş | Klavye değişti | Pencere alt kenarı (ilk → son) | Yeni adımda oynama (± 1) | Hedefin en üst noktası (üst %20 sınırı) |
|---|---|---|---|---|
| 1-giris-gunu → 2-cikis-gunu (gün seçimi) | hayır | 626 → 626 | — (1) | 162 (sınır 169; uzun hedef, son yeri 162, üstüne çıkmadı) ✓ |
| 2-cikis-gunu → 3-ucret (aralık → form) | hayır | 626 → 612 | — (210) | 303 (sınır 169) ✓ |
| 3-ucret → 4-ad (klavye kapalı) (İleri) | hayır | 612 → 612 | — (1) | 533 (sınır 169) ✓ |
| 4-ad (klavye kapalı) → 4-ad (klavye açık) (ad alanına dokunma (klavye açılır)) | evet | 612 → 500 | — (112) | 421 (sınır 169) ✓ |
| 4-ad (klavye açık) → 5-kisi (Tamam) | evet | 500 → 612 | — (112) | 512 (sınır 169) ✓ |
| 5-kisi → 6-telefon (İleri) | hayır | 612 → 612 | 1 ✓ | 533 (sınır 169) ✓ |
| 6-telefon → 6-telefon (klavye açık) (telefon alanına dokunma) | evet | 612 → 500 | — (112) | 421 (sınır 169) ✓ |
| 6-telefon (klavye açık) → 7-kapora (İleri) | evet | 500 → 612 | — (112) | 512 (sınır 169) ✓ |
| 7-kapora → 7-kapora (klavye açık) (kapora anahtarı (alan açılır, klavye açılır)) | evet | 612 → 500 | — (112) | 421 (sınır 169) ✓ |
| 7-kapora (klavye açık) → 8-not (İleri) | evet | 500 → 612 | — (118) | 533 (sınır 169) ✓ |
| 8-not → 8-not (klavye açık) (not alanına dokunma) | evet | 612 → 500 | — (112) | 421 (sınır 169) ✓ |
| 8-not (klavye açık) → 9-kaydet (İleri) | evet | 500 → 820 | — (320) | 452 (sınır 169) ✓ |

## 360×740

### Adımlar (yerine oturduktan sonra)

| Adım | Klavye | Klavye üstü − hedef altı (12 ± 2) | Hedef üstü − baloncuk altı (8 ± 2) | Hedef altı / odak hattı |
|---|---|---|---|---|
| 1-giris-gunu | kapalı | — | 8.2 ✓ | 621 / 548 (istisna) |
| 2-cikis-gunu | kapalı | — | 8 ✓ | 646 / 548 (istisna) |
| 3-ucret | kapalı | — | 7.6 ✓ | 533 / 533 (istisna) |
| 4-ad (klavye kapalı) | kapalı | — | 7.8 ✓ | 533 / 533 |
| 4-ad (klavye açık) | açık | 12 ✓ | 7.8 ✓ | 392 / 392 |
| 5-kisi | kapalı | — | 7.6 ✓ | 533 / 533 |
| 6-telefon | kapalı | — | 7.8 ✓ | 533 / 533 |
| 6-telefon (klavye açık) | açık | 12 ✓ | 7.8 ✓ | 392 / 392 |
| 7-kapora | kapalı | — | 7.6 ✓ | 533 / 533 |
| 7-kapora (klavye açık) | açık | 12 ✓ | 7.6 ✓ | 392 / 392 |
| 8-not | kapalı | — | 7.6 ✓ | 533 / 533 |
| 8-not (klavye açık) | açık | 12 ✓ | 7.6 ✓ | 392 / 392 |
| 9-kaydet | kapalı | — | 7.6 ✓ | 712 / 533 (istisna) |

### Geçişler (her kare ölçüldü)

| Geçiş | Klavye değişti | Pencere alt kenarı (ilk → son) | Yeni adımda oynama (± 1) | Hedefin en üst noktası (üst %20 sınırı) |
|---|---|---|---|---|
| 1-giris-gunu → 2-cikis-gunu (gün seçimi) | hayır | 625 → 650 | — (25) | 161 (sınır 148) ✓ |
| 2-cikis-gunu → 3-ucret (aralık → form) | hayır | 650 → 537 | — (135) | 228 (sınır 148) ✓ |
| 3-ucret → 4-ad (klavye kapalı) (İleri) | hayır | 537 → 537 | — (1) | 458 (sınır 148) ✓ |
| 4-ad (klavye kapalı) → 4-ad (klavye açık) (ad alanına dokunma (klavye açılır)) | evet | 537 → 396 | — (141) | 317 (sınır 148) ✓ |
| 4-ad (klavye açık) → 5-kisi (Tamam) | evet | 396 → 537 | — (141) | 408 (sınır 148) ✓ |
| 5-kisi → 6-telefon (İleri) | hayır | 537 → 537 | 1 ✓ | 458 (sınır 148) ✓ |
| 6-telefon → 6-telefon (klavye açık) (telefon alanına dokunma) | evet | 537 → 396 | — (141) | 317 (sınır 148) ✓ |
| 6-telefon (klavye açık) → 7-kapora (İleri) | evet | 396 → 537 | — (141) | 408 (sınır 148) ✓ |
| 7-kapora → 7-kapora (klavye açık) (kapora anahtarı (alan açılır, klavye açılır)) | evet | 537 → 396 | — (141) | 317 (sınır 148) ✓ |
| 7-kapora (klavye açık) → 8-not (İleri) | evet | 396 → 537 | — (141) | 435 (sınır 148) ✓ |
| 8-not → 8-not (klavye açık) (not alanına dokunma) | evet | 537 → 396 | — (141) | 317 (sınır 148) ✓ |
| 8-not (klavye açık) → 9-kaydet (İleri) | evet | 396 → 716 | — (320) | 348 (sınır 148) ✓ |

## iPhone 14 (390×664)

### Adımlar (yerine oturduktan sonra)

| Adım | Klavye | Klavye üstü − hedef altı (12 ± 2) | Hedef üstü − baloncuk altı (8 ± 2) | Hedef altı / odak hattı |
|---|---|---|---|---|
| 1-giris-gunu | kapalı | — | 8.2 ✓ | 621 / 493 (istisna) |
| 2-cikis-gunu | kapalı | — | 8.2 ✓ | 621 / 493 (istisna) |
| 3-ucret | kapalı | — | 7.6 ✓ | 499 / 478 (istisna) |
| 4-ad | kapalı | — | 7.8 ✓ | 478 / 478 |
| 5-kisi | kapalı | — | 7.8 ✓ | 478 / 478 |
| 6-telefon | kapalı | — | 7.8 ✓ | 478 / 478 |
| 7-kapora | kapalı | — | 7.8 ✓ | 478 / 478 |
| 8-not | kapalı | — | 7.6 ✓ | 478 / 478 |
| 7-kapora (geri) | kapalı | — | 7.8 ✓ | 478 / 478 |
| 8-not (yine) | kapalı | — | 7.6 ✓ | 478 / 478 |
| 9-kaydet | kapalı | — | 7.8 ✓ | 636 / 478 (istisna) |

### Geçişler (her kare ölçüldü)

| Geçiş | Klavye değişti | Pencere alt kenarı (ilk → son) | Yeni adımda oynama (± 1) | Hedefin en üst noktası (üst %20 sınırı) |
|---|---|---|---|---|
| 1-giris-gunu → 2-cikis-gunu (gün seçimi) | hayır | 625 → 625 | — (0) | 161 (sınır 133) ✓ |
| 2-cikis-gunu → 3-ucret (aralık → form) | hayır | 625 → 503 | — (122) | 194 (sınır 133) ✓ |
| 3-ucret → 4-ad (İleri) | hayır | 503 → 482 | — (21) | 403 (sınır 133) ✓ |
| 4-ad → 5-kisi (Tamam) | hayır | 482 → 482 | 0 ✓ | 399 (sınır 133) ✓ |
| 5-kisi → 6-telefon (İleri) | hayır | 482 → 482 | 0 ✓ | 403 (sınır 133) ✓ |
| 6-telefon → 7-kapora (İleri) | hayır | 482 → 482 | 1 ✓ | 427 (sınır 133) ✓ |
| 7-kapora → 8-not (İleri) | hayır | 482 → 482 | 1 ✓ | 403 (sınır 133) ✓ |
| 8-not → 7-kapora (geri) (Geri) | hayır | 482 → 482 | 0 ✓ | 336 (sınır 133) ✓ |
| 7-kapora (geri) → 8-not (yine) (İleri) | hayır | 482 → 482 | 1 ✓ | 403 (sınır 133) ✓ |
| 8-not (yine) → 9-kaydet (İleri) | hayır | 482 → 640 | — (158) | 506 (sınır 133) ✓ |

## 390×844

### Adımlar (yerine oturduktan sonra)

| Adım | Klavye | Klavye üstü − hedef altı (12 ± 2) | Hedef üstü − baloncuk altı (8 ± 2) | Hedef altı / odak hattı |
|---|---|---|---|---|
| 1-giris-gunu | kapalı | — | 8.2 ✓ | 622 / 623 (istisna) |
| 2-cikis-gunu | kapalı | — | 8.2 ✓ | 622 / 623 (istisna) |
| 3-ucret | kapalı | — | 7.6 ✓ | 608 / 608 (istisna) |
| 4-ad | kapalı | — | 7.8 ✓ | 608 / 608 |
| 5-kisi | kapalı | — | 7.8 ✓ | 608 / 608 |
| 6-telefon | kapalı | — | 7.8 ✓ | 608 / 608 |
| 7-kapora | kapalı | — | 7.8 ✓ | 608 / 608 |
| 8-not | kapalı | — | 7.6 ✓ | 608 / 608 |
| 7-kapora (geri) | kapalı | — | 7.8 ✓ | 608 / 608 |
| 8-not (yine) | kapalı | — | 7.6 ✓ | 608 / 608 |
| 9-kaydet | kapalı | — | 7.8 ✓ | 816 / 608 (istisna) |

### Geçişler (her kare ölçüldü)

| Geçiş | Klavye değişti | Pencere alt kenarı (ilk → son) | Yeni adımda oynama (± 1) | Hedefin en üst noktası (üst %20 sınırı) |
|---|---|---|---|---|
| 1-giris-gunu → 2-cikis-gunu (gün seçimi) | hayır | 626 → 626 | — (1) | 162 (sınır 169; uzun hedef, son yeri 162, üstüne çıkmadı) ✓ |
| 2-cikis-gunu → 3-ucret (aralık → form) | hayır | 626 → 612 | — (210) | 303 (sınır 169) ✓ |
| 3-ucret → 4-ad (İleri) | hayır | 612 → 612 | — (1) | 533 (sınır 169) ✓ |
| 4-ad → 5-kisi (Tamam) | hayır | 612 → 612 | 1 ✓ | 529 (sınır 169) ✓ |
| 5-kisi → 6-telefon (İleri) | hayır | 612 → 612 | 1 ✓ | 533 (sınır 169) ✓ |
| 6-telefon → 7-kapora (İleri) | hayır | 612 → 612 | 1 ✓ | 557 (sınır 169) ✓ |
| 7-kapora → 8-not (İleri) | hayır | 612 → 612 | 1 ✓ | 533 (sınır 169) ✓ |
| 8-not → 7-kapora (geri) (Geri) | hayır | 612 → 612 | 1 ✓ | 466 (sınır 169) ✓ |
| 7-kapora (geri) → 8-not (yine) (İleri) | hayır | 612 → 612 | 1 ✓ | 533 (sınır 169) ✓ |
| 8-not (yine) → 9-kaydet (İleri) | hayır | 612 → 820 | — (208) | 636 (sınır 169) ✓ |

## 360×740

### Adımlar (yerine oturduktan sonra)

| Adım | Klavye | Klavye üstü − hedef altı (12 ± 2) | Hedef üstü − baloncuk altı (8 ± 2) | Hedef altı / odak hattı |
|---|---|---|---|---|
| 1-giris-gunu | kapalı | — | 8.2 ✓ | 621 / 548 (istisna) |
| 2-cikis-gunu | kapalı | — | 8 ✓ | 646 / 548 (istisna) |
| 3-ucret | kapalı | — | 7.6 ✓ | 533 / 533 (istisna) |
| 4-ad | kapalı | — | 7.8 ✓ | 533 / 533 |
| 5-kisi | kapalı | — | 7.6 ✓ | 533 / 533 |
| 6-telefon | kapalı | — | 7.8 ✓ | 533 / 533 |
| 7-kapora | kapalı | — | 7.6 ✓ | 533 / 533 |
| 8-not | kapalı | — | 7.6 ✓ | 533 / 533 |
| 7-kapora (geri) | kapalı | — | 7.6 ✓ | 533 / 533 |
| 8-not (yine) | kapalı | — | 7.6 ✓ | 533 / 533 |
| 9-kaydet | kapalı | — | 7.6 ✓ | 712 / 533 (istisna) |

### Geçişler (her kare ölçüldü)

| Geçiş | Klavye değişti | Pencere alt kenarı (ilk → son) | Yeni adımda oynama (± 1) | Hedefin en üst noktası (üst %20 sınırı) |
|---|---|---|---|---|
| 1-giris-gunu → 2-cikis-gunu (gün seçimi) | hayır | 625 → 650 | — (25) | 161 (sınır 148) ✓ |
| 2-cikis-gunu → 3-ucret (aralık → form) | hayır | 650 → 537 | — (135) | 228 (sınır 148) ✓ |
| 3-ucret → 4-ad (İleri) | hayır | 537 → 537 | — (1) | 458 (sınır 148) ✓ |
| 4-ad → 5-kisi (Tamam) | hayır | 537 → 537 | 1 ✓ | 454 (sınır 148) ✓ |
| 5-kisi → 6-telefon (İleri) | hayır | 537 → 537 | 1 ✓ | 458 (sınır 148) ✓ |
| 6-telefon → 7-kapora (İleri) | hayır | 537 → 537 | 1 ✓ | 482 (sınır 148) ✓ |
| 7-kapora → 8-not (İleri) | hayır | 537 → 537 | 1 ✓ | 458 (sınır 148) ✓ |
| 8-not → 7-kapora (geri) (Geri) | hayır | 537 → 537 | 1 ✓ | 391 (sınır 148) ✓ |
| 7-kapora (geri) → 8-not (yine) (İleri) | hayır | 537 → 537 | 1 ✓ | 458 (sınır 148) ✓ |
| 8-not (yine) → 9-kaydet (İleri) | hayır | 537 → 716 | — (179) | 561 (sınır 148) ✓ |

## 21.5: Elle kaydırma

Rehber açıkken içerik parmakla kaydırıldı; her karede pencere ile hedefin alt kenarları arasındaki fark ölçüldü. Ardından "İleri"ye basıldı.

| Boyut | Kare | Hedef ne kadar kaydı | Pencere − hedef farkı (her karede) | "İleri"den sonra hedef altı / odak hattı |
|---|---|---|---|---|
| 360×740 | 55 | 121 px | 4 px (sabit; pencerenin kenar payı) | 533 / 533 |
| 390×844 | 56 | 120 px | 4 px (sabit; pencerenin kenar payı) | 608 / 608 |
| iPhone 14 (390×664) | 54 | 147 px | 4 px (sabit; pencerenin kenar payı) | 478 / 478 |
