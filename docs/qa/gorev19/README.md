# Görev 19: test raporu

_Claude Code, 16 Kasım 2026._

## Nasıl test edildi

Uygulama Playwright ile yerel sunucuda açıldı, iki ekran boyutunda: 390×844 ve 360×740. Sunucu sahteydi: yazılan her kayıt yakalandı, gerçek veritabanına hiçbir şey gitmedi. Saat 16 Kasım 2026, 10:00 (Türkiye) olarak sabitlendi.

Dokunuşlar gerçekti: Playwright `touchscreen.tap` ile ekrandaki noktaya dokunuldu. Yani perdenin dışına düşen bir dokunuş gerçekten engellendi; delikten geçen dokunuş gerçekten alttaki düğmeye ulaştı. Sürükleme testleri Chrome'un dokunma olaylarıyla yapıldı (CDP `Input.dispatchTouchEvent`).

Her adımda iki şey yapıldı:

1. Ekran görüntüsü alındı.
2. Görev 18'deki otomatik denetim çalıştı. Denetim şunlara bakıyor:
   - yatay taşma,
   - kesik yazı,
   - üst üste binen düğmeler,
   - 48 px'ten küçük dokunma alanı.

## Sonuçlar

| Test | Ne denendi | Sonuç |
|---|---|---|
| `rehber/rez-*` | Rehber villa ekranındaki "+ Rezervasyon"dan başlatıldı. Adımlar: giriş günü → çıkış günü (form kendiliğinden açılır) → ücret → ad (yazınca "Tamam") → kişi (+) → telefon → kapora (açılınca alan büyür, yeniden kaydırılır) → kaydet → ✓. Ayrıca: perde dışına dokununca adım değişmez. Seçimi kaldırınca 1. adıma dönülür. | İki boyutta da 8/8 adım geçti. Kayıt sunucuya gitti (`POST rezervasyonlar`). |
| `rehber/teklif-*` | Teklif hapı → tarihler → fiyat (%10'a dokunuldu) → misafir adı → geçerlilik → mesaj → WhatsApp'ta gönder → ✓ | Geçti (`POST teklifler`). |
| `rehber/ops-*` | Opsiyon hapı → tarihler → ad → telefon → geçerlilik → kaydet → ✓ "Opsiyon süresi bitince kendiliğinden kalkar." | Geçti. |
| `rehber/fiyat-*` | "Fiyat gir" → bu aydan sonraki aylar vurgulu → Aralık → hafta içi 9.000 → hafta sonu 12.000 → kaydet → ✓ | Geçti (`POST fiyatlar`). |
| `rehber/paylas-*` | Paylaş → bağlantı açıklaması → "Bağlantıyı paylaş" → ✓. Testte telefonun paylaş menüsü olmadığı için bağlantı kopyalandı. | Geçti. |
| `rehber/odemeAl-*` | Bugün giren misafir → "Ödemeyi al ve misafiri yerleştir" → tutar → kaydet → "Misafiri yerleştirdiniz mi?" → Evet → ✓ | Geçti (ödeme ve yerleştirme yazıldı). |
| `rehber/odemeGir-*` | Rezervasyon → "Ödemeler" → hazır tutar → kaydet → ✓ | Geçti. |
| `rehber/gider-*` | Gelir & gider → "Gider ekle" → Temizlik → 1.500 → fiş → kaydet → ✓ | Geçti (`POST giderler`). |
| `rehber/bakici-*` | Hesap → "Villama bakıcı ekle" → villa seçimi → "Yeni bakıcı davet et" → kod → kopyala → ✓ | Geçti (`POST davetler`). |
| `rehber/drive-*` | "Fotoğraf ekle" → kaynak seçimi → Drive bağlantısı → "Fotoğrafları bul" | Adımlar doğru açıldı. Sahte sunucu Drive listesi döndürmediği için "Hepsini ekle" adımı denenemedi. |
| `rehber/sihirbaz-*` | Villa ekle → sihirbazın her adımında üstte küçük ipucu (perde yok) | Geçti. |
| `rehber/soru-*` | Gider rehberi 3. kez bitirildi → "Bu işlemi artık biliyor musunuz?" → Evet. Sonra "Gider ekle"ye yeniden basıldı. Ardından Hesap'ta "Kapatılan yardımları geri aç" görünür mü diye bakıldı. | Geçti. "Evet"ten sonra rehber çıkmadı; Hesap'ta "Kapatılan yardımları geri aç" görünüyor. |
| `rehber/kapali-*` | Yardımlı mod kapalıyken "+ Rezervasyon" | Rehber çıkmadı, işlem doğrudan açıldı. |
| `rehber/hesap-*` | Hesap → Yardım → "Yardımlı mod" anahtarı | Varsayılan açık görünüyor. |
| `rehber/en-*` | Aynı rehber İngilizce | Metinler İngilizce, vurgu korunuyor. |
| `rehber/klavye-*` | Ad adımında görünen alan 844 → 470 px'e indi (klavye açıldı gibi). Aynı test "Hareketi azalt" açıkken yapıldı. | Alan ve baloncuk görünen alanın içinde kaldı. Bkz. bulunan sorun 3. |
| `tur/*` | Uygulama turu (Hesap → turu tekrar göster) ve "Nasıl yapılır?" | İkisi de yeni motorla çalıştı. Turda alttaki panel yalnız gösteriliyor, dokununca form açılmıyor. Tur bitince seçim temizleniyor. |
| `surukle/*` | Aşağıdaki A, B, C | Hepsi geçti. |

Sürükleme testinin ayrıntısı (`surukle/*`):

- **A:** En üstteki villa 500 ms basılı tutuldu ve en alta sürüklendi. Yenileme göstergesinin görünürlüğü her karede ölçüldü ve hiç 0'ın üstüne çıkmadı. Sıra değişti (S, D, Z → D, Z, S). Bırakınca kilit kalktı.
- **B:** Basılı tutmadan hızlı aşağı çekildi. Normal yenileme çalıştı.
- **C:** Parmak 400 ms dolmadan kaydı. Sürükleme başlamadı.
- **Fotoğraf ızgarası:** İlk fotoğraf 3. sıraya sürüklendi. Sıra değişti, tam ekran görüntüleyici açılmadı.

Görev 18'in tarih seçimi testi (`qa18secim`, 40 durum) yeniden çalıştırıldı ve 40/40 geçti.

## Testte bulunup düzeltilenler

1. **Panel açılırken yanlış ölçüm.** Rehber, panel açılırken hedefi ölçüp kaydırdığı için ücret kartının üstü kesiliyordu. Artık hedef 3 kare boyunca yerinde durana kadar bekleniyor.
2. **360 px'te takvim sığmıyordu.** Takvim ve üstündeki hap sırası baloncukla birlikte sığmıyordu; 30 Kasım baloncuğun altında kaldı. Düzeltmeler:
   - Tarih adımlarında hap sırası gizleniyor.
   - Baloncuk alt menünün üstüne binebiliyor. Hedefin kendisi menünün altında kalmıyor.
3. **"Hareketi azalt" açıkken "İleri" çalışmıyordu.** Uygulamanın genel bir kuralı basılan öğelerin konum kaydırmasını sıfırlıyor. Baloncuk bu yüzden basılınca bir an yerinden kayıyor ve dokunuş perdeye düşüyordu. Baloncuğun konumu artık bu kuraldan etkilenmiyor.
4. **Klavye açılınca alan yarı gizli kalıyordu.** Görünen alan küçülünce hedef artık yeniden ekrana getiriliyor.
5. **Fiyatlar'da yanlış aylar vurgulanıyordu.** Ay karşılaştırması metin olarak yapılınca ("2026-2" > "2026-11") geçmiş aylar da vurgulanıyordu. Artık sayı olarak karşılaştırılıyor.
6. **Küçük dokunma alanları.** Teklifteki %5/%10/%15 düğmeleri ve ödemedeki "Henüz değil" 44 px idi; artık 48 px.

## Denenemeyenler

- Gerçek iPhone: klavye, titreşim, telefonun kendi paylaş menüsü.
- Drive'dan gerçek fotoğraf aktarımı (sahte sunucu Drive listesi döndürmüyor).
