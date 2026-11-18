# Görev 30 ve gece görevi: test raporu

_Claude Code, 18 Kasım 2026._

Ortam: Playwright, sahte Supabase, sabit saat 16 Kasım 2026. Uygulama içi (iOS) durumlar için sahte `Capacitor` ve sahte RevenueCat (`Purchases`) eklentisi. Veritabanına dokunulmadı; sunucu yanıtları taklit edildi (`abonelik_durumum`, `plan_ayarlari`, `tum_abonelikler`, `abonelik_ver`, `abonelik_kaldir`).

## Görev 30

| Kontrol | Sonuç |
|---|---|
| **30.1 Pro ekranı** — başlık, 4 fayda, "İlk ay ücretsiz", geri yükle, yenileme yazısı, Gizlilik / Kullanım Koşulları | ✓ (360 / 390 / 430, Çok büyük yazı, İngilizce); taşma yok |
| `kosullar.html`, `gizlilik.html` | taşma yok, bağlantılar 48 pt |
| **30.2 mağaza** — web'de / anahtar boşken | `Magaza.hazir()` false, mağazaya hiç çağrı yok, düğmeler "Yakında" |
| Uygulamada açılışta | `configure({ apiKey, appUserID: <Supabase id> })`; başka hesapta `logIn`, çıkışta `logOut` |
| Fiyat ve deneme | "Sonra aylık ₺999,99"; deneme hakkı yoksa "Aboneliği başlat" ve tek satır fiyat |
| Satın al → sunucu abone der | Pro kapanır, "Villa Takvimim Pro açıldı", yarım kalan "villa ekle" açılır |
| İptal / ağ hatası | düğme eski hâline döner / "Mağazaya bağlanılamadı…" |
| Geri yükle (yok / var) | "geri yüklenecek abonelik bulunamadı" / açılır |
| Mağazada ürün yok | "Yakında" |
| Satın alındı ama sunucuya 12 sn'de gelmedi | "Üyeliğiniz birkaç dakika içinde açılacak" |
| **30.3 ne zaman** — sunucu yok (404), sınır kapalı, sınır kapalı + ekleyemez, abone, boş cevap | her zamanki form |
| sınır açık + ekleyemez | Pro ekranı |
| 2 villa (sınırın altında) | sunucuya sorulmadan form |
| Sunucu 5 sn gecikirse | 3 sn'de form açılır, sonra Pro çıkmaz |
| **30.4 Üyelik satırı** — sunucu yok / sınır kapalı ve kayıt yok | satır gizli |
| Ücretsiz, deneme (App Store), aktif (Google Play), iptal edildi, elle süresiz, elle (sınır kapalı) | doğru durum ve tarih; "Aboneliği yönet" doğru sayfayı açar; Pro düğmesi yalnız sınır açık + ekleyemezken |
| Uygulamada "Aboneliği yönet" | `App.openUrl` ile işletim sisteminin abonelik sayfası |
| **30.5 yönetim** — rozetler | Ücretsiz / Pro · deneme / Elle verildi (süresi dolmuş kayıt Ücretsiz) |
| Üyelik ver (1 yıl + not, süresiz) | onaydan önce 0 çağrı; Vazgeç → 0 çağrı; Evet → 1 çağrı (`p_gun` 365 / null) |
| Üyeliği kaldır | onaydan önce 0, sonra 1 çağrı |
| Mağaza aboneliği | ver / kaldır düğmesi yok, açıklama var |
| `tum_abonelikler` yok | rozet yok, detayda "Üyelik bölümü hazırlanıyor." |
| Yetki hatası | panelde "Yetkiniz yok." |
| **30.6 webhook** (`webhook/test.mjs`, Deno ve veritabanı taklit) | 21 durum ✓: yetkisiz 401, "Bearer" kabul, deneme / aktif / iptal / geri alma / ödeme sorunu / ürün değişimi / süre bitti, eski olay yeni kaydı ezmez, iade, anonim + alias, uuid yok, TEST, başka mağaza, silinmiş kullanıcı, bozuk gövde, gizli değer ayarsız |

## Kalite turu

16 durum: iPhone SE / 360 / 390 / 430 × Normal / Çok büyük × gece / gündüz. Her durumda 7 ekran kaydırılarak denetlendi.
Ayrıntı ve düzeltmeler: `docs/DENETIM.md` sonu. Görseller: `kalite/`.

## Mevcut testler (son kodla)

| Test | Sonuç |
|---|---|
| Görev 27 | 86/86 (son toplu turda 27.6 ekran görüntüsü zaman aşımına düştü; tek başına yeniden: geçti) |
| Görev 28 | 8 × 15/15; başlık satırı; villa takvimi ✓ |
| Görev 29 | ölçüm (kişisel veri yok, ayar kapalı / onaysız 0 istek, çevrimdışı), hata yakalama 5 / mesaj yok, yönetim, iki adımlı doğrulama: temiz |
| Görev 25 | 16/16 |
| Görev 24 | 84/84 (son toplu turda 1 zamanlama sapması; tek başına yeniden 7/7) · 24/24 |
| Görev 23 | 6/6 |
| Görev 22 | 21/21 |
| Görev 21 | 4/4, 13/13, 11/11 |
| Görev 19 | hatasız |

Konsol / sayfa hatası: hiçbir testte yok.

## Denenemeyen

- Gerçek App Store / Google Play satın alması (RevenueCat anahtarı ve mağaza ürünü yok; TestFlight sandbox gerekli).
- iOS / Android derlemesi (Windows'ta Xcode yok). RevenueCat eklentisi `npx cap sync` ile iOS (SPM) ve Android projelerine eklendi.
- Webhook'un Supabase'de çalışması (deploy edilmedi; Deno yerine Node'da taklitle test edildi).
