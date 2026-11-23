# Görev 36: 3D görsel cilası (daire, boyut, hiza) — test raporu

_Claude Code, 23 Kasım 2026._ Veritabanı değişmedi, Edge Function deploy edilmedi, Netlify'a yüklenmedi.

## Ne değişti

| Adım | Değişiklik |
|---|---|
| 36.1 | Misafir sayfasında görselin arkasındaki daire (`prefers-color-scheme: dark` kuralı) silindi. `.g3d` 80 pt. Takvim başlığının satırı görselsiz başlıkla aynı (25 pt); görsel üstüne ve altına taşar. g.html zaten `background:#fff !important` ve `color-scheme: light only`. |
| 36.2 | Uygulamada ve misafir sayfasında bütün 3D görsel sınıflarına kilit kuralı eklendi: hiçbir hâlde zemin, daire, kenarlık, gölge, filtre yok. İstisna: görsel yüklenemeyince çıkan ikonlu yedek hâl (`.bosGorsel.yok`, `.secKartGorsel.yok`). Kodda `drop-shadow` yoktu. |
| 36.3 | Boyutlar `:root`'ta: `--g3d-baslik` 88, `--g3d-baslik-kucuk` 64, `--g3d-bolum` 56, `--g3d-kart` 64, `--g3d-bos` 160, g.html'de `--g3d-misafir` 80. Başlık görsellerinin `-512.webp`'si `-256` ile aynı kırpımda yeniden üretildi; `srcset` ile 3x ekranda 512 seçilir (390 pt, 3x → `baslik-villalar-512.webp`; 2x → 256). |
| 36.4 | Görseller satıra yazı satırından fazla yükseklik katmıyor (negatif margin). Altında hemen düğme ya da kart olan yerlerde görsel 4 pt (başlık) / 10 pt (bölüm satırı) yukarıda. Yer daralınca önce görsel küçülüyor, yazı bölünmüyor; 36 pt'nin altında görünmüyor. Villalarım'da dolu / boş etiketleri hep alt satırda, görselin altında. Kaydırınca başlık görseli üst çubuğa girdikçe söner, yarısı girince görünmez. |

Önceki hâlde bulunan sorunlar (36.4'ten önce ölçüldü): 88 pt başlık görseli başlık satırını 15,75 pt itiyordu; bölüm görseli
390 pt'de "Misafirler"i "Misafirl / er" diye bölüyordu; 320 pt'de "Yaklaşan rezervasyonlar" iki satıra iniyordu.

## 36.5 Test

Matris: 320 / 390 / 430 pt × açık / `colorScheme: 'dark'` × normal / büyük yazı. Uygulamada büyük yazı uygulamanın kendi
ayarı ("Büyük"), misafir sayfasında kök yazı 20 px.

Ekran görüntüleri:

- `uygulama/<ekran>-<genişlik>-<açık|gece>-<normal|buyuk>.jpg`, 228 adet:
  - Villalarım dolu ve boş, Takvim, Hesap;
  - arama adımları 1–3;
  - bölüm görselleri (Yaklaşan rezervasyonlar, Misafirler, Gelir & gider);
  - seçim kartları (normal, üzerine gelince, basılıyken, seçili);
  - boş hâller (rezervasyon, Misafirler, Gelir & gider);
  - sihirbaz adım 1 ve 2.
- `misafir/`, 48 adet: takvim başlığı, sayfa sonu iletişim, "Kaç kişi geliyorsunuz?" kutusu, teklif şeridi.

### Otomatik kontrol: arkada renk / daire yok

- **Stil:** görselde ve sarmalayıcısında zemin rengi, zemin görseli, kenarlık, gölge, filtre ve outline yok.
- **Piksel:**
  - Görselin dört köşesinden ve dört kenar ortasından 4 pt içerideki piksel, görselin hemen dışındaki pikselle ya da arkadaki öğenin zemin rengiyle aynı olmalı (±6).
  - Kenar ortaları eklendi, çünkü bir dairede köşeler dairenin dışında kalır: yalnız köşeye bakan test 35'teki daireyi yakalamazdı.
  - Nokta yalnız görselin kendisi orada şeffafsa sayılır (webp'lerin alfa ızgarası `alfa36.json`).
  - Üstünde başka bir öğe varsa (üst çubuk) nokta sayılmaz.
- **Ters deneme:** 35'teki kural (`--soft` zemin + daire) geri konunca test kırmızı oldu. Stil hatası çıktı, ayrıca "üst orta" ve "alt orta" piksel 241,245,243 ≠ dış.

| Test | Sonuç |
|---|---|
| Uygulama, 12 durum | 274 görsel, 1198 nokta, hata 0; sayfa hatası 0; taşma / üst üste kaydı 0 |
| Misafir sayfası, 12 durum | 72 görsel, 196 nokta, hata 0; takvim başlığı her durumda 80 pt, satır yüksekliği değişmiyor, dikey ortalı, ara ≥ 8 pt |
| Görsel yüklenmeden yer ayrılmış (görseller 1,5 sn geç gelirken, 390 / 320) | başlık, etiketler, ilk kart yerinde; zıplama yok |
| Kaydırma (390 / 320) | görsel çubuğa %20 girince en çok %80 görünür, yarısı girince görünmez |

İlk misafir turunda 430-gece-normal'de görsel bir kez yüklenemedi ve `onerror` onu kaldırdı. Yerel test sunucusu kaynaklı
olduğunu düşünüyorum; tekrarında 12 / 12 temiz geçti.

### Hiza (36.4)

| Yer | 320 | 390 | 430 | Büyük yazı (320 / 390–430) |
|---|---|---|---|---|
| Villalarım / Takvim / Hesap | 64 pt | 88 pt | 88 pt | 64 / 71 pt |
| Yaklaşan rezervasyonlar | yer yok, görünmez | 56 pt | 56 pt | görünmez / 56 pt |
| Misafirler ("Nasıl?" ve villa rozetiyle aynı satır) | görünmez | 36 pt | 56 pt | 320 ve 390'da görünmez, 430'da 40 pt |
| Gelir & gider | 36 pt | 56 pt | 56 pt | görünmez / 56 pt |

Her yerde:

- satır itilmiyor (görselli / görselsiz yükseklik farkı 0);
- yazı tek satırda kalıyor;
- yazıyla görsel arası 9–14 pt.

Dikey merkez farkı: başlıklarda 4 pt, bölüm satırında 10 pt; görsel bilerek yukarıda. Altında hemen düğme ya da kart var:
Takvim'de Ajanda / Misafirler düğmeleri, Yaklaşan rezervasyonlar'da ilk kart. Tam ortalı olsa görselin görünen kısmı bunlara
değerdi.

320 pt'de "Villalarım" tek satır, görselle üst üste değil.

## Bilerek değişen eski beklentiler

- **Görev 35 testi (`qa35a`)** başlık görselini 64 / 48 pt, `-256.webp`, bölüm görselini 40 pt bekliyordu. Yeni değerler 36.3
  tablosunda; bunların ölçümü qa36'da.
- **Görev 28.1:** "dolu / boş etiketleri başlıkla aynı satıra sığsın" artık mümkün değil. 88 pt görselle hiçbir genişlikte
  sığmıyor; etiketler hep alt satırda.

## Mevcut testler

Önceki çalıştırmayla karşılaştırıldı. Zamanlama, rastgele jeton ve animasyonun ortasından alınan örnekler sayılmadı.

| Test | Sonuç |
|---|---|
| Görev 33 (33.1–33.8) | hepsi geçti; 33.3 form karşılaştırması 4 / 4 durumda fark 0 |
| Görev 32 · 30 | fark yok |
| Görev 31 | fark yok. Tek ölçü farkı 31f'de: Villalarım kartları Görev 33'teki ölçüme göre 4 pt aşağıda (etiketler görselin altında). İskelet ile dolu kart yine aynı yerde, zıplama yok |
| Görev 31 turu (SE / iPhone 15 × 3 yazı boyutu × hareketi azalt) | 12 durumda taşma, hata, konsol 0; hareketi azaltta kayan öğe 0 |
| Görev 29 · 28 (60/60, Çok büyük 60/60, villa) | fark yok |
| Görev 28.1 yerleşim | "Villa ekle" 390 / 430'da 3 pt aşağıda, 360'ta ve Çok büyük'te aynı yerde; taşma yok |
| Görev 27 | 86 ✓ |
| Görev 34.1 (`qa34a`) | çalışmıyor: test, arama panelindeki `#maAdim-tarih`'i arıyor, panel ürün yöneticisinin "Kaç kişi?" değişikliğinden beri farklı. Görev 35'te de aynı yerde duruyordu; 36 ile ilgisi yok |
| Görev 19–25 | çalıştırılmadı (takvim, klavye, rezervasyon formları; 36 bunlara dokunmuyor) |

Test dosyaları (scratchpad): `qa36.js`, `qa36g.js`, `qa36ortak.js`, `qa36y.js`, `alfa36.json`.
