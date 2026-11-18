# Görev 32: dış takvimler (Airbnb, Booking, Vrbo, Villasepeti, diğer) — test raporu

_Claude Code, 18 Kasım 2026._

Veritabanı değişmedi (`VERITABANI_GOREV32.sql` uygulanmadı). Edge Function'lar yazıldı, **deploy edilmedi**. Netlify'a yüklenmedi.
Sunucu tarafı yokken uygulama bugünkü gibi çalışır: "Airbnb, Booking ve diğer siteler" satırı ve takvimdeki dış takvim parçaları
gizli kalır, kayıt eski yoldan yapılır. "Tablo yok" sonucu cihazda 6 saat hatırlanır (açılışta konsola 404 yazılmasın).

## Ürün yöneticisi için: açmadan önce

1. `docs/VERITABANI_GOREV32.sql` uygulanır.
2. Edge Function'lar deploy edilir:
   - `supabase functions deploy takvim-esitle --no-verify-jwt` (oturumu fonksiyon kendisi denetler; zamanlayıcı JWT değil parola gönderir)
   - `supabase functions deploy takvim-ver --no-verify-jwt` (herkese açık; Airbnb / Booking oturum açmadan okur)
3. Gizli değişkenler: `ESITLE_GIZLI` (zamanlayıcının parolası, uzun rastgele bir metin); bildirim için `VAPID_ACIK`, `VAPID_GIZLI`,
   `VAPID_POSTA` zaten `bildirim` fonksiyonunda var, takvim-esitle de aynılarını kullanır.
4. Zamanlayıcı (pg_cron + pg_net), parolayı yerine koyarak:
   ```sql
   select cron.schedule('takvim_esitle_tam', '*/10 * * * *', $$
     select net.http_post(url := '<SUPABASE_URL>/functions/v1/takvim-esitle',
       headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer <ESITLE_GIZLI>'),
       body := '{"mod":"tam"}'::jsonb) $$);
   select cron.schedule('takvim_esitle_dakika', '* * * * *', $$
     select net.http_post(url := '<SUPABASE_URL>/functions/v1/takvim-esitle',
       headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer <ESITLE_GIZLI>'),
       body := '{"mod":"dakika"}'::jsonb) $$);
   ```
   "tam": bütün takvimler (aynı anda 8), bekleyen rezervasyonlar, çakışma bildirimleri, 3 saattir okunamayan takvim bildirimi.
   "dakika": yalnız `dis_kontrol='bekliyor'` rezervasyonu olan villalar (en fazla 30 dk) ve çakışma bildirimleri.

## Testler

Ortam: Playwright + sahte Supabase, sabit saat 16 Kasım 2026. **Sahte iCal sunucusu** (yerel http) Airbnb, Booking ve diğer
biçimde takvimler verir; testin ortasında bloklar ve gecikme değiştirilebilir. `takvim-esitle` Node'da gerçek okuyucu ve gerçek
SSRF kontrolüyle taklit edildi (`https://ical.test/…` yerel sunucuya yönlenir, ad çözümlemesi genel bir IP döner).
Veritabanı kuralları (`rez_dis_engel` kilidi, `cakisma_tara`, `tutma_al`, `blok_rez_olustur`, `cakisma_coz`) aynı mantıkla taklit edildi.

### Görev 32.9 senaryoları

| # | Senaryo | Sonuç |
|---|---|---|
| 1 | Bağla → test et | "Bağlandı: önümüzdeki 12 ayda 8 dolu gün bulundu." Geçmiş blok sayılmadı ✓ |
| 2 | Boş tarih → Kaydet | Liste ✓✓✓ (612 / 662 / 695 ms: en az 600 ms, ~40 ms kademeli); tek POST, `dis_kontrol='tamam'`; hatırlatma kartı "Airbnb'de aç", "Booking'de aç" ✓ |
| 3 | Form açıkken Airbnb'ye satış eklendi | 57. saniyede kırmızı şerit "Dikkat: 5–8 Aralık az önce Airbnb'de satıldı.", Kaydet pasif ✓; form kapanınca ayırma bırakıldı ✓; başkasının ayırmasında form açılmadı ✓ |
| 4 | Dolu tarih → Kaydet | ✕ Airbnb, kaydedilmedi, "Yine de kaydet" yok; "Bu, oradaki rezervasyonun ta kendisi" → blok bağlı rezervasyon oluştu, girilen ad ona yazıldı ✓ |
| 5 | Yalnız kapalı | "Bu günler Airbnb'de kapalı görünüyor… Yine de kaydedilsin mi?" → Kaydet → kaydedildi ✓ |
| 6 | Bir site 10 sn gecikmeli | 8 sn sınırında ⚠, `dis_kontrol='bekliyor'`, bilgi mesajı, takvimde ve kartta saat ikonu ✓. Sunucu: takvimler okununca boş → `tamam` + "✓ Villa Salta 17–21 Kasım: bütün takvimler müsait, rezervasyon onaylandı." (sahip ve bakıcıya; bildirime dokununca o güne gider) ✓ |
| 7 | Kayıttan sonra dışarıda çakışan satış | Villalarım'da kapatılamayan kırmızı kart; takvimde kırmızı çerçeve + uyarı ikonu; çözme ekranı → "Sorunu çözdüm" (nasıl seçilmeden kaydedilmez) → kart kayboldu; ikinci çakışma "Aynı misafir, aynı rezervasyon" ile çözüldü ✓ |
| 8 | `takvim-ver` çıktısı | Geçerli iCal (geri okundu), satırlar ≤ 75 oktet; misafir adı, telefon, tutar, not yok ✓ (birim testi) |
| 9 | Yansıma | Bizim 25–28 Kasım rezervasyonumuz Booking'den "CLOSED" olarak birebir dönünce alarm yok ✓; aynı tarihli blok rezervasyondan önce görülmüşse alarm var ✓ |
| 10 | SSRF | `https://127.0.0.1/…`, `https://169.254.169.254/…`, `http://…`, `https://localhost/…`, `https://[::1]/…`, ondalık / onaltılık IP, DNS'i özel ağa çıkan ad, http'ye ya da iç ağa yönlendirme, 4. yönlendirme, 2 MB üstü, 8 sn: hepsi reddedildi, sade Türkçe ✓ |

### Ekranlara göre

| Bölüm | Kontrol | Sonuç |
|---|---|---|
| 32.3 | Satır yalnız sahipte; sunucu hazır değilken ve bakıcıda gizli; kaynak seçimi, Airbnb / Booking / Vrbo yardımı, yerel site mesajı + kopyala; aynı link ikinci kez "Bu link zaten bağlı."; link onaylı yenilendi (eski çalışmaz) | ✓ (390, SE) |
| 32.4 | Çizgili bloklar ve kaynak adı, kapalı soluk; gösterge; dış satışa aralık seçilemez; panel ve "Misafir bilgisi ekle"; bağlı rezervasyonda "Airbnb" etiketi; müsaitlikte dolu ve "(sitede kapalı)" | ✓ (390, SE) |
| 32.8 | Tazelik satırı; "Villasepeti 2 saattir okunamıyor" kırmızı, dokununca ayar ekranı; villa açılınca ve aşağı çekince yenileme (aynı villa için en sık 60 sn) | ✓ |

### Sunucu ve birim testleri

- `node --no-warnings docs/qa/gorev32/deno-testleri.mjs` (Deno biçimindeki birim testleri; Deno kuruluysa `deno test`): **19 geçti**
  — okuyucu (katlama, tarih / tarih-saat, DTEND yok, iptal, geçmiş / 2 yıl), tür tablosu, gerçek biçim örnekleri (`ornekler/`), SSRF,
  `takvim-ver` adresi ve çıktısı.
- `node --no-warnings docs/qa/gorev32/sunucu-testi.mjs` (sahte Supabase istemcisi, sahte saat): **11 geçti** — erişim (403, bakıcı,
  deneme yalnız sahip), KVKK (kaydedilen alanlar yalnız tarih / tür / UID), aralık özeti, iptal edilen satışın silinmesi, 20 sn hız sınırı,
  bekleyen → onay, bekleyen → çakışma, 30 dk ulaşılamıyor (bir kez), çakışma bildirimi (açıldığı an, 3 saatte bir, saatte bir, gece sessiz,
  girişe 24 saatten az kaldıysa gece de), 3 saattir okunamayan takvim (günde en fazla 2), yansıma.

### Mevcut testler (son kodla)

| Test | Sonuç |
|---|---|
| Görev 31 (`qa31a`–`qa31k`, SE / iPhone 15 × 3 yazı boyutu × hareketi azalt) | hepsi geçti; 12 durumda taşma, hata, konsol yok; hareketi azaltta kayan öğe 0 |
| Görev 30 | Görev 31 sonuçlarıyla birebir aynı, sorun kaydı yok |
| Görev 29 | fark yok, sorun yok |
| Görev 28 | 60/60 · Çok büyük 60/60 · villa takvimi hatasız |
| Görev 27 | 86/86 |
| Görev 25 · 24 · 23 · 22 | 16/16 · 84/84 + 24/24 · 6/6 · 21/21 |
| Görev 21 | klavye 4/4; baloncuk 12/13 ve 10/11 (Görev 31'den bilinen sapma: iPhone 14'te ücret kartı adımında baloncuk karta bitişik) |
| Görev 19 | hatasız |

Eski testlerin sahte sunucusu, bugünkü canlı veritabanı gibi dış takvim tablolarına "tablo yok" (404) döner; böylece eski testler
özellik kapalıyken (bugünkü gerçek durum) çalıştı.

## Denenemeyen

- Gerçek Airbnb / Booking / Vrbo / Villasepeti linkleri ve bizim linkin o sitelere yapıştırılması (hesap gerekli). Biçimler
  internetteki gerçek dışa aktarımlardan alındı (`supabase/functions/takvim-esitle/ornekler/KAYNAKLAR.md`).
- Edge Function'ların Supabase'de çalışması (deploy edilmedi) ve gerçek push bildirimi.
- Gerçek iPhone'da bildirime dokununca güne gitme.
