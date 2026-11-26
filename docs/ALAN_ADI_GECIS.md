# Geçiş günü: Netlify → Cloudflare Pages (villatakvimim.com)

Bu liste PM ve Claude Code için. Sırayla git, her adımı bitirmeden sonrakine geçme. Yayın komutları `docs/YAYIN.md` içinde.

## 1. Cloudflare Pages projesi
- [ ] Proje GitHub'a bağlandı mı? Ayarlar `docs/YAYIN.md`'deki gibi olmalı: canlı dal `canli`, çıktı klasörü `www`, build komutu boş, önizleme dağıtımları kapalı.
- [ ] İlk yayın oldu mu? Bunun için `git push origin main:canli` çalıştırılır.
- [ ] `https://<proje>.pages.dev` adresinde şunlar açılıyor mu?
  - `/` → uygulama;
  - `/config.js` → JS dosyası (g.html değil);
  - `/villa-deneme-abc123` → misafir sayfası, durum 200, "Bu bağlantı artık geçerli değil" yazısı;
  - gerçek bir paylaşım adı → villa sayfası.
- [ ] Gerçek bir paylaşım adıyla `curl -s -A "WhatsApp/2.23" https://<proje>.pages.dev/<ad>` çalıştır. Yanıtta `og:title`, `og:image` ve `og:url` dolu olmalı.

## 2. Özel alan adı
- [ ] Pages projesine Custom domains → `villatakvimim.com` ve `www.villatakvimim.com` eklendi mi?
- [ ] İkisi de "Active" mi, sertifika hazır mı?
- [ ] `www.` adresi `villatakvimim.com`'a yönleniyor mu?

## 3. Supabase giriş adresleri (Zeyd panelden yapar, PM adım adım anlatır)
- [ ] Authentication → URL Configuration → **Site URL**: `https://villatakvimim.com`.
- [ ] **Redirect URLs** listesine `https://villatakvimim.com` ve `https://villatakvimim.com/**` eklendi mi?
- [ ] Eski `https://villatakvim.netlify.app` adresi bir süre (en az birkaç hafta) listede kalsın. Eski e-postalardaki bağlantılar çalışmaya devam etsin.
- Claude Code veritabanına ve Supabase ayarlarına dokunmaz.

## 4. Kod (Claude Code)
- [ ] `www/config.js` → `siteUrl: "https://villatakvimim.com"` yapıldı. Hazır duran açıklama satırı kullanılabilir.
- [ ] Davet linkleri: `www/config.js` → `davetUrl` şu an test sitesini gösteriyor (`https://zeydusht.github.io/villa-takvimim/`). Görev 45.2'den önce de böyleydi. Zeyd/PM onaylarsa `davetUrl: ""` yap, davetler de yeni adrese gitsin.
- [ ] `npm run alan-adi` çalıştırıldı. Bu komut `index.html` ve `g.html`'deki `og:url` / `og:image` adreslerini ve gizlilik/şartlar sayfasındaki e-postayı günceller. Eski Netlify adresi kodda kalmışsa hata verir.
- [ ] `www/sw.js` → `SURUM` artırıldı.
- [ ] `npx cap sync` çalıştırıldı.
- [ ] Commit, `git push`, ardından `git push origin main:canli` yapıldı.
- **Değiştirme:** iCal UID'leri (`rez-…@villatakvim`, `tutma-…@villatakvim`). Bunlar Airbnb/Booking'deki kayıt kimlikleri. Değişirse oralarda kopya rezervasyon oluşur.

## 5. Destek e-postası
- [ ] Cloudflare → villatakvimim.com → Email → Email Routing açıldı mı?
- [ ] `destek@villatakvimim.com` → Zeyd'in kendi postasına yönlendirme kuruldu mu? Zeyd gelen doğrulama e-postasını onaylar.
- [ ] `www/config.js` → `destekPosta: "destek@villatakvimim.com"` yazıldı, `npm run alan-adi` çalıştırıldı. Bu adım 4. adımla aynı commit'e girebilir.
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
- [ ] Eski paylaşılmış linkler kırılmasın diye Netlify'a son bir yayın yapılacak. Bu yayının içinde yalnız yönlendirme olacak:
  ```
  # ayrı, boş bir klasörde: _redirects
  /*  https://villatakvimim.com/:splat  301!
  ```
  Komut: `npx netlify-cli deploy --prod --dir <o klasör>`. Bu yayını proje kökünden değil, o klasörün içinden çalıştır. Yoksa kökteki `netlify.toml`'daki g.html kuralı da yüklenir.
- [ ] Kontrol: `curl -sI https://villatakvim.netlify.app/villa-salta-k7m2?teklif=AB12CD34` → `301` dönmeli, `Location: https://villatakvimim.com/villa-salta-k7m2?teklif=AB12CD34` olmalı. Netlify sorguyu (`?…`) kendisi ekler, doğrula.
- [ ] Netlify sitesi silinmez, yönlendirme olarak kalır.

## 8. Uygulama (Capacitor / mağaza)
- [ ] Uygulama, paylaşım linkini `www/config.js` → `siteUrl` değerinden kurar. `npx cap sync` bu değeri `ios/App/App/public/config.js` ve `android/app/src/main/assets/public/config.js` dosyalarına kopyalar. Kopyaların yeni adresi gösterdiğini doğrula.
- [ ] Yeni adres, bir sonraki TestFlight / Play derlemesiyle gelir. O zamana kadar mağaza sürümü eski Netlify adresiyle link üretir. Bu linkler 7. adımdaki 301 yönlendirmesi sayesinde çalışır.
