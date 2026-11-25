# Görev 44 — Akıcılık (sabit 60 FPS), başlık görseli kaybolmasın, Villalar ve Hesap görselleri yeniden

**Kurallar:**
- Veritabanına dokunma.
- Deploy etme.
- Netlify'a yayınlama.
- Her adım ayrı commit olsun, main'e push et.

**Test kuralı:**
- Kısa tut: chromium, 390 genişlik ve 320 + "Çok büyük" yazı.
- Webkit en sonda bir kez çalışsın. 10 dakikayı geçerse atla.
- Bir test 3 denemede geçmiyorsa dur, sorunu özete yaz, sonraki adıma geç.

---

## 44.1 — Başlık görseli hiçbir zaman kendiliğinden kaybolmasın

**Zeyd:** "Takvimdeyken 'Bugün'ü seçince resim kayboluyor, niye anlamadım. Bu tarz şeyler olmasın."

- **Sebep:** Bu, 37.3 / 38.1'deki "ekranda büyük boş hâl görseli varsa başlık görselini gizle" kuralı. Kullanıcıya hata gibi görünüyor.
- **Karar:** Ana sekme başlıklarında (Villalarım, Takvim, Hesap) görsel **her zaman görünsün**. Filtre, boş liste ya da veri yenilense de gizlenmesin. Bu ekranlarda boş hâl görseli ile başlık görseli aynı anda durabilir, zaten farklı resimler.
  - `baslikGorselDurum()` içindeki "boş hâl görünüyorsa gizle" kısmını kaldır.
  - "Yer yoksa küçült, en son gizle" kısmı (38.2) kalsın. O yalnızca ekran genişliğine ve yazı boyutuna bağlı, filtreyle değişmez.
- **Bölüm başlıkları değişmesin.** 39.4'teki kural (boş bölümde başlıkta çizgi ikon) **kalsın**, o farklı bir yer.
- **Genel kural (`STIL.md`'ye de yaz):** Bir filtreye ya da sekmeye dokununca, kullanıcının dokunmadığı bir başlık, görsel ya da düğme kaybolmasın, yerinden zıplamasın.
- **Test:** Takvim → Ajanda'da Bugün / 7 gün / 30 gün arasında 5 kez gidip gel. Başlık görseli her an görünür kalmalı ve konumu değişmemeli (±1 pt).

## 44.2 — Akıcılık: animasyonlar sabit 60 FPS

**Zeyd:** "Telefonda indirdiğimde direkt 60 FPS gelsin."

Bir web uygulaması FPS'i kendisi kilitleyemez, telefon belirler. Bizim işimiz **hiçbir animasyonda kare düşmemesi**. Ek olarak, iPhone'un 120 Hz ekranında App Store uygulaması 120 Hz'e kadar akıcı olabilsin.

1. **Ölç.** Playwright'ta CPU'yu 4 kat yavaşlat (`Emulation.setCPUThrottlingRate`, rate 4: orta seviye bir telefonu taklit eder). Şu hareketler sırasında `requestAnimationFrame` ile kare sürelerini kaydet:
   - sekme geçişi;
   - villa sayfasına giriş ve geri dönüş, kenardan kaydırarak geri dahil (43.2);
   - alttan açılan pencerenin açılması, kapanması ve aşağı çekilmesi (41.5);
   - akordeon ve arama adımları;
   - başlığın küçülerek üst çubuğa geçmesi (kaydırma);
   - takvimde ay değiştirme;
   - liste kaydırma.

   Her biri için ortalama ve en kötü kare süresini rapora yaz.
   - **Hedef:** karelerin %95'i 16,7 ms'nin altında olsun, hiçbir kare 50 ms'yi geçmesin.
2. **Düzelt.** Tipik sebepler:
   - **Bulanıklık (`backdrop-filter: blur`).** Pencere açılırken arka plan bulanıklaşıyor (`--morf-bulanik` 12px); telefonda çok pahalıdır. Hareket **sırasında** bulanıklık olmasın, sadece karartma (opacity) olsun. Bulanıklık hiç olmasa da olur. Ölçümle karar ver.
   - **Hareket edilen özellikler.** Sadece `transform` ve `opacity` hareket ettirilsin. `top`, `left`, `height`, `margin`, `box-shadow` ya da `clip-path`'in büyük alanda hareket ettiği yerleri dönüştür. 34.1'deki `clip-path` büyümesini de ölç.
   - **Gölgeler.** Hareket eden öğede büyük gölge varsa hareket süresince gölgeyi sabit tut ya da ayrı katmanda opacity ile göster.
   - **`will-change`.** Sadece hareket sırasında ekle, bitince kaldır. Kalıcı olursa bellek yer.
   - **Kaydırma dinleyicileri.** `scroll` ve `touchmove` dinleyicilerinde okuma ve yazma iç içe olmasın (layout thrashing). Okumaları rAF başında topla, yazmaları sonra yap (`baslikGuncelle`, 43.2 sürükleme).
   - **Uzun listeler.** Liste çizerken tek seferde `innerHTML` kullan, döngüde DOM'a tek tek ekleme.
3. **iPhone 120 Hz.** `ios/App/App/Info.plist` dosyasına `CADisableMinimumFrameDurationOnPhone` = `true` ekle. App Store uygulaması ProMotion ekranlı iPhone'larda 60 Hz'e kilitli kalmasın. Bu sadece native kabukta etkili, web sürümünü etkilemez.
4. **Android.** `android/` tarafında donanım hızlandırma açık mı kontrol et (`android:hardwareAccelerated="true"`, varsayılan zaten açık).
5. Önce / sonra kare sürelerini `docs/qa/gorev44/performans.md` dosyasına tablo olarak yaz.

## 44.3 — Villalar ve Hesap başlık görselleri yeniden çizilsin

**Zeyd'in referansı:** "Yaklaşan rezervasyonlar" görseli (`takvim-bos`: takvim + güneş gözlüğü + güneş) ve Takvim başlık görseli (`baslik-takvim`: takvim + valiz). İkisi de çok beğenildi: az sayıda büyük, tombul parça, yere oturan, yatay ve "oturaklı" duruyor.

Şimdiki sorunlar:
- `baslik-villalar` (iki villa, havuz, saksılar, şezlonglar): çok detaylı ve kalabalık. Küçük boyutta karmaşa gibi görünüyor, diğerlerinin stilinden farklı.
- `baslik-hesap` (anahtarlık): **dikey**, havada asılı gibi duruyor. İçerik oranı 0,95, diğerleri 1,24–1,31.

**İstenen:** İki yeni görsel; Takvim başlığıyla aynı stil, aynı kamera açısı ve aynı oranda.
- Görünür içerik oranı yaklaşık **1,3 : 1 (yatay)** olsun.
- Nesneler görünmez bir zemine **otursun**, altlarında yumuşak gölge olsun.
- Az parça olsun: en fazla 3 ana nesne, büyük ve tombul.

`docs/CODEX_3D_GORSELLER.md` dosyasındaki **Ortak stil** paragrafını kullan. Her isteğin sonuna şunu ekle:

> Composition must be wide and grounded: overall visible content about 1.3 times wider than tall, all objects resting on an invisible floor with one soft contact shadow, like a still life on a table. Same chunky clay style, camera angle and proportions as a desk calendar with a small suitcase next to it. Few large simple shapes, very little fine detail, readable at 64 px.

Tarifler:
- **`baslik-villalar`:** Tek, tombul bir Akdeniz villası:
  - krem duvar, terrakota çatı, koyu yeşil kapı ve panjur;
  - önünde sağda küçük turkuaz bir havuz;
  - solda saksıda tek bir yuvarlak zeytin ağacı;
  - hepsi alçak, yuvarlak köşeli tek bir kum rengi zemin parçasının üstünde.

  Pencere sayısı az, süs yok.
- **`baslik-hesap`:** Masada yatay duran üç parça:
  - koyu yeşil deri anahtarlık;
  - ona altın halkayla bağlı, ev biçimli krem bir anahtar;
  - yanda dik duran küçük, yuvarlak köşeli krem bir "profil kartı": üzerinde yeşil, yüzsüz bir kişi silueti, yazı yok.

  Anahtar ve anahtarlık yatık dursun, dikey sarkmasın.

**Süreç:**
- Her görsel için **3 aday** çizdir: `-a`, `-b`, `-c`.
- Dekupe et: şeffaf arka plan, zemin dairesi olmasın.
- 36'daki gibi kırp. `-512.webp` ve `-256.webp` boyutlarını üret.
- En iyi adayı (yukarıdaki kurallara en çok uyanı) uygulamaya koy.
- 3 adayın ve eski görselin yan yana durduğu bir karşılaştırma görüntüsünü `docs/qa/gorev44/` klasörüne koy: `secim-villalar.jpg`, `secim-hesap.jpg`. Arka planda Takvim başlık görseli de olsun, uyum görülsün.
- Diğer adayları `www/img/3d/aday/` klasöründe sakla. Zeyd başka birini seçerse dosya adı değiştirilerek kullanılabilsin.
- İstekleri `docs/CODEX_3D_GORSELLER_3.md` dosyasına ekle.

**Kontrol:**
- Üç başlık görseli (Villalar, Takvim, Hesap) üç sekmede de aynı görsel ağırlıkta ve aynı yükseklikte dursun.
- İçerik oranları 1,2–1,4 arasında olsun. Bunu otomatik ölç (alfa kanalından içerik kutusu).
- 40.3'teki "üst çubuğa en az 12 pt boşluk" kuralı geçerliliğini korusun.

## 44.4 — Bitiş

- `docs/PROJE_DURUMU.md` dosyasına Görev 44'ü ekle.
- Mesajının en altına çok kısa özet yaz. 44.2 için en kötü hareketin önce/sonra kare süresi de özette olsun. Altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
