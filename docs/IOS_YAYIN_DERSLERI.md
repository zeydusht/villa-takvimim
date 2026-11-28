# iOS yayın dersleri (Reverse Solver'dan) + Villa Takvimim kontrol listesi

_PM, 27 Kasım 2026._ Reverse Solver'ı App Store'a gönderirken saatler kaybettik. Bu dosya aynı hataların Villa Takvimim'de tekrarlanmaması için. Claude Code iOS ile ilgili her işte önce bunu okur.

---

## 1. En kritik: "TEKİN"deki İ harfi imzayı bozuyor

- **Belirti:** Arşiv alınıyor, ama yüklemede ya da doğrulamada Apple "imza geçersiz" diyor. Reverse Solver'da hata UnityFramework ve uygulama paketindeydi. Xcode Organizer'dan yükleyince de aynı hata çıktı.
- **Sebep:** Sertifikadaki ad `Zeyd TEKİN`. Sertifikada İ tek bir harf olarak (U+0130, UTF-8 `c4 b0`) duruyor. Mac'in `codesign` aracı ise imza kuralını (designated requirement) yazarken onu "I + üst nokta" (U+0049 + U+0307, `49 cc 87`) diye ikiye bölüyor. Kural ile sertifika tutmuyor.
- **Kontrol:**
  ```sh
  codesign -d -r- <paket> 2>&1 | grep designated
  ```
  Çıktıda `49cc87` görünüyorsa sorun var. `c4b0` görünüyorsa doğru.
- **Çözüm (Reverse Solver'da çalıştı):** Her imzalı paketi (önce `Frameworks/*`, en son `.app`) kuralda `49cc87` → `c4b0` düzeltilerek yeniden imzala:
  ```sh
  R=$(codesign -d -r- "$P" 2>&1 | sed -n 's/^designated => //p' | sed 's/49cc87/c4b0/g')
  codesign -f -s "$ID" --preserve-metadata=identifier,entitlements,flags --requirements "=designated => $R" "$P"
  ```
  Sonra kontrol et:
  ```sh
  codesign --verify --deep --strict -v <app>
  ```
  "satisfies its Designated Requirement" görünmeli.
- **Villa Takvimim'de:** Derleme GitHub Actions'ta (`ios.yml`) yapılıyor. Aynı sertifika adı kullanılacağı için sorun büyük ihtimalle orada da çıkar.
  - Export'tan sonra, yüklemeden **önce** iki adım ekle: imza kontrolü ve gerekirse düzeltme. Yükleme bu iki adımdan sonra gelsin.
  - Capacitor eklentileri dinamik framework olarak gömülüyorsa (`App.app/Frameworks/`) hepsine uygula.
- **Doğrulama:** Yüklemeden önce `xcrun altool --validate-app` (ya da eşdeğeri) çalıştır. Hata Apple incelemesine gitmeden yakalansın.

## 2. Bulutta imzalama tuzakları (GitHub Actions)

- **Sertifika sınırı:** Her yeni Mac makinesinde otomatik imzalama yeni bir sertifika oluşturabilir. Apple'ın sertifika sayısı sınırlı. "Maximum number of certificates" hatası çıkarsa çözüm şu:
  - Tek bir dağıtım sertifikasını (`.p12` + şifre) GitHub Secrets'a koy.
  - Her derlemede onu geçici anahtar zincirine yükle.
  - Bunun için PM'e haber ver, Zeyd'in yapacağı adımlar var.
- **Yükleme adımı:** `ios.yml` şu an export'ta bitiyor. TestFlight'a gerçekten yükleyip yüklemediğini kontrol et:
  - `ExportOptions.plist` içinde `destination = upload` var mı?
  - Yoksa ayrı bir `altool` / `notarytool` adımı gerekiyor mu?
- **Build numarası:** Her yükleme bir öncekinden büyük olmalı. `github.run_number` uygun. İleride elle yükleme yapılırsa numara bunun üstünde verilmeli.
- **Şifreleme sorusu:** Her yüklemede App Store Connect sormasın diye `Info.plist`'e `ITSAppUsesNonExemptEncryption = NO` ekle. Yalnız HTTPS kullanılıyor, bu yeterli.
- **Hatalar Türkçe ve tek satır:** Her adımın sonunda ne olduğu Türkçe ve kısa yazılsın. Zeyd Actions günlüğünü okumaz; hata olursa günlüğün ekran görüntüsünü PM'e atar.

## 3. Windows'tan Mac'e geçen dosyalar

- **Çalıştırma izni:** Windows'ta yapılan zip, betiklerin çalıştırma iznini kaybediyor ("Permission denied"). Mac tarafında betik her zaman `bash betik.sh` ile çağrılsın. Betik gerekirse `chmod +x` yapsın.
- **Satır sonları:** Windows CRLF satır sonu bash betiklerini bozar. `.gitattributes` dosyasına şunları ekle:
  ```
  *.sh text eol=lf
  *.yml text eol=lf
  *.plist text eol=lf
  ```
- **Dosya ve klasör adları:** Bundle ID, scheme, dosya ve klasör adları, betik değişkenleri yalnız ASCII olsun. Türkçe karakter yalnız kullanıcının gördüğü metinlerde olabilir.
- **Mac'te iş:** Elle Mac'te iş gerekirse (arkadaşın Mac'i) tek komutluk bir betik hazırla: `bash ~/Downloads/vt-yukle.sh`.
  - Betik her adımda Türkçe ne yaptığını yazsın.
  - Takılırsa o adımdan devam edebilsin.
  - Anahtar zinciri kutularında Zeyd'e "Always Allow" demesini söylesin.
  - Reverse Solver'da bu tek betik yaklaşımı ilk denemede çalıştı.

## 4. Apple incelemesinde reddedilme riskleri

- **Onay bekleyen hesap:**
  - Yeni hesaplar elle onaylanıyor; Apple'ın incelemecisi kayıt olursa uygulamaya giremez ve red gelir.
  - Önceden **onaylanmış demo hesap** hazırlanmalı, içinde sahte villa ve rezervasyonlar olsun.
  - Bilgileri İnceleme Notu'na girilecek (`docs/APPSTORE.md`).
  - Demo hesabı PM ile birlikte oluştur, veritabanına Claude Code dokunmaz.
- **"Sadece web sitesi" reddi (Kural 4.2):**
  - Apple, siteyi kabuğa saran uygulamaları reddedebilir.
  - Uygulamaya özel özellikler gerçekten çalışmalı ve İnceleme Notu'nda sayılmalı: Face ID kilidi, titreşim, paylaşım sayfası, dosya kaydetme (PDF).
  - Native bildirim gelince o da eklenecek.
- **Yarım özellik (Kural 2.1):**
  - App içinde bildirim ayarında "bir sonraki sürümde" yazıyor. Apple "yapım aşamasında" içerikleri reddedebilir.
  - App sürümünde bu ayarı tamamen **gizle**. Sitede kalabilir.
  - Aynı şekilde boş, kapalı ya da "yakında" yazan hiçbir düğme kalmasın. RevenueCat kapalıyken abonelik ya da Pro ile ilgili hiçbir şey görünmesin.
- **Web Push uygulama içinde çalışmaz:** WKWebView'de Web Push yok. Native bildirim için `@capacitor/push-notifications` + APNs gerekiyor (Faz 3). İlk sürüm bildirimsiz çıkabilir, ama ilgili ayar görünmemeli.
- **İzin metinleri:**
  - `Info.plist`'te kullanılan her izin için açıklama olmalı: Face ID (`NSFaceIDUsageDescription`), kamera, fotoğraflar (okuma/ekleme).
  - Eksik olursa uygulama o anda çöker ya da Apple reddeder.
  - Metinler Türkçe ve İngilizce olsun, neden istendiğini açıkça söylesin.
- **Hesap silme:** Uygulama içinden yapılabiliyor (Hesap → Hesabım). Gerçek iPhone'da çalıştığını doğrula.
- **Ad tutarlılığı:** Mağazada "Villa Takvimim", uygulamanın içinde "Villa Takvim" yazıyor. Apple, ana ekrandaki ad ile mağaza adının uyumlu olmasını istiyor.
  - Uygulama içindeki adı "Villa Takvimim" yap.
  - Ana ekran adını (`CFBundleDisplayName`) da kontrol et.
  - Zeyd'in kararı: uygulamanın adı "Villa Takvimim".
- **Yalnız iPhone:** `TARGETED_DEVICE_FAMILY = 1` olsun. iPad açık kalırsa iPad ekran görüntüleri de zorunlu olur ve iPad'de ayrıca test edilmesi gerekir.

## 5. Güvenlik (Reverse Solver'da yaşandı)

- Reverse Solver'da test tarayıcısının profil klasörü yanlışlıkla GitHub'a gitti ve içinde bir Google API anahtarı vardı. Repo herkese açık.
- **Asla commit edilmeyecekler:**
  - `.p8`, `.p12`, `.mobileprovision`
  - Şifreler
  - Supabase `service_role` anahtarı
  - Tarayıcı ya da Playwright profil klasörleri
  - `.env` dosyaları
- **Önlem:** Bunları `.gitignore`'a ekle. Her commit'ten önce `git status`'a bak; tanımadığın büyük bir klasör varsa ekleme.
- **Anahtarların yeri:** Apple anahtarları yalnız GitHub Secrets'ta durur.

## 6. TestFlight'tan önce gerçek iPhone kontrolü

İlk TestFlight derlemesi gelince Zeyd'in telefonunda şunlar denenecek (liste PM'e rapor edilir):

- **Giriş ve oturum:** Giriş, çıkış, şifre sıfırlama. E-posta linki siteye gidiyor; bu biliniyor ve kabul.
- **Face ID kilidi:** İzin kutusu çıkıyor mu, metni doğru mu?
- **Fotoğraf ekleme:** Kamera ve galeriden ekleme çalışıyor mu?
- **Paylaşım:**
  - WhatsApp'a villa sayfası gönderiliyor mu?
  - Önizlemede "Villa Takvimim / villa adı" görünüyor mu?
- **PDF:** Rezervasyon formu açılıyor, kaydediliyor ve paylaşılıyor mu?
- **Dış linkler:** Uygulama içinde açılıp geri dönülebiliyor mu?
- **Hesap silme:** Uçtan uca çalışıyor mu? Bunu test hesabıyla dene, demo hesapla değil.
- **Ekran ve görünüm:**
  - Büyük yazı modu taşmıyor mu?
  - Üst çentik ve alt çubuk hiçbir şeyi kapatmıyor mu?

---

## Claude Code için yapılacaklar (bu dosyayı okuyunca)

Her maddeyi projede kontrol et. Olanları "var" diye işaretle, olmayanları yap. Kapsam dar: başka bir şeye dokunma.

1. **İmza kontrolü:** `ios.yml`'e, export'tan sonra imza kontrolü + İ düzeltmesi + doğrulama adımı ekle (§1). Yükleme adımı yoksa ekle (§2).
2. **Şifreleme:** `Info.plist` → `ITSAppUsesNonExemptEncryption = NO`.
3. **İzin metinleri:** `Info.plist`'te kullanılan her izin için açıklama var mı? Eksik olanları ekle, TR/EN (§4).
4. **Yalnız iPhone:** `TARGETED_DEVICE_FAMILY = 1`.
5. **Satır sonları:** `.gitattributes` ekle (§3).
6. **`.gitignore`:** `*.p12`, `*.mobileprovision`, `.env*`, tarayıcı ve Playwright profil klasörleri (§5).
7. **App sürümünde gizlenecekler:** Bildirim ayarındaki "bir sonraki sürümde" satırı, varsa başka "yakında" ya da boş öğeler, abonelik ve Pro ile ilgili her şey. Bunlar yalnız app'te gizlensin, site değişmesin (§4).
8. **Ad:** Uygulamanın içindeki "Villa Takvim" yazılarını ve `CFBundleDisplayName`'i listele, "Villa Takvimim" yap.
   - Misafirin gördüğü villa sayfası ve paylaşım önizlemesi de dahil.
   - Değiştirmeden önce listeyi raporda göster.
9. **Kontrol listesi dosyası:** §6'daki iPhone kontrol listesini `docs/IPHONE_KONTROL.md` olarak hazırla, her satırın yanında boş kutu olsun.

### Durum (Claude Code, 27 Kasım 2026)
1. Eklendi: `ios.yml` → arşiv, .ipa, `ios/ci/imza-duzelt.sh` (kontrol + İ düzeltmesi + verify), `altool --validate-app`, `altool --upload-app`. ExportOptions artık `export` (önceden doğrudan `upload` ediyordu, kontrol araya giremiyordu). İsteğe bağlı sır: `IOS_DIST_P12` (base64) + `IOS_DIST_P12_SIFRE`.
2. Var: `ITSAppUsesNonExemptEncryption = NO`.
3. Var: kamera, fotoğraf okuma, Face ID (TR/EN). Eklendi: fotoğraf ekleme (`NSPhotoLibraryAddUsageDescription`, TR/EN).
4. Var: `TARGETED_DEVICE_FAMILY = 1` (Debug ve Release).
5. Eklendi: `.gitattributes` (sh, yml, plist, pbxproj, strings → LF).
6. Eklendi: `.gitignore` → p12, cer, mobileprovision, .env, tarayıcı/Playwright profil klasörleri (`*.p8` zaten vardı).
7. Eklendi (yalnız app, site aynı): bildirim ayarı gizli; mağaza kapalıyken Pro/üyelik hiçbir yerde yok (4. villada Pro ekranı açılmaz); "Bize ulaşın" "yakında" yerine destek e-postasını gösterir.
8. Görünür "Villa Takvim" yazısı yoktu (CFBundleDisplayName, manifest, Android, misafir sayfası, önizleme zaten "Villa Takvimim"). Yalnız yedek dosya adları `villa-takvim-…` → `villa-takvimim-…` yapıldı.
9. Eklendi: `docs/IPHONE_KONTROL.md`.

**Yasaklar:**
- Veritabanına, Supabase ayarlarına ve App Store Connect'e dokunma.
- TestFlight'a yükleme yapma.
- Yayın yapma: Cloudflare ya da `canli` dalına itme.

**Bitiş:** Commit + push (`main`). Mesajının en altına kısa özet yaz: ne var, ne eklendi, Zeyd'in ya da PM'in yapması gereken ne kaldı.

### İlk TestFlight yüklemesi (Claude Code, 28 Kasım 2026)
- API anahtarının rolü **Admin** olmalı. Değilse dışa aktarma "Cloud signing permission error" verir.
- Apple'ın bulut imzası (cloud-managed sertifika) kullanılınca İ hatası çıktı (Capacitor, Cordova, App: 49cc87) ve özel anahtar makinede olmadığı için düzeltilemedi.
- Kendi "Apple Distribution" sertifikamız (`IOS_DIST_P12`) yüklenince kural baştan doğru çıktı (c4b0); build 278 doğrulandı ve yüklendi.
- .p12 Windows'ta openssl ile yapıldı (CSR → Apple → .cer → .p12, `-certpbe/-keypbe PBE-SHA1-3DES -macalg sha1`). Şifre dosyasında `\r` kalırsa Mac "passphrase not correct" der.
- Sırlar eklendiği için artık main'e her push TestFlight'a yükler; yalnız belge değişen commit'lere `[skip ci]` ekle.
