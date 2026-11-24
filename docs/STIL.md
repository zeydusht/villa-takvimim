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
- **Birim:** bütün yazı boyutları ve boşluklar `rem`. Piksel kullanılmaz; Hesap → Görünüm'deki yazı boyutu ayarı kökü ölçekler
  (Görev 31.10, `--yazi-kok`):
  - Normal %106,25 = **17 px** (iOS'un varsayılan gövde boyutu);
  - Büyük %119,5 (≈ 19 px);
  - Çok büyük %132,8 (≈ 21 px).
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
- Aşağı çekme: mesafe 90 pt'yi (`--cek-mesafe`) geçerse ya da parmak hızı 0,11 px/ms'yi (`--cek-hiz-esigi`) geçerse kapanır.
- Panelin üst sınırından yukarı çekilirse lastik etkisi: panel parmağı izler ama mesafe uzadıkça daha az gider; bırakınca yerine döner.
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
    | `--g3d-bolum` | sayfa / panel başlığının sağı (Misafirler, Gelir & gider, Teklifler paneli) | 56 pt |
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
  - Sekme başlıkları (Görev 37.1, 38.2): yazı sayfanın tam ortasında, görsel hemen solunda; arada 10 pt, dikey ortalı. Üç sütun
    (`1fr · yazı · 1fr`): görsel ortalamaya dahil değil, gelip gidince yazı kımıldamaz. Yazı hiç bölünmez, kesilmez: sol sütun
    darsa görsel önce küçülür (en az 48 pt), sonra gizlenir. Alt satırdaki etiketler ve "+ Villa ekle" sola yaslı kalır. Görselin dolu kısmı ile alttaki öğe arasında en az 8 pt (`--alt`: görselin
    alttaki şeffaf payı; başlığın alt boşluğu buna göre).
    Görsel görünür mü kararını JS verir (Görev 38.1, `baslikGorselDurum` → `h1.gorselGizli`): ekranda büyük boş hâl görseli
    gerçekten görünüyorsa ya da görsele 48 pt yer kalmıyorsa gizlenir. CSS `:has()` / container sorgusu kullanılmaz; sonuç
    kaydırmaya bağlı kalmaz. Gizlenip gelmesi `--hiz-ac`.
    Yer daralırsa önce görsel küçülür, yazı bölünmez; 36 pt'nin altına inince görünmez. Villalarım'da dolu / boş etiketleri "+ Villa ekle" ile aynı satırın sağ ucunda; sığmazsa alt satırda, sola yaslı (Görev 37.2).
    Kaydırınca başlık görseli üst çubuğa girdikçe söner (üst %10'u şeffaf kenar, oraya kadar tam), yarısı girince görünmez.
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
