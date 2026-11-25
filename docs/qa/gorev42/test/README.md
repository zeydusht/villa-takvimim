# Okunabilirlik testi (Görev 42.4)

Büyük yazıda kelime bölünmesini, harf harf dar sütunları ve sayfadan taşan yazıyı arar. Yeni bir ekran ya da satır eklenince
çalıştırın; sonuç **0 kirik, 0 dar, 0 taşma** olmalı. Değilse test kırmızı biter (çıkış kodu 1) ve sorunlu yazıları listeler.

## Ne tarar

- **Matris:** varsayılan chromium + 320 + "Çok büyük". İstenirse 320 ve 375 genişlik × "Büyük" ve "Çok büyük" yazı ×
  chromium ve webkit (iOS Safari motoru).
- **Ekranlar:**
  - Villalarım (dolu ve boş);
  - villa sayfasının tamamı (kurulumu bitmemiş villa dahil);
  - rezervasyon detayı, Ödemeler, Rezervasyonu düzenle, Yeni rezervasyon;
  - Teklif, Fiyatlar (aylar, günler, ay paneli), Opsiyon;
  - Takvim (Ajanda, 30 gün, Misafirler);
  - Hangi villam boş (bütün adımlar);
  - Gelir & gider, gider ekle;
  - villa misafirleri, villa bilgileri, villa sayfası paylaş;
  - Hesap'ın tamamı, Hesabım, Bize ulaşın, Kullanıcılar, Özet ve istatistikler, İki adımlı doğrulama;
  - Villa ekleme ve kurulum sihirbazının 7 adımı;
  - misafir sayfası (`g.html`, kök yazı 20 px).
- **Veri:** sahte sunucu verisi; gerçek veritabanına bağlanmaz.

## Kurallar

Kurallar PM'in `TARA` fonksiyonundan alındı (`okunabilirlik.js` içinde aynen duruyor).

- **kirik:** yazının satır sayısı kelime sayısından fazla, yani bir kelime bölünmüş.
- **dar:** 3 ya da daha fazla satıra yayılmış, en uzun kelimesi 5 harften uzun bir yazıda, son satırdan önceki satırlardan biri
  3 harf boyundan (3 × yazı boyu) dar. PM'in kodunda (`rs.some`) son satır da sayılıyordu. Tanımdaki "her satırı dar" ile
  uyumlu olsun diye son satır sayılmıyor; paragrafın kısa son satırı sorun değil. Yalnız son satırı kısa olanlar raporda ayrıca
  sayılır (`yalnizSonSatirKisa`, bilgi için).
- **taşma:** yazı sayfanın sağından ya da solundan taşıyor. Kasıtlı yatay kaydırılan şeritler sayılmaz: villa sayfasındaki
  hızlı işlem hapları, kanal seçimi.
- **İstisna (42.1):** boşluksuz bağlantı adresi, e-posta ve kod bölünebilir (`.dtLink`, `.lsLink`, `.tlLink`, `code`, `#hesapAd`).

## Çalıştırma

1. Yerel sunucu (Netlify gibi uzantısız yollar):

   ```sh
   python sunucu.py 5077 ../../../../www
   ```

2. Testin ihtiyacı: `playwright-core` ve WebKit tarayıcısı (bir kez kurulur). Chromium için bilgisayardaki Chrome kullanılır; yolu
   farklıysa `CHROME=` ile verin.

   ```sh
   npm i --no-save playwright-core && npx playwright-core install webkit
   ```

3. Test:

   ```sh
   node okunabilirlik.js
   ```

   Varsayılan hızlı denetimdir: chromium, 320 genişlik, "Çok büyük" yazı, her ekran bir kez (yaklaşık 2 dakika). En zor durum
   budur; burada temiz olan ekran genelde diğer boyutlarda da temizdir.

   Tam matris (yaklaşık 15 dakika) ya da iOS motoru:

   ```sh
   MOTOR=chromium,webkit BOYUT=320,se YAZI=buyuk,cokbuyuk node okunabilirlik.js
   MOTOR=webkit node okunabilirlik.js
   ```

   - `MOTOR`: `chromium`, `webkit`.
   - `BOYUT`: `320` ya da `se` (375).
   - `YAZI`: `buyuk`, `cokbuyuk`.
   - `SUZ`: ekran adına göre süzer.
   - `GORSEL=<klasör>`: chromium 320 Çok büyük ekran görüntülerini o klasöre kaydeder.
   - `CIKTI=<dosya>`: sonuç JSON'u (varsayılan: geçici klasör).
