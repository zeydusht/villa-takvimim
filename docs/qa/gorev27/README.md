# Görev 27: test raporu

_Claude Code, 17 Kasım 2026._

Ortam: Playwright, sabit saat 16 Kasım 2026 10:00. Ekran boyutları: 360×740, 390×844, 430×932; rehber testinde ayrıca 390×664 (küçük iPhone). Hepsi hem Normal hem "Çok büyük" yazıyla denendi.

## Sahte veri (5 villa, arama 17–21 Kasım, 4 gece)

| Villa | Durum | Beklenen |
|---|---|---|
| Villa Salta | 8 kişi · 4 oda, gece 4.100 ₺, 4 gece ve altı +2.000 ₺, depozito 5.000 ₺, sayfa yayında; 21'inde giriş var | Boş, 18.400 ₺, "kısa konaklama dahil" |
| Villa Defne | 6 kişi, gece 3.800 ₺, depozito 4.000 ₺, sayfa yok; 17'sinde çıkış var | Boş, 15.200 ₺; mesajda "(sayfa yok)" |
| Villa Zeytin | 4 kişi, 19 ve 20 Kasım gecelerinin fiyatı yok | Boş, "Fiyat eksik · 2 gecenin fiyatı girilmemiş" + "Fiyat gir" |
| Villa Lavanta | 10 kişi, 5.000 ₺; Kasım–Aralık döneminde en az 5 gece | Boş, 20.000 ₺, soluk + "Bu dönemde en az 5 gece" |
| Villa Mimoza Deniz Manzaralı | 19–23 rezervasyon | Kısmen boş: "17–19 boş, 19'dan itibaren dolu" |

## Sonuç: 86/86 kontrol geçti

Özet: `ozet27.txt` mantığı (betikler scratchpad'de: `qa27b…h.js`, `veri27.js`, `ozet27.js`).

| Madde | Kontrol | Sonuç |
|---|---|---|
| 27.1 | Kart Takvim sekmesinde, giriş/çıkış listesinin üstünde; tek villada küçük | ✓ |
| 27.2 | Bu hafta sonu 20→22, Gelecek hafta sonu 27→29, 7 gece 17→24; 18.1 kuralı (aralık seçiliyken dokunmak kaldırır, geriye dokunmak yeni giriş); kişi − +; düğme ancak aralık seçilince etkin; alttaki sabit satır | ✓ (3 boyut × 2 yazı boyutu) |
| 27.3 | Sınıflandırma (boş / kısmen / eksik fiyat / kural engeli) | ✓ |
| 27.3 | Toplamlar, uygulamanın kullandığı aynı `fiyat.js` (20.7) fonksiyonuyla sahte veriden ayrıca hesaplanıp karşılaştırıldı: 18.400 / 15.200 / eksik / 20.000 | ✓ birebir |
| 27.3 | Kişi filtresi (7 kişi): yalnız Salta ve Lavanta; "kapasitesi yetmeyen 3 villa gösterilmedi" | ✓ |
| 27.3 | Fiyat (artan) sırası: Defne, Salta, Lavanta, Zeytin (eksik en sonda) | ✓ |
| 27.3 | Boş durum (25–27 Kasım, 9 kişi): çizim + "En yakın boşluk: Villa Lavanta · 28–30 Kasım"; dokununca o tarihlerle arar | ✓ |
| 27.3 | Rezervasyon / Teklif / Opsiyon o villa ve tarihlerle açılıyor; form kapanınca sonuç listesine dönülüyor; kısmen boş satırı villanın takvimini o ayda açıyor | ✓ |
| 27.3 | Kısmen boş yazıları: "19'dan itibaren opsiyonlu", "21'e kadar opsiyonlu, 21–25 boş", "23'e kadar dolu", "24'ten itibaren dolu", "20–21 ve 24–25 boş", ay geçişi "29 Kasım–1 Aralık boş, 1 Aralık'tan itibaren dolu" | ✓ |
| 27.3 | En az konaklama ayarı: boş/ters tarih uyarısı, dönem ekleme, sil + Geri al, kaydedince sunucuya `bilgi.enAzDonem` ve `bilgi.enAz` gidiyor; genel kural "En az 6 gece" | ✓ |
| 27.4 | WhatsApp mesajı GOREV27'deki örnekle birebir; seçim değişince güncelleniyor; elle düzenlenen metin WhatsApp'a aynen gidiyor; Kopyala; hiç seçim yokken düğmeler pasif | ✓ |
| 27.4 | g.html `?giris=2026-11-17&cikis=2026-11-21`: 17–21 seçili, 18.400 ₺ (uygulamayla aynı); dolu tarihte gri "Bu tarihler artık dolu" şeridi; bozuk bağlantı yok sayılıyor | ✓ (3 boyut) |
| 27.5 | Villalarım başlığında büyüteç (48 pt, büyük yazıda büyür); bakıcıda hiç ₺ yok, sıralama ve "Seç ve gönder" yok, yalnız Rezervasyon | ✓ |
| 27.6 | Rehber 4 adım (gerçek dokunuşlarla), baloncuk her adımda ekranda; Geri seçimi kaldırıyor; "?" sonuç ekranında son adımı açıyor; sonuçtan Rezervasyon rehberli açılıyor | ✓ (4 boyut × 2 yazı boyutu) |
| İngilizce | Başlık, döküm, kural, kısmen boş yazıları ve mesaj İngilizce | ✓ |

Konsol / sayfa hatası: hiçbir testte yok.

## Testte bulunup düzeltilenler

- Tam ekran panel uzun listede ekran boyunda kalıyordu (alt kısım gri zemine taşıyordu).
- Dar ekranda villa adı fiyat dökümü yüzünden sıkışıyordu: döküm toplamın altına, tam genişliğe alındı.
- Büyük yazı + küçük ekranda takvim alttaki sabit satırın altında kalıyordu. Üç düzeltme yapıldı:
  - kısa ekranda kişi sayısı takvimin altına iniyor;
  - arama takvimi hücreleri 3rem;
  - rehberin tarih adımlarında sabit satır gizli.
- Rehberin geçici üst boşluğu tam ekran paneli kısaltıyor, takvim ekran dışına kayıyordu (430'ta). Panel yüksekliği ekrana (100dvh) bağlandı.
- Son rehber cümlesi 3 satırdı. Stil rehberindeki 2 satır sınırı için "Boş villalar ve toplam fiyatları burada. Göndermek için ‘Seç ve gönder’." oldu. "Çok büyük" yazıda 3 satır; bu yazı boyutunda kaçınılmaz.

## Onaylı akışlar (regresyon)

Görselleri `regresyon/` klasöründe. Regresyon 27.6 koduyla çalıştı; sonraki değişiklikler yalnız arama panelinin kendi stillerinde (`.ma*`).

| Test | Sonuç |
|---|---|
| Görev 25 takvim konumlama | 16/16 |
| Görev 24 klavye · ücret kartı | 84/84 · 24/24 |
| Görev 23 rehberli rezervasyon | 6/6 |
| Görev 22 | 21/21 |
| Görev 21 (klavye / baloncuk; klavyesiz) | 4/4, 13/13; 11/11 |
| Görev 19 rezervasyon akışı | hatasız, kayıt var |

## Bilinen ve bilerek bırakılan

- Denetim betiği, panel içindeki yapışkan alt çubuğun (Kaydet, Boş villaları göster, WhatsApp'ta gönder) kaydırırken içeriğin üstünden geçmesini "üst üste" diye yazıyor. Bu tasarım gereği; rezervasyon formunda da aynı.
- Villalarım'da büyüteç eklenince "1 dolu · 4 boş" etiketleri 360 ve 390'da ikinci satıra iniyor (düzgün, ama ekran biraz uzadı).

## Denenemeyen

- Gerçek iPhone: tam ekran panel ve WhatsApp'ın açılması.
- Villa sayfası bağlantılarının tarihleri seçili açması, g.html Netlify'a yüklenince çalışır. Şu an GitHub Pages'teki kopyada çalışıyor.
