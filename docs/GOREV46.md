# Görev 46 — villatakvimim.com'a geçişi tamamla

**Durum (PM yaptı, 27 Kasım):**
- villatakvimim.com Cloudflare Pages'te çalışıyor. Proje `villatakvimim`, canlı dal `canli`, önizleme dağıtımları kapalı.
- Supabase Redirect URLs eklendi. Site URL'yi PM, yayın günü değiştirecek.
- Ayrıntılar `docs/PROJE_DURUMU.md` dosyasının en altında ve `docs/ALAN_ADI_GECIS.md` dosyasında.

**Kurallar:**
- Veritabanına dokunma.
- Edge Function deploy etme.
- Netlify'a ve `canli` dalına **yayınlama**: bunlar ancak Zeyd "yayınla" deyince yapılacak.
- Her adım ayrı commit olsun, main'e push et.
- Testleri kısa tut.

---

## 46.1 — Adres yeni domain

- `www/config.js` → `siteUrl: "https://villatakvimim.com"`. `npm run alan-adi` çalıştır; og etiketleri, manifest ve meta adresleri güncellensin.
- `davetUrl` (bakıcı davet linkleri) de `https://villatakvimim.com` olsun. Davet sayfası Cloudflare'da çalışıyor mu, `wrangler pages dev` ile kontrol et.
- `destekPosta: "destek@villatakvimim.com"` yap. PM e-posta yönlendirmesini Cloudflare'da kuruyor.
- `sw.js` sürümünü artır.
- iCal UID'lerine (`@villatakvim`) **dokunma**.

## 46.2 — robots.txt: önizleme botları görsün, Google listelemesin

- `www/robots.txt` şu an her şeyi kapatıyor. Bu yüzden Facebook Messenger, Instagram, Telegram ve Slack gibi uygulamalar link önizlemesini gösteremiyor.
- Şu botlara izin ver: `facebookexternalhit`, `Facebot`, `meta-externalagent`, `WhatsApp`, `TelegramBot`, `Twitterbot`, `Slackbot`, `LinkedInBot`, `Discordbot`, `Applebot`. Diğerleri için `Disallow: /` kalsın.
- Sayfaların Google'da görünmemesi `X-Robots-Tag: noindex` başlığı ve `<meta name="robots" content="noindex">` etiketiyle sağlanıyor. Bunlar aynen kalsın.

## 46.3 — Genel paylaşım görseli yeni villa ile

- `www/img/paylasim-genel.jpg` görselinde eski iki villalı görsel var. Zeyd'in seçtiği yeni görselle (`img/3d/baslik-villalar-512.webp`, aday f) yeniden üret.
- Boyut 1200×630 olsun, dosya 300 KB'ın altında kalsın. Düzen aynı: logo, "Villa Takvimim", "Boş günler ve fiyatlar".

## 46.4 — Eski Netlify linkleri yeni adrese gitsin (hazırla, yayınlama)

- `netlify-yonlendirme/` klasörü oluştur. İçine tek bir `_redirects` dosyası koy, içeriği şu satır:

  ```
  /*  https://villatakvimim.com/:splat  301!
  ```

  Böylece `villatakvim.netlify.app/villa-salta-k7m2` adresi `villatakvimim.com/villa-salta-k7m2` adresine gider ve daha önce WhatsApp'tan paylaşılmış linkler kırılmaz. `?teklif=` gibi sorgu parametrelerinin taşındığını kontrol et.
- `docs/YAYIN.md` dosyasını güncelle. Zeyd "yayınla" deyince sırasıyla:
  1. `git push origin main:canli` → Cloudflare yayınlar.
  2. Netlify'a **sadece** `netlify-yonlendirme/` klasörünü yayınla. Artık uygulama değil, yönlendirme.
  3. PM, Supabase Site URL'yi `https://villatakvimim.com` yapar.
- Bundan sonraki her "yayınla"da yalnız 1. adım yapılır. 2 ve 3 tek seferlik.
- `CLAUDE.md` ve proje notlarındaki "Netlify'a yayınla" ifadelerini "yayınla (Cloudflare, docs/YAYIN.md)" olarak güncelle.

## 46.5 — App Store bilgileri

`docs/` içinde App Store, TestFlight ya da mağaza metinleri varsa oradaki adresleri de yeni domaine çevir:
- gizlilik politikası adresi;
- destek adresi;
- pazarlama adresi.

Bunlar `https://villatakvimim.com/gizlilik` gibi olmalı. Sayfaların uzantısız adreste açıldığını kontrol et; Cloudflare `.html` uzantısını kendiliğinden kaldırıyor.

## 46.6 — Bitiş

- `docs/ALAN_ADI_GECIS.md` dosyasında tamamlanan maddeleri işaretle.
- `docs/PROJE_DURUMU.md` dosyasına Görev 46'yı ekle.
- Mesajının en altına çok kısa özet yaz, altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
