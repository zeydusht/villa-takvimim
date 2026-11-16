# Görev 24.4: iPhone açılış görselleri

_Claude Code, 17 Kasım 2026._

## Neden beyaz ekran

Ana ekrandan açılan web uygulamasında iPhone, sayfa yüklenene kadar `apple-touch-startup-image` gösterir. Bizde yoktu; bu yüzden ilk 2–3 kare beyazdı. `manifest.json`'da da zemin `#9FE870` idi; artık `background_color` ve `theme_color` `#10180D`.

## Görseller

- `www/img/acilis/acilis-GENİŞLİKxYÜKSEKLİK.png`, 11 boyut (istenen 9 + iPhone 16 Pro ve 16 Pro Max).
- `index.html` `<head>`'de her biri için cihaz boyutu ve piksel oranına göre `media` sorgulu `<link rel="apple-touch-startup-image">`.
- Zemin `#10180D`, logo `assets/sembol-acik.svg` ile aynı şekil (açılış animasyonundaki satır içi SVG'nin kendisi), rengi `#9FE870`.

## Logo web açılışının ilk karesiyle nasıl eşlendi

1. Gerçek sayfa (`index.html`, açılış perdesi) her iPhone'un web görünümü boyutunda açıldı; açılış perdesindeki logonun kutusu ölçüldü.
2. Görsel aynı SVG ile, aynı kutuya çizildi. Ana ekrandan açılan uygulamada durum çubuğu "black" (`apple-mobile-web-app-status-bar-style`); sayfa durum çubuğunun altından başlar. Bu yüzden logo görselde durum çubuğunun yüksekliği kadar aşağıda.
3. Üretilen PNG'de logonun kutusu piksel piksel taranıp web karesiyle karşılaştırıldı.

| Görsel | Cihazlar | Ekran (pt) | Durum çubuğu (pt) | Logo genişliği | Logonun ortası (sayfa yüksekliğinin) | Web karesiyle fark (cihaz pikseli, sol/üst/sağ/alt) |
|---|---|---|---|---|---|---|
| 1320×2868 | iPhone 16 Pro Max | 440×956 | 62 | 28.4% | 49.51% | 2 / 1 / 2 / 1 |
| 1206×2622 | iPhone 16 Pro | 402×874 | 62 | 28.2% | 49.51% | -1 / 1 / 0 / 1 |
| 1290×2796 | iPhone 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus | 430×932 | 59 | 28.4% | 49.5% | 0 / 1 / 0 / 1 |
| 1179×2556 | iPhone 14 Pro, 15, 15 Pro, 16 | 393×852 | 59 | 28.2% | 49.51% | 0 / 1 / 0 / 1 |
| 1284×2778 | iPhone 12 Pro Max, 13 Pro Max, 14 Plus | 428×926 | 47 | 28.7% | 49.51% | 1 / -1 / 2 / -1 |
| 1170×2532 | iPhone 12, 12 Pro, 13, 13 Pro, 14 | 390×844 | 47 | 28.6% | 49.5% | -1 / -1 / -2 / -1 |
| 1125×2436 | iPhone X, XS, 11 Pro | 375×812 | 44 | 28.6% | 49.51% | 1 / 1 / -1 / 0 |
| 1242×2688 | iPhone XS Max, 11 Pro Max | 414×896 | 44 | 28.8% | 49.5% | -1 / 1 / -2 / 0 |
| 828×1792 | iPhone XR, 11 | 414×896 | 48 | 28.6% | 49.5% | 1 / 0 / 0 / 0 |
| 1080×2340 | iPhone 12 mini, 13 mini | 360×780 | 50 | 28.4% | 49.51% | 0 / 1 / 0 / 1 |
| 750×1334 | iPhone 8, SE (2. ve 3. nesil) | 375×667 | 20 | 24.1% | 49.51% | -1 / 0 / -1 / -1 |

Fark en fazla 2 cihaz pikseli (1 pt'nin altında; kenar yumuşatması).

**Not (logo genişliği):** görevde "ekranın %30'u" yazıyor. Açılış animasyonunun ilk karesi logoyu ekranın uzun kenarına göre ölçekliyor (`acilis.js`, değiştirilmedi). Görseller ilk kareyle birebir aynı olsun diye aynı ölçü kullanıldı:
- çoğu iPhone'da genişliğin %28–29'u;
- iPhone 8 / SE'de %24.

Logonun ortası her boyutta sayfa yüksekliğinin %49,5'inde.

## Denenemeyen

Gerçek iPhone. İki şey cihazda görülmeli:
- iOS açılış görselini gerçekten bu boyutlarla eşleştiriyor mu;
- durum çubuğu bu yükseklikte mi.

Logo açılışta birkaç pt zıplarsa sebep durum çubuğu payıdır (`acilis24.js` içinde tek sayı).

**Zeyd için:** iPhone açılış görsellerini simge ana ekrana eklendiği anda kaydeder. Ana ekrandaki eski simgeyi silip Safari'den yeniden "Ana Ekrana Ekle" yapmak gerekiyor. TestFlight uygulamasında bu sorun yok (kendi açılış ekranı var).
