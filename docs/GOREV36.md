# Görev 36 — 3D görsel cilası (daire, boyut, hiza)

**Sorun (Zeyd'in gözünden):** Başlıkların yanındaki 3D görseller garip duruyor. Çok küçükler, ne olduğu anlaşılmıyor. Telefon karanlık moddayken görselin arkasında gri bir daire çıkıyor.

**Neden:** Görsellerin hepsi dekupe, yani arka planı şeffaf webp. Daireyi CSS çiziyor (`prefers-color-scheme: dark` kuralı). Uygulama her zaman açık renkli olduğu için bu kurala hiç gerek yok.

**Zaten yapılanlar (commit a477282):**
- `index.html` içindeki karanlık mod daire kuralları kaldırıldı.
- `--baslik-gorsel` 88px, `--baslik-gorsel-kucuk` 64px oldu.
- `.bolumGorsel` 3.5rem (56px) oldu.

Bu görev geri kalanını bitirir ve hepsini tek tek kontrol eder.

**Kurallar:**
- Veritabanına dokunma.
- Edge Function deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.

---

## 36.1 — Misafir sayfasındaki daireyi kaldır

`www/g.html` satır ~279'daki kuralı sil:

```css
@media (prefers-color-scheme: dark){ .g3d{background:var(--soft);border-radius:99px} }
```

Misafir sayfası da her zaman açık renkli kalmalı. `index.html` satır 128'deki gibi `html,body{background:#fff}` kuralı g.html'de de varsa sorun yok. Yoksa ekle.

`.g3d` boyutunu 4rem'den 5rem'e (80px) çıkar. Bölüm başlığındaki negatif margin'i, başlık satırının yüksekliği değişmeyecek şekilde ayarla.

## 36.2 — Bütün 3D görsellerde "arka plan yok" taraması

Şu sınıfların hiçbirinde, hiçbir durumda görselin arkasında renk, daire, kare, kenarlık ya da gölge olmayacak:
- `.baslikG`
- `.bolumGorsel`
- `.bosGorsel`
- `.secKartGorsel`
- `.cizim3d`
- `.g3d`
- sihirbazdaki 3D görseller

Bu durumların hepsine bak: karanlık mod, `body.koyu`, büyük yazı, `:hover`, `:active`, seçili kart.

**İstisna:** `.bosGorsel.yok`. Bu, görsel yüklenemeyince ikon gösteren yedek hâl, orada daire kalabilir.

`drop-shadow` filtresi varsa kaldır. Görsellerin kendi gölgeleri zaten var, ikinci gölge kirli görünür.

## 36.3 — Boyutları tek yerden yönet

`:root` içinde tek bir boyut tablosu olsun. Bütün görseller boyutunu buradan alsın, dağınık rem/px değerleri kalmasın:

| Değişken | Yer | Boyut |
|---|---|---|
| `--g3d-baslik` | Villalarım / Takvim / Hesap başlığı | 88px (dar ekran ve büyük yazıda 64px) |
| `--g3d-bolum` | bölüm başlıkları | 56px |
| `--g3d-kart` | seçim kartları (`.secKart`) | en az 64px |
| `--g3d-bos` | boş hâl | 160px |
| `--g3d-misafir` | misafir sayfası bölüm başlıkları | 80px |

**Ekran yoğunluğu:**
- 88px ve üstü görünen her yerde `-512.webp` kullan. `-256` bu boyutta 3x ekranda bulanık kalıyor.
- Daha küçüklerde `-256` yeter.
- Mümkünse `srcset` ile ikisini birden ver.

## 36.4 — Hiza ve taşma

- Başlık yazısı ile görsel dikeyde ortalı olsun. Aralarında en az 8px boşluk olsun.
- Görsel büyüdü diye başlık satırı aşağı itilmesin. Görsel başlığın üstüne/altına taşabilir (negatif margin), ama altındaki içerik yerinden oynamasın.
- 320px genişlikte "Villalarım" başlığı iki satıra kırılmasın, görselle üst üste binmesin.
- Kaydırınca başlık küçülüyor (`baslikGuncelle`, 34.2). O sırada görsel de birlikte küçülsün ya da sönükleşsin. Yarım kesik kalmasın.
- Görsel yüklenmeden önce de yeri ayrılmış olsun (width/height veya aspect-ratio). Sayfa açılırken hiçbir şey zıplamasın.

## 36.5 — Test ve ekran görüntüleri

Playwright ile şu ekranların görüntüsünü al:
- Villalarım (boş ve dolu)
- Takvim
- Hesap
- Arama adımları
- Villa ekleme sihirbazı
- Boş hâller
- Misafir sayfası (`g.html`: başlık bölümleri, "Kaç kişi geliyorsunuz?" kutusu, teklif şeridi)

Her biri için:
- genişlikler: 320, 390 ve 430
- hem açık hem `colorScheme: 'dark'`
- normal yazı ve büyük yazı

Görüntüleri `docs/qa/gorev36/` klasörüne koy.

**Otomatik kontrol:** her 3D görselin dört köşesinden içeriye 4px'teki piksel, görselin hemen dışındaki sayfa arka planıyla aynı renkte olmalı (tolerans ±6). Farklıysa test kırmızı olsun. Bu test dairenin bir daha geri gelmesini engeller.

## 36.6 — Bitiş

- `docs/PROJE_DURUMU.md` dosyasına Görev 36'yı ekle.
- Mesajının en altına çok kısa bir özet yaz: ne değişti, 2–3 madde.
- Özetin altına test linkini koy: https://zeydusht.github.io/villa-takvimim/

---

## 36.7 — Ekran görüntülerinde gördüğüm iki küçük kusur (PM kontrolü)

`docs/qa/gorev36/uygulama/*-390-*` görüntülerine baktım. Daire yok, boyutlar iyi. İki şey kaldı:

1. **Villalarım: "1 dolu / 4 boş" etiketleri sağa kaymış.**
   - Başlığın altında sağda duruyorlar, boşlukta asılı gibi görünüyorlar.
   - Sola yaslı olsunlar: sol kenarları "Villalarım" yazısı ve "Villa ekle" düğmesiyle aynı hizada.
   - 320 ve büyük yazıda da öyle.
2. **Görsel alttaki öğeye değiyor.**
   - Takvim sekmesinde takvim görselinin alt kenarı "Ajanda" düğmesine biniyor.
   - Hesap sekmesinde anahtar görseli "Hesabım" kartının üst çizgisine biniyor.
   - Görsel yukarı taşabilir, ama görselin dolu (şeffaf olmayan) kısmı ile altındaki öğe arasında en az 8 pt boşluk kalsın.
   - Gerekirse görseli biraz yukarı al. Başlık satırı yine itilmesin.

**Test:** 36.5 testine bir kural daha ekle. Her 3D görselin şeffaf olmayan kısmının kutusu (`alfa36.json` ile hesaplanır), hemen altındaki görünür öğenin kutusuyla kesişmesin. Arada en az 8 pt boşluk olsun. Değiyorsa test kırmızı olsun.

Bitince yine en altta çok kısa özet + test linki.
