# Görev 48.1 — Karartma ve rehber: kare süreleri

## Nasıl ölçüldü

- **Ortam:** Playwright **webkit** (WebKit 27.2, Windows), 390 × 844, dokunmatik. Veri: `docs/appstore/demo-yedek.json` (Geri yükle ile).
- **Kare süresi:** hareket sırasında `requestAnimationFrame` zaman damgaları arası. Her hareket 3 kez, kareler birleştirildi.
- **≤ 16,7 ms:** kare 18,4 ms'den kısa (60 Hz vsync payı). **> 33 ms:** 34 ms'den uzun kare.
- **Betik:** `docs/qa/gorev48/kare.js` (`node kare.js <adres> <demo.json> <çıktı.json> 3 webkit 3`).

### WebKit'te "CPU 4 kat yavaş" yapılamadı

- WebKit'te Chromium'daki gibi CPU yavaşlatma yok (CDP yok).
- Windows'un iş nesnesiyle (Job Object, CPU sınırı %25) denendi. Düzgün yavaşlatmıyor: kısa süre tam hız, sonra 435 ms donma (ölçüldü). Kare ölçümünü bozar, kullanılmadı.
- Karedeki ana iş süresini ölçmeye çalışıldı (rAF → MessageChannel). WebKit iletiyi bir sonraki kareye bırakıyor; boş sayfada bile 15 ms çıkıyor. Kullanılmadı.
- Bu yüzden üç ölçüm var:
  1. **WebKit 1x:** kodun kendi yükü (piksel az).
  2. **WebKit 3x:** iPhone ekranı kadar piksel. Windows'taki WebKit katmanları **yazılımla** birleştiriyor. Hareket sırasında boş sahnede bile kareler 25–45 ms oluyor ve önce/sonra aynı. Bu, bilgisayarın birleştirme hızını ölçüyor; iPhone'un GPU'sunu değil.
  3. **Chromium, CPU 4 kat yavaş (CDP), 3x:** ana iş parçacığı yükü için (görev 44'teki yöntem).
- **Asıl ölçüm telefonda:** Hesap → Gelişmiş → **Akıcılık göstergesi** (yalnız yönetici hesabında). Köşede son 1 saniyenin FPS'i ve en uzun karesi: yeşil ≤ 18 ms, turuncu ≤ 33 ms, kırmızı > 33 ms.

## Sonuç

### WebKit, 1x çözünürlük

| Hareket | Önce: ≤16,7 ms % / en kötü ms / >33 ms kare | Sonra: ≤16,7 ms % / en kötü ms / >33 ms kare |
|---|---|---|
| Pencere açılması (rezervasyon detayı) | 97,2 / 31 / 0 | 97,2 / 30 / 0 |
| Pencere kapanması (Kapat) | 97,1 / 30 / 0 | 97,1 / 31 / 0 |
| Pencereyi aşağı çekip kapatma (41.5) | 96,7 / 30 / 0 | 97,2 / 30 / 0 |
| Rehberin açılması | 96,0 / 31 / 0 | 98,4 / 30 / 0 |
| Rehberde adım geçişi (İleri) | 97,4 / 31 / 0 | 97,9 / 30 / 0 |
| Rehberin kapanması | 98,6 / 30 / 0 | 97,8 / 30 / 0 |

### WebKit, 3x çözünürlük (iPhone ekranı kadar piksel)

| Hareket | Önce: ≤16,7 ms % / en kötü ms / >33 ms kare | Sonra: ≤16,7 ms % / en kötü ms / >33 ms kare |
|---|---|---|
| Pencere açılması (rezervasyon detayı) | 56,6 / 48 / 21 | 57,5 / 47 / 23 |
| Pencere kapanması (Kapat) | 71,6 / 35 / 2 | 70,3 / 42 / 4 |
| Pencereyi aşağı çekip kapatma (41.5) | 47,3 / 42 / 6 | 46,2 / 68 / 26 |
| Rehberin açılması | 75,8 / 62 / 30 | 73,6 / 42 / 20 |
| Rehberde adım geçişi (İleri) | 61,1 / 51 / 39 | 63,2 / 35 / 1 |
| Rehberin kapanması | 73,8 / 60 / 12 | 65,7 / 46 / 12 |

### Chromium, CPU 4 kat yavaş, 3x

| Hareket | Önce: ≤16,7 ms % / en kötü ms / >33 ms kare | Sonra: ≤16,7 ms % / en kötü ms / >33 ms kare |
|---|---|---|
| Pencere açılması (rezervasyon detayı) | 97,1 / 100 / 4 | 97,7 / 100 / 4 |
| Pencere kapanması (Kapat) | 98,4 / 33 / 0 | 100,0 / 17 / 0 |
| Pencereyi aşağı çekip kapatma (41.5) | 100,0 / 17 / 0 | 100,0 / 17 / 0 |
| Rehberin açılması | 98,3 / 33 / 0 | 98,7 / 50 / 2 |
| Rehberde adım geçişi (İleri) | 98,9 / 34 / 0 | 99,4 / 33 / 0 |
| Rehberin kapanması | 99,2 / 33 / 0 | 99,3 / 33 / 0 |

**Okuma:**
- WebKit 1x ve Chromium 4x: hedef (karelerin %95'i ≤ 16,7 ms) önce de sonra da sağlanıyor. Ancak hiçbir kare 33 ms'yi geçmesin hedefi her yerde tutmuyor. Pencere açılmasının **ilk karesi** (pencereyi çizmek) Chromium 4x'te 100 ms; bu görev 44'teki "ilk kare" konusu, burada değişmedi.
- WebKit 3x, rehber:
  - adım geçişinde 33 ms'yi geçen kare 39 → 1;
  - en kötü kare 51 → 35 ms;
  - rehber açılırken en kötü kare 62 → 42 ms.
- WebKit 3x, pencere: aşağı çekip kapatmada 33 ms'yi geçen kare 6 → 26. Sebebi şu:
  - Karartma artık ayrı bir katman ve yalnız saydamlığı değişiyor. Windows'taki WebKit her katmanı yazılımla birleştirdiği için orada ek yük var.
  - iPhone'da saydamlık animasyonu Core Animation'da (GPU) çalışır. Eski renk animasyonu ise her karede tam ekranı yeniden boyatıyordu.
  - Bu sonuç bu ortamda kanıtlanamadı. **Telefonda göstergeyle doğrulanmalı.**
- **En kötü hareket (önce):** rehberin açılması, WebKit 3x'te en kötü kare 62 ms. **Sonra:** 42 ms.

## Ne düzeltildi

1. **Gri karartma (alttan açılan pencereler):**
   - Eskiden pencerenin zemin RENGİ animasyonla değişiyordu: her karede tam ekran yeniden boyama.
   - Artık karartma ayrı katman (`.overlay::before`) ve yalnız saydamlığı (`opacity`) değişiyor: açılış, kapanış, aşağı çekme, geri açılma.
   - Aşağı çekerken saydamlık duraklatılmış bir animasyonla sürülüyor (`perdeYaz`). CSS değişkeniyle sürülseydi pencerenin bütün içeriğinin stili her karede yeniden hesaplanırdı (ölçüldü: 33 ms'yi geçen kare 38 → 25).
   - Fotoğraf görüntüleyicinin siyah zemini eskisi gibi.
2. **Rehberdeki ışık deliği:**
   - Eskiden perde, deliğin `box-shadow: 0 0 0 200vmax` gölgesiydi. Delik adımdan adıma boyut değiştirirken her karede ekranın birkaç katı büyüklükte bir katman yeniden boyanıyordu: iPhone'daki kasmanın bir numaralı adayı.
   - Artık perde dört düz renk parçası (üst, alt, sol, sağ). Parçalar yalnız `transform` ile yer değiştiriyor. Delik yalnız ince çerçeve (küçük alan).
3. **Baloncuk:**
   - `top/left` yerine `transform` ile kayıyor.
   - Yalnız kayarken `will-change: transform` (ayrı katman: gölgesi yeniden boyanmıyor), bitince kalkıyor.
4. **Zorunlu layout:**
   - Baloncuğun boyu her karede ölçülüyordu. Artık yalnız içerik, genişlik ya da biçim değişince ölçülüyor.
   - Rehber katmanının boyu için sayfadaki bütün öğeler her karede ölçülüyordu. Artık 12 karede bir; kap değişince ve hizalamada hemen.
5. **Bulanıklık:** `backdrop-filter` / `--morf-bulanik` uygulamada zaten yoktu (görev 44.2'de kaldırılmıştı). Kontrol edildi, değişiklik gerekmedi.
6. **Akıcılık göstergesi:** Hesap → Gelişmiş, yalnız yönetici hesabında, varsayılan kapalı, cihazda saklanır (`vt-fps`).
   - `481-akicilik-gostergesi.png`: göstergenin ekran görüntüsü.
   - `481-rehber-perde.png`: yeni perdeyle rehber.
