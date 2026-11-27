# Geçiş günü: Netlify → Cloudflare Pages (villatakvimim.com)

Bu liste PM ve Claude Code için. Sırayla git, her adımı bitirmeden sonrakine geçme. Yayın komutları `docs/YAYIN.md` içinde.

Durum (27 Kasım, Görev 46 sonu): kod hazır ve main'de; `canli` dalına ve Netlify'a henüz yayın yapılmadı. Kalanlar: `docs/YAYIN.md` → "Geçiş yayını" (Zeyd "yayınla" deyince).

## 1. Cloudflare Pages projesi
- [x] Proje GitHub'a bağlandı mı? Ayarlar `docs/YAYIN.md`'deki gibi olmalı: canlı dal `canli`, çıktı klasörü `www`, build komutu boş, önizleme dağıtımları kapalı.
- [x] İlk yayın oldu mu? Bunun için `git push origin main:canli` çalıştırılır.
- [x] `https://<proje>.pages.dev` adresinde şunlar açılıyor mu? (PM, 27 Kasım; villatakvimim.pages.dev/config.js 200)
  - `/` → uygulama;
  - `/config.js` → JS dosyası (g.html değil);
  - `/villa-deneme-abc123` → misafir sayfası, durum 200, "Bu bağlantı artık geçerli değil" yazısı;
  - gerçek bir paylaşım adı → villa sayfası.
- [ ] Gerçek bir paylaşım adıyla `curl -s -A "WhatsApp/2.23" https://<proje>.pages.dev/<ad>` çalıştır. Yanıtta `og:title`, `og:image` ve `og:url` dolu olmalı. (Function canlıda çalışıyor: deneme adı → 200, genel etiketler, `max-age=60`. Gerçek adla deneme yayından sonra.)

## 2. Özel alan adı
- [x] Pages projesine Custom domains → `villatakvimim.com` ve `www.villatakvimim.com` eklendi mi?
- [x] İkisi de "Active" mi, sertifika hazır mı?
- [ ] `www.` adresi `villatakvimim.com`'a yönleniyor mu? (27 Kasım: yönlenmiyor, www de 200 ile aynı siteyi açıyor. Çalışıyor ama tek adres için Cloudflare'da Redirect Rule önerilir — PM.)

## 3. Supabase giriş adresleri (Zeyd panelden yapar, PM adım adım anlatır)
- [x] Authentication → URL Configuration → **Site URL**: `https://villatakvimim.com`. (27 Kasım, PM)
- [x] **Redirect URLs** listesine `https://villatakvimim.com` ve `https://villatakvimim.com/**` eklendi mi?
- [x] Eski `https://villatakvim.netlify.app` adresi bir süre (en az birkaç hafta) listede kalsın. Eski e-postalardaki bağlantılar çalışmaya devam etsin.
- Claude Code veritabanına ve Supabase ayarlarına dokunmaz.

## 4. Kod (Claude Code)
- [x] `www/config.js` → `siteUrl: "https://villatakvimim.com"` yapıldı (Görev 46.1).
- [x] Davet linkleri: `davetUrl: "https://villatakvimim.com"` (Görev 46.1; `?davet=KOD` yerel Cloudflare'da denendi).
- [x] `npm run alan-adi` çalıştırıldı. Bu komut `index.html` ve `g.html`'deki `og:url` / `og:image` adreslerini ve gizlilik/şartlar sayfasındaki e-postayı günceller. Eski Netlify adresi kodda kalmışsa hata verir.
- [x] `www/sw.js` → `SURUM` artırıldı (`vt-2026-11-27-46`).
- [x] `npx cap sync` çalıştırıldı.
- [x] Commit, `git push` yapıldı.
- [x] `git push origin main:canli` — Zeyd "yayınla" deyince. (27 Kasım, e912eff)
- **Değiştirme:** iCal UID'leri (`rez-…@villatakvim`, `tutma-…@villatakvim`). Bunlar Airbnb/Booking'deki kayıt kimlikleri. Değişirse oralarda kopya rezervasyon oluşur.

## 5. Destek e-postası
- [x] Cloudflare → villatakvimim.com → Email → Email Routing açıldı mı? (27 Kasım, PM: MX/SPF/DKIM eklendi)
- [x] `destek@villatakvimim.com` → zeydtekin12@gmail.com (aktif; adres hesap e-postası olduğu için doğrulanmış geldi).
- [x] `www/config.js` → `destekPosta: "destek@villatakvimim.com"` yazıldı, `npm run alan-adi` çalıştırıldı. Bu adım 4. adımla aynı commit'e girebilir.
- [ ] Deneme postası gönderildi ve Zeyd'e ulaştı mı?

## 6. Test (yeni adreste)
- [ ] Uygulamada "Paylaş" ile üretilen link `https://villatakvimim.com/<ad>` biçiminde mi, açılıyor mu?
- [ ] Link WhatsApp'a yapıştırılınca önizlemede kapak fotoğrafı, "Villa Adı · Konum" ve "Boş günler ve fiyatlar · Villa Takvimim" görünüyor mu?
- [ ] `?teklif=KOD` linki "size özel teklif" başlığıyla mı geliyor?
- [ ] Giriş / şifre sıfırlama e-postasındaki bağlantı yeni adrese dönüyor mu?
- [ ] Misafir sayfası çalışıyor mu (takvim, fiyat, WhatsApp düğmesi)?
- [ ] iCal dışa aktarım linki çalışıyor mu? Bu link Supabase'te durduğu için değişmez, yine de dene.
- [ ] Gizlilik ve şartlar sayfalarında e-posta tıklanabilir mi?

## 7. Netlify'ı kapatma, yönlendir
- [x] Yönlendirme klasörü hazır: `netlify-yonlendirme/_redirects` → `/*  https://villatakvimim.com/:splat  301!` (Görev 46.4).
- [ ] Netlify'a yalnız bu klasör yayınlanacak: `docs/YAYIN.md` → "Geçiş yayını" 2. adım (proje kökünden `--dir netlify-yonlendirme`; `_redirects` kuralları önce uygulandığı için kökteki `netlify.toml` sorun olmaz).
- [ ] Kontrol: `curl -sI https://villatakvim.netlify.app/villa-salta-k7m2?teklif=AB12CD34` → `301` dönmeli, `Location: https://villatakvimim.com/villa-salta-k7m2?teklif=AB12CD34` olmalı. Netlify sorguyu (`?…`) kendisi ekler, doğrula.
- [ ] Netlify sitesi silinmez, yönlendirme olarak kalır.

## 8. Uygulama (Capacitor / mağaza)
- [x] Uygulama, paylaşım linkini `www/config.js` → `siteUrl` değerinden kurar. `npx cap sync` bu değeri `ios/App/App/public/config.js` ve `android/app/src/main/assets/public/config.js` dosyalarına kopyalar. Kopyaların yeni adresi gösterdiğini doğrula. (27 Kasım: ikisi de villatakvimim.com)
- [ ] Yeni adres, bir sonraki TestFlight / Play derlemesiyle gelir. O zamana kadar mağaza sürümü eski Netlify adresiyle link üretir. Bu linkler 7. adımdaki 301 yönlendirmesi sayesinde çalışır.

- [x] Netlify'a yalnız `netlify-yonlendirme/` yayınlandı (27 Kasım, Claude Code): `villatakvim.netlify.app/*` → 301 `villatakvimim.com/:splat`, sorgu ekleri taşınıyor.
