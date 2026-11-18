# Görev 31: tasarım dili 2.0 — test raporu

_Claude Code, 18 Kasım 2026._

Ortam: Playwright, sahte Supabase, sabit saat 16 Kasım 2026, iPhone boyutları. Veritabanına dokunulmadı.

## 31.11 Her ekranda tek bir öne çıkan iş

Yöntem: kaynakta her panel fonksiyonunda dolu yeşil `.big` sayısı tarandı; sonra uygulama çalışırken 22 ekran ve panel açılıp
görünen dolu yeşil düğmeler (zemini `--ok`) ve görünür kapatma / Vazgeç sayıldı (`qa31j.js`).

| Ekran / panel | Ne vardı | Ne yaptım |
|---|---|---|
| Villa ekranı, takvimde iki gün seçiliyken | Üstte dolu yeşil "+ Rezervasyon" hapı ve alttaki seçim panelinde dolu yeşil "Rezervasyon": iki ana düğme | Seçim paneli açıkken üstteki hap açık yeşil (ikincil) olur; ana iş paneldeki "Rezervasyon" |
| Fotoğraflar → Google Drive'dan ekle | Sonuç gelince "Fotoğrafları bul" ve "Hepsini ekle" ikisi de dolu yeşil | Sonuç gelince "Fotoğrafları bul" renkli (ikincil) olur; arama hata verirse yeniden ana düğme |
| Bakıcılar → davet oluşturuldu | Kaynakta iki ana düğme görünüyordu | Kontrol: "Yeni bakıcı davet et" kod oluşunca gizleniyor, ekranda tek ana düğme ("WhatsApp'ta gönder"). Değişiklik gerekmedi |
| Ödeme akışı, ödeme paneli, opsiyon, üyelik ver, villa ekleme sihirbazı, fiyat paneli, rezervasyon formu PDF | Kaynakta birden çok ana düğme | Kontrol: hepsi ayrı adım ya da ayrı panel (aynı anda yalnız biri görünür). Değişiklik gerekmedi |
| Villalarım boş, Gelir&gider boş, müsaitlik sonuç yok | Çizim + birden çok yol | 31.8 boş hâli: tek ana düğme, ikincil yol renkli |
| Rezervasyon detayı | En önemli iş "… alınacak" + "Ödemeyi al" | Zaten en üstte ve en büyük; 31.5 ile tutar sayarak değişir |
| Gelir & gider | En önemli rakam net kazanç | Zaten en üstte ve en büyük |
| Bütün paneller | Kapatma: köşede yalnız "✕" ikonu | 31.10: "✕ Kapat" yazılı hap; 22 ekran/panelin hepsinde görünür kapatma ya da Vazgeç var |
| İki adımlı doğrulama zorunlu paneli | Kapatma yok | Bilerek: giriş için zorunlu adım (Görev 29.6); "Çıkış yap" ile çıkılır |

Sonuç: 22 ekran ve panelde en fazla bir dolu yeşil düğme var; her panelde görünür kapatma ya da Vazgeç var; konsol hatası yok.
