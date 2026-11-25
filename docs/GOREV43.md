# Görev 43 — Ödeme renkleri tek kural, kaydırarak geri dönüş, yeni geri düğmesi

**Kurallar:**
- Veritabanına dokunma.
- Deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.

**Test kuralı:** Testler kısa tutulsun.
- Geliştirirken sadece chromium kullan, 390 genişlik ve 320 + "Çok büyük" yazı.
- Webkit en sonda bir kez çalışsın. 10 dakikadan uzun sürerse atla ve özete yaz.
- Bir test 3 denemede geçmiyorsa dur, sorunu özete yaz, sonraki adıma geç.

---

## 43.1 — Ödeme durumu: tek kural, her yerde aynı renk

Zeyd'in kuralı. Kişi renge bakınca anlasın:

| Durum | Renk | İkon | Yazı |
|---|---|---|---|
| **Tam alındı** | yeşil | ✓ | "Ödemenin tamamı alındı" |
| **Eksik alındı** (kapora vb.) | **sarı/amber** | ! | "5.000 ₺ eksik · 5.000 ₺ alındı" |
| **Hiç alınmadı** | **sarı/amber** | ! | "Henüz ödeme alınmadı · 10.000 ₺" |
| **Fazla alındı** | **kırmızı** | ⚠ | "15.000 ₺ fazla alındı" |
| Fiyat girilmemiş | nötr gri | – | şimdiki gibi |

- **Tek fonksiyon.** Bunu tek bir fonksiyon hesaplasın: `odemeDurumu(v, r)` → `tam` / `eksik` / `hic` / `fazla` / `yok`. Bütün ekranlar renk ve yazıyı oradan alsın, her yerde ayrı hesap olmasın. Bakıcıda `kalanSunucu` ile çalışsın.
- **Renk tokenleri:**
  - Yeşil ve kırmızı uygulamanın mevcut tokenlerinden gelsin.
  - Sarı için yeni token ekle:
    - yazı koyu amber, örneğin `#7A5200`;
    - zemin açık amber, örneğin `#FFF3D1`;
    - kenar `#E3A400`.
  - Kontrast en az 4.5:1 olsun.
- **Kırmızıyı başka şeyde kullanma.** Kırmızı artık **sadece fazla ödeme** için. 41.1 ve 41.2'de "kalan" ve "eksik" kırmızı yapılmıştı; bunlar **sarıya** dönsün.
- **Bakmayınca anlaşılsın.** Renk tek başına anlam taşımasın, ikon ve yazı da hep olsun.

Bu kuralı şu yerlere uygula:
1. **Rezervasyon detayı, alttaki durum satırı.**
   - Şu an fazla ödemede bile "✓ Ödemenin tamamı alındı" yazıyor. Ekran görüntüsünde Toplam 13.000, Alınan 28.000 → yanlış.
   - Tablodaki yazı, renk ve ikon gelsin.
   - Fazlada "Alınan: 28.000 ₺" satırının altına kırmızı "Fazla alındı: 15.000 ₺" satırı eklensin.
2. **Rezervasyon detayı, "Ödemeler" yuvarlak düğmesi.**
   - Şu an hep mor. Duruma göre renklensin: yeşil, sarı ya da kırmızı zemin ve aynı renkte ikon.
   - Sağ üstünde küçük durum rozeti olsun: ✓ / ! / ⚠.
3. **Rezervasyon detayı, en üstteki "25.000 ₺ alınacak" kartı.** Duruma göre sarı ya da kırmızı.
4. **Ödemeler ekranı.** Üç kutu ve durum satırı aynı kurala uysun.
   - Kalan kutusu sarı.
   - Fazla kutusu kırmızı.
   - Alınan kutusu yeşil kalsın.
5. **Sıradaki kartı (41.2).** Kartın rengi ödeme durumunu göstersin:
   - tam → yeşil;
   - eksik ya da hiç → sarı;
   - fazla → kırmızı.

   Yerleşme durumu yazıyla kalsın: "Yerleşti · 19:16" ya da "Bugün 16:00 gelecek". Sıradaki olay çıkışsa kart nötr kalsın.
6. **Ajanda kartları ve villa listesi.** Ödeme satırları ve etiketleri aynı renklerle gösterilsin.

**Test:** 4 durum için detay, Ödemeler ve Sıradaki ekran görüntüsünü al. Renk sınıfının doğru durumda olduğunu otomatik kontrol et.

## 43.2 — Soldan kaydırarak geri: arkadaki ekran parmakla birlikte gelsin

**İstenen:** Villa sayfasındayken parmak ekranın sol kenarından sağa çekilince villa sayfası parmağı takip ederek sağa kaysın. Arkadan Villalarım ekranı açılarak gelsin. iPhone uygulamalarındaki gibi.

- **Önce mevcut durumu bul.** Şu an geri dönüş hareketi nasıl çalışıyor? Safari'nin kendi geri hareketi mi (history), yoksa uygulamanın kendi kodu mu?
- **Davranış (uygulamanın kendi hareketi):**
  - Hareket sol kenardan (ilk 24 pt) başlamalı ve yatay olmalı.
  - Üstteki ekran `translateX` ile parmağı takip etsin. Sol kenarında hafif gölge olsun.
  - Alttaki önceki ekran `-25%` konumundan `0`'a doğru kaysın (paralaks). Üstündeki hafif karartma kaydıkça açılsın.
  - Bırakınca:
    - ekran genişliğinin %35'inden fazla çekildiyse ya da hızlı fiske atıldıysa geri dönüş tamamlansın. Bu, geri düğmesiyle aynı işlemdir.
    - değilse ekran yaylanarak yerine dönsün (yaklaşık 250 ms).
  - Yatay kaydırılan alanlarda (takvim, düğme şeridi, fotoğraflar) hareket kenardan başlamıyorsa bu özellik devreye girmesin.
  - Alttan açılan pencere açıkken çalışmasın.
  - `prefers-reduced-motion` açıksa ekran parmağı takip etmesin, kısa bir solma ile geri dönsün.
- **Safari sekmesinde çakışma olmasın.** Safari sekmesinde açıkken Safari'nin kendi kenar hareketi devreye girebilir. İki animasyon üst üste binmesin:
  - Ana ekrana eklenmiş uygulamada ve Capacitor uygulamasında uygulamanın kendi hareketi çalışsın.
  - Safari sekmesinde Safari'ninki kalsın. `display-mode: standalone` / Capacitor ile ayırt et.
- **Hangi ekranlarda:** Villa sayfası, Misafirler, Gelir & gider, misafir kartı ve geri düğmesi olan diğer itilen ekranlar.

## 43.3 — Sol üstteki geri düğmesi daha iyi görünsün

Şu anki hâli: yeşil çubukta kalın gri çerçeveli büyük bir daire. "Ucuz" duruyor.

Yeni hâli, iOS tarzı:
- **Görünüm:**
  - Beyaz, kalın çizgili bir sol ok (‹), yanında **önceki ekranın adı**: "‹ Villalar", "‹ Takvim".
  - Çerçeve yok.
  - Düğmenin arkasında çok hafif yarı saydam beyaz zemin olsun (yaklaşık %14), köşeleri yuvarlak. Tıklanabilir olduğu belli olsun.
- **Dokunma:**
  - Dokunma alanı en az 44 × 44 pt.
  - Basınca saydamlık .55 olsun ve hafifçe küçülsün (scale .96).
  - Klavye odağında belirgin bir halka olsun.
- **Dar ekran:** Dar ekranda ya da "Çok büyük" yazıda yazı sığmazsa sadece ok kalsın. Ok yine yarı saydam yuvarlak zeminde dursun, `aria-label="Geri: Villalar"`.
- Üst çubuktaki "Villa Takvimim" başlığı ile ok çakışmasın.

## 43.4 — Küçük düzeltme

"Önerilen kapora · 6.000 ₺" düğmesinde ₺ alt satıra tek başına düşüyor.
- `para()` çıktısında sayı ile ₺ arasında **bölünmez boşluk** (`&nbsp;` / ` `) olsun.
- Uygulamanın bütün tutarlarında böyle olsun.

## 43.5 — Bitiş

- Ekran görüntülerini `docs/qa/gorev43/` klasörüne koy.
- 43.2 için kenardan sürüklemenin ortasında bir kare kaydet: arkadaki ekranın göründüğü an.
- `docs/PROJE_DURUMU.md` dosyasına Görev 43'ü ekle.
- Mesajının en altına çok kısa özet yaz, altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
