# Görev 19 — Yardımlı mod: her işlem rehberle, sürükleme hatası

_Hazırlayan: Claude (ürün yöneticisi), 16 Kasım 2026. Zeyd: "Tutorial çok güzel. Kullanıcı hangi işleme basarsa, o tutorial ekranı (etraf kararır, sadece ilgili yer açık) o işlemi adım adım yaptırsın. Kullanıcılar yaşlı."_

## Önce oku
- Görev 18.13'teki uygulama turu altyapısını (perde + delik + baloncuk) **tek, yeniden kullanılabilir bir rehber motoruna** çevir: `www/rehber.js`. Tüm işlemler bu motorla tanımlansın (adım listesi = veri, kod tekrarı yok).
- Netlify yok; commit + push. Açılış animasyonuna dokunma. Görev 18'deki "kendi kendini test et" kuralı geçerli (390×844 ve 360×740 ekran görüntüleri: `docs/qa/gorev19/`).
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

## A. Rehber motoru

- [x] **19.1 `rehber.js` motoru.** Bir rehber = adım listesi. Her adım:
  - `hedef`: vurgulanacak öğe (seçici ya da fonksiyon); gerekirse önce ona kaydır.
  - `metin`: büyük, sade cümle (18 px, en fazla 2 satır), örn. "Misafirin **gireceği** güne dokunun".
  - `bekle`: adımın nasıl geçileceği: `dokunus` (hedefe dokununca), `deger` (alana yazı girilince, sonra baloncukta "Tamam" butonu), `olay` (ör. "tarih seçildi", "panel açıldı", "kaydedildi"), `ileri` (sadece bilgi; "İleri" butonu).
  - `atla_eger`: koşul doğruysa adım atlanır (ör. tarihler zaten seçiliyse).
  Görünüm: ekranın geri kalanı %60 koyu perde; hedef etrafında yuvarlak köşeli "delik" ve yumuşak nabız halkası; baloncuk hedefin üstünde ya da altında (sığan tarafta), hedefi gösteren küçük okla. Baloncukta: adım sayacı (●●○○), metin, "Geri" ve sağ üstte **"Yardımı kapat"**. Perde hedef dışındaki dokunuşları yutar ve baloncuğu hafifçe sallar (yanlış yere basıldı).
  - Klavye açılınca baloncuk klavyenin üstünde kalsın (visualViewport), hedef alan görünür olsun.
  - Paneller (sheet) içindeki öğeleri de vurgulayabilsin; panel açılınca perde paneli de kapsasın.
  - Geçişler: delik bir hedeften diğerine 280 ms'de kayarak/büyüyerek gider (ani atlama yok), baloncuk solarak yer değiştirir. "Hareketi azalt"a uy.
  - Her rehber bitince kısa başarı: büyük ✓ + "Rezervasyon kaydedildi" + başarı titreşimi.

- [x] **19.2 "Yardımlı mod" ayarı.** Hesap → Yardım: **"Yardımlı mod"** aç/kapa, **varsayılan AÇIK**. Açıkken aşağıdaki tüm işlemler rehberle başlar. Kapalıyken işlemler doğrudan açılır. Bir rehber aynı kullanıcıda 3 kez sonuna kadar tamamlanınca, bitişte bir kez sor: "Bu işlemi artık biliyor musunuz? Bu işlem için yardımı kapatayım mı?" (Evet → sadece o işlemin rehberi kapanır; Hesap'tan hepsi geri açılabilir.) Tercihler cihazda saklansın (try/catch).

## B. İşlem rehberleri (Yardımlı mod açıkken)

- [x] **19.3 + Rezervasyon (üstteki hap, villa ekranı):**
  1. (Tarih seçili değilse) takvime kaydır, takvim vurgulu: "Misafirin **gireceği** güne dokunun." → bekle: başlangıç seçildi.
  2. "Şimdi misafirin **çıkacağı** güne dokunun." → bekle: aralık seçildi. (Yanlışlıkla seçim temizlenirse 1. adıma dön.)
  3. Rezervasyon formu kendiliğinden açılır (alttaki panelde ayrıca Rezervasyon'a bastırma); ücret kartı vurgulu: "Toplam ücret burada. Değiştirmek için ‘Değiştir’e dokunabilirsiniz." → İleri.
  4. Ad soyad alanı: "Misafirin adını yazın." → bekle: değer.
  5. Kişi sayısı: "Kaç kişi gelecek? − ve + ile ayarlayın." → İleri.
  6. Telefon: "Misafirin telefonu (isteğe bağlı)." → İleri.
  7. Kapora: "Kapora aldıysanız açın ve tutarı yazın." → İleri.
  8. Kaydet butonu: "Rezervasyonu kaydetmek için dokunun." → bekle: kaydedildi → ✓.
  Tarihler önceden seçiliyse 1–2 atlanır. Alttaki seçim panelinden "Rezervasyon"a basılırsa 3. adımdan başlar.
- [x] **19.4 Teklif:** tarih adımları (1–2) → teklif paneli: teklif fiyatı ("İndirim yapmak için %5/%10/%15'e dokunun ya da fiyatı yazın") → misafir adı (isteğe bağlı) → geçerlilik → mesaj önizlemesi ("Misafire gidecek mesaj bu") → "WhatsApp'ta gönder" → ✓.
- [x] **19.5 Opsiyon:** tarih adımları → misafir adı → telefon → "Opsiyon ne kadar geçerli?" (1/2/3 gün) → Kaydet → ✓ "Opsiyon süresi bitince kendiliğinden kalkar."
- [x] **19.6 Fiyat gir:** Fiyatlar ekranı açılır → "Fiyat girmek istediğiniz aya dokunun" (ya da "Tüm yıla fiyat gir") → hafta içi alanı → hafta sonu alanı → Kaydet → ✓.
- [x] **19.7 Paylaş:** panel → "Bu bağlantıyı misafirlerinize gönderin. Fotoğrafları, boş günleri ve fiyatları görürler." → "Bağlantıyı paylaş"a dokunun → ✓.
- [x] **19.8 Ödeme ve yerleştirme:** "Ödemeyi al ve misafiri yerleştir" ve "Alınan ödemeyi gir": tutar ("Tamamını aldıysanız bu düğmeye dokunun") → Kaydet → "Misafiri yerleştirdiniz mi?" → ✓.
- [x] **19.9 Diğerleri (aynı kalıpla):** Gider ekle (Gelir & gider), Fotoğraf ekle / Drive'dan al, Bakıcı ekle (Hesap), Villa ekle (sihirbazın her adımında üstte küçük ipucu baloncuğu yeterli; tam perde gerekmez).
- [x] **19.10 Rehberler arası tutarlılık:** Aynı tür adım hep aynı cümle (tarih adımları birebir aynı metin). Metinleri tek bir sözlükte topla, `dil.js`'e İngilizcelerini ekle.

## C. Hata: Villa sıralarken sayfa yenileniyor

- [x] **19.11 Sürüklerken sayfa kilitlensin.** Villalarım'da en üstteki villayı basılı tutup aşağı sürükleyince "aşağı çekip yenile" tetikleniyor.
  - Uzun basma (400 ms) algılanıp sürükleme başladığı anda: sayfa kaydırması kilitlensin, aşağı çekip yenileme ve kenardan geri kaydırma devre dışı kalsın; sadece sürükleme sürerken `touchmove` passive olmayan dinleyiciyle `preventDefault` (başka zaman passive kalsın).
  - Uzun basma süresi dolmadan parmak 8 px'ten fazla kayarsa sürükleme başlamasın (normal kaydırma çalışsın).
  - Sürüklenen kart ekranın üst/alt kenarına yaklaşınca liste yumuşakça kendi kendine kaysın.
  - Bırakınca kilitler kalksın. Aynı kural ileride sürüklenebilen diğer listelerde de (kurallar, odalar, fotoğraflar) geçerli olsun: ortak bir yardımcı fonksiyon.
  - Playwright'ta dokunma emülasyonuyla test et: en üstteki villayı en alta taşı → yenileme göstergesi hiç görünmemeli, sıra değişmeli.

---

## Bitince
1. sw.js SURUM'u artır, `npx cap sync`, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının **en altına** çok kısa özet (5 madde) + deneme bağlantısı https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene": villa ekranında üstteki "+ Rezervasyon"a bas ve rehberi sonuna kadar takip et; en üstteki villayı aşağı sürükle.
