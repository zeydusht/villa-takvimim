# Görev 8 — Para hesabı, kurulum rehberi ve gezinme

_Hazırlayan: Claude (ürün yöneticisi), 8 Kasım 2026. Zeyd'in kendi denemesinden çıktı._

## Önce oku
- **Kullanıcılarımız çoğunlukla yaşlı, teknolojiden anlamayan villa sahipleri.** Her ekran tek bakışta anlaşılmalı. Karışıklık = müşteri kaybı.
- `docs/GOREV7.md`'de işaretlenmemiş madde varsa önce onları bitir.
- Maddeleri sırayla uygula; biten maddenin kutusunu `[x]` yap.
- Ortak stil: beyaz zemin, siyah yazı, tıklanabilir her şey 2px #5F6A64 çerçeveli, basınca yeşil çerçeve + açık yeşil zemin. **Yazılar kalınlaştırılmaz.** Az ve yerinde renk/emoji serbest (aşağıda yazanlar).
- Yeni/değişen her metni `dil.js`'e (İngilizce) ekle.
- **Veritabanına (Supabase) dokunma.** Bir madde veritabanı değişikliği gerektiriyorsa (yeni sütun, RPC/fonksiyon, izin) o kısmı yapma; `docs/PROJE_DURUMU.md`'ye "Veritabanı için gerekenler" başlığı altında tam olarak ne gerektiğini (SQL taslağıyla) yaz. Claude sohbetten, Zeyd'in onayıyla yapacak.

---

## A. Para hesabı (en önemli bölüm)

### Yeni kural — her yerde aynı
Örnek: 3 gece × 1.000 ₺, kısa konaklama ücreti 5.000 ₺, hasar depozitosu 5.000 ₺, misafir 1.000 ₺ kapora vermiş.

| Ad | Ne | Örnek |
|---|---|---|
| **Konaklama ücreti** | geceler + kısa konaklama ücreti | 3.000 + 5.000 = **8.000 ₺** |
| **Hasar depozitosu** | girişte alınır, çıkışta iade edilir, gelir değildir | **5.000 ₺** |
| **Misafirden alınacak toplam** | konaklama + depozito | **13.000 ₺** |
| **Kalan ödeme** | toplam − alınan her şey (kapora dahil) | 13.000 − 1.000 = **12.000 ₺** |

- Alınan para önce konaklama ücretine sayılır, fazlası depozitoya. Yani: **gelir** = min(alınan, konaklama); **elde tutulan depozito** = alınan − konaklama (0'dan küçük değil).
- **"Ön ödeme" kavramı kalkıyor.** Tek kavram: **Kapora**. Villa bilgilerindeki "Ön ödeme oranı" → **"Önerilen kapora (%)"**; sadece formda öneri olarak kullanılır.
- **"İndirim" alanı kalkıyor.** Fiyat zaten "Değiştir" ile düzenlenebiliyor; ayrı indirim karışıklık yaratıyor. Eski kayıtlarda indirim varsa yükleme sırasında konaklama tutarından düşülüp 0'lansın (toplam değişmesin).
- Eski kayıtlardaki "Depozito alındı" işaretleri yeni modele taşınsın (alınan depozito tutarı ödeme listesine "depozito" notuyla eklensin). Taşımadan sonra mevcut rezervasyonların kalan ödemesi mantıklı olmalı; emin olamadığın durumu PROJE_DURUMU'na yaz.
- Bakıcının gördüğü "kalan ödeme" sunucuda hesaplanıyor (`veri.js` / RPC). Formül değişiyorsa sunucu tarafını değiştirme, "Veritabanı için gerekenler"e yaz; istemci tarafı yeni kurala göre çalışsın.

- [x] **8.1 Tarih seçince fiyat hemen görünsün (telefonda fiyat söyleme).**
  Senaryo: Villa sahibini biri arıyor, "10–16 Kasım kaça?" diyor. Sahip iki güne dokunuyor ve **anında** cevabı görüyor.
  Rezervasyon formunun EN ÜSTÜNDE, isimden önce, büyük ve okunaklı "Ücret" kartı:
  ```
  3 gece × 1.000 ₺                 3.000 ₺   [Değiştir]
  Kısa konaklama ücreti           +5.000 ₺   [Değiştir]
  ─────────────────────────────────────────
  Konaklama ücreti                 8.000 ₺
  Hasar depozitosu                +5.000 ₺   [Değiştir]
  ─────────────────────────────────────────
  Misafirden alınacak toplam      13.000 ₺
  5.000 ₺ depozito çıkışta iade edilir.
  ```
  - Kısa konaklama ücreti sadece gece sayısı sınırın altındaysa görünür; yoksa satır hiç yok.
  - Depozito villa bilgilerinden gelir; 0 ise satır yok.
  - Her "Değiştir" sadece o rezervasyon için tutarı değiştirir.
  - Kartın altında çerçeveli buton: **"Fiyatı mesajla gönder"** → hazır metin (WhatsApp/paylaş): "10–13 Kasım, 3 gece: konaklama 8.000 ₺. Girişte ayrıca 5.000 ₺ hasar depozitosu alınır, çıkışta iade edilir. Toplam 13.000 ₺."
  - Formun sırası: Ücret kartı → Ad soyad, kişi sayısı, telefon → Kapora → Not → Kaydet.

- [x] **8.2 Kapora.**
  "Kapora aldım" düğmesi kalsın. Açılınca tek tutar alanı ve üstünde hazır düğme: **"Önerilen kapora · 2.400 ₺"** (önerilen %'ye göre). Kullanıcı istediği tutarı yazabilir. Altında canlı satır: **"Kalan ödeme: 12.000 ₺"**.
  "Diğer ayrıntılar" bölümü tamamen kalksın (indirim ve ön ödeme gitti).

- [x] **8.3 Rezervasyon detayı sade olsun.**
  Şu an 5–6 satır hesap var (Konaklama, Kısa konaklama, Ara toplam, Depozito, Toplam, Ön ödeme %30, Alınan, Kalan) — göz yoruyor. Yeni düzen:
  - En üstte büyük, tek satır: **"12.000 ₺ alınacak"** (kırmızı). Hepsi alındıysa yeşil **"✓ Ödemenin tamamı alındı"**.
  - Altında 3 sade satır: Konaklama ücreti 8.000 ₺ · Hasar depozitosu 5.000 ₺ (çıkışta iade) · Toplam 13.000 ₺.
  - Altında: "Alınan: 1.000 ₺ (kapora)".
  - "Ara toplam", "Ön ödeme %…" satırları yok.

- [x] **8.4 Ödeme girme.**
  - Buton adı her yerde: **"Alınan ödemeyi gir"** (şu an "Ödeme al").
  - Hazır düğme depozito DAHİL: **"Kalanın tamamı · 12.000 ₺"** (şu an 8.000 diyor, yanlış). Altında küçük: "(5.000 ₺ depozito dahil)".
  - "Ayrıca 5.000 ₺ hasar depozitosu alınacak" cümlesi kalksın.
  - Paneldeki eski "Depozito alındı" düğmesi kalksın (depozito artık toplamın içinde).

- [x] **8.5 Çıkışta depozito iadesi.**
  Çıkış günü geldiğinde (ve sonrasında), elde depozito varsa rezervasyon detayının en üstünde kart:
  **"Depozito 5.000 ₺ sizde. Misafire iade ettiniz mi?"**
  Butonlar: **"İade ettim"** · **"Bir kısmını kestim"** (tutar sorar, sebep notu isteğe bağlı) · **"Hiç iade etmedim"**.
  - Kesilen tutar Gelir & gider'de "Depozitodan kesilen" olarak gelire eklenir; iade edilen hiçbir yere gelir yazılmaz.
  - Takvim sekmesindeki çıkış satırında da küçük hatırlatma: "Depozito iadesi bekliyor".
  - Seçim geri alınabilsin (detayda "Depozito: iade edildi · değiştir").

- [x] **8.6 Gelir & gider'i yeni kurala uydur.**
  Depozito gelir sayılmaz (kesilen kısım hariç). "Kalan ödemeler" toplamı depozito dahil kalan tutarı gösterir, alt satırda "x ₺'si depozito".

## B. Villa kurulum rehberi (adım adım)

- [x] **8.7 "Villanızı hazırlayın" adım adım sihirbaz olsun.**
  İnsanlar ekranda aşağı inip neyi nereye gireceğini bulamıyor; onları biz yönlendiriyoruz. "Villa ekle"den hemen sonra ve kurulum kartındaki **"Devam et (2/6)"** butonundan açılan tam ekran sihirbaz. Üstte ilerleme çubuğu ve "2/6". Her adımda tek soru grubu, altta büyük **"İleri"**, yanında "Geri" ve küçük "Şimdilik atla". Her adım girildiği an kaydedilir; çıkıp dönen kaldığı adımdan devam eder.
  1. **Villa adı** ve konumu (örn. "Kalkan, İslamlar")
  2. **Kaç kişilik?** Kişi, yatak odası, banyo (− / + butonlarıyla)
  3. **Nesi var?** Özellikler ve olanaklar (emojili kutucuklar, 8.9)
  4. **Fiyatlar:** "Hafta içi gecelik", "Hafta sonu gecelik" (önümüzdeki 12 aya uygulanır, sonra ay ay değiştirilebilir), kısa konaklama ücreti + kaç gecenin altında, hasar depozitosu, önerilen kapora %
  5. **Fotoğraflar:** "Google Drive bağlantısını yapıştırın" (mevcut Drive aktarma) veya "Telefondan seç". En az 4 fotoğraf önerilir.
  6. **İletişim ve paylaşım:** WhatsApp numarası → villa sayfası oluşturulur → "Bağlantıyı paylaş"
  Son ekran: 🎉 **"Villanız hazır!"** + "Takvime git" ve "Başka villa ekle".
  - Villa ekranındaki kurulum kartı bu adımların durumunu göstermeye devam etsin (eksikleri uyarması çok iyi, kalsın).

- [x] **8.8 Villa bilgilerinde önemli alanlar üstte.**
  Sihirbaz dışında Villa bilgileri ekranı açılınca en üstte **"Fiyat ve iletişim"** bölümü: Kısa konaklama ücreti, Hasar depozitosu, Önerilen kapora %, WhatsApp numarası. Sonra konum, kapasite, özellikler, açıklama.

- [x] **8.9 Özellik ve olanaklara emoji.**
  Kutucukların başına emoji ekle (paylaşım sayfasında da aynısı). Örnek eşleme (eksikleri sen tamamla, tek bir tabloda tut):
  🏊 Özel havuz · 🌿 Korunaklı havuz · ♨️ Isıtmalı havuz · 🧒 Çocuk havuzu · 🛁 Jakuzi · 🌊 Deniz manzarası · ⛰️ Doğa manzarası · 🅿️ Otopark · 🤫 Sessiz konum · 🚗 Araç gerekli · 👶 Bebek ekipmanı · ♿ Engelli erişimi · 🧊 Buzdolabı · 🍽️ Bulaşık makinesi · 🧺 Çamaşır makinesi · ❄️ Klima · 📶 Wi-Fi · 🔥 Mangal · 📺 Televizyon

- [x] **8.10 Fotoğraflar alanı.**
  - Villa ekranındaki fotoğraf küçük resimleri çerçeveli olsun (ortak 2px çerçeve).
  - Fotoğraf yoksa 4 çerçeveli boş kutu, her birinde "+" ve yol gösteren yazı: **"Dış görünüş"**, **"Havuz"**, **"Salon"**, **"Yatak odası"**. Üstte: "En az 4 fotoğraf ekleyin · 0/4". Kutuya dokununca fotoğraf ekleme açılır (Drive dahil).

- [x] **8.11 "Villa sayfası" kartı canlı görünsün.**
  Şu an çok boş. Hafif yeşil zemin, solda 🌐, başlık "Villa sayfanız", altında durum ("Yayında · son güncelleme bugün" / "Henüz yayında değil"). Uyarılar ("Villa bilgileri yarım", "Önümüzdeki günler için fiyat girilmemiş") aynen kalsın — çok iyi.

## C. Misafirlere mesaj

- [x] **8.12 Hitap: "Hasan Bey", "Beyza Hanım".**
  - Tüm hazır mesajlarda (toplu mesaj, teklif, rezervasyon onayı vb.) `{isim}` yerine **ilk ad + Bey/Hanım**: "Merhaba Hasan Bey,".
  - Cinsiyet, uygulama içine gömülü yaygın Türkçe ad listesinden bulunur (en az ~300 erkek, ~300 kadın adı; ayrı bir js dosyasında). Listede yoksa (yabancı ya da unisex ad) sadece ilk ad: "Merhaba John,".
  - Tahmin yanlış olabilir: misafir kartında **"Hitap: Bey / Hanım / Sadece ad"** seçici olsun, seçim misafire kaydedilsin.
  - Mesaj önizlemesi gönderilmeden ÖNCE gerçek adla görünsün (şu an seçim ekranında "Merhaba {isim}" yazıyor).

## D. Gezinme ve Takvim

- [x] **8.13 Geri tuşu her zaman geldiğin yere dönsün.**
  - Takvim sekmesinde bir satıra dokununca rezervasyon detayı **Takvim'in üstünde** açılsın; kapatınca Takvim'de kalınsın. Villaya geçmesin. Detayda isteğe bağlı küçük "Villaya git" butonu olabilir.
  - Hesap → Kullanıcılar → kullanıcının villası (destek) → geri: Hesap'taki kullanıcı listesine dönsün (şu an dönmüyor).
  - Genel kural: basit bir gezinme yığını tut; uygulama içi geri, Android geri tuşu ve kenardan kaydırma aynı yığını kullansın.

- [x] **8.14 Takvim satırları anlaşılır olsun.**
  - Satır başındaki sağ/sol oklar anlaşılmıyor → yerine yazılı etiket: yeşil çerçeveli **"Giriş"**, gri çerçeveli **"Çıkış"**.
  - "Şu an konaklayan"da çıkışa kalan süre etiketi: bugün → kırmızı **"Bugün çıkış"**; yarın → turuncu **"Yarın çıkış"**; 2 gün → turuncu **"2 gün sonra çıkış"**; daha uzun → gri "5 gün sonra çıkış".

## E. Yönetici ve bakıcı

- [x] **8.15 Destek modu belli olsun ve tam yetkili olsun.**
  - Ekranın en üstünde sabit, tam genişlik sarı şerit: **"🛟 Destek modu · Ahmet Yılmaz'ın villasına bakıyorsunuz"** + sağda çerçeveli **"Çık"**. Şu anki küçük sarı yazının yerine.
  - Destek modunda yönetici, villa sahibinin yapabildiği HER ŞEYİ yapabilsin: Gelir & gider (görme, ekleme, silme), ödemeler, fiyatlar, rezervasyonlar, fotoğraflar. Sahip arayıp "şu gideri gir" dediğinde girebilmeli.
  - Veritabanı izinleri buna izin vermiyorsa: istemci tarafını hazırla, gereken izni "Veritabanı için gerekenler"e yaz.
  - `gizlilik.html`'e bir cümle: "Destek istediğinizde yöneticimiz sorunu çözmek için villa kayıtlarınızı görüntüleyip düzenleyebilir."

- [x] **8.16 Bakıcı daveti: kod + bağlantı.**
  Kod kalsın, yanına bağlantı eklensin; ikisi birlikte gönderilsin.
  - Bağlantı: `<uygulamanın web adresi>/?davet=123456`. Web adresi tek bir sabitten okunsun (şimdilik GitHub Pages test adresi; Zeyd sonra kesinleştirecek).
  - Bağlantıya tıklayan giriş yapmamışsa: kod hatırlansın → kayıt/giriş sonrası otomatik katılım → "Villa Salta'ya bakıcı olarak katıldınız ✓".
  - Davet ekranında tek büyük buton: **"WhatsApp'ta gönder"** → hazır metin: "Villa Salta'ya bakıcı olarak katılmak için bu bağlantıya dokunun: … (Kod: 123456)".
  - Uygulama yüklüyken bağlantının doğrudan uygulamayı açması (universal link / app link) bu görevde değil; PROJE_DURUMU "Sonraki fazlar"a yaz.

## F. Genel görünüm

- [x] **8.17 Kapatma (X) butonları.**
  Tüm X butonları: 44×44px dokunma alanı, 2px #5F6A64 yuvarlak çerçeve. Basınca daire açık yeşille dolsun (merkezden büyüyen dolgu, ~150ms) ve hafif küçülsün; sonra kapansın. Tıklandığı hissedilsin.

## G. Paylaşım sayfası (g.html — misafirin gördüğü)

- [x] **8.18 HATA: "+CEV("Temizle")+" yazısı.**
  Tarih seçince yanında `"+CEV("Temizle")+"` diye garip yazı çıkıyor (g.html ~792. satır, tırnaklar karışmış). Düzelt; buton çerçeveli **"Seçimi temizle"** olsun.

- [x] **8.19 Rezervasyon isteğinde fiyat.**
  - 10–12 Kasım seçilince "Fiyat için sorun" çıktı. Nedenini bul: o gecelerin fiyatı girilmişse fiyat görünmeli (yayınlanan sayfaya fiyatlar güncel gidiyor mu kontrol et). Sadece gerçekten fiyatı olmayan gece varsa: "Bu tarihlerin fiyatını villa sahibine sorun".
  - Özet: Konaklama 10.000 ₺ · Kısa konaklama ücreti 5.000 ₺ · **Toplam 15.000 ₺**. Depozito toplama **eklenmesin**; altında ayrı satır: "Girişte 5.000 ₺ hasar depozitosu alınır, çıkışta iade edilir."

---

## Bitince
1. `npx cap sync`, commit, `git push`.
2. `docs/PROJE_DURUMU.md`'yi güncelle: Görev 8'de ne yapıldı, ne kaldı, **"Veritabanı için gerekenler"** listesi.
3. Zeyd'e 5-6 maddede, teknik olmayan dille ne değiştiğini yaz; denemesi gerekenler: yeni rezervasyonda fiyat kartı, kapora → kalan ödeme, çıkışta depozito iadesi, kurulum sihirbazı, Takvim'den detay açıp kapatma, bakıcı davet bağlantısı.
