# Görev 28: test raporu

_Claude Code, 17 Kasım 2026._

Ortam: Playwright, sabit saat 16 Kasım 2026, Görev 27'nin 5 villalı sahte verisi. Yardımlı mod açık, gerçek dokunuşlar (touchscreen.tap). Betikler (scratchpad): `qa28a.js`, `qa28rep.js`, `qa28test.js`, `qa28villa.js`.

## 28.1 Villalarım başlık satırı (`baslik/`)

Büyüteç düğmesi kaldırıldı; HTML Görev 18.15/26'daki satırla birebir aynı. Başlık ile etiketler arası .75rem → .5rem oldu, çünkü 360'ta "1 dolu · 4 boş" rakam genişliği yüzünden 2 px farkla alt satıra iniyordu.

| Boyut | Normal | Çok büyük |
|---|---|---|
| 360 | "Villalarım" + etiketler tek satır, sağa yaslı; "+ Villa ekle" altında; taşma yok | etiketler alt satırda (26.7 kuralı: sığmazsa alt satıra); taşma yok |
| 390 | aynı | aynı |
| 430 | aynı | aynı |

## 28.2 Rehber açıkken eski seçim takılı kalıyordu

Sebep: [`sebep.md`](sebep.md). Önce / sonra görselleri `hata-once/` ve `hata-sonra/` klasörlerinde.

| Adım (aynı senaryo) | Önce | Sonra |
|---|---|---|
| Tekrar açılış | 17–21 seçili, rehber "Boş villaları göster" | seçim boş, rehber "giriş gününe dokunun" |
| 24'e dokun | değişmiyor (dokunuş yutuluyor) | "Giriş: 24 Kasım · şimdi çıkış gününe dokunun." |
| 26'ya dokun | değişmiyor | 24 → 26, rehber "Boş villaları göster" |
| 27'ye dokun | değişmiyor | aralık temizlendi, rehber 1. adıma döndü (18.1) |

### Testler (`test/`, `cokbuyuk/test/`)

360, 390, 430 ve 390×664 (küçük iPhone); Normal ve Çok büyük yazı. Sonuç: 8 × 15/15.

| Kontrol | Sonuç |
|---|---|
| Çıkış adımı metni girişi gösteriyor ("Giriş: 17 Kasım · şimdi çıkış gününe dokunun.") | ✓ |
| Rehberli arama → panel kapat → ana ekran → Takvim → tekrar aç: seçim boş, kişi sayısı boş, rehber 1. adımda | ✓ |
| "Son arama: 17–21 Kasım · tekrar ara" bağlantısı görünüyor | ✓ |
| Günler seçilebiliyor; ikinci arama farklı tarihlerle (24–27) | ✓ |
| "Göster" adımındayken güne dokunmak: seçim değişiyor, rehber 1. adıma dönüyor (kilit yok) | ✓ |
| Geriye dokununca yeni giriş, rehber metni güncel ("Giriş: 23 Kasım …") | ✓ |
| Sonuç 23 → 27; üçüncü açılış temiz, son arama 23–27 | ✓ |
| Rehber ortasında ✕: rehber kapanıyor, günler serbestçe seçiliyor | ✓ |
| ✕ sonrası paneli kapatıp tekrar açma: temiz, rehber 1. adımda | ✓ |
| "Son arama" dokununca doğrudan sonuçlar | ✓ |

Ek: "Göster" adımında seçili aralığın son satırı, sabit satırın ve baloncuğun hemen üstüne kaydırılıyor. Küçük iPhone'da daha önce bu satır baloncuğun altında kalıyordu.

### Villa takvimi (`villa-once/`, `villa-sonra/`; 390 ve 360)

| Adım | Önce | Sonra |
|---|---|---|
| Aralık seç (17–19) → villadan çık → villayı tekrar aç | 17–19 seçili, alt panel açık | seçim boş, panel kapalı |
| "+ Rezervasyon" (Yardımlı) → giriş → aynı güne dokun | rehber 1. adıma döner | aynı |
| Giriş seçiliyken daha önceki güne dokun | yeni giriş, rehber çıkış adımında | aynı |
| Çıkış → form | form doğru tarihlerle | aynı |

Villa takviminin rehberinde dokunuş kilidi yoktu (tarih adımlarında takvim hedefin kendisi). Düzeltilen, villa tekrar açılınca eski aralığın geri gelmesi.

## Onaylı akışlar (rehber motoru ve villa açma değiştiği için)

Görselleri `regresyon/` klasöründe.

| Test | Sonuç |
|---|---|
| Görev 27 (bütün maddeler; Normal + Çok büyük) | 86/86 (27.5'in büyüteç kontrolü "düğme yok" olarak güncellendi) |
| Görev 25 takvim konumlama | 16/16 |
| Görev 24 klavye · ücret kartı | 84/84 · 24/24 |
| Görev 23 rehberli rezervasyon | 6/6 |
| Görev 22 | 21/21 |
| Görev 21 (klavye / baloncuk; klavyesiz) | 4/4, 13/13; 11/11 |
| Görev 19 rezervasyon akışı | hatasız, kayıt var |

Konsol / sayfa hatası: hiçbir testte yok.

## Bilinen

- Rehberin "Göster" adımında takvim karartılmış görünüyor ama dokunulabiliyor (vurgu yalnız düğmede). Bu bilerek böyle: seçimi değiştirmek isteyen kilitlenmesin.
- Gerçek iPhone'da denenmedi.
