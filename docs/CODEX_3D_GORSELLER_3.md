# Codex'e çizdirilecek 3D görseller — 3. set (Görev 39: bölüm başlıkları)

İlk iki setle aynı yöntem: "Ortak stil" paragrafı `docs/CODEX_3D_GORSELLER.md`'den **birebir** kopyalanır, her görsel için ayrı
`codex exec` çalıştırılır. Şeffaf PNG `www/img/3d/<ad>.png` olarak kaydedilir.

- **Kesim:** görsel dekupe olmalı; şeffaf arka plan, zemin dairesi yok, yazı yok.
- **WebP:** `<ad>-512.webp` ve `<ad>-256.webp`. İkisi de içeriğe göre kırpılmış kare (Görev 36'daki başlık görselleri gibi),
  böylece bütün bölüm görselleri aynı ağırlıkta durur.
- **PNG'ler repoya eklenmez.**

Bu görseller bölüm başlığının başında, yazının solunda küçük (56 pt, dar ekranda 40 pt) durur. Bu yüzden her biri tek ve tok
bir nesne grubu olmalı; küçükte de okunmalı, ince ayrıntı olmamalı.

Ortak stilin ardına eklenen not (her istekte aynı):

> Keep it consistent with the rest of the set: same matte clay material, same top-left warm light, same soft contact shadow,
> isometric three-quarter view from slightly above. It will be shown small (about 56 px) as a section icon, so use one compact,
> chunky object group with bold simple shapes and no fine details, filling about 80% of the square. No ground disc, no background
> shape behind the object.

## Set

| Dosya | Nerede | Tarif |
|---|---|---|
| `bolum-opsiyon.png` | Villa sayfası: Opsiyonlar | A chunky hourglass with lime-green sand standing next to a small desk calendar page, slightly leaning on it. |
| `bolum-yonetim.png` | Villa sayfası: Villa yönetimi | A tiny white flat-roof villa with a golden key leaning against it and a small checklist paper with three green ticks beside it. |
| `bolum-alinacak.png` | Gelir & gider: Alınacak ödemeler | A chunky deep-green wallet with a small round sand-colored clock leaning on its front. |
| `bolum-alinan.png` | Gelir & gider: Alınan ödemeler | A chunky deep-green wallet with a round lime-green check-mark bubble floating just above it. |
| `bolum-gider.png` | Gelir & gider: Giderler | A curled paper receipt with a few gold coins lying in front of it. |
| `bolum-gelir.png` | Gelir & gider: Diğer gelirler | A small neat stack of mint-green banknotes with a chunky lime-green arrow pointing up above it. |
| `bolum-kanal.png` | Gelir & gider: Satış kanalları | A wooden signpost with three chunky arrow signs pointing in different directions (green, turquoise, terracotta), blank signs, standing on a small tuft of grass. |
| `bolum-not.png` | Misafir kartı: Misafir notları | A small spiral notebook in mint with a chunky terracotta pencil lying diagonally across it. |

## Görev 40.2 eki

Eski `teklif` görseli (ev + kâğıt uçak) "teklif" ile bağdaşmıyordu. Yerine `bolum-teklif` çizildi; "Teklifler" başlığında, boş hâlinde
ve teklif sihirbazında kullanılır. Misafir sayfasındaki `misafir-teklif` değişmedi. Aynı ortak stil, aynı ek not.

| Dosya | Nerede | Tarif |
|---|---|---|
| `bolum-teklif.png` | Villa sayfası: Teklifler (başlık, boş hâl, teklif sihirbazı) | An open mint-green envelope with a chunky lime-green price tag sliding out of it, the tag showing one big bold white percent sign, and a small desk calendar page standing beside the envelope. Meaning: a date and price offer sent to a guest. |

Var olan görsellerle eşlenen başlıklar (yeni çizim yok):

| Başlık | Görsel |
|---|---|
| Yaklaşan rezervasyonlar | `takvim-bos` |
| Teklifler | `teklif` (Görev 40.2'den beri `bolum-teklif`) |
| Fotoğraflar | `sh-foto` |
| Misafir kartı: Konaklamalar | `misafirler-bos` |

## Görev 44.3 eki: Villalar ve Hesap başlık görselleri yeniden

Eski `baslik-villalar` (iki villa, havuz, saksılar, şezlonglar) küçükte kalabalıktı; `baslik-hesap` (anahtarlık) dikey ve havada asılı
duruyordu (içerik oranı 0,95). Referans: Takvim başlık görseli (`baslik-takvim`: takvim + valiz) ve `takvim-bos` (takvim + güneş
gözlüğü + güneş): az sayıda büyük, tombul parça, yere oturan, yatay.

Aynı yöntem: "Ortak stil" paragrafı `docs/CODEX_3D_GORSELLER.md`'den birebir, ardından aşağıdaki kompozisyon notu ve tarif. Her görsel
için 3 aday (`-a`, `-b`, `-c`) ayrı `codex exec` ile çizildi; adaylar `www/img/3d/aday/` klasöründe (webp). En iyisi uygulamada.

Ortak stilin ardına eklenen not (her istekte aynı):

> Composition must be wide and grounded: overall visible content about 1.3 times wider than tall, all objects resting on an invisible floor with one soft contact shadow, like a still life on a table. Same chunky clay style, camera angle and proportions as a desk calendar with a small suitcase next to it. Few large simple shapes, very little fine detail, readable at 64 px.

| Dosya | Nerede | Tarif |
|---|---|---|
| `baslik-villalar.png` | Villalarım sekme başlığı | One single chunky Mediterranean villa: cream walls, soft terracotta roof, deep green door and shutters, only a few windows, no ornaments. A small turquoise pool in front on the right, one round olive tree in a pot on the left. Everything sits on one low, rounded sand-colored base slab. |
| `baslik-hesap.png` | Hesap sekme başlığı | Three pieces lying on a table, horizontal composition: a deep-green leather key fob lying flat, a cream house-shaped key attached to it with a gold ring, also lying down, and beside them a small upright rounded cream profile card showing a simple green faceless person silhouette, no text. The key and fob lie on the table, they do not hang vertically. |

**Sonuç (Görev 44.3):**

- **`baslik-hesap`:** a, b, c çizildi. Seçilen **a**: içerik oranı 1,38; anahtar ev biçimli ve yatık. b 1,41 ve c 1,58 sınırı aşıyor.
- **`baslik-villalar`, ilk tur:** a, b, c çok genişti (oran 1,50 / 1,44 / 1,72; havuz ve zemin yana yayılıyor).
- **`baslik-villalar`, ikinci tur:** d, e, f. Tarifin sonuna şu eklendi:
  > Keep the whole group compact: the villa is two storeys tall, the pool is small and tucked close in front of it, the base slab is only slightly wider than the house, so the overall visible content (including the soft shadow) is about 1.3 times wider than tall, not more.

  Oranlar 1,23 / 1,31 / 1,36. Seçilen **e**: oranı Takvim'le (1,30) aynı, pencere az.
- **Adaylar:** `www/img/3d/aday/<ad>-<harf>-512.webp` ve `-256.webp`. Başka biri seçilirse dosya adı değiştirilerek kullanılır.
  Başlıktaki `--ust` / `--alt` / `--sol` değerleri görselin şeffaf paylarına göre yeniden ölçülmeli.
- **Karşılaştırma:** `docs/qa/gorev44/secim-villalar.jpg`, `secim-hesap.jpg`.
