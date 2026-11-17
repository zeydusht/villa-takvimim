# Görev 26: test raporu

_Claude Code, 17 Kasım 2026._

| Bölüm | Rapor | Görseller |
|---|---|---|
| A. 26.1 Akıcılık | `performans.md` | — |
| B. 26.2 Bugün işareti | `bugun.md` | `bugun/once`, `bugun/sonra` |
| C. 26.3–26.4 Kademeli giriş, kaydırınca belirme | `kademe.md` | `kademe/` |
| D. 26.5–26.6 Tam denetim ve düzeltmeler | `../../DENETIM.md` | `denetim-once/`, `denetim/`, `duzeltme/` |
| 26.7 Yazı boyutu | `yazi.md` | `yazi/`, `yazi-cokbuyuk/` |
| 26.8 Stil rehberi | `../../STIL.md` | — |

## Onaylı akışlar: her bölümden sonra

Görselleri `regresyon-<bölüm>/` klasörlerinde.

| Test | A | B | C | D | Son (26.7–26.8) |
|---|---|---|---|---|---|
| Görev 25 takvim konumlama (390, 360; normal ve iPhone gibi) | 16/16 | 16/16 | 16/16 | 16/16 | 16/16 |
| Görev 24 klavye | 84/84 | 84/84 | 84/84 | 84/84 | 84/84 |
| Görev 24 ücret kartı satırları | 24/24 | 24/24 | 24/24 | 24/24 | 24/24 |
| Görev 23 rehberli rezervasyon | 6/6 | 6/6* | 6/6* | 6/6 | 6/6 |
| Görev 22 | 21/21 | 21/21 | 21/21 | 21/21 | 21/21 |
| Görev 21 ölçümü (klavye 12 ± 2 / baloncuk 8 ± 2; klavyesiz baloncuk) | 4/4, 13/13, 11/11 | aynı | aynı | aynı | aynı |
| Görev 19 rezervasyon akışı | hatasız | hatasız | hatasız | hatasız | hatasız |
| Görev 19 işlem akışları (teklif, opsiyon, fiyat, paylaş…) | — | — | — | aynı, düzeltilen küçük düğme uyarısı dışında | — |
| Görev 18 tarih seçimi | 38/40 (önceki gibi) | | | | |

\* Bir ya da iki senaryo, altı test aynı anda çalışırken sayfa çizilmeden dokunulduğu için düştü. Tek başına çalıştırınca geçti. Sonrasında testler üçerli çalıştırıldı.

## Denenemeyen

Gerçek iPhone. Gerçek telefonda görülmesi gerekenler:
- akıcılığın kare kare ölçümü;
- iOS'un sistem yazı boyutunu okuma;
- çevrimdışı olayları.
