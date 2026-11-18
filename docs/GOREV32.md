# GÖREV 32 — Dış takvimler: Airbnb, Booking, Villasepeti… Çift satış OLMAYACAK

**Bu uygulamanın ana amaçlarından biri.** Villa sahipleri villayı Airbnb'de, Booking'de ve Kalkan'daki yerel villa sitelerinde satıyor; bir yandan da WhatsApp'tan kendisi satıyor. Gerçek bir olay: 12 kişilik grup villaya geldi, villa sahibi aynı tarihleri başka yerden de satmış, içeride başka misafir vardı. Bu görevin amacı bunun bir daha olmaması.

Yöntem: **iCal** (sonu `.ics` ile biten takvim linki). Ücretsiz ve standart.
- **Dışarıdan bize:** sahip her sitenin iCal linkini yapıştırır. Sunucu o sitelerdeki dolu günleri okur.
- **Bizden dışarıya:** her villanın gizli bir iCal linki olur. Sahip bunu Airbnb'ye ve diğer sitelere yapıştırır. Bizde satılan günler orada da kapanır.

**Veritabanı `docs/VERITABANI_GOREV32.sql`. Ürün yöneticisi uygular. Sen çalıştırma, sadece adları kullan.**

Kullanacağın tablo ve fonksiyonlar:
- Tablolar:
  - `dis_takvimler`: sadece sahip okur ve yazar, `adres` gizlidir.
  - `dis_bloklar`: sadece okunur, sunucu yazar.
  - `rez_tutmalar`
  - `cakismalar`
  - `villa_ical`
- RPC'ler: `takvim_durumlari(p_villa)`, `tutma_al(p_villa,p_bas,p_bit)`, `tutma_birak(p_id)`, `blok_eslestir(p_blok,p_rez)`, `blok_rez_olustur(p_blok,p_misafir)`, `cakisma_coz(p_id,p_durum,p_not)`, `ical_anahtarim(p_villa,p_yenile)`
- Sunucu tarafı (sen çağırma): `cakisma_tara(p_villa)`
- Rezervasyonlarda yeni sütunlar: `dis_kontrol` (`tamam` / `bekliyor` / `cakisma`), `dis_kontrol_zamani`, `olusturma`
- **Sunucu kilidi:** `rezervasyonlar` tablosuna gerçek bir dış satışın üstüne yazılırsa ya da başkasının 10 dakikalık ayırmasına denk gelirse veritabanı hata verir. Hata metni `DIS_CAKISMA: <site> <bas> - <bit>` veya `TUTMA_VAR: …` ile başlar. Uygulama bu hataları yakalayıp sade dille göstermeli.

Edge Function'ları yaz ama **deploy etme**. Ürün yöneticisi kontrol edip deploy edecek.

---

## 32.1 Edge Function `takvim-esitle`

`supabase/functions/takvim-esitle/index.ts`

**İki çağrılma şekli var:**
- **Uygulamadan:** kullanıcının oturum tokeni ve `{ villa_id }` gelir.
  - `erisim_var` kontrolünü service_role ile, kullanıcının id'si üzerinden yap.
  - O villanın bütün aktif takvimlerini **paralel** oku ve sonucu döndür.
- **Zamanlayıcıdan (cron):** `Authorization: Bearer <ESITLE_GIZLI>` gelir. Bütün aktif takvimleri sırayla, aynı anda en fazla 8 tane olacak şekilde okur.

**Her takvim için:**
- **Güvenlik (SSRF):**
  - sadece `https://` adreslere izin ver;
  - IP adresi ya da `localhost` / özel ağ adresi (10.x, 172.16–31.x, 192.168.x, 169.254.x, ::1, fc00::/7) ise reddet;
  - en fazla 3 yönlendirme izle, her yönlendirmede aynı kontrolü yap;
  - cevap en fazla 2 MB olsun;
  - süre sınırı **8 sn**.
- **Nazik okuma:** `If-None-Match` (etag) ve `If-Modified-Since` başlıklarını gönder. 304 dönerse veri değişmemiştir, sadece `son_basari` güncellenir.
- **Okuma:** iCal'i `VEVENT`'lere ayır. DTSTART ve DTEND tarih ya da tarih-saat olabilir, ikisini de destekle.
  - Satır katlamasını aç (devam satırı boşlukla başlar).
  - DTEND yoksa 1 gün say.
  - Geçmişte kalan (bitiş < bugün − 1) ve 2 yıldan uzak blokları atla.
- **Tür belirleme** (`SUMMARY` ve `DESCRIPTION` alanına bak, küçük/büyük harf duyarsız):

| Kaynak | Metin | Tür |
|---|---|---|
| Airbnb | `Reserved` | `rezervasyon` |
| Airbnb | `Not available` / `Blocked` | `kapali` |
| Booking | `CLOSED - Not available` | `bilinmiyor` |
| Vrbo | `Reserved`, `Booked` | `rezervasyon` |
| Vrbo | `Blocked` | `kapali` |
| Diğer | — | `bilinmiyor` |

  - Bütün kaynakların gerçek örnek dosyalarını internette araştır, `supabase/functions/takvim-esitle/ornekler/` klasörüne koy ve testte kullan.
- **Kayıt:**
  - takvim başına bütün blokları upsert et (`takvim_id, uid, baslangic`);
  - bu okumada görünmeyen eski blokları sil (iptal edilmiş satış);
  - **misafir adı, telefon, SUMMARY ya da DESCRIPTION metni kaydetme (KVKK).** Sadece tarih, tür ve UID.
- **Takvim satırı:**
  - başarıda: `son_basari`, `son_deneme`, `hata_sayisi=0`, `etag`;
  - hatada: `son_hata` (kısa ve sade Türkçe), `hata_sayisi+1`.
- **Sonra:** `cakisma_tara(villa_id)` çağır.
- **Cevap:** `{ takvimler: [{id, ad, kaynak, durum: 'bos'|'dolu'|'hata', sure_ms, dolu_araliklar:[{bas,bit,tur}]}], cakisma_var }`. İstenirse `{ villa_id, bas, bit }` ile sadece o aralığa bakan özet de dönsün.
- **Hız sınırı:** aynı villa için uygulamadan gelen çağrılar arasında en az 20 sn olsun. Daha sık gelirse son okuma sonucu dönsün. Cron bu sınırdan muaf.

## 32.2 Edge Function `takvim-ver` (bizden dışarıya iCal)

`supabase/functions/takvim-ver/index.ts`, herkese açık (`--no-verify-jwt`).

- **Adres:** `/functions/v1/takvim-ver/<anahtar>.ics`. Sonu **.ics** ile bitmeli, Airbnb başka türlüsünü kabul etmiyor.
- Anahtar `villa_ical` tablosunda yoksa 404 dönsün ve hiçbir bilgi vermesin.
- **İçerik:** o villanın bugünden sonraki bütün rezervasyonları ve süresi geçmemiş ayırmaları (`rez_tutmalar`).
  - Her biri bir VEVENT: `SUMMARY:Dolu` (ayırma için `SUMMARY:Opsiyon`).
  - `DTSTART;VALUE=DATE` ve `DTEND;VALUE=DATE` kullan.
  - `UID` kalıcı olsun: `rez-<id>@villatakvim`.
  - **Misafir adı, telefon, fiyat ve not KESİNLİKLE yok.**
- **Dış takvimlerden gelen blokları geri yayınlama.** Döngü olur.
- **Başlıklar:** `Content-Type: text/calendar; charset=utf-8`, `Cache-Control: max-age=60`, `X-Robots-Tag: noindex`.

## 32.3 Villa ayarları → "Takvim bağlantıları" ekranı (sadece sahip)

Villa ekranında yeni bir satır: **"Airbnb, Booking ve diğer siteler"** (ikon `baglanti`). Açılan ekranda iki bölüm var.

**1. "Sitelerdeki takvimler (bize gelen)"**
- Bağlı her takvim için bir satır: kaynak ikonu ya da harf rozeti, ad, durum.
  - Durum örnekleri: "3 dk önce kontrol edildi ✓" ya da kırmızı "2 saattir ulaşılamıyor".
  - Satıra dokununca: ad değiştir, linki değiştir, kaldır.
- **"+ Site takvimi bağla"** akışı:
  1. Kaynak seçimi (büyük düğmeler): Airbnb, Booking.com, Vrbo, Villasepeti, Diğer site.
  2. O kaynak için **linkin nerede olduğunu anlatan 3–4 adımlık kısa yardım**. Airbnb: Takvim → Müsaitlik → Takvimleri bağla → Başka bir web sitesine bağla → linki kopyala. Booking için de araştırıp yaz. Yerel siteler için şu metin: "Sitenin müşteri temsilcisinden villanızın iCal (.ics) linkini isteyin." Altına hazır bir WhatsApp mesajı ve **"Mesajı kopyala"** düğmesi koy.
  3. Link yapıştırma alanı. Panodan otomatik yapıştırma düğmesi de olsun.
  4. **"Bağla"** düğmesi: önce linki hemen test et (`takvim-esitle`). Okunabildiyse "Bağlandı: önümüzdeki 12 ayda 8 dolu gün bulundu" yazsın. Okunamadıysa sade dille neden okunamadığını göster.
- `.ics` ile bitmeyen ya da `https` olmayan linkte kibar bir uyarı çıksın, ama denemeye izin ver.

**2. "Bu villanın takvim linki (sitelere verilecek)"**
- Link ve **"Kopyala"** düğmesi. Altında tek cümle: "Bu linki Airbnb, Booking ve diğer sitelerdeki takvim ayarına yapıştırın. Sizin buradan girdiğiniz günler orada da kapanır."
- **"Linki yenile"** düğmesi: eski link çalışmaz olur. Basmadan önce onay sor.

**Rehber:** bu ekran için rehber yaz (rehber.js), ilk bağlamayı adım adım göstersin.

## 32.4 Takvimde dış bloklar

- `dis_bloklar` takvimde **çizgili** bloklar olarak görünsün.
  - Renk: `--muted` tonunda çapraz çizgi.
  - Üstünde kaynağın kısa adı: "Airbnb", "Booking" vb.
  - `kapali` türü daha soluk çizgili olsun ve üstünde "kapalı" yazsın.
- Dış bloğa dokununca açılan panel:
  - "Bu tarihler Airbnb'de satılmış" ya da "Bu tarihler Airbnb'de kapalı";
  - giriş ve çıkış tarihi;
  - "Son kontrol: 2 dk önce";
  - sahip için **"Misafir bilgisi ekle"** düğmesi: `blok_rez_olustur` çağrılır, dönen rezervasyon normal düzenleme formunda açılır. Böylece Airbnb misafiri de ödeme ve bakıcı takibine girer.
- Bir dış bloğa bağlanmış rezervasyonlar normal rezervasyon gibi görünsün. Köşede küçük bir kaynak etiketi olsun ("Airbnb").
- Gösterge kısmına "Diğer sitelerde dolu" ve "Diğer sitelerde kapalı" eklensin.
- **Müsaitlik araması (Görev 27):** dış blokları da dolu saysın. `kapali` türünü de dolu saysın, yanına "(sitede kapalı)" notu yazılsın.

## 32.5 Rezervasyon girerken: 10 dakikalık ayırma

- Sahip ya da bakıcı takvimde giriş ve çıkış gününü seçip **"Rezervasyon"**a bastığı anda iki şey olsun:
  1. **Arka planda** `takvim-esitle` çağrılsın (taze veri).
  2. `tutma_al(villa, bas, bit)` çağrılsın.
- Ayırma alındıysa formun üstünde küçük bir hap görünsün: **"Bu tarihler 10 dk sizin için ayrıldı · 9:41"** (geri sayım).
  - Süre bitmeden kullanıcı bir alana dokunursa ayırma sessizce yeniden alınsın (uzatılsın).
  - Form kapanırsa ya da vazgeçilirse `tutma_birak` çağrılsın.
- Ayırma başkasınınsa (aynı villaya bakan bakıcı ya da ortak): "Bu tarihler şu an başka biri tarafından ayrılmış (8 dk). Başka tarih seçin ya da bekleyin." Form açılmasın.
- **Ayırma süresince her 60 sn'de** `takvim-esitle` çağrılsın.
  - Seçili tarihlere denk gelen bir `rezervasyon` ya da `bilinmiyor` blok çıkarsa formun üstünde hemen kırmızı bir şerit görünsün: **"Dikkat: 17–21 Kasım az önce Airbnb'de satıldı."**
  - Kaydet düğmesi pasif olsun. Yanında "Tarihleri değiştir" düğmesi olsun.
  - Telefon `uyari` titreşimi versin.

## 32.6 "Kaydet"e basınca: anlık kontrol

**Kaydet'e basınca** ekranda bir kontrol listesi açılsın:
- Başlık: "Takvimler kontrol ediliyor…"
- Altında bağlı her site için bir satır. Satırın solunda dönen gösterge; kontrol bitince sırayla ✓ (yeşil), ✕ (kırmızı) ya da ⚠ (ulaşılamadı) olsun. "Tak tak tak" hissi: her satır sonucu geldiği an işaretlensin, 40 ms kademeli.
- **En az 600 ms** görünsün. Çok hızlı biterse yanıp sönmesin.

**Sonuçlar:**

**A) Hepsi ✓ ve tarihler boş** → rezervasyon `dis_kontrol='tamam'` ile kaydedilsin.
- Başarı animasyonu ve `basari` titreşimi.
- Ardından kısa bir hatırlatma kartı: **"Bu rezervasyon 3 saat içinde Airbnb, Booking ve diğer sitelere otomatik geçer. Hemen kapatmak isterseniz:"** Altında her bağlı site için **"Airbnb'de aç"** düğmesi (sitenin ev sahibi takvimini açan link). Kart "Tamam" ile kapanır.

**B) Herhangi bir sitede `rezervasyon` ya da `bilinmiyor` blok çakışıyor** → **kaydetme**.
- Kırmızı panel: **"Kaydedilemedi: 17–21 Kasım Villasepeti'de dolu."**
- Seçenekler:
  - [Tarihleri değiştir]
  - [Başka boş villa bul] → müsaitlik araması aynı tarihlerle açılsın
  - sahip için: **[Bu, oradaki rezervasyonun ta kendisi]** → `blok_rez_olustur` ile o bloğa bağlı rezervasyon oluşturulsun, girilen bilgiler (ad, telefon, tutar…) ona yazılsın. Bu seçenek, sahip Airbnb'den gelen misafiri uygulamaya girmek istediğinde kullanılır.
- "Yine de kaydet" seçeneği **YOK**.

**C) Sadece `kapali` blok çakışıyor** → sarı değil, `--uyari` renkli uyarı: **"Bu günler Airbnb'de kapalı görünüyor. Siz kapatmış olabilirsiniz. Yine de kaydedilsin mi?"** [Kaydet] [Vazgeç]

**D) Bir ya da daha fazla siteye 8 sn içinde ulaşılamadı** (diğerleri ✓):
- Rezervasyon `dis_kontrol='bekliyor'` ile kaydedilsin.
- Mesaj: **"Rezervasyonunuz alındı. Villasepeti takvimine şu an ulaşılamadı; kontrol edip 1–2 dakika içinde bildirim göndereceğiz."**
- Takvimde bu rezervasyonun köşesinde küçük bir saat ikonu olsun.

**Sunucu bekleyenleri izlesin:** `dis_kontrol='bekliyor'` olan rezervasyonlar için cron her dakika ilgili takvimi yeniden denesin (en fazla 30 dk). Sonuca göre:
- **Boş çıkarsa:** `dis_kontrol='tamam'` ve push bildirimi: **"✓ Villa Salta 17–21 Kasım: bütün takvimler müsait, rezervasyon onaylandı."** Bildirime dokununca uygulama o villanın takviminde o güne gitsin.
- **Dolu çıkarsa:** çakışma açılır (32.7).
- **30 dk sonra hâlâ ulaşılamıyorsa:** "Villasepeti takvimine 30 dakikadır ulaşılamıyor. Lütfen orada da kontrol edin." bildirimi gitsin.

**Kurallar:**
- Rezervasyon kaydı bu yeni akışta `VT.senkron`'dan ayrı, tek bir POST ile hemen gönderilsin. Hata yakalanabilsin.
- `VT.senkron` toplu gönderimde `DIS_CAKISMA` ya da `TUTMA_VAR` hatası gelirse toplu gönderim takılı kalmasın. O rezervasyonları tek tek göndersin, çakışanı kullanıcıya göstersin, diğerleri kaydolsun.
- Hiç dış takvimi bağlı olmayan villada kontrol listesi gösterilmesin. Sadece başkasının ayırması kontrol edilsin.
- **Bakıcı:** rezervasyon girebiliyorsa aynı kontrol onda da çalışsın. Çakışma panelindeki "Bu, oradaki rezervasyon" seçeneği bakıcıda olmasın.

## 32.7 Çakışma alarmı: çözülmeden susmaz

Bir çakışma (`cakismalar.durum='acik'`) varsa:

1. **Villalarım ekranının en üstünde kapatılamayan kırmızı bir kart** olsun:
   - Metin: "⚠ Çift satış riski: Villa Salta 17–21 Kasım, hem burada (Ahmet Yılmaz) hem Airbnb'de dolu."
   - Düğme: **[Şimdi çöz]**
2. **Çözme ekranı:**
   - İki rezervasyon yan yana: bizdeki (misafir, tarih, telefon, WhatsApp düğmesi) ve dışarıdaki (site, tarih).
   - Seçenekler:
     - **"Aynı misafir, aynı rezervasyon"** → `cakisma_coz(id,'ayni_rez')`.
     - **"Sorunu çözdüm"** → nasıl çözüldüğü zorunlu olarak seçilsin: "Misafiri başka villaya aldım", "Dışarıdaki satışı iptal ettirdim", "Bizdekini iptal ettim", "Diğer" (kısa not) → `cakisma_coz(id,'cozuldu',not)`.
     - **"Başka boş villa bul"** → müsaitlik araması.
3. **Push bildirimi** (sunucu cron'u): çakışma açıldığı anda bildirim gitsin, sonra çözülene kadar tekrar etsin:
   - giriş tarihine 3 günden fazla varsa **3 saatte bir**;
   - 3 gün ve daha az kaldıysa **saatte bir** (gece 23:00–08:00 arası hariç, ama girişe 24 saatten az kaldıysa gece de gitsin);
   - kime: sahip ve o villaya erişimi olan herkes;
   - `cakismalar.son_bildirim` ve `bildirim_sayisi` güncellensin.
4. Takvimde çakışan rezervasyon **kırmızı çerçeveli** görünsün, köşesinde ⚠ olsun.
5. **Ölçüm:** `cakisma_acildi`, `cakisma_cozuldu {nasil}`. Misafir ve tarih bilgisi gönderilmesin.

## 32.8 Tazelik: "her zaman güncel"

- Sunucu cron'u bütün takvimleri **10 dakikada bir** okusun.
- Uygulama şu anlarda ilgili villanın takvimlerini ayrıca yenilesin:
  - villa ekranı ya da takvim açıldığında;
  - "Rezervasyon"a basıldığında;
  - ayırma süresince her 60 sn'de;
  - Kaydet'te;
  - uygulama arka plandan öne geldiğinde.
- Takvimin üstünde küçük bir tazelik satırı olsun: **"Airbnb, Booking ✓ 2 dk önce kontrol edildi."**
  - Bir takvim 1 saattir okunamıyorsa satır kırmızı olsun: "Villasepeti 1 saattir okunamıyor". Dokununca ayar ekranı açılsın.
  - **3 saattir** okunamıyorsa sahibe push bildirimi gitsin (günde en fazla 2 kez).
- Aşağı çekip yenileme (PTR) dış takvimleri de yenilesin.

## 32.9 Test (sahte iCal sunucusuyla)

- Playwright testi için yerel bir sahte iCal sunucusu kur. Airbnb, Booking ve Diğer biçiminde 3 takvim olsun. Testin ortasında bloklar değiştirilebilsin.
- **Senaryolar:**
  1. Bağla → test et → "8 dolu gün bulundu".
  2. Boş tarih → Kaydet → kontrol listesi ✓✓✓ → kaydedildi.
  3. Form açıkken (ayırma sırasında) Airbnb'ye satış ekle → 60 sn içinde kırmızı şerit, Kaydet pasif.
  4. Dolu tarih → Kaydet → kaydedilmedi, "Bu, oradaki rezervasyon" → bağlı rezervasyon oluştu.
  5. Sadece `kapali` → uyarı → Kaydet → kaydedildi.
  6. Bir sunucu 10 sn gecikmeli → `bekliyor` → sonra boş → onay bildirimi.
  7. Kaydettikten sonra dışarıda çakışan satış çıkar → kırmızı kart → çöz → kart kayboldu.
  8. `takvim-ver` çıktısı: geçerli iCal mi? İçinde misafir adı, telefon ya da tutar var mı? **Olmamalı.**
  9. Yansıma: bizim rezervasyonumuz Booking'den `bilinmiyor` olarak birebir aynı tarihle geri gelince alarm çıkmamalı.
  10. SSRF: `https://127.0.0.1/…`, `https://169.254.169.254/…`, `http://…` reddedilmeli.
- Edge Function'lar için Deno birim testleri yaz: ayrıştırıcı, tür belirleme, SSRF kontrolü.
- Mevcut bütün testler geçmeli.

---

Her alt adımı ayrı commit'le. Netlify'a yayın yok. Edge Function deploy yok.

Bitince çok kısa bir özet yaz ve en alta test linkini koy: https://zeydusht.github.io/villa-takvimim/
