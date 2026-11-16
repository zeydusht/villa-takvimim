# Görev 25: test sonuçları (25.4)

_Claude Code, 17 Kasım 2026._

- Ortam: Playwright, 390×844 ve 360×740, sahte sunucu, gerçek dokunma olayı.
- Betik: `qa25.js` (geçici klasörde). Sebep: `sebep.md`.

Her senaryo iki kez çalıştırıldı:
- **normal:** kaydırma konumu anında bildirilir (Chrome);
- **iPhone gibi:** kaydırma konumu bir kare geç bildirilir. 24.3 bu durumda takılıyordu.

Başlangıç: sayfa en üstte. Dokunulacak gün alt menünün arkasındaysa sayfa yalnız o gün görünecek kadar kaydırıldı (kullanıcı gibi), sonra güne kaydırmadan dokunuldu.

Ölçümler, kaydırma bittikten sonra:
- **Ay başlığı:** ay başlığının üstü − üst çubuğun altı. Aşama 1'de 8 ± 2 olmalı. Ayın satırları sığmıyorsa öncelik son satır (25.1).
- **Son satır:** panelin üstü − ızgaranın son satırının altı. Aşama 1'de ≥ 0 (kesişme 0); aşama 2'de 12 ± 2.
- **Seçim görünür:** seçili aralığın bütün günleri üst çubuk ile panel arasında.
- **Kaydırma:** dokunuştan kaç ms sonra başladı (panelin animasyonu bitince), ne kadar sürdü, yön değişti mi.

| Boyut | Senaryo | Konum | Aşama | Ay başlığı | Son satır − panel | Seçim görünür | Kararma | Kaydırma (başladı / sürdü / yön değişimi) | Sonuç |
|---|---|---|---|---|---|---|---|---|---|
| 390 | Kasım, 23 → 25 (sondan bir önceki satır; Zeyd'in videosu) | normal | 1 (giriş 11-23) | 8 | 112 | — | %35 | 457 / 367 ms / 0 | ✓ |
| 390 | Kasım, 23 → 25 (sondan bir önceki satır; Zeyd'in videosu) | normal | 2 (çıkış 11-25) | 3 | 12 | ✓ | %35 | 539 / 200 ms / 0 | ✓ |
| 390 | Kasım, 23 → 25 (sondan bir önceki satır; Zeyd'in videosu) | iPhone gibi | 1 (giriş 11-23) | 8 | 112 | — | %35 | 457 / 367 ms / 0 | ✓ |
| 390 | Kasım, 23 → 25 (sondan bir önceki satır; Zeyd'in videosu) | iPhone gibi | 2 (çıkış 11-25) | 3 | 12 | ✓ | %35 | 542 / 200 ms / 0 | ✓ |
| 390 | Aralık, 28 → 30 (son satır) | normal | 1 (giriş 12-28) | 8 | 172 | — | %35 | 425 / 366 ms / 0 | ✓ |
| 390 | Aralık, 28 → 30 (son satır) | normal | 2 (çıkış 12-30) | 73 | 12 | ✓ | %35 | 480 / 334 ms / 0 | ✓ |
| 390 | Aralık, 28 → 30 (son satır) | iPhone gibi | 1 (giriş 12-28) | 8 | 172 | — | %35 | 426 / 366 ms / 0 | ✓ |
| 390 | Aralık, 28 → 30 (son satır) | iPhone gibi | 2 (çıkış 12-30) | 73 | 12 | ✓ | %35 | 470 / 333 ms / 0 | ✓ |
| 390 | Aralık, 1 → 3 (ilk satır) | normal | 1 (giriş 12-01) | 8 | 172 | — | %35 | 416 / 400 ms / 0 | ✓ |
| 390 | Aralık, 1 → 3 (ilk satır) | normal | 2 (çıkış 12-03) | 63 | 12 | ✓ | %35 | 477 / 333 ms / 0 | ✓ |
| 390 | Aralık, 1 → 3 (ilk satır) | iPhone gibi | 1 (giriş 12-01) | 8 | 172 | — | %35 | 409 / 399 ms / 0 | ✓ |
| 390 | Aralık, 1 → 3 (ilk satır) | iPhone gibi | 2 (çıkış 12-03) | 63 | 12 | ✓ | %35 | 472 / 333 ms / 0 | ✓ |
| 360 | Kasım, 23 → 25 (sondan bir önceki satır; Zeyd'in videosu) | normal | 1 (giriş 11-23) | 4 (sığmıyor) | 12 | — | %35 | 463 / 367 ms / 0 | ✓ |
| 360 | Kasım, 23 → 25 (sondan bir önceki satır; Zeyd'in videosu) | normal | 2 (çıkış 11-25) | -110 | 12 | ✓ | %35 | 456 / 366 ms / 0 | ✓ |
| 360 | Kasım, 23 → 25 (sondan bir önceki satır; Zeyd'in videosu) | iPhone gibi | 1 (giriş 11-23) | 4 (sığmıyor) | 12 | — | %35 | 468 / 367 ms / 0 | ✓ |
| 360 | Kasım, 23 → 25 (sondan bir önceki satır; Zeyd'in videosu) | iPhone gibi | 2 (çıkış 11-25) | -110 | 12 | ✓ | %35 | 464 / 367 ms / 0 | ✓ |
| 360 | Aralık, 28 → 30 (son satır) | normal | 1 (giriş 12-28) | 8 | 68 | — | %35 | 427 / 367 ms / 0 | ✓ |
| 360 | Aralık, 28 → 30 (son satır) | normal | 2 (çıkış 12-30) | -31 | 12 | ✓ | %35 | 484 / 333 ms / 0 | ✓ |
| 360 | Aralık, 28 → 30 (son satır) | iPhone gibi | 1 (giriş 12-28) | 8 | 68 | — | %35 | 433 / 367 ms / 0 | ✓ |
| 360 | Aralık, 28 → 30 (son satır) | iPhone gibi | 2 (çıkış 12-30) | -31 | 12 | ✓ | %35 | 471 / 333 ms / 0 | ✓ |
| 360 | Aralık, 1 → 3 (ilk satır) | normal | 1 (giriş 12-01) | 8 | 68 | — | %35 | 416 / 400 ms / 0 | ✓ |
| 360 | Aralık, 1 → 3 (ilk satır) | normal | 2 (çıkış 12-03) | -50 | 12 | ✓ | %35 | 468 / 334 ms / 0 | ✓ |
| 360 | Aralık, 1 → 3 (ilk satır) | iPhone gibi | 1 (giriş 12-01) | 8 | 68 | — | %35 | 408 / 400 ms / 0 | ✓ |
| 360 | Aralık, 1 → 3 (ilk satır) | iPhone gibi | 2 (çıkış 12-03) | -50 | 12 | ✓ | %35 | 479 / 333 ms / 0 | ✓ |

Genel: hepsi geçti. Konsol hatası: 0.

Notlar:
- **360×740'ta Kasım:** 6 satırlı ay, ay başlığı 8 pt'deyken panelin üstüne sığmıyor. Kural gereği son satır panelin 12 pt üstüne geldi; ay başlığı üst çubuğa 4 pt kaldı.
- **Aşama 2:** ızgara her durumda üst çubuk ile panel arasına sığdı. Ay başlığı ve hap sırası, gerektiğinde üst çubuğun altına girdi (25.2'nin izin verdiği gibi). "Sığmazsa seçili satırları ortala" kuralı bu boyutlarda devreye girmedi.
- **Kaydırmanın başlaması:** dokunuştan ~410–540 ms sonra. Panelin kayması (320 ms) ve içeriğinin sırayla belirmesi bitince başlıyor. Kaydırma 400 ms; ekranda konumun değiştiği süre bu yüzden 330–400 ms görünüyor (ilk ve son karelerde değişim 1 px'ten az).
- **Aşama 2, 390'da Kasım:** takvim zaten neredeyse yerindeydi; yalnız 5 px kaydı.

## 25.3 Elle kaydırma ve seçimi kaldırma (Kasım 23 → 25, normal)

| Boyut | Aşama 2'den sonra elle 60 px yukarı | Sayfayı geri çekti mi | ✕ ile seçim kalkınca sayfa kaydı mı | Panel | Kararma |
|---|---|---|---|---|---|
| 390 | 408 → 348 | hayır ✓ | hayır ✓ (348) | indi ✓ | kalktı ✓ |
| 360 | 521 → 461 | hayır ✓ | hayır ✓ (461) | indi ✓ | kalktı ✓ |

Seçim kalkınca panelin altındaki pay da kalksaydı sayfa kısalıp yukarı zıplardı. Pay, kullanıcı yukarı kaydırıp gereksiz hâle gelene kadar kalıyor; ekran değişince de kalkıyor.

## Rehberli rezervasyon (Yardımlı mod)

| Boyut | Rehber metni | Takvim (üst–alt) | Rehber penceresi (üst–alt) | Ekranın altı |
|---|---|---|---|---|
| 390 | Şimdi misafirin çıkacağı güne dokunun. | 162–622 | 158–626 | 844 |
| 360 | Şimdi misafirin çıkacağı güne dokunun. | 186–646 | 182–650 | 740 |

Rehberli tarih adımlarında alttaki seçim paneli ve alt menü gizli (Görev 19). Baloncuk da takvimin üstünde duruyor ("Şimdi misafirin çıkacağı güne dokunun.").
- Ay başlığı üst çubuğun 8 pt altına çekilseydi baloncuğa yer kalmazdı.
- Bu yüzden rehberli seçimde konumu rehber veriyor: takvimin tamamı ekranda, pencere takvimin üstünde (4 pt payla), baloncuk takvimin hemen üstünde.
- İkinci aşama rehberde yok: iki gün seçilince rezervasyon formu kendiliğinden açılıyor.
- Rehberin kaydırması konumu geri okumadan her karede yazdığı için iPhone'daki takılma onda yok.

## Görseller

`olcum/` klasöründe her senaryo için:
- `-1-once`: dokunmadan önce;
- `-2-giris`: aşama 1;
- `-3-cikis`: aşama 2;
- `-4-temizle`: ✕'ten sonra.

`-gecikmeli` ekli olanlar iPhone gibi çalıştırmadır. Eski kodla çekilen görseller `yeniden-uretim/` klasöründe.

## Regresyon

Görev 18 tarih seçimi testi: 38/40, önceki gibi.
