# Görev 39: bölüm başlıklarında çizgi ikon yerine 3D görsel — test raporu

_Claude Code, 24 Kasım 2026._ Veritabanı değişmedi, deploy edilmedi, Netlify'a yüklenmedi.

## Ne değişti

| Adım | Değişiklik |
|---|---|
| 39.1 | İçerik bölümü başlıkları `data-g3d` ile işaretlendi.<br>• Villa sayfası: Yaklaşan rezervasyonlar, Teklifler, Opsiyonlar, Villa yönetimi, Fotoğraflar.<br>• Gelir & gider: Alınacak ödemeler, Alınan ödemeler, Giderler, Diğer gelirler, Satış kanalları.<br>• Misafir kartı, iki yerde: Konaklamalar, Misafir notları.<br>Hesap'taki ayar başlıkları ve form etiketleri çizgi ikonla kaldı. |
| 39.2 | 8 yeni görsel çizildi: `bolum-opsiyon`, `-yonetim`, `-alinacak`, `-alinan`, `-gider`, `-gelir`, `-kanal`, `-not`.<br>• Her biri ayrı `codex exec` ile, "Ortak stil" birebir.<br>• Hepsi dekupe; `-512` ve `-256` içeriğe göre kırpılmış.<br>• İstekler `docs/CODEX_3D_GORSELLER_3.md` dosyasında. Sekizi de ilk denemede çıktı. |
| 39.3 | Başlık satırı: `[görsel] Başlık ……… [Tümünü gör]`.<br>• Görsel çizgi ikonun yerinde; yazı görselin dikey ortasında, arada 10 pt.<br>• Satır yüksekliği görsel kadar değil. Görsel üstüne / altına taşar; satırın altına taşma kadar boşluk eklenir, alttaki karta en az 8 pt kalır.<br>• Yer daralınca: dar ekranda, büyük yazıda ve yazı 56 pt'de iki satıra iniyorsa görsel 40 pt. Yine sığmazsa yazı iki satır olur, görsel ortada durur.<br>• Görsel yüklenemezse çizgi ikon kalır.<br>• Eski yapı (görsel yazının sağında) bu bölümlerde kalktı. |
| 39.4 | Boş bölümde başlıkta görsel yerine çizgi ikon var: aynı resim iki kere görünmüyor.<br>• Bölümde büyük boş hâl görseli ya da boş hâl çizimi (Fotoğraflar) görünüyorsa ikon gösteriliyor.<br>• Karar JS'te (`bolumGorselDurum`), `:has()` yok. DOM her değiştiğinde bir sonraki kareden önce yeniden veriliyor.<br>• Gelen öğe solarak geliyor (`--hiz-ac`). |

Görsel boyu (chromium; webkit aynı):

| Başlık | 320 | 390 | 430 | Büyük yazı |
|---|---|---|---|---|
| Yaklaşan rezervasyonlar, Alınacak ödemeler | 40 pt | 40 pt (56'da iki satıra iniyordu) | 56 pt | 40 pt |
| Diğer başlıklar | 40 pt | 56 pt | 56 pt | 40 pt |

## 39.5 Test

`qa39.js`, chromium ve webkit. **804 kontrol, hepsi geçti**; sayfa hatası 0.

**Durumlar:** 320 / 390 / 430 × normal / büyük yazı. Her durumda açılan ekranlar:

- villa sayfası, dolu: 9 rezervasyon, teklif, opsiyon, 4 fotoğraf;
- villa sayfası, boş: rezervasyon ve fotoğraf yok;
- Gelir & gider, dolu: ödemeler, gider, gelir, satış kanalları;
- Gelir & gider, boş: villada hiç kayıt yok, büyük boş hâl;
- Gelir & gider, kayıtsız: bölümler var ama dönemde kayıt yok, yalnız yazı;
- misafir kartı: iki konaklama ve not.

**Her başlık sayfa kaydırılarak ekranda ölçüldü** (192 ölçüm):

- **Hiza:** yazının dikey ortası ile görselin ortası arasındaki fark ±3 pt içinde. Ölçülen 0,5–0,8 pt; ara 9–10 pt.
- **36.7 kuralı:**
  - görselin dolu kısmı alttaki öğeden ≥ 8 pt uzak; ölçülen en az 17 pt;
  - üstteki öğeye değmiyor; ölçülen en az 15 pt.
- **Tek görsel:** çizgi ikon ile 3D görsel aynı anda görünmüyor; her başlıkta yalnız biri var.
- **Boş bölüm:**
  - Yaklaşan rezervasyonlar ve Fotoğraflar boşken başlıkta çizgi ikon var; bölümde tek görsel, o da boş hâlin görseli.
  - Görselli başlığın bölümünde hiç boş hâl görseli yok.
- **Boş ↔ dolu:** liste dolunca başlık bir sonraki karede görsele geçiyor, boşalınca ikona dönüyor.
  - Kaydırma olayı 0.
  - Görsel solarak geliyor: saydamlık ara değerlerden geçiyor.

**Ekran görüntüleri:**

- Bu klasörde, `<ekran>-<dolu|bos|kayitsiz>-<genişlik>-<normal|buyuk>.jpg`, 36 adet (chromium, tam sayfa; misafir kartında panel).
- Her birinde taşma ve üst üste binme denetlendi.

**Ters deneme:** aynı test 39.4'ten önceki kodla (39.3) chromium'da çalıştırıldı. İki boş bölümde de başlıkta görsel ile boş
hâl görseli birlikte çıktı ve test kırmızı oldu.

Ölçümde sabit alt menü ve açık panelin arkasındaki sayfa "alttaki öğe" sayılmıyor.

## Mevcut testler

| Test | Sonuç |
|---|---|
| Görev 38 (`qa38`, webkit + chromium, 306 kontrol) | hepsi geçti |
| Görev 36 matrisi | hepsi geçti |
| Görev 37 (`qa37`) | Görev 38'deki 34 bilinen fark aynen duruyor (38.2 ile bilerek değişen beklentiler); yeni hata yok |
| Görev 33 (33.1–33.8) | hepsi geçti |
| Görev 31f (iskelet) · Görev 31 turu · Görev 28 (60/60, Çok büyük) · Görev 28.1 yerleşim | Görev 38 ile fark yok |

Test dosyaları (scratchpad): `qa39.js` (yeni), `dolu39.json` (görsellerin dolu kısım kutuları).
