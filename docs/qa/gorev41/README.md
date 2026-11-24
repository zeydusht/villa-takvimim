# Görev 41: ödeme durumu, Sıradaki rengi, pencere kayması, aşağı çekip kapatma, Düzenle — test raporu

_Claude Code, 24–25 Kasım 2026._ Veritabanı değişmedi, deploy edilmedi, Netlify'a yüklenmedi.

## Ne değişti

| Adım | Değişiklik |
|---|---|
| 41.1 | **Ödemeler tek bakışta.**<br>• Kutular: "Alınması gereken" (gri) · Alınan (açık yeşil kutu) · Kalan (açık kırmızı; tam alındıysa yeşil "✓ 0 ₺") ya da "Fazla alındı" (açık kırmızı, artık mavi değil).<br>• Listenin altında tek cümle, ikonlu: yeşil "Ödemenin tamamı alındı" · kırmızı "1.000 ₺ eksik · alınması gerekiyor" · kırmızı uyarı "15.000 ₺ fazla alındı" + "Yanlış girilen bir ödeme varsa…" · kırmızı "Henüz ödeme alınmadı".<br>• Fazla ödemede "tamamı alındı" ve "Ek ödeme ekle" yok. Eksikte ve hiçte "Yeni ödeme" kutusu kalan / toplamla dolu.<br>• Kontrast: yazı / zemin ≈ 7:1. |
| 41.2 | **Sıradaki kartının rengi.**<br>• Misafir gelmedi: açık amber, "13.000 ₺ alınacak" kırmızı.<br>• Yerleşti + tam: açık yeşil, "✓ Yerleşti · ödeme tamam".<br>• Yerleşti + eksik / hiç: açık kırmızı, "Yerleşti · 1.000 ₺ eksik". Fazla: açık kırmızı, "Yerleşti · 15.000 ₺ fazla alındı".<br>• Sıradaki olay çıkış: nötr gri-yeşil.<br>• Her durumda yazı ve ikon da var. Ajanda kartlarının ödeme satırı aynı kararla. |
| 41.3 | **Detayda "Nasıl?" yok.** Hap kaldırıldı. Yalnız ondan açılan rehber (ödeme / depozito / PDF adımları) de kaldırıldı, kırık adım yok. Diğer ekranlardaki rehber aynı. |
| 41.4 | **Pencere dışarı kaymıyor.**<br>• Yatay: pencerenin dikey kaydırması yatay kaydırmayı da açıyordu (`overflow-x:auto`). Artık yatay kapalı, parmak yalnız dikey kaydırır; içerik pencereyi genişletemez.<br>• Dikey: iOS lastik etkisi kapalı (`overscroll-behavior:none`, iOS 16+). Eski iOS'ta açılsa da pencerenin altı beyaz.<br>• Arka sayfa kilitli. |
| 41.5 | **Aşağı çekince kapanır.**<br>• İçerik en üstteyken pencerenin her yerinden aşağı çekilir, pencere parmağı izler, arka plan açılır.<br>• %25'ten fazla ya da hızlı fiske: kapanır. Değilse yaylanarak yerine döner.<br>• İçerik kaydırılmışken önce içerik kayar.<br>• Yalnız dikey aşağı hareket sayılır (kanal hapları, takvim şeridi etkilenmez).<br>• Yarım formda "Değişiklikler kaydedilmedi. Çıkılsın mı?" Rehber açıkken çalışmaz. Hareket azaltılmışsa parmağı izlemez, anında kapanır. |
| 41.6 | **"Geri al" yerine "Düzenle".**<br>• "Yerleştirildi · 11:45" ve "Çıktı · 10:05" satırlarının sağ ucunda "Düzenle".<br>• Detayın üstünde küçük pencere: saat (11:45 → 16:20) + Kaydet. Altta kırmızı "Yerleştirmeyi geri al" / "Çıkışı geri al" → "Emin misiniz?" |

**Görevden ayrılan / yorumlanan noktalar:**
- 41.2: "Sıradaki olay çıkış" nötr. Misafir yerleştirildiyse (yerleştirme onayı varsa) sıradaki olay da onun çıkışıdır; bu durumda kart ödeme rengini alır (yeşil / kırmızı). Nötr hâl, onay verilmeden saat geçince içeride sayılan misafirin çıkışı içindir. Nötr renk eskisi gibi açık yeşil değil, gri-yeşil: "tam" yeşiliyle karışmasın diye.
- 41.2'deki amber, `docs/STIL.md`'deki "sarı/turuncu yok" kuralının tek istisnası olarak yazıldı (`--bekliyor-*`).
- 41.1'deki ⚠ emoji değil, uygulamanın uyarı üçgeni ikonu (`uyari-ucgen`).

## 41.7 Test

Otomatik test (Playwright, sahte sunucu verisi). Her kontrol **chromium ve webkit**'te ayrı ayrı çalıştı.

| Adım | Kontrol (chromium / webkit) | Ne ölçülüyor |
|---|---|---|
| 41.1 | 52 / 52 | Dört durum (tam / eksik / fazla / hiç) + 320 Çok büyük: kutu adları, tutarlar, zemin ve yazı renkleri, ✓; kontrast ≥ 4,5; durum satırının metni, rengi, ikonu; fazlada "tamamı alındı" / "Ek ödeme ekle" / Yeni ödeme yok + açıklama; eksik / hiçte Yeni ödeme kalan / toplamla dolu |
| 41.2 | 46 / 46 | Yedi durum (bekliyor, bekliyor + ödeme tam, yerleşti tam / eksik / hiç / fazla, çıkış nötr): kart zemini ve kenarı, durum yazısı + ikon, sağdaki tutar; kontrast ≥ 4,5; Ajanda ödeme satırı aynı karar |
| 41.3 | 8 / 8 | Sıradaki → detay: "Nasıl?" yok (sahip, yardımlı mod, bakıcı); Ödemeler ekranında rehber hâlâ var |
| 41.4 | 48 / 48 | Detay, Rezervasyonu düzenle, Ödemeler (iPhone ve 320): yatay kaydırma kapalı, `scrollLeft` hep 0 (parmakla sağa sola sürükleyince de), içerik taşmıyor, en alta kaydırınca pencerenin altında boşluk yok, arka sayfa kilitli, lastik etkisi kapalı ya da altta beyaz uzantı |
| 41.5 | 14 / 13 | En üstte %40 çekme: pencere parmağı izliyor, kapanıyor · kısa yavaş çekme: yerine dönüyor · hızlı fiske: kapanıyor · içerik ortadayken çekme: pencere inmiyor, içerik kayıyor (chromium'da gerçek kaydırma) · değişmiş form: soru, Devam et → yazılan yerinde · yatay hareket: pencere oynamıyor · rehber açıkken kapanmıyor · hareket azaltılmış: parmağı izlemiyor, anında kapanıyor |
| 41.6 | 27 / 27 | "Yerleştirildi · 11:45" + sağda Düzenle (390 / 320 Çok büyük) · küçük pencere detayın üstünde · Kapat → detay · 11:45 → 16:20 (sunucuya 13:20 UTC) · kırmızı "Yerleştirmeyi geri al" → "Emin misiniz?" → Vazgeç / Evet (sunucuya `null`) · "Çıktı · 10:05" → 10:30 |

**Sonuç: 389 kontrol (195 chromium + 194 webkit), 0 hata, 0 sayfa (JS) hatası.**

Dokunuş: chromium'da gerçek dokunma olayları (CDP); tarayıcı içeriği gerçekten kaydırır. Playwright WebKit dokunarak sürükleyemediği
için webkit'te dokunma olayları sayfada üretildi. İçerik kaydırması orada kodla yapıldı; "içerik kaydı" kontrolü bu yüzden yalnız
chromium'da (webkit'te 1 eksik). iOS'taki lastik etkisi Playwright'ta görülemiyor. Bunun için CSS kuralı ve beyaz uzantı ölçüldü.

**Eski testler** (yeni kodla):

| Test | Sonuç |
|---|---|
| Görev 39, 33a–h | Hepsi geçti |
| Görev 36 | Bir kez tek ayarda (390 · gece · normal, hoş geldin sihirbazı) piksel uyarısı verdi; tek başına yeniden çalıştırınca geçti (sihirbaz alttan açılan pencere değil, bu görevde değişmedi) |
| Görev 28 takvim (normal / Çok büyük), 28a, 31, tanıtım turu | Görev 40'la aynı, sorun yok |
| Görev 37 / 38 | Görev 40'la birebir aynı: bilinçli "görsel yazıya 8–12 pt yakın" kuralı (40.3) ve Görev 39'dan beri bilinen iki eski uyarı |
| Görev 40 | 40.7 dışında hepsi geçti (894 kontrol). 40.7 testi 41.1'de kalkan eski "Ödemenin tamamı alındı" kutusunu (`#o-tamam`) arıyor; yeni ödeme ekranını 41.1 testi kapsıyor |

## Ekran görüntüleri (chromium)

| Dosya | Ne gösteriyor |
|---|---|
| `411-odemeler-tam/eksik/fazla/hic-390-normal`, `411-odemeler-fazla-320-cokbuyuk` | Ödemeler: dört durum, dar ekran |
| `412-siradaki-bekliyor`, `-bekliyor-tam`, `-tam`, `-eksik`, `-hic`, `-fazla`, `-notr`, `-eksik-320-cokbuyuk` | Sıradaki kartı: beş durum (+ ödemesi alınmış bekleyen misafir, hiç ödenmemiş yerleşen misafir, dar ekran) |
| `412-ajanda-eksik` | Ajanda: "1.000 ₺ eksik" |
| `413-detay-nasil-yok` | Rezervasyon detayı, "Nasıl?" yok |
| `416-detay-yerlestirildi`, `416-duzenle-penceresi`, `416-emin-misiniz` | "Yerleştirildi · 11:45" + Düzenle, Düzenle penceresi, geri alma sorusu |
