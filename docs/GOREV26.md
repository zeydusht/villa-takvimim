# Görev 26 — %80'den %100'e: akıcılık, bugün işareti, kademeli girişler, tam denetim

_Hazırlayan: Claude (ürün yöneticisi), 17 Kasım 2026. Zeyd: "Uygulama az çok hazır. Geliştirebileceğimiz her alanı geliştirelim; stilimize uymayan, zor okunan, karmaşık, rehberi olmayan yerleri bul, mükemmel olsun." Uzun çalışabilirsin; acele etme._

## Çalışma kuralları
- Netlify yok; her bölüm sonunda commit + push.
- Açılış animasyonu ve onaylı akışlar (Görev 21–25 klavye/takvim konumlama) bozulmasın; her bölümden sonra onların testlerini de yeniden çalıştır.
- Kullanıcı yaşlı villa sahibi. Her değişiklik "daha sade, daha net" yönünde olmalı; yeni karmaşıklık ekleme.
- Kendi kendini test et: 360×740, 390×844, 430×932; `docs/qa/gorev26/` (önce/sonra).
- Veritabanı değişikliği gerekirse YAPMA; PROJE_DURUMU'na SQL taslağıyla yaz.

---

## A. Akıcılık (önce bu)

- [x] **26.1 Takılmayı ölç ve düzelt.** _(Yapıldı: ana iş parçacığındaki iş %20–60 azaldı. Kare düşmesi hedefi başsız Chrome'da güvenilir ölçülemedi; gerçek iPhone'da bakılacak. Bkz. `docs/qa/gorev26/performans.md`.)_ Zeyd: "Takvimde gün seçince kayma ve kararma takılarak, yavaş geliyor." Chrome DevTools Performance'ta 4× CPU yavaşlatma + 390×844 ile şu akışları kaydet: giriş günü seçimi (kararma + panel + kaydırma), çıkış günü seçimi (panel büyümesi + 2. kaydırma), rehber adım geçişi, panel (sheet) açma/kapama, ekran geçişi. Her biri için uzun görevleri (>16 ms) ve layout/paint maliyetlerini `docs/qa/gorev26/performans.md`'ye yaz. Sonra düzelt; beklenen olası sebepler ve çözümler:
  - Kararma: büyük box-shadow ya da tam ekran yarı saydam katmanın her karede yeniden boyanması → tek bir `position:fixed` katman, `opacity` ile animasyon, `will-change:opacity` (sadece animasyon süresince).
  - Panel boyu (height) animasyonu → içerik `transform`/`opacity` ile; panel kabı yükseklik yerine `translateY` ile.
  - Kaydırma: `scrollTo({behavior:'smooth'})` ile kendi rAF kaydırmasını aynı anda çalıştırma; tek yöntem. Kaydırma sırasında takvimi yeniden çizme (seçim görünümünü sadece değişen hücrelerde class ile güncelle, tüm ızgarayı innerHTML ile yeniden kurma).
  - Aynı anda başlayan animasyonları sırala: önce panel (320 ms), panel bitince kaydırma (400 ms) — ya da ikisi aynı anda ama ikisi de compositor'da.
  - Hedef: bu akışların hepsinde 4× yavaşlatmada bile kare düşmesi < %5. Önce/sonra ölçümünü yaz.

## B. Bugün işareti

- [x] **26.2 "Bugün" her zeminde belli olsun.** Şu an bugün = koyu yeşil daire; koyu mavi/yeşil rezervasyon bloğunun üstünde kayboluyor.
  - Yeni: hücrenin içinde **yuvarlak köşeli çerçeve, içi boş**, 2,5 pt kalınlık, renk **mercan kırmızısı `#E5484D`** (para/ödenmedi için kullanılan şarap kırmızısı `#9B2C4A`'dan ayrı; bu renk SADECE "bugün" için). Gün numarası olduğu gibi (rengi zemine göre beyaz/koyu kalır).
  - Rezervasyon bloğunun üstündeyken çerçeve dışına 1 pt beyaz kontur (her zeminde ayrışsın).
  - Takvim açıklamasındaki "Bugün" örneği de güncellensin. Misafir sayfası (g.html) ve uygulamadaki tüm takvimlerde aynı.
  - Test: bugün boş günde / dolu (yeşil, mavi, mor, pembe) bloğun ortasında / giriş-çıkış yarım gününde / seçili aralıkta — 8 durumun ekran görüntüsü.

## C. Kademeli girişler ve kaydırınca belirme

- [ ] **26.3 Kademeli giriş (stagger).** Bir ekran ilk açıldığında içerik yukarıdan aşağı sırayla belirsin: her öğe 10 pt aşağıdan + opaklık 0→1, 260 ms, `--egri-giris`, öğeler arası 35 ms (en fazla ilk 8 öğe kademeli; sonrakiler 8. ile aynı anda).
  - Uygulanacak yerler: Villalarım (başlık → özet etiketleri → villa kartları), villa ekranı (başlık kartı → Sıradaki → haplar → takvim → bölümler), Takvim sekmesi (gün grupları), Gelir & gider (net kazanç → 3 kutu → listeler), Hesap.
  - Sadece ekranın ilk açılışında (geri gelince, sekme değiştirip dönünce, veri yenilenince TEKRAR OYNAMAZ). "Hareketi azalt"ta yok.
  - Açılış animasyonundan sonra ana ekran ilk geldiğinde de kademeli gelsin (açılışın son adımıyla uyumlu).
- [ ] **26.4 Kaydırınca belirme (scroll reveal) — misafir sayfası.** g.html'de bölümler (Ev hakkında, Odalar, Özellikler, Konum, Kurallar, Takvim…) ekrana girerken 16 pt aşağıdan + solarak belirsin (IntersectionObserver, 320 ms, her bölüm bir kez). Fotoğraf şeridindeki fotoğraflar yüklenince 200 ms solarak gelsin. Uygulama içi uzun ekranlarda (villa ekranının alt bölümleri) aynı, ama daha hafif (8 pt).
  - Performans: sadece transform/opacity; IntersectionObserver bir kez tetiklenince gözlemi bırak.

## D. Tam denetim (en önemli kısım)

- [ ] **26.5 Denetim listesi çıkar.** Uygulamanın ve misafir sayfasının HER ekranını, panelini, boş/yükleniyor/hata durumunu 3 ekran boyutunda gez. `docs/DENETIM.md` dosyasına tablo: ekran · sorun · öneri · öncelik (Ö1 kritik / Ö2 önemli / Ö3 güzel olur) · ekran görüntüsü. Aşağıdaki kontrol listesini her ekranda uygula:
  1. **Stil uyumu:** 4 buton türü, renk tablosu (Görev 12), Lucide ikonları, kalın yazı yok (izinli istisnalar hariç), bölüm başlıkları aynı boyutta, köşe yarıçapları ve boşluklar tutarlı.
  2. **Okunabilirlik:** yazı en az 15 px (ikincil 13 px), kontrast WCAG AA, gri üstüne gri yok, satır uzunlukları rahat.
  3. **Dokunma:** her dokunulabilir en az 48 pt; birbirine çok yakın butonlar yok.
  4. **Terimler:** aynı şeye tek ad (ör. "Kalan ödeme", "Konaklama ücreti", "Hasar depozitosu", "Kapora", "Bakıcı", "Villa sayfası"). Tüm metinleri tara, farklı kullanımları listele ve birleştir.
  5. **Boş durum:** her listenin boş hâli çizimli ve "ne yapmalıyım" butonlu.
  6. **Yükleniyor / hata / çevrimdışı:** iskelet ekranlar; internet yokken üstte sakin bir "Çevrimdışı · değişiklikler bağlanınca kaydedilecek" şeridi; kaydedilemeyen değişiklik için yeniden dene.
  7. **Geri alma:** silme/iptal işlemlerinin hepsinde aynı "Geri al" bildirimi (5 sn).
  8. **Rehber kapsamı:** Yardımlı modda rehberi OLMAYAN işlemleri listele. En az şunlara rehber ekle: Misafirler (toplu mesaj / teklif), Gelir & gider (gelir ekle), Fotoğraflar (sıralama, kapak yapma, silme), Villa bilgileri (odalar, kurallar, konum bağlantısı), Opsiyon → Rezervasyona çevir, Teklif → Rezervasyona çevir, Depozito iadesi, Rezervasyon formu (PDF) paylaşma, Villa sayfasını paylaşma/yayından kaldırma, Bakıcı daveti.
  9. **Değerli ama gizli özellikler:** kullanıcının bulamayacağı özellikleri listele (ör. teklifler, opsiyon, boş günleri paylaş, PDF form, yedek) ve her biri için keşfedilebilirlik önerisi (ipucu kartı, rehber, daha görünür yer).
  10. **Tutarsız hareket:** Görev 9/19B standart süre ve eğrilerini kullanmayan animasyonlar.
- [ ] **26.6 Ö1 ve Ö2'leri uygula.** Denetimdeki tüm Ö1 ve Ö2 maddelerini düzelt, DENETIM.md'de her maddeyi "✓ yapıldı" diye işaretle (önce/sonra görüntüsüyle). Ö3'leri sadece listele (Zeyd ve Claude seçecek).
- [ ] **26.7 Yazı boyutu ayarı (yaşlı kullanıcılar için).** Hesap → Görünüm: **"Yazı boyutu: Normal · Büyük · Çok büyük"** (önizlemeli). Tüm uygulama yazıları bir kök değişkenle ölçeklensin (rem); "Çok büyük"te de hiçbir ekranda taşma olmasın (3 boyutta test). Varsayılan Normal; iPhone'un sistem yazı boyutu büyükse ilk açılışta "Büyük" önerilsin.
- [ ] **26.8 Stil rehberi dosyası.** `docs/STIL.md`: renkler (adlarıyla), yazı boyutları, buton türleri, ikon kuralları, boşluklar, köşe yarıçapları, hareket süreleri/eğrileri, terimler sözlüğü. Bundan sonraki tüm işler buna uysun; kodda bu değerler tek yerde (CSS değişkenleri) dursun.

---

## Bitince
1. sw.js SURUM'u artır, `npx cap sync`, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle (DENETIM.md ve STIL.md'ye bağlantı ver).
3. Mesajının en altına kısa özet (en fazla 7 madde) + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: takvimde gün seçimi (daha akıcı mı?), bugünün kırmızı çerçevesi, Villalarım'ı açınca kartların sırayla gelmesi, misafir sayfasında aşağı kaydırma". Ayrıca DENETIM.md'deki Ö3 listesinin ilk 10 maddesini başlık olarak yaz.
