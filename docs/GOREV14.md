# Görev 14 — Misafir sayfası netliği, Gelir & gider, küçük düzeltmeler

_Hazırlayan: Claude (ürün yöneticisi), 14 Kasım 2026. Zeyd'in Görev 13 sonrası denemesinden (misafir gözüyle paylaşım sayfasını gezdi)._

## Önce oku
- Misafir sayfası (`g.html`) da uygulamayla aynı dili konuşsun: aynı Lucide ikonları (`ikonlar.js`'i g.html'de de kullan), aynı renkler (yeşil tema, para lacivert, sarı/turuncu yok), yazılar kalın değil.
- Hedef: misafir telefonda sayfayı açınca **3 saniyede** "kaç kişilik, kaç oda, ne kadar, depozito ne kadar, kurallar ne" görsün.
- Yeni metinleri g.html'deki CEV sözlüğüne ve `dil.js`'e ekle. Veritabanına dokunma.
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

## A. Misafir sayfası (g.html)

- [x] **14.1 Villa başlığı.** Villa adı büyük kalsın; altında konum `map-pin` ikonuyla ("📍" değil, Lucide). Adın solunda/üstünde süs gerekmez; onun yerine başlığın hemen altında 14.2'deki künye gelsin.

- [x] **14.2 Künye (4 kişi · 2 yatak odası…) büyük ve net.** Şu an 4 küçük gri kutu, 12px yazı, seçilmiyor.
  - 2 sütunlu ızgara, her kutu: solda 40px yuvarlak açık yeşil daire içinde yeşil ikon, sağda **büyük rakam (22px)** ve altında etiket (15px). Örn. `users` **4** kişi · `door-open` **2** yatak odası · `bath` **2** banyo · `ruler` **180** m².
  - Yatak sayıları (Görev 13.2) varsa ayrı satır: `bed-double` **2** çift kişilik · `bed-single` **1** tek kişilik · `sofa` **1** çekyat.
  - Kutular beyaz zemin + ince çerçeve, gölge yok.

- [x] **14.3 Bölüm başlıkları ikonlu.** Her bölüm başlığının solunda 22px yeşil ikon: **Takvim** (`calendar`, başlığın adı "Uygunluk" değil **"Takvim"** olsun; altına küçük açıklama: "Giriş ve çıkış gününe dokunun") · Ev hakkında (`text`) · Öne çıkan özellikler (`sparkles`) · Ev olanakları (`house`) · Konum (`map-pin`) · Ev kuralları (`list-checks`) · Fiyat (`wallet`, lacivert).

- [x] **14.4 Takvimde seçimi geri alma.** İki tarih seçiliyken:
  - Seçili giriş ya da çıkış gününe **tekrar dokunmak seçimi tamamen temizlesin** ("Seçimi temizle" ile aynı).
  - Seçili aralığın dışındaki bir güne dokunmak yeni seçime başlasın (bugünkü davranış).
  - Takvimin hemen altında, seçim varken görünen küçük çerçeveli **"✕ Seçimi temizle"** butonu (aşağı inmeye gerek kalmasın). Alttaki sabit çubukta da kalsın.

- [x] **14.5 Konum bölümü ikonlu.** Konum adı satırında `map-pin`; havalimanı satırlarında `plane`; kullanıcının eklediği mesafelerde ad'a göre ikon (plaj/deniz → `waves`, market → `shopping-cart`, merkez → `building-2`, restoran → `utensils`, hastane → `cross`, diğer → `map-pin`). Mesafe ve süre sağda, 17px. "Haritada aç" petrol renkli buton, `map` ikonlu, tam genişlik.

- [x] **14.6 Ev kuralları: tek bakışta evet / hayır.** Cümle listesi yerine ikonlu satırlar; her satır: solda konu ikonu + kısa ad, sağda **büyük durum rozeti**:
  - İzin var → yeşil zemin, beyaz `check` + "Serbest"
  - İzin yok → açık kırmızı zemin `#F7E6EB`, kırmızı `x` + "Yasak"
  - Satırlar: `cigarette` **Sigara** · `paw-print` **Evcil hayvan** · `party-popper` **Parti / kalabalık** · `droplet` **Su** (Dahil / Ayrı ücret) · `zap` **Elektrik** (Dahil / Ayrı ücret). Su/elektrik için rozet: "Dahil" yeşil, "Ayrı ücret" gri.
  - Giriş/çıkış saatleri ayrı kutu: `log-in` **Giriş 16:00** · `log-out` **Çıkış 10:00** (yan yana, büyük).
  - Sahibin eklediği kurallar (13.4) altta `info` ikonlu madde listesi.
  - Bu bir aç/kapa düğmesi değil, sadece gösterim; kaydırılır gibi görünmesin.

- [x] **14.7 Hasar depozitosu göze batsın.** Misafir "haberim yoktu" diyemesin:
  - Fiyat özetinin hemen altında ayrı kart: açık lacivert zemin, lacivert çerçeve, solda `shield-check` (28px), içinde **"Hasar depozitosu: 5.000 ₺"** (20px) ve altında "Girişte alınır, hasar yoksa çıkışta iade edilir. Toplam fiyata dahil değildir."
  - Ev kuralları bölümünde de aynı kart (küçük hali).
  - Alt sabit çubukta tutarın altında küçük satır: "+ 5.000 ₺ iade edilen depozito".
  - "Kaç kişi geliyorsunuz?" panelinde ve WhatsApp mesajında da depozito tutarı yazsın.

## B. Uygulama (index.html)

- [x] **14.8 Fiyatlar: "Tüm yıla fiyat gir".** Fiyatlar → Aylar ekranının üstünde **aynı boyutta yan yana iki buton**: **"Birden fazla ay seç"** · **"Tüm yıla fiyat gir"** (lacivert, `calendar-range`).
  - "Tüm yıla fiyat gir" → önce yıl seçimi ("2026" / "2027" düğmeleri; bugünden sonraki aylar) → o yılın tüm ayları seçili olarak fiyat paneli açılır (hafta içi + hafta sonu). Geçmiş günlere fiyat yazılmaz.
  - "Birden fazla ay seç" modunda seçim çubuğunda **"Tümünü seç"** kalsın.
  - Görev 12'deki "Tüm aylara fiyat gir" butonunu bu yeni butonla değiştir (iki ayrı buton olmasın).
  - Ay listesi 2027'nin tamamını da göstersin (bugünden itibaren en az 18 ay).

- [x] **14.9 Gelir & gider tek bakışta.** Ekranın üstü yeniden:
  - **Büyük net kazanç kartı** kalsın: "2026 net kazanç **8.500 ₺**".
  - Altında **3 büyük renkli kutu yan yana** (her biri ikon + büyük rakam + tek kelime), dokununca ilgili listeye kayar:
    - `circle-check` yeşil — **Alındı** 10.000 ₺
    - `clock` kırmızı — **Alınacak** 58.000 ₺ (depozito hariç; altında küçük "+ 15.000 ₺ depozito")
    - `receipt` gri — **Giderler** 1.500 ₺
  - Altında tek cümle, sade: "Bu yıl 68.000 ₺ rezervasyon var; 10.000 ₺'si alındı, 1.500 ₺ gider çıktı."
  - Sonra liste bölümleri sırayla, her başlık ikonlu: **Alınacak ödemeler** (en üstte, en önemli; her satırda misafir, tarih, kırmızı tutar, dokununca "Alınan ödemeyi gir") · **Alınan ödemeler** · **Giderler** (+ Gider ekle) · **Diğer gelirler** (+ Gelir ekle).
  - Grafik ve "Sezon özeti" en altta, **"Daha fazla istatistik"** başlığı altında kapalı dursun.
  - Ay / Yıl / Tümü seçici kalsın.

- [x] **14.10 Fotoğraflar: butonlar altta.** "Fotoğraf ekle" ve "Drive'dan al" butonları ekranın **altında sabit çubukta** dursun (başparmak erişsin). "Birden fazla seç" başlığın yanında küçük kalsın. Seçim modunda alttaki çubuk "Kapak yap / Sil / Vazgeç" olur.

- [x] **14.11 Teklif panelinde "Teklifi kopyala".** "Bağlantıyı kopyala" butonu kalksın; yerine **"Teklifi kopyala"** (`copy`): mesajın tamamını (bağlantı dahil) panoya kopyalar, "✓ Teklif kopyalandı" bildirimi. Kullanıcı Instagram vb. yerden de gönderebilsin. "WhatsApp'ta gönder" ana buton olarak kalsın. Kopyalama da teklifi kaydetsin (gönderme gibi). Teklifler listesindeki "Bağlantıyı tekrar gönder" de "Teklifi tekrar gönder" + "Teklifi kopyala" olsun.

---

## Bitince
1. sw.js SURUM'u artır, commit, `git push`, `npx netlify-cli deploy --prod --dir www`; Netlify'da yeni SURUM'u kontrol et.
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Zeyd'e 5-6 maddede teknik olmayan dille yaz. Denemesi gerekenler: misafir sayfası (telefonda paylaşım linkinden), takvimde aynı güne tekrar dokunma, Gelir & gider, Tüm yıla fiyat gir.
