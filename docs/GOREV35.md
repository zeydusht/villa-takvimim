# GÖREV 35 — 3D görseller her yerde, canlı misafir sayfası

Zeyd 3D görselleri çok beğendi ("buradaki gibi uygulamanın içinde de olsun"). Ayrıca misafir sayfasının (paylaşılan villa linki) **her zaman güncel** olmasını istiyor.

**Veritabanı `docs/VERITABANI_GOREV35.sql` UYGULANDI (canlıda çalışıyor). Sen çalıştırma.** Kullanacağın fonksiyon:
- `villa_doluluk(p_ad text)` → `{zaman, dolu:[[bas,bit],…], opsiyon:[{b,s,son}]}`
- Herkese açık (anon). Sadece tarihler döner. Bitiş günü dahil değil (çıkış günü).

Önceden yapılanlar (ürün yöneticisi, push edildi; önce `git pull`):
- Arama rehberine "Kaç kişi?" adımı eklendi. Kişi sayısı seçilirse kapasitesi yetmeyen villalar zaten gösterilmiyordu (`maAra`).
- Villa sayfası JSON'u artık 30 sn önbellekte kalıyor (eskiden 1 saat).

---

## 35.1 Yeni 3D görselleri çizdir

`docs/CODEX_3D_GORSELLER_2.md` dosyasındaki 12 görseli ilk setle aynı yöntemle çizdir:
- her görsel için ayrı bir `codex exec --full-auto` komutu;
- ilk setteki "Ortak stil" paragrafı birebir;
- şeffaf PNG, ardından webp.

**Repoya sadece webp'leri ekle.**

## 35.2 Kurulum sihirbazı 3D olsun

- `SH_CIZIM` listesindeki düz çizimlerin yerine 3D görseller gelsin:
  - `hosgeldin`, `sh-kapasite`, `sh-ozellikler`, `sh-fiyat`, `sh-foto`, `sh-iletisim`, `sh-sayfa`;
  - "Villanız hazır!" ekranında `hazir`.
- Dosya yolu `img/3d/<ad>-512.webp`.
- Görsel yüklenemezse eski düz çizim gösterilsin.
- Fotoğraf ekranındaki `#fotoCizim` (`bos-foto`) da `sh-foto` olsun.
- Bütün görseller yerleştikten sonra eski düz webp'leri (`www/img/bos-*.webp`, `www/img/sihirbaz-*.webp`) sil. **Kodda başka yerde kullanılmadığını grep ile doğrula.**

## 35.3 Ana sekmelerde küçük başlık görseli

- Villalarım, Takvim ve Hesap ekranlarında büyük başlığın (h1) sağına 64 pt bir 3D görsel koy:
  - `baslik-villalar`, `baslik-takvim`, `baslik-hesap`;
  - `-256.webp` kullan.
- Başlık ve görsel aynı satırda, görsel dikey ortalı olsun. Villalarım'daki "1 dolu / 1 boş" hapları yer kalmazsa alt satıra insin, üst üste binmesin.
- Kayınca başlık küçülürken (34.2) görsel de başlıkla birlikte solsun.
- Büyük yazı boyutunda ve iPhone SE'de görsel 48 pt'ye küçülsün.
- Gece modunda arkasına `--soft` yuvarlak bir zemin koy.

## 35.4 Boş hâl görseli rezervasyon gelince tamamen kaybolmasın

Bugün villa ekranında "Yaklaşan rezervasyonlar" boşken büyük takvim görseli çıkıyor, rezervasyon girilince kayboluyor. Zeyd görselin kalmasını, rezervasyonların altında görünmesini istiyor.
- Liste doluyken bölüm başlığının sağında aynı görselin **küçük** hâli (40 pt) dursun.
- Liste boşken büyük hâli (160 pt) dursun, bugünkü gibi.
- Bu kuralı 3D eşlemesi olan **bütün** liste bölümlerine uygula (`bosHal` → `BOS_3D`): Misafirler, Teklifler, Ödemeler, Bakıcılar, Gelir & gider.

## 35.5 Misafir sayfası canlı doluluk (g.html)

**Bugünkü sorunlar:**
- Bakıcının girdiği rezervasyon, sahip uygulamayı açana kadar sayfada görünmüyor.
- **Airbnb, Booking ve diğer sitelerden gelen dış satışlar sayfada hiç görünmüyor.** Misafir satılmış günü boş görüyor. Bu önemli.

**Yapılacaklar:**
- `g.html`, JSON'u yükledikten sonra `rpc/villa_doluluk` çağırsın: `{p_ad: jeton}`, anon anahtar ile.
- Gelen `dolu` aralıklarını takvimdeki tam / yarım günlere çevirsin (uygulamadaki kural):
  - giriş günü öğleden sonra dolu (yarım);
  - çıkış günü sabah dolu (yarım);
  - aradaki günler tam dolu.
- Bu bilgi JSON'daki `dolu` / `yarim` / `opsiyon` alanlarının **yerine** geçsin. JSON'dakiler sadece RPC çalışmazsa yedek olarak kullanılsın.
- **Sayfa açıkken her 60 sn'de** ve sekme tekrar görünür olunca (`visibilitychange`) yeniden çağrılsın. Değişiklik varsa takvim yeniden çizilsin, seçim korunsun.
- Misafirin seçtiği aralık bu sırada dolarsa altta kırmızı bir uyarı çıksın: "Seçtiğiniz tarihlerin bir kısmı az önce doldu." ve seçim temizlensin.
- Takvimin altında küçük bir satır olsun: "Uygunluk canlı · 1 dk önce güncellendi".
- Teklif sayfası (`?teklif=`) için de aynı geçerli: teklifteki tarihler dolduysa "Bu tarihler artık müsait değil" yazsın.

## 35.6 Misafir sayfasına 3D görseller

- "Uygunluk" bölüm başlığına `misafir-uygunluk` görseli (64 pt).
- WhatsApp ile rezervasyon bölümüne `misafir-iletisim`.
- Size özel teklif kartına `misafir-teklif`.
- `g.html`'in kendi stiline uysun. Görseller `loading="lazy"`, yoksa hiçbir şey gösterilmesin.

## 35.7 Test

- Sahte veriyle:
  - dış satış (`dis_bloklar`) misafir sayfasında dolu görünüyor mu?
  - 60 sn sonra yeni rezervasyon beliriyor mu?
  - seçili aralık dolunca uyarı çıkıyor mu?
- iPhone SE, normal ve "Çok büyük" yazı: başlık görselleri taşıyor mu?
- Gece modu.
- Mevcut testler geçmeli.

---

Her alt adımı ayrı commit'le. Netlify'a yayın yok. Edge Function deploy yok.

Bitince çok kısa özet yaz, en alta 3 yeni görseli ve test linkini koy: https://zeydusht.github.io/villa-takvimim/
