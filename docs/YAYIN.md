# Yayın: Zeyd "yayınla" deyince

Bu not PM ve Claude Code için. Yayın yalnızca Zeyd "yayınla" deyince yapılır. Normal işlerde commit + push yeterli olur, test sitesi (https://zeydusht.github.io/villa-takvimim/) `main`'den kendiliğinden güncellenir.

## Ortak hazırlık
1. `main` temiz ve GitHub'a gönderilmiş olmalı.
2. `www/sw.js` → `SURUM` artırılmış olmalı.
3. `npx cap sync` çalıştırılmış olmalı.

## Her "yayınla": Cloudflare Pages (Görev 46'dan sonra)
```sh
git push origin main:canli
```
- Cloudflare yeni gönderimi görüp kendisi yayınlar (1–2 dakika sürer). `canli` dalı 27 Kasım'da oluşturuldu.
- Yayından sonra kontrol et (`ADRES=https://villatakvimim.com`):
  - `curl -s $ADRES/sw.js | grep SURUM` → yeni sürüm görünmeli;
  - `curl -sI $ADRES/villa-deneme-abc123` → `200` ve `text/html` dönmeli (misafir sayfası);
  - `curl -sI $ADRES/config.js` → `application/javascript` dönmeli;
  - `curl -s -A "WhatsApp/2.23" $ADRES/<gerçek-paylaşım-adı>` → yanıtta `og:title` ve `og:image` dolu olmalı.
- Netlify'a artık uygulama yayınlanmaz.

## Geçiş yayını (tek seferlik, ilk "yayınla"da sırayla)
1. **Cloudflare:** `git push origin main:canli`. Yukarıdaki kontroller yeni adreste geçmeli. 2. adıma ancak bundan sonra geç.
2. **Netlify → yalnız yönlendirme.** Uygulama değil, sadece `netlify-yonlendirme/` klasörü yayınlanır. Klasörde tek dosya var: `_redirects` → `/*  https://villatakvimim.com/:splat  301!`.
   ```sh
   npx netlify-cli deploy --prod --dir netlify-yonlendirme
   ```
   - Komutu proje kökünden çalıştır: site bağlantısı `.netlify/state.json` içinde.
   - Kökteki `netlify.toml`'daki g.html kuralı da yüklenir ama sorun olmaz. Netlify `_redirects` kurallarını önce uygular, `301!` (zorla) her adresi yakalar.
   - Kontrol (`ESKI=https://villatakvim.netlify.app`):
     - `curl -sI "$ESKI/villa-salta-k7m2?teklif=AB12CD34"` → `301`, `Location: https://villatakvimim.com/villa-salta-k7m2?teklif=AB12CD34`. Netlify sorgu parametrelerini kendisi taşır; bu yayından önce yerelde denenemedi, burada doğrula.
     - `curl -sI $ESKI/` → `301` → `https://villatakvimim.com/`.
     - `curl -sI $ESKI/config.js` → `301`. Eski sürüm uygulama artık Netlify'dan açılmaz.
   - Sorgu taşınmıyorsa `_redirects` satırının sonuna kural ekleme. Önce Netlify belgesine bak, PM'e bildir.
3. **Supabase Site URL** → `https://villatakvimim.com`. Bunu PM panelden yapar (Authentication → URL Configuration). Claude Code veritabanına ve Supabase ayarlarına dokunmaz.

Bundan sonraki her "yayınla"da yalnız "Her yayınla" bölümü yapılır. 2 ve 3 tek seferliktir.

## Cloudflare Pages proje ayarları (bir kez yapılır)
- **Kaynak:** GitHub, `zeydusht/villa-takvimim`.
- **Production branch:** `canli`.
- **Framework preset:** None.
- **Build command:** boş.
- **Build output directory:** `www`.
- **Root directory:** boş bırak (repo kökü). `functions/` kökte durduğu için kök seçili kalmalı.
- **Preview deployments:** kapalı. Ayar yeri: Settings → Builds → Branch control → "None". Yoksa `main`'e her gönderimde önizleme kurulur.
- **Ortam değişkeni (isteğe bağlı):** `SUPABASE_URL`. Tanımlanmazsa Function adresi `www/config.js`'ten okur.
- **Compatibility date:** proje açılış günü kalabilir.

### Dosyaların görevi
- `functions/[[yol]].js`: paylaşım linklerini ve WhatsApp önizlemesini karşılar.
- `www/_routes.json`: dosyaların Function'a hiç uğramamasını sağlar.
- `www/404.html`: Function çalışmazsa, örneğin günlük ücretsiz sınır dolarsa, paylaşım linkini `g.html?v=…` adresine çevirir.

## Geri alma
- **En hızlısı:** Cloudflare panelinde Deployments → önceki yayın → "Rollback to this deployment".
- **Git ile:**
  ```sh
  git fetch origin
  git log --oneline origin/canli -5     # bir önceki yayının commit'ini bul
  git push --force origin <commit>:canli
  ```
  Bir sonraki normal yayın yine `git push origin main:canli` ile yapılır.
- **Geçişten önce (Netlify):** Netlify panelinde Deploys → önceki yayın → "Publish deploy".
