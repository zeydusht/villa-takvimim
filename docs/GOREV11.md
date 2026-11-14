# Görev 11 — Renk ve ikon sistemi (görsel destek)

_Hazırlayan: Claude (ürün yöneticisi), 14 Kasım 2026. Zeyd: "Çoğu yerde beyaz buton var, ilk kez kullanan için karışık. Renk ve ikonla görsel destek verelim."_

## Önce oku
- Sorun: Neredeyse her buton ve satır aynı (beyaz + gri çerçeve). Göz neye basacağını, neyin para, neyin misafir işi olduğunu ayıramıyor.
- Çözüm: iPhone Ayarlar ekranındaki gibi **her işin sabit bir rengi ve ikonu** olacak. Kullanıcı yazıyı okumadan rengi ve ikonu tanıyacak.
- **İkonlar çizilmez, hazır set kullanılır: Lucide** (ücretsiz, açık kaynak, çizgi ikon). SVG'leri `www/ikonlar.js` dosyasına göm (internetten yükleme YOK, app çevrimdışı da çalışmalı). Tek fonksiyon: `ikon("cuzdan", {boy:22})`. Mevcut elle yazılmış SVG'leri de bu fonksiyona taşı.
- Yazılar kalınlaştırılmaz. Görev 9 hareket kuralları geçerli. Yeni metinleri `dil.js`'e ekle. Veritabanına dokunma.
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

## Renk ve ikon tablosu (tek kaynak — kodda da tek bir nesne olarak tut)

| İş | Renk | Lucide ikonu |
|---|---|---|
| Rezervasyon, takvim, giriş/çıkış | Tema yeşili `#0B5B57` | `calendar-plus`, `calendar`, `log-in`, `log-out` |
| Para: ödeme, gelir & gider, kapora, depozito | Altın `#B0761A` | `wallet`, `banknote`, `receipt` |
| Fiyatlar | Altın `#B0761A` | `tag` |
| Misafirler | Lacivert `#3C4E8C` | `users`, `user` |
| Fotoğraflar | Mor `#7A4B8C` | `images`, `image-plus` |
| Paylaş, villa sayfası | Petrol `#2E6E8E` | `share-2`, `globe` |
| Bakıcılar | Zeytin `#4F6B22` | `key-round` |
| Villa bilgileri, kurulum | Tema yeşili | `house`, `list-checks` |
| Ara | Tema yeşili | `phone` |
| WhatsApp | WhatsApp yeşili `#25D366` | `message-circle` |
| Hesap, ayarlar, yardım | Gri `#5F6A64` | `user-round`, `settings`, `circle-help`, `lock` |
| Sil, iptal | Kırmızı `#9B2C4A` | `trash-2`, `x-circle` |

(Bu renkler `PALET` dizisinde zaten var; yeni renk icat etme.)

---

## A. Buton düzeni (en önemli kısım)

- [x] **11.1 Dört buton türü, başka tür yok.**
  1. **Ana buton**: dolu koyu yeşil, beyaz yazı + ikon. **Bir ekranda en fazla 1 tane** (o ekranın asıl işi: "Rezervasyonu kaydet", "Alınan ödemeyi gir", "+ Rezervasyon").
  2. **Renkli buton**: kendi iş renginin %12 açık zemini, aynı rengin çerçevesi, ikon ve yazı o renkte. Örn. "Fiyat gir" altın, "Paylaş" petrol, "WhatsApp" yeşil, "Ara" yeşil.
  3. **Sade buton**: beyaz zemin, gri çerçeve. Sadece "Vazgeç", "Daha fazla", "Tümünü gör" gibi önemsiz işler.
  4. **Tehlikeli buton**: beyaz zemin, kırmızı çerçeve ve yazı + `trash-2`. Hep ekranın en altında, araya boşluk.
  - Uygulamadaki bütün butonları bu dört türe göre düzenle. Beyaz buton sayısı belirgin şekilde azalmalı.

- [x] **11.2 Her butonda ikon.** Ana ve renkli butonlarda yazının solunda 20px ikon (tablodaki). Örn.: `calendar-plus` Rezervasyon · `tag` Fiyat gir · `share-2` Paylaş · `wallet` Alınan ödemeyi gir · `pencil` Rezervasyonu düzenle · `file-text` Rezervasyon formu (PDF) · `phone` Ara · `message-circle` WhatsApp.

## B. Satırlar (iPhone Ayarlar düzeni)

- [x] **11.3 İkon kutulu satırlar.** Gidilebilen tüm satırlar (Villa bilgileri, Misafirler, Gelir & gider, Bakıcılar, Fiyatlar, Hesap ekranındaki tüm satırlar, Takvim sekmesi satırları…):
  - Solda 36×36 yuvarlak köşeli kare: iş renginin %15 açık zemini, içinde o renkte 20px ikon.
  - Ortada başlık (+ isteğe bağlı küçük alt satır), sağda ok.
  - Aynı bölümdeki satırlar tek bir beyaz kartta, aralarında ince çizgi (ayrı ayrı kutu değil). Kartın dışında tek çerçeve.

- [x] **11.4 Rezervasyon satırları.** Yaklaşan rezervasyonlar ve Takvim sekmesi: solda misafirin rengiyle baş harfli yuvarlak (AY), giriş satırında küçük yeşil `log-in`, çıkışta gri `log-out` ikonu; kalan ödeme varsa sağda altın `wallet` + tutar (kırmızı rakam kalsın).

## C. Bilgi alanları

- [x] **11.5 Rezervasyon detayı ikonlu.** Giriş (`log-in`), Çıkış (`log-out`), Kişi (`users`), Telefon (`phone`), Not (`sticky-note`). "12.000 ₺ alınacak" satırının solunda altın `wallet`; "Ödemenin tamamı alındı" satırında yeşil `circle-check`.

- [x] **11.6 Bölüm başlıklarında ikon.** Villa ekranındaki bölüm başlıkları ("Yaklaşan rezervasyonlar", "Fiyatlar", "Villa yönetimi", "Fotoğraflar") başında 18px renkli ikon.

- [x] **11.7 Ay özeti kutuları renkli.** "Doluluk" kutusu açık yeşil zemin + `calendar`, "Bu ay" kutusu açık altın zemin + `wallet`, "Sonraki giriş" kutusu açık lacivert zemin + `log-in`.

## D. Alt menü

- [x] **11.8** Seçili sekmede ikon dolu (fill) çizilsin, diğerlerinde çizgi. Kabarcık (Görev 10) kalsın.

- [x] **11.11 Ekran ekran kontrol listesi.** Şu an kodda 67 tane beyaz "big ghost" buton var; hedef en fazla 15 (sadece Vazgeç / Tümünü gör / Daha fazla türü). 11.1–11.8'i bitirince aşağıdaki her ekranı tek tek aç ve kuralları uygula. Her ekranda **en fazla 1 dolu yeşil buton**, gerisi renkli ya da ikonlu satır:
  - Ana ekran (Villalarım) · Villa ekranı · Takvim sekmesi · Hesap ekranı (Hesabım, Kullanıcılar, Onay bekleyenler, Silinen villalar)
  - Rezervasyon detayı · Yeni rezervasyon · Rezervasyonu düzenle · Alınan ödemeyi gir · Ödeme kaydı · Toplam tutar · Rezervasyon formu · Teklif hazırla
  - Gelir & gider · Gelir/Gider ekle-düzenle · Kalan ödemeler · Giderlerim (bakıcı) · Depozitodan kesilen
  - Fiyatlar · Fotoğraflar · Fotoğraf ekle · Google Drive'dan al
  - Villa bilgileri · Villa sayfası / Paylaşım ayarları / Villa sayfanız hazır · Bakıcılar · Davet kodu · Misafirler
  - Kurulum sihirbazı (6 adım)
  Bitince `grep -c "big ghost" www/index.html` sonucunu ve her ekranda kaç beyaz buton kaldığını PROJE_DURUMU'na yaz.

## E. Çizimler (Codex ile hazırlanacak)

- [x] **11.9 Çizimleri bağla — SADECE `www/img/` klasöründe dosyalar varsa.** Zeyd `docs/CODEX_GORSELLER.md`'deki dosyaları Codex'e çizdirip `www/img/` içine koyacak. Varsa:
  - Hepsini 800px genişliğe küçült, WebP'ye çevir (her biri 120 KB altı), orijinal PNG'leri sil.
  - Yerleri: `bos-villa` → ana ekran "Hoş geldiniz" kartının üstü · `bos-rezervasyon` → rezervasyonsuz villada "Yaklaşan rezervasyonlar" boş hali · `bos-foto` → fotoğrafsız villada 4 boş kutunun üstü · `sihirbaz-hosgeldin` → kurulum sihirbazının 1. adımının üstü · `sihirbaz-hazir` → "🎉 Villanız hazır!" ekranı · `bos-takvim` → Takvim sekmesinde olay yoksa.
  - Çizim en fazla ekran genişliğinin %60'ı, ortada, altında mevcut metin.
  - Dosya yoksa bu maddeyi atla ve PROJE_DURUMU'na "çizimler bekleniyor" yaz.

## F. Kayıt

- [ ] **11.10 Veritabanı notu.** `docs/PROJE_DURUMU.md`'deki "Veritabanı Adım C" maddesini işaretle: "✅ 14 Kasım, Claude: eski klasörsüz yola yükleme kapandı (galeri_yukleyebilir: else → yalnız yönetici). Eski dosyalar okunmaya devam ediyor."

---

## Bitince
1. commit, `git push`, sonra `npx netlify-cli deploy --prod --dir www` (sw.js SURUM'u artır).
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Zeyd'e 5 maddede teknik olmayan dille yaz. Denemesi gerekenler: villa ekranı, rezervasyon detayı, Hesap ekranı.
