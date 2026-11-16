# Görev 24 — Klavye ve rehberi BASİTLEŞTİR, takvim odağı, beyaz ekran

_Hazırlayan: Claude (ürün yöneticisi), 17 Kasım 2026. Zeyd'in 00:32 ekran kaydından kare kare tespit edildi._

## Önce oku
- Netlify yok; commit + push. Açılış animasyonuna dokunma. Testler `docs/qa/gorev24/`.
- Tespitler: Ad soyad ve telefon adımları artık doğru (alan klavyenin hemen üstünde). Sorun: (1) ücret kartında "Değiştir" ile fiyat düzenlerken alan klavyenin altına gömülüyor, sayfa sekiyor/kasıyor, arkadan takvim görünüyor; (2) takvimde ilk güne basınca alt panel takvimin alt satırlarını kapatıyor; (3) açılışta 2–3 karelik beyaz ekran.
- **Zeyd: "Bu çok daha basit olmalı."** Bu görevde klavye/rehber hizalama kodunu sadeleştir; üst üste eklenmiş dinleyicileri (visualViewport resize'da her karede hizalama, ResizeObserver zinciri, art arda scrollTo) temizle. Ne kaldırdığını `docs/qa/gorev24/sadelestirme.md`'ye yaz.

---

- [x] **24.1 Tek bir klavye kuralı (tüm uygulama + rehber).**
  1. Bir yazı alanına odaklanınca (`focus({preventScroll:true})`) **hiçbir şeyi hemen kaydırma.**
  2. Klavyenin açılması bitene kadar bekle: `visualViewport` yüksekliği 120 ms boyunca değişmeyince "klavye oturdu" say (Capacitor'da `keyboardDidShow`).
  3. Sonra **tek bir** yumuşak kaydırma (300 ms, `--egri-gecis`): alanın alt kenarı görünür alanın alt kenarının 12 pt üstüne gelsin. Alan zaten oradaysa ya da daha yukarıda ama görünür ise hiç kaydırma.
  4. Rehber açıksa baloncuk alanın hemen üstüne gider (aynı 300 ms içinde, aynı eğri). Rehber penceresi o anki hedef alan olur.
  5. Klavye kapanırken: hiçbir şeyi zıplatma; sadece panel kendi doğal yerine (300 ms) iner.
  6. Klavye açılırken ara karelerde (oturana kadar) hizalama YAPMA — kasmanın sebebi bu.
  - Bu tek fonksiyon (`klavyeyeHizala(alan)`) her yerde kullanılsın; başka hizalama kodu kalmasın.

- [x] **24.2 Ücret kartında düzenleme.** Rehberin ücret adımında hedef tüm kart; ama kullanıcı bir "Değiştir"e basıp satır içi fiyat alanı açılınca:
  - Rehber hedefi geçici olarak **o fiyat alanı + yanındaki Tamam** olur; 24.1 uygulanır (alan klavyenin hemen üstünde, baloncuk üstünde: "Yeni tutarı yazın, sonra Tamam'a dokunun").
  - Tamam'a basınca klavye kapanır, hedef yeniden tüm kart olur, baloncuk "Toplam ücret burada…" metnine döner; kart görünür alanda kalır (zıplamaz).
  - Rehber kapalıyken de aynı: Değiştir → alan klavyenin üstüne gelir.
  - Test: 3 satırın (geceler, kısa konaklama, depozito) her birinde Değiştir → yaz → Tamam; hiçbir karede alan klavyenin altında kalmamalı, kart arkasından takvim görünmemeli.

- [x] **24.3 Takvim: ilk güne basınca takvim ortaya.** İlk güne (giriş) dokununca:
  - Alt panel çıkar ("Çıkış gününü seçin").
  - Sayfa, takvimin TAMAMI panelin üstündeki görünür alanın ortasına gelecek şekilde tek bir yumuşak kaydırmayla kayar (400 ms). Takvim panelin altında hiçbir satırıyla kalmaz.
  - Takvim dışındaki her şey hafifçe kararır (%35; kaydırma ve takvime dokunma engellenmez — 20.2 kuralı). Böylece odak takvimdedir.
  - Çıkış günü seçilince kararma kalır (20.6), panel üç butonu gösterir.
  - Test: ayın son satırındaki bir güne bas → çıkış için aynı satırdaki/sonraki ayın günleri panelin üstünde görünür olmalı.

- [x] **24.4 Beyaz ekran (ana ekrana eklenen web uygulaması).** Sebep: iPhone, ana ekrandan açılan web uygulamasında sayfa yüklenene kadar `apple-touch-startup-image` gösterir; bizde yok → beyaz. Ayrıca `manifest.json` `background_color` hâlâ `#9FE870`.
  - `manifest.json`: `background_color` ve `theme_color` → `#10180D`.
  - `assets/sembol-acik.svg` ile, zemini `#10180D`, logo genişliği ekranın %30'u, merkezi yüksekliğin %49,5'inde olacak şekilde iPhone ekran boyutları için açılış görselleri üret (`www/img/acilis/`): en az 1290×2796, 1179×2556, 1284×2778, 1170×2532, 1125×2436, 1242×2688, 828×1792, 1080×2340, 750×1334 (dikey). `index.html` `<head>`'e her biri için doğru `media` sorgulu `<link rel="apple-touch-startup-image">` ekle.
  - Bu görseller web açılışının ilk karesiyle birebir aynı olmalı (logo aynı yerde, aynı boyutta) ki geçiş fark edilmesin.
  - Not (Zeyd'e): ana ekrandaki eski simgeyi silip yeniden "Ana Ekrana Ekle" yapması gerekir; iPhone açılış görsellerini ekleme anında kaydeder. TestFlight uygulamasında bu sorun yok (native açılış ekranı var).

---

## Bitince
1. sw.js SURUM'u artır, `npx cap sync`, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: ana ekrandaki simgeyi silip yeniden ekle (beyaz ekran gitmeli); rezervasyonda ücret kartında Değiştir'e bas ve yaz (alan klavyenin hemen üstünde olmalı); takvimde ayın son satırındaki bir güne bas (takvim ortaya gelmeli)".
