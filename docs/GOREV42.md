# Görev 42 — Büyük yazıda okunabilirlik: kelime asla bölünmesin

**Zeyd'in şikâyeti:** "Büyük" ve "Çok büyük" yazıda bazı yerlerde yazı yukarıdan aşağı dizilmiş, her satıra bir harf düşüyor, okunmuyor. Uygulama yaşlı kullanıcılar için, o yüzden büyük yazı en çok kullanılacak ayar. Okunabilirlik burada en önemli şey.

**Kurallar:**
- Veritabanına dokunma.
- Deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.

---

## PM'in bulduğu sorunlar

Ölçüm koşulları: 320 pt genişlik (iPhone SE / "Büyütülmüş ekran"), "Çok büyük" yazı, sahte veri.

| Ekran | Sorun |
|---|---|
| Villa sayfası → Villa yönetimi | **"Villa bilgileri" 14 satıra, harf harf alt alta** dizilmiş. "6 adımı tamamlayın" 16 satır. Sağdaki "Eksik · 3/7" etiketi yazının yerini yiyor. |
| Villa sayfası → üst kart | "Villa kurulumu · 1/7" 4 satır. |
| Villa sayfası → fotoğraf düğmeleri | "+ Dış görünüş" düğmenin dışına taşıyor. |
| Rezervasyon detayı (Sıradaki'ye dokununca) | Üstteki "4 gece · 2. geliş" yazısı "Kapat" düğmesinin altında kalıyor, kesik. Misafir adı iki satıra bölünüyor. Giriş/Çıkış sütunları dar: "27 / Kasım / 16:00" üç satır. |
| Ödemeler | "Alınan" kutusu çok dar. "Henüz ödeme alınmadı" iki satır, sorun değil ama kutular alt alta daha iyi olur. Ödemeler penceresinde hâlâ "Nasıl?" var (41.3 sadece detaydan kaldırmıştı, bu kalabilir). |
| Fiyatlar | "Birden fazla ay seç" / "Tüm yıla fiyat gir" kartları 3–4 satıra sıkışmış. Ay satırında "Ocak 2026" ile "Fiyat girilmedi" üst üste biniyor. "Kasım 2026" 5 satıra bölünmüş. |
| Hesap | "İki adımlı doğrulama" kelime ortasından bölünüyor. "Girişte şifreden sonra 6 haneli kod" 7 satır. "Kullanıcılar · 0 kişi" sıkışmış. "Talep yok" sağdan taşıyor. Ayar açıklamaları 5–8 satır. |
| Villalarım | "Sırayı değiştirmek için villaya basılı tutup sürükleyin" ipucu 5 satır. Villa kartında "Sıradaki: 27 Kasım · Ayşe Yılmaz" sağdan taşıyor. |

**Kök sebep (büyük ihtimalle).** Satırlarda `[ikon][yazı][sağda etiket/sayı][ok]` düzeni var. Yazı tarafında şu ikili duruyor:

```css
min-width: 0;
overflow-wrap: anywhere;
```

Örnekler: `.row .name`, `.satirBtn > span:first-child`, `.rezKart .rkAd`, `.okutu .lab`, `.etAlt` ve başkaları.

Yazı büyüyünce sağdaki etiket yerini korur, yazı sütunu 1 harf genişliğe kadar daralır. `anywhere` de kelimeyi harf harf böler.

---

## 42.1 — Genel kural: kelime ortasından bölme yok

- Uygulamada **hiçbir yerde** normal yazı kelime ortasından bölünmesin. `overflow-wrap:anywhere` ve `word-break:break-all` kullanımlarını kaldır.
  - **Tek istisna:** gerçekten bölünmesi gereken uzun tek parça şeyler. Bağlantı adresi (`.dtLink`), e-posta, kod (`.mfaGizli code`). Bunlarda `overflow-wrap:anywhere` kalabilir.
- **Yazı sütununa en az genişlik ver.** Satırlardaki yazı sütununun en az genişliği yaklaşık 8 harf olsun: `min-width: min(100%, 8em)`. Sağdaki öğe sığmıyorsa yazı daralmasın, sağdaki öğe **alt satıra insin**.
- Uzun kelimeler ("doğrulama", "istatistikler") hiç bölünmesin. Sığmıyorsa bütün olarak alt satıra geçsin.

## 42.2 — Satır düzeni: sığmayınca alt alta

Ortak satır bileşenlerinde dar yerde düzen değişsin. Bunlar:
- `.row`, `.satirBtn`, Hesap'taki ayar satırları;
- "Villa yönetimi" satırları, Ajanda kartları, ödeme satırları;
- villa kartının alt satırı.

Yeni düzen:
- Sol: ikon. Büyük yazıda ikon kutusu küçülebilir, 44 → 36 pt.
- Orta: başlık ve alt yazı, tam satır genişliğinde.
- Sağdaki etiket ya da sayı ("Eksik · 3/7", "0 kişi", "Talep yok", "Kapalı", tutar) sığmazsa başlığın **altına**, sola yaslı, küçük bir etiket olarak insin.
- Ok (›) her zaman sağda, dikey ortada kalsın.

Bunu `flex-wrap` ya da container query ile yap. Ekranın genişliğine değil, **satırın kendi genişliğine** baksın.

## 42.3 — Özel ekranlar

1. **Rezervasyon detayı başlığı.**
   - "4 gece · 2. geliş" satırı kendi satırında, tam genişlikte dursun. "Kapat" düğmesinin altında kalmasın.
   - Büyük yazıda "Kapat" yazılı hap yerine 44 pt'lik yuvarlak **×** düğmesi olsun (`aria-label="Kapat"`).
   - Misafir adı satırın tamamını kullansın.
2. **Giriş / Çıkış.**
   - Dar yerde iki sütun yerine alt alta iki satır olsun: "→ Giriş · 27 Kasım · 16:00" ve "← Çıkış · 1 Aralık · 10:00". Her biri tek satırda, 40.5'teki renklerle.
   - Sığmazsa tarih ve saat ikinci satıra insin, ama tarih kendi içinde bölünmesin ("27 Kasım" `nowrap`).
3. **Ödemeler kutuları.**
   - "Alınması gereken / Alınan / Kalan" kutuları dar yerde **alt alta, tam genişlikte** dursun.
   - Etiket solda, tutar sağda, her kutu tek satır.
4. **Fiyatlar.**
   - "Birden fazla ay seç" ve "Tüm yıla fiyat gir" kartları dar yerde alt alta, tam genişlikte olsun. İkon solda, yazı tek ya da iki satır.
   - Ay satırında ay adı ("Kasım 2026") ile "Fiyat girilmedi" üst üste binmesin. Sığmazsa durum yazısı ay adının altına insin.
   - Ay adı `nowrap` olsun, asla bölünmesin.
5. **Fotoğraf düğmeleri.**
   - "+ Dış görünüş" gibi düğmeler yazıyı içine alsın, taşırmasın.
   - Dar yerde 2 sütunlu ızgara olsun, ya da düğme yazısı iki satıra insin ama kelime bölünmesin.
6. **Villa kartı alt satırı.** "Sıradaki: 27 Kasım · Ayşe Yılmaz" taşmasın. İki satıra insin; ya da ad sığmazsa sondan "…" ile kısalsın, ama tarih tam görünsün.
7. **Uzun açıklamalar.** Hesap'taki ayar açıklamaları ve "Sırayı değiştirmek için…" ipucu: yazı sütunu geniş olunca kendiliğinden 2–3 satıra iner. 42.2 doğru yapılınca düzelmeli; kontrol et.

## 42.4 — Otomatik denetim (kalıcı test)

Aşağıdaki tarama fonksiyonunu testlere ekle. PM bununla buldu. Tarama şunları yakalar:
- bir kelimesi birden fazla satıra bölünmüş yazı (satır sayısı > kelime sayısı);
- 3 ve daha fazla satıra yayılmış, her satırı 3 harf genişliğinden dar yazı;
- sayfanın sağından/solundan taşan yazı.

Kasıtlı yatay kaydırılan şeritlerdeki taşma sayılmasın: villa sayfasındaki "Rezervasyon / Teklif / Fiyat gir / Opsiyon / Paylaş" şeridi, kanal seçimi şeridi.

```js
// sayfada çalıştır: page.evaluate(TARA)  →  sorunlu yazıların listesi
const TARA = () => {
  const out = [], vw = innerWidth;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim(); if (t.length < 3) continue;
    const el = n.parentElement; if (!el || !el.offsetParent) continue;
    if (el.closest('.hide,[aria-hidden="true"]')) continue;
    const st = getComputedStyle(el);
    const r = document.createRange(); r.selectNodeContents(n);
    const rs = [...r.getClientRects()].filter(x => x.width > 0 && x.height > 0); if (!rs.length) continue;
    const satir = new Set(rs.map(x => Math.round(x.top))).size, kelime = t.split(/\s+/).length;
    const enUzun = Math.max(...t.split(/\s+/).map(k => k.length));
    const kirik = satir > kelime;
    const dar = satir >= 3 && enUzun >= 5 && rs.some(x => x.width < 3 * parseFloat(st.fontSize));
    const tasma = rs.some(x => x.right > vw + 1 || x.left < -1);
    if (kirik || dar || tasma) out.push({ t: t.slice(0, 50), kirik, dar, tasma, satir, kelime });
  }
  return out;
};
```

**Matris:**
- 320 ve 375 genişlik;
- "Büyük" ve "Çok büyük" yazı;
- chromium ve **webkit**.

**Ekranlar:**
- Villalarım (dolu ve boş);
- villa sayfasının tamamı (aşağı kaydırarak);
- rezervasyon detayı, Ödemeler, Rezervasyonu düzenle, Yeni rezervasyon;
- Teklif, Fiyatlar, Opsiyon;
- Takvim (Ajanda, Misafirler);
- Hangi villam boş (bütün adımlar);
- Gelir & gider;
- Hesap'ın tamamı, Kullanıcılar, Özet ve istatistikler;
- Villa ekleme sihirbazı;
- Misafir sayfası (`g.html`, kök yazı 20 px).

Testte **sıfır** `kirik` ve sıfır `dar` olmalı. Bunlardan biri çıkarsa test kırmızı olsun.

## 42.5 — Bitiş

- Ekran görüntülerini `docs/qa/gorev42/` klasörüne koy: önce/sonra, en azından yukarıdaki tablodaki ekranlar, 320 + Çok büyük.
- `docs/PROJE_DURUMU.md` dosyasına Görev 42'yi ekle. `docs/STIL.md` varsa oraya da bir kural ekle: "kelime bölünmez; dar yerde sağdaki öğe alta iner".
- Mesajının en altına çok kısa özet yaz, altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
