# Görev 45 — Cloudflare Pages'e geçişe hazırlık (domain alınınca tek adım kalsın)

**Karar:** Canlı site Netlify'dan **Cloudflare Pages**'e taşınacak.
- Zeyd domaini Cloudflare'dan alıyor: **villatakvimim.com**.
- Sebep: Netlify ücretsiz pakette aylık kredi sınırı var, kredi bitince site duruyor. Cloudflare Pages'te trafik sınırı yok.

**Amaç:** Domain alındığı ve Cloudflare Pages projesi GitHub'a bağlandığı anda kodda başka bir iş kalmasın. Adres değişimi tek bir satırla olsun.

**Kurallar:**
- Veritabanına dokunma.
- Edge Function deploy etme.
- Netlify'a yayınlama.
- **Netlify'daki canlı site geçiş bitene kadar aynen çalışmaya devam etmeli.** Yaptığın her şey hem Netlify'da hem Cloudflare Pages'te çalışmalı.
- Her adım ayrı commit olsun, main'e push et.

**Test kuralı:**
- Kısa tut.
- 3 denemede geçmeyen testte dur, sorunu özete yaz, sonraki adıma geç.

---

## 45.1 — Sunucu ayar dosyaları Cloudflare'da da aynı çalışsın

Sitenin iki ayar dosyası var:
- `www/_headers`: güvenlik ve önbellek başlıkları;
- `www/_redirects`: `/*  /g.html  200`, yani `villatakvimim.com/villa-salta-k7m2` gibi paylaşım linkleri misafir sayfasını açıyor.

İkisi de Netlify biçiminde. Cloudflare Pages da bu dosyaları okur, ama **davranış farkları olabilir**:
- **Dosya varken yönlendirme.** Netlify'da `/* /g.html 200` kuralı sadece **dosya yoksa** çalışır (shadowing). Cloudflare'da var olan dosyalar da yönlendirilebilir; o zaman `index.html`, `config.js`, resimler bozulur.
- **Tek sayfa modu.** Cloudflare'da `404.html` yoksa tek sayfa uygulaması modu devreye girer: bilinmeyen adreslere `index.html` döner.

**Ne yapacaksın:**
1. `npx wrangler pages dev www` ile siteyi yerelde Cloudflare gibi çalıştır. Wrangler'ı npm ile kur, hesap gerekmez.
2. Şunları test et:
   - `/` → uygulama (index.html) açılıyor.
   - `/config.js`, `/veri.js`, `/img/3d/baslik-takvim-512.webp`, `/manifest...`, `/sw.js` → **kendi dosyaları** geliyor, g.html değil. İçerik türlerini (Content-Type) de kontrol et.
   - `/villa-salta-k7m2` → misafir sayfası (g.html içeriği) geliyor. Adres çubuğu değişmiyor, durum kodu 200.
   - `/g.html?...` → çalışıyor.
   - `_headers` içindeki başlıklar ve önbellek süreleri (JSON 30 sn, fotoğraflar 3600 sn; nerede tanımlıysa) Cloudflare'da da geliyor.
   - Servis çalışanı (sw.js) Cloudflare'da kayıt oluyor, çevrimdışı açılış çalışıyor.
3. **Bir şey farklıysa:** Hem Netlify'da hem Cloudflare'da aynı sonucu verecek şekilde düzelt. Gerekirse paylaşım linkleri için `functions/[[yol]].js` ile küçük bir Pages Function yaz: dosya yoksa g.html'i döndürsün. Ama mümkünse sadece `_redirects` ile çöz, sade kalsın.
4. Netlify tarafını da yerelde doğrula (`npx netlify dev` ya da kuralların mantığını testle). Mevcut canlı davranış bozulmamalı.

## 45.2 — Site adresi tek yerden değişsin

- Şu an site adresi `www/config.js` dosyasında: `siteUrl: "https://villatakvim.netlify.app"`. Paylaşım linkleri (`native.js`), giriş e-postalarındaki dönüş adresi (`veri.js:90`) ve ayarlar oradan alıyor.
- **Bütün kullanımları tara.** Netlify adresi kodun başka bir yerine gömülü kalmasın: index.html, g.html, native.js, veri.js, dil.js, gizlilik ve şartlar sayfaları, manifest, `<meta property="og:url">` ve benzerleri. Hepsi `config.js`'teki tek değerden beslensin. Adres yazmak zorunda olan statik dosyalar varsa (manifest, meta etiketleri) bir `npm run alan-adi` betiği bunları tek komutla güncellesin.
- `config.js`'e şu yapıyı koy:
  ```js
  // Canlı adres. Cloudflare'a geçiş günü SADECE bu satır değişir:
  siteUrl: "https://villatakvim.netlify.app",
  // siteUrl: "https://villatakvimim.com",
  ```
- **Şimdilik adres Netlify'da kalsın.** Domain henüz çalışmıyor; şimdi değiştirirsek misafire giden linkler bozulur.
- **Değiştirme:** iCal dışa aktarımındaki `UID: rez-…@villatakvim` değerleri. Bunlar Airbnb/Booking tarafında kayıtların kimliği; değişirse oralarda kopya rezervasyon oluşur. Alan adı değişse de UID aynen kalmalı.
- **Native uygulama:** Uygulama (Capacitor) paylaşım linki üretirken `siteUrl`'i kullanıyor. Adres değişince App Store sürümünde de yeni adres gelsin. `config.js` web klasöründe olduğu için uygulama yeniden derlenince gelir; doğrula.

## 45.3 — Destek e-postası hazır dursun

- Gizlilik ve şartlar sayfalarında e-posta şu an "yakında eklenecek" diye yazıyor.
- `config.js`'e `destekPosta: ""` ekle. Doluysa sayfalarda o adres tıklanabilir (`mailto:`) görünsün, boşsa "yakında eklenecek" yazsın.
- Geçiş günü buraya `destek@villatakvimim.com` yazılacak. Cloudflare'ın ücretsiz e-posta yönlendirmesiyle Zeyd'in kendi postasına gidecek.

## 45.4 — "Yayınla" komutu Cloudflare için hazır

**Plan:**
- GitHub Pages test sitesi `main` dalından aynen devam edecek.
- Cloudflare Pages'in canlı dalı **`canli`** olacak.
- Zeyd "yayınla" dediğinde `main`, `canli` dalına itilecek (`git push origin main:canli`), Cloudflare kendisi yayınlayacak.

**Yapılacaklar:**
- `canli` dalını **şimdi oluşturma.** İlk yayında oluşturulacak.
- `docs/YAYIN.md` dosyası yaz. Kısa olsun:
  - "yayınla" denince hangi komutların çalışacağı (Cloudflare geçişinden önce Netlify, sonra `canli` dalı);
  - Cloudflare Pages proje ayarları: framework yok, build komutu boş, çıktı klasörü `www`, canlı dal `canli`, önizleme dağıtımları kapalı;
  - geri alma: `canli` dalını bir önceki commit'e döndürüp itmek.
- `CLAUDE.md` ya da proje notlarında "Netlify'a yayınla" geçen yerlere "(geçişten sonra: Cloudflare, docs/YAYIN.md)" notunu ekle.

## 45.5 — Geçiş günü listesi

`docs/ALAN_ADI_GECIS.md` dosyası yaz. Sıralı bir kontrol listesi olsun, PM ve Claude Code için (Zeyd için değil):
1. Cloudflare Pages projesi GitHub'a bağlandı mı, ilk yayın oldu mu? `*.pages.dev` adresinde site açılıyor mu?
2. Özel alan adı `villatakvimim.com` (ve `www.`) projeye eklendi mi, sertifika aktif mi?
3. Supabase → Authentication → URL Configuration: Site URL ve Redirect URLs'e yeni adres eklendi mi? Bunu Zeyd panelden yapar, PM anlatır. Eski Netlify adresi bir süre listede kalsın.
4. `config.js` → `siteUrl` yeni adrese çevrildi, `npm run alan-adi` çalıştırıldı, sw.js sürümü artırıldı.
5. `destekPosta` dolduruldu, Cloudflare e-posta yönlendirmesi kuruldu.
6. Test:
   - paylaşım linki açılıyor;
   - giriş e-postasındaki bağlantı yeni adrese dönüyor;
   - misafir sayfası çalışıyor;
   - iCal dışa aktarım linki çalışıyor (o Supabase'te, değişmez).
7. **Netlify'ı kapatma, yönlendir.** `villatakvim.netlify.app/*` adresinden `https://villatakvimim.com/:splat` adresine 301 yönlendirme. Bunun için Netlify'a son bir kez sadece `_redirects` yönlendirmesi olan küçük bir yayın yapılacak. Eski paylaşılmış linkler kırılmasın.
8. Uygulama mağaza sürümünde (Capacitor) yeni adres: bir sonraki TestFlight derlemesiyle gelir.

## 45.6 — Bitiş

- `docs/qa/gorev45/` klasörüne şunları koy:
  - wrangler testlerinin çıktısı (adres → durum kodu → hangi dosya geldi);
  - Netlify kuralı ile karşılaştırma.
- `docs/PROJE_DURUMU.md` dosyasına Görev 45'i ekle. Açıkça yaz: "geçiş için bekleyen: domain + Cloudflare Pages bağlantısı + Supabase adresleri".
- Mesajının en altına çok kısa özet yaz, altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
