# Görev 16 — Açılış animasyonu ve Wise'tan uyarlamalar

_Hazırlayan: Claude (ürün yöneticisi), 15 Kasım 2026. Kaynak: Zeyd'in Wise uygulaması ekran kaydı (kare kare incelendi). Wise'ın renklerini, logosunu, fontunu, ekranlarını KOPYALAMIYORUZ; hareket fikrini ve düzen kalıplarını kendi yeşil temamız ve ikonlarımızla uyguluyoruz._

## Önce oku
- **Netlify'a yükleme YOK.** Bitince sadece commit + push (test linki: GitHub Pages).
- Görev 9 hareket kuralları geçerli (`--hiz-*`, "Hareketi azalt" açıksa animasyon yok). Görev 11–12 renk/ikon kuralları geçerli.
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

## Wise açılışı nasıl çalışıyor (ölçüm, ~1,8 sn)
1. Koyu zemin, ortada logo (sistem açılış ekranı).
2. Logo yerinde sabit dururken **ekranın altından yeşil, hap şeklinde bir şerit yükseliyor**; şeridin tepesinde koyu bir daire içinde yukarı ok. Şerit yükseldikçe arkasında kalan gövde renkli bir desenle dolu (sanki desen yukarı doğru "çiziliyor"). ~0,6 sn.
3. Şerit ekranın tepesine varınca **yanlara açılıp tüm ekranı desenle kaplıyor**. ~0,3 sn.
4. Desen ~0,25 sn içinde soluyor, altından ana ekran beliriyor (hafif yukarı kayarak).

---

## A. Açılış

- [x] **16.1 Açılış deseni (Codex).** `codex exec` ile tek görsel ürettir (Görev 11.9'daki yöntem), `www/img/acilis-doku.webp` olarak kaydet (1080×1920, 200 KB altı, WebP):
  > Abstract vertical background texture for a mobile app launch screen, 9:16. Soft painterly watercolor and gouache strokes inspired by the Mediterranean coast of Kalkan, Turkey at golden hour: turquoise sea, deep green #0B5B57, mint #DCEBE5, bougainvillea pink, warm sand, a touch of terracotta. Flowing diagonal brush strokes, subtle paper grain, rich but calm. No objects, no buildings, no people, no text, no logos. Full bleed, edge to edge.
  Beğenilmezse en fazla 2 kez tekrar dene, en iyisini seç.

- [x] **16.2 Açılış animasyonu.** Uygulama **soğuk açılışta** (ilk yükleme; arka plandan dönüşte değil) ve kullanıcı giriş yapmışsa:
  1. Ekran koyu yeşil `#0B5B57`, ortada uygulama logosu (Capacitor splash ile aynı görünüm; geçiş fark edilmesin — native splash'i web animasyonu hazır olunca gizle: `SplashScreen.hide()`, `launchAutoHide:false`).
  2. Altta, ortada **açık yeşil (`#9FE2BF` civarı, temamızın açık tonu) hap şeklinde şerit** belirip yükselir (genişlik ~64px). Tepesinde 56px koyu yeşil daire, içinde beyaz **ev ikonu** (Lucide `house`; ok değil, bizim işimiz ev). Şeridin gövdesi `acilis-doku.webp` ile dolu (`background-attachment` gibi sabit: desen kaymaz, şerit onu açığa çıkarır). Süre 550 ms, `cubic-bezier(.2,.8,.2,1)`.
  3. Daire ekranın üstüne çıkıp kaybolurken şerit yanlara açılır, tüm ekran desen olur. 300 ms.
  4. Desen 250 ms'de solar; aynı anda ana ekran %96'dan %100'e büyüyerek ve 12px aşağıdan yukarı kayarak belirir.
  - Toplam ~1,4 sn. Ekrana dokunulursa animasyon anında biter (atlanabilir).
  - Ana ekran verisi arka planda bu sırada yüklenir; veri hazır değilse 3. adımda bekler (en fazla 1,5 sn, sonra iskelet ekran).
  - "Hareketi azalt" açıksa: logo → 200 ms solma → ana ekran.
  - Web'de (test linki) de çalışsın ama sadece ilk açılışta (sessionStorage ile; try/catch).
  - Tek bir JS modülünde, CSS animasyonlarıyla (`transform` + `clip-path`; layout tetikleyen özellik yok, 60 fps).

- [x] **16.3 Face ID ile kilit (sadece uygulamada).** Hesap → "Güvenlik" bölümü: **"Uygulamayı Face ID / parmak izi ile kilitle"** aç/kapa (varsayılan kapalı). Açıksa soğuk açılışta ve 5 dakikadan uzun arka planda kalınca: koyu yeşil ekranda logo + sistem Face ID sorusu; başarılı olunca 16.2 animasyonu başlar (Wise'taki sıra). Başarısızsa "Tekrar dene" ve "Şifreyle giriş" (çıkış yapıp giriş ekranına döner). Eklenti: `@aparajita/capacitor-biometric-auth` (ya da güncel ve bakımlı başka bir eklenti; seçtiğini PROJE_DURUMU'na yaz). Web'de bu ayar görünmesin. iOS için `NSFaceIDUsageDescription` Info.plist metni: "Villa Takvimim'i Face ID ile açmak için."

## B. Wise'tan düzen kalıpları

- [x] **16.4 Hızlı işlem hapları (ana ekran ve villa ekranı).** Wise'ta bakiyenin altında yan yana yuvarlak hap butonlar var (Send · Add money · Request…), ilki dolu yeşil. Bizde:
  - Villa ekranında başlık kartının altında yatay kaydırılabilir hap sırası: **+ Rezervasyon** (dolu yeşil) · **Teklif** · **Opsiyon** · **Fiyat gir** · **Paylaş**. Her biri ikonlu, 40px yükseklik, tam yuvarlak köşe. Mevcut büyük üç butonun yerine geçer.
  - Ana ekranda (Villalarım) aynı tarzda: **+ Villa ekle** · **Takvim** · **Teklifler**.

- [x] **16.5 Yuvarlak eylem butonları (rezervasyon detayı).** Wise kart ekranındaki gibi (Show PIN · Card details · Freeze): 56px yuvarlak açık renkli daire içinde ikon, altında küçük yazı, yan yana 4 tane. Rezervasyon detayında: **Ara** · **WhatsApp** · **Ödeme gir** · **Düzenle**. "Rezervasyon formu (PDF)" ve "İptal et" bunların altında liste satırı olarak kalır.

- [x] **16.6 Bölüm başlığında "Tümünü gör".** Listelerin başlık satırında sağda yeşil küçük bağlantı: "Yaklaşan rezervasyonlar · **Tümünü gör**", "Teklifler · **Tümünü gör**", Gelir & gider bölümleri. Altta ayrı "Tümünü gör" butonu varsa kaldır.

- [x] **16.7 Kapatılabilir ipucu kartları.** Wise'taki "Get ready to spend · Add money ✕" kartları gibi: ana ekranda en fazla 1 kart, sağ üstte ✕, içinde tek cümle + tek buton. Örnekler (koşula göre, öncelik sırasıyla): "Fotoğraf ekleyin · Misafirler önce fotoğraflara bakar → Fotoğraf ekle" · "Önümüzdeki ay fiyatları girilmemiş → Fiyat gir" · "Turizm izin belge numaranızı ekleyin → Ekle" · "Bakıcınızı ekleyin, girişleri o takip etsin → Davet et". Kapatılan kart 30 gün çıkmaz (cihazda sakla, try/catch).

- [x] **16.8 Aşağı çekip yenile.** Ana ekran, villa ekranı ve Takvim sekmesinde en üstteyken aşağı çekince: dönen yenile ikonu (Lucide `refresh-cw`, yeşil) belirir, bulut verisi yeniden yüklenir, bitince "✓ Güncel" bildirimi. Başka cihazdan girilen rezervasyonu görmek için.

- [x] **16.9 Büyük rakamlı detay başlığı.** Wise işlem detayında üstte ortada büyük tutar ve altında durum etiketi var. Bizde ödeme kaydı detayında ve teklif detayında: ortada 36px tutar, altında durum etiketi (Alındı / Açık / Süresi doldu), altında tarih. Rezervasyon detayındaki "12.000 ₺ alınacak" satırı da ortalı ve 30px olsun.

---

## Bitince
1. `npx cap sync` (yeni eklentiler için), commit, `git push`. **Netlify'a yükleme yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Zeyd'e 5 maddede teknik olmayan dille yaz. Not: Face ID ve gerçek açılış ekranı sadece yüklü uygulamada (APK/TestFlight) denenebilir; açılış animasyonu test linkinde de görünür (ilk açılışta, sekmeyi kapatıp yeniden açınca).
