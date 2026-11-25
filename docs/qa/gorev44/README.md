# Görev 44 — Akıcılık, başlık görseli kaybolmasın, Villalar ve Hesap görselleri

## 44.1 Başlık görseli kendiliğinden kaybolmaz

- **Sebep:** 37.3 / 38.1'deki "ekranda büyük boş hâl görseli varsa başlık görselini gizle" kuralı. Ajanda'da "Bugün" boş olunca
  Takvim görseli kayboluyordu.
- **Şimdi:** `baslikGorselDurum()` yalnız yer yoksa gizler (38.2: ekran genişliği ve yazı boyutu). Filtre, boş liste ya da veri
  yenilenmesi görseli gizlemez; başlık da zıplamaz (`.gorselBos` kalktı).
- **Bölüm başlıkları:** 39.4 kuralı aynı kaldı.
- **STIL.md'ye eklenen genel kural:** dokunulmayan başlık, görsel ya da düğme kaybolmaz, zıplamaz.
- **Test:** Bugün / 7 gün / 30 gün 5 kez gidip gelindi. Görsel her karede görünür kaldı, yeri en çok 1 pt oynadı.
  - Boş Villalarım'da büyük boş hâl görseli ile başlık görseli birlikte.
  - 320 + Çok büyük'te Villalarım görseli 38.2 kuralıyla gizli (yer yok); bu değişmedi.
- **Görüntüler:** `441-*`.

## 44.2 Akıcılık

Ayrıntı ve önce / sonra tablosu: [performans.md](performans.md).

- **En kötü kare** (CPU 4 kat yavaş):
  - villa sayfasına giriş 1083 → 233 ms;
  - sekme geçişi 450 → 100 ms;
  - ay değiştirme 650 → 33 ms;
  - pencere açılması 217 → 67 ms.
- **Ulaşılmayan hedef:** "hiçbir kare 50 ms'yi geçmesin" hedefine ulaşılmadı. Kalan uzun kareler hareketin ilk bir iki karesi
  (yeni ekranı çizme işi).
- **iOS:** Info.plist'e `CADisableMinimumFrameDurationOnPhone` eklendi.
- **Android:** değişiklik gerekmedi.

## 44.3 Villalar ve Hesap başlık görselleri

- **Villalar:** iki tur, 6 aday. Seçilen **e** (oran 1,31).
- **Hesap:** 3 aday. Seçilen **a** (oran 1,38). Eski görsel dikeydi (0,95).
- **Karşılaştırma:** [secim-villalar.jpg](secim-villalar.jpg), [secim-hesap.jpg](secim-hesap.jpg). Eski görsel ve adaylar, her birinin
  yanında Takvim görseli.
- **Adaylar:** `www/img/3d/aday/`.
- **İstekler:** `docs/CODEX_3D_GORSELLER_3.md` (Görev 44.3 eki).
- **Test:**
  - üç sekmede içerik oranı alfa kanalından ölçüldü: 1,31 / 1,30 / 1,38;
  - görünen dolu yükseklik farkı ≤ %10;
  - üst çubuğa en az 12 pt.
- **Görüntüler:** `443-*`.

## Testler

- **Kapsam:** chromium, 390 ve 320 + Çok büyük; webkit en sonda bir kez.
- **chromium:**
  - 44.1 + 44.3: 20 kontrol, 0 hata;
  - Görev 43 testleri: 144, 0 hata;
  - okunabilirlik taraması (43 ekran): 0 bölünmüş kelime / 0 dar / 0 taşma.
- **webkit:** 20 kontrol, 0 hata, 46 sn.
- **Görev 41 testleri:**
  - Ödeme renk ve yazı kontrolleri Görev 43'teki bilinçli değişikliklerden (amber, yeni yazılar, ₺ öncesi bölünmez boşluk) dolayı artık
    eski beklentiyle uyuşmuyor; o testler güncel değil.
  - 41.5'teki hızlı fiske kontrolü ara sıra düşüyor; eski kodda da aynı, zamanlamaya bağlı.
  - 41.6 temiz.

## Yan bulgu

Görev 43.1'de `odemeTam()` yanlışlıkla silinmişti; ödemesi tam alınmış misafirin giriş gününde rezervasyon detayı hata veriyordu.
44.2 commit'inde düzeltildi.
