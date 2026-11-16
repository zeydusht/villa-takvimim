# Görev 24.1: klavye ve rehber hizalaması nasıl sadeleşti

_Claude Code, 17 Kasım 2026._

## Önce: 14 ayrı yol aynı alanı kaydırıyordu

Klavye açılıp kapanırken bir yazı alanını yerine getirmeye çalışan 14 ayrı kod yolu vardı. Bunlar birbirinden habersizdi. Aynı açılışta 3–4 tanesi art arda kaydırıyordu; kasma ve sekme buradan geliyordu.

| # | Nerede | Ne yapıyordu | Durum |
|---|---|---|---|
| 1 | index.html `onceKaydir` | Dokunur dokunmaz, klavye daha açılmadan, tahmini klavye boyuyla (son klavye ya da ekranın %42'si) paneli kaydırıyordu | Kaldırıldı (24.1.1) |
| 2 | index.html `klavyeUygula` → `alanGoster` (bir sonraki kare) | Klavye boyu her değişince alanı kaydırıyordu | Kaldırıldı |
| 3 | index.html `klavyeUygula` → 280 ms sonra yine `alanGoster` | Aynı kaydırmanın ikinci kopyası | Kaldırıldı |
| 4 | index.html `vvBak` → `alanGoster` | Görünen alan büyüyünce (Android) yine kaydırıyordu | Kaldırıldı |
| 5 | index.html `focusin` → `alanGoster` | Klavye açıkken alandan alana geçince kaydırıyordu | `klavyeyeHizala`'ya bağlandı |
| 6 | index.html 20.9 `klavyeBosluk` | Klavye kapanınca panelin altına kalıcı boşluk ekliyordu | Kaldırıldı (24.1.5: panel kendi yerine iner) |
| 7 | CSS `.overlay{bottom:var(--klavye)}` + 250 ms geçiş | Panelin kendisi klavyeyle küçülüyordu. Klavye kapanırken panelin altında açık kalan şeritten arkadaki takvim görünüyordu | Kaldırıldı (aşağıya bakın) |
| 8 | rehber.js `visualViewport` `resize` dinleyicisi | Klavye animasyonunun her karesinde hizalıyordu | Kaldırıldı (24.1.6) |
| 9 | rehber.js `visualViewport` `scroll` dinleyicisi | Aynısı, kaydırma olayında | Kaldırıldı |
| 10 | rehber.js döngüsünde `hatDenetle` | Her karede görünen alanı karşılaştırıp yeniden hizalıyordu (büyük değişimde 250 ms, küçükte aynı karede) | Kaldırıldı |
| 11 | rehber.js döngüsünde "hedef boyu 40 px değişti" | 420 ms'lik yeni bir kaydırma başlatıyordu | "Hedef değişti" kuralına bağlandı (aşağıda) |
| 12 | rehber.js `ResizeObserver` zinciri (`D.ro`, `izle`, `D.rs`, `D.ofs`) | İçerik boyu değişince 250 ms'lik kaydırma başlatıyordu | Kaldırıldı |
| 13 | rehber.js geçiş sonrası "denetim" (`D.denetim`, `D.duzeltildi`) | Her geçişten 80 ms sonra 200 ms'lik düzeltme kaydırması yapıyordu | Kaldırıldı |
| 14 | rehber.js `alan()` | Uygulamanın bildirdiği klavye boyuyla görünen alanı karıştırıyordu (Görev 23) | Tek kaynak: oturmuş klavye |

## Şimdi: tek kural, tek fonksiyon

`klavyeyeHizala(alan)` (index.html, "24.1 TEK KLAVYE KURALI" bölümü). Uygulamada ve rehberde başka klavye hizalama kodu yok.

1. **Odak:** dokunuşta `focus({preventScroll:true})`. Hiçbir şey kaymaz.
2. **Klavyenin oturmasını bekleme:**
   - Web: görünen alan (`visualViewport`) 120 ms değişmeyince klavye oturmuş sayılır.
   - Uygulama: Capacitor `keyboardDidShow` gelince (native.js artık bunu "oturdu" diye bildiriyor).
   - Klavye hiç gelmezse (masaüstü, donanım klavyesi): 300 ms sonra; bu durumda kaydırma da yapılmaz.
3. **Tek kaydırma (300 ms, `--egri-gecis`):**
   - Kaydırma, son yerleşime göre bir kez hesaplanır. Panelin klavye payı geçişsiz uygulanır, ölçülür, sonra geçiş eski değerden başlatılır.
   - Alanın alt kenarı, görünen alanın alt kenarının 12 pt üstüne gelir.
   - Alan zaten oradaysa ya da daha yukarıda ve görünüyorsa kaydırma yapılmaz.
   - Panelin alt payı da aynı 300 ms'de, aynı eğriyle büyür.
4. **Rehber açıksa:**
   - Kaydırmayı yine `klavyeyeHizala` yapar.
   - `Rehber.klavyeKutu(alan)` yalnız hizalanacak kutuyu (rehberin penceresi) ve baloncuğun ihtiyaç duyduğu yeri verir.
   - Pencere ve baloncuk her karede hedefle birlikte çizilir; böylece aynı 300 ms'de, aynı eğriyle giderler.
5. **Klavye kapanırken:**
   - Panelin alt payı 300 ms'de küçülür.
   - İçerik son kaydırma sınırının ötesindeyse aynı 300 ms'de, aynı eğriyle oraya iner.
   - Tarayıcının kaydırmayı birden kırpıp içeriği zıplatmasına izin verilmez. Başka hareket yoktur.
6. **Ara kareler:** klavye açılırken hiçbir hizalama yapılmaz. Rehber de klavyenin oturmuş hâlini kullanır (`A.klavye()`, ara karelerde değişmez).

## Arkadan takvim görünmesinin sebebi ve çözümü

- **Sebep:**
  - Panel (`.overlay`) klavye açıkken klavyenin üstünde bitiyordu (`bottom: var(--klavye)`, 250 ms geçiş).
  - Klavye kapanırken klavye panelden hızlı iniyordu. Aradaki şeritte panelin altındaki sayfa, yani takvim, kararmadan görünüyordu.
  - Ayrıca rehberin katmanı, klavye kapanırken eski boyunda kalıp panelin kaydırma alanını uzatıyordu. Panel bu boşluğa kayınca altında yine sayfa görünüyordu.
- **Çözüm:**
  - Panel artık hep ekranın tamamını kaplıyor.
  - Klavye payı, panelin kendi beyaz alt dolgusu (`.sheet` `padding-bottom`, 300 ms geçiş).
  - Rehberin katmanı her karede içerikle aynı boyda tutuluyor (beklerken de).
- **Ölçüm:** bütün testlerde, her karede panelin alt kenarı ekranın altındaydı. Arkadan sayfa görünen kare sayısı 0 (`test.md`).

## Rehberde kalan tek "hedef değişti" kuralı

Hedef değişirse (ör. ücret kartında satır içi düzenleme açıldı ya da kapandı) iki şey olur:
- Pencere hemen, 300 ms'de yeni hedefe uyar.
- Kaydırma gerekip gerekmediğine klavye durduktan sonra bir kez bakılır. Yalnız hedef baloncuğuyla birlikte görünmüyorsa kaydırılır.

Bu kural, eski 11, 12 ve 13 numaralı yolların yerini aldı.

## Satır sayısı

Kod satırı olarak kısalmadı:
- rehber.js 1035 → 1053 satır;
- index.html'in klavye bölümü 140 → 219 satır.

Eklenenlerin çoğu açıklama satırları ve son yerleşimi ölçme adımı.

Sadeleşen şey yol sayısı:

| | Önce | Şimdi |
|---|---|---|
| Klavye açılırken kaydırma yapan yol | 14 | 1 (`klavyeyeHizala`) |
| Rehberin klavye / boyut dinleyicisi | 2 `visualViewport` + 1 `ResizeObserver` | 0 |
| Bir alana dokununca en fazla kaç kaydırma | 3–4 (ölçülen: önce tahmini kaydırma, sonra her karede düzeltmeler) | 1 |
