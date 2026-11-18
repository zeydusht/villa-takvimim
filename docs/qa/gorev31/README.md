# Görev 31: tasarım dili 2.0 — test raporu

_Claude Code, 18 Kasım 2026._

Ortam: Playwright, sahte Supabase, sabit saat 16 Kasım 2026, iPhone boyutları. Veritabanına dokunulmadı.
Değerlerin hepsi `www/index.html` `:root` değişkenlerinde ve `docs/STIL.md`'de.

## Alt adımlar ve ölçülenler

| Adım | Ölçülen (sahte ortamda) | Sonuç |
|---|---|---|
| 31.1 hareket değişkenleri | Panel açılışı `perdeAc` 340 ms (`--egri-cekmece`), kapanışı 220 ms; kararma 240 / 200 ms; bildirim geçişle 300 / 200 ms, yenisi gelince eskisi yarıda kesilir | ✓ |
| | Eski hata bulundu: panel kapanırken arka plan kararması hiç açılmıyordu (CSS önceliği) | düzeltildi |
| 31.2 kademeli giriş | Rezervasyon detayı: öğeler 60 / 100 / 140 / 180 / 220 / 260 ms gecikmeyle, 240 ms, 8 pt; 6. öğeden sonrası 6.'yla birlikte | ✓ |
| | Giriş sürerken düğme basılabilir (`pointer-events: auto`, dokunuş düğmeye gidiyor) | ✓ |
| | Hareketi azalt: kayma yok, 150 ms saydamlık | ✓ |
| | Seçim paneli: açılışta ilk öğe 60 ms; giriş → aralık geçişinde 0 / 40 / 80 / 120 / 160 ms | ✓ |
| 31.3 basma hissi | Hap: basınca 40 ms'de .976, 160 ms'de .97; bırakınca 60 ms'de .988, 260 ms'de 1 | ✓ |
| | Takvim günü: hiç küçülmüyor | ✓ |
| | Menü (bakıcı ekle → villa seç): seçilen satır ana renkte, 200 ms sonra menü kapalı | ✓ |
| 31.4 titreşim dili | Sekme değişimi, 2. gün, anahtar açma → `secim`; eksik isim → `uyari`; kayıt → `basari`; anahtar kapatırken titreşim yok (kapandı) | ✓ |
| 31.5 sayılar | Gövdede `tabular-nums`; takvim hücresi "4.100 ₺"; Gelir&gider Yıl → Ay: −32.500 → −13.552 → −4.990 → … → −1.500 ₺ (450 ms) | ✓ |
| | Hareketi azalt: doğrudan −1.500 ₺ | ✓ |
| 31.6 başarı anları | Bildirimde tik `tikCiz` 350 ms (100 ms gecikmeyle), `basari` titreşimi ~460–480 ms'de | ✓ |
| | İlk rezervasyon kartı bir kez; ikinci rezervasyonda yok; çok rezervasyonlu (eski) hesapta yok | ✓ |
| 31.7 yükleniyor | Hızlı veri (190 ms): iskelet hiç görünmedi. Yavaş veri (1,5 sn): iskelet 350 ms'de göründü | ✓ |
| | İskelet kartlarının yeri ve boyu dolu hâliyle aynı (17 px tabanla: 706 / 836 px, 118 / 94 px) | ✓ |
| | Kaydetme hatası: "Kaydediliyor…" + ikinci basış engelli → sade kırmızı açıklama + "Tekrar dene" | ✓ |
| 31.8 boş hâller | Villa yok, Ajanda, müsaitlik sonuç yok, villanın rezervasyonu yok, Gelir&gider: ikon + tek cümle + en fazla tek ana düğme | ✓ |
| | SE ve 390'da taşma yok | ✓ |
| 31.9 hata hâlleri | Boş isim: kırmızı çerçeve, alan görünürde, ±4 pt × 2 titreme 300 ms, mesaj alanın altında | ✓ |
| | Hareketi azalt: titreme yok | ✓ |
| | Teklifler yüklenemedi ("JWT expired PGRST301"): sade cümle + "Tekrar dene"; tekrar → liste geldi | ✓ |
| 31.10 okunurluk | Gövde 17 px, en küçük 14 px | ✓ |
| | SE / 360 / 390 / 430 × Normal / Çok büyük × gece / gündüz: 7 ekran, taşma yok | ✓ |
| | Ekran görüntüsünde bulundu: SE + Çok büyükte "?" misafir adının üstüne biniyordu | "? Nasıl?" başlığın altına alındı |
| 31.12 kesilebilirlik | 40 px / 60 ms hızlı çekiş → kapanır; 40 px / 800 ms → kapanmaz; 140 px → kapanır | ✓ |
| | Yukarı 20 px → 10,9 px (lastik), bırakınca yerine döner | ✓ |
| | Kapanırken `pointer-events: auto`; dokununca panel geri açıldı, sonra normal kapandı | ✓ |
| 31.13 yavaş çekim | `?yavas=3`: `--hiz-ac` 1020 ms, panel girişi 180 / 300 / 420 ms gecikme, 720 ms (tam 3 kat) | ✓ |
| | Yavaş çekim kapalıyken her şey değişmeden | ✓ |

Ekran görüntüleri: `iskelet/`, `ilk/`, `bos/`, `hata/`, `kaydet-hata/`, `okunurluk/`, `test/`.

## 31.14 Test

### Görev 31 denetimleri (son kodla)

| Denetim | Sonuç |
|---|---|
| iPhone SE ve iPhone 15 × Normal / Büyük / Çok büyük × hareketi azalt kapalı / açık (12 durum, 7 ekran kaydırılarak) | taşma, kesik yazı, üst üste binme yok; konsol / sayfa hatası yok |
| Hareketi azalt açıkken 12 durumda kayan (transform ile yer değiştiren) animasyon | 0 (aynı ölçüm normal modda 30–40 kayan animasyon buluyor: ölçüm çalışıyor) |
| Hareketi azalt açıkken 7 video akışı | 7/7 çalıştı; kayan öğe 0; sayfa hatası yok |
| Görev 31 testleri (`qa31a`–`qa31k`) | hepsi geçti (yukarıdaki tablo) |

### Mevcut testler (son kodla)

| Test | Sonuç |
|---|---|
| Görev 30 (Pro ekranı, mağaza, ne zaman, üyelik satırı, yönetim, kalite) | sorun kaydı yok; farklar beklenen: başlıkta "Kapat" yazısı, bildirimde "✓" harfi yerine çizilen tik, 17 px yazı |
| Görev 30 webhook | 21 durum ✓ |
| Görev 29 (hata yakalama, yönetim, iki adımlı doğrulama, ölçüm) | sorun kaydı yok; farklar beklenen ("Kapat" yazısı) |
| Görev 28 | 60/60 · Çok büyük 60/60 · villa takvimi hatasız |
| Görev 27 | 86/86 |
| Görev 25 | 16/16 |
| Görev 24 | klavye 84/84 · ücret kartı 24/24 |
| Görev 23 | 6/6 |
| Görev 22 | 21/21 |
| Görev 21 | klavye 4/4 · baloncuk 12/13 ve 10/11 (aşağıda) |
| Görev 19 | konsol / sayfa hatası yok, kayıt var |

Testlerin bulduğu ve düzeltilenler:
- **Rehber baloncuğu 3 satıra çıkıyordu** (kural en fazla 2), iki adımda ekranın 4 px üstünden taşıyordu: gövde 17 px olunca rehber katmanı
  da büyümüştü. Rehber katmanı eski ölçülerinde tutuldu (`--rh-olcek`); üstte yer yoksa baloncuk hedefin altına, o da yoksa ekranın
  üst kenarına yerleşir (ekrandan taşmaz).
- **Rehber sürerken "? Nasıl?" hapı** gereksiz yer kaplıyordu: rehber açıkken gizli.
- **Ücret kartında "₺" tek başına alt satıra düşüyordu** ("8.000 / ₺"): tutar ile ₺ arası bölünmez boşluk.
- **İskelet 1–2 px kayıyordu** (kartlar arası boşluk 17 px tabanla 12,75 px): gerçek ölçü kullanılıyor.
- Eski test beklentileri güncellendi (tasarım değişikliği): Görev 27.3 opsiyon başlığı ("Kapat" yazısı), Görev 26 misafirler
  boş hâli (çizim yerine ikon).

**Bilinen sapma (Görev 21, iPhone 14 Safari, 664 px yükseklik):** rezervasyon rehberinin "Toplam ücret" adımında baloncuk karta bitişik
(8 pt yerine 0 pt boşluk). Baloncuk ve kart tamamen ekranda, üst üste binmiyor. Sebep: 17 px yazıyla ücret kartı 332 px boyunda;
kısa ekranda üstünde 8 pt'lik pay kalmıyor. Diğer bütün adımlar ve boyutlar 8 pt.

**Bilerek bırakılanlar:** ay / dönem okları (‹ ›) ve kişi sayısındaki − / + yazısız (geri oku gibi bağlamıyla anlaşılır; erişilebilirlik
etiketleri var). Grup içindeki satırlar basınca küçülmez (satırlar birbirine yapışık), yalnız zemini değişir.

**Denenemeyen:** gerçek iPhone'da titreşim (`secim` dahil) ve çekmece hissi; Windows'ta Xcode yok.

## 31.13 Videolar (`video/`)

iPhone 15 boyutu (393 × 852), gerçek dokunma olaylarıyla. Her akış iki kez: normal hızda ve `?yavas=3` ile (`-yavas3`).

| Dosya | Akış |
|---|---|
| `01-acilis` | Uygulama açılışı → Villalarım |
| `02-rezervasyon-kaydet` | Takvimde 2 gün → seçim paneli → ad yazılır → Rezervasyonu kaydet → tik çizilir → "İlk rezervasyonunuz kaydedildi" kartı |
| `03-odeme-al` | Rezervasyon detayı → Ödemeyi al ve misafiri yerleştir → Kaydet → kalan ödeme sayarak 0'a iner → Evet, yerleştirdim |
| `04-musaitlik` | Takvim → Hangi villam boş? → tarihler → sonuçlar (kademeli) → aşağı kaydırma |
| `05-gelir-gider` | Gelir & gider → Ay / Yıl, önceki / sonraki dönem (net tutar sayarak geçer) |
| `06-bos-hesap` | Villa yok ekranı |
| `07-ag-kapali-hata` | Hesabım → ağ kapalıyken "Bilgilerimi kaydet" → çevrimdışı şeridi, düğmenin altında hata + "Tekrar dene" → ağ gelince tekrar → kaydedildi |

## 31.11 Her ekranda tek bir öne çıkan iş

Yöntem: kaynakta her panel fonksiyonunda dolu yeşil `.big` sayısı tarandı; sonra uygulama çalışırken 22 ekran ve panel açılıp
görünen dolu yeşil düğmeler (zemini `--ok`) ve görünür kapatma / Vazgeç sayıldı (`qa31j.js`).

| Ekran / panel | Ne vardı | Ne yaptım |
|---|---|---|
| Villa ekranı, takvimde iki gün seçiliyken | Üstte dolu yeşil "+ Rezervasyon" hapı ve alttaki seçim panelinde dolu yeşil "Rezervasyon": iki ana düğme | Seçim paneli açıkken üstteki hap açık yeşil (ikincil) olur; ana iş paneldeki "Rezervasyon" |
| Fotoğraflar → Google Drive'dan ekle | Sonuç gelince "Fotoğrafları bul" ve "Hepsini ekle" ikisi de dolu yeşil | Sonuç gelince "Fotoğrafları bul" renkli (ikincil) olur; arama hata verirse yeniden ana düğme |
| Bakıcılar → davet oluşturuldu | Kaynakta iki ana düğme görünüyordu | Kontrol: "Yeni bakıcı davet et" kod oluşunca gizleniyor, ekranda tek ana düğme ("WhatsApp'ta gönder"). Değişiklik gerekmedi |
| Ödeme akışı, ödeme paneli, opsiyon, üyelik ver, villa ekleme sihirbazı, fiyat paneli, rezervasyon formu PDF | Kaynakta birden çok ana düğme | Kontrol: hepsi ayrı adım ya da ayrı panel (aynı anda yalnız biri görünür). Değişiklik gerekmedi |
| Villalarım boş, Gelir&gider boş, müsaitlik sonuç yok | Çizim + birden çok yol | 31.8 boş hâli: tek ana düğme, ikincil yol renkli |
| Rezervasyon detayı | En önemli iş "… alınacak" + "Ödemeyi al" | Zaten en üstte ve en büyük; 31.5 ile tutar sayarak değişir |
| Gelir & gider | En önemli rakam net kazanç | Zaten en üstte ve en büyük |
| Bütün paneller | Kapatma: köşede yalnız "✕" ikonu | 31.10: "✕ Kapat" yazılı hap; 22 ekran/panelin hepsinde görünür kapatma ya da Vazgeç var |
| İki adımlı doğrulama zorunlu paneli | Kapatma yok | Bilerek: giriş için zorunlu adım (Görev 29.6); "Çıkış yap" ile çıkılır |

Sonuç: 22 ekran ve panelde en fazla bir dolu yeşil düğme var; her panelde görünür kapatma ya da Vazgeç var; konsol hatası yok.
