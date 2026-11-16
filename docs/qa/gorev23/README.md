# Görev 23: test raporu

_Claude Code, 16 Kasım 2026._

- **Sebep:** `sebep.md`. Hatalar düzeltmeden önce yeniden üretildi; ilk görseller `yeniden-uretim/` klasöründe.
- **23.3 test sonuçları:** `test.md`. 4 senaryo × 2 klavye modeli × 3 ekran boyutu. Görseller `senaryo/` klasöründe (iPhone 14). Gri şerit klavyenin yeridir; sahte klavye ekrana çizilmediği için görselde böyle gösterildi.
- **Betikler:** `qa23.js` (tek senaryo), `qa23tum.js` (hepsi), `qa23ortak.js` (klavye modeli).

## Klavye modeli

Görev 21'deki testlerde klavye tek seferde ve her alanda aynı boyda açılıyordu; hatayı bu gizledi. Bu kez:

| Alan | Klavye |
|---|---|
| Ad soyad, Not (metin) | 336 |
| Telefon (`inputmode="tel"`) | web: 380 (tuş takımı + "Otomatik doldur"). Uygulama: 336, 400 ms sonra +44 çubuk |
| Kapora tutarı (`inputmode="numeric"`) | 300 |

Klavye 250 ms'de kademeli açılıp kapanıyor; her karede resize olayı geliyor. Uygulama modelinde önce `keyboardWillShow` yüksekliği bildiriliyor. 4. senaryoda telefon alanı açıkken klavye 300 → 380 → 336 oluyor.

## Görev 19, 20, 21 ve 18 testleri yeni kodla (regresyon)

Görseller `regresyon/` klasöründe.

**Görev 21 ölçümleri** birebir aynı çıktı. Ayrıntı: `regresyon/g21-olcum.md`.

| Boyut | Klavye 12 ± 2 | Baloncuk 8 ± 2 | Pencere ± 1 | Üst %20 |
|---|---|---|---|---|
| iPhone 14 / 390 / 360, klavyeli tur | 4/4 | 13/13 | 1/1 | 12/12 |
| iPhone 14 / 390 / 360, klavyesiz tur | — | 11/11 | 6/6 | 10/10 |

Elle kaydırma (21.5): her karede pencere ile hedef arası sabit 4 px. "İleri"den sonra hedef yine hatta.

**Görev 19 akışları** iki boyutta sonuna kadar gitti:
- rezervasyon, teklif, opsiyon, fiyat, paylaş;
- ödemeyi al ve yerleştir, alınan ödemeyi gir, gider, bakıcı;
- Drive (sahte sunucu fotoğraf döndürmediği için "Fotoğrafları bul"da duruyor, önceki gibi);
- sihirbaz ipucu, uygulama turu, "Nasıl yapılır?";
- villa ve fotoğraf sürükleme.

Hiçbirinde sayfa ya da konsol hatası yok.

**Rezervasyon testi güncellendi:** kapora düğmesi açılınca artık (b) adımı geliyor ve tutar yazılmadan "Tamam" çıkmıyor. Test tutarı yazıp devam ediyor.

**Görev 19B ve 20 testleri:** çerçeve geçişi, kaydırma, klavye, perde, "Tamam", tarih paneli, misafir sayfası ve çapraz düğmeler aynı sonuçları verdi.

Tek fark bilerek yapıldı: Görev 20.3'ün "Yardımı kapat modu kapatır" testinde mod artık açık kalıyor ve bildirim çıkmıyor (Görev 22).

**Görev 18 tarih seçimi:** 38/40, önceki gibi. Kalan 2 sonuç Görev 20.5'te değişen panel yazısı.

**Sayfa denetimi** her adımda "üst üste" uyarısı veriyor: baloncuk, karartılmış alandaki düğmelerin üstünde duruyor. Görev 21'den beri böyle tasarlandı; karartılmış öğelere dokunulamıyor.

## Denenemeyen

Gerçek iPhone. iOS'un klavye açılırken gönderdiği resize olaylarının gerçek sırası ve sayısı, telefon alanındaki "Otomatik doldur" çubuğunun ne zaman geldiği cihazda görülmeli.
