# Görev 18.22 — kendi bulduğum eksikler

_Claude Code, 17 Kasım 2026 gecesi._

**Nasıl bakıldı:** İlk kez kullanan biri gözüyle şu ekranlar gezildi: Villalarım, villa ekranı, rezervasyon formu ve detayı, ödeme, Fiyatlar (aylar, günler, panel), Teklifler, Gelir & gider, Fotoğraflar, Villa bilgileri, Misafirler, villa sayfası paylaşımı, Takvim, Hesap ve misafir sayfası (g.html).
- Ekranlar Playwright ile 390×844 ve 360×740 boyutlarında çekildi.
- Her ekran otomatik denetimden geçti:
  - yatay taşma (`scrollWidth ≤ innerWidth`),
  - kesilen ya da kutusundan taşan yazı/düğme,
  - üst üste binen dokunulabilir öğe,
  - 48 px'ten küçük dokunma alanı.
- Görüntüler gözle de incelendi.

Görüntüler:
- Bu maddeden önce: `ek-once/`
- Düzeltmelerden sonra: `ek-sonra/`
- Bölümler sırasında bulunup o anda düzeltilenler: `once/` ve `sonra/`

**Son denetim (`ek-sonra`, 2 boyut × 22 ekran):** yatay taşma, kesik yazı ve küçük dokunma alanı **yok**. Kalan iki durum bilerek bırakıldı, aşağıda "Bilerek bırakılanlar"da yazıyor.

## Bu maddede düzeltilenler

| # | Ne vardı | Ne yapıldı | Önce | Sonra |
|---|---|---|---|---|
| 1 | Rezervasyon formunda "Rezervasyonu kaydet" düğmesi rezervasyonun renginde, yani bazen **turuncu** ya da hardal renginde. Renk kuralına (sarı/turuncu yok) aykırı. | Kaydet düğmeleri her zaman ana yeşil. Rezervasyon/villa renk paletindeki turuncu (#A8431E) ve hardal (#B0761A) yerine mürdüm (#8C3A5E) ve arduvaz (#5A6B7A). Eski kayıtlardaki bu iki renk açılışta yenilerine çevriliyor. | `ek-once/rez-form-360.png` | `ek-sonra/rez-form-360.png` |
| 2 | Rezervasyon detayında alınacak tutar iki kez büyük yazıyordu (üstteki "Ödemeyi al" kartında ve aşağıdaki para bölümünde). | Üst kart varsa aşağıdaki büyük tutar satırı gösterilmiyor (döküm kalıyor). | `ek-once/rez-detay-390.png` | `ek-sonra/rez-detay-390.png` |
| 3 | Aynı şeye iki ad: detaydaki yuvarlak "Ödeme gir" ile üstteki "Ödemeyi al". | Yuvarlak düğme **"Ödemeler"** oldu (alınan ödemelerin listesi + yeni ödeme), "Ödemeyi al" akışla karışmıyor. | `ek-once/rez-detay-390.png` | `ek-sonra/rez-detay-390.png` |
| 4 | Villa başlığında "Sıradaki: Hasan Demir · 20 Kasım 16:00 (4 gün sonra)" yazıyordu; hemen altındaki "Sıradaki" kartının aynısı. | Başlıkta bugünün durumu: "Bugün giriş veya çıkış yok." (bugün olay varsa 17.2'deki yazılar). | `ek-once/villa-390.png` | `ek-sonra/villa-390.png` |
| 5 | Rezervasyon formundaki ücret kartında "Değiştir" düğmeleri 40 px. | 48 px. | `ek-once/rez-form-390.png` | `ek-sonra/rez-form-390.png` |
| 6 | Misafir sayfasında dil düğmesi 34×26 px, ay okları 36×36 px. | İkisi de 48 px. | `ek-once/misafir-sayfasi-390.png` | `ek-sonra/misafir-sayfasi-390.png` |

## Bölümler sırasında bulunup düzeltilenler

| # | Ne vardı | Ne yapıldı | Görüntü |
|---|---|---|---|
| 7 | Ay okları ve üst çubuktaki geri düğmesi 44 px. | 48 px. | `sonra/villa-takvim-basligi-*.png` |
| 8 | Hızlı işlem hapları 40 px yüksek. | 48 px. | `sonra/secim-*.png` |
| 9 | Seçiciler (Bugün/7 gün/30 gün, Aylar/Günler, Ay/Yıl/Tümü) 46 px. | 48 px. | `sonra/takvim-*.png` |
| 10 | Ana ekrandaki ipucu kartında "Fotoğraf ekle" 36 px, ✕ 44 px. | 48 px. | `sonra/villalarim-*.png` |
| 11 | Fiyatlar'da ay satırının sağındaki fiyat aralığı "8.000 – 10…" diye kesiliyordu. | Fiyat kesilmiyor; "Geçen yıl" notu gerekirse iki satıra iniyor. | `sonra/fiyatlar-*.png` |
| 12 | Sihirbazın fiyat adımında büyük fiyat kutusunun içinde ikinci bir kenarlık vardı. | Tek kenarlık. | `sonra/sihirbaz-4-*.png` |
| 13 | Takvimde her gün dokunuşunda bütün villa ekranı yeniden çiziliyordu (iki dokunuş ~150 ms). | Dokunuşta yalnız takvim, ipucu satırı ve alttaki panel çiziliyor (20–40 ms). | — |
| 14 | "İsimsiz teklif", "İsimsiz" (opsiyon), "İsimsiz villa". | "Teklif · tarih", "Opsiyon", "Villa" (18.8). | `sonra/teklifler-*.png` |
| 15 | Hesap'ta "Bize ulaşın" yalnız destek numarası girildiyse görünüyordu. | Her zaman görünüyor; numara yoksa kısa açıklama ve "Sık sorulan sorular" düğmesi (18.21). | `sonra/hesap-*.png` |

## Bilerek bırakılanlar
- **Fiyatlar → Günler takvimi:** 7 sütunlu ızgarada 360 px ekranda bir gün hücresi 42 px genişlikte (yükseklik 60 px). Ekran genişliği 7 gün için yetmiyor. Villa takvimiyle aynı durum; dokunulan hücre seçili görünür ve geri alınabilir.
- **Rezervasyon formunun altındaki sabit "Rezervasyonu kaydet" düğmesi:** sayfa kaydırılırken alanların üstünde durur. Bilerek böyle; en alta inildiğinde hiçbir alanı örtmüyor (`ek-sonra/rez-form-alt-*.png`).
- **"Bize ulaşın":** destek WhatsApp numarası (`DESTEK_WHATSAPP`) henüz girilmedi. Girilince düğme doğrudan WhatsApp'ı açar.
