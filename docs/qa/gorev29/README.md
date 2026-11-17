# Görev 29: test raporu

_Claude Code, 17 Kasım 2026._

Ortam: Playwright, sahte Supabase, sabit saat 16 Kasım 2026; 360 / 390 / 430 (+ 390×664). `VERITABANI_GOREV29.sql` çalıştırılmadı. Sunucu yanıtları testte taklit edildi (tablo `olaylar`, RPC `istatistik_ozet`, `son_gorulmeler`, `kullanici_etkinlik_gor`, Auth TOTP uçları).

| Kontrol | Sonuç |
|---|---|
| **Ölçüm (29.1)** — gerçek akış: arama, seç ve gönder, adı / telefonu / notu girilmiş rezervasyon, yazı boyutu | 13 olay tek istekte |
| İstekte isim, telefon, villa adı, tutar, tarih, konum, not, e-posta | yok |
| `veri` içeriği | yalnız sayı / listeden değer; en büyük 28 bayt |
| `kullanici` ve `zaman` alanı gönderiliyor mu | hayır (sunucu doldurur) |
| Yetki | kullanıcının kendi oturum jetonu |
| platform / surum / oturum | web / 1.0.0 / açılış başına tek UUID |
| Ayar kapalı (16 sn bekleme dahil) | 0 istek |
| Ayar Hesap'tan açılınca | gönderim başlıyor |
| Onaysız hesap | 0 istek |
| Çevrimdışı | arama çalışıyor, görünür hata yok, istek yok; bağlanınca kuyruk tek istekte gidiyor |
| **Hata yakalama (29.2)** — mesajında isim / telefon / tutar olan 8 hata | 5 olay (sınır), yalnız tür ve satır; mesaj isteğe girmiyor |
| **Normal kullanıcı** — `istatistik_ozet` | "Yetkiniz yok" (sunucu) |
| Yönetim bölümü, "Kullanıcılar", "Özet", iki adımlı doğrulama | DOM'da yok |
| **Yönetici (29.3)** — özet kartları (10), villa dağılımı, 12 hafta, huni (%100/75/75/50), 15 özellik, platform | ✓ |
| Kullanıcı listesi: son görülme ("3 saat önce" · iPhone · 1.0.0) | ✓ |
| Sıralama (son görülme / villa sayısı / kayıt tarihi) | ✓ |
| "Abonelik: —" yeri | ✓ |
| "Etkinliği gör": onaydan önce sunucu çağrılmıyor, onaydan sonra bir kez | ✓ |
| Etkinlik: hata satırı kırmızı | ✓ |
| **Gizlilik (29.4)** — "Kullanım verileri" maddesi (6 alt başlık), destek erişimi cümlesi, 13 ay; taşma | ✓, taşma yok |
| **iOS (29.5)** — Info.plist ve PrivacyInfo.xcprivacy geçerli plist; proje dosyası parantez dengesi ve yeni kimlik sayıları | ✓ |
| **İki adımlı doğrulama (29.6)** — kurulum: QR + anahtar, yanlış kodda uyarı, doğru kodda oturum aal2, durum "Açık" | ✓ |
| Açılışta kod sorma (faktörü olan yönetici, aal1) | ✓ |
| Kod panelinin dışına dokunmak | kapatmıyor |
| "Vazgeç ve çıkış yap" | oturumu kapatıyor |
| **Düzen** — Hesap ekranı ve yönetim panelleri, Normal ve Çok büyük yazı, 3 boyut | taşma / kesik yazı yok (kesilen 3 değer düzeltildi) |
| **Mevcut testler** — Görev 27 | 86/86 |
| Görev 28 | 8 × 15/15; başlık satırı; villa takvimi ✓ |
| Görev 25 | 16/16 |
| Görev 24 | 84/84 · 24/24 |
| Görev 23 | 6/6 |
| Görev 22 | 21/21 |
| Görev 21 | 4/4, 13/13, 11/11 |
| Görev 19 | hatasız |

Konsol / sayfa hatası: hiçbir testte yok.

## Denenemeyen (gerçek ortam gerekiyor)

- Gerçek Supabase: SQL uygulanınca ölçüm kayıtlarının yazılması, RPC'ler, gerçek TOTP kodu.
- iOS derlemesi (Windows'ta Xcode yok). PrivacyInfo ve InfoPlist.strings'in derlemeye girdiği TestFlight'ta görülecek.
