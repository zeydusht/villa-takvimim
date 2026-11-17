# GÖREV 29 — Ölçüm, yönetim paneli, App Store hazırlığı

Amaç: Uygulamayı TestFlight ve App Store'a hazırlamak. Ne kadar kullanıldığını güvenli şekilde ölçmek. Zeyd ve Berat'ın (yöneticiler) tüm kullanıcıları görüp destek verebilmesini sağlamak. Kişisel veri asla sızmamalı (KVKK).

**Veritabanı kısmı (`docs/VERITABANI_GOREV29.sql`) ürün yöneticisi tarafından Supabase'e uygulanır. Sen o dosyayı çalıştırma, sadece oku.** Bu görevde kullanacağın yeni şeyler:
- tablo `olaylar` (sadece INSERT; kimse okuyamaz, yöneticiler RPC ile özet görür)
- RPC `istatistik_ozet()` → jsonb
- RPC `kullanici_etkinlik_gor(p_id uuid)` → son 200 olay (bu bakış `destek_kayitlari`'na yazılır)
- RPC `son_gorulmeler()` → kullanıcı başına son görülme, platform, sürüm

Yönetici olmayan biri bu RPC'leri çağırırsa sunucu "Yetkiniz yok" hatası verir. Ekranda gizlemek tek başına güvenlik değildir; güvenlik sunucudadır. Ama ekranda da hiç görünmemeli.

---

## 29.1 Ölçüm modülü — `www/olcum.js`

- `VT.olay(ad, veri)` fonksiyonu. Olaylar bir kuyruğa girer. Kuyruk şu durumlarda tek POST ile `rest/v1/olaylar`'a gönderilir: her 15 saniyede bir, `visibilitychange` → hidden olduğunda, ya da kuyrukta 20 olay birikince. Kullanıcının kendi oturum tokeni kullanılır. `kullanici` alanını gönderme, sunucu kendisi doldurur.
- Sadece oturum açık **ve** hesap onaylı ise gönder. Diğer durumlarda sessizce at.
- Ağ hatası olursa bir kez tekrar dene, sonra at. Kuyruk en fazla 100 olay olsun. Ölçüm **asla** uygulamayı yavaşlatmamalı, hata göstermemeli, `await` ile beklenmemeli.
- Her olayla şunlar gider:
  - `platform`: `Capacitor.getPlatform()` → `ios` / `android` / `web`
  - `surum`: uygulama sürümü (config.js'te tek yerde tut)
  - `oturum`: uygulama her açıldığında yeni bir `crypto.randomUUID()`
  - `ekran`: o anki sekme veya ekran adı (kısa, küçük harf, örneğin `takvim`, `villalarim`, `gelir_gider`)
- **İzinli olay listesi kodda sabit olsun.** Listede olmayan ad gönderilmesin.
  - `uygulama_ac`, `ekran_gor`
  - `villa_ekle`, `villa_sil`
  - `rez_ekle {gece, kisi}`, `rez_duzenle`, `rez_sil`
  - `opsiyon_ekle`, `teklif_olustur`, `teklif_paylas`, `paylasim_linki`
  - `foto_yukle {adet}`
  - `bakici_davet`, `bakici_katildi`
  - `musaitlik_ara {villa_sayisi, sonuc}`, `secip_gonder {adet}`
  - `odeme_ekle`, `gider_ekle`, `pdf_indir`
  - `rehber_basla {konu}`, `rehber_bitir {konu}`, `rehber_kapat {konu, adim}`
  - `yazi_boyutu {deger}`, `dil {deger}`
  - `bildirim_izni {verildi}`
  - `hata {tur, yer}`
- **YASAK (KVKK):** `veri` içine asla isim, telefon, e-posta, misafir adı, villa adı, fiyat, tutar, adres, tarih, not ya da serbest metin koyma. Sadece sayı, evet/hayır ve listeden seçilmiş kısa değerler. `veri` 1 KB'ı geçemez (sunucu reddeder).
- Ayarlar'a bir anahtar ekle: **"Kullanım istatistiklerini paylaş"**. Varsayılan açık. Altına tek satır açıklama: "Hangi özelliklerin kullanıldığını sayar. Misafir, fiyat ve kişisel bilgi gönderilmez." Kapatılırsa hiçbir olay gönderilmez. Tercih cihazda saklanır.
- Bu olayları uygulamanın ilgili yerlerine bağla. Her yere tek satır `VT.olay(...)` yeterli.

## 29.2 Hata yakalama

- `window.onerror` ve `unhandledrejection` için `VT.olay('hata', {tur, yer})` gönder.
  - `tur`: hata adı (örneğin `TypeError`)
  - `yer`: `dosya.js:satır`
- **Hata mesajını gönderme**, çünkü içinde kişisel veri olabilir.
- Bir oturumda en fazla 5 hata gönderilsin.

## 29.3 Yönetim ekranı (sadece `VT.yonetici()`)

Mevcut yönetim/kullanıcılar ekranını genişlet. Yönetici değilse bu ekranın girişi, düğmesi ya da sekmesi hiç oluşturulmasın (gizlemek yetmez, DOM'a hiç eklenmesin).

1. **Özet kartları** (`istatistik_ozet`):
   - Bugün / 7 gün / 30 gün aktif kullanıcı
   - Toplam kullanıcı, onay bekleyen
   - Toplam villa, toplam rezervasyon, son 30 günde eklenen rezervasyon
   - Kullanıcı başına villa dağılımı (0, 1, 2, 3, 4+): küçük çubuklar
   - Son 12 hafta kayıt: küçük çubuk grafik
   - Huni: kayıt → onay → ilk villa → ilk rezervasyon (sayılar ve yüzdeler)
   - En çok kullanılan 15 özellik (son 30 gün)
   - Platform dağılımı (iOS / Android / web)
2. **Kullanıcı listesi**: her satırda son görülme ("3 saat önce"), platform ve villa sayısı (`son_gorulmeler`). Sıralama seçenekleri: son görülme, villa sayısı, kayıt tarihi.
3. **Kullanıcı detayı**: mevcut villa listesinin altına **"Etkinliği gör"** düğmesi ekle. Basınca önce şu onayı göster: "Bu bakış kayda geçer. Devam edilsin mi?" Onaylanırsa `kullanici_etkinlik_gor` çağrılır ve son 200 olay zaman sırasıyla listelenir. Hata olayları kırmızı gösterilsin.
4. Abonelik sütunu için yer bırak, Görev 30'da doldurulacak.

## 29.4 Gizlilik metni — `www/gizlilik.html`

"2. Hangi veriler işleniyor?" bölümüne **Kullanım verileri** maddesi ekle. İçinde şunlar olsun:
- Ne toplanır: hangi özelliğin kullanıldığı, cihaz türü, uygulama sürümü, hata türü.
- Ne toplanmaz: misafir bilgisi, fiyat, isim, telefon, konum.
- Amaç: uygulamayı geliştirmek ve destek vermek.
- Süre: 13 ay, sonra otomatik silinir.
- Kim görür: sadece uygulama yöneticileri, özet olarak.
- Nasıl kapatılır: Ayarlar → "Kullanım istatistiklerini paylaş".

"6. Destek erişimi" bölümüne de şunu ekle: yöneticinin bir hesabın etkinliğine bakması da kayda geçer.

## 29.5 App Store hazırlığı (iOS projesi)

- `Info.plist` içine şunları ekle:
  - `ITSAppUsesNonExemptEncryption = NO`
  - `NSPhotoLibraryUsageDescription` = "Villa fotoğraflarını eklemek için galerinize erişim gerekir."
  - `NSCameraUsageDescription` = "Villa ve fiş fotoğrafı çekmek için kamera gerekir."
  - Kamera hiç kullanılmıyorsa `NSCameraUsageDescription` ekleme. Kodda kontrol et.
  - Metinler Türkçe olsun, `en.lproj/InfoPlist.strings` içinde İngilizceleri de bulunsun.
- `ios/App/App/PrivacyInfo.xcprivacy` dosyasını ekle ve Xcode projesine bağla:
  - `NSPrivacyTracking = false`
  - `NSPrivacyCollectedDataTypes`:
    - E-posta adresi, ad, telefon: bağlı, takip yok, amaç App Functionality.
    - Product Interaction (kullanım verisi): bağlı, takip yok, amaç Analytics ve App Functionality.
    - Crash/Diagnostic (hata türü): bağlı, takip yok, amaç App Functionality.
  - `NSPrivacyAccessedAPITypes`: Capacitor'ın ve eklentilerin kullandığı API'ler (UserDefaults → `CA92.1`, dosya zaman damgası → `C617.1` vb.). Kullanılan eklentilerin kendi manifestlerini kontrol et.
- Sürüm numarası: `MARKETING_VERSION = 1.0.0`. Build numarası CI'dan geliyor (`run_number`), o kalsın.
- Hesap silme ekranı zaten var. Ayarlar'da kolay bulunduğunu doğrula (Apple bunu zorunlu tutuyor).
- Uygulama içinde App Store'da satılan bir şey için dışarıya (web sitesi, WhatsApp) ödeme linki **olmamalı**. Kontrol et ve varsa bildir.

## 29.6 Yönetici hesapları için iki adımlı doğrulama (MFA) — hazırlık

Yönetici hesabı tüm verileri görebiliyor, o yüzden en çok korunması gereken hesap bu.
- Ayarlar'da, **sadece yöneticilere görünen** "İki adımlı doğrulama" bölümü ekle. Supabase Auth TOTP kullan:
  - `POST /auth/v1/factors` ile kayıt başlat, QR kodu göster.
  - Google Authenticator veya Apple Şifreler ile okutulup 6 haneli kod girilsin.
  - `challenge` + `verify` ile doğrula.
- Giriş sırasında yöneticinin doğrulanmış bir faktörü varsa, şifreden sonra 6 haneli kod sor ve oturumu `aal2`'ye yükselt.
- Bu adımı bitirdiğinde **dur**. Veritabanında "yönetici yetkisi sadece aal2 oturumda çalışsın" kuralını ürün yöneticisi, Zeyd ve Berat kod kurulumunu yaptıktan sonra açacak. Sen açma.

## 29.7 Test (Playwright, sahte veriyle)

- Normal kullanıcı:
  - Olaylar gönderiliyor mu? Ağ isteğinde `veri` içinde isim, telefon veya tutar var mı? Olmamalı.
  - Ayar kapalıyken hiç istek gidiyor mu? Gitmemeli.
- Normal kullanıcı `istatistik_ozet` çağırınca hata alıyor mu? Yönetim ekranı DOM'da hiç var mı? Olmamalı.
- Yönetici: kartlar, liste ve "Etkinliği gör" çalışıyor mu?
- Çevrimdışı kullanım: uygulama hiç takılmıyor, hata göstermiyor mu?
- Mevcut testlerin hepsi geçiyor mu?

---

Bitince: çok kısa bir özet yaz ve en alta test linkini koy: https://zeydusht.github.io/villa-takvimim/
