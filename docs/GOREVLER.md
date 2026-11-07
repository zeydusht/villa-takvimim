# Villa Takvimim — Düzeltme Görevleri

_7 Kasım 2026 · Kaynak: uygulama inceleme raporu_

Bu dosya Claude Code için yazıldı. Görevleri **sırayla** yap, her bölüm bitince
commit at ve kutuyu işaretle. Kullanıcı (Zeyd) yazılımcı değil: bir şeyi
denemesi gerekirse ona adım adım, basit dille anlat.

## 0. Başlamadan önce (kod bu klasörde yoksa)
Bu dosya boş bir klasörde tek başına duruyorsa, önce uygulamanın kodunu buraya indir:
```
git init
git remote add origin https://github.com/zeydusht/villa-takvimim
git fetch origin
git checkout -f -B main origin/main
npm install
```
Sonra bu dosyanın (GOREVLER.md) kökteki kopyasıyla `docs/GOREVLER.md` aynıysa kökteki kopyayı sil.
iPhone derlemesi GitHub'da yapıldığı için işler bitince `git push` şart.

## Çalışma kuralları
- Uygulama kodu `www/` içinde. `index.html` (~4000 satır, tek dosya), `veri.js` (Supabase katmanı),
  `dil.js` (TR→EN çeviri sözlüğü, anahtar = Türkçe metin), `g.html` (misafire açılan villa sayfası),
  `native.js` (sadece iPhone/Android uygulamasında çalışan katman).
- `www/` aynı zamanda canlı web sitesi. Site davranışını bozma; app'e özel işler `native.js` içinde
  ya da `document.documentElement.classList.contains("native")` kontrolüyle yapılır.
- Yeni bir Türkçe metin eklersen İngilizcesini `dil.js`'e ekle.
- Her değişiklikten sonra `npx cap sync` çalıştır.
- Satır numaraları 7 Kasım hali içindir, kaymış olabilir; fonksiyon adıyla ara.
- Güvenlik/veritabanı görevleri bu dosyada **yok** (repo herkese açık). Onlar ayrıca yapılıyor.

## Nasıl test edilir
Sahte veriyle telefonda test için: `www/` klasörünü yerel sunucuda aç
(`npx serve www`), tarayıcıda telefon görünümü (390×844). Giriş için gerçek hesap gerekir;
gerçek verilerde test kaydı açarsan sonunda sil.

---

## 1. App katmanı (App Store'u engelleyenler)

- [x] **1.1 Kamera / fotoğraf izin metinleri.** `ios/App/App/Info.plist` içinde
  `NSCameraUsageDescription` ve `NSPhotoLibraryUsageDescription` yok. iPhone'da fotoğraf eklerken
  "Fotoğraf çek" seçilince uygulama çöker.
  Ekle: "Villa ve fiş fotoğrafı çekebilmeniz için kameraya erişim gerekiyor." /
  "Villa fotoğraflarınızı seçebilmeniz için fotoğraflarınıza erişim gerekiyor."
  Android için gerekirse `AndroidManifest.xml`'e kamera izni.
- [x] **1.2 İndirme butonları.** Şu 4 yer `a.download` + `URL.createObjectURL` ile dosya indiriyor;
  iOS uygulamasının içinde bu çalışmaz:
  - Verilerimi indir (`a.download="villa-takvim-verilerim-…json"`)
  - Rezervasyon formu PDF (`a2.download=ad`, misafir teklifi civarı)
  - Dönem raporu PDF (`a.download=ad`, `formSheet` civarı)
  - Yedek al (`a.download="villa-takvim-….json"`)
  Çözüm: `@capacitor/filesystem` + `@capacitor/share` kur; `native.js`'e
  `window.VTNative.dosyaPaylas(blob, dosyaAdi)` yaz (blob'u cache'e yaz → Share ile paylaş).
  Bu 4 yer native'deyse bunu çağırsın, sitede eskisi gibi indirsin.
  Ayrıca `navigator.share({files})` kullanan yerler (PDF'i WhatsApp'a gönder) native'de
  aynı fonksiyona yönlensin.
- [x] **1.3 "Ana ekrana ekleyin" kutusu app içinde gizlensin.** `zatenKurulu()` fonksiyonuna
  native kontrolü ekle (`window.Capacitor && Capacitor.isNativePlatform()` → true).
- [x] **1.4 Tarayıcı uyarı kutuları.** `index.html`'de 12 adet `alert(` var. Uygulamanın kendi
  `perde()` panelini kullanan küçük bir `uyari(metin)` fonksiyonu yaz, hepsini ona çevir.
- [x] **1.5 Sadece iPhone.** `ios/App/App.xcodeproj/project.pbxproj` içinde
  `TARGETED_DEVICE_FAMILY = "1,2"` → `"1"` (iki yerde). Info.plist'teki iPad yön ayarları kalabilir.
- [ ] **1.6 Bildirimler (büyük iş, en sona bırakılabilir).** Web Push app içinde çalışmıyor.
  `@capacitor/push-notifications` ile native bildirim; cihaz jetonunu `push_abonelik` tablosuna
  yeni bir `tur` alanıyla kaydet; Supabase `bildirim` edge function'ı APNs/FCM'e de göndersin.
  Bunu yapmadan önce kullanıcıya Firebase / Apple anahtarı adımlarını sor.

## 2. Hatalar

- [x] **2.1 Misafir sayfası kendiliğinden güncellenmiyor.** `paylasBtn` tıklanınca `yayinla(v)`
  çalışıyor, başka hiçbir yerde çalışmıyor. Sonradan eklenen rezervasyon misafire boş görünür.
  Çözüm: `kaydet()` sonrasında, villa yayındaysa (`v.paylasim.yayin`) ve
  `v.paylasim.imza !== icerikImza(v)` ise, birkaç saniye gecikmeli (debounce) arka planda
  `yayinla(v)` çağır; hata olursa sessizce bir sonraki kayıtta tekrar dene.
- [x] **2.2 Bakıcı para bilgisi tutarsız.** Bakıcılar ekranı "Ödemeler, gelirler ve kazanç
  bilgileri onlara kapalıdır" diyor ama bakıcı:
  - yaklaşan rezervasyonlar listesinde "· kalan 32.000 ₺" görüyor (`ciz()` içinde,
    `'… kalan '+para(kalan)` satırı `paraGorur()` kontrolü olmadan),
  - takvimde fiyatları ve rezervasyon detayında tutarları görüyor.
  **Bu bir ürün kararı — önce Zeyd'e sor:** bakıcı parayı görsün mü?
  Görmesin derse: tüm para gösterimlerini `paraGorur()` ile koru. Görsün derse: bakıcılar
  ekranındaki metni düzelt.
  _Karar (Zeyd, 7 Kasım): bakıcı sadece girişte alınacak kalan tutarı görür; şimdilik yalnız ekranda gizleme._
- [x] **2.3 Telefon alanında `+` yazılamıyor.** `alan()` fonksiyonu `tel` tipindeki tüm alanlara
  `inputmode="numeric"` veriyor; iPhone'da rakam klavyesi açılıyor. Telefon alanları
  (`f-phone` ve diğer telefon girişleri) için `inputmode="tel"`, tutar alanları `numeric` kalsın.
- [x] **2.4 Misafirler listesi.** Liste satırında isim ve "1 konaklama · son …" yapışık
  ("John Smith1 konaklama"). Alt satıra al. Gelecek konaklama için "son" yerine "sıradaki".
  Sağdaki tutarın başına "Alınan" yaz.
- [x] **2.5 Villa sayfası onaysız yayınlanıyor.** "Villa sayfası oluştur" tek dokunuşla yayına
  alıyor. Önce önizleme paneli göster (fotoğraf yoksa ve villa bilgisi yarımsa uyarı), "Yayınla"
  butonuyla aç.
- [x] **2.6 Villa bilgilerinde tekrar eden seçenekler.** Bulaşık makinesi, çamaşır makinesi,
  klima, internet, barbekü, şömine hem "Özellikler" hem "Ev olanakları" altında. Tek yerde topla;
  eski kayıtlardaki değerleri kaybetme (iki listeden gelen işaretleri birleştir).
- [x] **2.7 Rezervasyon iptali kalıcı siliyor.** İptal → 5 saniyelik "Geri al" bildirimi.
  (İptal geçmişi saklamak veritabanı değişikliği ister; şimdilik sadece "Geri al".)
- [x] **2.8 Kaydet butonu neden pasif belli değil.** Yeni rezervasyonda isim boşken "Rezervasyonu
  kaydet" gri. Butonu aktif bırak; basınca isim alanını kırmızı yap ve "Misafir adını yazın" de.
- [x] **2.9 Çeviri eksikleri.** İngilizcede Türkçe kalanlar: "Bugün dolu" (villa kartı),
  "· kalan …" (yaklaşan rezervasyonlar), "Çıkış … (2 gün sonra)" (villa başlığı). `dil.js`'e ekle;
  dinamik metinleri çeviri fonksiyonundan geçir.
- [x] **2.10 Gereksiz istekler.** Villa ekranı açılırken `rpc/villa_erisimleri` 4 kez çağrılıyor.
  Bir kez çağırıp sonucu sakla.

## 3. Görsel tasarım (okunabilirlik, "butonlar okunmuyor")

Hedef: daha net, daha "premium" ama aynı sade dil. Renk paleti ve yeşil (#0B5B57) kalsın.

- [x] **3.1 Gri yazılar koyulaşsın.** `--muted:#7A857F` beyazda kontrast 3,8 (sınır 4,5).
  `#5F6A64` civarına çek; açık gri zeminde de 4,5'i geçtiğini doğrula.
- [x] **3.2 İkincil butonlar (`.big.ghost`).** Şu an açık gri dolgu, kenarsız, normal yazı.
  Yap: beyaz zemin, 1.5px `#C9D1CC` kenarlık, `font-weight:600`, basılınca hafif koyulaşma.
  Ana buton (`.big`) dolu yeşil, `font-weight:600`.
- [x] **3.3 Tehlikeli butonlar** (Rezervasyonu iptal et, Villayı sil, Hesabımı sil, Paylaşımı
  kaldır): kırmızı yazı (`--uyari`), en alta ayrık. Villa ekranında çöp kutusu başlığın
  yanında duruyor; onu sayfanın en altına "Villayı sil" butonu olarak taşı.
- [x] **3.4 Çizgiler ve form alanları.** `--line:#E7EBE8` beyazda neredeyse görünmüyor (1,2).
  Ayırıcılar için `#D9DFDB`, form alt çizgisi için `#C9D1CC`; odaktaki alan yeşil alt çizgi.
- [x] **3.5 Açma-kapama düğmeleri (`.svic`).** Kapalıyken zemin `--line` ile aynı, görünmüyor.
  Kapalı: `#B8C2BC` zemin; açık: yeşil.
- [x] **3.6 Dokunma alanları en az 44×44 px.** Ölçülenler: Yedek al / Geri yükle (18 px yükseklik),
  Hesabımı sil (19), Paylaşımı kaldır (19), Misafirler "Seç" (19), rezervasyon detayındaki telefon
  linki (20), banner kapatma X (24), sheet kapatma X (28), geri oku (30), çöp kutusu (34),
  takvim ay okları (36), toggle (26).
- [x] **3.7 Liste satırları** (Villa bilgileri, Bakıcılar, Misafirler, Gelir & gider): sağa `›`
  ok işareti, sağdaki değer koyu gri.
- [x] **3.8 Bölüm başlıkları.** Villa ekranında "FİYATLAR" başlığının altında villa bilgileri,
  bakıcılar, misafirler, gelir-gider de duruyor. Gruplar: "Fiyatlar" (fiyat satırı) ·
  "Villa yönetimi" (bilgiler, bakıcılar, misafirler, gelir & gider) · "Fotoğraflar" ·
  "Villa sayfası".
- [x] **3.9 Tek kapatma.** Sheet'lerde hem sağ üstte X hem altta "Kapat" var. Altta "Kapat"ı kaldır,
  X'i 44 px yap. (Asıl eylem butonu olan sheet'lerde aşağı kaydırarak kapatma da iyi olur.)
- [x] **3.10 Başlıklar.** Başlıklar **kalınlaşmayacak**: serif başlıklar, ay adı, durum satırı,
  liste satırları ve diğer yazılar normal kalınlıkta (400) kalır; sadece buton yazıları kalın
  (600). Villa kartı ve sheet başlıklarının ölçüsü tutarlı olsun. _(7 Kasım: kalınlaştırma Zeyd'in
  isteğiyle geri alındı.)_

## 4. Ekran düzeni

- [x] **4.1 Ana ekran yer israfı.** Üstte bar logosu + büyük logo + "Villalarım" başlığı var;
  villa kartları 272 px yüksek, fotoğrafsızsa koca "V". Büyük logoyu kaldır; kartı ~140 px
  (fotoğraf solda kare, sağda ad + durum); fotoğrafsızsa küçük renkli baş harf.
- [x] **4.2 Alt sekme barı.** Ana ekrandaki uzun liste (villa ekle, kullanıcılar, davet kodu,
  hesabım, yedek) yerine altta 3 sekme: **Villalar · Takvim · Hesap**. "Takvim" şimdilik
  tüm villaların yaklaşan giriş/çıkışlarının listesi olabilir. Safe area'ya dikkat
  (`env(safe-area-inset-bottom)`).
- [x] **4.3 Takvim günleri.** Haftanın günleri "P S Ç P C C P" (iki P, iki C) →
  "Pt Sa Ça Pe Cu Ct Pz". Aynı düzeltme `g.html`'de de.
- [x] **4.4 Takvim okunabilirliği.** Geçmiş günler soluk; dolu günlerde fiyat yerine misafirin baş
  harfleri; ardışık rezervasyonlar birbirinden ayrılsın (farklı ton ya da aralarında boşluk);
  fiyat yazısı 9 px → en az 11 px.
- [x] **4.5 1 gecelik rezervasyonlar** ince şerit olarak kalıyor; dokunması zor. Görünür blok yap.
- [x] **4.6 Rezervasyon detayı.** Düz telefon numarası yerine iki buton: **Ara** (`tel:`) ve
  **WhatsApp** (`https://wa.me/<numara>`). Numarayı okunur biçimde göster (+90 532 000 00 00).
- [x] **4.7 Onay bekleyen ekranı.** "Hesabınız onay bekliyor" ekranına "WhatsApp'tan bize yazın"
  butonu ve "genelde 24 saat içinde onaylanır" gibi bir beklenti metni (metni Zeyd'e onaylat).

## 5. Küçük kazanımlar (vakit kalırsa)

- [ ] **5.1 Hazır WhatsApp mesajları** rezervasyon detayında: "Giriş bilgileri + konum",
  "Ödeme hatırlatma", "Teşekkürler". Metinler villa bilgilerinden doldurulsun.
- [ ] **5.2 Çevrimdışı işareti.** İnternet yokken üstte ince bir "Çevrimdışı — değişiklikler bu
  cihazda, bağlanınca gönderilecek" şeridi (`navigator.onLine` + `online/offline` olayları).
- [ ] **5.3 Gelir grafiği.** Gelir & gider ekranında aylara göre çubuk grafik (harici kütüphane
  olmadan, basit SVG).

---

## Bitince
1. `npx cap sync`, commit, `git push` → GitHub'da Android ve iOS derlemeleri kendiliğinden başlar.
2. `docs/PROJE_DURUMU.md`'yi güncelle: ne yapıldı, ne kaldı.
3. Zeyd'e neyin değiştiğini 5-6 maddede, teknik olmayan dille yaz; denemesi gereken yerleri söyle.
