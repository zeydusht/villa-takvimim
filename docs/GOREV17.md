# Görev 17 — Villa ekranı: "Sıradaki" öne, giriş saati, yerleştirme onayı, gezinme

_Hazırlayan: Claude (ürün yöneticisi), 16 Kasım 2026. Zeyd'in iPhone denemesinden (ekran görüntüsü: Villa Salta, saat 01:09)._

## Önce oku
- Açılış animasyonu ONAYLANDI — `www/acilis.js`'e dokunma.
- **Netlify yok**, sadece commit + push. Renk/ikon kuralları (Görev 11–12) geçerli.
- **Veritabanı:** 17.4 için gereken sütunlar ve fonksiyon Claude tarafından kurulacak (aşağıda yazılı). Kurulmadıysa kodu yine yaz; çağrı hata verirse kullanıcıya düzgün mesaj göster ve PROJE_DURUMU'na not düş.
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

- [x] **17.1 "Sıradaki" kartı villa başlığının hemen altına.** En önemli ve anlık iş bu; şu an aşağıda kalıyor.
  - Sıra: villa başlık kartı → **Sıradaki kartı** → hızlı işlem hapları (17.3) → takvim…
  - Kartın üst satırında solda **"SIRADAKİ"** ve hemen yanında zaman etiketi: **"Bugün"** (yeşil dolu etiket), "Yarın", "3 gün sonra" (açık lacivert). Sağ üstteki tarih/gün yazısı kaldırılsın; zaman etiketi tek yerde, "Sıradaki"nin yanında.
  - Altında: "16:00 · abc girecek" (çıkışsa "10:00 · abc çıkacak") ve sağda alınacak tutar ("13.000 ₺ alınacak", kırmızı; alınmışsa yeşil "✓ Ödeme alındı").
  - Kart dokunulabilir → 17.4 akışı.

- [x] **17.2 HATA: Saat gelmeden "Dolu · giriş yaptı" yazıyor.** Saat 01:09'da, girişi bugün 16:00 olan villa için "Dolu · abc / Bugün 16:00 giriş yaptı" yazıyor. Durum saate göre hesaplansın (Türkiye saati):
  - Giriş günü, giriş saatinden önce ve misafir yerleştirilmediyse: **"Boş · bugün giriş var"** (gri "Boş" etiketi + altında "Bugün 16:00'da abc girecek").
  - Giriş saati geçti ya da 17.4'teki "yerleştirildi" onayı verildiyse: **"Dolu · abc"**, alt satır "Bugün 16:00'da giriş yaptı" (onay verildiyse gerçek onay saati: "14:42'de yerleştirildi").
  - Çıkış günü, çıkış saatinden önce: "Dolu · abc", alt satır "Bugün 10:00'da çıkış"; sonrası boş.
  - Aynı kural ana ekrandaki villa kartlarında, "Bugün ve yarın" kartında ve Takvim sekmesinde de geçerli. Takvim hücresindeki yarım gün çizimi değişmez.

- [x] **17.3 Özet kutuları kalkar, işlem hapları takvimin üstüne.**
  - Takvimin altındaki 3 kutu (Doluluk · Bu ay · Sonraki giriş) villa ekranından kaldırılsın (doluluk ve bu ayın tutarı Gelir & gider'de zaten var; sonraki giriş artık 17.1'de).
  - Onların yerine (ay başlığı "Kasım 2026" ile gün başlıkları arasına) hızlı işlem hapları gelsin. Sıra: **+ Rezervasyon** (dolu yeşil) · **Teklif** · **Fiyat gir** · **Opsiyon** · **Paylaş**. Başlık kartının altındaki eski hap sırası kaldırılsın (tek yerde dursun).
  - **Kaydırılabildiği belli olsun:** son görünen hap yarım görünsün (taşma bilerek), sağ kenarda 32 px beyaza solan gölge; ilk kez görüldüğünde (cihazda bir kez, try/catch) haplar 400 ms sola kayıp geri gelerek "kaydırılabilirim" ipucu versin. Kaydırma sona gelince sağdaki gölge kaybolsun, başta değilse solda gölge çıksın.

- [x] **17.4 Sıradaki karttan "Ödemeyi al + yerleştir" akışı (bakıcı ve sahip).** Bakıcı misafiri villaya yerleştirirken parayı alıp tek ekranda işlesin.
  - Sıradaki kart (giriş olayıysa) dokununca rezervasyon detayı açılır; en üstte büyük ana buton: **"Ödemeyi al ve misafiri yerleştir"** (yeşil, `wallet` ikonu). Alınacak tutar butonun üstünde büyük: "13.000 ₺ alınacak (5.000 ₺ depozito dahil)".
  - Butona basınca panel: **"Alınan tutar"** (hazır düğme "Tamamı · 13.000 ₺" seçili gelir, değiştirilebilir) → **"Kaydet"**.
  - Kaydedince hemen ikinci soru (aynı panelde, kayarak): **"Misafiri yerleştirdiniz mi?"** — büyük **"Evet, yerleştirdim"** (yeşil) ve küçük "Henüz değil". Evet → giriş onayı kaydedilir (saat ile), titreşim (başarı), "✓ abc yerleştirildi · 13.000 ₺ alındı" bildirimi; villa durumu anında "Dolu" olur (17.2).
  - Ödeme alınmadan da yerleştirme yapılabilsin: detayda ikinci buton "Ödeme almadan yerleştir".
  - Yerleştirme geri alınabilsin (detayda "Yerleştirildi · 14:42 · geri al").
  - Çıkış günü için aynı mantıkta: Sıradaki kart çıkışsa → **"Misafir çıktı mı?"** → "Evet, çıktı" (çıkış onayı) → mevcut depozito iadesi kartı (Görev 8.5) hemen açılır.
  - **Bakıcı için veri:** bakıcı para tablolarını göremez/yazamaz; ödemeyi `rpc/bakici_odeme_ekle(p_rez uuid, p_tutar bigint, p_not text)` ile kaydeder (fonksiyon yeni kalan tutarı döndürür; sadece o villanın bakıcısı/sahibi çağırabilir). Giriş/çıkış onayı `rezervasyonlar.giris_onay` / `cikis_onay` (timestamptz) ve `giris_onaylayan` / `cikis_onaylayan` (uuid) sütunlarına yazılır (bakıcı da yazabilir). Sahip ödemeyi mevcut yoldan (odemeler) kaydeder.
  - Sahip tarafında Gelir & gider'deki ödemede "Bakıcı aldı · Ali · 14:40" gibi kim aldığı görünsün.

- [x] **17.5 HATA: Sekme değiştirip dönünce villa kapanıyor.** Villa ekranındayken alt menüden Hesap'a, sonra Villalar'a basınca villa listesine atıyor. iPhone alışkanlığı:
  - Her sekme kendi gezinme yığınını hatırlasın: Villalar → Villa Salta → (Hesap) → Villalar'a dönünce **Villa Salta açık**, kaydırma konumu da aynı (Görev 13.5).
  - Zaten seçili olan sekmeye tekrar basınca o sekmenin köküne dönsün (Villa Salta'dayken Villalar'a basınca liste) — sadece sekme zaten seçiliyse.
  - Takvim ve Hesap sekmeleri için de aynı kural.

---

## Bitince
1. sw.js SURUM'u artır, commit, `git push`. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Zeyd'e 5 maddede yaz; denemesi gerekenler: saat 16:00'dan önce ve sonra villa durumu, Sıradaki kart → ödeme al → yerleştir, bakıcı hesabıyla aynı akış, sekme değiştirip dönme.
