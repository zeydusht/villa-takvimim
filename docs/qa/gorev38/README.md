# Görev 38: başlık görseli kaybolma hatası, ortalı başlık — test raporu

_Claude Code, 24 Kasım 2026._ Veritabanı değişmedi, deploy edilmedi, Netlify'a yüklenmedi.

## 38.1 Hatanın gerçek sebebi

Hata önce Playwright **WebKit** (iPhone 13: 390 × 664, 3x) ile yeniden üretildi, sonra aynı senaryolar Chromium'da çalıştırıldı.
İkisinde de aynı yerde, aynı değerlerle çıktı. Yani sebep WebKit'in `:has()` kuralını geç hesaplaması değil, uygulamanın JS kodu.

1. Ajanda'da "Bugün" seçilince boş hâl çıkıyor. Başlık görseli `display:none` oluyor (container sorgusu, kutu 0 genişlikte).
2. "7 gün" seçilince `cizAjanda()` → `goster()` → bir kare sonra `baslikGuncelle()` çalışıyor. O anda görsel hâlâ gizli,
   yüksekliği **0** ölçülüyor.
3. Kaydırınca sönme hesabı `(alt − üst − 0,1·boy) / (0,4·boy)`. Boy 0 olunca sonuç sonsuz çıkıyor, 1'e kırpılıyor ve görsele
   satır içi **`opacity:0`** yazılıyor.
4. Liste dolunca kutu açılıyor (yazı 21 → 119 pt sağa kayıyor), ama görsel saydam kalıyor. Bu değeri yalnız bir sonraki
   `baslikGuncelle()` siliyor, o da ancak kaydırınca çalışıyor.

Kaydırılmışken sekme değişiminde (senaryo 3) görselin görünmemesi doğru davranış: görsel üst çubuğun altında kalıyor.
En üste çıkınca görsel geliyor.

| Senaryo (iPhone 13) | Önce, webkit | Önce, chromium | Sonra, webkit | Sonra, chromium |
|---|---|---|---|---|
| 1 Ajanda: Bugün → 7 gün → Bugün → 30 gün | 7 gün ve 30 günde görsel yok (`opacity:0` satır içi), 2 / 2 turda | aynı | doğru | doğru |
| 2 Villalarım → Takvim → Hesap → Villalarım (Takvim'de Bugün seçili), 3 tur | Takvim'den 7 güne geçince aynı hata | aynı | doğru | doğru |
| 3 aşağı kaydırılmışken sekme değiştirme | doğru (görsel çubuğun altında) | doğru | doğru | doğru |

Düzeltme:

- **Karar JS'te:** görselin görünüp görünmeyeceğine `baslikGorselDurum()` karar veriyor ve `h1.gorselGizli` sınıfını koyuyor.
  - Görsel gizlenir: ekranda büyük boş hâl görseli gerçekten görünüyorsa (`offsetParent` + `getClientRects`) ya da görsele 48 pt yer kalmıyorsa.
  - Kaldırılan kurallar: `.sekmeEkran:has(.bosHal…)` ve `@container (max-width:57.9px)`.
- **Ne zaman çağrılıyor:** her seferinde hemen ardından `baslikGuncelle()` de çalışıyor.
  - sekme değişince;
  - Ajanda filtresinde;
  - Villalarım, Takvim, Misafirler ve arama sonucu her çizildiğinde;
  - "Güncel"de;
  - resize'da;
  - yazı boyutu değişince;
  - `document.fonts.ready` sonrasında;
  - başlık yazısının genişliği değişince (ResizeObserver; dil değişimi için).
- **Sekme değişince:** diğer başlıklardaki satır içi `opacity` / `transform` temizleniyor; yeni sekme bir kare sonra ölçülüyor.
- **`baslikGuncelle()`:** gizli ya da boyutsuz görsele dokunmuyor.

## 38.2 Ortalı başlık

- **Düzen:** `h1` üç sütun: `minmax(0,1fr) · yazı · minmax(0,1fr)`.
  - Görsel 1. sütunda, yazının hemen solunda; arada 10 pt.
  - Görsel ortalamaya dahil değil. Gizlenip gelirken yalnız saydamlığı değişiyor, yazı kımıldamıyor.
- **Yer daralınca:** sol sütun darsa görsel küçülüyor (88 → en az 48 pt), daha da darsa gizleniyor. Yazı tek satır, kesilmiyor.
- **Değişmeyenler:**
  - "+ Villa ekle" ve dolu / boş etiketleri sola yaslı (37.2 gibi).
  - Misafirler, Gelir & gider ve diğer alt sayfa başlıkları.
- **Kaydırma:** üst çubuktaki başlık da ortalı. Kaydırma sırasında büyük başlığın ortası 0 pt, çubuktaki başlığın ortası
  0–0,1 pt (320 ve 390, iki motor). Geçiş düz yukarı.

Görsel boyutları (yazının ortası her durumda 0,0 pt):

| Ekran | Villalarım | Takvim | Hesap |
|---|---|---|---|
| 320, normal | 60 pt | 64 pt | 64 pt |
| 320, Büyük | 49 pt | 64 pt | 64 pt |
| 320, Çok büyük | gizli (yer 38 pt) | 58 pt | 64 pt |
| 390 · 430, normal | 88 pt | 88 pt | 88 pt |
| 390 · 430, Büyük | 71 pt | 71 pt | 71 pt |
| 390 · 430, Çok büyük | 64 pt | 64 pt | 64 pt |

## 38.3 Test

`qa38.js`: webkit ve chromium, 306 kontrol, **hepsi geçti**, sayfa hatası 0.

1. **Üç senaryo, iki motor:**
   - Her adımdan 700 ms sonra ölçüldü, `scroll` olayı olmadan (sayaç 0, sayfa en üstte).
   - Dolu listede görsel tam görünür, satır içi `opacity` boş. Boş hâlde gizli.
   - Kaydırılmışken sekme değişince diğer başlıklarda satır içi değer yok.
2. **Ortalama:**
   - Durumlar: 320 / 390 / 430 × normal / büyük × boş / dolu × üç başlık.
   - Yazının ortası ile sayfanın ortası arasındaki fark ±2 pt içinde. Ölçülen fark her yerde 0,0.
   - Görsel görünürken de gizliyken de: boş Villalarım, Takvim'de Bugün, ayrıca sınıf elle verilerek.
   - Yazı tek satır, ekrana sığıyor.
3. **Yazı kımıldamıyor:**
   - Görsel gidip gelirken yazının x'i en çok 0,5 pt oynuyor; ölçülen 0,00.
   - Geçiş ara saydamlık değerlerinden geçiyor.
   - Takvim'de Bugün → 7 gün: görsel kaydırmadan geri geliyor, yazının yeri değişmiyor.
4. **Ekran görüntüleri:**
   - Bu klasörde, `<ekran>-<dolu|bos>-<genişlik>-<normal|buyuk>.jpg`, 36 adet (chromium).
   - Her birinde taşma ve üst üste binme denetlendi.

**Ters deneme:** aynı test düzeltmeden önceki koda karşı çalıştırıldı. İki motorda da kırmızı oldu: "7 gün (dolu): görsel
görünür" ✗, satır içi `opacity:"0"`, kaydırma olayı 0.

Uç durum: gerçekte olmayan, daha uzun bir başlık yazısı ("Villalarım ve evler", 320, Çok büyük) sayfaya sığıyor, ama WebKit'te
23 pt sola kayıyor. Chromium'da tam ortada. Uygulamadaki Türkçe ve İngilizce başlıklar sığıyor.

## Mevcut testler

| Test | Sonuç |
|---|---|
| Görev 36 matrisi (uygulama) | hepsi geçti |
| Görev 37 (`qa37`) | 174 kontrolden 140'ı geçti. Kalan 34'ün hepsi bilerek değişen beklentiler (aşağıda) |
| Görev 33 (33.1–33.8) | hepsi geçti |
| Görev 31f (iskelet) · Görev 31 turu · Görev 28 (60/60, Çok büyük) · Görev 28.1 yerleşim | Görev 37 ile fark yok |

`qa37`'de bilerek değişen beklentiler:

- 32 kontrol "görsel sola yaslı (sol kenar 0)" bekliyordu. Görsel artık yazının hemen solunda; sıra, ara (10 pt) ve dikey hiza
  aynı.
- "Görsel yumuşakça geri gelir" kontrolü görselin genişliğinin değişmesini bekliyordu. Artık yalnız saydamlık değişiyor ve bu
  kontrolü test elle (çizim olmadan) yapıyordu. Gerçek akış `qa38`'de ölçüldü.
- "Villalarımız" (320, Çok büyük) için 48–63 pt görsel bekleniyordu. Ortalı düzende orada yer yok, görsel gizli; yazı tek satır.

Test dosyaları (scratchpad): `qa38.js` (yeni), `qa38r.js` (yeniden üretme), `qa30ortak.js` (`motor: "webkit"` seçeneği).
