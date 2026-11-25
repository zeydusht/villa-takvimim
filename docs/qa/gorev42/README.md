# Görev 42 — Büyük yazıda okunabilirlik (kelime bölünmez)

320 pt genişlik ve "Çok büyük" yazıda kelimeler harf harf alt alta diziliyordu ("Villa bilgileri" → V / i / l / l / a …).
Sebep: yazı sütunları `min-width:0` ile sıfıra kadar daralıyor, `overflow-wrap:anywhere` de kelimeyi istediği yerden bölüyordu.

## Ne değişti

- **42.1 Kelime bölünmez.** `overflow-wrap:anywhere` / `word-break:break-all` kaldırıldı (bağlantı, e-posta ve kod hariç).
  Yazı sütunu en az ≈ 8 harf (`--yazi-en-az: 8em`) ve en uzun kelimesinden dar olmaz.
- **42.2 Satır düzeni.** Satırlar kendi genişliğine göre düzen değiştirir (`flex-wrap`): sağdaki etiket ("Eksik · 4/7",
  "0 kişi", "Talep yok", tutar) sığmazsa başlığın altına, sola yaslı iner. İkon solda, ok sağda, dikey ortada. İkon kutusu
  36 pt; sayfa ve pencere kenar boşluğu büyük yazıda büyümez.
- **42.3 Özel ekranlar.**
  - Rezervasyon detayı: "3 gece · 2. geliş" kendi satırında; büyük yazıda "✕ Kapat" yerine yuvarlak × (`aria-label="Kapat"`).
  - Giriş / Çıkış dar yerde iki satır, tarih bölünmez.
  - Ödemeler kutuları dar yerde alt alta (etiket solda, tutar sağda).
  - Fiyatlar: üstteki iki kart dar yerde alt alta, ay adı bölünmez.
  - Fotoğraf kutuları dar yerde 2 sütun.
  - Villa kartı alt satırı iki satıra iner, tarih bölünmez.
  - Seçim paneli, Hangi villam boş, özellik çipleri, Gelir & gider kutuları, ipucu kartı ve misafir sayfası başlığı da düzeltildi.
- **42.4 Kalıcı test:** [`test/okunabilirlik.js`](test/okunabilirlik.js) (nasıl çalışır: [`test/README.md`](test/README.md)).
- **42.5:** bu rapor, `STIL.md` kuralı ("kelime bölünmez; dar yerde sağdaki öğe alta iner"), önce / sonra görüntüleri.

## Test sonucu (okunabilirlik testi, 43 ekran)

| Kod | Motor | kirik | dar | taşma |
|---|---|---|---|---|
| Görev 42 öncesi (efda0f4) | chromium 320 Çok büyük | 124 | 210 | 8 |
| Görev 42 sonrası | chromium 320 Çok büyük | **0** | **0** | **0** |
| Görev 42 sonrası | webkit 320 Çok büyük | **0** | **0** | **0** |

Daha önce (42.3'ün son birkaç düzeltmesinden önce) tam matris de çalıştırıldı: 320 ve 375 × Büyük ve Çok büyük × chromium ve
webkit, 344 ekran, 0 / 0 / 0. Süre uzun olduğu için son denetim chromium 320 Çok büyük ile yapıldı; webkit bir kez çalıştırıldı (111 sn).

390 pt ve normal yazıda görünüm değişmedi (Ödemeler üç kutu yan yana, Fiyatlar iki kart yan yana); elle bakıldı.

## Önce / sonra

[`once-sonra/`](once-sonra/): 320 pt, "Çok büyük" yazı, chromium. Solda Görev 42 öncesi, sağda sonrası.

- Villalarım: `villalarim-kartlar`, `villalarim-ipucu`
- Villa sayfası: `villa-ust`, `villa-siradaki`, `villa-yonetimi`, `villa-fotograflar`, `villa-kurulum`
- Kurulumu bitmemiş villa: `kurulum-ust`, `kurulum-yonetimi`, `kurulum-fotograflar`
- Rezervasyon: `rez-detay`, `odemeler`, `yeni-rez`, `secim-paneli`
- Fiyatlar: `fiyatlar`, `fiyatlar-aylar`
- Takvim: `ajanda-ust`, `ajanda-kartlar`
- `gelir-gider`
- Hesap: `hesap-ayarlar`, `hesap-yonetim`, `hesap-mfa`

## PM'in tanımından sapmalar

- **"dar" kuralı paragrafın son satırını saymıyor.** PM'in `TARA` kodunda (`rs.some`) herhangi bir satırın 3 harften dar olması
  yetiyordu; bu, uzun bir açıklamanın kısa son satırını da ("… tarih seçin.") hata sayıyordu. Tanımdaki "her satırı dar" ile
  uyumlu olsun diye son satır sayılmıyor. PM'in özgün kodu test dosyasında aynen duruyor. Yalnız son satırı kısa olanlar raporda
  ayrıca sayılıyor (`yalnizSonSatirKisa`, bilgi için; hata değil).
- **Yuvarlak × Kapat 48 pt** (görevde 44 pt): uygulamanın dokunma alanı kuralı en az 48 pt. Büyük yazıda bütün pencerelerde
  geçerli, yalnız rezervasyon detayında değil.
- **Yazıyla büyümeyen px değerleri:** ikon kutusu (36 pt), ok, sayfa / pencere kenar boşluğu, Kapat ×. Büyük yazıda yer yazıya
  kalsın diye (`STIL.md`, Birim).
