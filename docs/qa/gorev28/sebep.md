# Görev 28.2: "Rehber açıkken eski seçim takılı kalıyor" — sebep

_Claude Code, 17 Kasım 2026._

## Yeniden üretme

Betik: `qa28rep.js`. Playwright, 390×844, Yardımlı mod açık, gerçek dokunuşlar (touchscreen.tap). Görseller: `hata-once/`.

1. Takvim → "Hangi villam boş?" → rehberle 17 → 21 Kasım → "Boş villaları göster" → rehber "Bitir".
2. Paneli ✕ ile kapat → alt menüden Villalar → tekrar Takvim → "Hangi villam boş?".

| Adım | Rehber baloncuğu | Takvimdeki seçim |
|---|---|---|
| 05 tekrar açılış | "‘Boş villaları göster’e dokunun." | 17–21 (eski arama) |
| 06 24'e dokun | aynı | değişmedi: 17–21 |
| 07 26'ya dokun | aynı | değişmedi |
| 08 27'ye dokun | aynı | değişmedi |

Takvim günlerine dokunmak hiçbir şey yapmıyor; baloncuk yalnız sallanıyor. Kullanıcı için "ekran takıldı".

## Sebep (iki hata üst üste)

1. **Seçim panel kapanınca sıfırlanmıyordu.**
   - `musaitAc()` önceki aramanın tarihlerini (`MA.bas`, `MA.bit`) ve kişi sayısını bilerek saklıyordu.
   - Yalnız tarih geçmişse temizleniyordu.
   - Panel her açılışta eski aralıkla geliyordu.
2. **Rehber adım seçimi ile dokunuş engeli çakışıyordu.**
   - Rehberin tarih adımları "seçim zaten var" diye atlanıyor (`atla_eger`).
   - Rehber doğrudan 3. adıma ("Boş villaları göster") geçiyordu.
   - Bu adımda delik yalnız düğmeyi kapsıyor.
   - Görev 20.2 kuralı: rehber açıkken hedefin dışındaki dokunuşlar belge düzeyinde iptal edilir.
   - Sonuç: takvim günlerine yapılan her dokunuş yutuluyordu.
   - Kullanıcı tarihleri değiştiremiyordu. Tek çıkış "Boş villaları göster"e basmak ya da baloncuktaki küçük ✕'ti.
   - Rehberin 3. adımı seçimin değişmesini de beklemiyordu: "seçim temizlendi" olayında 1. adıma dönüş yoktu.
3. **Ürün yöneticisinin tahmini kısmen doğru.**
   - Seçim gerçekten sıfırlanmıyordu ve rehber seçim durumuyla çakışıyordu.
   - Takılma ise "18.1 kuralı ilk dokunuşta seçimi temizliyor, olay gelmiyor" yüzünden değil.
   - Dokunuşun takvime hiç ulaşmamasından (rehberin engeli) kaynaklanıyordu.
   - Zeyd'in gördüğü "giriş gününe dokunun" metni bu sürümde üretilemedi. Her denemede baloncuk "Boş villaları göster" adımındaydı. Kilitlenme aynı.

## Villa takvimi (aynı kontrol)

- `ac()` (villa açma), başlangıç seçimini (`S.start`) temizliyordu ama tamamlanmış aralığı (`S.secim`) temizlemiyordu.
- Bir villada aralık seçip geri çıkınca, villayı tekrar açınca eski aralık ve alttaki panel geri geliyordu.
- "+ Rezervasyon"a basınca (19.3: tarih seçiliyse form hemen açılır) form eski tarihlerle açılıyordu.
- Rehberin tarih adımlarında takvim hedefin kendisi olduğu için orada dokunuş kilidi yok.
- Kilitlenme yok, ama eski seçim aynı sebeple "takılı" kalıyor.

## Düzeltme

Ayrıntı `GOREV28.md` 28.2'de, testler `README.md`'de.

1. Panel her açılışta temiz: tarih yok, kişi sayısı boş.
   - Son arama saklanır ve altta "Son arama: 17–21 Kasım · tekrar ara" bağlantısı çıkar.
   - Dokununca o tarihlerle sonuç açılır. Rehber bu bağlantıyı vurgulamaz.
2. Rehber adımları seçim durumuna göre başlar ve seçim değişince kendini ayarlar:
   - seçim temizlenince "giriş" adımına döner;
   - yalnız giriş varsa "Giriş: 17 Kasım · şimdi çıkış gününe dokunun" der;
   - aralık varsa "Boş villaları göster" adımına geçer.
3. Rehber motoruna `serbest` seçeneği eklendi: adımın deliği dışında kalan ama dokunulabilmesi gereken yerler.
   - Arama rehberinin bütün tarih ve göster adımlarında takvim, hızlı seçimler ve kişi sayısı her zaman dokunulabilir.
   - Rehber kullanıcıyı kilitlemez.
4. Villa takvimi: villa her açılışta seçim temiz (`S.secim` de sıfırlanır).
