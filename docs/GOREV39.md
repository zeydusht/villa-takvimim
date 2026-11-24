# Görev 39 — Bölüm başlıklarında çizgi ikon yerine 3D görsel

**Zeyd'in isteği:** Villa sayfasındaki "Yaklaşan rezervasyonlar" başlığının yanındaki 3D görseli çok beğendi. Şöyle olsun:

- Başlığın **başındaki çizgi ikon kalksın**, yerine o bölümün 3D görseli gelsin.
- Yazı görselin **dikey ortasıyla** aynı hizada dursun. Şu an yazı görselin alt kısmında kalıyor, görsel yazının yukarısında asılı duruyor.
- Bu, aşağıdaki bütün büyük bölüm başlıklarında aynı olsun.

**Kurallar:**
- Veritabanına dokunma.
- Deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.

---

## 39.1 — Kapsam: hangi başlıklar

**Değişecek başlıklar.** Bunlar içerik bölümleri, sahibi her gün bakıyor:

| Ekran | Başlık | Görsel |
|---|---|---|
| Villa sayfası | Yaklaşan rezervasyonlar | `takvim-bos` (var) |
| Villa sayfası | Teklifler | `teklif` (var) |
| Villa sayfası | Opsiyonlar | **yeni:** `bolum-opsiyon` (kum saati + takvim yaprağı) |
| Villa sayfası | Villa yönetimi | **yeni:** `bolum-yonetim` (küçük villa + anahtar + liste kâğıdı) |
| Villa sayfası | Fotoğraflar | `sh-foto` (var) |
| Gelir & gider | Alınacak ödemeler | **yeni:** `bolum-alinacak` (cüzdan + küçük saat) |
| Gelir & gider | Alınan ödemeler | **yeni:** `bolum-alinan` (cüzdan + yeşil tik) |
| Gelir & gider | Giderler | **yeni:** `bolum-gider` (kıvrık fiş + bozuk para) |
| Gelir & gider | Diğer gelirler | **yeni:** `bolum-gelir` (banknot destesi + yukarı ok) |
| Gelir & gider | Satış kanalları | **yeni:** `bolum-kanal` (üç yönlü tabela) |
| Misafir kartı | Konaklamalar, Misafir notları | `misafirler-bos` ve **yeni** `bolum-not` (not defteri + kalem) |

**Değişmeyecek başlıklar.** Çizgi ikon kalacak:
- Hesap sekmesindeki ayar başlıkları: Bildirimler, Titreşim, Güvenlik, Görünüm, Dil, Gizlilik, Yardım, Yönetim, Yönetici güvenliği. Ayar listesinde 9 tane 3D görsel art arda kalabalık ve çocuksu durur. Ayarlar sade kalacak.
- Form içindeki küçük etiketler: "E-posta", "Giriş", "Mesaj" gibi.

## 39.2 — Yeni görseller

Yeni görselleri `docs/CODEX_3D_GORSELLER.md` dosyasındaki **"Ortak stil"** paragrafıyla, eskisiyle aynı yöntemle çizdir (`codex exec`).
- Hepsi dekupe olsun: şeffaf arka plan, zemin dairesi yok, yazı yok.
- Her biri için `-512.webp` ve `-256.webp` üret. 36'daki gibi içeriğe göre kırp, hepsi aynı görsel ağırlıkta dursun.
- İstekleri `docs/CODEX_3D_GORSELLER_3.md` dosyasına yaz.
- Bir görsel olmazsa o başlıkta çizgi ikon kalsın, iş durmasın.

## 39.3 — Yerleşim

Yeni başlık satırı: `[3D görsel 56 pt] [Başlık yazısı] ...boşluk... [Tümünü gör]`

- Görsel çizgi ikonun yerinde, sol kenara yaslı dursun. Çizgi ikon (`data-iki`) bu başlıklarda çizilmesin.
- Yazı görselin dikey ortasına hizalansın (`align-items:center`). `.bolumSatir` şu an `align-items:baseline`, bu başlıklarda `center` olsun.
- Görsel ile yazı arası 10 pt olsun.
- Satır yüksekliği görsel kadar olmasın. Görsel yukarı ve aşağı taşabilir (negatif margin, 36.4 mantığı), ama:
  - altındaki karta en az 8 pt boşluk kalsın;
  - üstündeki bölüme değmesin.
- "Tümünü gör" sağda kalsın ve yazıyla aynı hizada dursun.
- Dar ekran ve büyük yazı: önce görsel küçülsün (56 → 40 pt). Yazı yine sığmazsa iki satıra inebilir, görsel o zaman iki satırın ortasında dursun.
- Eski yapıda görsel yazının **sağında** duruyordu (`bolum3d`, `insertAdjacentHTML afterend`). O yapı kalkacak; görsel artık başta duracak.

## 39.4 — Boş bölüm: iki görsel olmasın

Bir bölüm boşken o bölümde büyük boş hâl görseli çıkıyor. Örnek: hiç rezervasyon yokken "Yaklaşan rezervasyonlar".
- Bu durumda başlıkta 3D görsel olmasın, **çizgi ikon** geri gelsin. Aynı resim iki kere görünmesin.
- Bu karar 38.1'deki gibi **JS'te** verilsin. `:has()` kullanma, iOS Safari'de geç güncelleniyor.
- Liste dolunca ya da boşalınca başlık hemen doğru hâle geçsin. Yumuşak geçiş olsun, kaydırmaya bağlı olmasın.

## 39.5 — Test

- Değişen bütün başlıkların ekran görüntüsünü al:
  - genişlikler: 320 / 390 / 430;
  - normal ve büyük yazı;
  - her bölüm hem dolu hem boş.

  Görüntüleri `docs/qa/gorev39/` klasörüne koy.
- Otomatik kontroller:
  - Başlık yazısının dikey ortası ile görselin dikey ortası arasındaki fark en fazla ±3 pt olsun.
  - Görsel alttaki karta değmesin (36.7 kuralı).
  - Boş bölümde ekranda o bölüm için tek görsel olsun.
  - Çizgi ikon ile 3D görsel aynı anda görünmesin.
- **webkit** ile de çalıştır.

## 39.6 — Bitiş

- `docs/PROJE_DURUMU.md` dosyasına Görev 39'u ekle.
- Mesajının en altına çok kısa özet yaz.
- Özetin altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
