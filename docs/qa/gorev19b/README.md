# Görev 19B: test raporu

_Claude Code, 16 Kasım 2026._

## Nasıl test edildi

- Playwright ile, sahte sunucuda, saat 16 Kasım 2026 10:00'a sabitlenerek test edildi.
- Ekran boyutları:
  - 390×844 ve 360×740;
  - klavye testi için iPhone 14 görünümü (390×664, mobil, dokunmatik).
- Dokunuşlar gerçek (`touchscreen.tap`).
- Klavye uygulamadaki yoluyla taklit edildi: `@capacitor/keyboard`'un `keyboardWillShow` olayının çağırdığı `VTKlavye(336)` kullanıldı (336 px, iPhone 14 klavyesi). Emülasyonda gerçek klavye yok.
- Test betiği: `qa19b.js`.

## Sonuçlar

| Madde | Ölçüm | Sonuç |
|---|---|---|
| 19B.1 Nabız yok | Rehber katmanında sonsuz tekrarlayan animasyon sayısı: 0. Çerçevenin `::after`'ı: yok. Takvimdeki ilk boş günün nabzı: `animation:none`. | Geçti |
| 19B.2 Geçiş | Çerçeve: `transform`, `width` ve `height` 0,45 s, `cubic-bezier(0.65, 0, 0.35, 1)`. Baloncuk: `top` 0,45 s, aynı eğri. Geçiş sırasında kare süresi ortalama 16,7 ms, en uzun 16,9 ms; 25 ms'yi aşan kare yok. Çerçeve 3. karede, baloncuk 4. karede kaymaya başladı; ikisi aynı karede (28.) durdu. Metin 120 ms çapraz geçişle değişiyor. | Geçti |
| 19B.3 Kaydırma | Rehber açıkken her karede kaydırılıp çerçeve ile hedef arası fark ölçüldü (10 kare). Sayfada (hedef: takvim, 110 px kaydırma) ve panelde (hedef: ad soyad alanı, 66 px kaydırma) fark 10 karenin hepsinde 0 px. | Geçti |
| 19B.4 Panel kilidi | Panel açıkken `body` `position:fixed`, sayfa konumu saklandı (399 px). Panel kapanınca `static` oldu ve sayfa 399 px'e döndü. Klavye açılınca sayfa konumu değişmedi (0 → 0). | Geçti |
| 19B.4 Klavye | Panelin alt kenarı klavyenin üstüne oturdu: 664 → 328 px (664 − 336). | Geçti |
| 19B.4 Odaklanan alan | Ad soyad alanı klavyenin altında kaldı. Alan baloncukla birlikte sığacak şekilde yukarı alındı (alan 39–87 px, baloncuk 109–266 px, panelin altı 328 px); baloncuk alanı kapatmıyor. | Geçti |
| 19B.4 Kapora alanı | Klavye açılınca alan 54–102 px'e yumuşakça kaydırıldı; ölçülen kayma yaklaşık 200–250 ms. Baloncuk alanın altında (124–281 px). | Geçti |
| 19B.4 Zaten görünen alan | Alan klavyenin üstünde zaten görünüyorsa hiç kaydırma olmuyor: kural kodda var (`alanGoster`), ama ayrı bir test ölçmedi. Testteki iki alan da klavyenin altında kalıyordu. | Kodda var, ölçülmedi |
| 19B.4 16 px | Taranan ekranlar: ana ekran, villa, rezervasyon, teklif, opsiyon, villa bilgileri, paylaş, fiyat paneli, gider. 16 px'ten küçük yazı alanı: 0. Misafirler arama alanı 15 px idi, 16 px yapıldı. Misafir sayfasında yazı alanı yok. | Geçti |
| 19B.5 Eğriler | `:root` içinde `--egri-gecis: cubic-bezier(0.65, 0, 0.35, 1)` ve `--egri-giris: cubic-bezier(0.22, 1, 0.36, 1)`. Kodda başka eğri kalmadı (`ease-in`/`ease-out` sayısı 0). Açılış animasyonuna dokunulmadı. | Geçti |

Görüntüler `cerceve/`, `klavye/` ve `regresyon/` klasörlerinde. `regresyon/`, Görev 19 testlerinin yeni motorla yeniden çalıştırılmış hâli.

## Görev 19 testleri yeni motorla (regresyon)

Bütün rehber akışları iki boyutta yeniden çalıştırıldı ve hepsi baştan sona geçti:
- rezervasyon (8 adım), teklif, opsiyon, fiyat, paylaş, ödeme al ve yerleştir, alınan ödemeyi gir, gider, bakıcı, Drive, sihirbaz ipucu;
- 3. tamamlamada soru, Yardımlı mod kapalıyken rehbersiz açılış;
- uygulama turu, "Nasıl yapılır?";
- villa ve fotoğraf sürükleme: yenileme göstergesi 0, sıra değişti;
- Görev 18 tarih seçimi: 40/40.

Denetim artık "üst üste binen düğme" uyarısı veriyor. Sebebi şu: baloncuk paneli kaydırınca birlikte kayabilsin diye panelin içine taşındı. Bu yüzden karartılmış ve dokunulmaz hâldeki panel düğmelerinin üstünde duruyor. Bilerek böyle; o düğmelere rehber açıkken zaten dokunulamıyor.

## Testte bulunup düzeltilenler

1. **Baloncuk odaklı alanı kapatıyordu.** Klavye açıkken hedefin tamamı ve baloncuk birlikte sığmayınca baloncuk alanın üstüne biniyordu. Düzeltme: klavye açıkken rehber, hedefin içindeki odaklı alanı (etiketiyle birlikte) asıl hedef sayıyor. Bu durumda kaydırmayı da rehberin kendisi yapıyor; iki ayrı kaydırma çakışmıyor.
2. **Klavye kapanınca panel eski boyuna dönmüyordu.** Rehber katmanındaki görünmez dokunma engelleri panelin kaydırma alanını büyütüyordu. Düzeltme: katman artık içeriğin boyunda ve kırpılmış.
3. **Küçük ekranda 30 Kasım baloncuğun altında kalıyor.** iPhone 14 web görünümünde (664 px yükseklik) takvim ve baloncuk birlikte sığmıyor. Kullanıcı çerçevenin içinde kaydırarak 30'a ulaşabiliyor. Uygulama tam ekran olduğu için (844 px) uygulamada bu durum yok.

## Denenemeyenler

- Gerçek iPhone: iOS klavye açılırken web görünümünü kendisi kaydırabiliyor; bu davranış emülasyonda yok. Gerçek iPhone'da test edilecek.
- Android klavyesi: Android kendi boyutlandırmasını yapıyor; görünen alan küçülünce odaklı alan yine görünür tutuluyor, ama telefonda denenmedi.
