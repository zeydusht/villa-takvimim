# Görev 12 — Renk düzeltmesi ve ince ayar

_Hazırlayan: Claude (ürün yöneticisi), 14 Kasım 2026. Zeyd'in Görev 11 sonrası iPhone denemesinden._

## Önce oku
- Görev 11'in yapısı (4 buton türü, ikon kutulu satırlar, Lucide `ikon()`) kalıyor. Bu görev **renkleri** ve kalan karışık ekranları düzeltiyor.
- Yazılar kalınlaştırılmaz (tek istisna 12.4'teki "Sıradaki" kartı başlığı: font-weight 500'e kadar serbest). Yeni metinleri `dil.js`'e ekle. Veritabanına dokunma.
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

## A. Renkler: sarı ve turuncu kalkıyor

- [x] **12.1 Yeni renk tablosu.** Zeyd sarı/altın ve turuncu tonları beğenmedi (Fiyat gir butonu, "Boş" etiketi, Fiyatlar ekranı, "Eksik" etiketi, depozito kartı). Uygulamada sarı, altın, krem, turuncu zemin **kalmayacak**. Görev 11'deki tabloyu şöyle değiştir (tek nesne olarak tut):

  | İş | Renk |
  |---|---|
  | Rezervasyon, takvim, villa, ara | Tema yeşili `#0B5B57` |
  | **Para: ödeme, gelir & gider, fiyatlar, kapora, depozito** | **Lacivert `#3C4E8C`** (eskiden altın) |
  | Misafirler | Mor `#7A4B8C` |
  | Fotoğraflar, paylaş, villa sayfası | Petrol `#2E6E8E` |
  | Bakıcılar | Zeytin `#4F6B22` |
  | Hesap, ayarlar | Gri `#5F6A64` |
  | Alınacak para, ödenmedi, sil | Kırmızı `#9B2C4A` (kalıyor — Zeyd "Ödenmedi" kırmızısını beğendi) |

  - `--turuncu*` değişkenleri, `.is-para` altın tonları, `#B0761A`, `.depKart` krem/turuncu zemin ve kodda kalan tüm sarı/turuncu/krem tonlar bu tabloya göre değişsin. `PALET` (misafir/rezervasyon renkleri) aynı kalsın.
  - **"Boş" etiketi:** açık gri zemin `#EEF1EF`, gri nokta, koyu gri yazı. "Dolu" yeşil kalsın. (Boş bir sorun değil, sadece durum.)
  - **"Eksik · 1/6" etiketi:** lacivert çerçeve ve yazı, beyaz zemin.
  - **"Yarın çıkış" / "2 gün sonra" etiketleri:** turuncu yerine lacivert-açık zemin.
  - Bitince `grep -inE "B0761A|turuncu|FBF0DD|FEF6EC|E9C48E|F3E6CF" www/*.html www/*.js` boş dönmeli (g.html dahil). Codex çizimlerine dokunma.

## B. Villa ekranı

- [x] **12.2 "Bu ay 14 gece boş · Boş günleri paylaş" satırını kaldır** (villa ekranından tamamen). Boş günleri paylaşma özelliği "Paylaş" panelinin içinde kalsın.

- [x] **12.3 HATA: Takvimde bugünün dairesi yukarıda.** Ölçüm (390px, 14 Kasım, dolu gün): bugünün `.gn` dairesi hücre üstünden **−4px**, komşu günlerin rakamı **+8px** → bugün 12px yukarıda. Bu hata daha önce de çıkmıştı. Sebebi bul (`.cell.today .gn` flex + yükseklik, dolu hücre `.full` kuralları, baş harf etiketi). Düzelttikten sonra dolu/boş/geçmiş/seçili her durumda bugünün rakamı komşularla **aynı hizada** olsun; ölçüp `getBoundingClientRect` ile doğrula.

- [x] **12.4 "Sıradaki" kartı dikkat çeksin.** "Yaklaşan rezervasyonlar" listesinin üstünde, en yakın olay için ayrı ve büyük bir kart:
  ```
  SIRADAKİ                                   2 gün sonra
  16 Kasım Pazartesi · 16:00
  Ayşe Yılmaz girecek                       28.000 ₺ alınacak
  ```
  - Olay giriş ise "… girecek" (yeşil `log-in`), çıkış ise "… çıkacak" (gri `log-out`). Şu an konaklayan misafirin çıkışı en yakın olaysa onu göster.
  - Tarih satırı 20px, isim satırı 18px; kart açık yeşil zemin + yeşil çerçeve. Dokununca rezervasyon detayı açılır.
  - Altındaki listede aynı rezervasyon tekrar etmesin. "Sıradaki 1" yazısı kalksın, liste başlığı sadece "Yaklaşan rezervasyonlar".
  - Liste satırlarında da tarih yanında "girecek / çıkacak" yazsın.

## C. Fiyatlar

- [x] **12.5 Tüm yıla fiyat.** Fiyatlar → Aylar sekmesinde listenin üstünde lacivert renkli buton: **"Tüm aylara fiyat gir"** → mevcut ay paneli açılır ama 12 ayın hepsi seçili gelir (hafta içi + hafta sonu fiyatı). Ayrıca çoklu seçim çubuğunda **"Tümünü seç"** düğmesi.
- [x] **12.6 Fiyatlar ekranında sarı kalmasın.** (12.1'in parçası ama ayrıca kontrol et: seçili ay satırları, fiyat girme paneli, "Fiyat girilmedi" yazıları.) Seçili ay = açık lacivert zemin + lacivert çerçeve.

## D. Paylaş

- [x] **12.7 "Paylaşımı kaldır" kafa karıştırıyor.** Paylaş panelinde asıl işin hemen altında kırmızı buton olarak duruyor; ne işe yaradığı anlaşılmıyor.
  - Adı: **"Villa sayfasını yayından kaldır"**, panelin en altında, araya çizgi, tehlikeli buton.
  - Altında tek satır açıklama: "Paylaştığınız bağlantı çalışmaz. Fotoğraflar ve bilgiler silinmez, istediğiniz zaman yeniden yayınlayabilirsiniz."
  - Basınca onay sorulsun.
  - Panelin üstü: büyük "Bağlantıyı paylaş" (ana buton) + "Bağlantıyı kopyala" + "Sayfayı önizle" (petrol renkli butonlar) + "Boş günleri paylaş" (12.2'den buraya).

## E. Fotoğraflar ekranı

- [x] **12.8 Başlık düzeni.** "Seç" sağ üstte tek başına, "Fotoğraflar" başlığı aşağıda (Görev 7.7'de Fiyatlar ve Misafirler'de düzeltilen aynı sorun). Başlık en üstte; altında yan yana renkli butonlar: **"Fotoğraf ekle"** (`image-plus`), **"Drive'dan al"** (`cloud-download`), **"Birden fazla seç"** (`check-square`). Hepsi ikonlu.

## F. Alt ekranlarda villa fotoğrafı

- [x] **12.9 Hangi villadayım?** Villanın alt ekranlarında (Gelir & gider, Misafirler, Fiyatlar, Fotoğraflar, Villa bilgileri, Bakıcılar) başlığın sağında 44×44 yuvarlak köşeli küçük kapak fotoğrafı (kapak yoksa villa renginde baş harf). Başlığın altındaki villa adı kalsın.

## G. Villa bilgileri

- [x] **12.10 Villa bilgileri ekranı sade ve ikonlu.**
  - Ekran bölümlere ayrılsın, her bölüm başlığında ikon: **Fiyat ve iletişim** (`wallet`, lacivert) · **Konum** (`map-pin`) · **Kapasite** (`users`) · **Özellikler** (`sparkles`) · **Ev olanakları** (`house`) · **Açıklama** (`text`) · **Kurallar** (`list-checks`).
  - Kapasitede kişi / yatak odası / banyo / m² alanları − / + butonlu sayaç, her birinde ikon (`users`, `bed-double`, `bath`, `ruler`).
  - **Özellik ve olanak düğmeleri emojiden Lucide ikonlarına geçsin** (tek tabloda; `ozellik.js`'i güncelle, misafir sayfası g.html de aynı ikonları kullansın). Önerilen eşleşme: Özel havuz `waves` · Korunaklı havuz `shield` · Isıtmalı havuz `thermometer-sun` · Çocuk havuzu `baby` · Jakuzi `bath` · Deniz manzarası `sailboat` · Doğa manzarası `mountain` · Otopark `square-parking` · Sessiz konum `volume-x` · Araç gerekli `car` · Bebek ekipmanı `baby` · Engelli erişimi `accessibility` · Buzdolabı `refrigerator` · Bulaşık makinesi `utensils` · Çamaşır makinesi `washing-machine` · Klima `snowflake` · Wi-Fi `wifi` · Mangal `flame` · TV `tv`. Eksikleri sen tamamla.
  - Düğme: seçili değilken beyaz zemin + gri çerçeve + gri ikon; seçiliyken açık yeşil zemin + yeşil çerçeve + yeşil ikon + ✓. 2 sütunlu ızgara, her düğme 48px yüksek.
  - Ekranın altında sabit tek ana buton: **"Kaydet"**. Ekrandaki diğer beyaz butonları gözden geçir; 4 buton türü kuralına uydur.

---

## Bitince
1. sw.js SURUM'u artır, commit, `git push`, `npx netlify-cli deploy --prod --dir www`. Netlify'daki sw.js'in yeni SURUM'u gösterdiğini kontrol et.
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Zeyd'e 5-6 maddede teknik olmayan dille yaz. Not ekle: "Telefonda eski görünürse uygulamayı kapatıp 2 kez aç."
