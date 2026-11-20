# 33.3: dış satıştan açılan form ile normal "Rezervasyon" formu

iPhone SE (375 × 667) ve iPhone 15 (393 × 852), Normal ve Büyük yazı. Her durum için iki form, panelin üstü (`-ust`) ve altı (`-alt`).
Normal form 17–20 Kasım, dış satış 25–28 Kasım (Airbnb): aynı ay, 3 gece, aynı gecelik fiyat, yani tarih satırı aynı uzunlukta.

## Önce (`once-…`, Görev 32 sürümü)

"Misafir bilgisi ekle" sunucuda hemen "Airbnb misafiri" adlı bir rezervasyon oluşturup **düzenleme formunu** açıyordu. Bu form
normal formdan tamamen farklıydı: tarih alanları, "Kaç kişi" kutusu, iki sütunlu "Geceler toplamı (₺)" / "Kısa konaklama ücreti"
alanları (₺ etiketi ve kutular kayık), "Kapora aldım" ve ücret kartı yok, başlık iki satır. Ölçümde 38–40 öğe farklı.

## Sonra (`sonra-…`)

Dış satıştan açılan form artık normal formun kendisi. Normal formdaki "Bu tarihler 10 dk sizin için ayrıldı" hapının yerinde aynı
boyda kilit hapı ("Tarihler Airbnb'deki satıştan"): Büyük yazıda öteki hap iki satıra indiğinde bu da aynı boyda kalır.

Ölçüm (`qa33c.js`): başlık, ücret kartındaki her satır, tutarlar ve "₺"nin satır sayısı / sağ kenarı, "Değiştir" düğmeleri,
ad / telefon / not alanları, kişi sayacı, kapora anahtarı, Kaydet düğmesi; panelin üstüne göre x, y, genişlik, yükseklik.

| Durum | Farklı öğe |
|---|---|
| SE · Normal | 0 |
| SE · Büyük | 0 |
| iPhone 15 · Normal | 0 |
| iPhone 15 · Büyük | 0 |

33.5'ten sonra iki formda da adın altında aynı "Nereden geldi?" satırı var (dış satış formunda site seçili ve kilitli); satır aynı
yerde, aynı boyda. Satırın içindeki haplar karşılaştırmaya katılmaz: Büyük yazıda seçili site ekranın dışında kalıyorsa satır onu
gösterecek kadar kayar. Görüntüler 33.5'ten sonraki koddan.
