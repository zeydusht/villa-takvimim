# Görev 41 — Ödeme durumu tek bakışta, Sıradaki kartının rengi, alttan açılan pencerelerin kayması

Zeyd telefonda denedi, bunlar çıktı.

**Kurallar:**
- Veritabanına dokunma.
- Deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.

---

## 41.1 — Ödemeler: tek bakışta tam mı, eksik mi, fazla mı

Ekran görüntüsü: Alınacak 13.000 · Alınan 28.000 · "Fazla alındı 15.000" mavimsi kutuda. Altında yeşil "✓ Ödemenin tamamı alındı" yazıyor. Fazla ödeme varken "tamamı alındı" demek yanlış.

**Üstteki üç kutu:**
1. "Alınacak" yazısı **"Alınması gereken"** olsun. Kutu nötr (gri) kalsın.
2. "Alınan" kutusunun içi **açık yeşil** zemin olsun, yazısı koyu yeşil. Şu an sadece rakam yeşil, kutu gri; kutunun kendisi de yeşil olsun.
3. Üçüncü kutu:
   - Kalan varsa: açık kırmızı zemin, koyu kırmızı "Kalan · 1.000 ₺".
   - Fazla alındıysa: açık kırmızı zemin, koyu kırmızı "Fazla alındı · 15.000 ₺". Mavi olmasın.
   - Tam alındıysa: açık yeşil zemin, "Kalan · 0 ₺" ve yanında ✓.

**Listenin altındaki durum satırı** tek cümle olsun, ikon ve renkle:
- **Tam:** yeşil "✓ Ödemenin tamamı alındı"
- **Eksik:** kırmızı "1.000 ₺ eksik · alınması gerekiyor". Altında "Yeni ödeme" kutusu, içinde kalan tutar hazır.
- **Fazla:** kırmızı "⚠ 15.000 ₺ fazla alındı". Altında küçük açıklama: "Yanlış girilen bir ödeme varsa üstteki listeden dokunup düzeltin ya da silin."
  - Bu durumda "Ödemenin tamamı alındı" **yazmasın**.
  - "Ek ödeme ekle" düğmesi görünmesin.
- **Hiç alınmadı:** kırmızı "Henüz ödeme alınmadı". Altında "Yeni ödeme" kutusu, içinde toplam hazır.

Renkler uygulamanın mevcut yeşil/kırmızı tokenlerinden gelsin. Kontrast en az 4.5:1 olsun.

## 41.2 — "Sıradaki" kartının rengi ödeme ve yerleştirme durumunu söylesin

Villa sayfasındaki SIRADAKİ kartı şu an her durumda açık yeşil. Zeyd tek bakışta durumu görmek istiyor. Kırmızı alarm gibi durur ve çıkış kırmızısıyla karışır, o yüzden "bekliyor" hâli için sarı kullanıyoruz.

| Durum | Kart |
|---|---|
| Misafir gelmedi (henüz yerleştirilmedi) | **açık sarı/amber** zemin, amber kenar. "13.000 ₺ alınacak" satırı kırmızı kalsın. |
| Yerleştirildi, ödeme **tam** | **açık yeşil** zemin, "✓ Yerleşti · ödeme tamam" |
| Yerleştirildi, ödeme **eksik ya da hiç alınmadı** | **açık kırmızı** zemin, "Yerleşti · 1.000 ₺ eksik" |
| Fazla alındı | açık kırmızı, "Yerleşti · 15.000 ₺ fazla alındı" |
| Sıradaki olay **çıkış** | nötr (gri-yeşil), şimdiki gibi |

- Renk tek başına anlam taşımasın, yazı ve ikon da durumu söylesin.
- Aynı mantığı Ajanda kartlarındaki ödeme satırında da kullan, tutarlı olsun.

## 41.3 — Rezervasyon detayında "Nasıl?" düğmesi olmasın

- Sıradaki kartına ya da bir rezervasyona dokununca açılan detay penceresindeki "? Nasıl?" hapını kaldır. Örnek ekranda "Hasan Demir" başlığının altındaki hap.
- Rehber başka yerlerde aynen kalsın.
- Bu pencerede rehberin bir adımı varsa rehberi başka bir yerden açılacak şekilde bırak ya da adımı kaldır. Kırık adım kalmasın.

## 41.4 — Alttan açılan pencereler: dışarı kayma olmasın

Zeyd'in gördükleri:
- Rezervasyon detayında aşağı kaydırınca pencerenin altında boşluk açılıyor, arkadaki sayfa görünüyor.
- "Düzenle" ekranında da aynısı oluyor.
- Pencere parmakla **sağa sola** da kayabiliyor.

Düzeltme, bütün `perde()` / `.overlay .sheet` pencereleri için:
- **Yatay kayma olmasın:** `overflow-x: hidden`, içerik genişliği pencereyi aşmasın. Hangi öğe taşırıyorsa onu bul ve düzelt; tablo, uzun yazı, takvim şeridi olabilir.
- **İç kaydırma dışarı taşmasın:** `overscroll-behavior: contain`. iOS'taki lastik efekti pencerenin altında boşluk açmasın, pencere zemini aşağı doğru dolu görünsün.
- **Arka sayfa kaymasın:** Pencere açıkken arkadaki sayfa kaydırılamasın (body kilidi zaten varsa iOS'ta da çalıştığını doğrula).

**Test:** webkit, iPhone boyutu. Rezervasyon detayı, Rezervasyonu düzenle ve Ödemeler pencerelerinde aşağı/yukarı ve sağa/sola sürükle. Arkadaki sayfa ve boşluk hiç görünmesin, `scrollLeft` hep 0 kalsın.

## 41.5 — Aşağı çekince pencere kapansın

- Pencerenin içeriği **en üstteyken** parmakla aşağı çekilirse pencere parmağı takip ederek aşağı insin. Bırakınca:
  - pencere yüksekliğinin %25'inden fazla çekildiyse ya da hızlı bir fiske atıldıysa kapansın ("Kapat" ile aynı);
  - değilse yaylanarak yerine dönsün.
- İçerik aşağı kaydırılmışken önce içerik kaysın; en üste gelince çekme pencereyi indirsin. iOS'taki gibi.
- **Yarım kalan form:** 40.6'daki gibi kapatmadan önce "Değişiklikler kaydedilmedi. Çıkılsın mı?" diye sorsun.
- Takvim şeridi ve kaydırılabilir alanlar içindeki yatay hareketleri bozmasın. Sadece dikey, aşağı doğru hareket sayılsın.
- Rehber adımı gösterilirken çalışmasın.
- `prefers-reduced-motion` açıksa pencere parmağı takip etmesin, kapanma animasyonu çok kısa olsun.

## 41.6 — "Yerleştirildi" satırında "Geri al" yerine "Düzenle"

- Rezervasyon detayının en üstünde "Yerleştirildi · 11:45" satırı ve yanında "Geri al" var (`ak-gGeri`).
- **"Geri al" kalksın.** Yerine satırın **sağ ucuna yaslı** "Düzenle" düğmesi gelsin.
- "Düzenle"ye basınca küçük bir pencere açılsın:
  - **Yerleştirme saati:** saati değiştirebilsin. Örneğin 11:45 → 16:20.
  - **"Yerleştirmeyi geri al":** kırmızı yazı. Basınca "Emin misiniz?" diye sorsun, sonra şimdiki geri alma işini yapsın.
- Aynı şeyi "Çıktı · 10:05" satırı için de yap: "Düzenle" → çıkış saati ya da "Çıkışı geri al".

## 41.7 — Test ve bitiş

- Ekran görüntülerini `docs/qa/gorev41/` klasörüne koy:
  - Ödemeler: tam / eksik / fazla / hiç;
  - Sıradaki kartı: 5 durum;
  - detay penceresi (Nasıl? yok);
  - Düzenle penceresi.
- Testleri chromium ve **webkit** ile çalıştır.
- 41.4 ve 41.5 için otomatik test yaz:
  - yatay kayma 0 olmalı;
  - en üstte aşağı çekince pencere kapanmalı;
  - ortadayken çekince içerik kaymalı.
- `docs/PROJE_DURUMU.md` dosyasına Görev 41'i ekle.
- Mesajının en altına çok kısa özet yaz, altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
