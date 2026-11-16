# Görev 23.3: test sonuçları

_Claude Code, 16 Kasım 2026. Playwright, sahte sunucu, dokunuşlar gerçek dokunma olayı. Betik: `qa23.js` (tek senaryo), `qa23tum.js` (hepsi)._

Klavye iOS'a yakın taklit edildi (sahte `visualViewport`). Klavye yüksekliği alan türüne göre değişir ve 250 ms'de kademeli açılır; her karede resize olayı gelir.
- **Web modeli (Safari):** metin 336, telefon 380 (tuş takımı + "Otomatik doldur" çubuğu), sayı 300. Yalnız görünen alan küçülür.
- **Uygulama modeli:** önce `keyboardWillShow` yüksekliği bildirilir (`VTKlavye`), sonra görünen alan küçülür. Telefon alanında "Otomatik doldur" çubuğu 400 ms sonra gelir (+44); bu çubuk keyboardWillShow'a dahil değil.

Mesafe = klavyenin üst kenarı (görünen alanın altı, çubuk dahil) − odaktaki alanın alt kenarı. Hedef 12 ± 2 pt.

Her senaryoda şunlar kontrol edildi:
- konsol hatası 0;
- her klavyeli adımda mesafe 12 ± 2;
- rehber sonuna kadar gidiyor;
- rezervasyon kaydediliyor ("Rezervasyon kaydedildi" kartı, sunucuya kayıt isteği).

## Özet

| Boyut | Klavye | Senaryo | Konsol hatası | Mesafe 12 ± 2 | Sonuna kadar + kayıt | Sonuç |
|---|---|---|---|---|---|---|
| iPhone 14 | web | 1. Tam rezervasyon, kapora kapalı | 0 | 3/3 (12, 12, 12) | evet | ✓ |
| iPhone 14 | web | 2. Kapora açık + tutar | 0 | 4/4 (12, 12, 12, 12) | evet | ✓ |
| iPhone 14 | web | 3. Kapora aç-kapa-aç | 0 | 4/4 (12, 12, 12, 12) | evet | ✓ |
| iPhone 14 | web | 4. Telefon adımında klavye yüksekliği değişir (300 → 380 → 336) | 0 | 7/7 (12, 12, 13, 12, 12, 12, 12) | evet | ✓ |
| iPhone 14 | uygulama | 1. Tam rezervasyon, kapora kapalı | 0 | 3/3 (11, 11, 12) | evet | ✓ |
| iPhone 14 | uygulama | 2. Kapora açık + tutar | 0 | 4/4 (12, 12, 12, 12) | evet | ✓ |
| iPhone 14 | uygulama | 3. Kapora aç-kapa-aç | 0 | 4/4 (12, 12, 11, 12) | evet | ✓ |
| iPhone 14 | uygulama | 4. Telefon adımında klavye yüksekliği değişir (300 → 380 → 336) | 0 | 7/7 (12, 12, 13, 12, 12, 12, 12) | evet | ✓ |
| 390 | web | 1. Tam rezervasyon, kapora kapalı | 0 | 3/3 (12, 12, 12) | evet | ✓ |
| 390 | web | 2. Kapora açık + tutar | 0 | 4/4 (12, 12, 12, 11) | evet | ✓ |
| 390 | web | 3. Kapora aç-kapa-aç | 0 | 4/4 (12, 12, 12, 12) | evet | ✓ |
| 390 | web | 4. Telefon adımında klavye yüksekliği değişir (300 → 380 → 336) | 0 | 7/7 (12, 12, 13, 12, 12, 12, 12) | evet | ✓ |
| 390 | uygulama | 1. Tam rezervasyon, kapora kapalı | 0 | 3/3 (12, 12, 12) | evet | ✓ |
| 390 | uygulama | 2. Kapora açık + tutar | 0 | 4/4 (12, 12, 12, 12) | evet | ✓ |
| 390 | uygulama | 3. Kapora aç-kapa-aç | 0 | 4/4 (12, 12, 12, 11) | evet | ✓ |
| 390 | uygulama | 4. Telefon adımında klavye yüksekliği değişir (300 → 380 → 336) | 0 | 7/7 (12, 12, 13, 12, 12, 12, 12) | evet | ✓ |
| 360 | web | 1. Tam rezervasyon, kapora kapalı | 0 | 3/3 (12, 12, 12) | evet | ✓ |
| 360 | web | 2. Kapora açık + tutar | 0 | 4/4 (12, 12, 12, 11) | evet | ✓ |
| 360 | web | 3. Kapora aç-kapa-aç | 0 | 4/4 (12, 12, 12, 12) | evet | ✓ |
| 360 | web | 4. Telefon adımında klavye yüksekliği değişir (300 → 380 → 336) | 0 | 7/7 (12, 12, 13, 12, 12, 12, 11) | evet | ✓ |
| 360 | uygulama | 1. Tam rezervasyon, kapora kapalı | 0 | 3/3 (12, 11, 12) | evet | ✓ |
| 360 | uygulama | 2. Kapora açık + tutar | 0 | 4/4 (12, 12, 12, 12) | evet | ✓ |
| 360 | uygulama | 3. Kapora aç-kapa-aç | 0 | 4/4 (12, 12, 12, 12) | evet | ✓ |
| 360 | uygulama | 4. Telefon adımında klavye yüksekliği değişir (300 → 380 → 336) | 0 | 7/7 (12, 12, 13, 11, 12, 12, 12) | evet | ✓ |

Genel: hepsi geçti.

## Ayrıntı (iPhone 14; diğer boyutlarda yalnız geçmeyenler)

### iPhone 14, Web (Safari): görünen alan kademeli küçülür: 1. Tam rezervasyon, kapora kapalı

| Alan | Klavyenin üstü | Alanın altı | Mesafe (12 ± 2) |
|---|---|---|---|
| ad soyad (metin) | 328 | 316 | 12 ✓ |
| telefon (tel) | 284 | 272 | 12 ✓ |
| not (metin) | 328 | 316 | 12 ✓ |

Rehber adımları: «Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.» → «Misafirin adını yazın.» → «Kaç kişi gelecek? − ve + ile ayarlayın.» → «Misafirin telefonu (isteğe bağlı).» → «Kapora aldıysanız düğmeyi açın.» → «Not eklemek isterseniz yazın (isteğe bağlı).» → «Rezervasyonu kaydetmek için dokunun.»

Bitiş: Rezervasyon kaydedildi. Konsol: hata yok.

### iPhone 14, Web (Safari): görünen alan kademeli küçülür: 2. Kapora açık + tutar

| Alan | Klavyenin üstü | Alanın altı | Mesafe (12 ± 2) |
|---|---|---|---|
| ad soyad (metin) | 328 | 316 | 12 ✓ |
| telefon (tel) | 284 | 272 | 12 ✓ |
| kapora tutarı (numeric) | 364 | 352 | 12 ✓ |
| not (metin) | 328 | 316 | 12 ✓ |

Rehber adımları: «Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.» → «Misafirin adını yazın.» → «Kaç kişi gelecek? − ve + ile ayarlayın.» → «Misafirin telefonu (isteğe bağlı).» → «Kapora aldıysanız düğmeyi açın.» → «Alınan kapora tutarını yazın.» → «Not eklemek isterseniz yazın (isteğe bağlı).» → «Rezervasyonu kaydetmek için dokunun.»

Bitiş: Rezervasyon kaydedildi. Konsol: hata yok.

### iPhone 14, Web (Safari): görünen alan kademeli küçülür: 3. Kapora aç-kapa-aç

| Alan | Klavyenin üstü | Alanın altı | Mesafe (12 ± 2) |
|---|---|---|---|
| ad soyad (metin) | 328 | 316 | 12 ✓ |
| telefon (tel) | 284 | 272 | 12 ✓ |
| kapora tutarı (numeric) | 364 | 352 | 12 ✓ |
| not (metin) | 328 | 316 | 12 ✓ |

Rehber adımları: «Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.» → «Misafirin adını yazın.» → «Kaç kişi gelecek? − ve + ile ayarlayın.» → «Misafirin telefonu (isteğe bağlı).» → «Kapora aldıysanız düğmeyi açın.» → «aç → Alınan kapora tutarını yazın.» → «Geri → Kapora aldıysanız düğmeyi açın.» → «kapa → Kapora aldıysanız düğmeyi açın.» → «Alınan kapora tutarını yazın.» → «Not eklemek isterseniz yazın (isteğe bağlı).» → «Rezervasyonu kaydetmek için dokunun.»

Bitiş: Rezervasyon kaydedildi. Konsol: hata yok.

### iPhone 14, Web (Safari): görünen alan kademeli küçülür: 4. Telefon adımında klavye yüksekliği değişir (300 → 380 → 336)

| Alan | Klavyenin üstü | Alanın altı | Mesafe (12 ± 2) |
|---|---|---|---|
| ad soyad (metin) | 328 | 316 | 12 ✓ |
| telefon (tel) | 284 | 272 | 12 ✓ |
| telefon (klavye 300) | 364 | 351 | 13 ✓ |
| telefon (klavye 380) | 284 | 272 | 12 ✓ |
| telefon (klavye 336) | 328 | 316 | 12 ✓ |
| kapora tutarı (numeric) | 364 | 352 | 12 ✓ |
| not (metin) | 328 | 316 | 12 ✓ |

Rehber adımları: «Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.» → «Misafirin adını yazın.» → «Kaç kişi gelecek? − ve + ile ayarlayın.» → «Misafirin telefonu (isteğe bağlı).» → «Kapora aldıysanız düğmeyi açın.» → «Alınan kapora tutarını yazın.» → «Not eklemek isterseniz yazın (isteğe bağlı).» → «Rezervasyonu kaydetmek için dokunun.»

Bitiş: Rezervasyon kaydedildi. Konsol: hata yok.

### iPhone 14, Uygulama: keyboardWillShow + görünen alan; telefonda çubuk sonradan (+44): 1. Tam rezervasyon, kapora kapalı

| Alan | Klavyenin üstü | Alanın altı | Mesafe (12 ± 2) |
|---|---|---|---|
| ad soyad (metin) | 328 | 317 | 11 ✓ |
| telefon (tel) | 284 | 273 | 11 ✓ |
| not (metin) | 328 | 316 | 12 ✓ |

Rehber adımları: «Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.» → «Misafirin adını yazın.» → «Kaç kişi gelecek? − ve + ile ayarlayın.» → «Misafirin telefonu (isteğe bağlı).» → «Kapora aldıysanız düğmeyi açın.» → «Not eklemek isterseniz yazın (isteğe bağlı).» → «Rezervasyonu kaydetmek için dokunun.»

Bitiş: Rezervasyon kaydedildi. Konsol: hata yok.

### iPhone 14, Uygulama: keyboardWillShow + görünen alan; telefonda çubuk sonradan (+44): 2. Kapora açık + tutar

| Alan | Klavyenin üstü | Alanın altı | Mesafe (12 ± 2) |
|---|---|---|---|
| ad soyad (metin) | 328 | 316 | 12 ✓ |
| telefon (tel) | 284 | 272 | 12 ✓ |
| kapora tutarı (numeric) | 364 | 352 | 12 ✓ |
| not (metin) | 328 | 316 | 12 ✓ |

Rehber adımları: «Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.» → «Misafirin adını yazın.» → «Kaç kişi gelecek? − ve + ile ayarlayın.» → «Misafirin telefonu (isteğe bağlı).» → «Kapora aldıysanız düğmeyi açın.» → «Alınan kapora tutarını yazın.» → «Not eklemek isterseniz yazın (isteğe bağlı).» → «Rezervasyonu kaydetmek için dokunun.»

Bitiş: Rezervasyon kaydedildi. Konsol: hata yok.

### iPhone 14, Uygulama: keyboardWillShow + görünen alan; telefonda çubuk sonradan (+44): 3. Kapora aç-kapa-aç

| Alan | Klavyenin üstü | Alanın altı | Mesafe (12 ± 2) |
|---|---|---|---|
| ad soyad (metin) | 328 | 316 | 12 ✓ |
| telefon (tel) | 284 | 272 | 12 ✓ |
| kapora tutarı (numeric) | 364 | 353 | 11 ✓ |
| not (metin) | 328 | 316 | 12 ✓ |

Rehber adımları: «Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.» → «Misafirin adını yazın.» → «Kaç kişi gelecek? − ve + ile ayarlayın.» → «Misafirin telefonu (isteğe bağlı).» → «Kapora aldıysanız düğmeyi açın.» → «aç → Alınan kapora tutarını yazın.» → «Geri → Kapora aldıysanız düğmeyi açın.» → «kapa → Kapora aldıysanız düğmeyi açın.» → «Alınan kapora tutarını yazın.» → «Not eklemek isterseniz yazın (isteğe bağlı).» → «Rezervasyonu kaydetmek için dokunun.»

Bitiş: Rezervasyon kaydedildi. Konsol: hata yok.

### iPhone 14, Uygulama: keyboardWillShow + görünen alan; telefonda çubuk sonradan (+44): 4. Telefon adımında klavye yüksekliği değişir (300 → 380 → 336)

| Alan | Klavyenin üstü | Alanın altı | Mesafe (12 ± 2) |
|---|---|---|---|
| ad soyad (metin) | 328 | 316 | 12 ✓ |
| telefon (tel) | 284 | 272 | 12 ✓ |
| telefon (klavye 300) | 364 | 351 | 13 ✓ |
| telefon (klavye 380) | 284 | 272 | 12 ✓ |
| telefon (klavye 336) | 328 | 316 | 12 ✓ |
| kapora tutarı (numeric) | 364 | 352 | 12 ✓ |
| not (metin) | 328 | 316 | 12 ✓ |

Rehber adımları: «Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz.» → «Misafirin adını yazın.» → «Kaç kişi gelecek? − ve + ile ayarlayın.» → «Misafirin telefonu (isteğe bağlı).» → «Kapora aldıysanız düğmeyi açın.» → «Alınan kapora tutarını yazın.» → «Not eklemek isterseniz yazın (isteğe bağlı).» → «Rezervasyonu kaydetmek için dokunun.»

Bitiş: Rezervasyon kaydedildi. Konsol: hata yok.
