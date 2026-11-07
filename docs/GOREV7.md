# Görev 7 — İlk kullanım turu 2

_Hazırlayan: Claude (ürün yöneticisi), 7 Kasım 2026. Sahte verilerle (2 villa, 3 rezervasyon) telefon boyutunda (390px) gezilerek bulundu._

## Nasıl çalışılacak
- Maddeleri sırayla uygula; her biri bitince başındaki `[ ]` kutusunu `[x]` yap.
- Ortak çerçeveli stili koru: tıklanabilir her şey 2px #5F6A64 çerçeveli, basınca yeşil çerçeve + açık yeşil zemin.
- **Yazılar kalınlaştırılmaz.** Belirginlik çerçeveyle verilir.
- Yeni veya değişen her metni `dil.js`'e (İngilizce) de ekle.
- Kodu `www/` içinde düzenle.

---

## A. Hatalar (önce bunlar)

- [x] **7.1 Takvim sekmesi "Bu hafta" yanlış.**
  Şu an bugünden PAZAR'a kadar bakıyor: cumartesi açınca sadece 2 gün, pazar açınca sadece 1 gün görünüyor.
  Örnek: 7 Kasım cumartesi; 9 Kasım çıkış ve 12 Kasım giriş varken "Bu hafta giriş veya çıkış yok" yazıyor.
  - Seçenekler: **"Bugün", "7 gün", "30 gün"** (bugünden itibaren 7 / 30 gün). Kod: `cizAjanda()`, `index.html`.
  - Boş mesajlar: "Önümüzdeki 7 günde giriş veya çıkış yok." / "Önümüzdeki 30 günde giriş veya çıkış yok."
  - Listenin en üstüne **"Şu an konaklayan"** bölümü ekle: villa · misafir · "çıkış 9 Kasım". Satıra dokununca rezervasyon detayı açılsın.

- [x] **7.2 "Gelir" iki farklı şey için kullanılıyor.**
  Villa ekranı Kasım için "BU AY GELİR 68.000 ₺" diyor (rezervasyon tutarı), Gelir & gider ekranı aynı ay için "Gelir 0 ₺" diyor (alınan para). Kullanıcı hangisine inanacağını bilemiyor.
  - Villa ekranındaki kutu: başlık **"BU AYIN REZERVASYONLARI"**, büyük rakam toplam tutar, altında "Alınan 10.000 ₺".
  - Kural: "gelir" kelimesi sadece **alınan para** için kullanılsın.

## B. Görünüm kuralları

- [x] **7.3 Kalın yazıyı kaldır.**
  Tüm buton, sekme ve seçici yazıları şu an kalın (Rezervasyon, Ödeme al, Villa ekle, Aylar/Günler, Ay/Yıl/Tümü…). Hepsi font-weight 400–500 olsun. Yeşil zeminli ana butonlar kalabilir, yazıları kalın olmasın.

- [x] **7.4 Yazı alanları çerçeveli kutu olsun.**
  Şu an tüm input'lar sadece alt çizgi; ilk kez kullanan alanın orada olduğunu fark etmiyor (Rezervasyon formu, Ödeme al, Villa bilgileri, Misafir arama).
  - 2px #5F6A64 çerçeve, köşe yuvarlak, en az 48px yükseklik, odaklanınca yeşil çerçeve.
  - Etiketler küçük BÜYÜK HARF yerine normal yazı: "AD SOYAD" → "Ad soyad".

- [x] **7.5 Dolu sanılan örnek yazılar.**
  Villa bilgilerinde Kişi "8", Yatak odası "4", Banyo "4", Büyüklük "180" örnek yazıları gerçek değer gibi görünüyor. Sayı alanlarında örnek yazı (placeholder) olmasın, alan boş görünsün.

- [x] **7.6 Çerçevesiz tıklanabilirler.**
  - Villa bilgilerindeki özellik/olanak düğmeleri (Özel havuz, Jakuzi, Buzdolabı…) çerçevesiz gri. Çerçeveli yap; seçilince yeşil çerçeve + açık yeşil zemin + solda ✓.
  - Misafirler listesindeki satırlar dokunulabiliyorsa çerçeveli kart olsun.

- [x] **7.7 Tek başına duran "Seç".**
  Fiyatlar ve Misafirler ekranında sağ üstte yalnız "Seç" yazısı var; ne yaptığı anlaşılmıyor ve başlığın üstünde boşluk açıyor.
  Başlığın altına çerçeveli buton olarak taşı: Fiyatlar'da **"Birden fazla ay seç"**, Misafirler'de **"Birden fazla seç"**.

- [x] **7.8 Kesilen yazılar.**
  - Villa ekranı: "Mehmet Demir · kalan ödeme 3…"
  - Gelir & gider: "Ayşe Yılmaz · 4 – 9 …"
  - Villa ekranı Fiyatlar satırı: sağdaki "Fiy…"
  Kural: **tutar ve tarih asla kesilmez**, gerekirse alt satıra iner. Fiyatlar satırının sağındaki "Fiyat gir" yazısını kaldır, sadece ok kalsın.

- [x] **7.9 Kırmızı sadece sorun için.**
  Fiyatlar ekranında aylık "Fiyat yok" kırmızı; gri **"Fiyat girilmedi"** olsun. Kırmızı sadece kalan ödeme ve hata için kullanılsın.

- [x] **7.10 Yüzde biçimi ve doluluk hesabı.**
  - Gelir & gider "Sezon özeti"nde "1%" yazıyor, villa ekranında "%53". Her yerde Türkçe biçim: **"%1"** (İngilizcede "1%").
  - "Doluluk (bugüne kadar) 3 / 310 gece" 1 Ocak'tan sayıyor, yanıltıcı. Villanın **ilk rezervasyonundan** bugüne hesapla.

## C. Rezervasyon ve ödeme

- [x] **7.11 Rezervasyon detayı.**
  - Ek ücret / indirim yoksa "Konaklama · 5 gece 38.000" ve "Toplam 38.000" aynı rakamı tekrarlıyor → sadece "Toplam" kalsın.
  - Ön ödeme tamamlanmadıysa satırda **"1.400 ₺ eksik"** yazsın (örnek: ön ödeme 11.400, alınan 10.000); tamamsa **"✓ alındı"**.
  - "Ödeme al / güncelle" → **"Ödeme al"**, ve butonların EN ÜSTÜNE taşı (en sık yapılan iş).

- [x] **7.12 Ödeme al paneli.**
  - Üstteki özet satırı iki satıra bölünüyor. Yan yana üç küçük kutu yap: **Toplam · Alınan · Kalan**.
  - Ön ödemenin bir kısmı alındıysa da hazır düğme çıksın: **"Ön ödeme kalanı · 1.400 ₺"**.
  - "Alınan ödemeler" listesindeki satıra dokununca düzenle/sil açılsın; açılıyorsa satırı çerçeveli yap ki belli olsun.

## D. Sadeleştirme

- [x] **7.13 Tekrar eden butonlar.**
  - Gelir & gider: satırlarda "+" varken en alttaki "+ Gelir" / "+ Gider" fazla → kaldır.
  - Boş villada "Fiyat gir" 3 yerde var (kurulum kartı, üst buton, Fiyatlar satırı) → kurulum kartı açıkken üstteki "Fiyat gir" butonu gizlensin.

- [x] **7.14 Boş villa ekranı.**
  - Rezervasyonu olmayan villada Doluluk %0 / 0 ₺ / — kutuları gizlensin.
  - Fiyatı olmayan her günün altındaki "—" işaretini kaldır (30 çizgi gürültü yapıyor).
  - Hafta sonu günleri gri gölgeli ama renk açıklamasında yok, geçmiş günlerle karışıyor → gölgeyi kaldır.

- [x] **7.15 Küçük metinler.**
  - Villa ekranı: "Misafirler · 3 kişi" → **"3 misafir"**.
  - Misafirler listesi: şu an konaklayan için "son 9 Kasım" değil **"Şu an konaklıyor · çıkış 9 Kasım"**.
  - Ana ekran "Bugün ve yarın" kartı neden orada olduğunu söylemiyor: "Kalan ödeme · Ayşe Yılmaz · 28.000 ₺" → **"Çıkış 9 Kasım · Ayşe Yılmaz · 28.000 ₺ alınacak"** (giriş ise "Giriş …").
  - Villa kartı avatarı: baş harf alınırken "Villa" kelimesini atla (Villa Salta → S, Villa Defne → D). Şu an hepsi "V".

- [x] **7.16 Küçük düzeltmeler** (PROJE_DURUMU.md'de açık duruyordu).
  - Alt menünün arkasından içerik/grafik görünmesin: menü zemini opak ve en üstte.
  - Kurulum kartındaki "Gizle" en az 44px dokunma alanı olsun.

---

## Bitince
1. `npx cap sync`, commit, `git push` → Android ve iOS derlemeleri kendiliğinden başlar.
2. `docs/PROJE_DURUMU.md`'yi güncelle: Görev 7'de ne yapıldı, ne kaldı.
3. Zeyd'e neyin değiştiğini 5-6 maddede, teknik olmayan dille yaz; denemesi gereken yerleri söyle (özellikle Takvim sekmesi ve Ödeme al).

## Sonra (bu görevde YAPMA — Zeyd seçecek)
Cleanup uygulamasından çıkan fikirler, ayrı görev olacak:
ödeme zaman çizelgesi (rezervasyon detayında), alt menüde sayı rozetleri, villa kartında doluluk çubuğu,
ayar satırlarına ikon, Hesap'ta "Yardım" (sık sorulan sorular), "Başka bir villa sahibine öner" + sürüm numarası,
Face ID kilidi, işlemlerde hafif titreşim, ilk açılış tanıtım sayfaları, bildirim izninden önce kendi açıklama ekranımız.
