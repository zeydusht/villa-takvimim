# Villa Takvim — Proje Durumu

_Son güncelleme: 7 Kasım 2026_

## Ne bu?
Villa Takvim'in (villatakvim.netlify.app) iPhone/Android uygulaması. App adı: **Villa Takvimim**.
Repo: github.com/zeydusht/villa-takvimim (public; Claude GitHub App kurulu).
Site kodu **baştan yazılmadı**; Capacitor ile aynı HTML bir app kabuğuna sarıldı.
Veritabanı aynı: Supabase "VillaTakvim Project" (qmfyqixilkvcvidigngt).

## Klasörler
- `www/` → uygulamanın kendisi (siteyle aynı dosyalar). Netlify de bu klasörü yayınlar (`netlify.toml`).
  - `www/native.js` → YENİ. Sadece app içinde çalışır, sitede hiçbir şey yapmaz:
    dış linkler (WhatsApp, gizlilik vb.) app içinde açılır, üst durum çubuğu rengi ekrana göre değişir, Android geri tuşu.
- `ios/` → iPhone projesi (Xcode). Bundle ID: `com.zeydtekin.villatakvim`
- `android/` → Android projesi
- `assets/` → ikon ve açılış ekranı kaynak görselleri (`npx capacitor-assets generate` ile yeniden üretilir)
- `.github/workflows/` → bulutta derleme
  - `android.yml` → her gönderimde deneme APK'sı (Actions sekmesinden indirilir)
  - `ios.yml` → her gönderimde iPhone derlemesi; Apple anahtarları ekliyse TestFlight'a yükler

## Siteye göre değişenler
1. `index.html` → `native.js` yükleniyor; app içinde bildirim ayarında "bir sonraki sürümde" yazıyor
2. `dil.js` → bu yazının İngilizcesi eklendi

## Kod değişince
`www/` içinde düzenle → `npx cap sync` → GitHub'a gönder → derlemeler kendiliğinden başlar.

## Bekleyenler (Zeyd'den)
- [x] GitHub repo açıldı, kod gönderildi; Android APK ve iOS derleme kontrolü başarılı (7 Kasım)
- [ ] App Store Connect'te uygulama kaydı (bundle ID: com.zeydtekin.villatakvim)
- [ ] App Store Connect API anahtarı (Admin) + Team ID → GitHub repo Secrets:
      `APPLE_TEAM_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`

## İnceleme raporu (7 Kasım)
Bulgular ve öncelik sırası claude.ai'daki "Villa Takvimim — Uygulama İnceleme Raporu" dokümanında.

## Test linki
https://zeydusht.github.io/villa-takvimim/ — GitHub Pages, main'e her gönderimde güncellenir.
Gerçek veritabanına bağlı. Canlı site (villatakvim.netlify.app) hâlâ eski sürüm.

## Çalışma şekli
Claude (sohbette) ürün yöneticisi: `docs/GOREVLER.md`'den bir bölüm seçip Claude Code'a mesaj yazar.
Zeyd mesajı Claude Code'a yapıştırır (yerel klasör: İndirilenler\Villa Takvimim). Claude Code
uygular, GitHub'a gönderir ve durur. Zeyd "bitti" der; Claude GitHub'dan çekip sahte veriyle
telefon boyutunda test eder, önce/sonra gösterir, sonraki bölümün mesajını yazar.

## İlerleme (GOREVLER.md)
- [x] 1. bölüm — app katmanı (1.6 bildirimler hariç) · test edildi
- [x] 2. bölüm — hatalar · test edildi. Karar: bakıcı sadece "girişte alınacak" kalan tutarı görür;
      bakıcının eklediği rezervasyonun tutarı gecelik fiyatlardan otomatik hesaplanır.
- [x] 3. bölüm — görsel tasarım · test edildi (rezervasyon detayı belirgin iyileşti; ana ekran
      düzeni 4. bölümde)
- [x] 4. bölüm — ekran düzeni · test edildi (kompakt kartlar, alt sekme barı, Pt-Pz, baş harfler)
- [x] Zeyd'in isteği (7 Kasım, yapıldı ve test edildi): yazılar kalın değil, butonların ÇERÇEVESİ belirgin olsun. Tıklanabilir
      kart/satır/butonlar 2px koyu (#5F6A64) çerçeve, basınca yeşil çerçeve + açık yeşil zemin +
      hafif küçülme (banka uygulaması netliği). Claude Code'a gönderildi.
- [x] Villa ekranı boş durumu · test edildi. Düzeltme Claude Code'a gönderildi: kurulum kartı
      rezervasyonu olan villada kapalı tek satır + takvimin altına; "+ Rezervasyon" butonu tek satır.
      (Eski not:: kurulum kartı (fiyat · fotoğraf ·
      bilgiler · paylaş), hızlı işlem butonları, ay özeti kutuları, takvim iyileştirmeleri,
      "boş günleri WhatsApp'tan paylaş". Mesajı sohbette yazıldı.)
- [ ] 5. bölüm — küçük kazanımlar
- [ ] 1.6 — telefon bildirimleri (Firebase/Apple anahtarı gerekecek)
- [x] Fiyat girme yeniden tasarımı · test edildi: sarı "fiyat modu" kalkar, ayrı "Fiyatlar"
      ekranı, "Aylar" (12 ay listesi, aya dokun → tüm aya fiyat, hafta sonu ayrı fiyat, çoklu ay seçimi)
      ve "Günler" (takvimde gün seç → fiyat gir) sekmeleri, son kullanılan fiyatlar, "Geri al".
- [x] Fotoğraflar ekranı · test edildi: villa ekranında ilk 3 foto + "+X", ayrı Fotoğraflar
      ekranı (3'lü ızgara, kapak etiketi, basılı tut-sürükle sıralama, çoklu seçip silme, tam ekran
      görüntüleme + kapak yap). Bakıcı silemez/sıralayamaz.
- [ ] Drive'dan fotoğraf alma (fotoğraf ekranından sonra, mesajı henüz yazılmadı). Plan: kullanıcı
      herkese açık Drive klasör linkini yapıştırır → Supabase edge function (girişli + villaya erişim
      kontrolü, Google API anahtarı sır olarak) klasördeki görselleri listeler ve indirmeyi aracılık
      eder → istemci mevcut küçültme akışıyla (fotoHazirla) yükler, ilerleme gösterir, üst sınır ~60.
      Zeyd'in Google Cloud'da Drive API anahtarı oluşturması gerekecek (adım adım anlatılacak).
- [x] Villa silme güvenliği · test edildi: buton Villa bilgileri altına, adı yazarak onay,
      "Geri al", Hesap → Silinen villalar (30 gün). Veritabanı: villalar.silindi_tarih sütunu EKLENDİ
      (7 Kasım, Zeyd onayıyla). 30 gün sonra kalıcı silmeyi uygulama yapar (sahip açınca).
      Not: canlı Netlify sitesi eski sürüm, bu alanı bilmiyor.
- [x] Gelir & gider sadeleştirme + kalıcı alt menü · test edildi: tek net kazanç kartı +
      açıklama, 3 etiketli satır (Alınan / Alınacak / Giderler), 12 aylık SVG çubuk grafik, rezervasyon
      satırlarında Ödendi/Kısmen/Ödenmedi/Tutar girilmedi etiketleri, ortalama gecelik fiyat hesabı
      düzeltmesi (500 ₺ hatası), yeşil seçici. Alt menü iç ekranlarda da kalır (Villalar seçili).
- [x] Gelir & gider hızlı ekleme · test edildi: satırlarda "+" butonları, hazır gider düğmeleri
      (Temizlik, Havuz bakımı…), son tutar önerisi, kaybolan başlık. KONTROL: Zeyd'in ekranında Villa
      Salta 2026 her şey 0 ₺ görünüyordu (önce 5.000/30.000/1.000 vardı) — hata olabilir, test et.
- [ ] Küçük düzeltmeler (mesajı yazıldı): alt menünün arkasından içerik/grafik çubuğu görünüyor
      (menü zemini opak + üstte olsun); kurulum kartındaki "Gizle" 24px, 44px olsun.
- [ ] GOREVLER.md 6. bölüm — "ilk kez kullanan anlasın" (11 madde: Takvim sekmesi boş, tek terim
      "Kalan ödeme", rezervasyon adım şeridi, sade form, ödeme paneli, Türkçe tarih, Hesap düzeni,
      karşılama kartı…) · Claude Code'a gönderilecek
- [ ] SIRADAKİ: Veritabanı güvenlik düzeltmeleri — Claude sohbetten Supabase'de yapacak, Zeyd'in onayıyla
      (detaylar inceleme raporunda, repo herkese açık olduğu için burada yok)

## Sonraki fazlar
- **Faz 3 / bildirimler:** Web Push app içinde çalışmıyor. Firebase/APNs ile native bildirim
  (@capacitor/push-notifications) + Supabase edge function'ı buna göre güncellemek.
- Şifre sıfırlama e-postası şu an siteye yönlendiriyor (çalışıyor ama app'e dönmüyor) → ileride deep link.
- App Store incelemesi için app'e özel özellikler (Apple "sadece site" uygulamalarını reddedebilir).
- Paylaş (navigator.share) ve PDF dışa aktarma gerçek iPhone'da test edilecek.
