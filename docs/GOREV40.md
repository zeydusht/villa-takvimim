# Görev 40 — Villa kartı, ana sayfa arama, giriş/çıkış renkleri, ödemeler ekranı

Bu görev Zeyd'in telefonda bulduğu şeylerden çıktı.

**Kurallar:**
- Veritabanına dokunma. Bildirimlerle ilgili veritabanı kısmını (`docs/VERITABANI_GOREV40.sql`) PM uyguluyor, sen sadece istemciyi yap.
- Deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.

---

## 40.1 — Villa sayfasının üst kartı

1. **Tekrarlanan satırı kaldır.** Kartta "Bugün 16:00'da kk lev girecek" satırı var. Hemen altındaki "SIRADAKİ · Bugün · 16:00 · kk lev girecek" kartı aynı şeyi söylüyor. Üst karttaki bu alt satırı kaldır. Sıradaki kartı yoksa da üst kartta bu satır olmasın, bilgi tek yerde dursun.
2. **Villa fotoğrafını büyüt.** Sağ üstteki fotoğraf çok küçük, ne olduğu belli olmuyor.
   - Kartın sağ tarafında büyük, kare bir fotoğraf olsun: kart genişliğinin yaklaşık %38'i, 390 pt'de yaklaşık 130 pt, köşeler 16 pt yuvarlak.
   - Dikeyde kartın içeriğiyle aynı yükseklikte dursun. Villa adı, konum ve "Boş/Dolu" etiketi solda kalsın.
   - Fotoğrafa dokununca villanın fotoğraf galerisi açılsın (zaten varsa onu kullan).
   - Fotoğraf yoksa yerinde `villa-bos` 3D görseli dursun, yanında küçük bir "Fotoğraf ekle" yazısı olsun. Dokununca fotoğraf ekleme açılsın.
   - Dar ekranda (320 pt) ve büyük yazıda villa adı sığmazsa fotoğraf 96 pt'ye insin. Ad iki satıra inebilir ama kesilmesin.

## 40.2 — Teklifler bölümünün görseli

Şu anki görsel (`teklif`: ev + kâğıt uçak) "teklif" ile bağdaşmıyor. Yenisini çiz ve "Teklifler" başlığında, boş hâlinde ve teklif sihirbazında kullan.
- **Ad:** `bolum-teklif`.
- **Tarif:** Açık bir mektup zarfı. Zarftan dışarı, üstünde **%** işareti olan yeşil bir fiyat etiketi sarkıyor. Yanında küçük bir takvim yaprağı var. Anlamı: "misafire tarih ve fiyat teklifi gönderildi".
- Ortak stil `docs/CODEX_3D_GORSELLER.md` dosyasında. Dekupe olsun, `-512` ve `-256` boyutlarını üret, isteği `docs/CODEX_3D_GORSELLER_3.md` dosyasına ekle.
- Misafir sayfasındaki `misafir-teklif` görseline dokunma.

## 40.3 — Ana sekme başlıkları: görsel sola yaslı, üstte nefes payı

Villalarım, Takvim ve Hesap başlıkları için:
- **Yazı yeri değişmesin.** Başlık yazısı 38.2'deki gibi sayfanın tam ortasında kalsın.
- **Görsel sola yaslansın.** Görsel artık yazının hemen solunda değil, sayfanın **sol iç kenarına yaslı** dursun. Sol kenarı "Villa ekle" düğmesinin sol kenarıyla aynı hizada olsun. Yer yoksa 38.2'deki gibi önce küçülsün, sonra gizlensin.
- **Üstte boşluk kalsın.**
  - Görselin en üst dolu pikseli ile yeşil üst çubuğun alt kenarı arasında en az 12 pt boşluk olsun.
  - Hesap görseli (anahtarlık) şu an çubuğa değiyor, anahtarlığın sarı halkası çubuğa yapışık. Diğer ikisinde bu sorun yok.
  - Sebebi büyük ihtimalle `baslik-hesap` görselinin kırpımı: üstte şeffaf pay yok. Diğerleriyle aynı üst/alt şeffaf payı olacak şekilde yeniden kırp (`-256` ve `-512`).
  - Üç görsel de aynı görsel ağırlıkta ve aynı dikey konumda dursun.
- **Test:** Üç sekmede de en üst dolu piksel ile üst çubuk arasındaki boşluk ≥ 12 pt olmalı. Görselin sol kenarı "Villa ekle" düğmesinin sol kenarıyla aynı hizada olmalı (±2 pt).

## 40.4 — Villalarım: "Bugün ve yarın" yerine arama

**Neden:** Çok villası olan sahipte "Bugün ve yarın" listesi uzuyor ve villalar aşağıda kayboluyor. Bu bilgi zaten Takvim → Ajanda'da ve her villanın "Sıradaki" kartında var.

- Villalarım sekmesindeki **"Bugün ve yarın" kartını kaldır.**
- Yerine, "Villa ekle" ve "1 dolu / 4 boş" satırının altına bir **arama kutusu** koy.
  - Yer tutucu yazı: "Villa ara".
  - Solda büyüteç ikonu olsun. Doluyken sağda temizleme (×) düğmesi çıksın.
- **Nasıl arar:**
  - Yazdıkça villa kartlarını süzsün. Villa adına ve konumuna baksın.
  - Türkçe harf ve büyük/küçük farkı önemli olmasın: "salta", "SALTA", "Salta" hep bulsun. "i/İ/ı/I", "ş/s", "ç/c", "ğ/g", "ö/o", "ü/u" eşleşsin.
  - Bulunamazsa "‘xyz’ adında villa yok" yazsın, altında "Aramayı temizle" düğmesi olsun.
- **Ne zaman görünür:** Villa sayısı 4 ve üstündeyse görünsün. Daha azsa görünmesin, 2–3 villada gereksiz kalabalık olur.
- **Etiketler süzgeç olsun.** "1 dolu" ve "4 boş" etiketlerine dokununca sadece dolu ya da sadece boş villalar listelensin. Tekrar dokununca süzgeç kalksın. Seçili etiket belli olsun. Arama ve süzgeç birlikte çalışsın.
- **Arama hatırlansın.** Bir villaya girip geri gelince arama yazısı ve süzgeç yerinde kalsın. Uygulama kapanınca sıfırlansın.
- **Rehberi güncelle.** Rehber (`rehber.js`) ya da başka bir kod "Bugün ve yarın" kartına bağlıysa onları güncelle, kırık adım kalmasın.

## 40.5 — Rezervasyon detayı: giriş yeşil, çıkış kırmızı

- Rezervasyon detayında "Giriş" satırı (ikon, tarih, saat) **yeşil** olsun. Uygulamanın giriş yeşili, şu an "Giriş 16:00" etiketlerinde kullanılan renk.
- "Çıkış" satırı **kırmızı** olsun. Uygulamanın uyarı kırmızısı, kalan ödeme yazısındaki ton.
- **Bugün ve yarın vurgusu:**
  - Giriş bugünse girişin yanında dolu yeşil "Bugün" etiketi olsun, yarınsa açık yeşil "Yarın".
  - Çıkış bugünse dolu kırmızı "Bugün" etiketi olsun, yarınsa açık kırmızı "Yarın".
- Renk tek başına anlam taşımasın, ikon ve yazı aynen kalsın (renk körü için).
- Aynı renkleri Ajanda kartlarındaki "Giriş 16:00" / "Çıkış 10:00" etiketlerinde de kullan. Çıkış etiketi kırmızı tonda olsun.

## 40.6 — Alttan açılan pencere: gri alana dokununca kapansın

- Bütün alttan açılan pencerelerde (`perde()` / `.overlay`) arkadaki karartılmış gri alana dokununca pencere kapansın. "Kapat"a basmakla aynı şey olsun, aynı animasyonla.
- **İstisna, yarım kalan form:** Pencerede kaydedilmemiş bir değişiklik varsa gri alana dokunmak hemen kapatmasın. Örnek: yeni rezervasyon, rezervasyon düzenle, ödeme ekle formlarında bir alan değiştiyse. Bunun yerine küçük bir soru çıksın: "Değişiklikler kaydedilmedi. Çıkılsın mı?" Seçenekler "Çık" ve "Devam et".
- Yanlışlıkla kaymayı kapatma sayma: dokunuş gri alanda başlayıp gri alanda bitmeli.
- Rehber bir adım gösterirken (`vt-yardim`) gri alana dokunmak pencereyi kapatmasın.

## 40.7 — Ödemeler ekranı: alınacak / alınan / kalan

**Durum:** Ödemeler eklenerek tutuluyor. 13.000 alınmışken bir de 15.000 yazılırsa toplam 28.000 oluyor. Bu doğru davranış, değişmeyecek. Ama ekran bunu anlatmıyor: "Alınan tutar" kutusu boş geliyor, Zeyd "ödendi ama 0 görünüyor" sanıyor.

Yeni düzen. Ödemeler ekranının en üstünde üç kutucuk yan yana dursun:

| Alınacak | Alınan | Kalan |
|---|---|---|
| 13.000 ₺ (siyah) | 12.000 ₺ (**yeşil**) | 1.000 ₺ (**kırmızı**) |

- **Fazla ödeme:** Fazla alındıysa "Kalan" yerine turuncu "Fazla alındı · 2.000 ₺" yazsın.
- **Ödeme listesi:** Altında alınan ödemeler listesi dursun: tarih, tutar, not. Her satır belli ki dokunulabilir olsun (sağda ok). Dokununca mevcut düzenleme açılsın: tutarı değiştir ya da "Bu ödemeyi sil". Yanlış girilen ödeme buradan düzeltilir.
- **Yeni ödeme kutusu:**
  - Etiketi "Alınan tutar" değil, **"Yeni ödeme"** olsun. Ekleme yaptığı anlaşılsın.
  - İçinde **kalan tutar hazır yazılı** gelsin (1.000). Kişi değiştirebilir.
  - Kalan 0 ise kutu görünmesin. Yerine yeşil "✓ Ödemenin tamamı alındı" yazsın, altında küçük "Ek ödeme ekle" bağlantısı olsun.
- **Bakıcı:** Bakıcı sadece kalanı görür, geçmiş ödemeleri düzenleyemez. Şu anki yetkiler aynen kalsın.
- **Para formatı:** Hepsi aynı para formatında olsun (13.000 ₺).

## 40.8 — Rezervasyon düzenleme: tutar satırları hizalı

Rezervasyon düzenlemede "Konaklama ücreti" satırındaki ₺ işareti taşıyor, satırlar arası boşluklar eşit değil. Bu satırların hepsi aynı hizada olsun:
- Konaklama ücreti
- Ek ücret
- Depozito
- Toplam

**Nasıl:**
- Tutar sütunu sağa yaslı olsun, `font-variant-numeric: tabular-nums`, `white-space: nowrap`.
- ₺ işareti sayıya bitişik olsun (`&nbsp;₺`), alt satıra düşmesin.
- Satır yükseklikleri ve aralıklar eşit olsun.

**Test:** 320 / 390 genişlik, normal ve "Çok büyük" yazı, 7 haneli tutar (1.250.000 ₺). Hiçbir satırda ₺ alt satıra inmesin, satırlar aynı hizada olsun.

## 40.9 — Test ve bitiş

- Her adım için ekran görüntülerini `docs/qa/gorev40/` klasörüne koy.
- Testleri chromium ve **webkit** ile çalıştır.
- 40.4 için otomatik test:
  - "salta" araması "Villa Salta"yı bulsun;
  - "ŞİŞLİ" araması "şişli"yi bulsun;
  - boş arama hepsini göstersin;
  - "dolu" süzgeci sadece dolu villaları göstersin.
- 40.6 için otomatik test: değişmiş formda gri alana dokununca soru çıksın; değişmemiş formda pencere kapansın.
- `docs/PROJE_DURUMU.md` dosyasına Görev 40'ı ekle.
- Mesajının en altına çok kısa özet yaz, altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
