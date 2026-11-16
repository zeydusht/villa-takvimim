# 20.8: Formlar karışmasın — panellerin gözden geçirilmesi

_Claude Code, 16 Kasım 2026._

Kural: rezervasyon formunda yalnız rezervasyon, teklif panelinde yalnız teklif, opsiyon panelinde yalnız opsiyon işlemleri olur. Birinden ötekine geçiş düğmesi yok; kullanıcı vazgeçer ve alttaki seçim panelinden diğerini seçer.

## Kaldırılan çapraz düğmeler

| Panel | Kaldırılan düğme | Neden |
|---|---|---|
| Rezervasyon formu (ücret kartının altı) | "Teklif olarak gönder" | Rezervasyon girerken teklif paneline atlıyordu. |
| Rezervasyon formu (teklif yetkisi olmayanlarda aynı yerde) | "Fiyatı mesajla gönder" | Aynı düğmenin teklif yetkisi olmayanlara görünen hâli. Rezervasyon formunda fiyat göndermek de ayrı bir işlem. |
| Villa sayfası paylaşım paneli ("Villa sayfanız hazır") | "Özel teklif oluştur" | Paylaşım panelinden tarihsiz bir teklif paneli açıyordu. Teklif artık yalnız takvimden (tarih seçip "Teklif") ya da üstteki "Teklif" hapından açılıyor. |

## Gözden geçirilip bırakılanlar

Bunlar bir formdan ötekine geçiş değil; aynı kaydın sonraki adımı ya da aynı panelin kendi işi.

| Panel | Düğme | Neden bırakıldı |
|---|---|---|
| Teklif panelinin kendisi | WhatsApp'ta gönder, Teklifi kopyala | Teklifin kendi işlemleri. |
| Opsiyon panelinin kendisi | Opsiyonu kaydet | Opsiyonun kendi işlemi. |
| Opsiyon ayrıntısı (kayıtlı opsiyon) | "Rezervasyona çevir" | Kesinleşen opsiyonun rezervasyona dönüşmesi; yeni bir form değil, aynı kaydın sonraki adımı. |
| Teklif ayrıntısı (kayıtlı teklif) | "Rezervasyona çevir" | Kabul edilen teklifin rezervasyona dönüşmesi; aynı gerekçe. |
| Rezervasyon ayrıntısı | Ara · WhatsApp · Ödemeler · Düzenle | Kayıtlı rezervasyonun kendi işlemleri. |
| Paylaşım paneli | Bağlantıyı paylaş/kopyala, Sayfayı önizle, Boş günleri paylaş, Yayından kaldır | Hepsi paylaşım işi. |

Test: `qa20.js capraz`. Rezervasyon formunda `#f-mesaj` yok, paylaşım panelinde "Özel teklif oluştur" yok. Kontrol iki boyutta da yapıldı.
