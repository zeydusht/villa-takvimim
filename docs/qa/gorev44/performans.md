# Görev 44.2 — Akıcılık: kare süreleri

## Nasıl ölçüldü

- **Ortam:** Playwright + chromium, 390 genişlik, CPU 4 kat yavaş (`Emulation.setCPUThrottlingRate` rate 4: orta seviye telefon).
- **Kare süresi:** her hareket sırasında `requestAnimationFrame` zaman damgaları arası.
- **Tekrar:** her hareket 3 kez ölçüldü, kareler birleştirildi.
- **Önce:** 44.1 sonrası kod. **Sonra:** 44.2.
- **"İş" sütunu:** hareket boyunca ana iş parçacığının toplam meşgul süresi (CDP `Performance.getMetrics` TaskDuration;
  4x yavaş ms, 3 tekrarın ortancası). Kare süresinden daha kararlı bir ölçü.
- **≤ 16,7 ms:** kare 18,4 ms'den kısa (60 Hz vsync payı).
- **Uyarı:** bilgisayardaki diğer işler kare sürelerini oynatıyor. Aynı kodda bile tek tek kareler değişebiliyor; tabloda 3 tekrarın
  toplamı var.

## Sonuç

| Hareket | Önce: ort. / en kötü kare (ms) | Sonra: ort. / en kötü kare (ms) | ≤ 16,7 ms kare % | İş (ms) |
|---|---|---|---|---|
| Sekme geçişi (Villalarım → Takvim → Villalarım) | 31,3 / 450 | 18,2 / 100 | 87,9 → 96,5 | 767 → 528 |
| Villa sayfasına giriş | 98,2 / 1083 | 26,7 / 233 | 82,1 → 92 | 691 → 462 |
| Geri dönüş (geri düğmesi) | 21,0 / 117 | 16,8 / 33 | 90,9 → 99,1 | 284 → 96 |
| Kenardan kaydırarak geri (43.2) | 22,3 / 117 | 17,1 / 50 | 85,4 → 98,1 | 682 → 375 |
| Pencere açılması (rezervasyon detayı) | 29,4 / 217 | 18,1 / 67 | 85,7 → 95,1 | 407 → 248 |
| Pencere kapanması (Kapat) | 17,0 / 33 | 16,7 / 17 | 98 → 100 | 291 → 179 |
| Pencereyi aşağı çekip kapatma (41.5) | 17,8 / 100 | 16,8 / 33 | 96,1 → 99,4 | 461 → 254 |
| Hangi villam boş: açılış (34.1 büyüme) | 37,3 / 317 | 18,5 / 67 | 79,3 → 94,8 | 436 → 231 |
| Hangi villam boş: akordeon adımı | 20,3 / 117 | 16,8 / 33 | 88,2 → 99 | 442 → 298 |
| Hangi villam boş: kapanış | 17,3 / 50 | 16,8 / 35 | 95,9 → 99 | 268 → 145 |
| Başlığın üst çubuğa geçmesi (kaydırma) | 18,7 / 67 | 16,7 / 17 | 92,5 → 100 | 467 → 388 |
| Takvimde ay değiştirme | 29,0 / 650 | 17,1 / 33 | 90,5 → 97,5 | 551 → 221 |
| Liste kaydırma (Ajanda 30 gün) | 17,0 / 33 | 16,7 / 17 | 97,8 → 100 | 296 → 172 |

**Hedefler:**

- **Karelerin %95'i 16,7 ms altında:** bütün hareketlerde sağlandı (en az %94,8), iki istisna dışında:
  - villa sayfasına giriş %92;
  - "Hangi villam boş" açılışı %94,8.
- **Hiçbir kare 50 ms'yi geçmesin:** sağlanmadı. 50 ms'yi geçen kareler **hareketin ilk bir iki karesi**: dokununca yeni ekranı
  çizme ve dizme işi. Animasyonun ortasında en kötü kare 50 ms; "Hangi villam boş" büyümesinde ve pencere açılışında ara sıra görülüyor.
  Kalanlar:
  - villa sayfasına giriş 233 ms;
  - sekme geçişi 100 ms;
  - pencere açılması 67 ms;
  - "Hangi villam boş" açılışı 67 ms.

  Bunu tamamen çözmek için büyük ekranları birkaç karede parça parça çizmek gerekir (önce ilk ekran, sonra altı). Bu ayrı ve
  daha büyük bir iş.

## Ne düzeltildi

1. **Zorunlu layout tekrarları:** dokununca çizimden sonra başlık, geri düğmesi, villa kartı adı, bölüm başlıkları ve pencere yığını
   ayrı ayrı ölçülüyordu. Her okuma yeni bir layout yaptırıyordu (villa girişinde 4–6 kez).
   - Artık hepsi bir sonraki karenin başında, boyamadan önce, tek seferde ölçülüyor (`baslikYenile`, `barGeriOlc`, `yiginOlc`).
   - Değişmeyen sonuç yeniden ölçülmüyor (villa adı boyu, geri düğmesi).
   - Kök yazı boyu bir kez okunuyor (`kokPx`).
   - Aynı değer yeniden yazılmıyor.
2. **Döngüde yaz → oku:**
   - Bölüm başlıklarında her başlık için ayrı layout yapılıyordu; artık önce bütün yazmalar, sonra okumalar.
   - Villa adı ölçümünde kelime başına bir layout yapılıyordu; artık bütün kelimeler bir kerede ölçülüyor.
3. **Panel kapalıyken ölçü:** seçim paneli kapalıyken de her çizimde kaydırma ölçüsü okunuyordu.
4. **Pencere kilidi:** kaydırma konumu pencere eklenmeden önce okunuyor; pencere yüksekliği bir sonraki karede ölçülüyor.
5. **`content-visibility:auto`:** villa sayfasının bölümleri, Ajanda ve Villalarım kartları ekrana girene kadar dizilmiyor.
6. **Bulanıklık kaldırıldı:** "Hangi villam boş" panelinin arka plan bulanıklığı (`backdrop-filter: blur(12px)`) her karede
   arkadaki sayfanın tamamını yeniden işliyordu. Telefonda en pahalı efekt; yalnız karartma kaldı.
7. **Köşe animasyonu:** pencere açılınca arka sayfanın köşe yarıçapı animasyonla değişiyordu (her karede yeniden boyama). Artık yalnız
   `transform` hareket ediyor.
8. **iPhone 120 Hz:** `ios/App/App/Info.plist` dosyasına `CADisableMinimumFrameDurationOnPhone = true` eklendi. App Store
   uygulaması ProMotion ekranda 60 Hz'e kilitli kalmaz; web sürümünü etkilemez.
9. **Android:** `android:hardwareAccelerated` hiçbir yerde kapatılmamış (minSdk 24, varsayılan açık); değişiklik gerekmedi.
10. **34.1 `clip-path` büyümesi** ölçüldü:
    - Bulanıklık kalkınca en kötü kare 317'den 67 ms'ye indi.
    - Büyümenin ortasında ara sıra 50 ms'lik kare kalıyor.
    - `clip-path` değiştirilmedi. Telefonda takılırsa sıradaki adım: `transform: scale` ile büyütmek.

## Yan bulgu

Görev 43.1'de `odemeTam()` fonksiyonu yanlışlıkla silinmişti. Ödemesi tam alınmış misafirin giriş gününde rezervasyon detayı
açılınca sayfa hata veriyordu. Görev 41 testleri bunu yakaladı; 44.2 ile düzeltildi (`od.d==="tam"`).

## Doğrulama (chromium)

- **Görev 43 testleri:** 144 kontrol, 0 hata.
- **44.1:** 9 kontrol, 0 hata.
- **Görev 41.6:** 0 hata.
- **Görev 41.5:** hızlı fiske kontrolü ara sıra düşüyor; eski kodda da aynı, zamanlamaya bağlı.
- **Okunabilirlik taraması** (43 ekran, 320 + Çok büyük): 0 bölünmüş kelime, 0 dar, 0 taşma.
