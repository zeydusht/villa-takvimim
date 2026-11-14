# Görev 10 — Netlik ve vurgu turu

_Hazırlayan: Claude (ürün yöneticisi), 14 Kasım 2026. Zeyd'in iPhone'da gerçek kullanımından (ekran görüntüleriyle) + Claude'un eklemeleri._

## Önce oku
- Kullanıcılarımız yaşlı villa sahipleri. Her şey tek bakışta anlaşılmalı; tıklanabilen her şey buton gibi görünmeli.
- Renk sistemi (bu görevde netleşiyor, her yerde aynı kullan):
  - **Koyu yeşil** (tema rengi): ana eylem butonu dolgusu, "dolu" durumu, tamamlandı ✓.
  - **Açık yeşil zemin + koyu yeşil çerçeve**: ikincil eylem butonları.
  - **Turuncu** (#B0761A civarı, açık turuncu zemin): "boş" durumu, uyarı, eksik.
  - **Kırmızı** (#9B2C4A): sadece para alınacak ve hata. Boş villa için KIRMIZI KULLANMA (kalan ödemeyle karışır).
- Yazılar kalınlaştırılmaz. Görev 9'daki süreler (`--hiz-*`) ve "Hareketi azalt" kuralı geçerli.
- Yeni metinleri `dil.js`'e ekle. Veritabanına dokunma.
- Maddeleri sırayla uygula; biten maddenin kutusunu `[x]` yap.

---

## A. Hatalar

- [x] **10.1 Taşan yazı.** Villa ekranındaki ay özeti kutusunda "BU AYIN REZERVASYONLARI" taşıyor ve kesiliyor. Kutu başlığı **"BU AY"**, büyük rakam toplam rezervasyon tutarı, altında **"0 ₺ alındı"**. Üç kutunun hiçbirinde yazı taşmasın; 320px genişlikte de kontrol et.

## B. Villa ekranının üstü

- [x] **10.2 Geri butonu.** Üst çubuktaki küçük "<" ok, 44px yuvarlak, beyaz çerçeveli (yarı saydam beyaz zemin) bir buton olsun. Basınca dolsun (X butonlarındaki gibi).

- [x] **10.3 Villa adı ve durumu.** Villa adı ve durum, çerçeveli tek bir başlık kartında dursun:
  - Villa adı büyük, altında konum (varsa).
  - Durum renkli bir etikette: dolu ise koyu yeşil zemin **"● Dolu · Ayşe Yılmaz"**, boş ise açık turuncu zemin **"● Boş"**.
  - Etiketin altında mevcut alt satır ("Çıkış 9 Kasım 10:00 (2 gün sonra)" / "Sonraki giriş 16 Kasım").

- [x] **10.4 Üç ana buton renkli.** "+ Rezervasyon" koyu yeşil dolgu ve beyaz yazı (en önemli iş). "Fiyat gir" ve "Paylaş" açık yeşil zemin + koyu yeşil çerçeve ve yazı. Diğer beyaz butonlardan ayrılsınlar, temadan çıkmasınlar.

- [x] **10.5 "Bu ay 14 gece boş · Boş günleri paylaş" satırı.** Kalsın ama daha sakin: üç ana butonun ALTINA insin, açık turuncu zeminli ince satır.

## C. Takvim

- [x] **10.6 Ay başlığı ve oklar.** "Kasım 2026" başlığı ile oklar aynı satırda kalsın. Oklar 44px yuvarlak çerçeveli buton olsun (geri butonu gibi), basınca dolsun. Başlığın altı çizilmesin (çizgi bağlantı sanılır).

- [x] **10.7 Geçmiş günlerdeki harfler.** Geçmiş günlerde (ör. 9 Kasım altındaki "D") baş harf de soluk olsun; dolu blok rengi geçmişte %50 soluk.

## D. Villa ekranının altı

- [x] **10.8 Bölüm başlıkları okunaklı.** "YAKLAŞAN REZERVASYONLAR", "FİYATLAR", "VİLLA YÖNETİMİ", "FOTOĞRAFLAR" küçük, soluk, büyük harf. Hepsi normal yazımla ("Yaklaşan rezervasyonlar"), 18–20px, koyu renk; üstünde daha fazla boşluk. Uygulamanın tüm bölüm başlıklarına aynı kural.

- [x] **10.9 Yaklaşan rezervasyonlar net olsun.** Şu an bugünden sonraki ilk 6 rezervasyonu gösteriyor ama bunu söylemiyor. Başlığın yanında küçük açıklama: **"Sıradaki 6"**. 6'dan fazla varsa listenin altında çerçeveli **"Tümünü gör (12)"** butonu (tam liste ekranı, ay ay gruplu). Her satır çerçeveli kart olsun, sağda ok; giriş 7 günden yakınsa satırda turuncu "3 gün sonra" etiketi.

- [x] **10.10 Villa yönetimi satırları.**
  - **Villa bilgileri:** tamamsa sağda yeşil **"✓ Tamam"**; eksikse turuncu **"Eksik · 4/6"** ve altında küçük satır "2 adımı tamamlayın". Dokununca kurulum sihirbazı eksik ilk adımdan açılsın.
  - **Misafirler, Gelir & gider, Bakıcılar:** sağdaki sayı/özet yazıları ("6 misafir", "2 bakıcı", "2026: 8.500 ₺") kalksın; sadece başlık + sağda ok. Daha sade.

- [x] **10.11 Kurulum kartı geri gelebilsin.** "Villanızı hazırlayın" kartı "Gizle" ile tamamen kayboluyor ve bir daha bulunamıyor.
  - "Gizle" kartı tamamen yok etmesin; kart tek satıra küçülsün: **"Villa kurulumu · 4/6 · Göster"**.
  - Ayrıca 10.10'daki "Villa bilgileri · Eksik" satırı da kurulumu açıyor; ikisinden de ulaşılsın.
  - Kurulum 6/6 olunca kart kendiliğinden kalksın.

## E. Ana ekran (Villalarım)

- [x] **10.12 Bugünün özeti renkli.** "Villalarım" başlığının altındaki düz "3 villa · bugün 0 dolu, 3 boş" yazısı yerine iki etiket: yeşil **"● 1 dolu"**, turuncu **"● 2 boş"** (0 olan etiket de görünsün, soluk). Etikete dokununca liste o duruma göre süzülsün (tekrar dokununca hepsi).

- [x] **10.13 Villa kartlarında durum.** Her villa kartındaki "Bugün dolu / Bugün boş" yazısı 10.3'teki renkli etiketle aynı görünsün.

## F. Alt menü

- [x] **10.14 Kayan seçim kabarcığı.** Alt menüde hangi sekmede olunduğu belli olmuyor. iOS'taki gibi:
  - Seçili sekmenin arkasında açık yeşil, yuvarlak köşeli bir kabarcık (hap şekli) dursun; simge ve yazı koyu yeşil.
  - Başka sekmeye dokununca kabarcık o sekmeye kayarak gitsin (`--hiz-ekran`, ease-out).
  - Parmak menü üzerinde sağa/sola sürüklenirse kabarcık parmağı takip etsin, bırakınca en yakın sekmeye otursun ve o sekme açılsın.
  - Hareketi azalt açıksa kayma yok, sadece yer değiştirir.

## G. Misafir sayfası (g.html)

- [x] **10.15 Fiyat özeti.** (Yeni g.html'de toplam zaten depozitosuz; bu düzeni netleştir ve her iki özet yerinde aynı yap: alt çubuk + "Kaç kişi geliyorsunuz?" paneli.)
  ```
  3 gece                          3.400 ₺
  Kısa konaklama ücreti          +5.000 ₺
  ─────────────────────────────────────
  Toplam                          8.400 ₺
  Girişte ayrıca 5.000 ₺ hasar depozitosu alınır, çıkışta iade edilir.
  ```
  - "Ön ödeme (%30)" ve "Kalan ödeme" satırları misafir sayfasında YOK.
  - Gece fiyatları farklıysa "1.133 ₺ / 3 gece" gibi ortalama gösterme; sadece "3 gece". Satıra dokununca gece gece döküm açılsın (14 Kas 1.200 ₺, 15 Kas 1.000 ₺…).
  - Alt sabit çubuktaki tutar da depozitosuz toplam (8.400 ₺).

## H. Canlı siteyi güncelle (Netlify) — EN SON yap

Karar (Zeyd, 14 Kasım): villatakvim.netlify.app artık yeni sürüme geçiyor. Misafir paylaşım linkleri oraya gidiyor ve şu an eski fiyat ekranını gösteriyor. Şu an sadece 2-3 tanıdık kullanıyor, sorun yok.

- [x] **10.16 Netlify'a yeni sürümü yükle.**
  1. `npx netlify-cli login` → tarayıcı açılır. Zeyd'e "Tarayıcıda açılan Netlify sayfasında **Authorize** butonuna bas" de ve bekle.
  2. `npx netlify-cli link` → **villatakvim** sitesini seç (adı villatakvim.netlify.app olan). Bulamazsan `npx netlify-cli sites:list` ile listele ve Zeyd'e sor.
  3. `npx netlify-cli deploy --prod --dir www`
  4. Kontrol: https://villatakvim.netlify.app açılınca yeni sürüm gelmeli (alt menü, yeni misafir sayfası). Bir villanın paylaşım linkinde fiyat özeti 10.15'teki gibi olmalı.
  5. Kullanıcıların telefonda eski sürüm kalmasın: `sw.js` önbellek adını (sürüm) artır, böylece eski önbellek silinir.
  6. GOREVLER.md'deki "Bitince" adımlarına ve bu dosyanın "Bitince"sine kalıcı satır ekle: **her push'tan sonra `npx netlify-cli deploy --prod --dir www`** (site her zaman GitHub ile aynı kalsın).
  7. `docs/PROJE_DURUMU.md`: "Netlify güncellenmeyecek" kararını sil, yerine "14 Kasım: Netlify yeni sürümde; her görevden sonra deploy edilir" yaz. "Veritabanı Adım C" maddesine "Netlify güncellendi, artık yapılabilir — Claude yapacak" notu düş.

---

## Bitince
1. commit, `git push`, sonra `npx netlify-cli deploy --prod --dir www`.
   Kalıcı kural: her push'tan sonra `npx netlify-cli deploy --prod --dir www` (site her zaman GitHub ile aynı kalsın).
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Zeyd'e 5-6 maddede teknik olmayan dille yaz. Denemesi gerekenler: villa ekranının üstü, alt menü kabarcığı (dokunarak ve sürükleyerek), kurulum kartını gizleyip geri açma, ana ekrandaki dolu/boş etiketleri.
