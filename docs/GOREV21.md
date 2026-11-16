# Görev 21 — Rehber: sabit odak şeridi (pencere sabit, sayfa kayar)

_Hazırlayan: Claude (ürün yöneticisi), 16 Kasım 2026. Zeyd'in 20:29 ekran kaydından. Her adımda rehber hedefi ekranın en ÜSTÜNE atıyor; Zeyd her seferinde elle sayfayı kaydırıp hedef alanı klavyenin hemen üstüne, baloncuğu da onun üstüne getiriyor. İstenen davranış tam olarak bu._

## Önce oku
- Görev 19/19B/20 üzerine; 20.1'deki "en üste yapışan şerit" çözümü ve hedefi en üste/en alta kaydırma mantığı bu görevle **iptal**.
- Netlify yok; commit + push. Açılış animasyonuna dokunma. Testler `docs/qa/gorev21/`.

---

- [x] **21.1 Odak şeridi (sabit konum).** Rehber açıkken ekranda sabit bir "odak hattı" tanımla:
  - **Klavye açıkken:** hedefin **alt kenarı klavyenin üst kenarının 12 pt üstünde**. Baloncuk hedefin **hemen üstünde** (8 pt boşluk), hedefin genişliğinde.
  - **Klavye kapalıyken:** hedefin alt kenarı, görünür alanın alttan %28'i yüksekliğinde (başparmak hizası; panelin sabit "Kaydet" butonu varsa onun 16 pt üstünde). Baloncuk yine hedefin hemen üstünde.
  - Hedef çok uzunsa (ör. ücret kartı) ve bu hatta sığmıyorsa: hedefin tamamı görünecek şekilde, baloncuk + hedef birlikte görünür alana sığacak en düşük konum seçilir; yine en üste yapıştırılmaz.

- [x] **21.2 Pencere sabit, sayfa kayar.** "İleri"ye basınca:
  - Aydınlık pencere (delik) ve baloncuk **yerlerinden kalkmaz**; sadece pencere yeni hedefin genişlik/yüksekliğine uyacak şekilde yumuşakça boy değiştirir (alt kenarı odak hattında sabit kalır).
  - Arkadaki içerik (panelin kaydırma kabı ya da sayfa) yeni hedef odak hattına oturacak kadar **yukarı (ya da aşağı) kayar**. Süre 420 ms, `--egri-gecis`. Pencere boyu değişimi ve içerik kaydırması aynı anda, aynı eğriyle.
  - Baloncuk metni 120 ms çapraz geçişle değişir; baloncuk yeni hedefin genişliğine göre yumuşakça genişler/daralır.
  - Hiçbir adımda içerik "önce en üste gidip sonra geri gelme" yapmaz; tek, düz bir kayma.

- [x] **21.3 Kaydırma alanı yetmezse boşluk ekle.** Hedef panelin/sayfanın en altındaysa ya da en üstündeyse ve içerik yeterince kaymıyorsa, kaydırma kabının üstüne/altına geçici boşluk (padding) ekle ki hedef her zaman odak hattına gelebilsin. Rehber bitince boşluk yumuşakça kaldırılır.

- [x] **21.4 Klavye açılıp kapanınca.** Odak hattı klavyeyle birlikte hareket eder: klavye açılırken pencere ve baloncuk klavyenin animasyonuyla eşzamanlı yukarı çıkar (`keyboardWillShow` / visualViewport resize; iOS klavye animasyonu ~250 ms), içerik buna göre kayar. Klavye kapanınca (ör. "Tamam" / sayı alanından düğme adımına geçiş) aynı şekilde aşağı iner. Ekran sekmez (19B.4, 20.9 kuralları geçerli).

- [x] **21.5 Kullanıcı elle kaydırırsa.** Kullanıcı rehber açıkken sayfayı elle kaydırırsa pencere hedefi takip eder (19B.3, gecikmesiz). "İleri"ye basınca 21.2 tekrar uygulanır (hedef yine odak hattına gelir).

- [x] **21.6 Test (Playwright, iPhone 14 emülasyonu, klavye açık/kapalı):** Rezervasyon rehberinin her adımında ölç ve `docs/qa/gorev21/olcum.md`'ye yaz:
  - klavye açıkken: `klavyeÜst - hedefAlt` = 12 ± 2 pt,
  - baloncuk alt kenarı ile hedef üst kenarı arası 8 ± 2 pt,
  - adım geçişinde pencerenin alt kenarı hiç oynamıyor (± 1 pt),
  - geçiş sırasındaki ara karelerde hedef hiçbir zaman ekranın üst %20'sine çıkmıyor.

---

## Bitince
1. sw.js SURUM'u artır, `npx cap sync`, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: rehberle rezervasyon gir; her İleri'de aydınlık alan klavyenin hemen üstünde sabit kalmalı, sadece arkadaki sayfa kaymalı".
