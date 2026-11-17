# Görev 26.1: akıcılık ölçümü

_Claude Code, 17 Kasım 2026._

## Yöntem

- Playwright ile Chrome, 390×844, işlemci 4× yavaşlatılmış (CDP `Emulation.setCPUThrottlingRate`).
- Sahte sunucu; dokunuşlar gerçek dokunma olayı.
- Her akış 3 kez çalıştırıldı, ortanca değer alındı.
- İki ölçü kullanıldı:
  1. **Chrome izlemesi (trace):** ana iş parçacığında yapılan iş. Betik, stil, yerleşim, boyama süreleri; 16 ms'yi ve 50 ms'yi aşan görev sayısı; en uzun görev. Kararlı bir ölçü; asıl ölçü bu.
  2. **Kare aralıkları** (`requestAnimationFrame`): düşen kare oranı.
     - Bu ölçü başsız Chrome'da çok gürültülü: ekran kartı ve gerçek ekran yenilemesi yok.
     - Aynı kod art arda üç turda %8, %19 ve %14 verebiliyor.
     - Bilgi için verildi. Gerçek telefonda doğrulanmalı.

Betikler (geçici klasörde):
- `perf26t.js`: iz;
- `perf26.js`: kareler;
- `prof26.js`: fonksiyon profili;
- `uzun26.js`: en uzun görevin içi.

## Bulunan sebepler

Profil ve izden çıkanlar (4× yavaşlatmada):

1. **Kökteki `--secPanelH` değişkeni.**
   - Seçim panelinin boyu `document.documentElement` üzerindeki bir CSS değişkenine yazılıyordu.
   - Kökteki bir değişken değişince sayfadaki her öğenin stili yeniden hesaplanır: tek seferde 40 ms.
   - Panel açmada (Rezervasyon formu) bu, 300 ms'lik görevin büyük kısmıydı.
2. **Her dokunuşta bütün ızgara baştan.** `takvimCiz` her gün seçiminde 30+ gün düğmesini silip yeniden oluşturuyordu (`innerHTML`). Ardından sayfanın yerleşimi zorla hesaplanıyordu.
3. **Kararma katmanı her karede takvimi ölçüyordu.**
   - Katmanın döngüsü her karede `getBoundingClientRect` çağırıyordu.
   - Bu, kaydırma ve panel animasyonu boyunca her karede yerleşimi zorluyordu (giriş gününde 25–35 ms).
4. **Eğri değeri her animasyonda stilden okunuyordu.** `egriAl` her çağrıda `getComputedStyle(...).getPropertyValue(...)` yapıyordu. Panelin içeriği sırayla belirirken bu, her öğe için stili zorlayarak 15 ms tutuyordu.
5. **Aynı dokunuşta üç kez zorunlu yerleşim:**
   - panel boyu (`offsetHeight`);
   - kararmanın solarak gelmesi için `offsetWidth`;
   - animasyon listesi (`getAnimations`).
6. **Takvimin altındaki ipucu satırı** her dokunuşta aynı yazıyla yeniden yazılıyordu. Yerleşimi gereksiz yere bozuyordu.
7. **Rehber katmanının boyu** aynı karede iki kez hesaplanıyordu (Görev 24'te eklenen çağrı + yerleştirme).

## Yapılanlar

1. `--secPanelH` artık yalnız `.wrap`'e yazılıyor. `@property` ile kalıtılmayan değişken olarak tanımlı; yalnız o kutu yeniden hesaplanır.
2. Izgara, aynı ay çiziliyorsa baştan kurulmuyor (`izgaraYaz`). Yalnız sınıfı, zemini ya da içeriği değişen hücreler güncelleniyor.
3. Kararma katmanı belge koordinatında duruyor; sayfa kayınca kendiliğinden takvimle birlikte kayıyor.
   - Konumu yalnız yerleşim değişince hesaplanıyor: ızgara ya da sayfa boyu değişince (`ResizeObserver`) ve ekran boyutu değişince.
   - Koşul denetimi (rehber başladı, seçim kalktı) her karede değil, 250 ms'de bir yapılıyor; ölçüm içermiyor.
4. Eğri değerleri bir kez okunup saklanıyor.
5. Panel boyu, kararmanın konumu ve animasyon listesi bir sonraki karenin başında okunuyor. Dokunuştaki zorunlu yerleşim teke indi. Kararma `offsetWidth` okumadan, iki kare sonra eklenen sınıfla soluyor.
6. İpucu satırı yalnız değişince yazılıyor.
7. Rehber katmanının boyu karede bir kez hesaplanıyor.

**Kaydırma tek yöntemle.** Takvimde tek kaydırma var (Görev 25'in `takvimKonumla`, 400 ms). Panel bitince başlıyor; tarayıcının "smooth" kaydırmasıyla aynı anda çalışmıyor. Sıralama da Görev 25'te kuruldu: önce panel (320 ms), sonra kaydırma.

## Sonuç: yapılan iş (iz, 4× yavaşlatma, ms; önce → sonra)

| Akış | Toplam iş | Betik | Stil | Yerleşim | Boyama | >16 ms görev | En uzun görev |
|---|---|---|---|---|---|---|---|
| 1. Giriş günü seçimi (kararma + panel + kaydırma) | 764 → 495 | 719 → 279 | 88 → 61 | 90 → 67 | 81 → 69 | 5 → 5 | 257 → 124 |
| 2. Çıkış günü seçimi (panel büyür + 2. kaydırma) | 584 → 383 | 508 → 151 | 62 → 52 | 42 → 28 | 76 → 78 | 3 → 4 | 135 → 70 |
| 3. Panel açma (Rezervasyon formu) | 474 → 386 | 375 → 253 | 62 → 50 | 133 → 97 | 90 → 73 | 6 → 3 | 272 → 201 |
| 4. Panel kapama | 168 → 143 | 41 → 32 | 36 → 30 | 3 → 3 | 57 → 47 | 3 → 2 | 26 → 19 |
| 5. Ekran geçişi: Takvim sekmesi | 349 → 242 | 204 → 117 | 47 → 39 | 71 → 54 | 46 → 31 | 3 → 2 | 169 → 126 |
| 6. Ekran geçişi: Villalar'a dönüş | 499 → 349 | 388 → 189 | 74 → 39 | 141 → 72 | 95 → 80 | 5 → 5 | 223 → 112 |
| 7. Rehber adım geçişi (ücret → ad soyad) | 662 → 589 | 632 → 543 | 41 → 42 | 38 → 33 | 88 → 91 | 7 → 4 | 47 → 28 |

- Ölçüm 4× yavaş işlemcide; normal hızda süreler yaklaşık dörtte biri.
- Giriş gününde iz kayıtlı ölçümün ortancası 124 ms. İzleme kapalı ayrı bir kayıtta, dokunuşun en uzun görevi 52 ms ölçüldü (izlemenin kendi yükü var).

## Kare düşmesi (bilgi; başsız Chrome, güvenilir değil)

| Akış | Ortanca düşme % (önce → sonra) | Üç tur (önce → sonra) |
|---|---|---|
| 1. Giriş günü seçimi | 8,1 → 13,8 | 38,5 / 8,1 / 8,1 → 18,9 / 8,2 / 13,8 |
| 2. Çıkış günü seçimi | 4,6 → 8,3 | 22,6 / 4,5 / 4,6 → 8,3 / 10 / 7,3 |
| 3. Panel açma | 17 → 16,9 | 17 / 22 / 8,6 → 16,9 / 14,9 / 17,6 |
| 4. Panel kapama | 3,2 → 0 | 4,7 / 3,2 / 0 → 0 / 3,2 / 0 |
| 5. Takvim sekmesi | 5 → 7,4 | 6 / 5 / 2,6 → 6,3 / 7,4 / 7,4 |
| 6. Villalar'a dönüş | 13,3 → 10,1 | 13,3 / 6,3 / 15,4 → 10,1 / 10,1 / 3,8 |
| 7. Rehber adım geçişi | 0 → 0 | 0 / 0 / 1,1 → 0 / 0 / 0 |

Açıkça yazmak gerekirse:
- Bu ortamda kare düşmesi oranında anlamlı bir iyileşme ölçemedim. "4× yavaşlatmada %5'in altı" hedefinin tuttuğunu da gösteremedim.
- İz, ana iş parçacığındaki işin %20–60 azaldığını kararlı biçimde gösteriyor.
- Kare oranı ise turdan tura 2–4 kat oynuyor.
- Gerçek iPhone'da (Safari Web Inspector → Timelines) bakılmalı.

## Bilerek değiştirilmeyenler

- **Kararmanın görünüşü** (büyük `box-shadow`). Boyaması izde küçük çıktı: giriş gününde 4×'te 69 ms, bunun da çoğu panel.
  - Görevde önerilen `will-change` ile kendi katmanına almak, gölgenin sınırları ekranın birkaç katı olduğu için telefonda çok büyük bir doku (bellek) demek. Yapılmadı.
  - Görünüm aynı kaldı; yalnız her karede ölçülmesi kaldırıldı.
- **Panel açılınca arkadaki sayfanın kilitlenmesi** (`body` sabitleniyor). Sayfanın tam yerleşimini istiyor (4×'te 12–16 ms). iOS'ta arka sayfanın kaymasını önleyen tek güvenilir yol bu; Görev 19B testleri buna dayanıyor. Dokunulmadı.
- **Sekme değiştirme:** yeni ekranın ilk çizimi (4×'te ~120 ms, normal hızda ~30 ms). Ekran geçiş animasyonu bu iş bittikten sonra başlıyor; animasyonun kendisi akıcı.

## Onaylı akışlar (regresyon, bu bölümden sonra)

| Test | Sonuç |
|---|---|
| Görev 25 takvim konumlama (390, 360; normal ve iPhone gibi; Kasım 23 → 25, Aralık 28 → 30) | 16/16 |
| Görev 24 klavye (iPhone 14, 360; web ve uygulama; rehber açık/kapalı) | 84/84 |
| Görev 24 ücret kartı satırları | 24/24 |
| Görev 23 rehberli rezervasyon (kapora kapalı / açık / aç-kapa-aç; web ve uygulama) | 6/6 |
| Görev 22 (390) | 21/21 |
| Görev 21 ölçümü (iPhone 14): klavye 12 ± 2, baloncuk 8 ± 2 | 4/4, 13/13 (klavyesiz 11/11) |
| Görev 19 rezervasyon akışı | konsol hatası yok, kayıt var |
