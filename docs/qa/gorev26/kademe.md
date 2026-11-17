# Görev 26.3–26.4: kademeli girişler ve kaydırınca belirme

_Claude Code, 17 Kasım 2026._

## 26.3 Kademeli giriş

Bir ekran bu oturumda ilk kez açılınca, ekranda görünen içerik yukarıdan aşağı sırayla gelir:
- her öğe 10 pt aşağıdan ve saydamdan;
- 260 ms, `--egri-giris`;
- öğeler arası 35 ms;
- en fazla 8 kademe (sonrakiler 8. ile birlikte).

Yalnız ekranda görünen öğeler kademelenir. Aşağıda kalanlar beklemez; villa ekranında kaydırınca belirir (26.4).

| Ekran | Sıra |
|---|---|
| Villalarım | başlık → özet etiketleri → villa kartları |
| Villa ekranı | geri çubuğu → bugün kartı → Sıradaki → ay başlığı → haplar → takvim |
| Takvim sekmesi | başlık → özet → seçim düğmeleri → gün grupları |
| Gelir & gider | geri çubuğu → başlık → dönem → net kazanç → kutular → listeler |
| Hesap | başlık → bölümler |

- **Tekrar oynamaz:** geri gelince, sekme değiştirip dönünce, veri yenilenince, başka villa açılınca.
- **"Hareketi azalt"ta yok.**
- **Açılış animasyonundan sonra:** açılış (`acilis.js`, değiştirilmedi) son adımında ana ekranın kabını (`.wrap`) soldurarak getiriyor.
  - Kademeli giriş, bu solmanın başladığı ana hizalanıyor; zamanı açılışın kendi animasyonundan okunuyor.
  - Solma henüz kurulmadıysa her karede yeniden bakılıyor.
  - Böylece kartlar perdenin arkasında oynayıp görünmeden bitmiyor.

## 26.4 Kaydırınca belirme

- **Misafir sayfası (g.html):**
  - İlk ekranda görünmeyen bölümler (Ev hakkında, Öne çıkan özellikler, Konum, Ev kuralları…) ekrana girerken 16 pt aşağıdan solarak gelir: 320 ms, bir kez. `IntersectionObserver` tetiklenince gözlemi bırakır.
  - Fotoğraf şeridindeki fotoğraflar yüklenince 200 ms'de solar.
- **Villa ekranı:** takvimin altındaki bölümler (yaklaşan rezervasyonlar, teklifler, opsiyonlar, villa sayfası…) aynı biçimde ama daha hafif gelir (8 pt).
- **"Hareketi azalt"ta** hiçbir bölüm beklemez, fotoğraflar hemen görünür.
- **Performans:** yalnız `transform` ve `opacity`.

## Test

Playwright, 360×740, 390×844, 430×932. Animasyonlar, sayfa yüklenmeden kurulan bir kancayla zamanlarıyla kaydedildi.

| Kontrol | 390 | 360 | 430 |
|---|---|---|---|
| Villalarım ilk açılış | 4 kademe (0–105 ms), 260 ms | aynı | aynı |
| Villa ekranı ilk açılış | 6 kademe (0–175 ms) | aynı | aynı |
| Takvim sekmesi | 8 kademe (0–245 ms) | aynı | aynı |
| Hesap | 7 kademe (0–210 ms) | aynı | aynı |
| Gelir & gider | 8 kademe, 9. öğe 8. ile birlikte | 8 kademe | 8 kademe, 9. ve 10. öğe 8. ile birlikte |
| İkinci girişte (Villalarım, Takvim, villa ekranı) | animasyon yok | yok | yok |
| Açılıştan sonra: ilk kademe ile açılışın `.wrap` solmasının başlangıcı | aynı an (2925 / 2925 ms) | aynı an | aynı an |
| Villa ekranı alt bölümleri | 4 bölüm bekliyor; kaydırınca 8 pt, 320 ms | aynı | aynı |
| Misafir sayfası | 4 bölüm bekliyor, ilk ekranda bekleyen 0; kaydırınca 16 pt, 320 ms; sonunda bekleyen 0; ikinci kaydırmada animasyon yok | aynı | aynı |
| Fotoğraflar (600 ms gecikmeli) | yüklenene kadar saydam, yüklenince solarak | aynı | aynı |
| "Hareketi azalt" | uygulamada ve misafir sayfasında hiç animasyon, bekleyen bölüm yok | | |
| Konsol hatası | 0 | 0 | 0 |

Görseller `kademe/` klasöründe:
- animasyonun ortasında (Villalarım 80 ms, villa ekranı 180 ms, Takvim ve Hesap 100 ms);
- açılıştan sonraki ana ekran;
- misafir sayfasında kaydırma.

## Onaylı akışlar (regresyon, bu bölümden sonra)

| Test | Sonuç |
|---|---|
| Görev 25 takvim konumlama | 16/16 |
| Görev 24 klavye / ücret kartı | 84/84, 24/24 |
| Görev 23 rehberli rezervasyon | 6/6 (bir senaryo, altı test aynı anda çalışırken villa kartı çizilmeden tıklandığı için düştü; tek başına geçti) |
| Görev 22 | 21/21 |
| Görev 21 ölçümü | 4/4, 13/13 (klavyesiz 11/11) |
| Görev 19 rezervasyon akışı | hatasız, kayıt var |
