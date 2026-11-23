# Görev 34.10: videolar, 24 fps kareler, kaydırma ölçümü

_Claude Code, 23 Kasım 2026._ 34.1–34.9'u ürün yöneticisi yaptı; burada yalnız 34.10 var. Edge Function deploy edilmedi,
Netlify'a yüklenmedi.

## Videolar (`video/`)

iPhone SE (375 × 667) ve iPhone 15 (393 × 852) × normal / "Hareketi azalt" × normal hız / `?yavas=3`. Dokunuşlar gerçek dokunma
olayıyla. Dosya adı: `<cihaz>-<normal|azalt>-<sahne>[-yavas3].webm` (40 video).

| Sahne | Ne görünür |
|---|---|
| `01-arama-acilis-kapanis` | Takvim → "Hangi villam boş?" kartı panele büyür; "✕ Kapat" ile karta küçülerek döner |
| `02-adim-degisimi` | 17 ve 21 Kasım seçilir → "Ne zaman" tek satıra küçülür, "Kaç kişi?" açılır; kişi +2; özete dokununca tarih yeniden açılır |
| `03-buyuk-baslik` | Villalarım'da aşağı kaydırınca büyük başlık solup kayar, üst çubukta küçük "Villalarım" ve ayraç; yukarı dönünce tersi |
| `04-kart-yigini` | Villa → tarih seç → Rezervasyon: arkadaki sayfa %94'e küçülür, köşeleri yuvarlanır; kapatınca geri gelir |
| `05-sekme-cubugu` | Takvim → Hesap → Villalar: seçilen sekmenin ikonu dolu ve ana renkte, dokununca .85'ten 1'e yaylı |

Bütün videolarda sayfa hatası ve konsol hatası yok. "Hareketi azalt" videolarında hareket yok, yalnız saydamlık.

## Arama açılışı, 24 fps (`kareler/`)

Dokunuştan hemen sonra sayfadaki bütün animasyonlar durdurulup 41,67 ms adımlarla ileri sarıldı (her kare tam o anı gösterir).
Şerit: `kareler/serit-se.jpg`, `kareler/serit-iphone15.jpg`; tek tek kareler `kareler/<cihaz>/`.

| ms | 0 | 42 | 83 | 125 | 167 | 208 | 250 | 333 |
|---|---|---|---|---|---|---|---|---|
| Kartın üstten kesme payı (px) | 194 | 135 | 56 | 24 | 13 | 7 | 3 | 0 |
| Başlığın saydamlığı | 0 | 0 | 0,39 | 0,80 | 0,94 | 0,99 | 1 | 1 |
| Arka planın kararması (0–0,4) | 0 | 0,25 | 0,35 | 0,39 | 0,40 | 0,40 | 0,40 | 0,40 |

Airbnb karelerindeki mantıkla aynı: önce kart tetikleyicinin yerinden büyür (ilk karede kartın beyaz dikdörtgeni tam
tetikleyicinin üstünde), içerik kart büyük ölçüde açıldıktan sonra solarak gelir, arka plan aynı anda kararır. SE ve iPhone 15
sayıları aynı.

Fark (düzeltilmedi, ürün yöneticisine): arka plan **bulanıklığı** ilk karede tam (12 px) geliyor; görevde 300 ms'de gelmesi
isteniyordu. Kararma ise ~200 ms'de tamamlanıyor.

## Kaydırma

Villalarım'da (8 villa) tekerle aşağı ve yukarı kaydırırken her karenin süresi (`requestAnimationFrame` aralıkları):

| Cihaz | Kare | Ortalama | %95 | 25 ms'yi aşan |
|---|---|---|---|---|
| iPhone SE | 169 | 16,8 ms | 17,3 ms | 1 (33 ms) |
| iPhone 15 | 165 | 16,8 ms | 17,4 ms | 1 (34 ms) |

60 fps'te kalıyor; her ölçümde tek bir uzun kare var (masaüstü Chrome'da başsız ölçüm, gerçek telefonda bakılmalı).

## Testin bulduğu ve düzeltilen

- 34.5: sekmeye dokununca zıplama animasyonu eski ikona uygulanıyordu; sekme değişince ikon dolu olanla değiştirildiği için
  zıplama hiç görünmüyordu. Artık sekme değiştikten sonra yeni ikona uygulanıyor (300 ms, yaylı).

## Mevcut testler

Görev 19–33 testleri son kodla geçti (`docs/qa/gorev33/README.md`).

## Denenemeyen

- Gerçek iPhone'da (WKWebView) bulanıklığın akıcılığı ve kaydırmanın 60 fps'i.
