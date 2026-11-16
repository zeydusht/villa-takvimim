# Görev 18 — Gece görevi: tarih seçimi, kurulum turu, Villalarım, Takvim sekmesi, akıcılık

_Hazırlayan: Claude (ürün yöneticisi), 16 Kasım 2026, gece. Zeyd uyuyor; sabah bakacak. Uzun çalışabilirsin; acele etme, her maddeyi kendin test et._

## Çalışma kuralları (önce oku)
- **Netlify'a yükleme YOK.** Her bölüm bitince commit + push (test linki: GitHub Pages).
- Açılış animasyonu (`www/acilis.js`) onaylı — dokunma.
- Kullanıcı yaşlı villa sahibi: her ekran tek bakışta anlaşılmalı, parmak ekranın altında. Yazı kalın değil, renk/ikon kuralları (Görev 11–12) geçerli.
- Her animasyon: sadece transform/opacity, 60 fps, `--hiz-*` değişkenleri, "Hareketi azalt"a uy.
- Veritabanı değişikliği gerekirse YAPMA; `docs/PROJE_DURUMU.md` → "Veritabanı için gerekenler (Görev 18)" altına SQL taslağıyla yaz, o kısmı cihazda saklayarak çalıştır.
- **Kendi kendini test et (zorunlu):** Her bölümden sonra Playwright ile 390×844 ve 360×740 boyutlarında ilgili ekranların ekran görüntüsünü al, `docs/qa/gorev18/` altına önce/sonra olarak kaydet. Her ekranda kontrol et: yatay taşma yok (`document.documentElement.scrollWidth <= innerWidth`), hiçbir buton/yazı kesilmiyor ya da kutusundan taşmıyor, öğeler üst üste binmiyor. Sorun görürsen düzelt ve tekrar çek.
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

## A. Takvimde tarih seçimi (en önemli)

- [x] **18.1 Seçim kuralı (durum makinesi).** Villa takviminde (ve misafir sayfası g.html'de aynısı):
  | Şu anki durum | Dokunulan gün | Sonuç |
  |---|---|---|
  | Hiçbir şey seçili değil | X | X **başlangıç** olur |
  | Sadece başlangıç (S) seçili | Y > S | **S–Y aralığı** seçilir |
  | Sadece başlangıç (S) seçili | Y < S | Y **yeni başlangıç** olur (S bırakılır) |
  | Sadece başlangıç (S) seçili | Y = S | **Hiçbir şey seçili kalmaz** |
  | Aralık (S–E) seçili | **herhangi bir gün** (içinde, dışında, S ya da E) | **Hiçbir şey seçili kalmaz** (yeni seçim başlamaz; bir sonraki dokunuş yeni başlangıç) |
  - Örnek: 28'e dokun → 23'e dokun ⇒ başlangıç 23 · sonra 21 ⇒ başlangıç 21 · sonra 27 ⇒ 21–27 · sonra 13 (ya da 27) ⇒ seçim yok.
  - S–Y arasında dolu gece varsa aralık seçilmez; Y yeni başlangıç olur ve altta kısa uyarı: "Bu tarihler arasında dolu gün var."
  - Bu kuralın Playwright testini yaz (yukarıdaki örnek sırası dahil en az 8 senaryo), `docs/qa/gorev18/secim-testi.md`'ye sonucu yaz.

- [x] **18.2 Seçim görünümü eski hâline.** Seçili aralık, rezervasyonların çizim diliyle gösterilsin (eskisi daha iyiydi): aradaki tam geceler **koyu yeşil dolu**, giriş günü ve çıkış günü **yarım gün** (çapraz bölünmüş, açık yeşil yarı): giriş gününde sağ-alt yarı, çıkış gününde sol-üst yarı. Sadece başlangıç seçiliyken o gün yeşil çerçeve + açık yeşil zemin. Fiyat yazıları seçili hücrede beyaz.

- [x] **18.3 Seçim işlemleri ALTTA (başparmak bölgesi).** Üstteki adım şeridi ve üstte çıkan butonlar kaldırılsın. Bunun yerine alt menünün hemen üstünde, alttan kayarak çıkan sabit bir panel:
  - Sadece başlangıç seçiliyken: "Giriş: 24 Kasım · Şimdi çıkış gününe dokunun" + sağda ✕.
  - Aralık seçiliyken: üst satır "24 → 27 Kasım · 3 gece · 9.000 ₺" + ✕; altında **eşit genişlikte 3 buton**, hiçbiri taşmaz, yazılar tek satır: **Rezervasyon** (dolu yeşil, `calendar-plus`) · **Teklif** (lacivert, `badge-percent`) · **Opsiyon** (`clock`). 360 px genişlikte bile sığmalı (gerekirse ikon üstte, yazı altta düzen).
  - Panel açıkken takvimin son satırı panelin altında kalmasın (alt boşluk ekle).
  - ✕ ya da 18.1'deki temizleme kuralı paneli aşağı kaydırarak kapatır.

- [x] **18.4 Hızlı işlem hapları taşmasın.** Villa ekranındaki hap sırasında "Opsiyon" kesik görünüyor. Haplar içeriğe göre genişlesin, kesilmesin; kaydırma ipucu (Görev 17.3) korunarak. 360 px'te kontrol et.

## B. Villa ekranı

- [x] **18.5 "Sıradaki" kartı her zaman var.** Rezervasyon yoksa da aynı yerde (villa başlığının altında) dursun: "SIRADAKİ · Henüz rezervasyon yok" + "İlk rezervasyonunuzu girin" + buton **"Nasıl yapılır?"** → 18.13 öğretici turunun takvim adımını başlatır (takvime kaydırır, ilk boş günü nabız gibi vurgular, baloncuk: "1. Misafirin gireceği güne dokunun"; dokununca: "2. Çıkacağı güne dokunun"; sonra alttaki panel vurgulanır: "3. Rezervasyon'a dokunun").
- [x] **18.6 Takvim başlığı çakışıyor.** "Kasım 2026" ve ‹ › okları üstteki "Villanızı hazırlayın" kartına değiyor. Arada en az 24 px boşluk; okların dokunma alanı (48 px) başka öğeyle çakışmasın.
- [x] **18.7 Villa yönetimi sırası:** Villa bilgileri · **Fiyatlar** · **Teklifler** · Misafirler · Gelir & gider · Bakıcılar.

## C. Teklifler ve Fiyatlar

- [x] **18.8 "İsimsiz teklif" yazmasın.** Teklif listesinde misafir adı varsa "Hasan Bey · 24–27 Kasım", yoksa sadece "Teklif · 24–27 Kasım". "İsimsiz" kelimesi hiçbir yerde geçmesin.
- [x] **18.9 Fiyatlar: yıl seçici, eski fiyatlar görünsün.**
  - Ekranın üstünde yıl seçici: ‹ **2026** › (ya da yan yana yıl hapları: 2025 · **2026** · 2027). Varsayılan bu yıl.
  - Seçili yılın **12 ayı** (Ocak–Aralık) listelenir. "Nisan 2028'e kadar" uzayan liste kalksın.
  - Geçmiş aylar da açılır ve fiyatları görünür ("geçen sene kaç liraya vermiştim?"); geçmiş aylar soluk ve küçük "geçmiş" etiketli; düzenlenebilir ama kaydederken "Bu ay geçmişte kaldı, yine de değiştirilsin mi?" sorusu.
  - Bir önceki yılın aynı ayının fiyatı ay satırında küçük gri not olarak: "Geçen yıl: 7.000–9.000 ₺".
  - "Tüm yıla fiyat gir" kalsın (seçili yıl için).

## D. Villa ekleme ve kurulum turu (7 adım)

- [x] **18.10 "Villa ekle" sadece ad sorsun.** İlk panel: tek alan "Villanızın adı" + tek buton **"Villayı ekle"**. Fotoğraf, konum vb. burada YOK. Eklenince kurulum sihirbazı açılır.
- [x] **18.11 Sihirbaz 7 adım (sade).** Üstte ilerleme çubuğu ve "2/7". Her adımda **sadece "İleri"** (ve solda "Geri"); "Şimdilik atla" ve "Tüm villa bilgileri" bağlantıları KALDIRILSIN (boş bırakıp İleri denebilir).
  1. **Ad ve konum** — ad önceden dolu; konum (Google/Apple Haritalar bağlantısı, Görev 13).
  2. **Kaç kişilik?** — Kişi (`users`), Yatak odası (`bed-double`), Banyo (`bath`) — her biri büyük ikonlu kart + − / + sayaç.
  3. **Nesi var?** — mevcut hâli kalsın (çok iyi).
  4. **Bu ayın fiyatı** — "Kasım ayı için gecelik fiyat": **Hafta içi** ve **Hafta sonu** iki büyük alan; altında "Kasım ayına uygulanır. Diğer ayları sonra Fiyatlar'dan girebilirsiniz." İsteğe bağlı kapalı bölüm "Kısa konaklama ücreti ve depozito (isteğe bağlı)". **HATA:** bu adımda "kaç gece ve altına" alanı yukarı kaymış/üst üste biniyor — düzelt.
  5. **Fotoğraflar** — mevcut hâli (Drive yapıştırma çok iyi). Öneri metni: "En az 20 fotoğraf önerilir: her oda, banyolar, havuz, manzara, dış cephe." Sayaç "0/20".
  6. **İletişim** — WhatsApp numarası; "Turizm izin belge no **(isteğe bağlı)**". Bu adımda "Villa sayfası oluştur" butonu YOK.
  7. **Villa sayfası** — tek büyük buton **"Villa sayfamı oluştur"** → yükleniyor animasyonu → "🎉 Villa sayfanız hazır" + **"Tamam"**. Önizleme bu akışta yok.
  - **Son ekran:** `sihirbaz-hazir` çizimi + "Villanız hazır!" + tek buton **"Takvime git"** ("Başka villa ekle" kaldırılsın). Takvime git → villa ekranı → 18.13 turu otomatik başlar.
- [x] **18.12 Her adımda bir çizim.** Mevcut çizimleri kullan, eksikleri `codex exec` ile üret (docs/CODEX_GORSELLER.md'deki "Ortak stil" paragrafı başa eklenerek, her biri ayrı istek, `www/img/` içine, 800 px WebP, <120 KB):
  - Adım 1: `sihirbaz-hosgeldin` (var)
  - Adım 2: `sihirbaz-kapasite` — "A cozy bedroom corner of the white villa: a double bed with linen, a small bedside olive branch vase, an open shuttered window showing the sea."
  - Adım 3: `sihirbaz-ozellikler` — "A turquoise private pool with a small jacuzzi, two sun loungers, a parasol and a bougainvillea wall."
  - Adım 4: `sihirbaz-fiyat` — "A small wall calendar with a few days highlighted in green and a simple price tag shape hanging from it, next to a terracotta pot."
  - Adım 5: `bos-foto` (var)
  - Adım 6: `sihirbaz-iletisim` — "A smartphone lying on a sun lounger with two simple rounded chat bubbles above it (no logos, no text) and a glass of lemonade."
  - Adım 7: `sihirbaz-sayfa` — "A smartphone standing upright showing a simplified villa page: a photo of the white villa with pool on screen, small blank content lines below; a few confetti dots."
  - Son: `sihirbaz-hazir` (var)
  - Hepsi aynı elden çıkmış gibi olmalı; uymayanı yeniden çizdir (en fazla 2 deneme).
- [x] **18.13 Uygulama turu (öğretici).** Kurulum bitip villa ekranı ilk açıldığında 4 adımlı tur (koyu yarı saydam perde, vurgulanan öğede delik, altta baloncuk + "İleri", sağ üstte "Turu geç"):
  1. Sıradaki kartı: "Burada her zaman sıradaki iş yazar: kim girecek, ne kadar alınacak."
  2. Takvim: "Misafirin gireceği güne, sonra çıkacağı güne dokunun." (gerçek bir dokunuş bekler, 18.5'teki gibi)
  3. Alt panel: "Rezervasyon, teklif ya da opsiyon seçin."
  4. Alt menü: "Takvim sekmesinde tüm villalarınızın giriş-çıkışları, Hesap'ta ayarlar."
  - Bir kez gösterilir (cihazda saklanır, try/catch); Hesap → Yardım → **"Uygulama turunu tekrar göster"**.
- [x] **18.14 Akıcı geçişler (uygulama geneli).**
  - Sihirbaz adımları: yatay "shared axis" geçiş (yeni adım 24 px sağdan + solma, eskisi sola + solma, 280 ms, `cubic-bezier(0.2,0.8,0.2,1)`); Geri'de ters yön. İlerleme çubuğu genişliği aynı sürede kayarak dolar.
  - Adım içeriği: çizim 0,96→1 ölçek + solma (320 ms), altındaki alanlar 40 ms arayla sırayla belirir.
  - Ekranlar arası (liste → villa → alt ekranlar): ileri giderken yeni ekran sağdan 30 px + solma, geri gelirken tersi (260 ms). Paneller (sheet) Görev 9'daki gibi.
  - Butona basınca 0,97 ölçek + renk; sayı/tutar değişince kısa vurgu (Görev 9).
  - Ağır olan yok: her geçiş 300 ms altında; 60 fps doğrula.

## E. Villalarım (ana ekran)

- [x] **18.15 Başlık satırı.** "Villalarım" başlığının **sağında**, sağa dayalı: "● 0 dolu" "● 5 boş" etiketleri (aynı satırda; dar ekranda başlığın altına iner). Altında sadece **"+ Villa ekle"** butonu; "Takvim" ve "Teklifler" hapları kaldırılsın.
- [x] **18.16 Villaları sürükleyerek sırala.** Villa kartına basılı tut (400 ms, hafif titreşim) → kart kalkar (gölge + 1,03 ölçek) → sürükle → bırak. Diğer kartlar akıcı yer değiştirir. Sıra kalıcı (önce cihazda; kullanıcıya özel sırayı buluta yazmak için veritabanı gerekirse PROJE_DURUMU'na yaz). Varsayılan sıra (henüz sıralanmamışsa): eklenme sırası, yeni villa en altta. İlk kez 2+ villa olduğunda küçük ipucu: "Sırayı değiştirmek için villaya basılı tutup sürükleyin."
- [x] **18.17 "Bugün ve yarın" kartı çok villada:** en fazla 4 satır göster, fazlası için "+3 olay daha · Takvim'de gör". Satıra dokununca o rezervasyon açılsın (şu anki gibi).

## F. Aşağı çekip yenile

- [x] **18.18 Yenileme göstergesi üst çubuğa bağlı.** Şu an göstergesi üst çubuğun üstünde açılan boşlukta. iOS/Chrome'daki gibi: içerik aşağı çekildikçe gösterge **üst çubuğun hemen altından** içerikle birlikte aşağı iner (parmağı takip eder, lastik etkisi), 36 px daire içinde yeşil dönen ok, çekme mesafesiyle dönerek dolar; eşiği geçince titreşim + dönmeye başlar; bitince yukarı kayıp kaybolur, "✓ Güncel".

## G. Takvim sekmesi (alt menü) — baştan, anlaşılır

- [x] **18.19 Takvim sekmesi yeniden.** Şu an karışık. Yeni düzen:
  - Başlık "Takvim" + altında tek cümle özet: "Bu hafta 3 giriş · 2 çıkış".
  - Seçici: **Bugün · 7 gün · 30 gün** (kalsın).
  - Gün başlıkları büyük ve net: "**Bugün** · Pazartesi 16 Kasım", "**Yarın** · Salı 17 Kasım", sonra "Perşembe 19 Kasım". Olay olmayan günler gösterilmez.
  - Her olay ayrı kart: solda villanın küçük kapak fotoğrafı/renkli harfi; üstte **villa adı** (büyük), altında renkli etiket **"Giriş 16:00"** (yeşil, `log-in`) ya da **"Çıkış 10:00"** (gri, `log-out`) + misafir adı + kişi sayısı; sağda alınacak tutar (kırmızı) ya da "✓ Ödendi"; çıkışta depozito bekliyorsa "Depozito iadesi" etiketi.
  - "Şu an konaklayanlar" bölümü en üstte, kapalı-açılır ("3 villada misafir var ›").
  - Boşsa `bos-takvim` çizimi + "Önümüzdeki 7 günde giriş veya çıkış yok."
  - Karta dokununca rezervasyon detayı Takvim'in üstünde açılır (Görev 8.13 kuralı).

## H. Hesap

- [x] **18.20 Bakıcı ekle.** Hesap ekranında "Bakıcı olarak villaya katıl"ın hemen altında **"Villama bakıcı ekle"** (`key-round`): dokununca "Hangi villanıza bakıcı eklemek istiyorsunuz?" — villa listesi (kapak fotoğraflı kartlar) → seçince mevcut bakıcı davet ekranı (kod + bağlantı + WhatsApp'ta gönder). Tek villası varsa liste atlanır.
- [x] **18.21 Yardım.** Hesap'ta "Yardım" bölümü: "Uygulama turunu tekrar göster", "Sık sorulan sorular" (5–6 madde: rezervasyon nasıl girilir, kapora/depozito nedir, bakıcı nasıl eklenir, fiyat tüm aya nasıl girilir, villa sayfası nasıl paylaşılır, teklif nedir), "Bize ulaşın".

## I. Kendi bulduğun eksikler
- [x] **18.22** Yukarıdakileri yaparken ilk kez kullanan biri gözüyle tüm ekranları (Villalarım, villa, rezervasyon formu/detayı, Fiyatlar, Teklifler, Gelir & gider, Fotoğraflar, Villa bilgileri, Takvim, Hesap, misafir sayfası) gez. Taşan, kesilen, üst üste binen, anlaşılmayan, tutarsız yazılan (aynı şeye iki ad), dokunma alanı 48 px'ten küçük olan her şeyi düzelt. Yaptıklarını `docs/qa/gorev18/ek-duzeltmeler.md`'de madde madde listele (önce/sonra görüntüsüyle).

---

## Bitince
1. sw.js SURUM'u artır, `npx cap sync`, commit, `git push`. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle (yapılanlar, kalanlar, veritabanı gereksinimleri).
3. Zeyd sabah okuyacak: mesajının **EN ALTINA çok kısa bir özet** yaz (5–7 madde, teknik olmayan dille) ve deneme bağlantısını ekle: https://zeydusht.github.io/villa-takvimim/ — ayrıca "önce şunları dene" diye 3 madde: tarih seçimi kuralları, yeni villa ekleme turu, Villalarım'da sürükleyerek sıralama.
