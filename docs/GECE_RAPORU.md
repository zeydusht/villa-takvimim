# Gece raporu (18 Kasım 2026)

_Claude Code. Netlify'a yükleme yapılmadı, veritabanı değiştirilmedi. Her adım ayrı commit, GitHub'a gönderildi._

## Ne yapıldı

1. **Görev 29 kontrolü:** eksik yok. Ürün yöneticisi gece SQL dosyalarını (29 ve 30) uygulamış; ölçüm ve yönetim istatistikleri artık canlıda çalışır.
2. **Görev 30, abonelik (sınır kapalı, kimse etkilenmez):**
   - 30.1 Villa Takvimim Pro ekranı (büyük yazı, "İlk ay ücretsiz", geri yükleme, otomatik yenileme yazısı), `kosullar.html`, gizlilikte abonelik bölümü.
   - 30.2 RevenueCat mağaza bağlantısı (`magaza.js`). Anahtarlar boş olduğu için düğmeler "Yakında".
   - 30.3 Pro ekranı yalnız sınır açıkken ve 4. villa eklenirken çıkar.
   - 30.4 Hesap → Üyelik satırı ve "Aboneliği yönet".
   - 30.5 Yönetim: abonelik rozeti, onaylı "Üyelik ver" / "Üyeliği kaldır".
   - 30.6 `abonelik-webhook` sunucu fonksiyonu taslağı. Deploy edilmedi.
3. **App Store:** `docs/APPSTORE.md`'de Türkçe ve İngilizce metinler, yaş derecelendirmesi, App Privacy cevapları ve inceleme notu var. `docs/appstore-ekranlar/`'da 12 ekran görüntüsü var (6 ekran × 2 dil, 1320 × 2868).
4. **Kalite turu:** 16 durum denetlendi (iPhone SE dahil 4 boyut, normal ve çok büyük yazı, gece / gündüz modu). Şunlar düzeltildi:
   - 2 emoji;
   - 3 kesik ya da bölünen yazı;
   - İngilizcede çevrilmeyen bir satır;
   - Görev 29'dan kalan ikon kutusu hatası;
   - DENETIM Ö3'ten 3 madde.
5. **Testler (son kodla):**
   - Görev 30'un bütün testleri geçti.
   - Görev 19–29 testleri: hepsi geçti.
   - Son toplu turda Görev 27.6'da ekran görüntüsü zaman aşımı ve klavye testinde bir zamanlama sapması oldu. Tek başına yeniden çalıştırılınca ikisi de geçti (86/86, 7/7).

## Alınan önemli kararlar (ayrıntısı aşağıda)

- Mağaza bağlıyken bile deneme hakkı yoksa "İlk ay ücretsiz" yazmıyor. Fiyat, deneme yazısıyla aynı büyüklükte (Apple kuralı).
- Sınır kapalıyken "Üyelik" satırı da gizli. Yalnız sınır açılınca ya da kişiye üyelik verilince görünür.
- Mağazadan alınmış aboneliğe yönetim panelinden elle dokunulamıyor (karışmasın diye).
- App Store açıklamasında bu sürümde Pro anlatılmadı (abonelik kapalı).
- Webhook sandbox (test) satın almalarını da işler; yoksa Apple incelemecisinin satın alması açılmaz.

## Ne yapılamadı ve neden

- **iOS / Android derlemesi ve gerçek satın alma denemesi:** Windows'ta Xcode yok, RevenueCat anahtarı ve mağaza ürünü de yok. Satın alma, sahte mağaza eklentisiyle test edildi.
- **Webhook'un Supabase'de çalıştırılması:** görev gereği deploy edilmedi. Deno da kurulu değil. Node'da Deno ve veritabanı taklit edilerek 21 durumla test edildi.
- **DENETIM Ö3'ün kalan 10 maddesi:** tasarım kararı istiyor (takvimde fiyat gösterimi, yedek hatırlatması vb.).
- **Gerçek villa fotoğraflı ekran görüntüleri:** elimde fotoğraf yoktu. Villalar harf rozetiyle görünüyor.

## Zeyd'in yapması gerekenler

1. **Netlify'a yükleme** (siz söyleyince): uygulama içindeki "Kullanım Koşulları" ve gizlilik bağlantıları canlı siteyi açıyor. `kosullar.html` ve yeni gizlilik metni yüklenene kadar orada eski hâl ya da boş sayfa görünür.
2. **Gizlilik ve koşullar:** köşeli parantezli iletişim alanları doldurulmalı. Yayından önce bir avukata gösterilmesi önerilir.
3. **Aboneliği açmadan önce** (sırayla):
   1. App Store Connect'te ücretli uygulama sözleşmesi, banka ve vergi bilgileri.
   2. Aylık ürün `villatakvim_pro_aylik`, 1 ay ücretsiz deneme. Google Play'de de aynısı.
   3. RevenueCat projesi: ürünler, "pro" yetkisi, "default" teklif içinde aylık paket.
   4. RevenueCat herkese açık SDK anahtarlarını Claude'a verin. `config.js`'e girilip yeni sürüm derlenecek.
   5. Webhook deploy: `supabase functions deploy abonelik-webhook --no-verify-jwt`, `RC_WEBHOOK_SECRET` gizli değeri, RevenueCat'te webhook adresi ve aynı Authorization değeri.
   6. Xcode'da "In-App Purchase" yeteneği.
   7. `PrivacyInfo.xcprivacy` ve App Store gizlilik etiketine "Purchase History" eklenmesi (Claude yapabilir).
   8. TestFlight'ta sandbox ile satın alma, geri yükleme ve iptal denemesi.
   9. En son `plan_ayarlari.sinir_acik = true` (ürün yöneticisi).
4. **App Store:**
   - İnceleme notuna demo hesabın e-posta ve şifresi yazılmalı.
   - Uygulama içinde ad "Villa Takvim", mağazada "Villa Takvimim". Hangisi olacağına karar verin.
5. **Görev 29'dan kalan:** yöneticiler iki adımlı doğrulamayı kurduktan sonra veritabanında aal2 kuralı açılmalı. Gerçek iPhone'da QR okutma denenmeli.
6. **DENETIM Ö3'ün kalan maddeleri:** hangilerinin yapılacağını seçin.

## Kararlar (iş sırasında yazıldı)

### 1) Görev 29 kontrolü
- Karar: `git pull` ile gelen yalnız `GECE_GOREVI.md` ve `VERITABANI_GOREV30.sql` oldu. Bilgisayardaki eski kopyaları silip sunucudakini aldım.
  Neden: sunucudaki gece görevi daha yeniydi ("Görev 29 zaten yapıldı" notu). SQL dosyası aynıydı.
- Karar: Görev 29 için ek iş yapmadım.
  Neden: 29.1–29.7'nin hepsi commit'li ve canlıda. Testleri `docs/qa/gorev29/README.md`'de. Eksik yalnız ürün yöneticisinin yapacakları (SQL, aal2 kuralı).

### 30.1 Pro ekranı
- Karar: Faydalar 4 satır: sınırsız villa; her villada bakıcı ve ekip; teklif, opsiyon ve villa sayfası paylaşımı; ödemeler, gelir-gider ve rezervasyon formu.
  Neden: görevde sayılanlar. Bunlar ücretsiz planda da var; asıl fark villa sayısı, o yüzden ilk satır "Sınırsız villa".
- Karar: "İlk ay ücretsiz" ve aylık fiyat aynı büyüklükte, alt alta.
  Neden: Apple, ödenecek tutarın denemeden daha az görünür olmasını kabul etmiyor (3.1.2). Fiyat mağazadan gelmeden "Aylık ücret mağazada gösterilir" yazar.
- Karar: Mağaza bağlı değilken iki düğme gri ve "Yakında". Dokununca kısa açıklama çıkar.
  Neden: görevin istediği "Yakında"; `disabled` düğme çok soluk (kontrast yetmiyor), o yüzden gri zemin ve okunur yazı.
- Karar: `www/kosullar.html` yeni. Sade Türkçe; abonelik, deneme, yenileme, iptal, iade (mağaza kuralı), abonelik bitince verilerin kalması, Apple EULA bağlantısı ve "Apple taraf değildir" cümlesi. İletişim alanları gizlilik metnindeki gibi köşeli parantezli.
  Neden: Apple, abonelikli uygulamada kullanım koşulları (EULA) bağlantısı istiyor.
- Karar: Gizlilik metnine "Abonelik" bölümü eklendi (ödeme mağazada, kart bilgisi bize gelmez; RevenueCat'e yalnız rastgele hesap kimliği ve satın alma kaydı gider). Tarih 18 Kasım 2026.
  Neden: mağaza bağlantısı RevenueCat üzerinden; KVKK aydınlatması eksik kalmasın.
- Karar: Ölçüme `pro_goster` olayı eklendi (verisiz).
  Neden: Pro ekranının kaç kez açıldığı ürün kararı için gerekli. İçinde fiyat ya da kişisel bilgi yok.

### 30.2 Mağaza bağlantısı
- Karar: `@revenuecat/purchases-capacitor` 14.1.0 sürümüne sabitlendi (en yenisi 14.1.1 iki gün önce çıkmıştı).
  Neden: yeni çıkan sürüm yerine iki haftadır kullanılan sürüm daha güvenli. Capacitor 8 ile uyumlu.
- Karar: Mağaza kodu ayrı dosyada (`www/magaza.js`). Web'de, anahtar boşken ya da eklenti yokken hiçbir mağaza çağrısı yapılmaz; Pro ekranı "Yakında" der.
  Neden: görevdeki "anahtar boşsa ya da web ise çökmesin" kuralı; kodun tamamı tek yerde.
- Karar: Mağaza oturumu açılışta Supabase kullanıcı id'siyle açılır (`appUserID`). Başka hesapla girilince `logIn`, çıkışta `logOut`.
  Neden: yenilemeler ve bekleyen satın almalar doğru hesaba bağlansın. RevenueCat'e ad ya da e-posta gitmez.
- Karar: Ürün `plan_ayarlari.urun_aylik` ile seçilir. Yoksa mağazadaki "aylık" paket kullanılır.
  Neden: ürün kimliği değişirse uygulamayı güncellemeden sunucudan değiştirilebilsin.
- Karar: iOS'ta deneme hakkı daha önce kullanılmışsa "İlk ay ücretsiz" gizlenir; düğme "Aboneliği başlat" olur.
  Neden: hakkı olmayan kişiye "ücretsiz" demek yanıltıcı olur ve Apple incelemesinde reddedilir.
- Karar: Satın alma sonrası `abonelik_durumum()` 12 saniye boyunca 2 saniyede bir yeniden çekilir. Gelmezse "Üyeliğiniz birkaç dakika içinde açılacak" denir.
  Neden: abonelik sunucuya mağaza bildirimiyle (webhook) birkaç saniye sonra yazılır.
- Karar: Pro olunca yarım kalan "villa ekle" kendiliğinden açılır.
  Neden: kullanıcı Pro ekranına 4. villayı eklerken gelmişti.
- Karar: Ölçüme `pro_satin_al` ve `pro_geri_yukle` olayları eklendi; yalnız sonuç gider (tamam / iptal / hata / yok). Fiyat gitmez.

### 30.3 Pro ekranı ne zaman açılır
- Karar: "Villa ekle"ye dokununca Pro ekranı yalnız sunucu `sinir_acik === true` ve `villa_ekleyebilir === false` derse açılır. Öbür bütün durumlarda (sınır kapalı, sunucu güncellemesi yok, boş cevap) her zamanki "Yeni villa" formu açılır.
  Neden: görevdeki kesin kural; `sinir_acik` false iken Pro ekranı hiçbir yerde çıkmamalı.
- Karar: Kullanıcının kendi villası ücretsiz sınırın altındaysa (ör. 2 villa) sunucuya hiç sorulmaz.
  Neden: villa eklemek hiç yavaşlamasın. Yalnız 3. villadan sonra bir soru gider.
- Karar: Sunucu 3 saniyede cevap vermezse form açılır.
  Neden: yavaş internette kullanıcı beklemesin. Sınır açıksa sunucu kuralı 4. villayı yine kabul etmez.
- Karar: Pro ekranındaki iki fayda ikonu `kisiler` ve `cuzdan` oldu.
  Neden: ilk denemedeki `bakici` / `para` adları iş rengi adıydı, ikon çizmiyordu (testte görüldü, düzeltildi).

### 30.4 Hesap → Üyelik
- Karar: "Üyelik" satırı yalnız sunucu "sınır açık" derken ya da kullanıcının açık bir üyeliği varken görünür. Sunucu güncellemesi yoksa, ya da sınır kapalıyken üyeliği olmayan kullanıcıda gizli.
  Neden: sınır kapalıyken herkes sınırsız; "Ücretsiz · 3 villaya kadar" yazmak 3'ten fazla villası olanı yanıltır.
- Karar: Satırda sağda kısa durum (Ücretsiz / Pro / Elle verildi), altında ayrıntı (deneme bitişi, yenilenme, bitiş tarihi, süresiz).
- Karar: "Aboneliği yönet" yalnız mağazadan alınmış üyelikte görünür. Uygulamada işletim sisteminin abonelik sayfasını açar (önce RevenueCat'in verdiği adres, yoksa App Store / Google Play'in genel abonelik sayfası).
- Karar: Ücretsiz panelde "Villa Takvimim Pro'yu gör" düğmesi yalnız 30.3 kuralı sağlanınca (sınır açık ve ekleyemez) çıkar. Uygulamada mağaza hazırsa "Satın alımları geri yükle" de burada var.
  Neden: Apple geri yüklemenin kolay bulunmasını istiyor; Pro ekranı kuralı da bozulmuyor.
- Karar (düzeltme): Görev 29.7'de Hesap satırlarına eklediğim bir CSS kuralı ikon kutusunu genişletiyordu ("Hesabım" ikonunun kutusu uzundu; canlıda vardı). Kural yalnız yazı sütununu esnetecek şekilde düzeltildi. Ayrıca e-posta "Hesabım"ın altına alındı (büyük yazıda sağ köşede harf harf bölünüyordu), "Kullanıcılar" kelimesinin bölünmesi engellendi.

### 30.5 Yönetim paneli
- Karar: Kullanıcı listesinde her kişinin altında rozet: Ücretsiz (gri), Pro / Pro · deneme / Pro · iptal edildi (yeşil), Elle verildi (lacivert). `tum_abonelikler` yoksa rozet hiç çıkmaz.
  Neden: Görev 29'daki "Abonelik: —" yer tutucusunun yerine geçti. Süresi dolmuş kayıt (ürün yöneticisinin SQL'inde "kaldır" artık silmiyor, `suresi_doldu` yapıyor) "Ücretsiz" sayılır.
- Karar: Kullanıcı detayında "Üyelik" bölümü: durum, bitiş tarihi, kaynak ve not. "Üyelik ver" → süre (30 gün / 1 yıl / süresiz) + isteğe bağlı not → onay paneli → sunucu. "Üyeliği kaldır" yalnız elle verilmiş açık üyelikte, kırmızı düğme ve onayla.
- Karar: Mağazadan (App Store / Google Play) alınmış açık abonelikte "Üyelik ver" ve "kaldır" gösterilmez; "kullanıcı mağazadan yönetir" yazar.
  Neden: elle verilen üyelik mağaza kaydının üstüne yazar, sonraki mağaza bildirimi de onu geri değiştirir; karışıklık çıkar.
- Karar: Elle verilmiş açık üyelikte düğme "Üyeliği uzat ya da değiştir" adını alır.

### 30.6 Sunucu fonksiyonu taslağı (deploy edilmedi)
- Karar: `supabase/functions/abonelik-webhook/index.ts` dış paket kullanmıyor; tabloya PostgREST üzerinden service_role ile `on_conflict=kullanici` upsert yapıyor.
  Neden: Deno'da sürüm / paket sorunu çıkmasın, dosya tek başına çalışsın.
- Karar: `Authorization` başlığı `RC_WEBHOOK_SECRET` ile sabit zamanlı karşılaştırılır; hem düz değer hem "Bearer <değer>" kabul edilir. Gizli değer ayarlı değilse her istek reddedilir.
- Karar: Kullanıcı kimliği `app_user_id`; uuid değilse (satın alma uygulamaya girişten önce anonim başladıysa) `original_app_user_id` ve `aliases` içindeki uuid kullanılır. Hiç uuid yoksa olay yok sayılır (200).
- Karar: Durum: deneme süresi → `deneme`; ücretli → `aktif`; iptal ama süre bitmedi → `iptal_edildi`; süre bitti ya da EXPIRATION → `suresi_doldu`. BILLING_ISSUE süre bitene kadar erişimi kapatmaz (mağazanın ek süresi).
- Karar: Sıra dışı gelen eski bir olay, daha yeni bir mağaza kaydının üstüne yazmaz (`guncelleme` = olayın zamanı).
- Karar: Sandbox (test) satın almaları da işlenir.
  Neden: Apple incelemecisi sandbox ile satın alır; işlenmezse Pro açılmaz ve uygulama reddedilir.
- Karar: İşlenmeyen olaylar (TEST, TRANSFER, başka mağaza) ve silinmiş kullanıcı 200 alır; yalnız geçici yazma hatası 500 döner (RevenueCat tekrar dener).
- Test: `docs/qa/gorev30/webhook/test.mjs` (Deno ve veritabanı taklit edilerek 21 durum). `node docs/qa/gorev30/webhook/test.mjs` ile çalışır.

### 3) App Store metinleri
- Karar: Bu sürümün açıklamasında Pro / abonelikten söz edilmedi.
  Neden: abonelik kapalı ve RevenueCat anahtarları boş; olmayan bir satın almayı anlatmak Apple incelemesinde sorun çıkarır. Abonelik açılınca eklenecekler `docs/APPSTORE.md`'de.
- Karar: App Privacy cevapları `PrivacyInfo.xcprivacy` ile bire bir aynı (7 veri türü, hepsi kimliğe bağlı, izleme yok). "Satın alımlar" bu sürümde yok; abonelik açılırken hem manifeste hem etikete eklenmeli.
- Karar: Anahtar kelimelerde uygulama adındaki "villa" ve "takvim" tekrarlanmadı, başka marka adı kullanılmadı.
- Karar: Destek adresi olarak şimdilik `kosullar.html` (iletişim bölümü var) önerildi. Netlify'a yüklenene kadar açılmaz.
- Karar: Ekran görüntüleri: koyu yeşil zemin, üstte serif başlık, altta telefon çerçevesinde uygulamanın gerçek ekranı. 6 ekran × 2 dil, 1320 × 2868.
- Bulunan hata: İngilizcede "Bugün ve yarın" listesindeki "Yarın 16:00 · … giriş yapacak" satırları Türkçe kalıyordu. Çevirisi eklendi (kalite turu commit'inde).
- Not: Uygulama içinde ad "Villa Takvim", mağazada "Villa Takvimim". Değiştirmedim, Zeyd'e soruldu.

### 4) Kalite turu
- Karar: DENETIM.md'deki Ö1 / Ö2 maddelerinin hepsi zaten kapalıydı. Ö3'ten tasarım kararı gerektirmeyen üçü yapıldı: 6 (Teklifler / Bakıcılar boş hâli), 12 (girişteki küçük gizlilik bağlantısı), 13 (misafir sayfasında özellik adı büyük harfle).
  Neden: kalan Ö3 maddeleri (takvimde fiyat gösterimi, ipucu kartları, yedek hatırlatması vb.) ürün kararı istiyor; gece kendi başıma karar vermedim.
- Karar: Gece modu için uygulamayı koyu renge çevirmedim.
  Neden: uygulama bilerek yalnız açık renk (`color-scheme: light only`); gece modunda da beyaz zemin ve okunur yazı doğrulandı.
- Bulunan ve düzeltilenler: 2 emoji (STIL ihlali), çok büyük yazıda 2 kesik / bölünen yazı, İngilizcede 1 çevrilmeyen satır, 29.7'den kalan ikon kutusu hatası (30.4'te). Ayrıntı: DENETIM.md sonu.
