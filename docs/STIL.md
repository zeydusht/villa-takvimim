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
| Şarap kırmızısı | `--uyari` | #9B2C4A | Para: **yalnız fazla alınan ödeme** (Görev 43.1); uyarı; tehlikeli işlem |
| Ödeme amberi | `--od-amber-yazi` / `-zemin` / `-kenar` | #7A5200 / #FFF3D1 / #E3A400 | **Yalnız** ödeme eksik / hiç alınmadı (Görev 43.1; yazı açık amberde 6,3:1, beyazda 6,9:1; kenar rengi yazıda kullanılmaz) |
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
- Sarı ve turuncu kullanılmaz. Tek istisna (Görev 43.1, Zeyd'in kuralı): ödeme eksik ya da hiç alınmadıysa amber
  (`--od-amber-*`). 41.2'deki "misafir henüz gelmedi" amberi kalktı; Sıradaki kartı artık ödeme durumunun rengini alır.
- Kontrast her metinde en az WCAG AA olmalı: normal yazı 4,5:1, büyük yazı 3:1. Gri üstüne gri yok.

## 2. Yazı

- **Aileler:** başlıklar `--serif` (ui-serif, Georgia), metin `--sans` (sistem yazısı).
- **Birim:** bütün yazı boyutları ve boşluklar `rem`. Piksel kullanılmaz; Hesap → Görünüm'deki yazı boyutu ayarı kökü ölçekler
  (Görev 31.10, `--yazi-kok`):
  - Normal %106,25 = **17 px** (iOS'un varsayılan gövde boyutu);
  - Büyük %119,5 (≈ 19 px);
  - Çok büyük %132,8 (≈ 21 px).
  - İstisna (Görev 42.2): satırlardaki ikon kutusu (`--ik-kutu` 36 px), ok (›), sayfa ve pencere kenar boşluğu
    (`--sayfa-kenar` en çok 20 px, `--panel-kenar` en çok 24 px) ve büyük yazıdaki yuvarlak × Kapat (48 px) yazıyla büyümez.
    Büyük yazıda yer yazıya kalsın diye. Büyük yazıya özel kurallar `html[data-yazi]` ile yazılır.
- **Satır yüksekliği:** gövdede 1.45 (`--satir-govde`), başlıklarda 1.2 (`--satir-baslik`).
- **Serif başlıklarda** harf aralığı `-.01em` (`--harf-serif`).
- **Kalın yazı yok.** Tek istisna: takvim seçim panelinin yeşil başlığı ve büyük toplamı (600, Görev 20.5).

| Kullanım | Boyut | Normal boyutta |
|---|---|---|
| Ekran başlığı (`h1`) | 2.25rem serif (iç ekranlarda 1.875rem) | 38 / 32 px |
| Panel başlığı (`.sheet h2/h3`) | 1.5rem serif | 25,5 px |
| Bölüm başlığı (`.eyebrow`) | 1.1875rem serif | 20 px |
| Büyük tutar | 1.875–2.25rem | 32–38 px |
| Gövde | 1rem | **17 px** |
| Satır, düğme | .9375–1rem | 16–17 px |
| İkincil (`.sm`, alt yazı) | .875rem | 15 px |
| **En küçük** (etiket, rozet, alt menü, takvim gün adları) | .8235rem | **14 px** |
| İstisna: takvim hücresi içi (fiyat, baş harf), fiyat ızgarası, takvim açıklaması | .6875rem, fiyatta `clamp(11px, .6875rem, 3.1vw)` | 11–12 px (hücre 46–60 pt) |

- **Rakamlar** (Görev 31.5): uygulamada ve misafir sayfasında bütün yazıda `font-variant-numeric: tabular-nums`; para, tarih, kişi ve
  gece sayısı değişince yazı zıplamaz.
- **Para biçimi:** her yerde `12.300 ₺` (binlik nokta, boşluk, ₺). Takvim hücresinde dar bölünmeyen boşlukla `4.100 ₺`, yüz binin
  üstünde `120b ₺`. Tek kaynak: `para()` (uygulama), `nf.format(n)+" ₺"` (misafir sayfası).
- **Dar alanda büyük yazı:** yan yana öğeler sığmazsa alt satıra geçer (`flex-wrap`, `min-width:min-content`, kap sorgusu); üst üste binmez.
- **Okunabilirlik: kelime bölünmez; dar yerde sağdaki öğe alta iner (Görev 42).**
  - **Kelime bölünmez.** Normal yazıda `overflow-wrap:anywhere` ve `word-break:break-all` kullanılmaz. Yalnız boşluksuz tek parça
    şeyler bölünebilir: bağlantı adresi (`.dtLink`, `.lsLink`, `.tlLink`), e-posta (`#hesapAd`) ve kod (`.mfaGizli code`).
  - **Yazı sütunu daralmaz.** Satırlardaki yazı sütunu `flex:1 1 var(--yazi-en-az)` (8em, ≈ 8 harf) ve `min-width:auto` alır: en uzun
    kelimesinden dar olmaz. `min-width:0` ile yazının daralmasına izin verilmez.
  - **Satır düzeni:** `[ikon] [başlık + alt yazı] [sağdaki etiket / sayı / anahtar] [›]`, satır `flex-wrap` ile kendi genişliğine bakar.
    - Sağdaki öğe başlığın yanına sığmazsa başlığın altına, sola yaslı iner. "…" ile kesilmez.
    - İkon solda, ok sağda, ikisi de dikey ortada ve akıştan ayrı (`position:absolute`). Alta inen etiket ikonun değil,
      başlığın altına gelir.
  - **Yan yana kutular:** sütun sayısı kutunun yazısına göre değişir (`repeat(auto-fit, minmax(min(100%, Nem), 1fr))`, Fiyatlar,
    Gelir & gider, fotoğraf kutuları, özellik çipleri) ya da kap sorgusuyla alt alta geçer (Ödemeler kutuları, Giriş / Çıkış).
  - **Bölünmeyen parçalar:** tarih ("27 Kasım"), ay adı ("Kasım 2026") ve "· 4/7" gibi sayaçlar bölünmez (`.nw`, bölünmez boşluk).
  - **Dengeli satırlar:** başlıklar ve kısa etiketler `text-wrap:balance` alır, ortada tek kelimelik kısa satır kalmaz.
  - **Büyük yazıda "Kapat":** "✕ Kapat" hapı yerine 48 pt yuvarlak × (`aria-label="Kapat"`; dokunma alanı en az 48 pt), başlıklar daralmaz.
  - **Denetim:** `docs/qa/gorev42/test/okunabilirlik.js`. Varsayılan chromium, 320 genişlik, Çok büyük (tam matris: 320 ve 375 × Büyük ve Çok büyük × chromium ve webkit);
    0 bölünmüş kelime, 0 dar sütun, 0 taşma olmalı. Yeni ekran eklenince bu teste de eklenir.
- **Uzunluk:** bir satır en fazla ~40 karakter (telefonda). Rehber baloncuğu en fazla 2 satır. Rehber katmanı 16 px tabanlı eski
  ölçülerinde kalır (`--rh-olcek`, Görev 31.10); yazı boyutu ayarıyla yine büyür.

## 3. Düğmeler

Dört tür (`.big`):

| Tür | Sınıf | Görünüş | Ne zaman |
|---|---|---|---|
| Ana | `.big` | Dolu yeşil, beyaz yazı | Ekrandaki tek ana iş (Kaydet, Rezervasyonu kaydet). Görev 31.11: bir ekranda / panelde aynı anda **en fazla bir** tane; fazlası renkli ya da sade olur |
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
- **Basınca (Görev 31.3):**
  - çerçeve `--basili-cerceve`, zemin `--basili-zemin` (süre `--hiz-bas`, 100 ms);
  - bütün dokunulabilir öğeler %97'ye küçülür (`--basili-olcek`): basış 120 ms (`--hiz-basis`), bırakış 200 ms (`--hiz-birak`),
    `--egri-giris`. Geçişte `transform var(--bas-sure,var(--hiz-birak)) var(--egri-giris)` yazılır; basılıyken `--bas-sure` 120 ms olur;
  - takvim günü sık basılır: küçülmez, yalnız 100 ms renk;
  - grup içindeki satırlar (`.grup > .satirBtn`) küçülmez, yalnız zemin değişir (satırlar birbirine yapışık);
  - menüde seçilen satır menü kapanmadan önce 120 ms (`--hiz-secildi`) ana renkte görünür (`secimParla`);
  - hover kullanılmaz. Gerekirse yalnız `@media (hover:hover) and (pointer:fine)` içinde (telefonda "yapışık hover" kalmasın).
- **Silme ve iptal:**
  - Önemliyse onay sorulur.
  - Her durumda 5 saniyelik **"Geri al"** bildirimi (`geriAlBildir`) gösterilir.
  - Kalıcı ve geri alınamayan işlemler (hesap silme) yalnız onaylı yapılır.

## 4. İkonlar

- **Tek başına ikon yok** (Görev 31.10): anlam taşıyan her ikonun yanında yazı olur ("✕ Kapat", "? Nasıl?", "✕ Şimdi değil").
  İstisnalar: üst çubuktaki geri oku; ayın / dönemin yanındaki ‹ › okları ve kişi sayısındaki − / + (bağlamıyla anlaşılır yön ve
  adım işaretleri; erişilebilirlik etiketleri var).
- **Yardım:** yalnız "?" değil, "? Nasıl?" yazan hap (`rhSoru`). Panelde başlığın altında kendi satırında; dar başlık satırında
  (ekran başlığı yanında) yalnız "?" kalabilir. Erişilebilirlik etiketi "Yardım".
  Rezervasyon detayında "Nasıl?" yok (Görev 41.3); oradaki rehber (ödeme / depozito / PDF) de kaldırıldı.

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
- `--egri-cekmece`: cubic-bezier(.32, .72, 0, 1). Alttan açılan panellerin açılışı (iOS çekmecesi gibi). Görev 31.1.
- Başka eğri yazılmaz. Dönen yükleme göstergesi ve iskelet parlaması doğrusal olabilir.

**Temel ilke (Görev 31):**
- Sık yapılan işte hareket az olur, seyrek yapılan işte olabilir.
- Kapanış açılıştan hızlıdır.
- Hareket hiçbir zaman bekletmez: animasyon sürerken dokunma çalışır, animasyon yarıda kesilebilir.
- Hiçbir şey `scale(0)`'dan büyümez. Küçük kutular `scale(var(--olcek-gelis))` (.96) + saydamlıktan, dokunulan yerden gelir;
  ortadaki pencereler (geniş ekranda panel) ortadan büyür.

| Süre | Değişken | Değer | Ne için |
|---|---|---|---|
| Basma | `--hiz-bas` | 100 ms | Renk ve çerçeve tepkisi; takvim günü |
| Basış | `--hiz-basis` | 120 ms | Basınca %97'ye küçülme |
| Seçildi | `--hiz-secildi` | 120 ms | Menüde seçilen satırın parlaması |
| Bırakış | `--hiz-birak` | 200 ms | Bırakınca eski boyuna dönüş |
| Ay solması | `--hiz-ay` | 150 ms | Ay değişince |
| Ekran | `--hiz-ekran` | 200 ms | Ekran geçişi solması, sihirbaz adımı |
| Kararma kapanışı | `--hiz-karar-kapa` | 200 ms | Panelin arka planı açılırken (yalnız saydamlık) |
| Bildirim gidişi | `--hiz-bildir-git` | 200 ms | Bildirim (toast) solar |
| Küçük öğe | `--hiz-oge` | 220 ms | Yeni satır, çevrimdışı şeridi, açılır ok, yenile göstergesi |
| Panel kapanma | `--hiz-kapa` | 220 ms | Panel kapanışı (`--egri-gecis`) |
| Kararma | `--hiz-karar-ac` | 240 ms | Panelin arka planı kararır (yalnız saydamlık) |
| Bildirim gelişi | `--hiz-bildir-gel` | 300 ms | Bildirim 8 pt aşağıdan gelir. Geçişle yapılır: yenisi gelince eskisi yarıda kesilip solar |
| Panel açılma | `--hiz-ac` | 340 ms | Alttan açılan panel (`--egri-cekmece`) |
| Çubuk | `--hiz-cubuk` | 280 ms | İlerleme çubuğu, ödeme akışı kayması |
| Klavye | `--hiz-klavye` | 300 ms | Klavye payı ve klavyeye hizalama |
| Seçim paneli | `--hiz-secpanel` | 320 ms | Takvim seçim paneli açılışı (`--egri-cekmece`) |
| Kaydırma | `--hiz-kaydir` | 400 ms | Takvim konumlama |
| Tik çizimi | `--hiz-tik` | 350 ms | Başarı bildiriminde tik çizilir (`--hiz-tik-gecikme` 100 ms sonra) |
| Kutlama kartı | `--hiz-kutlama` | 260 ms | "İlk" kartı `scale(.96)` + saydamlıktan gelir |
| Titreme | `--hiz-titreme` | 300 ms | Hatalı alan 2 kez ±4 pt (`--titreme-mesafe`) |
| Sayaç | `--hiz-sayac` | 450 ms | Değişen toplam eski değerden yeniye sayarak geçer (`sayarakYaz`, `--egri-giris`, ara değerler binlik ayraçla; "Hareketi azalt"ta doğrudan): seçim paneli toplamı, Gelir&gider net tutarı, rezervasyon detayındaki "… alınacak", ödeme sonrası kalan |
| Parlama | `--hiz-parla` | 600 ms | Değişen rakam / yeni satır |

**JavaScript'teki standart değerler:**
- Süreler JS'te de `hiz("kapa")` ile `:root`'tan okunur; sayı gömülmez.
- **Sekmelerde kademeli giriş** (Villalarım, Takvim, Ajanda, Gelir&gider): 260 ms, 35 ms arayla, en fazla 8 kademe, 10 pt.
  Oturumda bir kez oynar. Uygulama 10 dakikadan (`--sekme-tazele`) uzun arka planda kaldıysa, öne gelince açık sekmede bir kez daha.
- **Panellerde kademeli giriş** (Görev 31.2, `kademeOyna`, `panelKademe`): alttan açılan her panel, uyarı paneli, takvim seçim paneli,
  ödeme akışının 2. adımı, "Hangi villam boş?" sonuçları, villa ekleme adımları.
  - Her açılışta ilk düzey öğeler: 8 pt aşağıdan + saydamdan (`--kademe-kayma`), 240 ms (`--kademe-sure`), `--egri-giris`.
  - Öğeler arası 40 ms (`--kademe-ara`); ilk öğe panel açılmaya başladıktan 60 ms sonra (`--kademe-ilk`); en fazla 6 kademe (`--kademe-en`).
  - Aynı panel (aynı başlık ve adım) yeniden çizilirse giriş tekrar oynamaz; yalnız değişen satır `--hiz-parla` ile parlar.
  - Giriş sürerken bütün düğmeler basılabilir.
  - "Hareketi azalt"ta öğeler kaymaz, yalnız 150 ms (`--hiz-azalt`) saydamlıkla gelir.
- **Kaydırınca belirme:** 320 ms; misafir sayfasında 16 pt, uygulamada 8 pt.
- **Rehber adım geçişi:** 420 ms. Rehber metni 120 ms'de çapraz geçer.

**Yavaş çekim (Görev 31.13, yalnız inceleme için):** adrese `?yavas=3` eklenince bütün CSS süreleri ve JS animasyonları 3 ile
çarpılır. Kullanıcıya hiçbir yerde görünmez. JS'te `hiz()` ile okunan süreler zaten ölçeklidir; böyle bir animasyon `olcekli:1`
ile işaretlenir (iki kez çarpılmasın).

**Kurallar:**
- Yalnız `transform` ve `opacity` canlandırılır. Yükseklik ve kutu boyu canlandırılmaz; tek istisna klavye payı.
- Ölçüm (`getBoundingClientRect`, `offsetHeight`, `getComputedStyle`) her karede yapılmaz. Gerekirse bir sonraki karenin başında bir kez yapılır.
- Kökte değişen CSS değişkeni bütün sayfayı yeniden hesaplatır. Sık değişen değer yalnız ilgili öğeye yazılır (kalıtılmayan `@property`).
- "Hareketi azalt" açıksa animasyon yoktur.
- Açılış animasyonu (`acilis.js`) değiştirilmez.

**Mekânsal tutarlılık ve kesilebilirlik (Görev 31.12):**
- İleri giden ekran sağdan gelir, geri dönen sola gider. Alttan açılan panel aşağı kaydırılarak kapanır.
- Aşağı çekme (Görev 41.5, iOS gibi): içerik en üstteyken pencerenin **her yerinden** aşağı çekilir; pencere parmağı izler, arka
  plan açılır. Bırakınca pencere yüksekliğinin %25'inden (`--cek-oran`) fazla çekildiyse ya da hızlı fiske attıysa (0,5 px/ms,
  `--cek-hiz-esigi`; en az `--cek-fiske-en-az` 24 pt) "Kapat" ile aynı şekilde kapanır; değilse çekmece eğrisiyle yerine döner.
  İçerik aşağı kaydırılmışken önce içerik kayar, en üste gelince çekme pencereyi indirir. Yalnız dikey, aşağı doğru hareket sayılır
  (ilk 6 pt'de yatay giden hareket — takvim şeridi, kanal hapları — hiç karışmaz). Yazı alanında, sıralama tutamağında, iç
  kaydırıcısı en üstte olmayan alanda başlayan hareket sayılmaz. Kaydedilmemiş değişiklik varsa önce sorulur (40.6 sorusu); rehber
  adım gösterirken ve zorunlu pencerede çalışmaz. Hareket azaltılmışsa pencere parmağı izlemez, eşik geçilince anında kapanır.
  Eski "yukarı çekince lastik" kalktı: yukarı hareket içeriği kaydırır.
- Pencerenin üstünde küçük pencere (Görev 41.6): `perde(html, undefined, {katman:true})` açık pencereyi kapatmadan üstüne açılır;
  kapanınca alttaki yerinde. Gri alan, aşağı çekme ve kaydedilmemiş değişiklik sorusu aynı. "Emin misiniz?" için `eminSor`.
- **Yerleştirme / çıkış kaydı (Görev 41.6):** detaydaki "Yerleştirildi · 11:45" / "Çıktı · 10:05" satırında "Geri al" yok; satırın
  sağ ucunda "Düzenle" (48 pt). Düzenle → küçük pencere: saat (`type=time`; tarih aynı kalır) + Kaydet, altta kırmızı
  "Yerleştirmeyi geri al" / "Çıkışı geri al" → "Emin misiniz?" (Evet, … geri al / Vazgeç).
- Hiçbir animasyon sırasında `pointer-events:none` kalmaz. Kapanmakta olan panele dokunulursa kapanış durur, panel olduğu yerden
  çekmece eğrisiyle geri açılır (`geriAc`).

**Titreşim dili (Görev 31.4):**
- Yalnız iOS / Android uygulamasında ve Hesap → Titreşim açıksa.
- Kod olayın adını verir (`titret("kaydedildi")`); türü tek eşleme tablosundan (`TITRESIM_DILI`) gelir. Tabloda olmayan
  sıradan dokunuşlar (panel açma, kapatma, adımcı dışındaki düğmeler) titremez.

| Olay | Ad | Titreşim |
|---|---|---|
| Kaydetme, ödeme alma, villa ekleme başarılı | `kaydedildi`, `odeme`, `villa_eklendi` | `basari` |
| Silme, iptal | `silindi`, `iptal` | `sil` |
| Hata, eksik alan | `hata`, `eksik` | `uyari` |
| Takvimde aralığın ikinci günü, sekme değişimi, anahtar açıp kapama, değer seçimi (kişi sayısı, sıralama, yazı boyutu) | `aralik`, `sekme`, `anahtar`, `secim` | `secim` (Haptics `selectionChanged`) |
| Uzun basma başladı, sürükleme bir yere oturdu, aşağı çekip yenileme eşiği | `uzun_bas`, `oturdu` | `hafif` |

- Titreşim tek başına bilgi taşımaz; her zaman görsel bir geri bildirimle (bildirim, renk, panel, hata yazısı) birlikte gelir.

**Klavye (Görev 24):**
- Odakta kaydırma yok.
- Klavye oturunca tek kaydırma (300 ms): alanın altı klavyenin 12 pt üstüne gelir.
- Kapanırken panel kendi yerine iner. Tek fonksiyon: `klavyeyeHizala`.

**Takvim (Görev 25):**
- Giriş gününde ay başlığı üst çubuğun 8 pt altına gelir.
- Çıkış gününde ızgaranın son satırı panelin 12 pt üstüne gelir.
- Kaydırma konumu geri okunmaz.

**Soldan kaydırarak geri (Görev 43.2):**
- Sol kenardan (ilk 24 pt) başlayan yatay hareket; üstteki ekran parmağı takip eder (`translateX`, sol kenarında hafif gölge).
- Arkadaki önceki ekran −%25'ten 0'a kayar (paralaks); üstündeki karartma kaydıkça açılır. Önceki ekran kendi kaydırma yerinde görünür.
- Bırakınca genişliğin %35'i geçildiyse ya da hızlı fiske (0,5 px/ms) atıldıysa geri dönüş tamamlanır: `geriGit()`, geri düğmesiyle
  aynı işlem. Değilse ekran 250 ms'de yerine döner.
- Ekranlar: villa sayfası → Villalarım (Ajanda'dan gelindiyse Ajanda); Gelir & gider, Misafirler, Fiyatlar, Fotoğraflar, sihirbaz →
  villa sayfası. Alttan açılan pencere (misafir kartı dahil) ya da rehber açıkken, destek modunda, takvimde sürükleme sürerken
  çalışmaz. Kenardan başlamayan hareket yatay şeritlerin, takvimin, fotoğrafların kendi işidir.
- Hareketi azalt: ekran parmağı takip etmez, bırakınca kısa (150 ms) solma ile geri döner.
- Safari sekmesinde Safari'nin kendi kenar hareketi kalır; bizimki ana ekrana eklenmiş uygulamada (`display-mode: standalone`),
  Capacitor uygulamasında ve iOS olmayan tarayıcılarda çalışır (`kgAcik`). İki animasyon üst üste binmez.

## 7. Durumlar

- **Boş hâl (Görev 31.8, `bosHal`):**
  - büyük, sakin Lucide ikon (48 pt, `--soft` zeminli daire);
  - tek cümle ("Henüz … yok." / "Bu dönemde kayıt yok."), gerekirse altında kısa, soluk açıklama;
  - **tek** ana düğme (yoksa hiç). İkincil yol (ör. "En yakın boşluk", bakıcı daveti) renkli ya da çerçeveli düğme olur.
  - Örnekler: Villa yok → [Villa ekle]; Ajanda boş → düğme yok; Gelir&gider boş → [Gider ekle] (bölümler gizlenir);
    müsaitlik sonuç yok → [Tarihleri değiştir] + en yakın boşluk; villanın rezervasyonu yok → [Rezervasyon ekle];
    ödeme yok → ana iş üstteki "Ödemeyi kaydet".
  - Süzgeç boş kalırsa kısa not.
  - Çizimler 3D (`img/3d/<ad>-512.webp`, Görev 34–35); eski düz çizimler (`img/bos-*`, `img/sihirbaz-*`) kaldırıldı.
  - Düzen (Görev 37.3): görsel ortada, altında 16 pt; sonra kalın başlık, açıklama, düğme; hepsi ortalı. Kısa ekranda düğme ilk ekranda.
  - Ekranda büyük boş hâl görseli varken sekme başlığının görseli gizlenir (aynı ekranda tek 3D görsel); veri gelince yumuşakça
    (`--hiz-ac`) geri gelir.
  - 3D görseller dekupe (şeffaf webp) ve kendi gölgeleri var. Arkalarında hiçbir hâlde (gece modu, büyük yazı, dokunma, seçili kart)
    renk, daire, kare, kenarlık ya da ikinci gölge (`drop-shadow`) olmaz; uygulama ve misafir sayfası hep açık zeminde (Görev 36.2).
    Tek istisna: görsel yüklenemeyince çıkan ikonlu yedek hâl (`.bosGorsel.yok`, `.secKartGorsel.yok`), orada `--soft` zemin kalır.
  - Boyutlar tek yerden, `:root` (Görev 36.3). Başka yerde rem/px yazılmaz:

    | Değişken | Yer | Boyut |
    |---|---|---|
    | `--g3d-baslik` / `--g3d-baslik-kucuk` | Villalarım / Takvim / Hesap başlığı | 88 pt; 380 pt ve altı ekranda, büyük yazıda 64 pt |
    | `--g3d-bolum` | sayfa / panel başlığının sağı (Misafirler, Gelir & gider, Teklifler paneli); Özel teklif panelinde açıklama cümlesinin sağı (Görev 40.2) | 56 pt |
    | `--vb-foto` / `--vb-foto-kucuk` / `--vb-foto-kose` | villa sayfası üst kartının sağındaki kare fotoğraf (Görev 40.1) | kartın ≈ %38'i (390 pt'de 131 pt), en az 96 pt; ad sığmazsa 96 pt; köşe 16 pt |
    | `--g3d-bolum-bas` / `--g3d-bolum-bas-kucuk` | içerik bölümü başlığının başı (Görev 39) | 56 pt; dar ekranda (380 pt ve altı), büyük yazıda ve yazı 56 pt'de iki satıra iniyorsa 40 pt |
    | `--g3d-kart` | seçim kartları (`.secKart`) | 64 pt |
    | `--g3d-bos` | boş hâl (Görev 37.3) | 192 pt; kısa ekranda (yükseklik 640 pt altı) 144 pt |
    | `--g3d-sihirbaz` | sihirbaz | 160 pt |
    | `--g3d-misafir` (g.html) | misafir sayfası | 80 pt |

  - Dosyalar: `-256.webp` kenarları kırpılmış kare; `-512.webp` tam kare (boş hâl, sihirbaz). Başlık görsellerinin (`baslik-*`)
    `-512`'si de kırpılmış, `srcset` ile 3x ekranda o seçilir; 88 pt altındaki yerlerde `-256` yeter.
  - Hiza (Görev 36.4): görsel yazıyla dikey ortalı, arada en az 8 pt; satıra yazı satırından fazla yükseklik katmaz (negatif margin),
    üstüne / altına taşar. Bölüm satırında altında hemen kart olduğu için 10 pt yukarıda.
  - İçerik bölümü başlıkları (Görev 39.3): `[3D görsel] Başlık ……… [Tümünü gör]`. Görsel çizgi ikonun yerinde, sola yaslı;
    yazı görselin dikey ortasında, arada 10 pt. Satıra yazı satırından fazla yükseklik katmaz; altındaki karta en az 8 pt
    kalsın diye satırın altına taşma kadar boşluk eklenir. Yer yoksa önce görsel 40 pt'ye küçülür, sonra yazı iki satıra iner.
    Yalnız içerik bölümlerinde (villa sayfası, Gelir & gider, misafir kartı); Hesap'taki ayar başlıkları ve form etiketleri
    çizgi ikonla kalır. Görsel yüklenemezse çizgi ikon kalır.
    Bölümde büyük boş hâl görseli (ya da boş hâl çizimi) görünüyorsa başlıkta görsel olmaz, çizgi ikon döner (Görev 39.4);
    karar JS'te (`bolumGorselDurum`, `:has()` değil), DOM değişince bir sonraki kareden önce; gelen öğe `--hiz-ac` ile solarak gelir.
  - Sekme başlıkları (Görev 37.1, 38.2, 40.3): yazı sayfanın tam ortasında; görsel sol sütunda **sola yaslı** (sol kenarı sayfanın
    sol iç kenarında, "+ Villa ekle" ile aynı hizada, Görev 40.3), yazıyla en az 10 pt ara, dikey ortalı. Görselin dolu üstü ile
    üst çubuğun alt kenarı arasında en az 12 pt (`--baslik-ust-pay`; `--ust`: görselin üstteki şeffaf payı, başlık gerekirse
    `padding-top` ile aşağı iner — margin Takvim / Hesap'ta üstteki boşlukla birleşip yutuluyordu). Üç görselin üst / alt şeffaf
    payı aynı (~%10; `baslik-hesap` Görev 40.3'te buna göre yeniden kırpıldı).
    Hizalanan, görselin dolu sol kenarı: `--sol` (soldaki şeffaf pay, hesapta %12,5) kadar sola kaydırılır (`translate`).
    Dikeyde de `--ust` − %10 kadar kayar: üç görselin dolu üstü her yazı boyunda aynı yerde. Üç sütun
    (`1fr · yazı · 1fr`): görsel ortalamaya dahil değil, gelip gidince yazı kımıldamaz. Yazı hiç bölünmez, kesilmez: sol sütun
    darsa görsel önce küçülür (en az 48 pt), sonra gizlenir. Alt satırdaki etiketler ve "+ Villa ekle" sola yaslı kalır. Görselin dolu kısmı ile alttaki öğe arasında en az 8 pt (`--alt`: görselin
    alttaki şeffaf payı; başlığın alt boşluğu buna göre; `--baslik-alt-pay` 8,5 px; Görev 40.9'dan beri dikey kayma da hesaba katılır).
    Görsel görünür mü kararını JS verir (Görev 38.1, `baslikGorselDurum` → `h1.gorselGizli`): ekranda büyük boş hâl görseli
    gerçekten görünüyorsa ya da görsele 48 pt yer kalmıyorsa gizlenir. CSS `:has()` / container sorgusu kullanılmaz; sonuç
    kaydırmaya bağlı kalmaz. Gizlenip gelmesi `--hiz-ac`.
    Yer daralırsa önce görsel küçülür, yazı bölünmez; 36 pt'nin altına inince görünmez. Villalarım'da dolu / boş etiketleri "+ Villa ekle" ile aynı satırın sağ ucunda; sığmazsa alt satırda, sola yaslı (Görev 37.2).
    Kaydırınca başlık görseli üst çubuğa girdikçe söner (üst %10'u şeffaf kenar, oraya kadar tam), yarısı girince görünmez.
- **Tutar satırları (Görev 40.8):** tutar sütunu sağa yaslı, `tabular-nums`, `nowrap`; ₺ sayıya bitişik (`&nbsp;₺`). Satırlar eşit
  yükseklikte (`--tutar-satir`). Rezervasyonu düzenle: Konaklama ücreti · Ek ücret · Depozito · Toplam tablosu (`.tutarTablo`;
  giriş kutuları aynı genişlikte, `--tutar-sutun` 1.250.000 sığar; Toplam canlı). Bir ad yanına sığmazsa bütün adlar üste çıkar
  (`.ttDar`). Yeni rezervasyon / özel teklif ücret kartı tek ızgara (ad · tutar · Değiştir): tutarlar aynı sütunda; ad sığmazsa
  kendi satırına çıkar (`.ucDar`: tutar ve düğme iki sütunda), tutar + "Değiştir" de sığmazsa düğme yalnız kalem ikonu, 48 pt (`.ucIkon`).
- **Ödemeler ekranı (Görev 40.7):** ödemeler eklenerek tutulur; ekran bunu anlatır. En üstte üç kutu: Alınacak (siyah) · Alınan
  (yeşil) · Kalan (kırmızı); fazla alındıysa Kalan yerine "Fazla alındı" (lacivert: uygulamada sıcak renk yok, görevdeki "turuncu"
  yerine). Kutular yan yana, tutar kesilmez: sığmazsa alt satıra iner. Altında alınan ödemeler (tarih, tutar, not, sağda ok;
  dokununca düzenle / "Bu ödemeyi sil"). En altta "Yeni ödeme": kalan hazır yazılı; kalan 0 ise yerine "Ödemenin tamamı alındı"
  ve "Ek ödeme ekle". Bakıcı bu ekranı görmez (yetkiler aynı). Para hep `para()`: 13.000 ₺.
  **Görev 41.1:** tek bakışta tam / eksik / fazla / hiç. Kutular: "Alınması gereken" (gri) · Alınan (açık yeşil kutu, koyu yeşil
  yazı) · Kalan (açık kırmızı kutu, koyu kırmızı yazı; tam alındıysa açık yeşil, "✓ 0 ₺") ya da "Fazla alındı" (açık kırmızı; artık
  lacivert değil). Renkler `--giris-renk/--giris-zemin` ve `--cikis-renk/--cikis-zemin` (kontrast ≈ 7:1). Listenin altında tek
  cümlelik durum satırı, ikonlu (`.odDurum`): tam → yeşil "Ödemenin tamamı alındı" + "Ek ödeme ekle"; eksik → kırmızı "1.000 ₺ eksik ·
  alınması gerekiyor" + Yeni ödeme (kalan hazır); fazla → kırmızı uyarı üçgeni "15.000 ₺ fazla alındı" + "Yanlış girilen bir ödeme
  varsa…" açıklaması (tamamı alındı / Ek ödeme ekle / Yeni ödeme yok); hiç → kırmızı "Henüz ödeme alınmadı" + Yeni ödeme (toplam
  hazır). Karar tek yerde: `odemeDurumu(v,r)` (Sıradaki kartı ve Ajanda da bunu kullanır).
- **Ödeme durumu: tek kural, her yerde aynı renk (Görev 43.1, 41.1 / 41.2'deki kırmızı kalan ve eksiğin yerine).**

  | Durum | Renk | İkon | Yazı |
  |---|---|---|---|
  | Tam alındı | yeşil (`--od-tam-*` = giriş yeşili) | ✓ `tik-daire` | "Ödemenin tamamı alındı" |
  | Eksik alındı | amber (`--od-amber-*`) | ! `unlem-daire` | "5.000 ₺ eksik · 5.000 ₺ alındı" |
  | Hiç alınmadı | amber | ! `unlem-daire` | "Henüz ödeme alınmadı · 10.000 ₺" |
  | Fazla alındı | kırmızı (`--od-fazla-*` = uyarı kırmızısı) | ⚠ `uyari-ucgen` | "15.000 ₺ fazla alındı" |
  | Tutar girilmemiş | nötr gri | – | – |

  - Karar `odemeDurumu(v,r)` (bakıcıda `kalanSunucu`), görünüm `odGor(od)` (sınıf `od-tam` / `od-eksik` / `od-fazla` / `od-yok`,
    ikon, rozet) ve yazı `odYazi(od)`. Yazı rengi `.odRenk.od-…`; kutu, kart ve düğme zemini aynı `od-…` sınıfıyla.
  - Uygulandığı yerler: rezervasyon detayının durum satırı (fazlada "Alınan" altında kırmızı "Fazla alındı: 15.000 ₺"), "Ödemeler"
    yuvarlak düğmesi (zemin + ikon durum renginde, sağ üstte ✓ / ! / ⚠ rozeti, `aria-label` durum yazısıyla), en üstteki
    "… alınacak" kartı (amber), Ödemeler ekranı (Alınan yeşil, Kalan amber, Fazla kırmızı, durum satırı), Sıradaki kartı, Ajanda
    tutarları, villa sayfasındaki rezervasyon listesi, Gelir & gider ("Alınacak" kutusu ve listesi, rezervasyon etiketleri),
    yeni rezervasyondaki "Kalan ödeme".
  - Renk tek başına anlam taşımaz: ikon ve yazı her yerde var.
  - Sıradaki kartı: sıradaki olay giriş → ödeme rengi ("16:00 · Ayşe girecek" yazısı kalır); çıkış ve misafir yerleştirildi →
    ödeme rengi + "Yerleşti · 19:16" satırı; çıkış ve yerleştirme onayı yok (ya da tutar yok) → nötr.
  - Giriş / çıkış renkleri (Görev 40.5: giriş yeşil, çıkış kırmızı) ödeme değil, tarih işaretidir; değişmedi.
- **Sıradaki kartının rengi (Görev 41.2, 43.1 ile değişti):** misafir gelmedi → açık amber, "13.000 ₺ alınacak" kırmızı; yerleştirildi + ödeme tam →
  açık yeşil, "✓ Yerleşti · ödeme tamam"; yerleştirildi + eksik / hiç → açık kırmızı, uyarı ikonu "Yerleşti · 1.000 ₺ eksik"; fazla →
  açık kırmızı "Yerleşti · 15.000 ₺ fazla alındı"; sıradaki olay çıkış (yerleştirme onayı yok) → nötr gri-yeşil (`--sir-notr-*`;
  tam yeşilinden ayrılsın diye eski açık yeşil değil). Renk tek başına anlam taşımaz: yazı ve ikon da durumu söyler. Ajanda
  kartlarının ödeme satırı aynı karar: kalan / fazla kırmızı ("1.000 ₺ eksik", "15.000 ₺ fazla alındı"), tam yeşil "✓ Ödendi".
- **Alttan açılan pencere, gri alan (Görev 40.6):** arkadaki karartılmış alana dokununca pencere kapanır ("Kapat" ile aynı,
  aynı animasyon). Dokunuş gri alanda başlayıp gri alanda bitmeli (panelden kayıp gri alanda bırakmak kapatmaz). Rehber bir adım
  gösterirken kapanmaz. Formlarda (`formTakip`: yeni / düzenlenen rezervasyon, ödeme al / gir / düzenle, gelir-gider, opsiyon,
  özel teklif, yeni villa) kullanıcı bir alanı değiştirdiyse önce sorulur: "Değişiklikler kaydedilmedi. Çıkılsın mı?" · Çık /
  Devam et.
- **Pencere dışarı kaymaz (Görev 41.4):** `.overlay` yatayda kaymaz (`overflow-x:hidden`, `touch-action:pan-y`; eskiden
  `overflow-y:auto` yüzünden yatay da "auto" oluyordu), içerik pencereyi genişletemez (`.sheet` `overflow-x:clip`; hidden yapışkan
  "Kaydet"i bozardı). iOS lastik etkisi kapalı (`overscroll-behavior:none`, iOS 16+); eski iOS'ta açılsa da pencerenin altı beyaz
  (`.sheet` altında beyaz `box-shadow` uzantısı, kaydırma alanını büyütmez; geniş ekranda yok). Arka sayfa body kilidiyle sabit.
- **Giriş / çıkış renkleri (Görev 40.5):** giriş yeşil (`--giris-renk` #0B5B57, zemin `--giris-zemin`), çıkış kırmızı
  (`--cikis-renk` = uyarı kırmızısı #9B2C4A, zemin `--cikis-zemin`, çerçeve `--cikis-cerceve`). Rezervasyon detayında Giriş satırı
  (ikon, başlık, tarih, saat) yeşil, Çıkış satırı kırmızı; Ajanda'da "Giriş 16:00" / "Çıkış 10:00" etiketleri aynı renkte. Tarih
  bugünse dolu "Bugün", yarınsa açık "Yarın" etiketi (`gunEt`). Renk tek başına anlam taşımaz: ikon ve yazı aynen durur.
- **Villalarım arama (Görev 40.4):** "Bugün ve yarın" kartı kalktı (bilgi Takvim → Ajanda'da ve villanın "Sıradaki" kartında).
  "+ Villa ekle" ve dolu / boş satırının altında arama kutusu: solda büyüteç, doluyken sağda ×, 48 pt. Yalnız 4 ve üstü villada.
  Ad ve konumda arar; Türkçe harf ve büyük / küçük farkı yok (`araNorm`: ı/i, ş/s, ç/c, ğ/g, ö/o, ü/u). Dolu / boş etiketleri
  süzgeç, aramayla birlikte çalışır. Sonuç yoksa "‘xyz’ adında villa yok" + "Aramayı temizle". Arama ve süzgeç bellekte: villaya
  girip dönünce yerinde, uygulama kapanınca sıfır. Arama / süzgeç varken sürükleyerek sıralama kapalı.
- **Villa sayfası üst kartı (Görev 40.1):** solda villa adı, konum, Boş/Dolu etiketi; sağda büyük kare kapak fotoğrafı
  (`--vb-foto`), içerikle dikey ortalı. Fotoğrafa dokununca tam ekran galeri açılır. Fotoğraf yoksa yerinde `villa-bos` görseli
  ve "Fotoğraf ekle" (dokununca fotoğraf ekleme; düzenleyemeyen kullanıcıda yalnız görsel). Kartta alt satır yok: sıradaki
  giriş / çıkış hemen alttaki "Sıradaki" kartında, bilgi tek yerde.
  - Ad sığmazsa (bir kelime sütuna sığmıyor ya da üç satıra iniyor) fotoğraf 96 pt'ye iner; yine sığmazsa adın yazısı %5'lik
    adımlarla en çok %70'e küçülür. Kelime hiçbir zaman kesilmez; tek kelime %70'te de sığmıyorsa ad kartın tam genişliğine
    çıkar, fotoğraf altına iner (`vbFotoBoy`, JS).
  - Boş/Dolu etiketi ("Dolu · Ad Soyad") kesilmez: sütun darsa iki satıra iner (köşe 1rem).
- **Yükleniyor (Görev 31.7):** dönen çark yerine iskelet (gri kutu, yazı yerine yuvarlak çizgiler).
  - Yalnız veri 300 ms'de gelmezse görünür (`--iskelet-gecikme`); göründüyse en az 400 ms kalır (`--iskelet-en-az`, `iskeletBitir`).
  - Üstünde 1,6 sn'lik yavaş, doğrusal parlama dolaşır (`--iskelet-parlama`); "Hareketi azalt"ta sabit.
  - Villalarım: gerçek kart sınıflarıyla çizilir; son açılışın yerleşimi (listenin yeri, kart boyları) cihazda saklanır (`vt-isk-ana`),
    iskelet aynı yerleşimle gelir. Veri gelince hiçbir şey kaymaz. Ajanda yüklenirken boş hâl değil iskelet görünür.
  - Villa takvimi ve Gelir&gider verisi villa listesiyle birlikte gelir; ayrı yükleniyor hâlleri yok.
- **Kaydet düğmesi** (`kaydetIs`): basınca hemen "Kaydediliyor…", ikinci basış engellenir. Başarılı olunca bildirim çıkar. Hata olursa
  düğme eski hâline döner, altında kırmızı, okunur bir açıklama ve "Tekrar dene" çıkar.
- **Hata (Görev 31.9):**
  - Kullanıcıya teknik mesaj gösterilmez ("Failed to fetch", "JWT", "500", tablo adı, İngilizce sunucu mesajı). Hepsi
    `kullaniciHatasi(e, varsayılan)` ile sade bir Türkçe cümleye çevrilir (İngilizcesi dil.js'de); sunucunun yazdığı Türkçe
    açıklamalar ("Yetkiniz yok." vb.) olduğu gibi kalır.
  - Yanında "Tekrar dene" olur (`yukleHata`, `kaydetIs`).
  - Hata mesajı hatanın olduğu yerde gösterilir (alanın altında, listenin yerinde); ekranın en üstünde değil.
  - Form hatası (`alanHata`): hatalı alan kırmızı çerçeve alır, sayfa o alana kayar, alan 2 kez hafifçe titrer (±4 pt, 300 ms,
    `--hiz-titreme`). "Hareketi azalt"ta titreme yok. Yazmaya başlayınca kırmızı kalkar.
- **Çevrimdışı:**
  - üst çubuğun altında sakin şerit: "Çevrimdışı · değişiklikler bağlanınca kaydedilecek";
  - bağlantı gelince kendiliğinden kaydedilir.
- **Başarı (Görev 31.6):**
  - kısa bildirim ("… kaydedildi", `tamam()`): bildirimdeki tik ikonu çizilerek gelir (`stroke-dashoffset`, 350 ms `--hiz-tik`,
    100 ms gecikmeyle), çizim bitince `basari` titreşimi;
  - rehberde ✓ kartı;
  - **ilk** rezervasyon, **ilk** villa ve **ilk** gönderilen teklif için hesap başına bir kez sade kutlama kartı (`ilkAn`): büyük ikon,
    bir cümle, tek ana düğme ve "Kapat". Konfeti yok. Kart 260 ms (`--hiz-kutlama`) ile `scale(.96)`'dan gelir. Açık panel varsa
    panel kapanınca çıkar. Görülenler cihazda, hesaba göre saklanır (`vt-ilk-<hesap>`); hesapta zaten birden çok kayıt varsa
    (eski kullanıcı) çıkmaz. Ölçüm: `ilk_an {tur}`.

- **Tam ekran panel** (Görev 27, `.maSheet`): ekranın tamamını kaplayan, köşesiz panel; alttan kayarak açılır. Alttaki
  sabit satır (`.altSabit`) özeti ve tek ana düğmeyi taşır. Çok adımlı işlerde (tarih seç → sonuç) ekran değişmez, panelin içi
  değişir; "‹ Tarihleri değiştir" ile geri dönülür.
- **Kural uyarısı olan kart** (ör. en az gece sağlanmıyor): kart soluk zeminli ve kesik çerçeveli, üstünde şarap kırmızısı
  etiket; işlem yine yapılabilir (karar sahibin). Metin soluklaştırılmaz (kontrast korunur).

## 7b. Dış takvimler (Görev 32)

- **Takvimde dış blok:** `--muted` tonunda çapraz çizgi (`.cell.dis`), ilk gecede ve hafta başında kaynağın kısa adı ("Airbnb");
  "kapalı" türü daha soluk (`.disKapali`) ve üstünde "kapalı". Bizdeki rezervasyona bağlanmış satış normal rezervasyon gibi,
  yanında küçük kaynak etiketi (`.dtEt`).
- **Kaynak rozeti** (`dtRozet`): harf + renk (Airbnb şarap, Booking lacivert, Vrbo mavi, Villasepeti yeşil, diğer gri). Marka logosu
  kullanılmaz.
- **Tazelik satırı** takvimin üstünde: "Airbnb, Booking · 2 dk önce kontrol edildi"; 1 saattir okunamayan takvim kırmızı
  ("Villasepeti 2 saattir okunamıyor"), yalnız o zaman dokunulur.
- **Ayırma hapı** formun üstünde: "Bu tarihler 10 dk sizin için ayrıldı · 9:41" (`--tutma-sure`, `--tutma-kontrol`).
- **Kontrol listesi** (Kaydet): her site bir satır, dönen gösterge; sonuç gelince 40 ms kademeli ✓ / ✕ / ⚠ (`--kontrol-kademe`),
  en az 600 ms görünür (`--kontrol-en-az`). Satış çakışırsa kırmızı kutu ve "Yine de kaydet" YOK; yalnız kapalıysa `--uyari` renkli
  soru.
- **Çakışma kartı:** Villalarım'ın en üstünde, kapatılamaz, `--uyari` çerçeve ve düğme. Uyarı işareti emoji değil, Lucide
  `uyari-ucgen`.
- **Bulunma eki:** site adlarına `ekDe()` ("Airbnb'de", "Vrbo'da").

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
