# Villa Takvimim: stil rehberi

_Görev 26.8, 17 Kasım 2026. Bundan sonraki bütün işler buna uyar._

Değerlerin tek kaynağı `www/index.html` başındaki `:root` CSS değişkenleri. Kodda renk, süre ya da köşe yazarken önce değişkene bakılır; yeni bir değer gerekiyorsa önce oraya eklenir, sonra bu dosyaya yazılır. Misafir sayfasının (`g.html`) kendi `:root`'u var.

Kullanıcı yaşlı bir villa sahibi. Her karar "daha sade, daha net" yönünde verilir.

## 1. Renkler

| Ad | Değişken | Değer | Ne için |
|---|---|---|---|
| Ana yeşil | `--ok` | #0B5B57 | Ana düğme, onay, seçili durum, rehber vurgusu |
| Ana yeşil (basılı) | `--ana-basili` | #084743 | Ana düğmeye basınca |
| Metin | `--ink` | #101613 | Bütün ana metin |
| İkincil metin | `--muted` | #5F6A64 | Açıklama, alt yazı (beyazda 5,9:1) |
| Çerçeve | `--cerceve` | #5F6A64 | Kart, satır, ikincil düğme çerçevesi |
| Çizgi | `--line` / `--cizgi` | #D9DFDB / #C9D1CC | Ayraç, ince kenar |
| Açık zemin | `--soft` | #F1F5F3 | Kutu zemini |
| Basılı zemin / çerçeve | `--basili-zemin` / `--basili-cerceve` | #E3EFEC / #0B5B57 | Dokununca |
| Şarap kırmızısı | `--uyari` | #9B2C4A | Para: ödenmedi / alınacak; uyarı; tehlikeli işlem |
| Tehlike çerçevesi | `--tehlike-cerceve` | #C4718A | Kırmızı düğmenin çerçevesi |
| Mercan kırmızısı | `--bugun` | #E5484D | **Yalnız** takvimde "bugün" çerçevesi |
| Lacivert | `--lacivert` (+ `-zemin`, `-cerceve`, `-basili`) | #3C4E8C | Para işleri, bilgi rozetleri |
| Misafir sayfası ikincil metin | `g.html --muted` | #5B6A72 | Beyazda 5,6, açık gride 5,2 |

**İş renkleri** (renkli düğmeler, `.is-*`):

| İş | Sınıf | Renk |
|---|---|---|
| Rezervasyon | `.is-rez` | #0B5B57 |
| Para | `.is-para` | #3C4E8C |
| Opsiyon | `.is-ops` | #4A5A7A |
| Fotoğraf / paylaş | `.is-foto`, `.is-paylas` | #2E6E8E |
| Misafir | `.is-misafir` | #7A4B8C |
| Bakıcı | `.is-bakici` | #4F6B22 |
| Sade | `.is-gri` | #5F6A64 |
| Silme | `.is-sil` | #9B2C4A |
| WhatsApp | `.is-wa` | #25D366 |

**Rezervasyon renkleri** (`PALET`): #0B5B57, #8C3A5E, #3C4E8C, #7A4B8C, #4F6B22, #5A6B7A, #9B2C4A, #2E6E8E.

**Yasak:**
- Sarı ve turuncu kullanılmaz.
- Kontrast her metinde en az WCAG AA olmalı: normal yazı 4,5:1, büyük yazı 3:1. Gri üstüne gri yok.

## 2. Yazı

- **Aileler:** başlıklar `--serif` (ui-serif, Georgia), metin `--sans` (sistem yazısı).
- **Birim:** bütün yazı boyutları ve boşluklar `rem`. Piksel kullanılmaz; Hesap → Görünüm'deki yazı boyutu ayarı kökü ölçekler:
  - Normal %100 = 16 px;
  - Büyük %112,5;
  - Çok büyük %125.
- **Kalın yazı yok.** Tek istisna: takvim seçim panelinin yeşil başlığı ve büyük toplamı (600, Görev 20.5).

| Kullanım | Boyut | Normal boyutta |
|---|---|---|
| Ekran başlığı (`h1`) | 2.25rem serif (iç ekranlarda 1.875rem) | 36 / 30 px |
| Panel başlığı (`.sheet h2/h3`) | 1.5rem serif | 24 px |
| Bölüm başlığı (`.eyebrow`) | 1.1875rem serif | 19 px |
| Büyük tutar | 1.875–2.25rem | 30–36 px |
| Gövde | 1rem | 16 px |
| Satır, düğme | .9375–1rem | 15–16 px |
| İkincil (`.sm`, alt yazı) | .875rem | 14 px |
| **En küçük** (etiket, rozet, alt menü, takvim gün adları) | .8125rem | **13 px** |
| İstisna: takvim hücresi içi (fiyat, baş harf) | .6875rem, fiyatta `clamp(11px, .6875rem, 3.1vw)` | 11 px (hücre 46–60 pt) |

- **Dar alanda büyük yazı:** yan yana öğeler sığmazsa alt satıra geçer (`flex-wrap`, `min-width:min-content`, kap sorgusu); üst üste binmez.
- **Uzunluk:** bir satır en fazla ~40 karakter (telefonda). Rehber baloncuğu en fazla 2 satır.

## 3. Düğmeler

Dört tür (`.big`):

| Tür | Sınıf | Görünüş | Ne zaman |
|---|---|---|---|
| Ana | `.big` | Dolu yeşil, beyaz yazı | Ekrandaki tek ana iş (Kaydet, Rezervasyonu kaydet) |
| Renkli | `.big.renkli.is-…` | İş renginin açık zemini, iş renginde yazı | Yan işler (Değiştir, Fotoğraf ekle, Teklif) |
| Sade | `.big.ghost` | Beyaz, gri çerçeve | Vazgeç, Geri |
| Tehlike | `.big.tehlike` | Beyaz, kırmızı çerçeve ve yazı; üstünde boşluk | Sil, iptal et, yayından kaldır |

- **Satır düğmesi** (`.satirBtn`): ikon kutusu + metin + sağda `›`.
- **Seçim** (`.seg`): eşit genişlikte seçenekler.
- **Anahtar** (`.svic`): aç / kapat.
- **Dokunma alanı:**
  - her dokunulabilir öğe en az **48 pt** (`3rem`);
  - ana ve satır düğmeleri `--dokunma-yukseklik` (3.25rem = 52 pt);
  - yakın düğmeler arasında en az .5rem.
  - İstisna: takvim ızgarası hücreleri.
- **Basınca:**
  - çerçeve `--basili-cerceve`, zemin `--basili-zemin`;
  - %97'ye küçülme (`--basili-olcek`);
  - süre `--hiz-bas`.
- **Silme ve iptal:**
  - Önemliyse onay sorulur.
  - Her durumda 5 saniyelik **"Geri al"** bildirimi (`geriAlBildir`) gösterilir.
  - Kalıcı ve geri alınamayan işlemler (hesap silme) yalnız onaylı yapılır.

## 4. İkonlar

- Yalnız `ikon(ad, {boy, kalinlik})` kullanılır: Lucide çizgi ikonları, `class="ik"`.
- Boyut 16–24, çizgi 1.75–2.
- Emoji ve başka ikon seti kullanılmaz.
- **Yeni ikon:** Lucide'nin SVG yolu `www/ikonlar.js`'e Türkçe adıyla eklenir (ör. `baglanti-yok` = Lucide `wifi-off`).
- **Uygulama logosu** (üst çubuk, giriş, açılış) ikon değildir: kendi SVG'si.
- İkon dosyalarının üstüne yazılmaz.

## 5. Boşluklar ve köşeler

**Boşluk adımı:**
- .25rem'in katları: .25 / .5 / .75 / 1 / 1.25 / 1.5 / 2.25 rem.
- Panel iç boşluğu 1.5rem.
- Ekran bölümleri arası 2.25rem.
- Satır içi boşluk .5–.75rem.

**Köşeler:**

| Öğe | Yarıçap |
|---|---|
| Düğme, kart, satır, giriş alanı | `--kose` (.75rem) |
| Alttan açılan panel (üst köşeler), seçim paneli | 1rem / 20px |
| Hap, rozet, etiket, "?" | 99px |
| Takvim hücresi / blok | 10px |
| Rehber deliği / baloncuğu | 14px / 18px |

## 6. Hareket

**Eğriler:**
- `--egri-gecis`: cubic-bezier(.65, 0, .35, 1). Yer değiştirme, kapanış ve kaydırma için.
- `--egri-giris`: cubic-bezier(.22, 1, .36, 1). Belirme ve giriş için.
- Başka eğri yazılmaz. Dönen yükleme göstergesi doğrusal olabilir.

| Süre | Değişken | Değer | Ne için |
|---|---|---|---|
| Basma | `--hiz-bas` | 100 ms | Basma ve renk tepkisi |
| Ay solması | `--hiz-ay` | 150 ms | Ay değişince |
| Panel kapanma | `--hiz-kapa` | 180 ms | Panel, bildirim kapanışı |
| Ekran | `--hiz-ekran` | 200 ms | Ekran geçişi solması, sihirbaz adımı, kararma |
| Panel açılma | `--hiz-ac` | 220 ms | Panel, bildirim, çevrimdışı şeridi |
| Çubuk | `--hiz-cubuk` | 280 ms | İlerleme çubuğu, ödeme akışı kayması |
| Klavye | `--hiz-klavye` | 300 ms | Klavye payı ve klavyeye hizalama |
| Seçim paneli | `--hiz-secpanel` | 320 ms | Takvim seçim paneli açılışı |
| Kaydırma | `--hiz-kaydir` | 400 ms | Takvim konumlama |
| Parlama | `--hiz-parla` | 600 ms | Değişen rakam / yeni satır |

**JavaScript'teki standart değerler:**
- **Kademeli giriş:** 260 ms, 35 ms arayla, en fazla 8 kademe, 10 pt.
- **Kaydırınca belirme:** 320 ms; misafir sayfasında 16 pt, uygulamada 8 pt.
- **Rehber adım geçişi:** 420 ms. Rehber metni 120 ms'de çapraz geçer.

**Kurallar:**
- Yalnız `transform` ve `opacity` canlandırılır. Yükseklik ve kutu boyu canlandırılmaz; tek istisna klavye payı.
- Ölçüm (`getBoundingClientRect`, `offsetHeight`, `getComputedStyle`) her karede yapılmaz. Gerekirse bir sonraki karenin başında bir kez yapılır.
- Kökte değişen CSS değişkeni bütün sayfayı yeniden hesaplatır. Sık değişen değer yalnız ilgili öğeye yazılır (kalıtılmayan `@property`).
- "Hareketi azalt" açıksa animasyon yoktur.
- Açılış animasyonu (`acilis.js`) değiştirilmez.

**Klavye (Görev 24):**
- Odakta kaydırma yok.
- Klavye oturunca tek kaydırma (300 ms): alanın altı klavyenin 12 pt üstüne gelir.
- Kapanırken panel kendi yerine iner. Tek fonksiyon: `klavyeyeHizala`.

**Takvim (Görev 25):**
- Giriş gününde ay başlığı üst çubuğun 8 pt altına gelir.
- Çıkış gününde ızgaranın son satırı panelin 12 pt üstüne gelir.
- Kaydırma konumu geri okunmaz.

## 7. Durumlar

- **Boş liste:**
  - çizim (`img/bos-*.webp`);
  - bir cümle ("Henüz … yok");
  - ne yapılacağını gösteren düğme.
  - Süzgeç boş kalırsa kısa not.
- **Yükleniyor:** iskelet ekran (`.iskelet`); 400 ms'den kısa yüklemede görünmez.
- **Hata:**
  - "Bağlantı kurulamadı" + "Tekrar dene".
  - Teknik hata metni kullanıcıya en sonda ve küçük gösterilir.
- **Çevrimdışı:**
  - üst çubuğun altında sakin şerit: "Çevrimdışı · değişiklikler bağlanınca kaydedilecek";
  - bağlantı gelince kendiliğinden kaydedilir.
- **Başarı:**
  - kısa bildirim ("… kaydedildi");
  - rehberde ✓ kartı.

- **Tam ekran panel** (Görev 27, `.maSheet`): ekranın tamamını kaplayan, köşesiz panel; alttan kayarak açılır. Alttaki
  sabit satır (`.altSabit`) özeti ve tek ana düğmeyi taşır. Çok adımlı işlerde (tarih seç → sonuç) ekran değişmez, panelin içi
  değişir; "‹ Tarihleri değiştir" ile geri dönülür.
- **Kural uyarısı olan kart** (ör. en az gece sağlanmıyor): kart soluk zeminli ve kesik çerçeveli, üstünde şarap kırmızısı
  etiket; işlem yine yapılabilir (karar sahibin). Metin soluklaştırılmaz (kontrast korunur).

## 8. Rehber (Yardımlı mod)

- **Her işlem paneli** Yardımlı modda rehberle başlar (`rehberAc`).
- **Ayrıntı panelleri ve ekranlar:** başlığın yanında "?" var (`rhSoru`, `ekranSoru`); rehber isteyince açılır.
- **Rehber kilitlemez** (Görev 28): seçimi değiştirebilecek yerler (takvim, hızlı seçimler, kişi sayısı) her adımda dokunulabilir
  (`serbest`). Adımlar seçim durumuna göre başlar; seçim değişince rehber kendini ayarlar (temizlenince ilk adıma döner, yalnız
  giriş varsa "Giriş: 17 Kasım · şimdi çıkış gününe dokunun").
- **Seçim taşınmaz:** bir panel ya da villa her açılışta temiz seçimle başlar; önceki arama gerekiyorsa "Son arama: … · tekrar ara"
  bağlantısıyla geri getirilir.
- **Metinler** `Rehber.M` sözlüğünde. Aynı tür adım hep aynı cümle:
  - "…e dokunun";
  - "… yazın";
  - "(isteğe bağlı)".

## 9. Terimler sözlüğü

Hitap her yerde **"siz"** ("Giriş yapın", "Hesabınız"). Düğme etiketleri kısa emir kipi ("Kaydet", "Fiyat gir").

| Kullanılan | Kullanılmayan | Anlamı |
|---|---|---|
| Rezervasyon | kayıt, booking | Kesinleşmiş konaklama |
| Özel teklif / Teklif | indirim bağlantısı | Misafire özel fiyatlı bağlantı |
| Opsiyon | ön rezervasyon, tutma | Belli bir güne kadar ayrılmış tarih |
| Kapora | ön ödeme, avans | Rezervasyonda alınan ilk ödeme |
| Konaklama ücreti | konaklama bedeli, toplam ücret | Geceler + kısa konaklama ücreti |
| Kısa konaklama ücreti | ek ücret | Az gecelik konaklamada eklenen ücret |
| Hasar depozitosu (kısaca "depozito") | güvence bedeli | Girişte alınıp çıkışta iade edilen |
| Misafirden alınacak toplam | genel toplam | Konaklama + depozito |
| Kalan ödeme | kalan tutar, bakiye | Toplam − alınanlar |
| Alınan ödeme / Ödemeyi al | tahsilat | Misafirden alınan para |
| Gelir / Gider | harcama | Kasaya giren / çıkan |
| Bakıcı | görevli, personel | Villaya bakan, sınırlı yetkili kişi |
| Villa sayfası | misafir sayfası, paylaşım sayfası | Misafirlere gönderilen sayfa |
| Yardımlı mod / rehber | eğitim, tur (tur yalnız "uygulama turu") | Adım adım yardım |
| Giriş / Çıkış (16:00 / 10:00) | check-in / check-out | Misafirin geliş / gidiş günü |
| En az konaklama | minimum gece, min. stay | Bir dönemde kabul edilen en az gece (giriş gününün dönemi geçerli) |
| Boş / Kısmen boş | müsait değil, yarı dolu | Seçilen gecelerin hepsi / bir kısmı boş ("Hangi villam boş?") |

**Yeni metin kuralları:**
- Her yeni Türkçe metin `www/dil.js`'e İngilizcesiyle eklenir.
- Anahtar, metnin kendisidir.
