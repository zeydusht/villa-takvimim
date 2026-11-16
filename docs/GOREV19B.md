# Görev 19B — Rehber ve klavye ince ayarı

_Hazırlayan: Claude (ürün yöneticisi), 16 Kasım 2026. Zeyd'in iPhone denemesinden. Görev 19 üzerine. (Bu metin daha önce sohbette mesaj olarak verildiyse ve uygulandıysa, sadece işaretlenmemiş kutuları tamamla.)_

## Önce oku
- Netlify yok; commit + push. Açılış animasyonuna dokunma.
- "Kendi kendini test et" kuralı geçerli (390×844 ve 360×740; `docs/qa/gorev19b/`).
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

- [x] **19B.1 Nabız yok.** Rehberde vurgulanan çerçevenin etrafındaki nabız / kalp atışı animasyonunu tamamen kaldır. Çerçeve sabit dursun; sadece ilk göründüğünde 200 ms'de solarak belirsin.

- [x] **19B.2 Çerçeve geçişi daha akıcı.** Delik/çerçeve bir hedeften diğerine giderken easing `cubic-bezier(0.65, 0, 0.35, 1)` (yavaş başla, hızlan, yavaşlayarak dur), süre 450 ms; konum ve boyut aynı anda, tek hareket. Mümkünse transform ile (tek "delik" öğesi + büyük box-shadow perde: `box-shadow: 0 0 0 200vmax rgba(0,0,0,.6)`); boyut için genişlik/yükseklik animasyonu gerekiyorsa sadece bu tek öğede yap ve 60 fps'i doğrula. Baloncuk da aynı easing ile çerçeveyle eşzamanlı kaysın (ayrı solup belirmesin); metni 120 ms çapraz geçişle değişsin.

- [x] **19B.3 Kaydırmada gecikme yok.** Sayfa kaydırılınca çerçeve geç geliyor (scroll olayında sonradan konumlanıyor). Perde ve çerçeveyi, hedef sayfa içindeyse sayfa koordinatlarında (belge içinde `position:absolute`) konumla ki tarayıcının kendi kaydırmasıyla aynı karede hareket etsin; hedef bir panel (sheet) içindeyse o panelin kaydırma kabının içine yerleştir. Scroll dinleyicisiyle sonradan konumlama kalmasın. Test: Playwright'ta kaydırma sırasında 10 kare ölç, çerçeve ile hedef arası fark 0 px.

- [x] **19B.4 Klavye açılınca ekran sekmesin** (tüm uygulama, her yazı alanı: ad soyad, telefon, kapora, fiyat, not, gider…):
  - Panel (sheet) açıkken arkadaki sayfa kilitli: body'yi kaydırma konumunu saklayarak `position:fixed` yap; panel kapanınca eski konuma döndür.
  - Klavye açılınca panelin alt kenarı klavyenin hemen üstüne otursun (`visualViewport` resize ile; Capacitor'da `@capacitor/keyboard`, `resize: "none"`, yükseklik `keyboardWillShow`'dan). Sayfa ya da panel yukarı fırlamasın.
  - Odaklanan alan, sadece panelin içinde ve klavyenin üstünde görünür kalacak kadar yumuşakça kaydırılsın (250 ms, aynı easing); alan zaten görünüyorsa hiç kaydırma olmasın.
  - Tüm input'lar en az 16 px yazı boyutu (iOS otomatik yakınlaştırması olmasın).
  - Rehber baloncuğu klavye açıkken klavyenin üstünde, odaklanan alanı kapatmadan dursun.
  - Test: Playwright iPhone 14 emülasyonu + visualViewport küçültme; PROJE_DURUMU'na "gerçek iPhone'da test edilecek" notu.

- [x] **19B.5 Standart easing'ler.** Uygulamadaki tüm hareketlerde iki eğriyi değişken olarak tanımla ve kullan (`--hiz-*` ile birlikte): yer değiştirme `--egri-gecis: cubic-bezier(0.65, 0, 0.35, 1)`, belirme/giriş `--egri-giris: cubic-bezier(0.22, 1, 0.36, 1)`. Ekran geçişleri, paneller, sihirbaz adımları, rehber bunları kullansın.

---

## Bitince
1. sw.js SURUM'u artır, `npx cap sync`, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: + Rezervasyon rehberinde kapora alanına yaz, ekran sekmemeli; rehber açıkken sayfayı kaydır, çerçeve gecikmemeli".
