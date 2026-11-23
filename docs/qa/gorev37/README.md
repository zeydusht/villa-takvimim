# Görev 37: başlıkta önce görsel, etiket hizası, boş ekranda tek büyük görsel — test raporu

_Claude Code, 23 Kasım 2026._ Veritabanı değişmedi, deploy edilmedi, Netlify'a yüklenmedi. 36.7 yapılmamıştı. Onun 2. maddesi
("görsel alttaki öğeye değmesin") 37.1'de yapıldı, 1. maddesinin yerine 37.2 geçti.

## Ne değişti

| Adım | Değişiklik |
|---|---|
| 37.1 | Villalarım / Takvim / Hesap: `[görsel] Başlık`. Görsel sola yaslı; yazıyla arası 10 pt, dikey ortalı; boyutlar 88 / 64 pt. Başlık satırı itilmiyor. Görselin dolu (şeffaf olmayan) kısmı ile alttaki öğe arası en az 8 pt (`--alt`: görselin alttaki şeffaf payı, başlığın alt boşluğu buna göre). Yazı hiç bölünmüyor: yer yoksa görsel önce küçülüyor (en az 48 pt), sonra gizleniyor. Bölüm başlıklarına ve misafir sayfasına dokunulmadı. |
| 37.2 | Dolu / boş etiketleri "+ Villa ekle" ile aynı satırın sağ ucunda, dikey ortalı. Sığmazsa alt satırda, sola yaslı (sol kenar "Villa ekle" ile aynı). |
| 37.3 | Ekranda büyük boş hâl görseli varken başlık görseli gizleniyor; ilk villa gelince geri geliyor. Geçiş `--hiz-ac`, genişlik ve saydamlıkla; yazı yumuşakça kayıyor. Boş hâl: görsel 192 pt, altında 16 pt, kalın başlık, açıklama, düğme, hepsi ortalı. Kısa ekranda (yükseklik 640 pt altı) 144 pt. Sihirbazın çizimi ayrı değişkende (`--g3d-sihirbaz` 160 pt), değişmedi. |

Testte bulunup düzeltilen hata: Villalarım başlığı içerik kadar genişliyordu (`.anaBas h1{flex:none}`). Bu yüzden uzun yazıda
görsel küçülmüyor, başlık ekrandan taşıyordu. Artık başlık satır genişliğinde kalıyor.

Karar verdiğim bir nokta: 760 pt'den kısa ekranlarda boş hâl görseli büyük yazıda da küçülüyor (en az 112 pt; 640 pt altında
en az 96 pt). Böylece "Villa ekle" ilk ekranda kalıyor. Görevde bu yalnız kısa ekran için isteniyordu.

## 37.4 Test

Matris: Villalarım (dolu / boş), Takvim, Hesap × 320 / 390 / 430 pt × açık / gece (`colorScheme: 'dark'`) × normal / büyük yazı.

Ekran görüntüleri: `<ekran>-<genişlik>-<açık|gece>-<normal|buyuk>.jpg`, 48 adet; ayrıca `villalarim-bos-320x568.png`.

Her ekranda kontrol edilenler:

- **36.5 denetimi:**
  - görsellerin arkasında zemin, daire, kenarlık, gölge yok;
  - köşe ve kenar ortası pikselleri zeminle aynı.
- **Sıra:**
  - görselin sağ kenarı yazının sol kenarından küçük;
  - görsel sola yaslı, ara 8–12 pt, dikey merkez farkı ≤ 1 pt;
  - yazı tek satır, boy 88 pt (320 ve büyük yazıda 64 / 71 pt).
- **Etiketler:** aynı satırdaysa sağ uçta, değilse sola yaslı ve sol kenarı "Villa ekle" ile aynı. Hiçbir genişlikte sağda tek başına durmuyorlar.
- **36.7:**
  - her görünür 3D görselin dolu kısmının kutusu (`alfa36.json`), hemen altındaki görünür öğeye en az 8 pt uzak;
  - bu, bölüm görsellerini de kapsar.
- **Boş Villalarım:**
  - görünür 3D görsel sayısı 1;
  - "Villa ekle" ilk ekranda.

| Test | Sonuç |
|---|---|
| Matris, 12 durum × 4 ekran | 174 kontrol geçti: 48 görsel, 276 piksel noktası; sayfa hatası 0 |
| 320 × 568, boş Villalarım | görsel 144 pt, "Villa ekle" ilk ekranda |
| İlk villa gelince başlık görseli | 0 → 98 pt ve saydamlık 0 → 1, ara değerlerden geçerek (yumuşak) |
| Uzun başlık, 320, Çok büyük | "Villalarımız": görsel 57 pt, yazı tek satır. Daha uzun yazı: görsel gizli, yazı tek satır |
| Kaydırma (390 / 320) | görsel solarken yazı yatayda kaymıyor; yarısı çubuğa girince görünmüyor; başlık üst çubuğa geçiyor |

Etiketlerin yeri:

- 390 ve 430'da normal yazıda "Villa ekle" ile aynı satırda.
- 320'de ve büyük yazıda alt satırda, sola yaslı.

Sınır durumlar (ölçüm; düğme ilk ekranda değil):

| Ekran | Boş hâl görseli | Düğmenin menüye göre yeri |
|---|---|---|
| 320 × 568, Büyük | 96 pt | 23 pt aşağıda |
| 320 × 640, Çok büyük | 112 pt | 75 pt aşağıda |
| 320 × 568, Çok büyük | 96 pt | 109 pt aşağıda |

Bu durumlarda yazının kendisi (başlık, açıklama, düğme) ekrana sığmıyor. Kaydırınca görünüyor.

## Mevcut testler

| Test | Sonuç |
|---|---|
| Görev 36 matrisi (uygulama, 12 durum; boş hâller artık 192 pt) | hepsi geçti. Başlık hiza ölçümü bu kopyada yok: yeni sırayı qa37 ölçüyor |
| Görev 33 (33.1–33.8) | hepsi geçti |
| Görev 31f (iskelet) | iskelet ile dolu kart yine aynı yerde, zıplama yok. Kartlar Görev 36'ya göre 69 pt yukarıda: etiketler artık "Villa ekle" satırında |
| Görev 31 turu (SE / iPhone 15 × 3 yazı boyutu × hareketi azalt) | 12 durumda taşma, hata, konsol 0; hareketi azaltta kayan öğe 0 |
| Görev 28 (60/60, Çok büyük 60/60) | Görev 36 ile fark yok |
| Görev 28.1 yerleşim (`qa28a`) | taşma yok. Eski beklenti ("Villa ekle" etiketlerin altında) 37.2 ile bilerek değişti |

Test dosyaları (scratchpad): `qa37.js` (yeni), `qa36ortak.js`, `qa36r.js` (36 matrisi, yeni başlık sırasıyla).
