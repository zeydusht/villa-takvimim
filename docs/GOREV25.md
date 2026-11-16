# Görev 25 — Takvim seçiminde iki aşamalı otomatik konumlama

_Hazırlayan: Claude (ürün yöneticisi), 17 Kasım 2026. Zeyd'in 02:16 ekran kaydından. Görev 24'teki açılış beyaz ekranı ve klavye sorunları düzeldi (onaylandı). Kalan: takvimde gün seçince takvim yerine gelmiyor._

## Önce oku
- Netlify yok; commit + push. Açılış animasyonuna ve Görev 24 klavye koduna dokunma. Testler `docs/qa/gorev25/`.
- **Tespit:** Takvimde 23'e (ayın son satırlarından biri) basınca etraf kararıyor ama sayfa KAYMIYOR (Görev 24.3 çalışmıyor); takvimin alt satırları alttaki panelin arkasında kalıyor. Zeyd her seferinde elle kaydırıyor. Önce neden kaymadığını bul (yanlış kaydırma kabı mı? panel yüksekliği panel animasyonu bitmeden mi ölçülüyor? kararma katmanı kaydırmayı mı engelliyor?) ve `docs/qa/gorev25/sebep.md`'ye yaz.

---

- [x] **25.1 Aşama 1 — giriş günü seçilince.** Zeyd'in elle getirdiği konum:
  - Takvim bloğunun ÜSTÜ (ay başlığı "Kasım 2026" + ‹ › okları) **üst çubuğun hemen altında** (8 pt boşluk) olacak şekilde sayfa yukarı kaysın. Böylece takvim, üst çubuk ile alttaki "Çıkış gününü seçin" paneli arasındaki alanı doldurur; ayın tüm satırları panelin üstünde görünür.
  - Ayın tüm satırları bu alana sığmıyorsa (küçük ekran): ay başlığı üst çubuğun altına girebilir; öncelik, ızgaranın son satırının panelin 12 pt üstünde görünmesi.
  - Kaydırma panel tamamen yerine oturduktan SONRA ve panelin gerçek yüksekliği ölçülerek yapılsın; tek hareket, 400 ms, `--egri-gecis`.

- [x] **25.2 Aşama 2 — çıkış günü seçilince.** Panel büyür (başlık + toplam + 3 buton). Panel büyüme animasyonu bitince sayfa ikinci kez kaysın:
  - Takvim ızgarasının **son satırının alt kenarı panelin üst kenarının 12 pt üstünde** olsun (Zeyd'in videodaki ikinci kaydırması). Ay başlığı ve hap sırası üst çubuğun altına girebilir; ızgaranın tamamı (seçili aralık dahil) üst çubuk ile panel arasında görünür olmalı.
  - Izgara bu alana sığmıyorsa: seçili aralığın bulunduğu satırlar ortada kalacak şekilde ortala.
  - Tek hareket, 400 ms, `--egri-gecis`. Kararma (Görev 20.6) kalır.

- [x] **25.3 Genel.**
  - Kullanıcı bu kaydırmalardan sonra elle kaydırırsa engelleme; bir sonraki seçim adımında kural yeniden uygulanır.
  - Seçim temizlenince (✕ ya da 18.1 kuralı) sayfa olduğu yerde kalır (geri zıplamaz), panel aşağı kayar, kararma kalkar.
  - Rehberli rezervasyonda (Yardımlı mod) aynı iki aşama uygulanır; rehber penceresi takvime oturur.
  - Ayın ilk satırlarındaki bir güne basıldığında da aynı kural (takvim zaten yukarıdaysa küçük ya da sıfır kaydırma).

- [x] **25.4 Test (Playwright, 390×844 ve 360×740, `docs/qa/gorev25/`):**
  - Sayfa en üstteyken ayın son satırındaki bir güne bas → 400 ms sonra: ay başlığı üst çubuğun altında 8 ± 2 pt; ızgaranın son satırı panelin üstünde (kesişme 0).
  - Ardından aynı satırda sonraki güne bas → ızgaranın son satırı panelin 12 ± 2 pt üstünde; seçili aralık görünür.
  - Ayın ilk satırında aynı test.
  - Her adımın ekran görüntüsünü kaydet; Zeyd'in videodaki konumlarıyla karşılaştırılabilir olsun.

---

## Bitince
1. sw.js SURUM'u artır, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: villa ekranında en üstteyken ayın son satırındaki bir güne bas (takvim yukarı gelmeli), sonra çıkış gününe bas (takvim panelin hemen üstüne oturmalı)".
