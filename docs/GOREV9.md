# Görev 9 — His ve hız (dokununca "oldu" hissi)

_Hazırlayan: Claude (ürün yöneticisi), 14 Kasım 2026. Kaynak: Zeyd'in gördüğü "20 Principles of UX & Animation" videosu. Listeden kullanıcılarımıza (yaşlı villa sahipleri) uyanlar seçildi._

## Önce oku
- Amaç gösteriş değil: **her dokunuşta "oldu" hissi** ve **hiç beklememe**. Hareket az, kısa ve anlamlı olsun.
- Kural: hiçbir hareket **300ms'den uzun olmasın**. Sık kullanılan şey neredeyse hiç hareket etmesin.
- Yazılar kalınlaştırılmaz, ortak çerçeveli stil korunur. Yeni metinleri `dil.js`'e ekle.
- Veritabanına dokunma.
- Maddeleri sırayla uygula; biten maddenin kutusunu `[x]` yap.

---

## A. Hız

- [x] **9.1 Süreler tek yerden.** `:root`'ta değişkenler: `--hiz-bas:100ms`, `--hiz-ac:220ms`, `--hiz-kapa:180ms`, `--hiz-ekran:200ms`. Açılışlar `ease-out`, kapanışlar `ease-in`. Dosyadaki tüm dağınık `transition` süreleri bunlara bağlansın.

- [x] **9.2 Beklemeden tepki.**
  - "Rezervasyonu kaydet", "Ödemeyi kaydet", gider/gelir ekle, fiyat kaydet: basınca panel **hemen** kapansın, ekran hemen güncellensin, buluta kayıt arkada gitsin. Kayıt başarısız olursa değişikliği geri al ve uyarı göster (mevcut senkron hatası akışı).
  - "Yükleniyor…" yazıları yerine 3 gri iskelet satır (yanıp sönen değil, sabit açık gri). Yükleme 400ms'den kısa sürerse iskelet hiç görünmesin.

## B. "Oldu" hissi

- [x] **9.3 Kaydetme onayı.**
  - Bildirim balonu (`bildir()`) aşağıdan 8px kayıp belirerek gelsin, 2,5 sn sonra solarak gitsin. Başarı mesajlarının başında ✓ olsun: "✓ Rezervasyon kaydedildi", "✓ 12.000 ₺ ödeme kaydedildi".
  - Değişen önemli rakam (ör. "12.000 ₺ alınacak" → "✓ Ödemenin tamamı alındı") 600ms açık yeşil zeminle bir kez vurgulansın. Sayarak değişen rakam animasyonu YOK (kafa karıştırır).

- [x] **9.4 Gerçek titreşim.** iPhone'da `navigator.vibrate` çalışmıyor. `@capacitor/haptics` ekle; `native.js`'te tek fonksiyon (`VTNative.titret(tur)`); app dışında (web) sessizce hiçbir şey yapmasın.
  - Başarılı kayıt → `notification success`
  - Hata / eksik alan → `notification warning`
  - Silme / iptal onayı → `impact medium`
  - Normal buton basışlarında titreşim YOK.
  - Hesap ekranına "Titreşim" aç/kapa (varsayılan açık, cihazda saklanır).

## C. Odak

- [x] **9.5 Paneller.** Alttan açılan paneller aşağıdan kayarak açılsın (`--hiz-ac`), arka plan aynı anda %40 kararsın. Kapanırken tersi (`--hiz-kapa`). Panel aşağı sürüklenerek de kapanabilsin (iPhone alışkanlığı); X butonu kalsın.

- [x] **9.6 Yeni ekleneni göster.** Yeni kaydedilen rezervasyon takvimde bir kez yumuşakça parlasın (600ms açık yeşil halka). Listelere eklenen yeni satır (ödeme, gider, rezervasyon) yukarıdan açılarak gelsin.

- [x] **9.7 Sihirbaz adımları.** Kurulum sihirbazında "İleri" ile yeni adım sağdan, "Geri" ile soldan 200ms kayarak gelsin. İlerleme çubuğu dolarak ilerlesin.

## D. Az ama yerinde

- [x] **9.8 Sık kullanılan = hareketsiz.** Alt menü sekmeleri, gün seçimi, aç-kapa düğmeleri: hareket yok, sadece renk/çerçeve değişimi. Takvimde ay değiştirme: en fazla 150ms solma; kayma yok.

- [x] **9.9 Hareketi azalt.** Telefonda "Hareketi Azalt" açıksa (`prefers-reduced-motion: reduce`) tüm kayma/büyüme hareketleri kapansın; sadece renk değişimleri kalsın.

## E. Kolay dokunma

- [x] **9.10 Büyük dokunma alanları.** Kullanıcılarımız yaşlı: tüm dokunulabilirler en az **48×48px** (şu an 44). Takvim günlerinde hücrenin tamamı dokunulabilir olsun.
  - Altı çizili küçük metin bağlantıları ("Şimdilik atla", "Gizle", "değiştir", "Seçimi temizle") çerçeveli küçük butona dönüşsün; ne olduğu görünsün.

---

## Bilerek YAPILMAYACAKLAR (videodaki ama bize uymayan)
Esneme-sıkışma (squash & stretch), eğri yollar (arcs), 3D, hareket öncesi geri çekilme (anticipation), zıplayan/yaylanan efektler. Yavaşlatır ve yaşlı kullanıcıyı şaşırtır.

## Bitince
1. `npx cap sync` (yeni haptics eklentisi için), commit, `git push`.
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Zeyd'e 5 maddede teknik olmayan dille yaz. Denemesi gerekenler: telefonda (APK veya iPhone) kayıt sonrası titreşim, panel açılıp kapanması ve aşağı kaydırarak kapatma, sihirbaz geçişleri.
