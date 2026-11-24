# Görev 40: villa kartı, arama, giriş/çıkış renkleri, ödemeler — test raporu

_Claude Code, 24 Kasım 2026._ Veritabanı değişmedi (`docs/VERITABANI_GOREV40.sql` PM'de), deploy edilmedi, Netlify'a yüklenmedi.

## Ne değişti

| Adım | Değişiklik |
|---|---|
| 40.1 | **Villa sayfası üst kartı.**<br>• "Bugün 16:00'da … girecek" gibi alt satır kalktı. Sıradaki iş yalnız alttaki "Sıradaki" kartında.<br>• Sağda büyük kare kapak fotoğrafı: kartın ≈ %38'i (390 pt'de 131 pt), köşe 16 pt, içerikle dikey ortalı. Dokununca tam ekran galeri.<br>• Fotoğraf yoksa `villa-bos` görseli + "Fotoğraf ekle"; dokununca fotoğraf ekleme.<br>• Ad sığmazsa fotoğraf 96 pt'ye iner, gerekirse adın yazısı %70'e kadar küçülür. Kelime kesilmez. |
| 40.2 | **Teklif görseli.**<br>• Yeni `bolum-teklif` (zarf + % etiketi + takvim yaprağı), `codex exec` ile ortak stilde, ilk denemede.<br>• "Teklifler" başlığında, boş hâlinde ve Özel teklif panelinde kullanılıyor. Özel teklif panelinde açıklama cümlesinin sağında, çünkü başlık satırında "Nasıl?" ve "Kapat" var.<br>• `misafir-teklif` değişmedi. |
| 40.3 | **Sekme başlıkları.**<br>• Yazı yine sayfanın tam ortasında. Görsel sola yaslı: dolu sol kenarı "+ Villa ekle" ile aynı hizada.<br>• Görselin dolu üstü ile üst çubuk arasında en az 12 pt.<br>• `baslik-hesap` diğerleriyle aynı üst/alt şeffaf payla (~%10) yeniden kırpıldı; anahtarlık artık çubuğa yapışmıyor.<br>• Üç görselin dolu üstü her yazı boyunda aynı yerde. |
| 40.4 | **Villalarım'da arama.**<br>• "Bugün ve yarın" kartı kalktı.<br>• "+ Villa ekle" satırının altında arama kutusu, 4 ve üstü villada. Ad ve konumda arar; Türkçe harf ve büyük/küçük farkı yok.<br>• Sonuç yoksa "‘xyz’ adında villa yok" + "Aramayı temizle".<br>• Dolu/boş etiketleri süzgeç, aramayla birlikte çalışır. İkisi de villaya girip dönünce yerinde kalır, uygulama kapanınca sıfırlanır.<br>• Rehber ve tur bu karta bağlı değildi. |
| 40.5 | **Giriş yeşil, çıkış kırmızı.**<br>• Rezervasyon detayında Giriş satırı (ikon, başlık, tarih, saat) yeşil, Çıkış satırı kırmızı.<br>• Bugünse dolu "Bugün", yarınsa açık "Yarın" etiketi.<br>• Ajanda'daki "Giriş 16:00 / Çıkış 10:00" etiketleri de aynı renkte. |
| 40.6 | **Gri alana dokununca kapanır.**<br>• Bütün alttan açılan pencerelerde "Kapat" ile aynı: aynı animasyon.<br>• Dokunuş gri alanda başlayıp gri alanda bitmeli.<br>• Rehber adım gösterirken kapanmaz.<br>• Formlarda bir alan değiştiyse önce sorulur: "Değişiklikler kaydedilmedi. Çıkılsın mı?" (Çık / Devam et). |
| 40.7 | **Ödemeler ekranı.**<br>• En üstte Alınacak · Alınan (yeşil) · Kalan (kırmızı). Fazla alındıysa "Fazla alındı · 2.000 ₺".<br>• Altında alınan ödemeler (tarih, tutar, not, sağda ok); dokununca düzenle / "Bu ödemeyi sil".<br>• "Yeni ödeme" kutusunda kalan hazır yazılı. Kalan 0 ise "Ödemenin tamamı alındı" + "Ek ödeme ekle".<br>• Bakıcı yetkileri aynı. |
| 40.8 | **Tutar satırları hizalı.**<br>• Rezervasyonu düzenle: Konaklama ücreti · Ek ücret · Depozito · Toplam tablosu. Tutar sütunu sağa yaslı, `tabular-nums`, ₺ bitişik, satırlar eşit; Toplam canlı.<br>• Yeni rezervasyon / özel teklif ücret kartında da tutarlar tek sütunda; "Konaklama ücreti" satırının tutarı artık dışarı taşmıyor. |

**Görevden ayrılan nokta:** 40.7'de "Fazla alındı" için turuncu istenmişti. Uygulamada sarı/turuncu kullanılmıyor (`docs/STIL.md`,
Görev 12), bu yüzden para/dikkat rengi olan lacivert kullanıldı (açık lacivert zemin). İstenirse tek değişkenle değişir.

## 40.9 Test

Otomatik test (Playwright, sahte sunucu verisi, saat 24 Kasım 2026 11:00). Her kontrol **chromium ve webkit**'te ayrı ayrı çalıştı.
Yerleşim kontrolleri 320 ve 390 genişlikte, normal ve Çok büyük yazıda yapıldı.

| Adım | Kontrol (motor başına) | Ne ölçülüyor |
|---|---|---|
| 40.1 | 209 | Alt satır yok; fotoğraf kartın ≈ %38'i / ≥ 96 pt, kare, köşe 16, dikey ortalı; dokununca galeri; fotoğraf yoksa "Fotoğraf ekle"; uzun adda kelime kesilmiyor, "Dolu · Ad Soyad" kesilmiyor |
| 40.2 | 5 | `bolum-teklif` Teklifler başlığında, boş hâlinde ve Özel teklif panelinde yükleniyor; `misafir-teklif` değişmedi |
| 40.3 | 111 | Yazı tam ortada; görselin dolu sol kenarı "+ Villa ekle" ile ±2 pt; dolu üst ile çubuk arası ≥ 12 pt; üç görselin dolu üstü aynı yerde |
| 40.4 | 27 | 4+ villada kutu var, 3 villada yok; "sisli" = "ŞİŞLİ", "isil caglar" = "Işıl Çağlar", "SALTA" = "salta"; sonuç yok metni + "Aramayı temizle"; ×; dolu/boş süzgeci aramayla birlikte; villadan dönünce yerinde, yeniden açılınca sıfır |
| 40.5 | 30 | Giriş satırı yeşil, çıkış kırmızı; Bugün / Yarın etiketleri; Ajanda etiketleri aynı renk |
| 40.6 | 9 | Gri alana dokununca kapanıyor; panelde başlayıp gri alanda biten dokunuş kapatmıyor; değişiklik varsa soru (Devam et / Çık); rehber açıkken kapanmıyor |
| 40.7 | 48 | Alınacak / Alınan / Kalan tutarları ve renkleri; fazla ödemede "Fazla alındı"; liste, düzenle / sil; "Yeni ödeme" kalanla dolu; kalan 0 → "Ödemenin tamamı alındı" + "Ek ödeme ekle"; bakıcı ödeme göremiyor |
| 40.8 | 56 | Tutarlar aynı sağ kenarda, `tabular-nums`, tek satır, ₺ bitişik; 1.250.000 sığıyor; satırlar eşit; ücret kartında ad tutara binmiyor, düğme kartın içinde |

**Sonuç: 990 kontrol (2 × 495), 0 hata, 0 sayfa (JS) hatası.**

**Ters deneme:** Aynı test 40.1'den önceki kodla (86dfca9) chromium'da çalıştırıldı. Sekiz bölümün sekizi de başarısız oldu
(öğe yok / 40.3'te 111 kontrolden 33'ü / 40.5'te 6'dan 5'i). Yani testler yeni davranışı gerçekten ölçüyor.

**Eski testler** (yeni kodla, Görev 39 sonuçlarıyla karşılaştırıldı):

| Test | Sonuç |
|---|---|
| Görev 36 (3D görseller), 39 (bölüm görselleri), 33a–h (pencereler, rehber, kapatma) | Hepsi geçti |
| Görev 28 takvim (360/390/430/iPhone 14 × normal / Çok büyük), 28a, 31 (iskelet, kaydetme hatası), tanıtım turu | Görev 39'la aynı, sorun yok (kartlar yalnızca "Bugün ve yarın" kalktığı için yukarı kaydı) |
| Görev 37 / 38 "görsel yazıya 8–12 pt yakın" | Bilinçli olarak artık geçmiyor: 40.3 görseli sola yasladı. Yazı yine tam ortada (sapma 0 pt). Görev 37'deki iki eski uyarı (geri gelme animasyonu, "Villalarımız") Görev 39'da da vardı |
| Görev 37 "görselin dolu altı alttaki öğeden ≥ 8 pt" | 40.3 sonrası Villalarım'da 7,6 pt çıktı; 40.9'da düzeltildi. Hesaplama artık 40.3'teki dikey kaymayı da hesaba katıyor (`--baslik-alt-pay`). Düzeltmeden sonra 0 hata; 40.3 ve 40.4 iki motorda yeniden geçti (276 kontrol). |

## Ekran görüntüleri (chromium)

| Dosya | Ne gösteriyor |
|---|---|
| `401-kart-foto-*`, `401-kart-bos-*`, `401-kart-uzun-*`, `401-galeri-390` | Villa kartı: fotoğraflı, fotoğrafsız, uzun ad (320 Çok büyük / 390 normal); galeri |
| `402-teklifler-baslik`, `402-teklifler-bos`, `402-ozel-teklif` | Yeni teklif görseli üç yerde |
| `403-ana-*`, `403-ajanda-*`, `403-hesapEkran-*` | Üç sekme başlığı, normal ve Çok büyük |
| `404-arama-sonuc`, `404-arama-yok`, `404-suzgec-dolu` | Arama, sonuç yok, dolu süzgeci |
| `405-detay-giris-bugun/yarin`, `405-detay-cikis-bugun/yarin`, `405-ajanda` | Giriş yeşil / çıkış kırmızı, Bugün / Yarın etiketleri |
| `406-soru` | Gri alana dokununca "Değişiklikler kaydedilmedi. Çıkılsın mı?" |
| `407-odemeler-hic/eksik/tam/fazla-390-normal`, `407-odemeler-buyuk-320-cokbuyuk`, `407-odeme-duzenle` | Ödemeler ekranının dört hâli, dar ekran, ödeme düzenleme |
| `408-duzenle-*`, `408-ucret-karti-*` | Tutar satırları (1.250.000 ₺ dahil), 320 / 390 × normal / Çok büyük |
