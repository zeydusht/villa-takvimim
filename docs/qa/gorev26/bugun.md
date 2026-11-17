# Görev 26.2: "Bugün" her zeminde belli

_Claude Code, 17 Kasım 2026._

## Ne değişti

- **Eski:** gün numarasının çevresinde koyu yeşil dolu daire. Koyu yeşil, mavi ya da mor rezervasyon bloğunun üstünde kayboluyordu.
- **Yeni:** hücrenin içinde içi boş, yuvarlak köşeli çerçeve.
  - Kalınlık 2,5 pt, renk mercan kırmızısı `#E5484D` (`--bugun`). Bu renk yalnız "bugün" için.
  - Para / ödenmedi rengi şarap kırmızısı `#9B2C4A` ayrı kaldı.
- **Çerçevenin iki yanında 1 pt beyaz kontur var.** Dolu blokta, yarım günde ve seçili aralıkta da ayrışıyor.
  - Çerçeve kenarlık yerine gölgeyle çiziliyor; Chrome 2,5 pt kenarlığı 2 pt'ye yuvarlıyordu.
- **Gün numarası olduğu gibi:** dolu blokta beyaz, boş günde koyu.
- **Aynı işaret üç takvimde var:**
  - villa takvimi;
  - fiyat takviminin "Günler" görünümü (eskiden altı çizili yeşil sayıydı);
  - misafir sayfası (g.html). Misafir sayfasında bugün hiç işaretli değildi.
- **Takvim açıklamaları:**
  - Uygulamadaki "Bugün" örneği yeni çerçeveyle çiziliyor.
  - Misafir sayfasının açıklamasına "Bugün" eklendi (İngilizcesi "Today").

## Test

Playwright, 360×740, 390×844, 430×932. Bugün = 16 Kasım 2026 (misafir sayfasında gerçek tarih).

| Durum | 390 | 360 | 430 |
|---|---|---|---|
| 1. Boş gün | ✓ | ✓ | ✓ |
| 2. Yeşil blok ortası (#0B5B57) | ✓ | ✓ | ✓ |
| 3. Mavi blok ortası (#3C4E8C) | ✓ | ✓ | ✓ |
| 4. Mor blok ortası (#7A4B8C) | ✓ | ✓ | ✓ |
| 5. Pembe blok ortası (#8C3A5E) | ✓ | ✓ | ✓ |
| 6. Giriş yarım günü | ✓ | ✓ | ✓ |
| 7. Çıkış yarım günü | ✓ | ✓ | ✓ |
| 8. Seçili aralığın içinde | ✓ | ✓ | ✓ |
| Fiyat takvimi (Günler) | ✓ | ✓ | ✓ |
| Misafir sayfası | ✓ | ✓ | ✓ |

✓ = çerçeve mercan kırmızısı 2,5 pt, dışında beyaz kontur, konsol hatası yok.

Görseller:
- `bugun/once/`: eski hâl, 390, durum 1–8.
- `bugun/sonra/`: yeni hâl, üç boyut. Durum 1–8, `9-lejant`, `10-fiyat-takvimi`, `11-misafir-sayfasi`.

## Onaylı akışlar (regresyon, bu bölümden sonra)

| Test | Sonuç |
|---|---|
| Görev 25 takvim konumlama | 16/16 |
| Görev 24 klavye / ücret kartı | 84/84, 24/24 |
| Görev 23 rehberli rezervasyon | 6/6 (iki senaryo, altı test aynı anda çalışırken zamanlama yüzünden düştü; tek başına çalıştırınca geçti) |
| Görev 22 | 21/21 |
| Görev 21 ölçümü | 4/4, 13/13 (klavyesiz 11/11) |
| Görev 19 rezervasyon akışı | hatasız, kayıt var |
