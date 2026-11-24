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
