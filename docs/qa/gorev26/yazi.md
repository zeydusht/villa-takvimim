# Görev 26.7: yazı boyutu ayarı

_Claude Code, 17 Kasım 2026._

## Ne yapıldı

- **Ayar:** Hesap → **Görünüm** → "Yazı boyutu: Normal · Büyük · Çok büyük".
  - Altında önizleme kartı var ("Pazartesi 23 Kasım · 16:00 · Hasan Demir girecek · 29.000 ₺ alınacak"); seçilen boyutta hemen görünür.
  - Seçim hemen uygulanır ve cihazda saklanır (`vt-yazi`).
- **Nasıl ölçekleniyor:**
  - Kök yazı boyutu: Normal %100 (16 px), Büyük %112,5 (18 px), Çok büyük %125 (20 px).
  - Uygulamanın yazıları ve boşlukları `rem` olduğu için hepsi birlikte büyür.
  - Seçim `<head>`'deki küçük bir betikle ilk kareden önce uygulanır; açılışta boyut zıplamaz.
- **Ölçeklenmesi için yapılan düzeltmeler:**
  - Gövdenin yazı boyutu sabit 16 px idi; ayrıca boyut verilmemiş bütün yazılar ölçeklenmiyordu. Artık `1rem`.
  - İki büyük tutar (36 ve 30 px) `rem` oldu.
- **iPhone'un sistem yazı boyutu büyükse:** ilk açılışta bir kez "Yazılar büyüsün mü?" diye sorulur.
  - Seçenekler: "Büyük yazı kullan" / "Normal kalsın".
  - Ölçüm iOS'un `-apple-system-body` yazı tipiyle yapılıyor (varsayılan 17 px). Başka tarayıcıda bu yazı tipi yok, soru çıkmaz.
  - Açılış animasyonu, açık panel ya da rehber varken beklenir.

## "Çok büyük"te taşma düzeltmeleri (360'ta görüldü)

| Yer | Sorun | Düzeltme |
|---|---|---|
| Rezervasyon formu, ücret kartı | "Kısa konaklama ücreti", "Hasar depozitosu" tutarın üstüne biniyordu | Ad sığmazsa tutar ve "Değiştir" alt satıra geçer; sığıyorsa tek satır (normal boyutta değişmedi) |
| Yaklaşan rezervasyonlar kartı | Tarih satırı sağdaki rozetin altına taşıyor, dar ekranda ad harf harf bölünüyordu | Tarih satırı kırılabilir; kart dar kalırsa (kap sorgusu) rozet ve tutar alt satıra iner |
| Fiyatlar → Aylar | Fiyat aralığı satırın yarısını kaplıyor, ay adı ve "geçmiş" etiketi harf harf bölünüyordu | Fiyat sütunu en fazla %38, tireden kırılır; etiket bölünmez |
| Takvim hücresindeki fiyat | 13,75 px'te dar hücreye sığmaz | `clamp(11px, .6875rem, 3.1vw)`: ekran genişse büyür, dar ekranda 11 px kalır |

## Test

Playwright, 360×740, 390×844, 430×932. Betikler: `qa26yazi.js`, `tarama26.js` (`YAZI=cokbuyuk`).

| Kontrol | 390 | 360 | 430 |
|---|---|---|---|
| Normal / Büyük / Çok büyük: kök boyut | 16 / 18 / 20 px | aynı | aynı |
| Önizleme kartı aynı boyutta | ✓ | ✓ | ✓ |
| Yeniden açılışta ilk karede seçili boyut | 20 px | 20 px | 20 px |
| iPhone büyük yazı (taklit, 21 px): öneri | çıktı; "Büyük"e basınca 18 px | aynı | aynı |
| Öneri ikinci açılışta tekrar çıkmıyor | ✓ | ✓ | ✓ |
| Sistem yazısı normalken öneri | çıkmıyor | çıkmıyor | çıkmıyor |
| "Çok büyük"te 43 ekranın hepsinde taşma / kesik düğme (otomatik) | 0 | 0 | 0 |
| "Çok büyük"te üst üste binen yazı (gözle, 360 kontak sayfası) | — | düzeltmelerden sonra yok | — |
| Konsol hatası | 0 | 0 | 0 |

Görseller:
- `yazi/`: Hesap → Görünüm, her boyut, iPhone önerisi.
- `yazi-cokbuyuk/<boyut>/`: bütün ekranlar "Çok büyük"te.
