# Villa Takvimim: tam denetim (Görev 26.5)

_Claude Code, 17 Kasım 2026. Stil kuralları: `docs/STIL.md`._

## Nasıl yapıldı

- **Uygulama:** 43 durum, 3 boyutta (360×740, 390×844, 430×932) gezildi.
  - Ekranlar, paneller, boş veriyle ekranlar, giriş ekranı, çevrimdışı ve İngilizce dahil.
  - Her durum için ekran görüntüsü ve uzun ekranlarda tam boy görüntü alındı.
- **Misafir sayfası (g.html):** Türkçe ve İngilizce, 3 boyutta, sayfa boyunca kaydırılarak denetlendi.
- **Otomatik denetim:** her ekranda aşağıdakiler arandı:
  - 13 px'ten küçük yazı;
  - WCAG AA kontrastı (normal yazı 4,5, büyük yazı 3);
  - kalın yazı;
  - 48 pt'den küçük dokunma alanı;
  - ekrandan taşma ya da kesilen yazı;
  - emoji;
  - Lucide (`ikon()`) dışı ikon.
- **Kodun taranması:**
  - terimler ve hitap;
  - animasyon süre ve eğrileri;
  - silme / iptal işlemlerinde "Geri al";
  - boş, yükleniyor ve çevrimdışı durumları;
  - rehber kapsamı.
- **Gözle inceleme:** görüntüler kontak sayfalarında incelendi.
- **Görseller:**
  - önce: `qa/gorev26/denetim-once/390/`;
  - sonra: `qa/gorev26/denetim/<boyut>/`;
  - düzeltmelerin testi: `qa/gorev26/duzeltme/`.

Öncelik: **Ö1** kritik (veri kaybı, işi yapamama) · **Ö2** önemli (okunurluk, tutarlılık, eksik yardım) · **Ö3** güzel olur.

## Ö1 ve Ö2: bulgular ve durum

| # | Ekran | Sorun | Öneri / yapılan | Öncelik | Görüntü (önce → sonra) | Durum |
|---|---|---|---|---|---|---|
| 1 | Rezervasyon → Ödemeler → ödeme kaydı | "Bu ödemeyi sil" onaysız ve geri dönüşsüz siliyor. | Diğer silmelerdeki gibi 5 saniyelik "Geri al" bildirimi; geri alınca ödeme aynı yere döner. | Ö1 | `duzeltme/geri-al/odeme-kaydi-390.png` → `odeme-silindi-390.png` | ✓ yapıldı |
| 2 | Gelir & gider → kayıt | "Kaydı sil" onaysız ve geri dönüşsüz siliyor. | "Gelir silindi" / "Gider silindi" + Geri al; liste yenilenir. | Ö1 | `duzeltme/geri-al/gider-kaydi-390.png` | ✓ yapıldı |
| 3 | Her ekran, internet yokken | Çevrimdışı olduğu hiçbir yerde görünmüyor. Kayıt iki kez sessizce deneniyor, sonra "Buluta kaydedilemedi" penceresi teknik hata metniyle ("Failed to fetch") çıkıyor. İnternet gelince kendiliğinden kaydetmiyor. | Üst çubuğun altında sakin şerit: "Çevrimdışı · değişiklikler bağlanınca kaydedilecek". Ağ hatasında pencere yok; bağlantı gelince bekleyen değişiklik kendiliğinden kaydediliyor ("Değişiklikler kaydedildi."). Sunucunun kendisi hata verirse "Tekrar dene"li pencere eskisi gibi. | Ö1 | `denetim-once/390/38-cevrimdisi.png` → `duzeltme/cevrimdisi/serit-390.png`, `baglandi-390.png` | ✓ yapıldı |
| 4 | Fotoğraflar → seçip sil | Onay var ama Geri al yok (diğer silmelerle tutarsız). | Onay kaldı + Geri al (fotoğraflar aynı sıraya döner). Fotoğraf dosyası sunucudan silinmediği için geri almak güvenli. | Ö2 | `duzeltme/geri-al/foto-silindi-390.png` | ✓ yapıldı |
| 5 | "Geri al" bildirimi | Düğmesi 44 pt. | 48 pt; İngilizcede "Undo". | Ö2 | — | ✓ yapıldı |
| 6 | Misafir sayfası (g.html), her yerde | İkincil yazı rengi (#6B7C85) beyazda 4,33, açık gri zeminde 4,02: AA'nın altında. Gün adları, açıklamalar, künye, kişi / oda etiketleri, açıklama satırı. | #5B6A72: beyazda 5,60, açık gride 5,20. | Ö2 | `denetim-once/390/g-normal.png` → `denetim/390/g-normal.png` | ✓ yapıldı ✓ 18 Kasım (gece görevi): Teklifler'de çizim + açıklama, Bakıcılar'da açıklama. |
| 7 | Misafir sayfası takvimi | Fiyatlar 8 px, gün adları 11 px. | Fiyat 11 px (takvim hücresi istisnası, STIL.md), gün adları 13 px. | Ö2 | aynı | ✓ yapıldı |
| 8 | Misafir sayfası | "Soru sormak için yazın" düğmesi 42 pt; üst konum yazısı 12 px. | 48 pt; 13 px. | Ö2 | aynı | ✓ yapıldı |
| 9 | Alt menü (Villalar · Takvim · Hesap) | Etiketler 12 px. | 13 px. | Ö2 | `denetim-once/390/01-villalarim.png` → `denetim/390/01-villalarim.png` | ✓ yapıldı |
| 10 | Villa takvimi | Gün adları (Pt Sa Ça…) 12 px, açıklama satırı (Dolu, Boş, Bugün…) 12 px. | 13 px (açıklama satırında satır arası da açıldı). | Ö2 | `…/04-villa-ekrani.png` | ✓ yapıldı |
| 11 | Fiyatlar → Aylar | "Geçen yıl: …" yazısının kontrastı 2,96. "geçmiş" etiketi 12 px. | İkincil renk (5,9); etiket 13 px. | Ö2 | `…/12-fiyat-aylar.png` | ✓ yapıldı |
| 12 | Fiyatlar → Günler | Dolu günde misafirin baş harfleri 9 px, soluk. | 11 px (hücre istisnası), daha belirgin. | Ö2 | `…/13-fiyat-gunler.png` | ✓ yapıldı ✓ 18 Kasım: metin düz, "Gizlilik metnini açın" ayrı satırda 48 pt (yalnız kayıt modunda). |
| 13 | Fotoğraflar | "Kapak" etiketi 11 px (villa ekranındaki küçük şeritte 9 px). "Birden fazla seç" 44 pt. | 13 px; 48 pt. | Ö2 | `…/23-fotograflar.png` | ✓ yapıldı ✓ 18 Kasım: yalnız görünümde ilk harf büyük. |
| 14 | Gelir & gider | Kutulardaki "+ … depozito" alt yazıları 12 px. "Gider ekle" / "Gelir ekle" 44 pt. | 13 px; 48 pt. | Ö2 | `…/19-gelir-gider.png` | ✓ yapıldı |
| 15 | Boş günleri paylaş | "En az kaç gece" − / + düğmeleri 44 pt; villa bilgilerindeki oda sayaçları 40 pt. | 48 pt. | Ö2 | `…/36-boslari-paylas.png` | ✓ yapıldı |
| 16 | Giriş ekranı | "Zaten hesabın var mı? Giriş yap": uygulamanın geri kalanı "siz" diyor. Düğme 44 pt. Alttaki "Gizlilik ve kişisel veriler" bağlantısı 19 pt yüksekliğinde. | "Zaten hesabınız var mı? Giriş yapın", 48 pt; bağlantı 48 pt. | Ö2 | `…/03-giris.png` | ✓ yapıldı |
| 17 | Villa bilgileri, fotoğraflar | Kullanıcıya görünen 5 yerde "Misafir sayfası"; uygulamanın her yerinde "Villa sayfası". | Hepsi "Villa sayfası" (İngilizceleri de). | Ö2 | — | ✓ yapıldı |
| 18 | Kurallar (SSS / şablon) | "Kalan tutar"; her yerde "Kalan ödeme". | "Kalan ödeme". | Ö2 | — | ✓ yapıldı |
| 19 | Misafirler (hiç misafir yokken) | "Bu filtreye uyan misafir yok." yazıyor: yanlış ve kafa karıştırıcı. Üstünde işe yaramayan "Birden fazla seç", arama ve süzgeçler. | Çizimli boş durum + "Henüz misafiriniz yok…" + "Rezervasyon ekle" (villa ekranına dönüp rezervasyonu başlatır). Seçim, arama ve süzgeç gizli. | Ö2 | `denetim-once/390/41-bos-misafirler.png` → `duzeltme/bos/misafirler-390.png` | ✓ yapıldı |
| 20 | Rehber kapsamı | Yardımlı modda rehberi olmayan işlemler: aşağıdaki "Rehber kapsamı" tablosu. | 9 yeni rehber. | Ö2 | `duzeltme/rehber/` | ✓ yapıldı |
| 21 | Kodun tamamı | Gezilen ekranlarda görünmeyen 17 kuralda daha 12 px yazı vardı (rozet, hatırlatma satırı, kurulum alt yazısı, kutu etiketleri, yönetici / bakıcı listeleri); iki büyük tutar piksel olduğu için yazı boyutu ayarıyla büyümüyordu. | Hepsi 13 px; tutarlar rem. | Ö2 | — | ✓ yapıldı |

**Bilerek istisna tutulanlar (STIL.md'ye yazıldı):**
- Takvim hücrelerinin içindeki fiyat ve baş harfler 11 px. Hücre 46–60 pt genişliğinde; "10.000₺" 13 px'te sığmıyor.
- Seçim panelinin kalın yeşil başlığı ve toplamı (Görev 20.5'te izin verildi).
- Takvim ızgaralarının hücreleri (gün seçimi): fiyat takviminde 360'ta 47 pt.
- Onay kutusunun içindeki satır içi "Gizlilik metnini" bağlantısı: kutunun kendisi 48 pt.

## Rehber kapsamı

| İşlem | Önce | Şimdi | Nasıl başlar |
|---|---|---|---|
| Rezervasyon, teklif, opsiyon, fiyat, ödeme al / gir, gider, fotoğraf ekle, Drive, bakıcı daveti, villa sayfasını paylaş | vardı | aynı | Yardımlı modda kendiliğinden |
| **Gelir ekle** | yok | açıklama → tutar → kaydet, "Gelir kaydedildi" | Yardımlı modda kendiliğinden |
| **Rezervasyon formu (PDF) gönderme** | yok | "Formu misafire göndermek için dokunun." | Yardımlı modda kendiliğinden |
| **Rezervasyon ayrıntısı:** ödeme alma, depozito iadesi, PDF form | yok | 3 adım (olmayan adım atlanır) | panel başlığındaki "?" |
| **Opsiyon → Rezervasyona çevir**, süreyi uzat | yok | 2 adım | panel başlığındaki "?" |
| **Teklif → Rezervasyona çevir**, tekrar gönder | yok | 2 adım | panel başlığındaki "?" |
| **Villa bilgileri:** odalar, kurallar, konum bağlantısı | yok | 3 adım | panel başlığındaki "?" |
| **Villa sayfasını yayından kaldırma** | yok | paylaşma yardımının 2. adımı | paylaş panelindeki "?" (kendiliğinden başlayan paylaş rehberi aynı kaldı) |
| **Misafirler: toplu teklif** | yok | Birden fazla seç → misafirleri seç → Teklif hazırla | ekran başlığındaki yeni "?" |
| **Fotoğraflar: sıralama, kapak, silme** | yok | basılı tutup sürükle → Birden fazla seç → Kapak yap / Sil | ekran başlığındaki yeni "?" |

Ayrıntı ve ekranlarda gezinme panellerinde rehber her açılışta kendiliğinden gelmiyor. Bir rezervasyona her bakışta rehber çıkması can sıkardı. Bu panellerde Görev 22'deki "?" var. Bilgi veren bu rehberler kalınan adım bilinmiyorsa baştan başlıyor (`bastan`).

## Kontrol listesi, madde madde

1. **Stil uyumu:**
   - 4 düğme türü ve renk tablosu tutarlı.
   - Emoji yok.
   - Bütün ikonlar `ikon()` (Lucide); yeni "bağlantı yok" ikonu da Lucide `wifi-off`.
   - Kalın yazı yalnız izinli seçim panelinde.
   - Uygulama logosu (üst çubuk, giriş) bilerek SVG.
2. **Okunabilirlik:**
   - 13 px altı yazı yalnız takvim hücrelerinde kaldı (istisna).
   - Kontrast hatası kalmadı. Önce: fiyat ekranında 1, misafir sayfasında (390) 22 öğe.
3. **Dokunma:** 48 pt altı düğme kalmadı (ızgara hücreleri ve satır içi bağlantı hariç).
4. **Terimler:**
   - "Kalan ödeme", "Konaklama ücreti", "Hasar depozitosu", "Kapora", "Bakıcı", "Villa sayfası" tek ada indirildi.
   - Hitap her yerde "siz".
5. **Boş durum:**
   - Villalarım, Takvim sekmesi, Fotoğraflar ve Sıradaki çizimli ya da yönlendirmeli.
   - Misafirler düzeltildi.
   - Gelir & gider, Teklifler, Bakıcılar yazıyla boş; düğmeleri var (Ö3).
6. **Yükleniyor / hata / çevrimdışı:**
   - İskelet ekran vardı (`.iskelet`, 400 ms'den kısa yüklemede görünmez).
   - Bağlantı hataları "Bağlantı kurulamadı" + "Tekrar dene".
   - Çevrimdışı şeridi eklendi.
7. **Geri al:** villa silme, opsiyon kaldırma, teklif iptali, fiyat değişikliği, rezervasyon iptali, kural ve oda silmede vardı. Ödeme, gelir/gider ve fotoğraf silmeye eklendi.
   - Bakıcı erişimini kaldırma ve hesap silme bilerek onaylı ve geri alınamaz; sunucu işlemi (Ö3, aşağıda).
8. **Rehber kapsamı:** yukarıdaki tablo.
9. **Gizli özellikler:** aşağıdaki Ö3 listesinde öneriler.
10. **Hareket:**
    - Animasyonların hepsi `--egri-gecis` / `--egri-giris` eğrilerini kullanıyor.
    - Birkaçında sabit süre vardı (280, 150, 600 ms); 26.8'de değişkenlere taşındı.

## Ö3: güzel olur (Zeyd ve Claude seçecek)

| # | Başlık | Ne | Neden |
|---|---|---|---|
| 1 | Takvimde fiyat gösterimi | Hücre fiyatı 11 px. Seçenek: kısa yazım ("8b") ya da "Fiyatları göster / gizle" düğmesi; gizliyken gün numarası büyür. | Yaşlı kullanıcı için en küçük yazı burada. |
| 2 | "Boş günleri paylaş" daha görünür | Şimdi Villa sayfası panelinin içinde. Villa ekranında, boş gün çoksa "Boş günlerinizi misafirlere gönderin" ipucu kartı. | En değerli ama en gizli özelliklerden biri. |
| 3 | Rezervasyon formu (PDF) öne çıksın | Rezervasyon kaydedilince bildirimde "Formu gönder" kısayolu. | Ayrıntı panelinin altında kalıyor. |
| 4 | Yedek hatırlatması | "Verilerimi indir" Hesabım'ın içinde. Ayda bir "Yedek alın" hatırlatması ya da Hesap'ta görünür satır. | Bulunması zor. |
| 5 | Gelir & gider boş hâli | Çizim + "Gelir ekle / Gider ekle" ve "Rezervasyonlar burada toplanır" açıklaması. | Şimdi yalnız "Bu yıl rezervasyon yok." |
| 6 | Teklifler ve Bakıcılar boş hâli | Çizimli boş durum ("Henüz teklif göndermediniz" + ne işe yarar). | Ne olduğu anlaşılmıyor. |
| 7 | Teklif ve opsiyonun ilk kullanımda tanıtımı | Seçim panelinde "Teklif" ve "Opsiyon" ilk görüldüğünde tek satırlık açıklama ("Misafire özel indirimli fiyat gönderir"). | İki özellik de adından anlaşılmıyor. |
| 8 | Takvim sekmesi boşken | Çizimin altına "Rezervasyon ekle" düğmesi. | Boş ekranda ne yapılacağı yazmıyor. |
| 9 | ~~Sabit animasyon süreleri~~ | ✓ 26.8'de yapıldı: bütün CSS süreleri `:root` değişkenlerinde. | — |
| 10 | Bakıcı erişimini kaldırmada Geri al | Onay yerine 5 sn Geri al (erişim 5 sn sonra kaldırılır). | Tutarlılık. |
| 11 | Fiyat takvimi hücreleri 360'ta 47 pt | Hücre yüksekliği aynı, yatay boşluk azaltılarak 48'e. | Dokunma. |
| 12 | Giriş ekranındaki satır içi "Gizlilik metnini" bağlantısı | Ayrı satıra alınsın. | Dokunma alanı 19 pt. |
| 13 | Misafir sayfasında özellik adları | Veride küçük harfle girilmiş özellikler büyük harfle başlasın. | Görünüm. |
| 14 | Çevrimdışıyken bekleyen değişiklik sayısı | Şeritte "2 değişiklik bekliyor". | Güven. |

## Gece görevi kalite turu (18 Kasım 2026)

16 durum (iPhone SE 375 × 667, 360, 390, 430 · Normal ve Çok büyük yazı · gece ve gündüz modu), her durumda 7 ekran yukarıdan aşağı kaydırılarak denetlendi (Villalar, Takvim, Hesap, villa takvimi, rezervasyon ayrıntısı, Gelir & gider, geri dönüş). Görseller: `qa/gorev30/kalite/`.

| Bulgu | Yapılan |
|---|---|
| Destek modu şeridinde ve "Villa sayfanız hazır" başlığında emoji (🛟, 🎉) | Lucide ikonları (`yardim`, `tik-daire`) |
| Hesap satırlarında ikon kutusu uzuyordu (Görev 29.7'deki CSS) | Kural yalnız yazı sütununa uygulanıyor |
| Büyük yazıda e-posta sağ köşede harf harf bölünüyordu | E-posta "Hesabım"ın altında |
| Çok büyük yazıda "Kullanıcılar" kelimesi bölünüyordu | Kelime bölünmez |
| Çok büyük yazıda villa kurulumu satırında "Göster" kesiliyordu | Esnemez |
| iPhone SE'de çok büyük yazıda rezervasyon başlığında "3 gece" iki satıra bölünüyordu | Tek satır |
| İngilizcede "Bugün ve yarın" listesinde "Yarın 16:00 · … giriş yapacak" Türkçe kalıyordu | Çeviri kalıbı eklendi |
| Gece modu | Uygulama bilerek yalnız açık renk; gece modunda da zemin beyaz, okunur (16 durumda doğrulandı) |
| Konsol / sayfa hatası | Hiçbir durumda yok |

Açık kalanlar (Ö3): 1, 2, 3, 4, 5, 7, 8, 10, 11, 14. Hepsi tasarım kararı istiyor; Zeyd'le seçilmeli.

