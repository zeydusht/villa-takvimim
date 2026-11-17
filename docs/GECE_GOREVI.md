# GECE GÖREVİ — sabaha kadar kesintisiz çalış

Zeyd uyuyor. **Hiçbir şey sorma, durma.** Bir karar gerekirse en mantıklı olanı seç ve `docs/GECE_RAPORU.md` dosyasına "Karar: … / Neden: …" diye yaz. Bir adım takılırsa raporla, sonraki adıma geç.

## Kesin kurallar
- **Netlify'a yayın YOK.** Sadece `main`'e commit + push (GitHub Pages test linki güncellenir).
- **Supabase veritabanını değiştirme.** `docs/VERITABANI_GOREV29.sql` ve `docs/VERITABANI_GOREV30.sql` dosyalarını ürün yöneticisi uygulayacak. Sen sadece içlerindeki tablo ve RPC adlarını kullan.
- RPC henüz yoksa (404 veya hata dönerse) uygulama **çökmemeli**. İlgili bölüm sessizce gizlensin ya da "hazırlanıyor" yazsın.
- Her alt adım ayrı commit. Commit mesajları Türkçe.
- Mevcut özellikleri bozma. Her bölümden sonra mevcut Playwright testlerini çalıştır.
- KVKK: ölçüm verisine isim, telefon, e-posta, fiyat, tutar, misafir bilgisi ya da serbest metin **asla** girmesin.

## Sıra

### 1) Görev 29'un tamamı
`docs/GOREV29.md` içindeki 29.1–29.7 adımlarının hepsini yap.

### 2) Görev 30 — abonelik, istemci tarafı (şimdilik kapalı)
Veritabanı adları `docs/VERITABANI_GOREV30.sql` dosyasında:
- `abonelik_durumum()`
- `abonelik_ver(p_id, p_gun, p_not)`
- `abonelik_kaldir(p_id)`
- `tum_abonelikler()`
- `plan_ayarlari` (anahtarlar: `ucretsiz_villa`, `deneme_gun`, `sinir_acik`, `urun_aylik`)

Plan: 3 villaya kadar ücretsiz. 4. villadan itibaren **Villa Takvimim Pro** gerekir: aylık, ilk ay ücretsiz deneme, fiyatı mağazadan gelir (yaklaşık 1000 TL).

**30.1 Pro ekranı (ödeme sayfası):** sade ve büyük yazılı olsun, yaşlı kullanıcıya uygun.
- Başlık: "Villa Takvimim Pro"
- Faydalar: sınırsız villa, bakıcı ve ekip, teklif ve paylaşım…
- "İlk ay ücretsiz" vurgusu ve mağazadan gelen fiyat
- Büyük "Ücretsiz denemeyi başlat" düğmesi
- **"Satın alımları geri yükle"** düğmesi (Apple zorunlu tutuyor)
- Altta küçük yazı: "Abonelik her ay otomatik yenilenir. App Store / Google Play hesap ayarlarından istediğiniz zaman iptal edebilirsiniz. Deneme bitmeden iptal ederseniz ücret alınmaz."
- **Gizlilik** ve **Kullanım Koşulları** linkleri. `www/kosullar.html` sayfasını oluştur: sade Türkçe kullanım koşulları ve Apple'ın standart EULA'sına atıf.

**30.2 Mağaza bağlantısı:** `@revenuecat/purchases-capacitor` paketini kur.
- `config.js` içine `RC_IOS_KEY` ve `RC_ANDROID_KEY` alanlarını ekle, boş kalsınlar.
- Anahtar boşsa ya da platform web ise satın alma düğmesi "Yakında" göstersin, uygulama çökmesin.
- RevenueCat'e giriş yapılırken `appUserID` olarak Supabase kullanıcı id'si kullanılsın.
- Satın alma tamamlanınca `abonelik_durumum()` yeniden çekilsin.

**30.3 Ne zaman gösterilir:** Sadece `abonelik_durumum().sinir_acik === true` **ve** `villa_ekleyebilir === false` ise. Yani kullanıcı 4. villayı eklemeye çalıştığında. `sinir_acik` false iken Pro ekranı **hiçbir yerde** çıkmasın.

**30.4 Ayarlar → "Üyelik" satırı:** Ücretsiz / Pro (bitiş tarihi) / Elle verildi. Pro ise "Aboneliği yönet" düğmesi işletim sisteminin abonelik sayfasını açsın.

**30.5 Yönetim paneli:**
- Kullanıcı listesinde abonelik rozeti göster (`tum_abonelikler`).
- Kullanıcı detayında **"Üyelik ver"** (30 gün / 1 yıl / süresiz + not) ve **"Üyeliği kaldır"** düğmeleri olsun.
- Her işlemden önce onay sorulsun.

**30.6 Sunucu fonksiyonu taslağı:** `supabase/functions/abonelik-webhook/index.ts` dosyasını yaz. **Deploy etme**, ürün yöneticisi edecek.
- RevenueCat'ten gelen olayları karşılasın: INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, UNCANCELLATION, PRODUCT_CHANGE, BILLING_ISSUE.
- `Authorization` başlığını `RC_WEBHOOK_SECRET` ile sabit zamanlı karşılaştırarak doğrulasın.
- `app_user_id` alanını kullanıcı uuid'si olarak alıp service_role ile `abonelikler` tablosuna upsert etsin.
- Durum eşlemesi:
  - trial → `deneme`
  - aktif → `aktif`
  - iptal edilmiş ama süresi bitmemiş → `iptal_edildi`
  - süresi bitmiş → `suresi_doldu`
- `bitis` = `expiration_at_ms`. `kaynak` = `apple` (APP_STORE) veya `google` (PLAY_STORE).

### 3) App Store metinleri — `docs/APPSTORE.md`
Türkçe ve İngilizce olarak:
- Uygulama adı (30 karakter)
- Alt başlık (30)
- Tanıtım metni (170)
- Açıklama (4000)
- Anahtar kelimeler (100)
- "Bu sürümde yenilikler"
- Destek ve gizlilik URL önerisi
- Yaş derecelendirmesi cevapları
- App Privacy (Gizlilik etiketi) cevapları: Görev 29.5'teki veri türleriyle bire bir aynı olsun
- İnceleme notu (Review Notes): "Yeni hesaplar elle onaylanır; demo hesap: (ürün yöneticisi dolduracak)"
- Ekran görüntüsü planı: 6,9" iPhone için 6 ekran, her biri için üstte bir başlık cümlesi. Playwright ile 1320×2868 boyutunda bu ekranları sahte verilerle üret ve `docs/appstore-ekranlar/` klasörüne kaydet.

### 4) Kalite turu (zaman kalırsa)
- `docs/DENETIM.md` listesindeki açık kalan maddeleri kapat.
- Sekmeler arasında gezinme, gece/gündüz modu, büyük yazı boyutu ve küçük ekran (iPhone SE) kontrolü yap. Taşma ya da üst üste binme varsa düzelt.
- Konsol hatası kalmasın.

### 5) Son
`docs/GECE_RAPORU.md` dosyasının en üstüne şunları yaz:
- Ne yapıldı (madde madde, kısa)
- Hangi kararlar alındı
- Ne yapılamadı ve neden
- Zeyd'in yapması gerekenler

Mesajının en altına çok kısa bir özet ve test linkini koy: https://zeydusht.github.io/villa-takvimim/
