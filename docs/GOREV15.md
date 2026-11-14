# Görev 15 — Referans siteden eksiklerimiz (Villa Sepeti karşılaştırması)

_Hazırlayan: Claude (ürün yöneticisi), 14 Kasım 2026. villasepeti.com'daki Villa Salta ilanı satır satır incelendi; bizde olmayan ve villa sahibine/misafire gerçekten faydalı olanlar seçildi. Ödeme, favoriler, üyelik gibi pazar yeri özellikleri bilerek alınmadı (biz ödeme almıyoruz)._

## Önce oku
- Görev 11–14 kuralları geçerli (Lucide ikonları, para lacivert, sarı yok, yazı kalın değil, 4 buton türü).
- Yeni alanlar `villalar.bilgi` (JSON) içine yazılır; yeni tablo/sütun gerekmez. Rezervasyon "opsiyon" durumu için 15.4'e bak.
- Her yeni alan: uygulamada (Villa bilgileri + kurulum sihirbazında uygun adım) girilir, misafir sayfasında (g.html) gösterilir, rezervasyon formu PDF'inde ilgiliyse yer alır. Boşsa hiçbir yerde görünmez.
- Yeni metinleri `dil.js` ve g.html CEV sözlüğüne ekle. Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

- [x] **15.1 Konum haritası (misafir sayfası).** Konum bölümünde, mesafe satırlarının üstünde 220px yüksekliğinde harita. Koordinat Görev 13.1'deki `bilgi.konumKoord`.
  - Leaflet (cdnjs, sabit sürüm, örn. `leaflet@1.9.4`) + OpenStreetMap karoları. Haritanın sağ altında "© OpenStreetMap" yazısı kalsın (zorunlu).
  - **Gizlilik:** Villa bilgilerinde "Haritada göster" seçici: **"Yaklaşık bölge (önerilen)"** → tam nokta yerine ~800 m yarıçaplı yeşil yarı saydam daire, merkez kayık (koordinatı 300–500 m rastgele ama her açılışta aynı kaydır: villa id'den türet) · **"Tam konum"** → iğne. Varsayılan: yaklaşık.
  - Harita sürüklenebilir/yakınlaştırılabilir ama sayfa kaydırmasını engellemesin (tek parmak sayfayı kaydırır, iki parmak haritayı oynatır; ya da haritaya dokununca "Haritayı büyüt" tam ekran açılır — daha basit olanı seç).
  - Altında "Haritada aç" butonu kalsın.

- [x] **15.2 Oda oda bilgi.** Villa bilgilerinde yeni bölüm **"Odalar"** (`door-open`): "+ Oda ekle" ile kart kart:
  - Oda türü: Yatak odası / Salon / Mutfak / Diğer · Kat: Bahçe katı / Zemin / 1. kat / 2. kat / Çatı
  - Yataklar (sayaç): çift kişilik, tek kişilik, çekyat, bebek yatağı
  - Onay kutuları (ikonlu): Banyolu (en-suite) `bath` · Klima `snowflake` · TV `tv` · Balkon/teras `sun` · Jakuzi `bath` · Deniz manzarası `sailboat`
  - Kartlar sürüklenerek sıralanır, silinebilir. Yatak toplamları Görev 13.2'deki sayaçlarla çakışmasın: oda girildiyse toplamlar odalardan hesaplanır ve 13.2 sayaçları "Odalardan hesaplandı" diye kilitli görünür.
  - Misafir sayfasında "Odalar" bölümü: her oda küçük kart (başlık "1. Yatak odası · Zemin kat", altında ikonlu satır: "Çift kişilik yatak · Banyolu · Klima").

- [x] **15.3 Havuz bilgisi.** "Özel havuz" vb. seçiliyse Villa bilgilerinde **"Havuz"** bölümü: boyut (en × boy m), derinlik (m, örn. 1,55), çocuk havuzu (var/yok + boyut, derinlik), ısıtma (var/yok, ücretli mi), korunaklı mı. Misafir sayfasında künyenin altında tek satır: `waves` "Havuz 12 × 4 m · derinlik 1,55 m · çocuk havuzu 1 × 1,5 m".

- [x] **15.4 Takvimde "Opsiyonlu" durum.** Villa sahipleri telefonda "size 2 gün opsiyon koyuyorum" der; bizde yok.
  - Takvimde tarih seçince çıkan butonlara üçüncüsü: **"Opsiyon koy"** (gri-lacivert, `clock`). Panel: misafir adı, telefon, **son geçerlilik** (1 gün / 2 gün / 3 gün / tarih), not.
  - Opsiyon takvimde **taralı (çizgili) mavi-gri** blok; açıklama satırına "Opsiyonlu" eklenir. Misafir sayfasında da "Opsiyonlu" ayrı renkte görünür (seçilemez, "Bu tarihler şu an opsiyonlu" yazar).
  - Opsiyon detayında: **"Rezervasyona çevir"** (formu doldurur) · "Süreyi uzat" · "Opsiyonu kaldır".
  - Süresi dolan opsiyon kendiliğinden düşer (takvimden kalkar, "Süresi doldu" olarak opsiyon listesinde 7 gün görünür). Ana ekran "Bugün ve yarın" kartında: "Opsiyon yarın bitiyor · Ali Kaya · Villa Salta".
  - **Veri:** Mevcut `rezervasyonlar` tablosu kullanılabilir mi kontrol et (ör. `aciklama` ya da yeni bir alan). Yeni sütun gerekiyorsa (`durum text default 'kesin'`, `opsiyon_bitis date`) **yapma**; `docs/PROJE_DURUMU.md`'ye "Veritabanı için gerekenler (Görev 15)" altında SQL taslağıyla yaz, Claude kuracak. O zamana kadar bu maddeyi yarım bırak ve not düş.

- [x] **15.5 İptal ve iade koşulları.** Villa bilgilerinde **"İptal ve iade"** bölümü: hazır şablonlardan seç + düzenle:
  - "Esnek: girişe 14 gün kalaya kadar iptalde kapora iade edilir."
  - "Orta: girişe 30 gün kalaya kadar iptalde kaporanın yarısı iade edilir."
  - "Katı: kapora iade edilmez; tarih değişikliği bir kez ücretsiz."
  - "Kendi metnim"
  Misafir sayfasında Ev kurallarının altında `file-text` ikonlu bölüm, rezervasyon formu PDF'inde de yer alsın.

- [x] **15.6 Bilmeniz gerekenler.** Villa Sepeti'nde ilanın en işe yarar kısmı "Not 1: villaya 20 basamakla çıkılıyor", "son 400 m toprak yol", "alarm var" gibi notlar; misafir şikâyetini önlüyor. Villa bilgilerinde **"Bilmeniz gerekenler"** listesi (Görev 13.4'teki kural listesiyle aynı düzen: ekle/sil/sırala). Hazır öneri düğmeleri (dokununca listeye eklenir, düzenlenebilir): "Villaya … basamakla çıkılıyor" · "Yolun son … metresi toprak/stabilize" · "Araç gerekli" · "Alarm sistemi var" · "Bölgede inşaat olabilir" · "Doğa içinde, böcek görülebilir". Misafir sayfasında künyenin hemen altında `triangle-alert` ikonlu, açık gri kutuda madde madde.

- [x] **15.7 Turizm izin belge numarası.** Türkiye'de kısa süreli kiralanan konutların ilanlarında Kültür ve Turizm Bakanlığı izin belge numarası gösterilmeli (7464 sayılı Kanun; Bakanlık 2026/4 Genelgesi platformlara belgesiz ilanları kaldırma zorunluluğu getirdi). Villa bilgileri → "Fiyat ve iletişim" bölümüne **"Turizm izin belge no"** alanı (örn. 07-5902). Doluysa misafir sayfasının en altında `badge-check` ikonuyla "T.C. Kültür ve Turizm Bakanlığı izin belge no: 07-5902". Boşsa villa sayfası yayınlanırken uyarı: "İzin belge numaranızı girmeniz önerilir." (Engelleme yok, sadece uyarı.) Kurulum sihirbazının 6. adımına da ekle.

- [x] **15.8 Takvim: iki ay yan yana (geniş ekran).** Misafir sayfasında ekran 720px'ten genişse iki ay yan yana gösterilsin (telefonda tek ay kalsın).

---

## Bitince
1. sw.js SURUM'u artır, commit, `git push`, `npx netlify-cli deploy --prod --dir www`.
2. `docs/PROJE_DURUMU.md`'yi güncelle; 15.4 için veritabanı gereksinimi varsa yaz.
3. Zeyd'e 5-6 maddede teknik olmayan dille yaz.
