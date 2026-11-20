# GÖREV 34 — Airbnb kalitesinde geçişler, 3D görseller, ad ve iletişim bilgisi

Zeyd, Airbnb uygulamasının ekran kaydını kare kare inceletti. Beğendiği şeyler: her yerde anlaşılır görseller, arama kutusunun büyüyerek ekrana dönüşmesi, adımların akordeon gibi açılıp kapanması, kayarken küçülen başlıklar. **Airbnb'yi kopyalamıyoruz** (görselleri, renkleri ve ikonları onlarındır). Aldığımız şey, hareketlerin mantığı.

Önce `docs/STIL.md` dosyasını oku. Yeni her süre ve eğri önce `:root` değişkenine, sonra STIL.md'ye yazılsın. "Hareketi azalt" açıksa her şey sadece saydamlıkla gelsin.

## Kareler (24 fps) üzerinden ölçülenler

| Ne | Süre | Nasıl |
|---|---|---|
| Arama düğmesi → arama ekranı | ~400 ms | Hap, olduğu yerden büyüyerek kart olur. Arkadaki sayfa bulanıklaşır ve solar. |
| Kartın içi | +100–150 ms gecikme | İçerik, kart büyüdükten sonra solarak gelir. |
| Alttaki kapalı adımlar | 40 ms arayla | Aşağıdan kayarak gelir. |
| Alt çubuk (Temizle / Ara) | Kartla aynı anda | Aşağıdan kayarak gelir. |
| Adım değişimi (Nerede → Ne zaman) | ~300 ms | Açık kart tek satırlık özete küçülür, sıradaki kart açılır. |
| Seçim kartı | Anında | Seçilince kalın koyu çerçeve, alttaki "İleri" düğmesi griden koyuya döner. |

---

## 34.1 "Hangi villam boş?" araması büyüyerek açılsın

**Açılış:**
- Arama tetikleyicisinin (Takvim sekmesindeki ve Villalarım'daki) ekrandaki yerini al. Arama paneli o dikdörtgenden başlayıp tam karta büyüsün.
- Yöntem: FLIP ile `transform` + `clip-path` kullan, `height` animasyonu yapma.
- Süre **380 ms**, `--egri-cekmece`.
- Arka plan aynı anda `backdrop-filter: blur(12px)` ve kararma ile 300 ms'de gelsin. WKWebView'de takılma olursa bulanıklığı 8px'e düşür. Hâlâ takılırsa sadece kararma kalsın.
- Kartın içeriği 120 ms gecikmeyle, 200 ms solarak gelsin.

**Adımlar (akordeon):**
- Açık adım **"Ne zaman?"** (tarih seçimi).
- Altında kapalı satır hâlinde **"Kaç kişi?"**. Kapalı satırlar 40 ms arayla 12 pt aşağıdan gelsin.
- Alt çubuk **[Temizle] [Ara]** aşağıdan gelsin.
- Tarih seçilince "Ne zaman?" kartı tek satıra küçülsün: "Ne zaman · 17–21 Kasım". Ardından "Kaç kişi?" açılsın. Süre 300 ms, `grid-template-rows: 0fr → 1fr` yöntemiyle.
- Özet satırına dokununca o adım yeniden açılsın.

**Kapanış:**
- Kapat (×) ya da geri: panel tetikleyicinin yerine küçülerek dönsün. Süre **260 ms** (kapanış açılıştan hızlı).
- Kapanış yarıda kesilebilsin. Tekrar dokunulursa geri büyüsün.

## 34.2 Kayarken küçülen başlık (iOS büyük başlık)

**Nerede:** Villalarım, Takvim, Ajanda/Misafirler, Gelir & gider, Hesap.

**Nasıl:**
- Sayfa en üstteyken büyük başlık (h1) bugünkü gibi dursun.
- Aşağı kaydırdıkça büyük başlık, kaydırmayla birebir orantılı olarak hafifçe yukarı kayıp solsun. Zamanlayıcı değil, kaydırma konumu belirlesin.
- Büyük başlık üst çubuğun altına girdiği anda üst çubuğun ortasında aynı başlık küçük olarak (1rem, 600) 150 ms'de belirsin. Üst çubuğun altında ince bir ayraç çizgisi çıksın.
- Yukarı dönünce tersi olsun.
- `requestAnimationFrame` ile tek dinleyici kullan. Kaydırmayı yavaşlatmasın.

## 34.3 Seçim kartları (görselli)

Birden fazla seçenek arasında seçim yapılan yerlerde, düz düğmeler yerine **görselli büyük kartlar** kullan:
- "Linki kendim bağlayacağım / Bağlamayı ekibe bırakın" (Görev 33.8): `baglanti.png` ve `bize-birak.png` ile.
- Kurulum sihirbazının ilk adımları.
- Pro ekranındaki plan.

**Kart düzeni:**
- Solda başlık ve tek satır açıklama, sağda 64 pt görsel.
- Basınca `scale(.98)`.
- Seçilince 2 px `--ink` çerçeve.
- Seçim yokken alttaki **İleri** düğmesi gri ve pasif olsun. Seçilince 200 ms'de koyu yeşile dönsün.

## 34.4 Büyük panellerde "kart yığını" hissi

Ekranın neredeyse tamamını kaplayan alt panellerde şu efekti uygula: rezervasyon formu, Pro ekranı, takvim bağlama, misafir detayı.
- Arkadaki sayfa **%94'e küçülsün**, köşeleri 12 px yuvarlansın ve kararsın. 340 ms, `--egri-cekmece`.
- Panel kapanınca geri gelsin.

Küçük paneller (seçim paneli, onay soruları) bugünkü gibi kalsın.

## 34.5 Alt sekme çubuğu

- Seçili sekmenin ikonu dolu (fill) olsun ve ana renge dönsün. Diğerleri çizgi ikon ve gri kalsın.
- Dokununca ikon `scale(.85)`'ten 1'e dönsün: 300 ms, hafif yaylı eğri (`cubic-bezier(.34,1.56,.64,1)`, sadece burada).
- Titreşim: `secim`.

## 34.6 Yükleniyor → içerik geçişi

İskelet ekrandan gerçek içeriğe **çapraz solma** ile geçilsin (200 ms). İçerik birden yerine "patlamasın". Yerleşim kaymamalı.

## 34.7 3D görseller

- Görseller `www/img/3d/` klasörüne gelecek. Codex çiziyor, liste `docs/CODEX_3D_GORSELLER.md` dosyasında.
- Her boş ekranda ve listedeki kartlarda Lucide ikonlu daire yerine o görseli kullan:
  - 160 pt, ortada;
  - altında başlık (1.25rem serif) ve tek cümle;
  - altında tek düğme.
- Görsel yoksa (henüz çizilmediyse) bugünkü ikon kalsın. Kod, dosya varsa görseli göstersin.
- `<img loading="lazy" decoding="async">` kullan. Mümkünse `-512.webp`, yoksa PNG.
- Görsel, 31.2 kademeli girişte ilk öğe olarak `scale(.96)` + saydamlıktan gelsin.
- Gece modunda görselin arkasına `--soft` zeminli yuvarlak bir kart koy ki şeffaf kenarlar kaybolmasın.
- Eski düz görseller (`www/img/*.webp`) yeni 3D karşılığı gelene kadar kalsın, sonra silinsin.

## 34.8 Ad: her yerde "Villa Takvimim"

Uygulamanın adı her yerde **Villa Takvimim** olsun:
- uygulama içi metinler, üst çubuk, giriş ve açılış ekranı;
- `<title>`, `manifest.json` (`name`, `short_name`);
- paylaşım ve WhatsApp mesajları, misafir sayfası (`g.html`) künyesi;
- gizlilik metni ve kullanım koşulları, bildirim başlıkları;
- İngilizce çevirilerde de "Villa Takvimim" (marka adı çevrilmez).

Sunucu fonksiyonlarındaki (`supabase/functions/**`) bildirim metinlerini de değiştir, ama **deploy etme**. Ürün yöneticisi deploy edecek.

`grep -ri "villa takvim[^i]"` ile kalan yer olmadığını doğrula.

## 34.9 Gizlilik metni: iletişim bilgisi

`www/gizlilik.html` ve `www/kosullar.html` içindeki köşeli parantezleri doldur:
- Veri sorumlusu: **Zeyd Tekin**
- Adres: **Ergin Sokak, Beşiktaş, İstanbul**
- E-posta: domain alınınca eklenecek. Şimdilik "Uygulama içindeki Hesap → Yardım ve destek bölümünden bize yazabilirsiniz." yaz ve e-posta satırını kaldır.

Metnin en altındaki "Son güncelleme" tarihini bugünün tarihi yap.

## 34.10 Test ve video

- Bütün mevcut testler geçmeli.
- iPhone SE ve iPhone 15'te, normal ve "Hareketi azalt" ile şu videoları çek ve `docs/qa/gorev34/video/` klasörüne koy:
  - arama açılış ve kapanış;
  - adım değişimi;
  - büyük başlığın küçülmesi;
  - kart yığını;
  - sekme çubuğu.

  Her birini normal hızda ve `?yavas=3` ile çek.
- Arama açılışını 24 fps karelere ayır ve Airbnb kareleriyle aynı mantıkta olduğunu kontrol et: önce kart büyür, sonra içerik gelir, arka plan bulanıklaşır.
- Konsol hatası olmamalı. Kaydırma 60 fps'te kalmalı. Takılan kare varsa raporla.

---

Her alt adımı ayrı commit'le. Netlify'a yayın yok. Edge Function deploy yok.

Bitince çok kısa bir özet yaz ve en alta test linkini koy: https://zeydusht.github.io/villa-takvimim/
