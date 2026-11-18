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
