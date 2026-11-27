# Görev 47 — Uygulamayı TestFlight'a gönderilebilir hâle getir

**Durum:**
- iOS derlemesi GitHub Actions'ta başarılı.
- Apple anahtarı GitHub Secrets'ta yok. Bu yüzden derleme her seferinde "Apple anahtarı yok, TestFlight'a yüklenmedi" diyor.
- `docs/IOS_YAYIN_DERSLERI.md` dosyasındaki 1–9 numaralı maddeler yapıldı.

**Kurallar:**
- Veritabanına dokunma. Demo hesabı PM açacak.
- App Store Connect'te bir şey değiştirme.
- Cloudflare'a ya da `canli` dalına yayın yapma.
- Anahtar dosyalarının içeriğini **asla** ekrana yazma, commit etme, dosyaya kopyalama.
- Testleri kısa tut.

---

## 47.1 — Apple anahtarını GitHub Secrets'a ekle (Reverse Solver'dakini kullan)

1. **Anahtar dosyasını bul.** Zeyd'in bilgisayarında Reverse Solver için kullanılan App Store Connect API anahtarı var: `AuthKey_XXXXXXXXXX.p8`. Şu yerlerde ara:
   - `C:\Users\zeydt\Downloads` ve alt klasörleri;
   - Reverse Solver proje klasörü;
   - Masaüstü.

   Bulamazsan dur ve özette "anahtar bulunamadı" yaz. Zeyd App Store Connect'ten yeni bir anahtar oluşturacak; PM adım adım anlatır.
2. **Gerekli bilgileri topla:**
   - **Key ID:** dosya adındaki `AuthKey_` sonrası.
   - **Issuer ID ve Team ID:** Reverse Solver'ın GitHub Secrets'ından okunamaz, ama Reverse Solver'ın kendi notlarında, betiklerinde (`vt-yukle.sh` benzeri) ya da `ExportOptions.plist` dosyasında olabilir. Team ID 10 karakterdir, Issuer ID UUID biçimindedir. Bulamazsan özete yaz, PM Zeyd'den alır.
3. **Secrets'a ekle.** `gh secret set` ile `zeydusht/villa-takvimim` deposuna şunları ekle:
   - `ASC_KEY_ID`
   - `ASC_ISSUER_ID`
   - `APPLE_TEAM_ID`
   - `ASC_KEY_P8`: dosyanın içeriği, `gh secret set ASC_KEY_P8 < dosya`.

   Değerleri ekrana yazma. Sadece "eklendi" de.
4. **Anahtarın kendisine dokunma.** Anahtar dosyası olduğu yerde kalsın; repo içine **kopyalama**.

## 47.2 — İlk derlemeyi tetikle ve sonucu oku

- `ios.yml` iş akışını elle tetikle: `gh workflow run`.
- Bitince sonucu Türkçe ve kısaca özetle:
  - imza kontrolü geçti mi (`c4b0`);
  - `altool --validate-app` sonucu;
  - yükleme sonucu.
- **Uygulama kaydı yoksa:** Apple "uygulama bulunamadı" gibi bir hata verirse bu beklenen bir hata. App Store Connect'te "Villa Takvimim" kaydı henüz açılmadı. Özete yaz, PM Zeyd'le açacak. Bundle ID: `com.zeydtekin.villatakvim`.
- Sertifika hatası çıkarsa, örneğin "Maximum number of certificates", `IOS_YAYIN_DERSLERI.md` §2'ye bak ve özete yaz.

## 47.3 — App Store ekran görüntüleri

Apple'ın istediği boyut: 6,9 inç iPhone, **1320 × 2868** px, PNG. 5 görüntü hazırla, sahte veriyle (`docs/qa` test düzeneği):
1. Villalarım: 3 villa, dolu ve boş etiketleri.
2. Villa sayfası: takvim ve "Sıradaki" kartı.
3. Hangi villam boş: sonuç ekranı.
4. Ödemeler: alınması gereken, alınan ve kalan.
5. Misafir sayfası: villa adı, fotoğraflar, takvim.

**Kurallar:**
- Gerçek kişi adı ya da telefon kullanma; uydurma Türkçe adlar kullan.
- Durum çubuğu temiz olsun (saat 9:41, tam pil). Uygulamanın kendi üst çubuğu görünsün.
- Görüntülerin üstüne kısa bir başlık yazılı olabilir, ama zorunlu değil. Yazıyı görüntü olarak koyma; önce sadece ekranları çıkar, PM karar verecek.
- Görüntüleri `docs/appstore/ekranlar/` klasörüne koy.

## 47.4 — Gizlilik soruları ve inceleme notu taslağı

`docs/APPSTORE.md` dosyasının sonuna şunları ekle:
1. **App Privacy cevap taslağı.** App Store Connect'teki "veri toplama" sorularına uygulamanın gerçekten topladığı verilere göre cevaplar:
   - hesap için e-posta ve ad;
   - villa sahibinin girdiği misafir adı ve telefonu;
   - fotoğraflar;
   - kullanım ölçümü (`olaylar` tablosu, kişisel veri yok).

   Her biri için şunları yaz: hangi kategori, kullanıcıya bağlı mı, takip (tracking) için mi (hayır), ne amaçla.
2. **İnceleme notu (Review Notes) taslağı, İngilizce:**
   - Demo hesap satırı boş kalsın, PM dolduracak.
   - Uygulamaya özel özellikler listelensin: Face ID kilidi, titreşim, paylaşım sayfası, PDF kaydetme ve paylaşma, kamera ve galeriden fotoğraf.
   - Hesap silme yolu yazılsın: Hesap → Hesabım → Hesabımı kalıcı olarak sil.
3. **Adresler:** destek adresi (`https://villatakvimim.com` + destek@villatakvimim.com) ve gizlilik adresi (`https://villatakvimim.com/gizlilik`).

## 47.5 — Bitiş

- `docs/PROJE_DURUMU.md` dosyasına Görev 47'yi ekle.
- Mesajının en altına çok kısa özet yaz:
  - Secrets eklendi mi;
  - derleme TestFlight'a gitti mi, gitmediyse neden (tek cümle);
  - Zeyd'den ya da PM'den beklenen ne.
- Özetin altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
