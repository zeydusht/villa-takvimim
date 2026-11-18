# GÖREV 31 — Tasarım dili 2.0: hareket, his ve netlik

Amaç: yeni özellik eklemek değil. Mevcut uygulamayı, iyi tasarımcıların dikkat ettiği ince ayrıntılarla daha akıcı, daha "pahalı" ve yaşlı kullanıcı için daha net hissettirmek.

Önce `docs/STIL.md` dosyasını oku. Bu görevde değişen her değeri **önce `:root` değişkenine, sonra STIL.md'ye** yaz. Kodun içine sabit sayı gömme.

## Dayanak (neden böyle?)

- **Sık yapılan işte hareket az olmalı, seyrek yapılan işte hareket olabilir** (Apple HIG Motion, Emil Kowalski, Rauno Freiberg). Takvimde gün seçmek günde onlarca kez yapılır, hareketi kısa olmalı. Panel açmak ara sıra yapılır, orada kademeli giriş her seferinde oynayabilir.
- **Kademeli girişte öğeler arası fark 30–80 ms olmalı.** 100–200 ms aralık listeyi ağırlaştırır: 6 öğede 1 saniyeyi geçer. Her öğenin kendi süresi 200–260 ms.
- **Kapanış açılıştan hızlı olmalı.** Örnek: açılış 340 ms, kapanış 220 ms.
- **Hareket hiçbir zaman beklemeye zorlamamalı.** Animasyon sürerken de dokunma çalışmalı ve animasyon yarıda kesilebilmeli.
- **Yaşlı kullanıcı için** (JMIR 2023 sistematik derlemesi, 27 öneri):
  - her dokunuşa net ve belirgin bir geri bildirim verilmeli (sadece hafif renk değişimi fark edilmez);
  - "?" gibi simgelerin bilindiği varsayılmamalı;
  - ikonların yanında yazı olmalı;
  - her ekranda güvenli bir çıkış yolu olmalı;
  - yazı büyük olmalı;
  - her ekranda tek bir öne çıkan iş olmalı.
- **Her ekranın 5 hâli tasarlanmalı:** dolu, boş, yükleniyor, hata, yarım (Scott Hurff, UI Stack).

---

## 31.1 Hareket değişkenlerini güncelle

- Yeni eğri `--egri-cekmece: cubic-bezier(.32,.72,0,1)`. Alttan açılan paneller için iOS benzeri çekmece eğrisi.
- `--hiz-ac` 220 → **340 ms** (panel açılışı, `--egri-cekmece` ile).
- `--hiz-kapa` 180 → **220 ms** (`--egri-gecis`).
- Arka plan kararması açılışta 240 ms, kapanışta 200 ms, sadece saydamlık değişsin.
- Bildirim (toast): geliş 300 ms, gidiş 200 ms. Yeni bildirim gelince eskisi yarıda kesilip yer değiştirsin (keyframe değil transition kullan).
- **Hiçbir şey `scale(0)`'dan büyümesin.** Küçük açılır kutular `scale(.96)` + saydamlıktan gelsin ve dokunulan yerden büyüsün (`transform-origin` = tetikleyen düğme). Ortadaki onay pencereleri ortadan büyüsün.
- Ölçü: STIL.md'deki hareket tablosunu yeni değerlerle güncelle.

## 31.2 Paneller her açılışta kademeli gelsin

**Paneller:** alttan açılan bütün paneller (`.sheet`), takvim seçim paneli, rezervasyon detayı, ödeme akışı adımları, müsaitlik sonuçları.

**Davranış:** her açılışta panelin içindeki ilk düzey öğeler yukarıdan aşağı sırayla gelsin:
- her öğe 8 pt aşağıdan ve saydamdan, **240 ms**, `--egri-giris`;
- öğeler arası **40 ms**;
- ilk öğe panel açılmaya başladıktan **60 ms** sonra;
- en fazla 6 kademe (sonrakiler 6. öğeyle birlikte gelir).

**Kurallar:**
- Aynı panel açıkken içerik yeniden çizilirse kademeli giriş **tekrar oynamasın**. Sadece değişen satır `--hiz-parla` ile parlasın.
- Kademeli giriş sürerken bütün düğmeler hemen basılabilir olsun.
- "Hareketi azalt" açıksa öğeler kaymasın, sadece 150 ms saydamlıkla gelsin.

**Sekmeler** (Villalarım, Takvim, Ajanda, Gelir&gider) sık açılıyor. Onlarda kademeli giriş bugünkü gibi oturumda bir kez kalsın. Tek fark: uygulama arka plandan 10 dakikadan uzun süre sonra öne gelirse o ekranda bir kez daha oynasın.

## 31.3 Basma hissi

- Bütün dokunulabilir öğelerde basınca `scale(.97)` olsun:
  - basış 120 ms `--egri-giris`;
  - bırakış 200 ms;
  - renk ve çerçeve tepkisi bugünkü gibi kalsın.
- Takvim günü sık basılır. Orada büyüyüp küçülme olmasın, sadece 100 ms renk ve çerçeve değişimi.
- Seçim yapılan menüde seçilen satır, menü kapanmadan önce **120 ms** ana renkte parlasın. Kullanıcı neyi seçtiğini görür.
- Hover efektleri sadece `@media (hover:hover) and (pointer:fine)` içinde olsun. Telefonda "yapışık hover" kalmasın.

## 31.4 Titreşim dili (sadece iOS/Android uygulamasında, ayar açıksa)

`VTNative.titret` için tek bir eşleme tablosu yap ve her yerde onu kullan:

| Olay | Titreşim |
|---|---|
| Kaydetme, ödeme alma, villa ekleme başarılı | `basari` |
| Silme, iptal | `sil` |
| Hata, eksik alan | `uyari` |
| Takvimde aralığın ikinci gününü seçme, sekme değiştirme, anahtar açıp kapama | yeni `secim` (Haptics `selectionChanged`) |
| Uzun basma başladı, sürükleme bir yere oturdu | `hafif` |

Kural: titreşim tek başına bilgi taşımasın, her zaman görsel bir geri bildirimle birlikte gelsin.

## 31.5 Para ve sayılar

- Para, tarih, kişi ve gece sayısı gösterilen her yerde `font-variant-numeric: tabular-nums` kullan. Rakam değişince yazı zıplamasın.
- Değişen toplam (seçim paneli toplamı, Gelir&gider büyük tutarı, ödeme sonrası kalan) eski değerden yeniye **sayarak** geçsin:
  - 450 ms, `--egri-giris`;
  - ara değerler binlik ayraçla;
  - "Hareketi azalt" açıksa direkt yeni değer.
- Para birimi her yerde aynı biçimde olsun: `12.300 ₺` (boşluk, sonra ₺). Uygulamada ve misafir sayfasında farklı yazılan yer varsa düzelt.

## 31.6 Başarı anları (en güzel an en çok hatırlanır)

- Rezervasyon kaydedilince bildirimdeki tik ikonu çizilerek gelsin: `stroke-dashoffset` 350 ms ile, ardından `basari` titreşimi.
- **İlk** rezervasyon, **ilk** villa ve **ilk** paylaşılan teklif için hesap başına bir kez, sade bir kutlama kartı göster. Örnek: "İlk rezervasyonunuz kaydedildi. Misafirinize villa sayfasını göndermek ister misiniz?" Bir düğme ve bir "Kapat". Konfeti yok. Kart 260 ms ile `scale(.96)`'dan gelsin.
- Hangi "ilk"in görüldüğünü cihazda sakla. Ölçüm olayı: `ilk_an {tur}`.

## 31.7 Yükleniyor hâli

- Villalarım, Ajanda, Gelir&gider ve takvim için dönen çark yerine **iskelet** (gri kutu, yazı yerine yuvarlak çizgiler) göster. Yerleşim dolu hâliyle birebir aynı olsun ki veri gelince hiçbir şey kaymasın.
- İskelet sadece veri **300 ms içinde gelmezse** görünsün (hızlıysa hiç yanıp sönmesin). Bir kez göründüyse en az 400 ms kalsın.
- İskelette yavaş bir parlama dolaşsın (1,6 sn, doğrusal). "Hareketi azalt"ta sabit kalsın.
- Kaydet düğmesine basınca: düğme hemen "Kaydediliyor…" olsun ve ikinci basış engellensin. Başarılı olunca bildirim çıksın. Hata olursa düğme eski hâline dönsün ve altında kırmızı, okunur bir açıklama ile "Tekrar dene" çıksın.

## 31.8 Boş hâller

Her liste ve ekranın boş hâlini tek tek kontrol et. Her birinde şunlar olsun:
1. büyük, sakin bir Lucide ikon (zemin `--soft`, 48 pt);
2. tek cümle açıklama;
3. **tek** bir ana düğme.

Örnekler:
- **Villa yok:** "Henüz villa eklemediniz." [Villa ekle]
- **Bugün ve yarın giriş-çıkış yok:** "Bugün ve yarın giriş ya da çıkış yok." (düğme yok)
- **Gelir&gider boş:** "Bu dönemde kayıt yok." [Gider ekle]
- **Müsaitlik aramasında sonuç yok:** "Bu tarihlerde boş villa yok." [Tarihleri değiştir] ve altında en yakın boş tarih önerisi (varsa).
- **Ödemeler boş:** "Henüz ödeme alınmadı." [Ödeme al]

## 31.9 Hata hâlleri

- Kullanıcıya teknik mesaj gösterilmesin ("Failed to fetch", "JWT", "500" vb.). Hepsi sade Türkçe ve İngilizce bir cümleye çevrilsin, yanında "Tekrar dene" olsun.
- Hata mesajı hatanın olduğu yerde gösterilsin (alanın altında). Ekranın en üstünde değil.
- Form hatası: hatalı alan kırmızı çerçeve alsın, sayfa o alana kaysın ve alan 2 kez hafifçe titresin: ±4 pt, 300 ms. "Hareketi azalt"ta titreme olmasın.

## 31.10 Okunurluk (yaşlı kullanıcı)

- Gövde yazısını **16 → 17 px** yap (iOS'un varsayılan gövde boyutu). "Normal" yazı boyutu ayarı bunu temel alsın. Değişince bütün ekranları iPhone SE ve "Çok büyük" ayarında kontrol et, taşma olmasın.
- En küçük yazı (etiket, rozet, alt menü) **13 → 14 px** olsun. Takvim hücresi içi istisna kalabilir.
- Satır yüksekliği gövdede 1.45, başlıklarda 1.2.
- Serif başlıklarda `letter-spacing:-.01em`.
- **"?" yardım düğmeleri:** yalnız "?" yerine "? Nasıl?" yazan bir hap kullan. Araştırma, yaşlı kullanıcının "?" işaretini yardım olarak tanımayabileceğini gösteriyor. Dar yerde sadece "?" kalabilir, ama erişilebilirlik etiketi "Yardım" olsun.
- Tek başına anlam taşıyan bütün ikonların yanında yazı olsun (üst çubuktaki geri oku hariç).

## 31.11 Her ekranda tek bir öne çıkan iş

Bütün ekranları ve panelleri gez:
- Dolu yeşil (`.big` ana) düğmeden **en fazla bir tane** olsun. Fazlası varsa ikincisini `renkli` ya da `ghost` yap.
- Ekranın en önemli rakamı ya da işi en büyük ve en üstte olsun.
- Her panelde görünür bir kapatma ya da "Vazgeç" olsun (güvenli çıkış).

Bulduğun her durumu `docs/qa/gorev31/README.md` dosyasına "ekran → ne vardı → ne yaptım" diye yaz.

## 31.12 Mekânsal tutarlılık ve kesilebilirlik

- İleri giden ekran sağdan gelsin, geri dönen sola gitsin (bugünkü gibi). Alttan açılan panel aşağı kaydırarak kapansın.
- Panel kapanışı hız eşiği: parmak hızı **0,11 px/ms**'yi geçerse mesafe yetmese de kapansın.
- Panelin üst sınırından yukarı çekilirse direnç göstersin (lastik etkisi). Mesafe ne kadar uzarsa o kadar az gitsin.
- Hiçbir animasyon sırasında `pointer-events:none` kalmasın. Kapanmakta olan panele yeniden dokunulursa kapanış durup panel geri açılsın.

## 31.13 Yavaş çekim modu ve video kaydı (benim incelemem için)

- Adrese `?yavas=3` eklenince bütün CSS süreleri ve JS animasyon süreleri 3 ile çarpılsın. Sadece test içindir, kullanıcıya hiçbir yerde görünmesin.
- Playwright ile, iPhone 15 boyutunda ve **normal hızda**, şu akışların videosunu kaydet ve `docs/qa/gorev31/video/` klasörüne koy:
  1. Uygulama açılışı → Villalarım
  2. Takvimde 2 gün seçip seçim paneli → Rezervasyon kaydet → başarı
  3. Rezervasyon detayı aç → Ödeme al akışı
  4. Müsaitlik araması → sonuçlar
  5. Gelir&gider ekranı → Ay/Yıl değiştirme (sayarak geçiş)
  6. Boş hesap: villa yok ekranı
  7. Ağ kapalıyken bir kaydetme hatası
- Aynı akışların bir de `?yavas=3` ile çekilmiş hâlini kaydet.

## 31.14 Test

- Mevcut bütün Playwright testleri geçmeli.
- "Hareketi azalt" açıkken bütün akışlar çalışmalı, kayan öğe olmamalı.
- Normal, Büyük ve Çok büyük yazıda, iPhone SE ve iPhone 15'te taşma ya da üst üste binme olmamalı.
- Konsolda hata olmamalı.

---

Her alt adımı ayrı commit'le. Netlify'a yayın yok.

Bitince çok kısa bir özet yaz ve en alta test linkini koy: https://zeydusht.github.io/villa-takvimim/
