# Görev 45 — test raporu (27 Kasım 2026)

Yerel Cloudflare: `wrangler pages dev www` (wrangler 4.168, hesap gerekmedi). Veritabanına dokunulmadı; önizleme testinde sahte Supabase (`sahte-supabase.js`) kullanıldı. Netlify'a yayın yapılmadı.

## Dosyalar
- `45.1-cloudflare.txt` — adres → durum kodu → gelen dosya (önce / sonra).
- `netlify-kural.js` — Netlify kuralının mantık testi (`node docs/qa/gorev45/netlify-kural.js`).
- `sw-test.js` — servis çalışanı kaydı + misafir sayfası (Playwright).
- `posta-test.js` — destek e-postası boş/dolu.
- `onizleme-test.sh` + `sahte-supabase.js` → `45.6-onizleme.txt` — WhatsApp önizleme etiketleri.
- `onizleme.png` — WhatsApp balonu taklidi.

## Cloudflare (wrangler) ile Netlify karşılaştırması

| Adres | Netlify (netlify.toml kuralı) | Cloudflare (Function) |
|---|---|---|
| `/` | 200 index.html | 200 index.html |
| `/index.html` | 200 index.html | 308 → `/` (Cloudflare `.html`'i kendisi kaldırır) |
| `/config.js`, `/veri.js`, `/sw.js` | 200 kendi dosyası | 200 kendi dosyası, `application/javascript` |
| `/img/3d/baslik-takvim-512.webp` | 200 resim | 200 `image/webp` |
| `/manifest.json` | 200 | 200 `application/json` |
| `/villa-salta-k7m2` | 200 g.html, adres aynı | 200 g.html, adres aynı + villaya özel og etiketleri |
| `/villa-salta-k7m2?teklif=…` | 200 g.html | 200 g.html, başlık "… · size özel teklif" |
| `/g.html?v=…` | 200 g.html | 308 → `/g?v=…` → 200 g.html (sorgu korunur) |
| `/gizlilik.html` | 200 | 308 → `/gizlilik` → 200 |
| `/yok/derin/yol` | 200 g.html ("bağlantı geçerli değil") | 200 g.html |
| Başlıklar (`_headers`) | var | var (Function yanıtında da) |

Fark yalnız `.html` uzantısında: Cloudflare 308 ile uzantısız adrese geçiriyor, sayfa aynı açılıyor.

Değişiklikten önce Cloudflare'da her adres (`/`, `/config.js`, resimler) `/g`'ye 308 ile yönleniyordu, site hiç açılmazdı. Sebep, `www/_redirects`'teki `/* /g.html 200` kuralıydı: Cloudflare bu kuralı var olan dosyalara da uyguluyor. Kural `netlify.toml`'a taşındı. Netlify CLI'nin (27.20.1) `deploy` komutu bu dosyayı da yüklüyor; bu, kaynakta `hashConfig` ile doğrulandı.

Önbellek: JSON 30 sn / fotoğraf 3600 sn `_headers`'ta değil, Supabase'e yüklerken veriliyor. Sunucu değişikliği bunu etkilemiyor. Function yanıtı `max-age=600` ile dönüyor; villa bulunamazsa ya da yanıt gelmezse `60`.

Servis çalışanı: Cloudflare'da `/sw.js` kapsam `/` ile kayıt oluyor, aktif. sw.js yalnız bildirimler için; önbelleği yok. Çevrimdışı açılış Netlify'da da yok, davranış aynı.

## WhatsApp önizlemesi (45.6)
Tüm istekler `curl -A "WhatsApp/2.23"` ile atıldı. Ayrıntı `45.6-onizleme.txt` içinde.
- Villa Salta → `<title>` ve `og:title` "Villa Salta · Kalkan", `og:image` ilk fotoğraf, `max-age=600`.
- `?teklif=ab12cd34` → "Villa Salta · size özel teklif", `og:url` içinde `?teklif=AB12CD34`.
- Kaçış testi: `Villa "Mavi" <script>…</script> & Ev'im` adı `&quot; &lt; &amp; &#39;` olarak yazılıyor. İçinde `"` ve `<` olan fotoğraf adresi atlanıyor, sıradaki güvenli fotoğraf kullanılıyor.
- Fotoğrafsız villa → "Villa Zeytin · Villa Takvimim" ve genel görsel (1200×630).
- Galeri JSON'unda `kapak` alanı (küçük sürüm) varsa o kullanılıyor. Uygulama şu an bu alanı yazmıyor; ileride eklenirse hazır.
- Villa yok → genel etiketler, 200, `max-age=60`.
- Supabase 5 sn gecikiyor → 1,54 sn'de genel etiketlerle 200 dönüyor.
- Supabase resim dönüştürme (`/render/image/…?width=1200`): var olmayan dosyayla açık mı kapalı mı anlaşılamadı. Gerçek fotoğraf listelemek veritabanına dokunmak olacağı için denenmedi. Function bunu her istekte kısa bir HEAD isteğiyle kontrol ediyor; kapalıysa uygulamanın yüklediği en fazla 1400 px'lik fotoğrafı kullanıyor.

## Kalan / dikkat
- `robots.txt` her şeyi kapatıyor (`Disallow: /`). WhatsApp ve iMessage önizlemeyi telefondan çektiği için etkilenmez. Facebook/Telegram gibi robots'a bakan önizlemeler görmeyebilir. Bu ayrı bir karar.
- Davet linkleri (`config.js` → `davetUrl`) Görev 45'ten önce olduğu gibi test sitesine gidiyor. Geçiş günü karar verilecek (ALAN_ADI_GECIS.md 4. adım).
- Gerçek WhatsApp'ta deneme, ancak Cloudflare yayını ve gerçek bir paylaşım linki olunca yapılabilir.
