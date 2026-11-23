# Görev 38 — Başlık görseli kayboluyor (hata) + başlık sayfanın ortasında

**Kurallar:**
- Veritabanına dokunma.
- Deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.

---

## 38.1 — Hata: başlık görseli kayboluyor, kaydırınca geri geliyor

**Zeyd'in videosu (iPhone, Safari / ana ekran uygulaması).**
- **Takvim → Ajanda:**
  - "Bugün" seçilince boş hâl (hamak görseli) çıkıyor. Başlık görseli gizleniyor; bu 37.3'e göre doğru.
  - Sonra "7 gün" seçilince liste doluyor, ama başlık görseli **geri gelmiyor**. "Takvim" yazısı da yerinden kayıyor.
  - Sayfayı biraz aşağı kaydırıp geri çıkınca görsel ve yazı düzeliyor.
- **Villalarım ↔ Takvim ↔ Hesap arasında geçişlerde** de aynı şey ara ara oluyor. Bazen sekmeye girince görsel yok, kaydırınca geliyor.

**Muhtemel sebep (sen doğrula).** Görselin görünüp görünmemesi tamamen CSS'e bağlı. WebKit (iOS Safari) bu kuralları her değişiklikte yeniden hesaplamıyor:
- `.sekmeEkran:has(.bosHal:not(.hide *) .bosGorsel:not(.yok)) .baslikGK{flex-basis:0; opacity:0}`
  - `:has()` içinde `:not(.hide *)` gibi karmaşık bir seçici var.
  - Boş hâl kaldırılınca ya da `.hide` alınca WebKit bu kuralı geç yeniden değerlendiriyor.
- `@container (max-width:57.9px){ .baslikG{display:none} }`
  - `flex-basis` 0'dan geri açılırken container sorgusu, geçiş bitince yeniden hesaplanmıyor.
- Kaydırma düzeltiyor, çünkü `baslikGuncelle()` içindeki `getBoundingClientRect()` yeniden yerleşimi zorluyor.
- Ayrıca `baslikGuncelle()` görsele satır içi `opacity` yazıyor. Kaydırılmışken sekme değişince bu değer eski kalabiliyor.

**Önce yeniden üret.** Playwright'ı **webkit** motoruyla, iPhone boyutunda çalıştır (`devices['iPhone 13']`). Senaryolar:
1. Ajanda'da "Bugün" (boş) → "7 gün" (dolu).
2. Villalarım → Takvim → Hesap → Villalarım.
3. Aşağı kaydırılmışken sekme değiştirme.

Her biri için görselin görünürlüğünü ve konumunu kaydet. Hata webkit'te çıkmalı.

**Düzeltme.** Bu karar CSS'e bırakılmasın, JS versin:
- `baslikGorselDurum()` diye tek bir fonksiyon yaz. Görünen sekmenin başlığına `gorselGizli` sınıfını ekleyip çıkarsın. Görsel gizlenir:
  - ekranda büyük boş hâl görseli **gerçekten görünüyorsa** (`offsetParent` / `getClientRects` ile ölç);
  - ya da 38.2'deki düzende görsele yer kalmıyorsa.
- Şu kuralları kaldır, yerine `h1.gorselGizli .baslikGK{…}` kullan:
  - `:has(.bosHal…)` kuralları;
  - `@container (max-width:57.9px)` kuralı.
- Bu fonksiyonu ve hemen ardından `baslikGuncelle()`'yi şu anlarda çağır:
  - sekme değişince;
  - Ajanda filtresi (Bugün / 7 gün / 30 gün) değişince;
  - Villalarım, Takvim ve Misafirler listeleri her çizildiğinde (boş hâl eklenip kaldırıldığında);
  - veri yenilenince ("Güncel" balonu);
  - resize'da, yazı boyutu değişince, `document.fonts.ready` sonrasında.
- Sekme değişince eski sekmenin başlığındaki satır içi `opacity` / `transform` değerlerini temizle.
- Yeni sekmede `baslikGuncelle()`'yi bir `requestAnimationFrame` sonra çalıştır.

Görselin gizlenip geri gelmesi yumuşak olsun (`--hiz-ac`), ama sonuç asla kaydırmaya bağlı kalmasın.

## 38.2 — Başlık yazısı sayfanın tam ortasında, görsel solunda

**Zeyd'in isteği:** "Villalarım", "Takvim", "Hesap" yazısı sayfanın **tam ortasında** dursun. Soluyla sağı eşit uzaklıkta olsun. Görsel yazının hemen solunda dursun.
- Görsel ortalamaya dahil olmasın. Yazının ortası her zaman ekranın ortasında kalsın.
- Önerilen yapı: `h1.h1G` için `display:grid; grid-template-columns:1fr auto 1fr; align-items:center`. Görsel 1. sütunda, `justify-self:end`, yazıyla arasında 10 pt. Yazı 2. sütunda. 3. sütun boş.
- Görsel solda sayfa kenarına (iç boşluğa) çarpacaksa önce küçülsün, 88 → en az 48 pt. Ona da yer yoksa `gorselGizli` olsun. Bu ölçümü de `baslikGorselDurum()` yapsın.
- Yazı hiçbir genişlikte iki satıra bölünmesin, hiçbir genişlikte kesilmesin.
- Görsel gizliyken de yazı ortada kalsın, yerinden oynamasın. Görsel gelip gidince yazı **kımıldamasın**.
- Kaydırınca yazı üst çubuğa geçiyor (34.2). Üst çubuktaki başlık da ortalı, yani geçiş düz yukarı olsun, yana kaymasın.
- "1 dolu / 4 boş" etiketleri ve "Villa ekle" satırı 37.2'deki gibi sola yaslı kalsın. Sadece başlık ortalanacak.
- Kapsam: yalnız Villalarım, Takvim ve Hesap ana başlıkları. Misafirler ve Gelir & gider gibi alt sayfa başlıklarına dokunma.

## 38.3 — Test

1. 38.1'deki üç senaryoyu **webkit** ve chromium testine ekle. Beklenen davranış:
   - Dolu listede başlık görseli kaydırma olmadan görünür.
   - Boş hâlde gizlidir.
   - Görsel durumu `scroll` olayı tetiklenmeden doğru olmalı.
2. Ortalama testi: başlık yazısının `getBoundingClientRect()` ortası ile sayfanın ortası arasındaki fark ±2 pt içinde olmalı. Görsel görünürken de gizliyken de geçerli. Genişlikler 320 / 390 / 430, normal ve büyük yazı.
3. Görsel gelip giderken yazının x konumu değişmemeli.
4. Villalarım, Takvim ve Hesap için ekran görüntülerini al:
   - 320 / 390 / 430;
   - normal ve büyük yazı;
   - boş ve dolu.

   Görüntüleri `docs/qa/gorev38/` klasörüne koy.

## 38.4 — Bitiş

- `docs/PROJE_DURUMU.md` dosyasına Görev 38'i ekle.
- Mesajının en altına çok kısa özet yaz, ilk satırda hatanın gerçek sebebi olsun.
- Özetin altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
