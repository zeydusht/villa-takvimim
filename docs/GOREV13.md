# Görev 13 — Konum, yataklar, kurallar, özel teklif

_Hazırlayan: Claude (ürün yöneticisi), 14 Kasım 2026. Zeyd'in Görev 12 sonrası denemesinden._

## Önce oku
- Görev 11–12 renk/ikon kuralları geçerli (para lacivert, sarı/turuncu yok, 4 buton türü, Lucide `ikon()`).
- **Veritabanı ve sunucu fonksiyonu hazır / Claude kuracak** (sen kurma, sadece kullan):
  - `teklifler` tablosu + `teklif_getir(p_kod)` fonksiyonu → `docs/VERITABANI_GOREV13.sql` (kayıt için repoya ekle).
  - `konum-coz` sunucu fonksiyonu → `supabase/functions/konum-coz/index.ts` (dosya klasörde hazır; repoya ekle, deploy ETME).
  - Bu ikisi kurulmadan önce 13.1 ve 13.7'yi test edemezsin; kod yaz, hata durumunda kullanıcıya düzgün mesaj göster.
- Yeni metinleri `dil.js`'e ekle (g.html dahil). Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

## A. Villa bilgileri

- [x] **13.1 Konumdan otomatik mesafe.**
  - "Konum" bölümünde: **"Google Haritalar bağlantısını yapıştırın"** alanı + yanında petrol renkli **"Konumu bul"** butonu (`map-pin`). Altında küçük ipucu: "Haritada evi açın → Paylaş → Bağlantıyı kopyala."
  - Butona basınca `konum-coz` fonksiyonu çağrılır (POST `{link}`, girişli kullanıcının jetonuyla; `drive-aktar` çağrısıyla aynı yöntem). Dönen `lat, lng, ad` villaya kaydedilir: `bilgi.konumKoord = {lat,lng}`, `bilgi.haritaLink = link`. Konum adı alanı boşsa `ad` ile doldurulur.
  - Koordinat gelince **mesafeler otomatik dolar** (istemcide hesapla, API yok):
    - Havalimanları listesi (koordinatlarıyla tek tabloda): Dalaman (DLM) 36.7131, 28.7925 · Antalya (AYT) 36.8987, 30.8005 · Gazipaşa (GZP) 36.2992, 32.3006 · Bodrum (BJV) 37.2506, 27.6643 · İzmir (ADB) 38.2924, 27.1570 · İstanbul (IST) 41.2753, 28.7519 · Sabiha Gökçen (SAW) 40.8986, 29.3092.
    - En yakın **2 havalimanı**: yol mesafesi ≈ kuş uçuşu (haversine) × 1,35, yuvarla 5 km'ye; süre ≈ km ÷ 65 km/sa, yuvarla 5 dakikaya. Örn. "Dalaman Havalimanı · 120 km · ~1 sa 50 dk".
    - Her mesafe satırı **düzenlenebilir** (km ve süre elle değişir; elle değiştirilen tekrar "Konumu bul"da ezilmez). Satırın yanında küçük gri "yaklaşık" yazısı, elle düzeltilince kalkar.
    - **"+ Mesafe ekle"**: kullanıcı kendi satırını ekler (ör. "Plaj · 800 m", "Market · 2 km", "Kalkan merkez · 5 km"). Silinebilir.
  - Misafir sayfasında (g.html) "Konum" bölümü: konum adı, mesafe satırları (ikonlu: `plane`, `map-pin`) ve **"Haritada aç"** butonu (haritaLink).

- [x] **13.2 Yatak sayıları.** Kapasite bölümüne − / + sayaçlarla: **Çift kişilik yatak** (`bed-double`), **Tek kişilik yatak** (`bed-single`), **Çekyat / kanepe yatak** (`sofa`). Misafir sayfasında künyede gösterilsin: "3 çift kişilik · 2 tek kişilik yatak". Boş olanlar görünmez.

- [x] **13.3 İkon denetimi.** "Hamak" `tree-palm` gösteriyor (palmiye) — yanlış. Tüm özellik ve olanak ikonlarını tek tek kontrol et:
  - `docs/IKON_LISTESI.html` oluştur: her özellik adı + ikonu yan yana, 3 sütun. Zeyd buradan bakıp onaylayacak.
  - Lucide'da tam karşılığı olmayanlar (hamak, şömine, sineklik, mama sandalyesi vb.) için Lucide çizgi stiline uygun (24×24, 2px çizgi, yuvarlak uçlar) **sade, özel SVG** çiz ve `ikonlar.js`'e ekle. Uyduramıyorsan genel ikon (`check`) kullan; alakasız ikon kullanma.

- [x] **13.4 Kurallar düzenlenebilir.** Hazır kurallar (sigara, evcil hayvan, parti, su, elektrik) aç/kapa olarak kalsın. Altına:
  - Kullanıcının eklediği kurallar listesi: her satırda metin + sağda çöp kutusu (`trash-2`, onay sormadan siler, alttaki "Geri al" ile geri getirir).
  - **"+ Kural ekle"** butonu → tek satır metin alanı → "Ekle". Örn. "Saat 23:00'ten sonra yüksek sesle müzik yok."
  - Satırlar basılı tutup sürükleyerek sıralanabilsin.
  - Misafir sayfasında ve rezervasyon formu PDF'inde tüm kurallar madde madde.

## B. Gezinme

- [x] **13.5 Geri gelince kaldığın yerde kal.** Bir ekranda aşağıdayken başka ekrana gidip geri gelince sayfa en üste atıyor. Her ekranın kaydırma konumu hafızada tutulsun; geri dönünce aynı yere dönsün (geri butonu, Android geri, kenardan kaydırma, panel kapatma). Alt menüde sekme değiştirince de her sekme kendi konumunu hatırlasın. Sadece **yeni** açılan ekran en üstten başlasın.

## C. Paylaşım

- [x] **13.6 Boş günleri paylaş netleşsin.** Şu an sessizce önümüzdeki **60 günün ilk 8 boş aralığını** gönderiyor; kullanıcı bunu bilmiyor. Butona basınca panel açılsın:
  - Dönem seçici: **"Bu ay" · "2 ay" · "3 ay" · "Sezon sonuna kadar"** (sezon sonu = 31 Ekim).
  - **"En az … gece"** sayacı (varsayılan 2): daha kısa boşluklar listelenmesin.
  - Mesaj önizlemesi (düzenlenebilir) + villa sayfası bağlantısı.
  - Butonlar: **"WhatsApp'ta gönder"** (ana) · "Kopyala".

- [x] **13.7 Özel teklif.** Villa sahibi seçtiği tarihler için birine özel fiyatlı teklif gönderebilsin; misafir bağlantıya tıklayınca o tarihler seçili, özel fiyatla açılsın.
  **Nereden açılır:**
  - Takvimde iki tarih seçilince (Görev 6.3 akışı) adım şeridinin yerine iki büyük buton: **"Rezervasyon ekle"** (yeşil, ana) · **"Teklif gönder"** (lacivert, `badge-percent`).
  - Yeni rezervasyon formundaki **"Fiyatı mesajla gönder"** butonu → **"Teklif olarak gönder"** olsun, aynı paneli o tarihlerle açsın.
  - Paylaş panelinde **"Özel teklif oluştur"** (tarihleri panelde seçer).
  **Teklif paneli:**
  - Üstte tarih ve gece sayısı (değiştirilebilir) + normal ücret kartı (Görev 8.1'deki kartın aynısı: geceler, kısa konaklama, konaklama ücreti, depozito).
  - **"Teklif fiyatı (konaklama)"** alanı, normal konaklama ücretiyle dolu gelir. Üstünde hazır düğmeler: **"%5"**, **"%10"**, **"%15"** indirim; dokununca alan güncellenir. Altında canlı: "Normal 8.400 ₺ → Size özel 7.500 ₺".
  - **Misafir adı** (isteğe bağlı; hitap için, Görev 8.12 kuralı: "Hasan Bey").
  - **Geçerlilik:** "3 gün" · "7 gün" · "Tarih seç" (varsayılan 3 gün).
  - **Mesaj önizlemesi** (düzenlenebilir):
    ```
    Merhaba Hasan Bey,
    Villa Salta için 13–16 Kasım (3 gece) size özel fiyatımız 7.500 ₺ (normal 8.400 ₺).
    Girişte 5.000 ₺ hasar depozitosu alınır, çıkışta iade edilir.
    Teklif 17 Kasım'a kadar geçerlidir.
    Fotoğraflar ve rezervasyon isteği için: <bağlantı>
    ```
  - Butonlar: **"WhatsApp'ta gönder"** (ana) · "Bağlantıyı kopyala".
  **Kaydetme:** Gönder/kopyala anında `teklifler` tablosuna kayıt: `kod` (8 karakter, `A–Z` ve `2–9`, karışan harfler yok: O/0/I/1 yok), `villa_id, giris, cikis, konaklama, normal, depozito, misafir_ad, mesaj, son_gecerlilik`. Bağlantı: `<site>/<paylaşım adı>?teklif=<kod>`. Villa sayfası henüz yayında değilse önce "Villa sayfanız yayında değil, önce yayınlayın" + "Yayınla" butonu.
  **Misafir sayfası (g.html, `?teklif=KOD`):**
  - `rpc/teklif_getir` (anon anahtarla) çağrılır. Geçerliyse: tarihler takvimde **seçili** gelir, sayfanın üstünde yeşil şerit **"Hasan Bey, size özel teklif"** + "13–16 Kasım · 3 gece · ~~8.400 ₺~~ **7.500 ₺** · 17 Kasım'a kadar geçerli".
  - Fiyat özetinde özel fiyat kullanılır, depozito notu aynı.
  - "Rezervasyon isteği oluştur" WhatsApp mesajına "Teklif kodu: KOD" eklenir.
  - Süresi geçtiyse: gri şerit "Bu teklifin süresi doldu. Güncel fiyatlar aşağıda." ve normal sayfa. Tarihler artık doluysa: "Bu tarihler artık dolu, lütfen başka tarih seçin."
  **Sahip tarafı — Teklifler listesi:**
  - Villa yönetiminde yeni satır **"Teklifler"** (`badge-percent`, lacivert). Liste: misafir adı, tarihler, teklif fiyatı, durum etiketi (**Açık** yeşil / **Süresi doldu** gri / **Kabul edildi** lacivert / **İptal** kırmızı çerçeve).
  - Teklife dokununca: "Bağlantıyı tekrar gönder", **"Rezervasyona çevir"** (yeni rezervasyon formu tarih, misafir adı ve teklif fiyatıyla dolu açılır; kaydedince teklif "kabul" olur), "Teklifi iptal et".

---

## Bitince
1. `docs/VERITABANI_GOREV13.sql` ve `supabase/functions/konum-coz/index.ts`'i repoya ekle. sw.js SURUM'u artır, commit, `git push`, `npx netlify-cli deploy --prod --dir www`.
2. `docs/PROJE_DURUMU.md`'yi güncelle. "Gelecek fikirler" başlığı altına ekle: "3D / sanal tur: villa fotoğraflarından 3D görünüm (Zeyd'in fikri, 14 Kasım). Şimdilik park edildi."
3. Zeyd'e 5-6 maddede teknik olmayan dille yaz.
