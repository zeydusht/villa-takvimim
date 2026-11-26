# Yayın: Zeyd "yayınla" deyince

Bu not PM ve Claude Code için. Yayın yalnızca Zeyd "yayınla" deyince yapılır. Normal işlerde commit + push yeterli olur, test sitesi (https://zeydusht.github.io/villa-takvimim/) `main`'den kendiliğinden güncellenir.

## Ortak hazırlık
1. `main` temiz ve GitHub'a gönderilmiş olmalı.
2. `www/sw.js` → `SURUM` artırılmış olmalı.
3. `npx cap sync` çalıştırılmış olmalı.

## Geçişten önce: Netlify (şu anki durum)
```sh
npx netlify-cli deploy --prod --dir www
```
- Komutu proje kökünden çalıştır. Paylaşım linki kuralı (`/*` → `/g.html` 200) Görev 45.1'den beri kökteki `netlify.toml` dosyasında duruyor. Netlify CLI bu dosyayı yayınla birlikte yükler.
- Yayından sonra kontrol et (`ADRES=https://villatakvim.netlify.app`):
  - `curl -s $ADRES/sw.js | grep SURUM` → yeni sürüm görünmeli;
  - `curl -sI $ADRES/villa-deneme-abc123` → `200` ve `text/html` dönmeli (misafir sayfası);
  - `curl -sI $ADRES/config.js` → `application/javascript` dönmeli.

## Geçişten sonra: Cloudflare Pages
```sh
git push origin main:canli
```
- İlk yayında `canli` dalı bu komutla oluşur. Önceden oluşturma.
- Cloudflare yeni gönderimi görüp kendisi yayınlar (1–2 dakika sürer).
- Kontrol yukarıdakiyle aynı, `ADRES=https://villatakvimim.com` ile. Ek olarak:
  - `curl -s -A "WhatsApp/2.23" $ADRES/<gerçek-paylaşım-adı>` → yanıtta `og:title` ve `og:image` dolu olmalı.
- Netlify'a bundan sonra yayın yapılmaz. Tek istisna 301 yönlendirme yayınıdır, bkz. `docs/ALAN_ADI_GECIS.md` 7. adım.

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
