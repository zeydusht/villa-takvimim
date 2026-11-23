# Görev 37 — Başlıkta önce görsel, etiket hizası, boş ekranda tek büyük görsel

Zeyd'in kararı:
- Her gün kullanılan sekmelerde başlık yazısı kalacak.
- Görsel yazının **önünde** (solunda) duracak.
- Büyük ve ortalı görsel yalnızca boş ekranlarda olacak.

**Kurallar:**
- Veritabanına dokunma.
- Deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.
- 36.7 yapıldıysa üstüne kur. Yapılmadıysa 36.7'nin 2. maddesini (görsel alttaki öğeye değmesin) de bu görevde yap. 36.7'nin 1. maddesinin yerine 37.2 geçer.

---

## 37.1 — Başlıkta önce görsel, sonra yazı

Villalarım, Takvim ve Hesap başlıklarında sıra şöyle olsun: `[görsel] Villalarım`.
- Görsel sayfanın sol kenarına yaslı dursun.
- Yazı görselin sağında, görselle aynı satırda ve dikeyde ortalı olsun.
- Aradaki boşluk 8–12 pt.
- Boyutlar 36.3'teki gibi kalsın: 88 pt, dar ekranda ve büyük yazıda 64 pt.
- Başlık satırı itilmesin. Görsel alttaki öğeye değmesin, en az 8 pt boşluk olsun.

**Kaydırma:** Kaydırınca başlığın küçülüp üst çubuğa girmesi (34.2, `baslikGuncelle`) bozulmasın. Görsel artık solda olduğu için sönerken yazının yerini kaydırmasın. Yazı zıplamadan üst çubuğa geçsin.

**Kapsam:** Bölüm başlıklarına (`.bolumGorsel`) ve misafir sayfasına dokunma. Orada solda zaten çizgi ikon var, görsel sağda kalacak.

**Uzun yazı:** 320 pt'de ve "Çok büyük" yazıda yazı sığmazsa önce görsel küçülsün, en az 48 pt'ye kadar. Yine sığmazsa görsel gizlensin. Yazı hiçbir zaman iki satıra bölünmesin.

## 37.2 — "1 dolu / 4 boş" etiketleri "Villa ekle" ile aynı satırda

Şu an etiketler başlığın altında, sağa kaymış duruyor.

Yeni düzen:
- "Villa ekle" düğmesi solda kalsın.
- Etiketler aynı satırda, satırın sağ ucunda dursun.
- Düğmeyle etiketler dikeyde ortalı olsun.

Satıra sığmazlarsa (320 pt, büyük yazı) etiketler alt satıra insin ve **sola yaslı** dursun. Sol kenarları "Villa ekle" düğmesiyle aynı hizada olsun. Hiçbir genişlikte sağda tek başına asılı kalmasınlar.

## 37.3 — Boş ekranda tek görsel

Ekranda büyük boş hâl görseli varken başlığın yanındaki küçük görseli gizle. Böylece aynı ekranda iki 3D görsel olmaz. Örnek: villa yokken Villalarım ekranı.

İlk villa eklenince başlık görseli geri gelsin. Yumuşak geçiş, `--hiz-*` değişkenleriyle.

Boş hâl düzeni:
- Görsel ortada, 160 pt'den 192 pt'ye büyüsün (`--g3d-bos`).
- Altında 16 pt boşluk olsun.
- Sonra kalın başlık ("Henüz villa eklemediniz."), sonra açıklama, sonra düğme gelsin.
- Hepsi ortalı.

Kısa ekranlı telefonda (yükseklik 640 pt'nin altı) görsel 144 pt'ye insin. Düğme ilk ekranda, kaydırmadan görünsün.

## 37.4 — Test

36.5 testini güncelle. Sıra kontrolü ekle:
- başlıkta görselin sağ kenarı yazının sol kenarından küçük olmalı;
- `.villaOzet` etiketleri (adı neyse) hiçbir genişlikte sağa yaslı ve tek başına durmamalı;
- boş ekranda görünür 3D görsel sayısı 1 olmalı.

Bu ekranların ekran görüntülerini al:
- Villalarım (dolu ve boş)
- Takvim
- Hesap

Genişlikler 320 / 390 / 430, açık ve gece, normal ve büyük yazı. Görüntüleri `docs/qa/gorev37/` klasörüne koy.

## 37.5 — Bitiş

- `docs/PROJE_DURUMU.md` dosyasına Görev 37'yi ekle.
- Mesajının en altına çok kısa özet yaz.
- Özetin altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
