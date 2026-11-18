# Gece raporu (18 Kasım 2026)

_Özet en sonda tamamlanacak._

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
