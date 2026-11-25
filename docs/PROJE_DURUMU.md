# Villa Takvim — Proje Durumu

_Son güncelleme: 25 Kasım 2026_

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
      Not (14 Kasım, GOREV11 madde 11.10'daki bilgiye göre — sohbetteki Claude): "eski klasörsüz yola yükleme kapandı
      (galeri_yukleyebilir: else → yalnız yönetici). Eski dosyalar okunmaya devam ediyor." Claude Code veritabanına bakmadı,
      bunu doğrulamadı; kutu, Zeyd veya sohbetteki Claude doğrulayınca işaretlenmeli.

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
      Netlify'a yüklendi.

- [x] Görev 11 — renk ve ikon sistemi (docs/GOREV11.md, 11.1–11.8 ve 11.11) · Claude Code yaptı (14 Kasım), sahte veriyle test edildi.
      Lucide ikonları `www/ikonlar.js` içine gömülü (72 ikon, 14 KB, internetsiz çalışır): `ikon("cuzdan",{boy:22})`;
      iş → renk/ikon tablosu tek nesnede (`IS`). HTML'de `data-ik` (buton ikonu), `data-ikk="iş:ikon"` (satır ikon kutusu),
      `data-iki` (başlık ikonu) yazılır, küçük bir gözlemci ikonu yerleştirir. Elle yazılmış SVG'ler ikon()'a taşındı (logo ve grafik hariç).
      Dört buton türü: ana (dolu yeşil, ekranda en fazla 1) · renkli (iş rengi zemin/çerçeve/ikon) · sade (beyaz; sadece Vazgeç/Geri/Kapat/Tümünü gör türü) ·
      tehlikeli (beyaz, kırmızı çerçeve + çöp ikonu, hep en altta). Satırlar iPhone Ayarlar gibi: 36×36 renkli ikon kutusu, aynı bölüm tek kartta.
      Rezervasyon satırları: misafir renginde baş harf, yeşil giriş / gri çıkış ikonu, kalan ödeme altın cüzdan + kırmızı tutar.
      Detayda giriş/çıkış/kişi/telefon/not ikonlu; "alınacak" altın cüzdan, "tamamı alındı" yeşil tik. Ay özeti kutuları renkli.
      Alt menüde seçili sekmenin ikonu dolu. Kırmızı dolu "Evet, sil" onayları tehlikeli butona çevrildi (Vazgeç üstte, sil en altta).
      **11.11 sayım:** `grep -c "big ghost" www/index.html` = **15** (önce 67). Ekran ekran beyaz (sade) buton:
        Ana ekran 0 · Villa ekranı 1 (Tümünü gör; 6'dan fazla rezervasyonda) · Takvim sekmesi 0 · Hesap 0 · Hesabım 0 · Kullanıcılar 0 ·
        Silinen villalar 0 · Rezervasyon detayı 0 · Yeni rezervasyon 0 · Rezervasyonu düzenle 0 · Alınan ödemeyi gir 0 ·
        Ödeme kaydı 1 (Vazgeç) · Toplam tutar 0 · Rezervasyon formu 0 · Teklif hazırla 0 · Gelir & gider 0 · Gelir/Gider ekle 0 ·
        Gelir/gider kaydı 1 (Kapat) · Kalan ödemeler 0 · Giderlerim 0 · Depozitodan kesilen 0 · Fiyatlar 0 (seçim modunda 1: Temizle) ·
        Fotoğraflar 0 · Fotoğraf ekle 0 · Google Drive'dan al 0 (yüklerken 1: Durdur) · Villa bilgileri 0 · Villa sayfası/Paylaşım 0 ·
        Bakıcılar 0 · Davet kodu 0 · Misafirler 0 · Kurulum sihirbazı 1 (Geri) · Silme onayları 1 (Vazgeç).
        Her ekranda en fazla 1 dolu yeşil buton (testle sayıldı).
      11.10 (Veritabanı Adım C notu) işaretlenmedi: Claude Code veritabanına bakmadı, kapandığını doğrulayamadı (aşağıdaki maddeye bakın).

- [x] Görev 12 — renk düzeltmesi ve ince ayar (docs/GOREV12.md, 12.1–12.10) · Claude Code yaptı (14 Kasım), sahte veriyle test edildi.
      12.1 Sarı/altın/krem/turuncu kalktı: para işleri (ödeme, gelir & gider, fiyatlar, kapora, depozito) lacivert #3C4E8C,
      misafirler mor #7A4B8C, fotoğraflar petrol #2E6E8E. Tablo `www/ikonlar.js` → `IS` ve `index.html` → `.is-*` sınıflarında.
      "Boş" etiketi açık gri, "Eksik" lacivert çerçeve, "Yarın / 2 gün sonra" etiketleri açık lacivert.
      Kontrol grep'i yalnızca `PALET` satırını bulur (rezervasyon renk seçenekleri; görev "aynı kalsın" dediği için dokunulmadı).
      12.2 Villa ekranındaki "Bu ay N gece boş" satırı kalktı; "Boş günleri paylaş" Paylaş panelinde (yayınlanmamış villada önizlemede de).
      12.3 Bugünün rakamı 12px yukarıdaydı: villa durum kutusu için yazılmış `.today` kuralı (alt boşluk 24px) takvimdeki bugün hücresine de
      uyuyordu. Kural `div.today` yapıldı; dolu/boş/giriş günü/çıkış günü/tek gece/seçili durumlarında fark 0px (ölçüldü).
      12.4 "Sıradaki" kartı: en yakın giriş ya da içerideki misafirin çıkışı; dokununca detay; listede tekrar etmez; satırlarda "girecek / çıkacak".
      12.5 Fiyatlar → "Tüm aylara fiyat gir" (12 ay, hafta içi + hafta sonu kutusu açık gelir) ve seçim çubuğunda "Tümünü seç".
      12.6 Seçili ay açık lacivert zemin + lacivert çerçeve. 12.7 Paylaş paneli: Bağlantıyı paylaş / kopyala / Sayfayı önizle / Boş günleri paylaş;
      en altta çizgiyle ayrılmış "Villa sayfasını yayından kaldır" + açıklama + onay. 12.8 Fotoğraflar: başlık üstte, altında
      "Fotoğraf ekle / Drive'dan al / Birden fazla seç". 12.9 Gelir & gider, Misafirler, Fiyatlar, Fotoğraflar, Villa bilgileri, Bakıcılar
      başlığının sağında 44×44 kapak fotoğrafı (yoksa villa renginde baş harf). 12.10 Villa bilgileri 7 ikonlu bölüm, − / + sayaçlar,
      sabit "Kaydet"; özellik/olanak düğmeleri emojiden Lucide ikonlarına geçti (`www/ozellik.js`, misafir sayfası g.html aynı tabloyu kullanır).
      Sade (beyaz) buton sayısı 15 → 17 (yeni: Fiyatlar seçim çubuğunda "Tümünü seç", yayından kaldır onayında "Vazgeç").
      Her ekranda en fazla 1 dolu yeşil buton (testle yeniden sayıldı). Eski testler yeni düzene göre güncellenip hatasız geçti.

- [x] Görev 13 — konum, yataklar, kurallar, özel teklif (docs/GOREV13.md, 13.1–13.7) · Claude Code yaptı (14 Kasım), sahte veriyle test edildi.
      Veritabanı (`teklifler` + `teklif_getir`, kayıt: docs/VERITABANI_GOREV13.sql) ve `konum-coz` fonksiyonu
      (supabase/functions/konum-coz/index.ts) Claude tarafından kuruldu; Claude Code bunları sadece kullandı, kurmadı/deploy etmedi.
      13.1 Villa bilgileri → Konum: Google Haritalar bağlantısı + "Konumu bul" (konum-coz, girişli kullanıcının jetonuyla).
      Koordinat `bilgi.konumKoord`, bağlantı `bilgi.haritaLink`. En yakın 2 havalimanı istemcide hesaplanır (kuş uçuşu × 1,35, 5 km'ye;
      süre km ÷ 65 km/sa, 5 dk'ya). Mesafeler artık satır listesi (`bilgi.mesafeListe`: ad, mesafe, süre, tip hava/yer, oto):
      düzenlenebilir, elle düzeltilen "yaklaşık" yazısını kaybeder ve tekrar "Konumu bul"da ezilmez; "Mesafe ekle" ile yeni satır.
      Eski sabit mesafe alanları (Görev 7) açılışta satırlara çevrilir. Misafir sayfasında "Konum" bölümü: ad, mesafeler, "Haritada aç".
      13.2 Kapasite: çift kişilik / tek kişilik yatak / çekyat sayaçları; misafir sayfasında "3 çift kişilik · 2 tek kişilik yatak · 1 çekyat".
      13.3 Özellik ikonları gözden geçirildi: Lucide'da karşılığı olmayan 11 ikon (hamak, şömine, sineklik, mama sandalyesi, beşik, fırın,
      su ısıtıcı, saç kurutma, ütü, mangal, puset) aynı çizgi stilinde özel çizildi; çizimler `www/ikonlar.js`, ad → ikon tablosu `www/ozellik.js`.
      Misafir sayfası artık ikonlar.js'i de yüklüyor. Zeyd'in onayı için: docs/IKON_LISTESI.html (34 ad, 3 sütun).
      13.4 Kurallar: hazır aç/kapalar kaldı; altına kullanıcı kuralları (`bilgi.kurallar`): ekle, çöp ile sil (Geri al), tutamaktan sürükleyerek sırala.
      Misafir sayfasında ve rezervasyon formu PDF'inde madde madde (kural çoksa PDF'te yazı küçülür).
      13.5 Kaydırma hafızası (`goster()`): derine açılan ekran en üstten, geri dönünce / sekme değişince / panel kapanınca kaldığı yer.
      13.6 Boş günleri paylaş paneli: Bu ay · 2 ay · 3 ay · Sezon sonuna kadar (31 Ekim), "En az N gece" (varsayılan 2),
      düzenlenebilir mesaj + villa sayfası bağlantısı, "WhatsApp'ta gönder" / "Kopyala".
      13.7 Özel teklif: takvimde iki tarih seçilince "Rezervasyon ekle" / "Teklif gönder" (+ Rezervasyon ile başlandıysa doğrudan form);
      yeni rezervasyon formunda "Teklif olarak gönder"; Paylaş panelinde "Özel teklif oluştur". Teklif paneli: tarihler, normal ücret kartı,
      %5/%10/%15 düğmeleri, misafir adı (hitap "Hasan Bey"), geçerlilik 3 gün / 7 gün / tarih, düzenlenebilir mesaj.
      Gönder/kopyala anında `teklifler`'e kayıt (8 karakter kod, O/0/I/1 yok); bağlantı `<site>/<paylaşım adı>?teklif=KOD`.
      Sayfa yayında değilse önce "Yayınla". Misafir sayfası `rpc/teklif_getir` ile okur: tarihler seçili, yeşil şerit, özel fiyat,
      WhatsApp isteğine "Teklif kodu"; süresi dolmuşsa / tarihler doluysa gri şerit. Villa yönetimi → "Teklifler": Açık / Süresi doldu /
      Kabul edildi / İptal; "Rezervasyona çevir" (kaydedince teklif kabul olur), "Bağlantıyı tekrar gönder", "Teklifi iptal et" (Geri al).
      Canlı veritabanıyla değil, sahte sunucuyla test edildi; ilk gerçek teklifte bir kez denenmeli.

- [x] Görev 14 — misafir sayfası netliği, Gelir & gider, küçük düzeltmeler (docs/GOREV14.md, 14.1–14.11) · Claude Code yaptı (14 Kasım), sahte veriyle test edildi.
      Misafir sayfası (g.html) artık uygulamanın Lucide ikonlarını (ikonlar.js) ve renklerini kullanıyor; kalın yazı kalmadı.
      14.1 Başlık: büyük ad, altında iğne ikonlu konum. 14.2 Künye: 2 sütun, 40px yeşil daire + 22px rakam + 15px etiket
      (kişi, yatak odası, banyo, m²); yatak sayıları ayrı satırda. 14.3 Bölüm başlıklarında 22px ikon; "Uygunluk" → "Takvim"
      ("Giriş ve çıkış gününe dokunun"); seçim yapılınca lacivert cüzdanlı "Fiyat" başlığı. 14.4 Seçili giriş/çıkış gününe tekrar dokunmak
      seçimi temizler; takvimin altında ve alt çubukta "✕ Seçimi temizle". 14.5 Konum: ada göre ikon (plaj, market, merkez, restoran,
      hastane, havalimanı), mesafe/süre sağda 17px, petrol renkli "Haritada aç". 14.6 Ev kuralları: Giriş/Çıkış saat kutuları,
      Sigara / Evcil hayvan / Parti için Serbest-Yasak rozeti, Su / Elektrik için Dahil-Ayrı ücret; sahibin kuralları "i" ikonlu liste.
      14.7 Hasar depozitosu kartı (lacivert): fiyat özetinin altında büyük, kurallarda ve istek panelinde küçük; alt çubukta
      "+ 5.000 ₺ iade edilen depozito"; WhatsApp isteğinde depozito cümlesi.
      14.8 Fiyatlar: "Birden fazla ay seç" ve "Tüm yıla fiyat gir" aynı boyutta yan yana; yıl seçimi (bu yıl kalan aylar / gelecek yıl),
      hafta içi + hafta sonu; ay listesi en az 18 ay. Görev 12'deki "Tüm aylara fiyat gir" kaldırıldı.
      14.9 Gelir & gider: net kazanç kartı; Alındı (yeşil) / Alınacak (kırmızı, depozito hariç, altında "+ depozito") / Giderler (gri)
      kutuları ilgili listeye kaydırır; tek cümle özet; listeler: Alınacak ödemeler, Alınan ödemeler, Giderler (+ Gider ekle),
      Diğer gelirler (+ Gelir ekle); grafik, sezon özeti, PDF ve tüm rezervasyonlar "Daha fazla istatistik" altında kapalı.
      14.10 Fotoğraflar: "Fotoğraf ekle" / "Drive'dan al" alttaki sabit çubukta; "Birden fazla seç" küçük; seçim modunda
      "Kapak yap" (tek fotoğraf) / "Sil" / "Vazgeç". 14.11 Teklif panelinde "Teklifi kopyala" (mesajın tamamı + bağlantı, teklifi de kaydeder);
      Teklifler ayrıntısında "Teklifi tekrar gönder" + "Teklifi kopyala".
      Düzeltme (Zeyd'in denemesinden, 14 Kasım): misafir sayfasında fotoğraf şeridinin üzerinden aşağı kaydırma iPhone'da takılıyordu
      (şerit dikeyde de kaydırılabilir kalmıştı; sabit alt çubuk ve sayaçtaki bulanıklık efekti kaydırmayı kasıyordu) → şerit yalnız yatay,
      bulanıklık kaldırıldı, ilk fotoğraf öncelikli diğerleri sırası gelince yükleniyor. Villa ekranının başlığına da sağ üstte 44×44 villa fotoğrafı eklendi.

- [x] Görev 15 — referans siteden eksikler (docs/GOREV15.md, 15.1–15.8) · Claude Code yaptı (14 Kasım), sahte veriyle test edildi.
      Yeni alanların hepsi `villalar.bilgi` (JSON) içinde; yeni tablo/sütun yok. Boş olan hiçbir yerde görünmez.
      15.1 Misafir sayfasında konum haritası (Leaflet 1.9.4 cdnjs + OpenStreetMap, "© OpenStreetMap" yazısı). Villa bilgilerinde
      "Haritada göster": Yaklaşık bölge (varsayılan; ~800 m'lik yeşil daire, merkez villa id'den türetilen 300–500 m kaydırma ile)
      ya da Tam konum (nokta). Yaklaşık modda gerçek koordinat yayınlanan sayfaya hiç gitmez (`harita` alanı yayınlanırken hesaplanır).
      Küçük harita sabit (sayfa kaydırması engellenmez); dokununca tam ekran açılır, orada sürüklenir/yakınlaşır.
      Not: "Haritada aç" düğmesi sahibin yapıştırdığı Google Haritalar bağlantısını açar; o bağlantı evin tam yerini gösterir.
      Sayfanın `Referrer-Policy: no-referrer` ayarı yüzünden harita karoları `referrerPolicy` ile isteniyor (OSM kuralı).
      15.2 Odalar (`bilgi.odaListe`): tür, kat, yatak sayaçları, banyolu/klima/TV/balkon/jakuzi/deniz manzarası; sürükle-sırala, sil (Geri al).
      Oda girilince 13.2 yatak sayaçları odalardan hesaplanır ve kilitlenir. Misafir sayfasında "Odalar" bölümü (oda oda kart).
      15.3 Havuz (`bilgi.havuz`): en × boy, derinlik, çocuk havuzu, ısıtma (ücretli mi), korunaklı; havuzlu bir özellik seçiliyse görünür.
      Eski "Havuz ölçüsü/derinliği" alanları açılışta yeni bölüme taşınır. Misafir sayfasında künyenin altında tek satır.
      15.4 Opsiyon: takvimde iki tarih seçince "Opsiyon koy" (misafir adı, telefon, son geçerlilik 1/2/3 gün/tarih, not).
      Takvimde taralı mavi-gri, villa ekranında "Opsiyonlar" listesi, ayrıntıda Rezervasyona çevir / Süreyi uzat / Opsiyonu kaldır;
      ana ekranda "Opsiyon yarın bitiyor". Misafir sayfasında "Opsiyonlu" (seçilemez). Süresi dolan takvimden düşer, listede 7 gün kalır.
      Veri: `rezervasyonlar` tablosunda opsiyon için uygun sütun yok (notun içine işaret koymak bakıcıya ve eski sürümlere opsiyonu
      kesin rezervasyon gibi gösterirdi). Bu yüzden opsiyonlar `villalar.bilgi.opsiyonlar` içinde tutuluyor; veritabanı değişikliği
      gerekmedi. Yayınlanan sayfaya yalnız aktif opsiyonların tarihleri gider (ad/telefon gitmez). Bakıcı opsiyon koyamaz (villa bilgisi
      yalnız sahipte yazılır). İleride ayrı tutmak istenirse aşağıdaki "Veritabanı için gerekenler (Görev 15)" taslağı kullanılabilir.
      15.5 İptal ve iade (`bilgi.iptal`): Esnek / Orta / Katı / Kendi metnim, metin düzenlenebilir; misafir sayfasında ve PDF'te.
      15.6 Bilmeniz gerekenler (`bilgi.notlar`): ekle / sil / sırala + hazır öneriler; misafir sayfasında künyenin altında gri kutu, PDF'te de.
      15.7 Turizm izin belge no (`bilgi.belgeNo`): Fiyat ve iletişim + sihirbaz 6. adım; misafir sayfasının en altında ve PDF altbilgisinde;
      boşsa yayınlarken "İzin belge numaranızı girmeniz önerilir." uyarısı (engel değil).
      15.8 Misafir sayfasında 720px'ten geniş ekranda iki ay yan yana (sayfa da genişler); telefonda tek ay.
      Kurallar / odalar / notlar için ortak sürükle-sırala düzeltildi: satır taşınırken parmak takibi kaybolup sıralama kaydedilmiyordu.
- [x] Görev 15 eki — harita konumu (docs/GOREV15_EK_KONUM.md) · Claude Code (14 Kasım): yapıştırılan metinden bağlantı / düz koordinat ayıklanıyor, konum-coz Apple Haritalar'ı (maps.apple.com, maps.apple/p/…) okuyor, Kaydet'te konum yoksa bir kez deneniyor (bulamazsa "Kaydedildi. Harita için konum bulunamadı."), yayındaki sayfa otomatik yenileniyor; "Konumum / My Location" bağlantısında uyarı. konum-coz'un son hâli Claude tarafından yazılıp yüklendi (Google + Apple, cevapta `google` bağlantısı).
- [x] Harita linki düzeltmesi · Claude Code (14 Kasım): misafire giden bağlantı her zaman Google (`haritaLink` = koordinattan Google, yapıştırılan orijinal `kaynakLink`'te; düz koordinatta da). Misafir sayfasında "Haritada aç" konum varsa koordinattan Google'a gider, yoksa eski bağlantıya. Açılışta konumu olup bağlantısı Google olmayan villalar bir kerelik çevrilir. Villa bilgilerinde "✓ Konum bulundu · misafirleriniz Google Haritalar'da açacak" satırı. Ayrıca 15.1'deki bir hata düzeltildi: konumu olan villada yayınlanan sayfada dolu günler listesi bozuluyordu (yaklaşık modda dolu günler boş görünür, tam modda sayfa açılmazdı); canlıda konumu olan villa olmadığı için kimse etkilenmedi.
- [x] Görev 16 — açılış animasyonu ve Wise'tan uyarlamalar (docs/GOREV16.md, 16.1–16.9) · Claude Code (15 Kasım), sahte veriyle test edildi. **Netlify'a yüklenmedi** (görev gereği; sadece commit + push).
      16.1 Açılış deseni Codex CLI ile üretildi (ilk denemede uygun), `www/img/acilis-doku.webp` 1080×1920, 189 KB. Logo, native açılış
      görselinden (`assets/splash.png`) kesildi: `www/img/acilis-logo.webp`.
      16.2 `www/acilis.js` (tek modül, `<body>` başında): native açılış ekranıyla aynı görünümde web perdesi → hap şerit yükselir (550 ms)
      → yanlara açılır (300 ms) → veri hazırsa (en fazla 1,5 sn bekler) desen solar, ana ekran %96'dan büyüyerek gelir. Sadece
      transform / opacity / clip-path. Dokununca anında biter; "Hareketi azalt" açıksa logo → 200 ms solma. Web'de oturumda bir kez
      (sessionStorage), girişsiz kullanıcıda yok. `capacitor.config.json`: `launchAutoHide:false` — native açılış ekranını acilis.js
      gizler; bir şey ters giderse native.js 3 sn sonra yine gizler.
      16.3 Face ID / parmak izi kilidi: eklenti `@aparajita/capacitor-biometric-auth` 10.0.0 (Capacitor 8 için; `Capacitor.Plugins.BiometricAuthNative`).
      Hesap → Güvenlik (yalnız uygulamada, girişli kullanıcıda). Açarken bir kez doğrulanır; ayar cihazda (`vt-kilit`). Soğuk açılışta ve
      5 dakikadan uzun arka planda kalınca sorulur; başarısızsa "Tekrar dene" / "Şifreyle giriş" (çıkış yapıp giriş ekranı).
      iOS Info.plist: NSFaceIDUsageDescription. Gerçek Face ID yalnız yüklü uygulamada denenebilir (testte eklenti taklit edildi).
      16.4 Hızlı işlem hapları: villa ekranında Rezervasyon (dolu) · Teklif · Opsiyon · Fiyat gir · Paylaş (eski üç büyük buton kalktı;
      Teklif / Opsiyon da önce iki gün seçtirir, sonra ilgili paneli açar); ana ekranda Villa ekle · Takvim · Teklifler (alttaki büyük
      "Villa ekle" kalktı; birden çok villada Teklifler önce villa sorar).
      16.5 Rezervasyon detayında yuvarlak eylem butonları: Ara · WhatsApp · Ödeme gir · Düzenle; PDF ve iptal liste satırı (iptal en altta).
      16.6 "Tümünü gör" başlıkta: Yaklaşan rezervasyonlar, villa ekranında yeni Teklifler bölümü (son 3 teklif; varken "Teklifler" satırı
      gizlenir), Gelir & gider'in dört listesi (ilk 4 satır, gerisi "Tümünü gör (N)" ile açılır).
      16.7 Ana ekranda kapatılabilir ipucu kartı (en fazla 1, "Ana ekrana ekleyin" kartı varken çıkmaz): fotoğraf → gelecek ay fiyatı →
      belge no → bakıcı (bakıcı bilgisi yalnız bu sıraya gelince sunucudan sorulur). Kapatılan tür 30 gün çıkmaz (cihazda).
      16.8 Aşağı çekip yenile: ana ekran, villa ekranı, Takvim sekmesi (en üstteyken). Önce bekleyen değişiklikler gönderilir, sonra
      bulut verisi yeniden yüklenir; "✓ Güncel".
      16.9 Ödeme kaydı ve teklif detayında ortada 36px tutar + durum etiketi + tarih; rezervasyon detayında "… alınacak" ortalı 30px.
- [x] Uygulama ikonu adayları (docs/CODEX_APP_IKON.md) · Claude Code (15 Kasım). 10 aday, her biri ayrı Codex isteğiyle üretildi
      (hepsi ilk denemede, 1024×1024, saydamlıksız): `docs/ikonlar/ikon-01 … ikon-10`. Kontrol sayfası: `docs/ikon-adaylari.html`
      (büyük görünüm, 60 px iOS köşeli, açık / koyu duvar kağıdı, sahte ana ekran). Uygulamanın ikonu DEĞİŞMEDİ; seçim Zeyd'de.
- [x] İkon 2. tur (docs/CODEX_APP_IKON_2.md) · Claude Code (15 Kasım). Seçilen "takvim çatısı"nın Wise netliğinde 10 varyasyonu,
      her biri ayrı Codex isteği (hepsi ilk denemede, 1024×1024): `docs/ikonlar2/ikon2-01 … 10`. Kontrol sayfası `docs/ikon-adaylari-2.html`
      (telefon satırında 1. turdaki ikon da referans olarak var). Uygulamanın ikonu DEĞİŞMEDİ.
- [x] İkon 3. tur (docs/CODEX_APP_IKON_3.md) · Claude Code (15 Kasım). 1. turdaki ikon-02 çizimi, A renkleri (#9FE870 / #163300);
      her biri ayrı Codex isteği, referans görsel `-i` ile eklendi (hepsi ilk denemede): `docs/ikonlar3/ikon3-01 … 05`. Codex görseli
      ürettikten sonra tam iki renge indirip 1024×1024'e getirdi. Kontrol sayfası `docs/ikon-adaylari-3.html`. Uygulamanın ikonu DEĞİŞMEDİ.
- [x] YENİ UYGULAMA İKONU: `docs/ikonlar3/ikon3-02.png` (zemin #9FE870, sembol #163300) · Claude Code (15 Kasım). Netlify'a yüklenmedi.
      Tüm görseller ikon3-02'den, kenarları yumuşatılarak üretildi (Python/PIL): `assets/icon-only.png`; Android uyarlanabilir ikon
      (`icon-background.png` düz #9FE870, `icon-foreground.png` saydam, sembol %60 — capacitor-assets ön planı %16,7 içeriden çizdiği
      için yuvarlak ikonda da kesilmiyor); açılış `splash.png` / `splash-dark.png` (2732, sembol %22). `npx capacitor-assets generate`
      ile iOS ve Android ikonları + açılış ekranları üretildi (aracın kendiliğinden yazdığı `icons/` klasörü ve manifest değişikliği geri alındı).
      capacitor.config.json: backgroundColor / android / SplashScreen → #9FE870. Açılış animasyonu (acilis.js): zemin #9FE870, logo
      `www/img/acilis-logo.webp` açılış ekranından birebir (609/2732 ölçeği; ilk karede sembol aynı yerde, test edildi), yükselen şeridin
      tepesindeki daire #163300; kilit ekranı yazı/düğmeleri açık zeminde koyu. Web: icon-180/192/512 (köşesiz), `icon-512-maskable.png`
      (kenar boşluklu, manifest'te "any maskable"), `favicon.ico` + `favicon-32.png` (index.html ve g.html'de bağlantılı); manifest
      theme/background #9FE870. Uygulama içi logolar: üst çubukta `img/logo-acik.png` (#9FE870), giriş / yeni şifre / onay ekranında
      `img/logo-koyu.png` (#163300), "Ana ekrana ekleyin" kartında uygulama ikonu. `ikon3-05.png` (2×2) silindi.
- [x] İkon VEKTÖR sürümü · 15 Kasım. İkon Claude tarafından vektör olarak yeniden çizildi (yapay zekâ görselinin kenarları tırtıklıydı):
      `assets/ikon.svg` (tam ikon), `assets/sembol.svg` (sadece sembol, saydam) ve bunlardan üretilmiş assets/*.png + www ikonları/favicon
      (bu dosyalar elle değiştirilmez). Claude Code: `npx capacitor-assets generate` ile iOS/Android yeniden üretildi (aracın yazdığı
      `icons/` klasörü ve manifest değişikliği yine geri alındı); manifest'te icon-512 "any", icon-512-maskable "maskable".
      Üst çubuk, giriş / yeni şifre / onay ekranı ve açılış animasyonu logosu artık sembol.svg'den satır içi SVG (maske ile, renk
      currentColor; her örnekte ayrı maske kimliği). Açılış logosu splash'teki gibi 601/2732 ölçekte, ilk karede aynı yerde (test edildi).
      Eski PNG/WebP logolar (`img/acilis-logo.webp`, `img/logo-acik.png`, `img/logo-koyu.png`) silindi. Referans: `docs/ikonlar3/ikon3-02.png`.
- [x] Açılış animasyonu WISE RİTMİNDE · Claude Code (15 Kasım). Netlify'a yüklenmedi. Renkler: zemin #10180D, logo `assets/sembol-acik.svg`
      (#9FE870). Yeni `assets/splash.png` / `splash-dark.png` Claude'un (değiştirilmedi; sembol 2732'lik karede 382 px, tam ortada; iPhone 14'te
      ekran genişliğinin %30,3'ü). `npx capacitor-assets generate` ile iOS/Android açılış ekranları yeniden üretildi (araçtan gelen `icons/`,
      manifest ve AndroidManifest değişiklikleri yine geri alındı; ikonlar değişmedi). capacitor.config.json: backgroundColor / android /
      SplashScreen → #10180D.
      ANDROID: Capacitor 8 Android'de her sürümde sistemin açılış ekranını (Android 12 API, compat) kullanıyor; orada `splash.png` değil,
      zemin rengi + ortada ikon görünür. Bu yüzden `values/styles.xml`'de AppTheme.NoActionBarLaunch'a `windowSplashScreenBackground` #10180D
      ve `windowSplashScreenAnimatedIcon` = `drawable-xxxhdpi/splash_sembol.png` (288dp kare, sembol 120dp, saydam) eklendi; web'de Android'de
      logo da 120px ve ekranın ortasında (`#acilis.acAndroid`). Cihazda denenmedi: sistem çubukları web görünümünü kaydırırsa birkaç dp oynayabilir.
      ZAMAN ÇİZELGESİ (acilis.js, native açılış gizlendikten sonra; Web Animations API, tek zaman çizelgesi, hepsi aynı startTime):
      0–600 sadece logo · 600–900 şerit %8'e (cubic-bezier(0.2,0,0.2,1)) · 900–1430 %100'e hızlanarak (0.55,0,0.85,0.45) · 1430–1600
      yanlara açılır, daire tepeden çıkıp kaybolur (0.5,0,0.9,0.5) · 1600–1630 tam desen · 1630–1830 desen 1→0, ana ekran 0→1 ve 12px
      aşağıdan (ease-out). Veri 1630'da hazır değilse desende en fazla 1,5 sn bekler, sonra iskelet ekran. Dokununca anında biter.
      Hareketi azalt: logo 400 ms → (veri bekle) → 200 ms solma. Şerit: genişlik %14, tam yuvarlak uç, `img/acilis-doku.webp` ekrana göre
      sabit; tepede şerit genişliğinde #163300 daire, içinde #9FE870 ev; şerit logonun önünden geçer.
      Yapı (yalnız transform/opacity): ekranın sol ve sağ yarısında birer kırpma kutusu; her birinde üst köşesi yuvarlak panel translate ile
      yükselir ve yanlara açılır, içindeki desen ters yönde kayar (top/height/clip-path animasyonu yok). Desen görseli img.decode() ile
      çözülüp iki kare beklendikten sonra başlar; will-change yalnızca animasyon boyunca. Ana ekran perdenin arkasında önceden kendi
      katmanında çizilir (perde %99,9 opak), solma başlarken kare kaçmasın.
      DOĞRULAMA (Chrome, iPhone 14 görünümü 390×844):
      · Kare kare (60 fps ızgarası, 99 kare, animasyon durdurulup her kareye gidilerek): şerit yüksekliği ve açılma oranı beklenen eğriden
        en fazla %0,27 saptı (ekran yüksekliğine/genişliğine göre); desen her karede ekrana göre sabit.
      · Gerçek zamanlı ekran kaydı (CDP screencast, her kare zaman damgalı; Playwright'ın video kaydı 25 fps olduğu için bu kullanıldı):
        hareketli bölümde 65 kare, ortalama 16,9 ms (59 fps). Kayıt aracının sabit 16,5 ms (1 kare) gecikmesi düzeltilince en büyük sapma
        %0,51 (±%5 sınırının çok altında).
      · Performans izi (DevTools trace, CPU 4x yavaşlatma, 4 deneme): şerit ve solma boyunca her ekran yenilemesinde yeni kare çizildi;
        yalnızca şeridin ilk 1–2 karesinde (≈611 ve 628 ms, şerit henüz 1–2 px hareket etmişken) uygulamanın ana ekran verisini yerleştirdiği
        ana denk gelen 1–2 kare kaçtı (bir denemede 845 ms'de 1 kare). Yavaşlatma olmadan (2 deneme) hiç kare düşmesi yok.
      · İlk kare / açılış ekranı: logo kutusu birebir aynı (3x'te 1 piksel), fark yalnızca kenar yumuşatması. Android görünümünde logo 120px, tam orta.
      · Dokunma, hareketi azalt, yavaş veri (1 / 2,5 / 6 sn) ve eski kilit / giriş / ana ekran testleri geçti.
- [x] Açılış animasyonu WISE ÖLÇÜMLERİYLE YENİDEN · Claude Code (15 Kasım). Netlify'a yüklenmedi. Önceki tarifteki şerit genişliği (%14)
      ve cubic-bezier eğrileri yanlıştı; `docs/ACILIS_OLCUMLER.md` tabloları WAAPI anahtar kareleri olarak birebir girildi (offset'li,
      aralar linear). 800 ms logo → limon kapsül (%29) + içinden yetişen koyu daire (çap %92, içinde ev) → baş yükselir, desenli gövde
      %29'dan %49,7'ye genişler → 816–983 gövde tüm ekranı kaplar → 1000–1233 solma (cubic-bezier(0.4,0,0.2,1)), ana ekran 12px aşağıdan.
      Toplam ~2,03 sn. Gövde: sol/sağ yarım kaplar translate ile (scale denendi, takıldı). Ana ekran logo + hareket boyunca
      content-visibility:hidden (veri logo sırasında gelirse hemen açılır). Tüm animasyonlar en başta tek zaman çizelgesinde oluşturulur.
      Ayrıntı ve tüm ölçüm tabloları: `docs/ACILIS_DOGRULAMA.md`. Özet:
      · Kare kare (animasyon durdurularak): en büyük sapma 0,11 / 0,10 / 0,49 puan (kapsül / daire / gövde).
      · Playwright 60 fps kayıt: 60 kare/sn, boşluk yok. 12 kaydın 11'inde ham zaman damgaları izden ölçülen 33,3 ms çizim hattı
        gecikmesi kadar geride (ham ±17 ms ölçütü bu kayıtlarda karşılanmıyor; 1 kayıtta gecikme ~16 ms, ham da 48/48 geçti);
        33,3 ms düşülünce 5 kaydın hepsinde 48/48 satır ±1,5 puan içinde (en çok 0,51).
      · Solma tam 1000 ms'de başlıyor, eğriden en büyük fark 0,002.
      · Kare düşmesi (performans izi): 1x'te 10/10 denemede sıfır. 4x'te 24 denemenin 22'sinde sıfır; 2 denemede toplam 4 + 1 kare
        (nedeni yakalanamadı, tekrarlanmadı).
      · iPhone Safari'de ölçülmedi.
- [x] Açılış animasyonu ORTADA NEFES ANI · Claude Code (15 Kasım). Netlify'a yüklenmedi. Yeni ritim `docs/ACILIS_OLCUMLER.md`'de
      "Villa Takvimim sürümü (Zeyd, 15 Kasım): ortada nefes anı" bölümünde. ACILIS_YAVAS = 1,15 (tüm süreler çarpılır), logo 1000 ms sabit.
      2a: baş yavaşlayarak ortaya (daire merkezi logonun 30 pt altına), 2b: ortada nefes (daire logoya oturur; logo 1→0 ve %100→%85
      küçülerek daireye girer; ev ikonu bir kez 1→1,12→1 atar), 2c: hızlanarak tepeye, gövde %29→%49,7. Toplam ~2,95 sn.
      Logo artık başın önünde (arkasında zemin renginde siluet; baş altına girerken pencerelerinden daire görünmez); dönüşümü px ile
      ve ortadan ölçekli (sol üste kaymaz). Ev ikonu logoyla aynı merkezde; logo (118 px) daireden (104 px) büyük olduğu için aynı boy
      mümkün değil, ev atışta da daireye sığacak en büyük boyda (~66 px görünür, eskiden ~33). Ayrıntı: `docs/ACILIS_DOGRULAMA.md`.
      · Kare kare: baş 0,11 / daire 0,12 / gövde 0,48 puan; logo opaklığı 0,005, ölçeği 0,008; ikon ölçeği 0,013.
      · 2b sonunda daire merkezi logo merkezine x 0,0 / y −0,5 px (ölçüt ±2 pt); Android görünümünde (logo 120 px) de aynı.
      · Playwright 60 fps kayıt (7 kayıt): boşluk yok; 33,3 ms çizim hattı gecikmesi düşülünce 179/179 satır geçti (en çok 1,39 puan).
      · Solma 1683,6 ms'de başlıyor, eğriden fark 0,002.
      · Kare düşmesi: son seride 1x 12/12 ve 4x 12/12 denemede sıfır. İlk 1x serisinde 12 denemenin 3'ünde 1–2 kare düştü; iz,
        sayfanın kareyi zamanında ürettiğini, tarayıcının ekran birleştiricisinin beklediğini gösterdi (logo/ikon kapatılınca da
        rastgele duraklamalar oldu: makine yükü).
      · iPhone Safari'de ölçülmedi.
- [x] Açılış animasyonu İPHONE KAYDI DÜZELTMELERİ · Claude Code (15 Kasım). Netlify'a yüklenmedi. Ayrıntı: `docs/ACILIS_DOGRULAMA.md`.
      1) Sol üstteki elips (boyutu verilmeden çizilen baş dairesi): kapsül/gövde/daire/sembol CSS'te gizli başlıyor, animasyon
      başlarken görünür. Eski sürümde Chrome'da da üretildi (ilk 2 kare); yeni sürümde ilk 20 karede logo dışında açık piksel 0.
      2) Gri ilk kare: <head> başında koyu zemin + theme-color #10180D (açılış bitince #0B5B57); native'de açılışta durum çubuğu
      yazısı beyaz; ana ekrana eklenen web sürümünde status-bar-style "black". 3) Desen beklemesi: oturum yenilemesi (jeton
      geçerliyken) arka planda, profil ve villalar aynı anda (300 ms gecikmeli sahte sunucuda liste 1,4 sn → 0,8 sn); kayıtlı
      oturumda ilk ekran iskeletli ana ekran; desen tam ekranken en fazla 300 ms bekleme, sonra iskelet. 4) Dairede logonun
      aynısı (sembol): 1–2a çapın %55'i, 2b'de logoyla aynı yer ve boy (logo solarken yerini alır), 2c'de %55'e küçülür; ev
      ikonu ve atışı kaldırıldı, logo küçülmüyor. 5) Logo baştan kendi katmanında, native ekran +50 ms sonra kalkıyor (iPhone'daki
      soluk başlangıç Chrome'da üretilemedi; cihazda bakılmalı).
      · Kare kare: baş 0,11 / daire 0,12 / gövde 0,48 puan; sembol yeri 0,46 px, ölçeği 0,007; 2b sonunda daire logoya y −0,5 px.
      · 60 fps kayıt: boşluk yok, 179/179 satır geçti. Kare düşmesi: 4x 12/12 sıfır; 1x 12'de 1 kare (2b'de; sayfa kareyi
        zamanında üretti, GPU süreci bir yenileme boyunca hiç çalışmadı). Kilit, giriş, hap, yenileme, detay, ipucu testleri geçti.
      · iPhone Safari'de ölçülmedi.
- [x] Açılış animasyonu İNCE AYAR (daire–logo buluşması) · Claude Code (15 Kasım). Netlify'a yüklenmedi. Ayrıntı: `docs/ACILIS_DOGRULAMA.md`.
      1) Logo ortası ekran yüksekliğinin %49,5'inde: assets/splash.png + splash-dark.png'de sembol 13 px yukarı, capacitor-assets ile
      iOS/Android açılış görselleri yeniden üretildi; Android 12 sistem açılış simgesi (splash_sembol) 4 dp yukarı; web logosu aynı yerde
      (390×844'te 417,83 px, ikisi birebir). 2) Animasyon girişsiz kullanıcıda da oynuyor; perde açılınca oturum varsa ana ekran, bu
      cihazda daha önce giriş yapılmışsa "Giriş yap", hiç yapılmamışsa "Kayıt ol" + altında "Zaten hesabın var mı? Giriş yap" bağlantısı
      (cihazda "vt-giris-yapildi" işareti). 3) 2a: daire logonun arkasında, konum ve çapla aynı eğriyle D = logo × 1,42'ye büyür (halka ve
      gövde de; gövde hiç daireden dar değil); 2b: çap D → D×1,04 → D yumuşak yay; 2c: logo ve daire tek parça yükselir, 1 → 0,7 küçülür;
      logo 2c'ye kadar hiç değişmez; dairede ayrı ikon yok.
      · Kare kare: 2a sonunda daire–logo merkezi x 0,0 / y 0,1 px, çap 167,2 px (D 167,6); 2b–2c boyunca hiza ≤ 0,7 px (gerçek
        zamanlı kayıtta ≤ 0,57 px). Baş/daire/gövde 0,11/0,11/0,49 puan.
      · Kare düşmesi: 1x'te denemelerin yarısında aynı anda (2532 ms) 1 kare kaçıyor (önceki sürüm aynı koşulda 0); 4x'te önceki
        sürümden az. Neden: GPU sürecinde saniyelik bekleme (sayfa kareyi zamanında üretiyor); birkaç düzeltme denendi, kalkmadı.
      · iPhone Safari'de ölçülmedi.
- [x] Açılış animasyonu: LOGO DAİREYE GİRER (Zeyd: "daire çok büyük oldu") · Claude Code (16 Kasım). Netlify'a yüklenmedi.
      Ayrıntı: `docs/ACILIS_DOGRULAMA.md`.
      1) Daire boyu eski hâline döndü: çap = şerit × 0,92 (~%27 genişlik, 390×844'te 104 px), 2a'da büyümüyor; × 1,42 kuralı kaldırıldı.
      2) Logo yerinde (%49,5) ve hep dairenin önünde (z-index), opaklığı 1. Daire alttan gelip merkezine oturuyor. Dairenin üst kenarı
      logonun alt kenarına değdiği anda logo küçülmeye başlıyor, daire oturduğu anda (690 ms) genişliği çapın %56'sı. Küçülme dairenin
      konumuna bağlı (aynı eğri, aynı bitiş). 2b 200 ms (ekranda 230): daire + logo birlikte 1 → 1,04 → 1 yumuşak yay. 2c: tek parça
      yükselir, birlikte 1 → 0,85. Sonraki aşamalar 60 ms öne kaydı (toplam ~2,88 sn).
      · Kare kare: küçülme başı ile değme aynı kare (440 ms; model 438,8); küçülme bitişi ile oturma aynı an (690 ms; ilerleme
        oranları her karede ≤ 0,009 farklı); oturduğunda merkez farkı x 0,00 / y 0,18 px, logo / çap %56,1; 2b–2c boyunca hiza
        ≤ 0,73 px, logo / çap %56,0–56,6. Android görünümünde %55,9.
      · Kare düşmesi (dönüşümlü, önceki turla): 1x'te yeni 10 denemenin 2'sinde (3 kare), önceki 10'un 1'inde (1 kare); hepsi
        sayfa zamanı ~1800 ms'de, iki sürümde aynı anda. 4x'te ikisi de 0.
      · iPhone Safari'de ölçülmedi.
- [x] Görev 17 — Villa ekranı: Sıradaki öne, giriş saati, yerleştirme onayı, gezinme · Claude Code (16 Kasım). Netlify'a yüklenmedi.
      Ayrıntı: `docs/GOREV17.md`.
      17.1) "Sıradaki" kartı villa başlığının hemen altında. Üst satırda "SIRADAKİ" ve yanında zaman etiketi
      ("Bugün" yeşil dolu; "Yarın", "N gün sonra" açık lacivert; 7 gün ve sonrası kısa tarih). Tarih satırı kalktı.
      Altında "16:00 · abc girecek" (çıkışta "10:00 · abc çıkacak"), sağda kırmızı "13.000 ₺ alınacak" ya da yeşil "Ödeme alındı".
      17.2) Durum Türkiye saatine göre (UTC+3). Giriş günü 16:00'dan önce ve yerleştirilmediyse "Boş" + "Bugün 16:00'da abc girecek".
      Saat geçti ya da onay verildiyse "Dolu · abc" + "Bugün 16:00'da giriş yaptı" / "14:42'de yerleştirildi". Çıkış günü 10:00'a
      (ya da "çıktı" onayına) kadar dolu, sonra boş. Aynı kural ana ekran kartlarında, dolu/boş sayısında, "Bugün ve yarın" kartında
      ve Takvim sekmesinde ("Yerleşti", "Çıktı" etiketleri). Takvim hücresindeki yarım gün çizimi değişmedi. Saat 10:00 / 16:00'ı
      geçince açık ekran kendiliğinden güncelleniyor (30 sn'de bir bakılır; panel açıkken beklenir).
      17.3) Villa ekranındaki 3 özet kutusu (Doluluk · Bu ay · Sonraki giriş) kalktı. Hızlı işlem hapları ay başlığı ile gün
      başlıkları arasında, tek yerde: + Rezervasyon · Teklif · Fiyat gir · Opsiyon · Paylaş. Sığmayınca ekranın sağ kenarındaki hap
      ~yarım görünür (390 px'te %41; haplar arası boşluk ve iç boşluk otomatik ayarlanır). Sağda 32 px beyaza solan gölge, sona
      gelince kaybolur; başta değilse solda gölge. Cihazda ilk görüşte haplar 400 ms sola kayıp geri gelir ("vt-hap-ipucu";
      hareketi azalt açıksa yok).
      17.4) Rezervasyon detayının en üstünde (giriş günü ya da villanın sıradaki girişi):
        · Büyük "13.000 ₺ alınacak (5.000 ₺ depozito dahil)" ve yeşil "Ödemeyi al ve misafiri yerleştir" (giriş günü değilse "Ödemeyi al").
        · Panel: "Alınan tutar" ("Tamamı · 13.000 ₺" seçili, değiştirilebilir) → Kaydet → aynı panelde kayarak
          "Misafiri yerleştirdiniz mi?" → "Evet, yerleştirdim" / "Henüz değil". Evet: onay saatiyle kaydedilir, başarı titreşimi,
          "✓ abc yerleştirildi · 13.000 ₺ alındı", villa anında "Dolu".
        · Giriş günü "Ödeme almadan yerleştir"; ödeme tamamsa doğrudan "Misafiri yerleştir".
        · Onaydan sonra "Yerleştirildi · 14:42 · geri al".
        · Çıkış günü "Misafir çıktı mı?" → "Evet, çıktı" → depozito iadesi kartı (8.5) hemen açılır; "Çıktı · 10:12 · geri al".
        · Sahip ödemeyi mevcut yoldan (odemeler, not: "Girişte alındı · 14:40") kaydeder.
        · Bakıcı rpc/bakici_odeme_ekle(p_rez, p_tutar, p_not) ile kaydeder; p_not = "Bakıcı aldı · <bakıcının adı> · 14:40".
          Dönen yeni kalan ekranda kullanılır.
        · Onay: rezervasyonlar.giris_onay / cikis_onay (+ _onaylayan = kullanıcı id) PATCH ile.
        · Hata olursa düzgün mesaj çıkar: fonksiyon/sütun yoksa "bu özellik sunucuda henüz hazır değil", yetki yoksa "yetkiniz yok",
          bağlantı yoksa "İnternet bağlantınızı kontrol edin". Onay reddedilirse ekran eski hâline döner.
      17.5) Her sekme kendi yığınını hatırlıyor: villa (ya da Gelir & gider vb. alt ekranı) açıkken Hesap/Takvim'e geçip
      Villalar'a dönünce aynı villa, aynı ay ve aynı kaydırma konumu. Seçili sekmeye tekrar basınca kök (villa → liste);
      kökteyken en üste kayar. Takvim ve Hesap'ta da seçiliyken basınca en üste kayar, dönünce kaldığı yerde.
      · Tarayıcı testleri (Chrome, sahte sunucu, saat 01:09 / 14:40 / 16:30 / çıkış günü 09:00 ve 10:30): hepsi beklenen gibi.
        Sahip, bakıcı, bakıcı-fonksiyon-yok, onay-sütunu-yok, çıkış akışı, sekme dönüşleri, İngilizce görünüm denendi; eski
        testler (hap, detay, yenileme, ipucu, kilit, giriş) geçti. iPhone'da denenmedi.
      · Veritabanı: 17.4'ün sütunları ve bakici_odeme_ekle fonksiyonu Claude tarafından kurulacak; kuruldukları bu turda
        DOĞRULANMADI (veritabanına dokunulmadı). Aşağıdaki "Görev 17" bölümüne bakın.

- [x] Görev 18 — Gece görevi: tarih seçimi, kurulum turu, Villalarım, Takvim sekmesi, akıcılık · Claude Code (16–17 Kasım gecesi).
      Netlify'a yüklenmedi; her bölüm GitHub'a gönderildi (test: https://zeydusht.github.io/villa-takvimim/). Ayrıntı: `docs/GOREV18.md`,
      QA: `docs/qa/gorev18/` (önce/sonra görüntüleri 390×844 ve 360×740, `secim-testi.md` 40/40, `ek-duzeltmeler.md`).
      A) Tarih seçimi durum makinesi (uygulama + misafir sayfası): başlangıç → aralık; Y < S yeni başlangıç; Y = S ya da aralık
         seçiliyken herhangi bir dokunuş seçimi kaldırır; arada dolu gece varsa Y yeni başlangıç + "Bu tarihler arasında dolu gün var.".
         Seçim rezervasyon çizim diliyle (tam geceler koyu yeşil, giriş/çıkış yarım açık yeşil). Seçim işlemleri alt menünün üstünde
         kayan panelde (başlangıç bilgisi + ✕; aralıkta "24 → 27 Kasım · 3 gece · 9.000 ₺" ve eşit genişlikte Rezervasyon · Teklif ·
         Opsiyon). Üstteki adım şeridi kalktı. Haplar içeriğe göre, 48 px.
      B) "Sıradaki" kartı rezervasyon yokken de var ("Nasıl yapılır?" → takvim turu, gerçek dokunuşlarla). Takvim başlığıyla üstteki
         kart arasında 24 px; ay okları 48 px. Villa yönetimi: Villa bilgileri · Fiyatlar · Teklifler · Misafirler · Gelir & gider · Bakıcılar.
      C) "İsimsiz" kalktı ("Hasan Bey · 24–27 Kasım" / "Teklif · 24–27 Kasım"). Fiyatlar: yıl seçici, seçili yılın 12 ayı, geçmiş aylar
         soluk + "geçmiş" etiketi (düzenlerken onay sorusu), "Geçen yıl: 7.000–9.000 ₺" notu, "Tüm yıla fiyat gir" seçili yıl için.
      D) "Villa ekle" yalnız ad sorar → 7 adımlı sihirbaz (ad+konum, kapasite kartları, nesi var, bu ayın fiyatı, fotoğraflar 0/20,
         iletişim, villa sayfası tek butonla) → "Villanız hazır!" → "Takvime git" → ilk kez 4 adımlı uygulama turu. Her adımda çizim
         (codex ile 5 yeni çizim: sihirbaz-kapasite/ozellikler/fiyat/iletisim/sayfa). Geçişler: sihirbazda yatay kayma, ekranlar arası
         30 px kayma + solma, basınca 0,97; ölçüm: geçişlerde kareler 16,7 ms (gün dokunuşu 20–40 ms).
      E) Villalarım: başlığın sağında dolu/boş etiketleri, altında yalnız "+ Villa ekle"; villalar basılı tutup sürükleyerek sıralanır
         (sıra cihazda); "Bugün ve yarın" en fazla 4 satır + "+N olay daha · Takvim'de gör", satır rezervasyonu açar.
      F) Aşağı çekip yenile: gösterge üst çubuğun altından içerikle birlikte iner (lastik etkisi), eşikte titreşim, "✓ Güncel".
      G) Takvim sekmesi yeniden: tek cümle özet, büyük gün başlıkları, her olay ayrı kart, kapalı-açılır "N villada misafir var".
      H) Hesap: "Villama bakıcı ekle" (villa seçimi → davet), Yardım: turu tekrar göster, 6 soruluk SSS, "Bize ulaşın".
      I) Ek düzeltmeler (`docs/qa/gorev18/ek-duzeltmeler.md`): turuncu/hardal renkler paletten çıktı (kaydet düğmeleri hep yeşil),
         detayda tutar tekrarı ve "Ödeme gir/Ödemeyi al" çift adı, villa başlığındaki "Sıradaki" tekrarı, 48 px dokunma alanları.
      · Kalanlar: "Bize ulaşın" için destek WhatsApp numarası (DESTEK_WHATSAPP) girilmeli; villa sırası şimdilik yalnız cihazda
        (aşağıda veritabanı taslağı); gerçek iPhone'da denenmedi.

- [x] Görev 19 — Yardımlı mod: her işlem rehberle, sürüklerken sayfa yenilenmesi hatası · Claude Code (16 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi (test: https://zeydusht.github.io/villa-takvimim/). Ayrıntı: `docs/GOREV19.md`,
      QA: `docs/qa/gorev19/` (README: hangi test, sonuç; `rehber/` her adımın 390×844 ve 360×740 görüntüsü, `surukle/`, `tur/`).
      A) Tek rehber motoru `www/rehber.js`: rehber = adım listesi (veri). Adım: hedef, metin, bekle (dokunus/deger/olay/ileri),
         atla_eger, hazirla/cikis, donus, istege, dokunulmaz, gizli. %60 perde + yuvarlak delik + nabız halkası; baloncuk sığan
         tarafta, hedefi gösteren okla; sayaç ●●○○, Geri, "Yardımı kapat". Perde yanlış dokunuşu yutar, baloncuk sallanır.
         Paneller içinde de çalışır (perde paneli kapsar); üstüne uyarı açılırsa bekler. Klavye açılınca görünen alana göre yerleşir.
         Delik hedefler arasında 280 ms kayar, baloncuk solarak yer değiştirir; "Hareketi azalt"a uyar. Bitişte büyük ✓ + titreşim.
         Tüm cümleler tek sözlükte (Rehber.M), İngilizceleri dil.js'te. Eski uygulama turu ve "Nasıl yapılır?" da bu motorla.
         Hesap → Yardım: "Yardımlı mod" (varsayılan açık). Aynı rehber 3 kez bitince bir kez "Bu işlem için yardımı kapatayım mı?";
         kapatılanlar Hesap'tan "Kapatılan yardımları geri aç" ile döner. Tercihler cihazda (vt-yardim).
      B) Rehberler: + Rezervasyon (tarihler → form kendiliğinden açılır → ücret → ad → kişi → telefon → kapora → kaydet), Teklif,
         Opsiyon, Fiyat gir, Paylaş, Ödemeyi al ve yerleştir, Alınan ödemeyi gir, Gider ekle, Fotoğraf ekle / Drive'dan al,
         Bakıcı ekle; villa ekleme sihirbazında her adımda üstte küçük ipucu. Tarihler seçiliyken haplar paneli hemen açar.
         Tarih adımlarında takvimin üstündeki hap sırası gizlenir (küçük ekranda takvim + baloncuk sığsın).
      C) Villa sıralarken sayfa yenilenmesi düzeldi: ortak sürükleme yardımcısı (villalar + fotoğraflar): 400 ms basılı tut,
         öncesinde parmak kayarsa normal kaydırma; sürüklerken sayfa kaydırması, aşağı çekip yenileme ve kenardan geri kilitli
         (yalnız bu sırada passive olmayan touchmove), kenara yaklaşınca liste kendi kayar. Yenilemede ilk 10 px ölü bölge.
      · Kendi bulduklarım: teklifteki %5/%10/%15 ve ödemedeki "Henüz değil" düğmeleri 44 px idi → 48 px.
      · Kalanlar: gerçek iPhone'da (klavye, titreşim) denenmedi; "Bize ulaşın" numarası hâlâ boş.

- [x] Görev 19B — Rehber ve klavye ince ayarı (Zeyd'in iPhone denemesinden) · Claude Code (16 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV19B.md`, QA: `docs/qa/gorev19b/` (README).
      1) Rehberde nabız yok: çerçeve sabit, ilk görünüşte 200 ms'de solarak belirir (takvimdeki ilk boş günün nabzı da kalktı).
      2) Çerçeve hedeften hedefe 450 ms, --egri-gecis ile tek harekette kayar (tek "delik" öğesi: konum transform, boyut
         genişlik/yükseklik; perde = 200vmax box-shadow). Baloncuk aynı anda, aynı eğriyle kayar; metin 120 ms çapraz geçiş.
         Ölçüm: geçişte kareler ortalama 16,7 ms, en uzun 16,9 ms.
      3) Kaydırmada gecikme yok: rehber katmanı hedefin kaydırma kabının içinde (sayfa: belge; panel: panelin kendisi; sabit öğe:
         ekran). Ölçüm: 10 kare kaydırmada çerçeve–hedef farkı 0 px (sayfada ve panelde).
      4) Klavye: panel açıkken arkadaki sayfa kilitli (body position:fixed, konum saklanır, kapanınca geri döner). Klavye açılınca
         panelin alt kenarı klavyenin hemen üstünde (--klavye; uygulamada @capacitor/keyboard, resize: none, keyboardWillShow;
         web'de visualViewport). Odaklanan alan yalnız gerekiyorsa 250 ms'de kaydırılır. Rehber açıkken odaklı alan rehberin
         hedefi olur, baloncuk alanı kapatmaz. Tüm yazı alanları ≥ 16 px.
         GERÇEK İPHONE'DA TEST EDİLECEK (iOS'un klavye açılırken web görünümünü kaydırması emülasyonda yok).
      5) İki standart eğri (:root): --egri-gecis (yer değiştirme, kapanış) ve --egri-giris (belirme); paneller, ekran geçişleri,
         sihirbaz, bildirimler, rehber ve misafir sayfası bunları kullanıyor (açılış animasyonuna dokunulmadı).

- [x] Görev 20 — Rehber düzeltmeleri, tarih seçim paneli, form sadeleştirme (Zeyd'in iPhone kaydından) · Claude Code (16 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV20.md`, QA: `docs/qa/gorev20/` (README, capraz-butonlar.md).
      A) Rehber: baloncuk hedefle asla çakışmaz (üstte → altta → yer yoksa görünen alanın en üstünde tek satır şerit
         "Misafirin adını yazın · Tamam"); klavye açıkken sabit "Kaydet" çubuğu formun sonunda akar (alanı örtmesin).
         Perde dokunuşu ve kaydırmayı yutmaz: karartılmış yerden kaydırılabilir, hedef dışındaki dokunuşlar belge düzeyinde
         iptal edilir (baloncuk sallanır). "Bu işlemi biliyor musunuz?" sorusu ve işlem bazında kapatma kalktı; "Yardımı kapat"
         Yardımlı modu kapatır ("Yardım kapatıldı. Hesap → Yardım'dan tekrar açabilirsiniz.", 2 sn). Ücret kartında "Değiştir"
         → alan + "Tamam"; kartta açık düzenleme varken rehberde "İleri" pasif; kapora tutarında da "Tamam" (özet satırı).
         Rezervasyon ve opsiyon rehberine "Not" adımı.
      B) Rehbersiz takvim seçimi: ilk dokunuşta takvim ekranın ortasına (400 ms, --egri-gecis; tamamen görünüyorsa kaymaz,
         küçük ekranda seçili günler panelin üstünde). Panel büyük, alttan kayar (320 ms, --egri-giris); başlık kalın ve yeşil:
         "Çıkış gününü seçin" + "Giriş: 27 Kasım Cuma · 16:00". Aralıkta "27 → 28 Kasım · 1 gece", sağda büyük toplam,
         döküm satırı, 3 eşit buton; içerik 40 ms arayla belirir; ekranın geri kalanı %35 kararır (dokununca seçim kalkar).
         Toplam = geceler + kısa konaklama (depozito hariç), tek yerde: `www/fiyat.js` (uygulama ve misafir sayfası).
      C) Rezervasyon formundan "Teklif olarak gönder" / "Fiyatı mesajla gönder", paylaşım panelinden "Özel teklif oluştur" kalktı.
      D) Klavye: dokununca odak bizde (önce panel içi kaydırma, sonra focus({preventScroll:true})); panel klavyeyle birlikte
         kayar; klavye kapanınca panel yerinde kalır (gerekirse altına boşluk). GERÇEK İPHONE'DA TEST EDİLECEK.

- [x] Görev 21 — Rehber: sabit odak şeridi (pencere sabit, sayfa kayar) · Claude Code (16 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV21.md`, ölçümler: `docs/qa/gorev21/olcum.md`.
      20.1'deki "en üste yapışan şerit" ve hedefi en üste kaydırma kaldırıldı. Yerine ODAK HATTI: hedefin alt kenarı klavye
      açıkken klavyenin 12 px üstünde, kapalıyken görünen alanın alttan %28'inde (panelde sabit "Kaydet" varsa onun 16 px
      üstünde). Baloncuk hedefin 8 px üstünde, hedefin genişliğinde. "İleri"de pencere ve baloncuk yerinde kalır, arkadaki
      içerik 420 ms kayar (--egri-gecis); pencere aynı karede yeni boya geçer; metin 120 ms çapraz geçiş. Uzun hedef (takvim,
      ücret kartı) hatta sığmazsa ikisinin birlikte görüneceği en düşük konum. Kaydırma yetmezse geçici boşluk (bitince yumuşakça
      kalkar). Panel açılırken içerik baştan son yerine konur (önce yukarı fırlayıp geri gelme yok). Klavye açılıp kapanınca
      hat klavyeyle birlikte hareket eder (250 ms). Elle kaydırmada pencere hedefi gecikmesiz izler. Tarih adımlarında alttaki
      seçim paneli ve sekmeler gizli (takvim + baloncuk küçük ekranda sığsın); yalnız "Geri" varsa baloncuğun üst satırında.
      GERÇEK İPHONE'DA TEST EDİLECEK (iOS klavye animasyonuyla eşzamanlılık).

- [x] Görev 22 — Rehberi kapatmak geçici · Claude Code (16 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV22.md`, QA: `docs/qa/gorev22/README.md`.
      Baloncuktaki "Yardımı kapat" yerine sağ üstte "✕ Kapat": yalnız o anki rehber kapanır (200 ms solar, bildirim yok),
      form/panel açık kalır, Yardımlı mod değişmez; sonraki işlemde rehber yine baştan gelir (20.3 kuralı değişti).
      Rehberi olan panellerin başlığının yanında "?" (circle-help, 48 px): o işlemin rehberini kalınan adımdan (bilinmiyorsa
      ilk boş alandan) tek seferlik açar; Yardımlı mod kapalıyken de görünür, rehber açıkken görünmez. Kalıcı kapatma yalnız
      Hesap → Yardım → Yardımlı mod ("Açıkken her işlemde adım adım yardım gösterilir."). Geçiş: cihazdaki "vt-yardim" kaydı
      bu sürümde bir kez sıfırlanır (mod açık; eski işlem başına kapatma kayıtları silinir; işaret: s:22).

- [x] Görev 23 — Rehber hataları: telefon alanı klavye altında, kapora adımında "çökme" · Claude Code (16 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV23.md`, sebep: `docs/qa/gorev23/sebep.md`,
      testler: `docs/qa/gorev23/test.md`.
      Sebep 1: rehber klavyedeki değişimi yalnız tek karede 40 px'ten büyük sıçramada fark ediyordu; kademeli açılan klavye ve
      sonradan gelen "Otomatik doldur" çubuğu (telefon alanı) kaçıyordu; uygulamada klavye yüksekliği keyboardWillShow'dan
      saklanıyordu. Artık odak hattı ve panelin alt kenarı her seferinde güncel visualViewport'tan; görünen alanın her
      değişiminde yeniden hizalama (büyük sıçrama 250 ms, küçük adımlar aynı karede). keyboardDidShow yalnız doğrulama/yedek.
      Sebep 2 (kapora): klavye açıkken baloncuk düğme satırının üstüne oturuyor, sağ üstteki "Yardımı kapat" tam kapora
      düğmesinin üstüne geliyordu; düğmeye dokunan rehberi (ve Yardımlı modu) kapatıyordu. Konsolda hata yoktu. Kapora iki adım:
      (a) düğme satırı, düğme açılınca kendiliğinden (b) tutar alanı (odak, klavye, odak hattı); düğme kapalıysa (b) atlanır.
      Genel: hedef her karede seçiciyle bulunur, ResizeObserver ile içerik kayınca yeniden hizalama, hedef 300 ms'de yoksa adım
      atlanır (konsola uyarı), rehberde yakalanmamış hata olursa rehber sessizce kapanır (form kullanılabilir kalır).
      GERÇEK İPHONE'DA TEST EDİLECEK (iOS'un resize olaylarının gerçek sırası).
      (Görev 24'te klavye hizalaması baştan sadeleştirildi; yukarıdaki "her değişimde yeniden hizalama" ve ResizeObserver kalktı.)

- [x] Görev 24 — Klavye ve rehber sadeleşti, takvim odağı, beyaz ekran · Claude Code (17 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV24.md`, ne kaldırıldı: `docs/qa/gorev24/sadelestirme.md`,
      testler: `docs/qa/gorev24/test.md`, regresyon: `docs/qa/gorev24/README.md`.
      24.1 tek klavye kuralı (index.html `klavyeyeHizala`, başka klavye hizalama kodu yok): odakta hiçbir şey kaymaz; klavye
      oturunca (görünen alan 120 ms sabit / uygulamada keyboardDidShow) TEK kaydırma, 300 ms --egri-gecis: alanın altı görünen
      alanın 12 pt üstüne; alan zaten görünüyorsa kaydırma yok; klavye yoksa (masaüstü) kaydırma yok. Rehber açıksa pencere ve
      baloncuk alanla birlikte (Rehber.klavyeKutu); rehber klavyenin oturmuş hâlini kullanır. Klavye kapanınca panel kendi yerine
      300 ms'de iner. Panel artık ekranı kaplar; klavye payı panelin beyaz alt dolgusu (.sheet padding-bottom, --klavye):
      klavye kapanırken arkadan takvim görünmez. Kaldırılanlar: onceKaydir, alanGoster (4 çağrı), 20.9 klavyeBosluk,
      .overlay bottom geçişi, rehberde visualViewport resize/scroll dinleyicileri, her karede hatDenetle, ResizeObserver
      zinciri, geçiş sonrası düzeltme.
      24.2 ücret kartında "Değiştir" açıkken rehber hedefi o fiyat alanı + Tamam ("Yeni tutarı yazın, sonra ‘Tamam’a
      dokunun."); Tamam'da yine tüm kart, kart zıplamaz. Değiştir odağı sayfayı kaydırmaz.
      24.3 takvimde giriş günü seçilince takvimin tamamı panelin üstündeki alanın ortasına (400 ms); sığmazsa son satırları
      panelin 8 pt üstünde, seçili gün görünür. Giriş günü seçiliyken de takvim dışı %35 kararır.
      24.4 manifest zemin/tema #10180D; www/img/acilis/ 11 iPhone açılış görseli (apple-touch-startup-image, logo web
      açılışının ilk karesiyle aynı yer ve boyut, durum çubuğu payı dahil). Zeyd ana ekrandaki simgeyi silip yeniden eklemeli.
      GERÇEK İPHONE'DA TEST EDİLECEK (klavye olaylarının sırası, açılış görselinin gösterilmesi ve durum çubuğu payı).
      (24.3'teki takvim kaydırması iPhone'da çalışmıyordu; Görev 25'te yeniden yapıldı.)

- [x] Görev 25 — Takvim seçiminde iki aşamalı otomatik konumlama · Claude Code (17 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV25.md`, sebep: `docs/qa/gorev25/sebep.md`,
      testler: `docs/qa/gorev25/README.md`.
      Sebep: 24.3'teki kaydırma her karede kendi yazdığı sayfa konumunu geri okuyup 2 px'ten fazla fark görünce "kullanıcı
      kaydırdı" sayıp duruyordu; iPhone'da sayfanın kaydırma konumu geç bildirildiği için 3–5 px'te duruyordu (taklitle
      yeniden üretildi). Görev 24 testi de "sayfa en üstte" durumunu denememişti (test yardımcısı günü önce ortaya kaydırıyordu).
      Yeni: takvimKonumla — aşama 1 (giriş günü): ay başlığı üst çubuğun 8 pt altına; sığmazsa ızgaranın son satırı panelin
      12 pt üstüne. Aşama 2 (çıkış günü): ızgaranın son satırı panelin 12 pt üstüne; ızgara sığmazsa seçili satırlar ortada.
      Panelin animasyonu bitince, gerçek yeri ölçülerek; tek hareket 400 ms --egri-gecis; konum geri okunmaz, kullanıcının
      dokunuşu/kaydırması animasyonu bırakır. Seçim kalkınca sayfa yerinde kalır (panel payı gerekmeyene kadar kalır: secPay).
      Rehberli seçimde konumu rehber verir (alt panel gizli, baloncuk takvimin üstünde).
      GERÇEK İPHONE'DA TEST EDİLECEK.
- [x] Görev 26 — Akıcılık, bugün işareti, kademeli girişler, tam denetim, yazı boyutu, stil rehberi · Claude Code (17 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV26.md`, testler: `docs/qa/gorev26/README.md`.
      Denetim raporu: `docs/DENETIM.md` (Ö1/Ö2 bulguları düzeltildi; Ö3 listesi Zeyd'in seçimini bekliyor).
      Stil rehberi: `docs/STIL.md` (renkler, yazı boyutları, düğmeler, ikonlar, boşluklar, hareket süreleri, terimler).
      Bundan sonraki işler STIL.md'ye uyacak; değerler index.html'de CSS değişkenlerinde.
      26.1: gün seçiminde ve panel açmada gereksiz yeniden hesaplamalar kaldırıldı (ızgara yalnız değişen hücreleri yazar,
      odak karartması yalnız yerleşim değişince konumlanır). Ölçüm Chrome iziyle; kare düşmesi gerçek iPhone'da görülmeli.
      26.2: bugün her zeminde kırmızı çerçeve (--bugun), lejantta da. 26.3–26.4: ekranlarda kartlar sırayla gelir;
      misafir sayfasında aşağı kaydırınca bölümler belirir. 26.6: silmelerde "Geri al", çevrimdışı şeridi,
      küçük düğme/yazı düzeltmeleri, yeni rehberler ve "?" düğmeleri. 26.7: Hesap → Görünüm → Yazı boyutu
      (Normal/Büyük/Çok büyük; iPhone'da büyük yazı açıksa bir kez önerilir). 26.8: STIL.md.
      Veritabanına dokunulmadı. GERÇEK İPHONE'DA TEST EDİLECEK (akıcılık, sistem yazı boyutu, çevrimdışı).

- [x] Görev 27 — Müsaitlik arama: "17–21 arası hangi villam boş?" · Claude Code (17 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi (her madde ayrı commit). Ayrıntı: `docs/GOREV27.md`, testler: `docs/qa/gorev27/README.md`.
      Takvim sekmesinin üstünde "Hangi villam boş?" kartı (Villalarım başlığında büyüteç de var) → tam ekran panel: sade takvim
      (18.1 kuralı, 18.2 görünüm), hızlı seçim (bu / gelecek hafta sonu, 7 gece), isteğe bağlı kişi sayısı → sonuç: boş villalar
      toplam fiyatla (20.7 konaklamaHesap), eksik fiyat, kural engeli, kısmen boş, hiç yoksa en yakın boşluk; kartta Rezervasyon ·
      Teklif · Opsiyon (form kapanınca sonuca dönülür); "Seç ve gönder" → düzenlenebilir WhatsApp mesajı.
      Villa sayfası bağlantıları ?giris=…&cikis=… ile o tarihleri seçili açar (g.html). DİKKAT: villa sayfaları Netlify'da;
      g.html'deki bu değişiklik Netlify'a yüklenene kadar bağlantılar tarihleri seçili açmaz (sayfa yine açılır).
      Yeni ayar: Villa bilgileri → "En az konaklama (gece)" + dönem kuralları (GOREV27'deki "Görev 15.9 dönem kuralı" uygulamada
      yoktu). villalar.bilgi içinde (enAz, enAzDonem); veritabanı yapısı değişmedi. Bakıcıda arama fiyatsız.
      GERÇEK İPHONE'DA TEST EDİLECEK (tam ekran panel, WhatsApp'ın açılması).
- [x] Görev 28 — Müsaitlik arama düzeltmeleri · Claude Code (17 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi. Ayrıntı: `docs/GOREV28.md`, sebep: `docs/qa/gorev28/sebep.md`, testler: `docs/qa/gorev28/README.md`.
      28.1: Villalarım başlığındaki büyüteç kaldırıldı (başlık satırı 18.15'teki hâlinde); arama yalnız Takvim sekmesinin üstünde.
      28.2 sebep: arama paneli önceki tarihleri saklıyordu; rehber tarih adımlarını atlayıp yalnız "Boş villaları göster" düğmesini
      açık bırakıyor, takvime dokunuşları yutuyordu (kullanıcı kilitleniyordu). Düzeltme: panel her açılışta temiz ("Son arama: …
      · tekrar ara" bağlantısı var); rehber seçim durumuna göre başlar ve kendini ayarlar; rehber motoruna `serbest` (deliğin
      dışında dokunulabilen yerler) eklendi; villa her açılışta seçim temiz (eski aralık ve alt panel geri gelmiyordu).
      GERÇEK İPHONE'DA TEST EDİLECEK.
- [x] Görev 29 — Ölçüm, yönetim paneli, App Store hazırlığı · Claude Code (17 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi (29.1–29.7 ayrı commit). Ayrıntı: `docs/GOREV29.md`, testler: `docs/qa/gorev29/README.md`.
      ÖNCE: `docs/VERITABANI_GOREV29.sql` Supabase'e uygulanmalı (ürün yöneticisi). Uygulanana kadar: ölçüm istekleri sunucuda
      reddedilir (uygulama etkilenmez, sessizce atılır); yönetim istatistikleri "sunucu güncellemesi bekleniyor" der.
      29.1 olcum.js: VT.olay, izinli olay listesi, yalnız sayı / evet-hayır / listeden değer; Hesap → Gizlilik → "Kullanım
      istatistiklerini paylaş". Sürüm config.js'te (surum: 1.0.0). 29.2 hata türü + dosya:satır (mesaj yok), oturumda en çok 5.
      29.3 Yönetim bölümü yalnız yöneticiye DOM'a eklenir: özet ve istatistikler, son görülme, sıralama, "Etkinliği gör" (onaylı).
      29.4 gizlilik metni. 29.5 iOS: PrivacyInfo.xcprivacy (projeye bağlı), InfoPlist.strings tr/en, MARKETING_VERSION 1.0.0.
      App Store Connect "App Privacy" yanıtları PrivacyInfo.xcprivacy ile aynı olmalı.
      29.6 yönetici iki adımlı doğrulama (TOTP) hazır; veritabanında aal2 kuralı AÇILMADI (Zeyd ve Berat kurduktan sonra açılacak).
      GERÇEK İPHONE'DA TEST EDİLECEK (TestFlight derlemesi, izin metinleri, QR okutma).
- [x] Görev 30 — Abonelik (istemci tarafı, şimdilik kapalı) + App Store metinleri + kalite turu · Claude Code (18 Kasım, gece görevi).
      Netlify'a yüklenmedi; GitHub'a gönderildi (30.1–30.6 ayrı commit). Kararlar: `docs/GECE_RAPORU.md`, testler: `docs/qa/gorev30/README.md`.
      Veritabanı (VERITABANI_GOREV29 ve 30) ürün yöneticisi tarafından 18 Kasım'da uygulandı. `sinir_acik` = false: kimse etkilenmez.
      30.1 Pro ekranı + `www/kosullar.html` + gizlilikte abonelik bölümü. 30.2 `www/magaza.js` (RevenueCat 14.1.0; config.js'te
      RC_IOS_KEY / RC_ANDROID_KEY boş → "Yakında"). 30.3 Pro ekranı yalnız sinir_acik ve villa_ekleyebilir=false iken (4. villa).
      30.4 Hesap → Üyelik. 30.5 yönetimde rozet, üyelik ver / kaldır (onaylı). 30.6 `supabase/functions/abonelik-webhook` (DEPLOY EDİLMEDİ).
      App Store: `docs/APPSTORE.md`, `docs/appstore-ekranlar/` (6 × 2 dil, 1320 × 2868).
      Abonelik açılmadan önce: mağaza ürünleri + RevenueCat + anahtarlar + webhook deploy + PrivacyInfo'ya "Purchase History".
- [x] Görev 31 — Tasarım dili 2.0: hareket, his, netlik · Claude Code (18 Kasım).
      Netlify'a yüklenmedi; GitHub'a gönderildi (31.1–31.14 ayrı commit). Testler ve kararlar: `docs/qa/gorev31/README.md`,
      videolar: `docs/qa/gorev31/video/`. Bütün değerler `:root` değişkenlerinde ve `docs/STIL.md`'de. Veritabanı değişmedi.
      31.1 panel 340 / 220 ms çekmece eğrisi, bildirim geçişi. 31.2 panellerde kademeli giriş. 31.3 basınca %97 (120 / 200 ms).
      31.4 tek titreşim tablosu (`TITRESIM_DILI`). 31.5 eşit genişlikte rakam, sayarak değişen toplam. 31.6 tik çizimi, "ilk" kartları.
      31.7 iskelet (300 / 400 ms), "Kaydediliyor… / Tekrar dene". 31.8 boş hâller. 31.9 sade hata metni, alan titremesi.
      31.10 gövde 17 px, en küçük 14 px, "? Nasıl?", "✕ Kapat". 31.11 ekranda tek ana düğme. 31.12 hızla çekip kapatma, lastik,
      kapanırken dokununca geri açılma. 31.13 `?yavas=3` (yalnız inceleme için).
      GERÇEK İPHONE'DA BAKILACAK: titreşimler (özellikle yeni `secim`), çekmece hissi, 17 px'lik yazı.
- [x] Görev 32 — Dış takvimler (Airbnb, Booking, Vrbo, Villasepeti; iCal), 10 dk ayırma, Kaydet'te anlık kontrol, çakışma alarmı
      · Claude Code (18 Kasım). Netlify'a yüklenmedi; GitHub'a gönderildi (32.1–32.9 ayrı commit). Testler ve açma adımları:
      `docs/qa/gorev32/README.md`.
      ÖNCE (ürün yöneticisi): `docs/VERITABANI_GOREV32.sql` uygulanır; `takvim-esitle` ve `takvim-ver` deploy edilir
      (`--no-verify-jwt`); `ESITLE_GIZLI` gizli değişkeni ve iki zamanlayıcı (10 dk "tam", 1 dk "dakika") kurulur.
      Uygulanana kadar uygulama bugünkü gibi çalışır, dış takvim bölümleri gizli kalır.
      Sunucu: `supabase/functions/takvim-esitle` (okuma, SSRF koruması, bekleyen onayı, çakışma ve ulaşılamıyor bildirimleri),
      `supabase/functions/takvim-ver` (bizden dışarıya .ics; misafir bilgisi yok). Ortak: `supabase/functions/_shared`.
      GERÇEK HESAPLARLA DENENECEK: Airbnb / Booking / Vrbo'nun gerçek linkleri ve bizim linkin o sitelere yapıştırılması.
- [x] Görev 33 — Dış satış düzeltmeleri (yarım gün, "Misafir bilgisi ekle" önce form), rezervasyon kaynağı ("Nereden geldi?",
      kanal etiketleri ve renkleri, komisyon), Gelir & gider'de kanal raporu, Misafirler (CRM), "Bağlamayı bize bırakın" (talep +
      yönetim paneli) · Claude Code (20–23 Kasım). 33.1–33.9 ayrı commit; Netlify'a yüklenmedi. Testler: `docs/qa/gorev33/README.md`.
      ÖNCE (ürün yöneticisi): `takvim-esitle` yeniden deploy (talep bildirimleri, yeni yerel siteler). Veritabanı uygulandı.
- [x] Görev 34 — Airbnb kalitesinde geçişler, 3D görseller, ad ("Villa Takvimim"), gizlilikte iletişim · 34.1–34.9 ürün yöneticisi
      (bulut), 34.10 videolar Claude Code (23 Kasım). Rapor ve videolar: `docs/qa/gorev34/README.md`. 3D görsellerin PNG'leri
      repoda değil (yalnız webp). GERÇEK İPHONE'DA BAKILACAK: arama açılışındaki bulanıklık (şu an ilk karede tam) ve kaydırma akıcılığı.
- [x] Görev 35 — 3D görseller her yerde (2. set: sihirbaz, sekme başlıkları, misafir sayfası; liste dolunca küçük görsel), misafir
      sayfasında canlı doluluk (`villa_doluluk`: dış satışlar ve bakıcının rezervasyonları dahil, 60 sn'de bir) · Claude Code
      (23 Kasım). 35.1–35.7 ayrı commit; Netlify'a yüklenmedi. Rapor: `docs/qa/gorev35/README.md`. Eski düz çizimler silindi.
- [x] Görev 36 — 3D görsel cilası: görsellerin arkasında hiçbir hâlde daire / zemin / gölge yok (misafir sayfasında da), boyutlar
      `:root`'ta tek tabloda (`--g3d-*`), başlık görselleri 3x ekranda 512 px, görseller başlık satırını itmiyor ve yazıyı bölmüyor
      (yer yoksa küçülüp kayboluyor), kaydırınca yarım kesik kalmıyor · Claude Code (23 Kasım). 36.1–36.6 ayrı commit; Netlify'a
      yüklenmedi. Rapor: `docs/qa/gorev36/README.md` (köşe + kenar ortası piksel denetimi, 320 / 390 / 430 × açık / gece × yazı boyutu).
- [x] Görev 37 — Sekme başlıklarında önce görsel sonra yazı (yazı hiç bölünmez; görsel alttaki öğeden en az 8 pt uzak, 36.7),
      dolu / boş etiketleri "Villa ekle" satırında (sığmazsa alt satırda sola yaslı), boş ekranda tek ve büyük (192 pt) görsel
      · Claude Code (23 Kasım). 37.1–37.5 ayrı commit; Netlify'a yüklenmedi. Rapor: `docs/qa/gorev37/README.md`.
      Sınır: 320 pt genişlik + çok büyük yazıda boş Villalarım'ın "Villa ekle" düğmesi ilk ekrana sığmıyor (kaydırınca görünür).
- [x] Görev 38 — Başlık görseli kaybolma hatası düzeltildi, Villalarım / Takvim / Hesap başlığı sayfanın tam ortasında (görsel solunda)
      · Claude Code (24 Kasım). 38.1–38.4 ayrı commit; Netlify'a yüklenmedi. Rapor: `docs/qa/gorev38/README.md`.
      Gerçek sebep: boş hâlde görsel gizliyken `baslikGuncelle()` yüksekliğini 0 ölçüp görsele kalıcı `opacity:0` yazıyordu;
      ancak kaydırınca siliniyordu (WebKit ve Chromium'da aynı). Artık görselin görünüp görünmeyeceğine JS karar veriyor
      (`baslikGorselDurum` → `h1.gorselGizli`), CSS `:has()` / container sorgusu yok. Testler webkit + chromium.
- [x] Görev 39 — İçerik bölümü başlıklarında çizgi ikon yerine 3D görsel (villa sayfası, Gelir & gider, misafir kartı);
      yazı görselin dikey ortasında, boş bölümde çizgi ikon geri gelir · Claude Code (24 Kasım). 39.1–39.6 ayrı commit;
      Netlify'a yüklenmedi. 8 yeni görsel `codex exec` ile (`docs/CODEX_3D_GORSELLER_3.md`). Rapor: `docs/qa/gorev39/README.md`.
      Hesap'taki ayar başlıkları çizgi ikonla kaldı.
- [x] Görev 40 — Villa sayfası üst kartında büyük kare fotoğraf (dokununca galeri, yoksa "Fotoğraf ekle"), yeni `bolum-teklif`
- [x] Görev 40 (veritabanı, PM uyguladı 25 Kasım) — `VERITABANI_GOREV40.sql`: 17:00 otomatik "giriş yaptı" kaldırıldı; 15:00 "16:00'da X gelecek · 1 saat kaldı" (yerleştirildiyse gitmez); "Misafiri yerleştir" anında bildirim (`tr_yerlesme_bildir` → `bildirim_anlik` → `bildirim_tetikle`; sahibe ödeme durumu, bakıcıya sadece "yerleşti", işaretleyene gitmez); 18:00 "yerleştirildi mi?" hatırlatması. Test edildi (geri alınan işlemde).
      görseli, sekme başlığı görselleri sola yaslı ve aynı yükseklikte, Villalarım'da "Bugün ve yarın" yerine arama (4+ villa;
      dolu / boş süzgeci), giriş yeşil / çıkış kırmızı, gri alana dokununca pencere kapanır (kaydedilmemiş değişiklik sorulur),
      yeni Ödemeler ekranı (Alınacak · Alınan · Kalan, ödeme listesi), hizalı tutar satırları · Claude Code (24 Kasım).
      40.1–40.9 ayrı commit; Netlify'a yüklenmedi. Rapor: `docs/qa/gorev40/README.md`. "Fazla alındı" turuncu yerine lacivert
      (sıcak renk yasağı). ÖNCE (ürün yöneticisi): `docs/VERITABANI_GOREV40.sql` (giriş bildirimleri) henüz uygulanmadı.
- [x] Görev 41 — Ödemeler tek bakışta (tam / eksik / fazla / hiç; fazla ödemede "tamamı alındı" yok), Sıradaki kartının rengi
      ödeme ve yerleştirme durumunu söylüyor (bekliyor amber, tam yeşil, eksik / fazla kırmızı, çıkış nötr; Ajanda da aynı), detayda
      "Nasıl?" yok, alttan açılan pencereler sağa sola ve aşağı kaymıyor, içerik en üstteyken aşağı çekince pencere kapanıyor,
      "Yerleştirildi · 11:45" / "Çıktı" satırında "Geri al" yerine "Düzenle" (saat değiştir / geri al) · Claude Code (24–25 Kasım).
      41.1–41.7 ayrı commit; Netlify'a yüklenmedi. Rapor: `docs/qa/gorev41/README.md`. Amber yalnız Sıradaki "bekliyor" hâlinde
      (STIL.md'de sarı yasağının tek istisnası).
- [x] Görev 42 — Büyük yazıda okunabilirlik: kelime asla bölünmüyor ("Villa bilgileri" artık harf harf alt alta dizilmiyor),
      yazı sütunu en az ≈ 8 harf, satırlarda sağdaki etiket / tutar sığmazsa başlığın altına iniyor, büyük yazıda "✕ Kapat" yerine
      yuvarlak ×, Ödemeler / Fiyatlar / fotoğraf kutuları dar yerde alt alta · Claude Code (25 Kasım). 42.1–42.5 ayrı commit;
      Netlify'a yüklenmedi. Rapor: `docs/qa/gorev42/README.md` (önce / sonra görüntüleri). Kalıcı test
      `docs/qa/gorev42/test/okunabilirlik.js`: 43 ekranda 0 bölünmüş kelime / 0 dar / 0 taşma (öncesi 124 / 210 / 8).
      Sapma: "dar" kuralı paragrafın kısa son satırını saymıyor; × Kapat 48 pt (dokunma alanı kuralı).
- [x] Görev 43 — Ödeme durumu tek kural, her yerde aynı renk (tam yeşil ✓, eksik / hiç alınmadı amber !, fazla kırmızı ⚠; detay,
      "Ödemeler" düğmesi rozetli, Ödemeler ekranı, Sıradaki, Ajanda, liste, Gelir & gider), soldan kaydırarak geri (ekran parmağı
      takip eder, arkadaki ekran -%25'ten gelir), geri düğmesi "‹ Villalar" (sığmazsa yalnız ok), tutarlarda ₺ bölünmez
      · Claude Code (25 Kasım). 43.1–43.5 ayrı commit; Netlify'a yüklenmedi. Rapor: `docs/qa/gorev43/README.md`.
      Kenar hareketi ana ekrana eklenmiş uygulamada / Capacitor'da; Safari sekmesinde Safari'ninki kalır. Misafir kartı pencere
      olduğu için orada kenar hareketi yok. GERÇEK İPHONE'DA BAKILACAK: kenardan kaydırma hissi (takip, yaylanma, fiske).
- [x] Görev 44 — Başlık görseli filtreyle / boş hâlde kaybolmuyor (yalnız yer yoksa gizli), akıcılık (zorunlu layout tekrarları,
      content-visibility, bulanıklık kalktı, iOS 120 Hz anahtarı; en kötü kare villa girişi 1083 → 233 ms, CPU 4x yavaş), Villalar ve
      Hesap başlık görselleri yeniden (yatay, Takvim'le aynı stil; oran 1,31 / 1,38) · Claude Code (25 Kasım). 44.1–44.4 ayrı commit;
      Netlify'a yüklenmedi. Rapor: `docs/qa/gorev44/README.md`, ölçüm `performans.md`, adaylar `www/img/3d/aday/`.
      Kalan: ekran açılışının ilk karesi hâlâ 50 ms'yi geçiyor (büyük ekranı parça parça çizmek ayrı iş). Görev 43.1'de silinen
      `odemeTam` (giriş günü detay hatası) 44.2'de düzeltildi. GERÇEK İPHONE'DA BAKILACAK: akıcılık, 120 Hz.

## Veritabanı için gerekenler (Görev 18) — YAPILMADI (taslak; şimdilik cihazda saklanıyor)
1. **Villa sırası kullanıcıya özel ve kalıcı olsun (18.16).** Şu an sıra cihazda (`vt-villa-sira`); başka telefonda varsayılan sıra görünür.
   ```sql
   alter table public.villa_erisim add column if not exists sira integer;
   -- kullanıcı yalnız kendi satırının sırasını değiştirebilsin
   create policy p_erisim_sira on public.villa_erisim for update
     using (kullanici = auth.uid()) with check (kullanici = auth.uid());
   ```
   Kurulunca uygulama `villa_erisim?select=villa_id,rol,sira` ile okuyup sıralar, sürükleyince `PATCH villa_erisim?kullanici=eq.<id>&villa_id=eq.<villa>`
   ile `sira` yazar (uygulama tarafı bu kurulunca yapılacak). Var olan `villa_erisim` güncelleme izinleri kontrol edilmeden kurulmamalı.

## Veritabanı için gerekenler (Görev 17) — Claude kuracak (uygulama hazır, kurulum doğrulanmadı)
1. `rezervasyonlar`: `giris_onay`, `cikis_onay` (timestamptz), `giris_onaylayan`, `cikis_onaylayan` (uuid). Uygulama
   okurken bu sütunları kullanır, yazarken `PATCH rezervasyonlar?id=eq.<id>` gönderir. Bakıcı da yazabilmeli; yazma izni
   yoksa ve satır dönmezse uygulama "yetkiniz yok" der.
2. `rpc/bakici_odeme_ekle(p_rez uuid, p_tutar bigint, p_not text)`: yeni kalan tutarı döndürsün (sayı ya da tek sütunlu satır).
   Sahip tarafında Gelir & gider'de "kim aldı" görünsün diye **p_not, odemeler.aciklama'ya yazılmalı** (uygulama
   "Bakıcı aldı · Ali · 14:40" gönderiyor; Gelir & gider ödeme satırında not olarak görünür).
3. Kurulmadan önce de uygulama çalışır: bakıcı ödemesinde "bu özellik sunucuda henüz hazır değil. Villa sahibine haber verin.",
   yerleştirmede "bu özellik sunucuda henüz hazır değil" mesajı çıkar, ekran eski hâline döner.

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

## Veritabanı için gerekenler (Görev 15) — ŞİMDİLİK GEREKMİYOR
Opsiyonlar şu an `villalar.bilgi.opsiyonlar` içinde çalışıyor. İleride rezervasyonlarla aynı tabloda tutmak istenirse taslak:
```sql
alter table public.rezervasyonlar
  add column if not exists durum text not null default 'kesin' check (durum in ('kesin','opsiyon')),
  add column if not exists opsiyon_bitis date;
```
Bu yapılırsa bakıcı tarafı, kalan ödeme hesapları (bakici_kalanlar) ve çakışma kontrolleri `durum = 'kesin'` ile süzülmeli;
uygulama da opsiyonları bilgi'den bu sütunlara taşıyacak şekilde güncellenmeli.

## Gelecek fikirler
- 3D / sanal tur: villa fotoğraflarından 3D görünüm (Zeyd'in fikri, 14 Kasım). Şimdilik park edildi.

## Sonraki fazlar
- Bakıcı davet bağlantısı yüklü uygulamayı doğrudan açsın (iOS universal link / Android app link). Şimdilik web adresi açılır.
- UYGULAMA_ADRESI (index.html) şu an GitHub Pages test adresi; kalıcı adres belli olunca değiştirilecek.
- **Faz 3 / bildirimler:** Web Push app içinde çalışmıyor. Firebase/APNs ile native bildirim
  (@capacitor/push-notifications) + Supabase edge function'ı buna göre güncellemek.
- Şifre sıfırlama e-postası şu an siteye yönlendiriyor (çalışıyor ama app'e dönmüyor) → ileride deep link.
- App Store incelemesi için app'e özel özellikler (Apple "sadece site" uygulamalarını reddedebilir).
- Paylaş (navigator.share) ve PDF dışa aktarma gerçek iPhone'da test edilecek.
