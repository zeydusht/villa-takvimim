# Görev 22: test raporu

_Claude Code, 16 Kasım 2026._

Testler Playwright'ta yapıldı:
- sahte sunucu kullanıldı;
- saat 16 Kasım 2026 10:00 olarak sabitlendi;
- ekran boyutları 390×844 ve 360×740 idi;
- dokunuşlar gerçek dokunma olayıyla verildi;
- klavye sahte `visualViewport` ile taklit edildi.

Betikler `qa22.js` (22.5) ve `qa22diger.js` (diğer paneller). Görseller `kapat/`, `soru/`, `hesap/` ve `diger/` klasörlerinde.

## 22.5 senaryoları

"2. adım" formun içindeki ikinci adım olarak alındı: 1. adım ücret kartı, 2. adım "Misafirin adını yazın".

| Kontrol | 390 | 360 |
|---|---|---|
| Baloncukta sağ üstte ✕ ve "Kapat" (dokunma alanı ≥ 44) | ✓ | ✓ |
| ✕ ile kapatınca rehber kapandı, form açık kaldı | ✓ | ✓ |
| Yardımlı mod değişmedi (`{"acik":true}`) | ✓ | ✓ |
| Bildirim çıkmadı | ✓ | ✓ |
| 200 ms solarak kayboldu (`transition-duration: 0.2s`) | ✓ | ✓ |
| Form kullanılabilir: ada yazılabildi | ✓ | ✓ |
| Panel başlığının yanında "?" görünüyor (48 × 48) | ✓ | ✓ |
| Formu kapatıp "+ Rezervasyon"a basınca rehber 1. adımdan ("Misafirin gireceği güne dokunun.") | ✓ | ✓ |
| Telefon adımında ✕ → "?" → rehber yine telefon adımında | ✓ | ✓ |
| Rehber açıkken "?" görünmüyor (yeri duruyor, başlık kaymıyor) | ✓ | ✓ |
| "?" ile sürdürülen rehber sonuna kadar gitti, rezervasyon kaydedildi | ✓ | ✓ |
| Hesap → Yardımlı mod kapandı; açıklama "Açıkken her işlemde adım adım yardım gösterilir." | ✓ | ✓ |
| Mod kapalıyken "+ Rezervasyon"da rehber yok, form rehbersiz açıldı, "?" görünüyor | ✓ | ✓ |
| Mod kapalıyken "?" rehberi tek seferlik açtı; kalınan adım bilinmediği için ilk boş alandan (ad soyad) | ✓ | ✓ |
| "?" tercihi değiştirmedi; sonraki işlemde yine rehber yok | ✓ | ✓ |
| 22.4: eski sürümden kalan `{"acik":false,"kapali":{…}}` → bir kez `{"acik":true,"s":22}`, rehber geliyor | ✓ | ✓ |
| 22.4: geçiş bir kez yapılıyor; sonradan Hesap'tan kapatılan mod kapalı kalıyor | ✓ | ✓ |
| Konsol hatası | 0 | 0 |

## "?" diğer panellerde (Yardımlı mod kapalı)

| Panel | "?" var mı | Basınca rehber nereden başladı (ilk boş alan) |
|---|---|---|
| Özel teklif | var | "Misafirin adı (isteğe bağlı)." |
| Opsiyon koy | var | "Misafirin adını yazın." |
| Fiyat (ay paneli) | var | "Hafta içi gecelik fiyatı yazın." |
| Gider ekle | var | "Tutarı yazın." |

Ödeme, bakıcı, fotoğraf ve paylaşım panellerine de aynı yoldan (`rehberAc`) "?" ekleniyor. Bunlar ayrı ayrı ekran görüntüsüyle denenmedi.

Testte bulunan bir sorun: fiyat panelinin başlığı bir kutunun içinde olduğu için "?" ilk denemede eklenmedi. Seçici düzeltildi.

## Bilinmesi gerekenler

- **Kalınan adım:** ✕'e basıldığı paneldeki adımdır. Panel kapanınca bu bilgi de gider. Yeni açılan panelde "?" ilk boş alandan başlar.
- **"İlk boş alan":** yazı alanı olmayan adımları atlar (ücret kartı, gider türü gibi). Bu adımlar yalnız rehberin kendi başından ("+ Rezervasyon", "Gider ekle") ya da "Geri" ile görülür.
