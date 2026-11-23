# Görev 35: 3D görseller her yerde, canlı misafir sayfası — test raporu

_Claude Code, 23 Kasım 2026._ Veritabanı değişmedi (`villa_doluluk`'u ürün yöneticisi uyguladı). Edge Function deploy edilmedi,
Netlify'a yüklenmedi.

## 35.1 Görseller

`docs/CODEX_3D_GORSELLER_2.md`'deki 12 görsel, ilk setin "Ortak stil" paragrafı birebir, her biri ayrı `codex exec` ile çizildi
(yüklü Codex sürümünde `--full-auto` yok; karşılığı `--approve-for-me` kullanıldı). İlk iki görsel `takvim-bos` ile yan yana
karşılaştırıldı: aynı ışık, açı, renk. Repoda yalnız webp (`-512`, kenarları kırpılmış `-256`); PNG'ler yerelde.

## Senaryolar

| # | Senaryo | Sonuç |
|---|---|---|
| 35.2 | Sihirbazın 7 adımı `hosgeldin`, `sh-kapasite` … `sh-sayfa`, "Villanız hazır!" `hazir`; hepsi yüklendi. Eski düz çizimler silindi, kodda başka kullanım yok (grep) | ✓ |
| 35.3 | Villalarım / Takvim / Hesap başlığının sağında görsel; başlıkla aynı satır, dikey ortalı. iPhone 15 Normal 64 pt; SE ve Büyük / Çok büyük yazıda 48 pt; etiketler alt satıra iner, binme yok; kayınca başlıkla solar; gece modunda `--soft` zemin. Taşma / üst üste / kesik yazı denetimi temiz | ✓ (SE Normal, SE Çok büyük, iPhone 15 Normal, iPhone 15 Büyük, iPhone 15 gece) |
| 35.4 | Liste doluyken başlıkta 40 pt (Yaklaşan rezervasyonlar, Misafirler, Gelir & gider); boşken büyük görsel, küçük yok (villa rezervasyonu yok, Ödemeler boş) | ✓ |
| 35.5 | Airbnb dış satışı (25–28 Kasım) sayfada: 25 akşam yarım, 26–27 dolu, 28 sabah yarım; bakıcının 18–20'si dolu; JSON'daki eski bilgi (21 dolu) kullanılmıyor; "Uygunluk canlı · az önce güncellendi" | ✓ |
| 35.5 | 60 sn sonra yeni rezervasyon (29 Kasım – 2 Aralık) beliriyor, seçim (22–24) korunuyor; değişiklik yoksa yeniden çizim yok; sekme görünür olunca yeniden okunuyor | ✓ |
| 35.5 | Seçili aralık (3–7 Aralık) dolunca seçim temizlenir, takvimde ve altta kırmızı "Seçtiğiniz tarihlerin bir kısmı az önce doldu."; yeni dokunuşta alttaki uyarı kalkar | ✓ |
| 35.5 | Fonksiyon yokken JSON yedek kullanılır, "canlı" satırı görünmez | ✓ |
| 35.5 | Teklif sayfası: teklif tarihleri dolunca "Bu tarihler artık müsait değil" | ✓ |
| 35.6 | Takvim başlığında `misafir-uygunluk` (64 pt, lazy), iletişimde `misafir-iletisim`, teklif kartında `misafir-teklif`; gece modunda zemin | ✓ |

Sahte saat (`page.clock`) ile 60 sn ileri sarıldı; sahte Supabase `villa_doluluk` ve `teklif_getir` döner. Uygulanan gerçek
fonksiyonun çıktı biçimi salt okunur sorguyla doğrulandı (`zaman`, `dolu` dizisi, `opsiyon`).

Ekran görüntüleri: `baslik/`, `bolum/`, `sihirbaz/`, `misafir/`.

## Mevcut testler

| Test | Sonuç |
|---|---|
| Görev 33 (33.1–33.8) | hepsi geçti; 33.3 form karşılaştırması 4 / 4 durumda fark 0 |
| Görev 32 · 31 (tur: SE / iPhone 15 × 3 yazı boyutu × hareketi azalt) · 30 | 33.9 ile aynı; turda 12 durumda taşma, hata, konsol 0, hareketi azaltta kayan öğe 0 |
| Görev 29 | fark yok |
| Görev 28 | 60/60 · Çok büyük 60/60 |
| Görev 27 | 86/86 |
| Görev 25 · 24 · 23 · 22 | 16/16 · 84/84 + 24/24 · 6/6 · 21/21 |
| Görev 21 | klavye 4/4; baloncuk 12/13 ve 10/11 (Görev 31'den bilinen sapma) |
| Görev 19 | hatasız |

Testlerin güncellenen yeri: ürün yöneticisinin eklediği "Kaç kişi?" rehber adımı (aralık seçilince "İleri" bekler) yüzünden
Görev 27.6 ve 28 testleri bu adımda kullanıcı gibi "İleri"ye dokunur. Görev 19–25 testleri iki tarayıcı aynı anda çalışınca
villa listesi geç yüklendiği için düşüyordu; sırayla çalıştırıldı.
