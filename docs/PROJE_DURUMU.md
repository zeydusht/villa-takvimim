# Villa Takvim — Proje Durumu

_Son güncelleme: 14 Kasım 2026_

## Ne bu?
Villa Takvim'in (villatakvim.netlify.app) iPhone/Android uygulaması. App adı: **Villa Takvimim**.
Repo: github.com/zeydusht/villa-takvimim (public; Claude GitHub App kurulu).
Site kodu **baştan yazılmadı**; Capacitor ile aynı HTML bir app kabuğuna sarıldı.
Veritabanı aynı: Supabase "VillaTakvim Project" (qmfyqixilkvcvidigngt).

## Klasörler
- `www/` → uygulamanın kendisi (siteyle aynı dosyalar). Netlify de bu klasörü yayınlar (`netlify.toml`).
  - `www/native.js` → YENİ. Sadece app içinde çalışır, sitede hiçbir şey yapmaz:
    dış linkler (WhatsApp, gizlilik vb.) app içinde açılır, üst durum çubuğu rengi ekrana göre değişir, Android geri tuşu.
- `ios/` → iPhone projesi (Xcode). Bundle ID: `com.zeydtekin.villatakvim`
- `android/` → Android projesi
- `assets/` → ikon ve açılış ekranı kaynak görselleri (`npx capacitor-assets generate` ile yeniden üretilir)
- `.github/workflows/` → bulutta derleme
  - `android.yml` → her gönderimde deneme APK'sı (Actions sekmesinden indirilir)
  - `ios.yml` → her gönderimde iPhone derlemesi; Apple anahtarları ekliyse TestFlight'a yükler

## Siteye göre değişenler
1. `index.html` → `native.js` yükleniyor; app içinde bildirim ayarında "bir sonraki sürümde" yazıyor
2. `dil.js` → bu yazının İngilizcesi eklendi

## Kod değişince
`www/` içinde düzenle → `npx cap sync` → GitHub'a gönder → derlemeler kendiliğinden başlar.

## Bekleyenler (Zeyd'den)
- [x] GitHub repo açıldı, kod gönderildi; Android APK ve iOS derleme kontrolü başarılı (7 Kasım)
- [ ] App Store Connect'te uygulama kaydı (bundle ID: com.zeydtekin.villatakvim)
- [ ] App Store Connect API anahtarı (Admin) + Team ID → GitHub repo Secrets:
      `APPLE_TEAM_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`
- [ ] Veritabanı Adım C: canlı site (villatakvim.netlify.app) yeni sürüme geçirildikten SONRA Claude
      sohbetten yapacak. Önce yapılırsa canlı sitede fotoğraf yükleme çalışmaz.
      **Not (14 Kasım): Netlify güncellendi, artık yapılabilir — Claude yapacak.**

## İnceleme raporu (7 Kasım)
Bulgular ve öncelik sırası claude.ai'daki "Villa Takvimim — Uygulama İnceleme Raporu" dokümanında.

## Test linki
https://zeydusht.github.io/villa-takvimim/ — GitHub Pages, main'e her gönderimde güncellenir.
Gerçek veritabanına bağlı. Canlı site (villatakvim.netlify.app) de 14 Kasım'dan beri yeni sürümde.

## Yön ve kararlar (Zeyd, 7 Kasım)
- **14 Kasım: Netlify yeni sürümde; her görevden sonra deploy edilir** (`npx netlify-cli deploy --prod --dir www`).
  Misafir paylaşım linkleri villatakvim.netlify.app'e gidiyor, site her zaman GitHub ile aynı tutulur.
  Proje klasörü villatakvim sitesine bağlı (`.netlify/`, GitHub'a gönderilmez). Canlıda sw.js sürümü kontrol edilir.
  Hedef yine **uygulama**: istenen sürüme getirip **TestFlight**'a atmak.
- **Çalışma felsefesi:** Sürekli iterasyon. Her turda ekranlara ilk kez kullanan biri gözüyle bakılır:
  ne eklenebilir, ne daha iyi olur, ne kötü görünüyor, ne karmaşık, ne kullanışsız, ne okunmuyor.
  Claude (ürün yöneticisi) bunları bulur ve Claude Code'a net mesaj yazar; Zeyd yapıştırır; Claude
  GitHub'dan çekip test eder, ekran görüntüsü gösterir; tekrar. Tarz: sade, net, "uçak güvenlik kartı"
  gibi tek bakışta anlaşılır; yazılar kalınlaştırılmaz, tıklanabilir öğeler çerçeveli.

## SIRADAKİ ADIMLAR
1. **Sürekli UX iterasyonu (ŞU ANKİ İŞ).** Yukarıdaki felsefe: ekranları ilk kez kullanan gözüyle gez,
   karmaşık / kullanışsız / okunmayan yerleri bul, Claude Code mesajı yaz, test et, tekrarla.
2. Fotoğrafsız villada "Drive'dan al"a ulaşılamıyor → düzeltme mesajı yazılmıştı, yapıldı mı kontrol et.
3. Bakıcı para bilgisini veritabanında kapatma (plan Zeyd'in onayına sunulacak).
4. **TestFlight — SADECE Zeyd "hazırız" deyince.** Uygulama bitmeden kurulmayacak.
   Kurulum notu: App Store Connect'te uygulama kaydı (bundle ID com.zeydtekin.villatakvim,
   ad "Villa Takvimim"), App Store Connect API anahtarı (Admin) + Team ID → GitHub repo Secrets
   (APPLE_TEAM_ID, ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8). ios.yml anahtar ekliyse otomatik yükler.
   Zeyd'e İngilizce menü adlarıyla adım adım anlat (konsol İngilizce).

## Çalışma şekli
Claude (sohbette) ürün yöneticisi: `docs/GOREVLER.md`'den bir bölüm seçip Claude Code'a mesaj yazar.
Zeyd mesajı Claude Code'a yapıştırır (yerel klasör: İndirilenler\Villa Takvimim). Claude Code
uygular, GitHub'a gönderir ve durur. Zeyd "bitti" der; Claude GitHub'dan çekip sahte veriyle
telefon boyutunda test eder, önce/sonra gösterir, sonraki bölümün mesajını yazar.

## İlerleme (GOREVLER.md)
- [x] 1. bölüm — app katmanı (1.6 bildirimler hariç) · test edildi
- [x] 2. bölüm — hatalar · test edildi. Karar: bakıcı sadece "girişte alınacak" kalan tutarı görür;
      bakıcının eklediği rezervasyonun tutarı gecelik fiyatlardan otomatik hesaplanır.
- [x] 3. bölüm — görsel tasarım · test edildi (rezervasyon detayı belirgin iyileşti; ana ekran
      düzeni 4. bölümde)
- [x] 4. bölüm — ekran düzeni · test edildi (kompakt kartlar, alt sekme barı, Pt-Pz, baş harfler)
- [x] Zeyd'in isteği (7 Kasım, yapıldı ve test edildi): yazılar kalın değil, butonların ÇERÇEVESİ belirgin olsun. Tıklanabilir
      kart/satır/butonlar 2px koyu (#5F6A64) çerçeve, basınca yeşil çerçeve + açık yeşil zemin +
      hafif küçülme (banka uygulaması netliği). Claude Code'a gönderildi.
- [x] Villa ekranı boş durumu · test edildi. Düzeltme Claude Code'a gönderildi: kurulum kartı
      rezervasyonu olan villada kapalı tek satır + takvimin altına; "+ Rezervasyon" butonu tek satır.
      (Eski not:: kurulum kartı (fiyat · fotoğraf ·
      bilgiler · paylaş), hızlı işlem butonları, ay özeti kutuları, takvim iyileştirmeleri,
      "boş günleri WhatsApp'tan paylaş". Mesajı sohbette yazıldı.)
- [ ] 5. bölüm — küçük kazanımlar
- [ ] 1.6 — telefon bildirimleri (Firebase/Apple anahtarı gerekecek)
- [x] Fiyat girme yeniden tasarımı · test edildi: sarı "fiyat modu" kalkar, ayrı "Fiyatlar"
      ekranı, "Aylar" (12 ay listesi, aya dokun → tüm aya fiyat, hafta sonu ayrı fiyat, çoklu ay seçimi)
      ve "Günler" (takvimde gün seç → fiyat gir) sekmeleri, son kullanılan fiyatlar, "Geri al".
- [x] Fotoğraflar ekranı · test edildi: villa ekranında ilk 3 foto + "+X", ayrı Fotoğraflar
      ekranı (3'lü ızgara, kapak etiketi, basılı tut-sürükle sıralama, çoklu seçip silme, tam ekran
      görüntüleme + kapak yap). Bakıcı silemez/sıralayamaz.
- [x] Drive'dan fotoğraf alma · TAMAM (arayüz test edildi, sahte klasörle). GOOGLE_API_KEY Zeyd tarafından eklendi.
      Açık: fotoğrafsız villada Drive'a ulaşılamıyordu → düzeltme Claude Code'a gönderildi. Zeyd gerçek
      klasörle denedi: ÇALIŞIYOR (7 Kasım). · sunucu fonksiyonu yazıldı: supabase/functions/drive-aktar/index.ts
      SUPABASE'E YÜKLENDİ (7 Kasım, Claude, Zeyd onayıyla; verify_jwt açık).
      Zeyd: Google Cloud'da API anahtarı + Supabase'de GOOGLE_API_KEY sırrı. Arayüz Claude Code'a gönderildi.
      (Eski not: Plan: kullanıcı
      herkese açık Drive klasör linkini yapıştırır → Supabase edge function (girişli + villaya erişim
      kontrolü, Google API anahtarı sır olarak) klasördeki görselleri listeler ve indirmeyi aracılık
      eder → istemci mevcut küçültme akışıyla (fotoHazirla) yükler, ilerleme gösterir, üst sınır ~60.
      Zeyd'in Google Cloud'da Drive API anahtarı oluşturması gerekecek (adım adım anlatılacak).)
- [x] Villa silme güvenliği · test edildi: buton Villa bilgileri altına, adı yazarak onay,
      "Geri al", Hesap → Silinen villalar (30 gün). Veritabanı: villalar.silindi_tarih sütunu EKLENDİ
      (7 Kasım, Zeyd onayıyla). 30 gün sonra kalıcı silmeyi uygulama yapar (sahip açınca).
      Not: canlı Netlify sitesi eski sürüm, bu alanı bilmiyor.
- [x] Gelir & gider sadeleştirme + kalıcı alt menü · test edildi: tek net kazanç kartı +
      açıklama, 3 etiketli satır (Alınan / Alınacak / Giderler), 12 aylık SVG çubuk grafik, rezervasyon
      satırlarında Ödendi/Kısmen/Ödenmedi/Tutar girilmedi etiketleri, ortalama gecelik fiyat hesabı
      düzeltmesi (500 ₺ hatası), yeşil seçici. Alt menü iç ekranlarda da kalır (Villalar seçili).
- [x] Gelir & gider hızlı ekleme · test edildi: satırlarda "+" butonları, hazır gider düğmeleri
      (Temizlik, Havuz bakımı…), son tutar önerisi, kaybolan başlık. KONTROL: Zeyd'in ekranında Villa
      Salta 2026 her şey 0 ₺ görünüyordu (önce 5.000/30.000/1.000 vardı) — hata olabilir, test et.
- [ ] Küçük düzeltmeler (mesajı yazıldı): alt menünün arkasından içerik/grafik çubuğu görünüyor
      (menü zemini opak + üstte olsun); kurulum kartındaki "Gizle" 24px, 44px olsun.
- [x] GOREVLER.md 6. bölüm — "ilk kez kullanan anlasın" (11 madde: Takvim sekmesi boş, tek terim
      "Kalan ödeme", rezervasyon adım şeridi, sade form, ödeme paneli, Türkçe tarih, Hesap düzeni,
      karşılama kartı…) · Claude Code'a gönderilecek
- [x] Veritabanı güvenlik düzeltmeleri — 1. bölüm (Claude, 7 Kasım).
      Fotoğraflar artık <villa id>/f/ klasörüne yükleniyor.
- [x] Bakıcı para bilgisi veritabanında da kapatıldı (Claude, 7 Kasım).
      Bakıcı kalan tutarı bakici_kalanlar fonksiyonundan alır; tutarı sunucu hesaplar; bakıcı sadece kendi giderlerini görür.
- [ ] SIRADAKİ: Claude bakıcı hesabıyla test edecek, sonra 5. bölüm küçük kazanımlar.
- [x] Görev 7 — İlk kullanım turu 2 (docs/GOREV7.md, 16 madde) · Claude Code yaptı, sahte veriyle test edildi.
      Takvim sekmesi Bugün/7 gün/30 gün + "Şu an konaklayan"; "gelir" sadece alınan para ("Bu ayın rezervasyonları");
      yazılar kalın değil; yazı alanları çerçeveli kutu, etiketler normal yazı; sayı alanlarında örnek yazı yok;
      özellik düğmeleri ve misafir satırları çerçeveli; "Seç" → "Birden fazla (ay) seç" butonu; kesilen yazılar düzeldi;
      "Fiyat girilmedi" gri; yüzde "%53"; doluluk ilk rezervasyondan; rezervasyon detayında "Ödeme al" en üstte,
      ön ödeme "… eksik / ✓ alındı"; Ödeme al panelinde Toplam·Alınan·Kalan kutuları, "Ön ödeme kalanı" düğmesi,
      alınan ödemeyi düzenleme; tekrar eden butonlar kalktı; boş villada boş kutular, "—" ve hafta sonu gölgesi yok;
      "3 misafir", "Şu an konaklıyor · çıkış …", ana ekran hatırlatması "Çıkış 9 Kasım · … alınacak", avatar "Villa"yı atlar.
      Kalan: GOREV7 "Sonra" listesi (Zeyd seçecek).
- [x] Görev 8 — para hesabı, kurulum rehberi, gezinme (docs/GOREV8.md, 19 madde) · Claude Code yaptı (8 Kasım),
      sahte veriyle test edildi.
      - Para: tek kural (konaklama ücreti = geceler + kısa konaklama; depozito ayrı, gelir değil; toplam = ikisi;
        kalan = toplam − alınan). "Ön ödeme" ve "İndirim" kalktı; tek kavram "Kapora" (villada "Önerilen kapora %").
        Eski kayıtlar açılışta taşınır: indirim tutardan düşülür; tarihli "depozito alındı" → "depozito" notlu ödeme.
      - Rezervasyon formunun en üstünde ücret kartı + "Fiyatı mesajla gönder"; kapora + canlı "Kalan ödeme".
      - Detay sade ("12.000 ₺ alınacak" / "✓ Ödemenin tamamı alındı"); "Alınan ödemeyi gir"; kalan depozito dahil.
      - Çıkışta depozito iadesi kartı (İade ettim / Bir kısmını kestim / Hiç iade etmedim); kesilen gelir sayılır;
        Takvim'de "Depozito iadesi bekliyor". Gelir & gider yeni kurala uydu.
      - Kurulum sihirbazı (6 adım, tam ekran, kaldığı yerden devam), villa bilgilerinde "Fiyat ve iletişim" üstte,
        özelliklere emoji (www/ozellik.js, misafir sayfası da kullanır), 4 kutulu fotoğraf alanı, "Villa sayfanız" kartı.
      - Hitap "Hasan Bey / Beyza Hanım" (www/adlar.js ~690 ad), misafir kartında "Bey / Hanım / Sadece ad".
      - Takvim'den detay Takvim'in üstünde açılır; destekten çıkınca Hesap → kullanıcıya dönülür; Takvim'de
        "Giriş/Çıkış" etiketleri ve "Bugün/Yarın/2 gün sonra çıkış".
      - Destek modu: üstte sarı şerit; uygulama tarafında sahip gibi tam yetki (veritabanı izni aşağıda).
      - Bakıcı daveti bağlantılı (UYGULAMA_ADRESI sabiti, şimdilik GitHub Pages); ?davet=KOD hatırlanır, girişte katılır.
      - X butonları çerçeveli + basınca dolan daire. Misafir sayfası: "Seçimi temizle" hatası düzeldi, toplamda depozito yok.
      Kalan / emin olunamayan:
      - Depozito iadesi seçimi ve hitap seçimi şimdilik SADECE o cihazda saklanıyor (veritabanında yeri yok, aşağıda).
      - "Fiyat için sorun" nedeni kesinleşmedi: büyük ihtimalle yayınlanmış sayfa dosyası güncellenemiyor (depo izni).
        Artık güncellenemezse villa ekranındaki "Villa sayfanız" kartında kırmızı yazıyla görünüyor.
      - Bakıcının gördüğü kalan tutar sunucuda hesaplanıyor; yeni kurala uyması için aşağıdaki değişiklik gerekli.

- [x] Görev 8 sonrası giriş hatası düzeltildi (davetBekleyenKullan kapsam hatası).

- [x] Görev 9 — his ve hız (docs/GOREV9.md, 10 madde) · Claude Code yaptı (14 Kasım), sahte veriyle test edildi.
      Hareket süreleri tek yerde (--hiz-bas 100 / --hiz-ac 220 / --hiz-kapa 180 / --hiz-ekran 200 ms; hiçbiri 300ms üstü değil).
      Kaydedince panel hemen kapanır, kayıt arkada gider; buluta yazılamazsa "Tekrar dene" + "Değişikliği geri al".
      "Yükleniyor…" yerine gri iskelet satırlar (400ms'den kısa yüklemede görünmez). Başarı bildirimleri "✓ …" ve
      aşağıdan belirip solar; ödeme sonrası detaya dönülür ve değişen satır bir kez yeşil parlar.
      Gerçek titreşim: @capacitor/haptics (VTNative.titret): başarı / uyarı / silme; Hesap → Titreşim aç/kapa (yalnız uygulamada).
      Paneller aşağıdan kayar, arka plan %40 kararır, aşağı çekerek kapanır. Yeni rezervasyon takvimde parlar; listelere
      eklenen satır yukarıdan açılır. Sihirbaz adımları sağdan/soldan kayar. Alt menü, seçiciler, aç-kapa düğmeleri hareketsiz;
      ay değişince kısa solma. "Hareketi Azalt" açıksa kayma/büyüme yok. Dokunma alanları en az 48px; "Gizle",
      "Şimdilik atla", "değiştir", "Şifremi unuttum", "Seçimi temizle" çerçeveli küçük butonlar.
      Denenecek: telefonda titreşim (APK / iPhone), panel aç-kapa ve aşağı çekerek kapatma, sihirbaz geçişleri.

- [x] Görev 10 — netlik ve vurgu (docs/GOREV10.md, 16 madde) · Claude Code yaptı (14 Kasım), sahte veriyle 390 ve 320px'te test edildi.
      10.16: Netlify'a yüklendi (14 Kasım); canlıda sw.js sürümü "vt-2026-11-14-g10", paylaşım linki yeni misafir sayfasını açıyor.
      Renk sistemi: koyu yeşil = ana eylem / dolu / tamam; açık yeşil + yeşil çerçeve = ikincil eylem; turuncu = boş / eksik;
      kırmızı sadece alınacak para ve hata. Villa ekranı: çerçeveli başlık kartı (ad, konum, "● Dolu · Ad" / "● Boş" etiketi),
      "+ Rezervasyon" dolu yeşil, "Fiyat gir"/"Paylaş" açık yeşil; "Bu ay N gece boş" butonların altında açık turuncu satır.
      Ay özeti "BU AY · X ₺ alındı", yazılar kesilmez. Geri ve ay okları 44px yuvarlak çerçeveli, basınca dolar. Geçmiş günler soluk
      (dolu blok %50). Bölüm başlıkları her yerde normal yazımla, 19px, koyu. Yaklaşan rezervasyonlar çerçeveli kartlar,
      "Sıradaki 6", 7 günden yakına turuncu "N gün sonra", 6'dan fazlaysa "Tümünü gör (N)" (ay ay gruplu panel).
      Kurulum durumu sihirbazın 6 adımına göre (ad+konum, kişi/oda, özellik, fiyat, fotoğraf, WhatsApp+paylaşım):
      "Villa bilgileri" satırı "✓ Tamam" ya da "Eksik · 4/6" (dokununca sihirbaz eksik ilk adımdan); sihirbazda
      "Tüm villa bilgileri" butonu (villa silme vb. her zaman ulaşılır). "Gizle" kartı tek satıra küçültür ("Villa kurulumu · 4/6 · Göster"),
      6/6 olunca kart kalkar. Misafirler/Gelir & gider/Bakıcılar satırlarında sayı yok. Ana ekran: "● 1 dolu" / "● 2 boş"
      etiketleri listeyi süzer; villa kartlarında aynı etiket. Alt menüde kayan açık yeşil kabarcık (dokununca kayar,
      sürükleyince parmağı izler). Misafir sayfası fiyat özeti: "3 gece" (farklı fiyatlarda dokununca gece gece döküm),
      "+ kısa konaklama", "Toplam" depozitosuz, altında depozito notu; seçim kutusu ve "Kaç kişi" panelinde aynı.
      iPhone'un tarihleri bağlantı gibi altını çizmesi kapatıldı (format-detection). sw.js sürümü artırıldı.
      Denenecek: villa ekranının üstü, alt menü kabarcığı (dokunarak ve sürükleyerek), kurulum kartını gizleyip geri açma,
      ana ekrandaki dolu/boş etiketleri.

- [x] Görev 11.9 — çizimler (14 Kasım) · 6 görsel Codex CLI ile üretildi (docs/CODEX_GORSELLER.md), 800px WebP (19–51 KB) olarak
      `www/img/` içinde: bos-villa (ana ekran "Hoş geldiniz" üstü), bos-rezervasyon (rezervasyonsuz villa), bos-foto (fotoğrafsız villa),
      sihirbaz-hosgeldin (sihirbaz 1. adım), sihirbaz-hazir ("Villanız hazır!"), bos-takvim (Takvim sekmesinde olay yoksa).
      Netlify'a yüklendi. Görev 11'in diğer maddeleri bu turda yapılmadı.

## Veritabanı için gerekenler (Görev 8) — YAPILDI (8 Kasım, Claude)
Kayıt: docs/VERITABANI_GOREV8.sql. Uygulama tarafı da bağlandı (8 Kasım, Claude Code).

1. ✅ **Depozito iadesi kalıcı.** rezervasyon_mali'ye 4 sütun eklendi; uygulama okuyup yazıyor (bakıcı yazmaz).
   Cihazda kalmış eski seçimler ilk açılışta veritabanına aktarılıp cihazdan siliniyor.
   ```sql
   alter table rezervasyon_mali
     add column if not exists depozito_durum text check (depozito_durum in ('iade','kesildi','tutuldu')),
     add column if not exists depozito_kesilen numeric default 0,
     add column if not exists depozito_not text,
     add column if not exists depozito_islem_tarih date;
   ```
2. ⏭️ **Gerek kalmadı, eski kayıt yoktu.** (Taslak kayıt için:) Eski "depozito alındı" kayıtlarını tek seferde taşı (uygulama sahibin cihazında da taşıyor; sunucu tarafı bakıcı hesabı için):
   ```sql
   insert into odemeler (id, villa_id, rezervasyon_id, tutar, tarih, aciklama)
   select gen_random_uuid(), m.villa_id, m.rezervasyon_id, m.depozito_tutar, m.depozito_tarih, 'depozito'
   from rezervasyon_mali m
   where m.depozito_tarih is not null and m.depozito_tutar > 0
     and not exists (select 1 from odemeler o where o.rezervasyon_id = m.rezervasyon_id
                     and o.aciklama = 'depozito' and o.tutar = m.depozito_tutar);
   update rezervasyon_mali set depozito_tarih = null where depozito_tarih is not null;
   ```
   Not: `depozito_tutar` artık "bu rezervasyonun depozito tutarı" demek (alındı işareti değil); `depozito_tarih` kullanılmıyor.
3. ✅ **bakici_kalanlar yeni kurala göre güncellendi:**
   kalan = tutar + ek_ucret + coalesce(depozito_tutar, (villalar.bilgi->>'depozito')::numeric, 0) − sum(odemeler.tutar)
   (0'dan küçük değil); depozito = kalanın depozito kısmı = least(depozito, greatest(0, kalan − greatest(0, tutar + ek_ucret − odenen))).
   `depozito_tarih`'e bakmasın. İndirim sütunu kullanılmıyor.
4. ✅ **Destek modunda yönetici tam yetkili** (gelirler ve fiyatlar için yazma izni eklendi; uygulama zaten hazırdı): destek oturumu açık yöneticiye bu villa için `villalar` (update),
   `rezervasyonlar`, `rezervasyon_mali`, `odemeler`, `fiyatlar`, `giderler`, `gelirler`, `villa_fotograflar`
   üzerinde select/insert/update/delete izni (mevcut destek kaydı/fonksiyonuyla koşullu). Uygulama hazır; izin yoksa
   kayıtta "Buluta kaydedilemedi" hatası çıkar. Villa silme destek modunda bilerek kapalı.
5. ⏳ **Hitap kalıcı olsun (henüz yapılmadı):** `alter table misafir_notlari add column if not exists hitap text check (hitap in ('bey','hanim','ad'));`
   Sonra veri.js'te okunup yazılacak (şu an cihazda: villa-takvim-hitap).
6. ⏳ **Villa sayfası güncellenebiliyor mu? (kontrol edilecek)** Sahip, `galeri/<ad>.json` dosyasının ÜZERİNE yazabilmeli (upsert/update izni).
   "Fiyat için sorun" şikâyetinin en olası nedeni bu; kontrol edilmeli.

## Sonraki fazlar
- Bakıcı davet bağlantısı yüklü uygulamayı doğrudan açsın (iOS universal link / Android app link). Şimdilik web adresi açılır.
- UYGULAMA_ADRESI (index.html) şu an GitHub Pages test adresi; kalıcı adres belli olunca değiştirilecek.
- **Faz 3 / bildirimler:** Web Push app içinde çalışmıyor. Firebase/APNs ile native bildirim
  (@capacitor/push-notifications) + Supabase edge function'ı buna göre güncellemek.
- Şifre sıfırlama e-postası şu an siteye yönlendiriyor (çalışıyor ama app'e dönmüyor) → ileride deep link.
- App Store incelemesi için app'e özel özellikler (Apple "sadece site" uygulamalarını reddedebilir).
- Paylaş (navigator.share) ve PDF dışa aktarma gerçek iPhone'da test edilecek.
