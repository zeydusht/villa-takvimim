# Görev 20 — Rehber düzeltmeleri, tarih seçim paneli, form sadeleştirme

_Hazırlayan: Claude (ürün yöneticisi), 16 Kasım 2026. Zeyd'in iPhone ekran kaydından (19:00) kare kare tespit edildi._

## Önce oku
- Görev 19 / 19B üzerine. Netlify yok; commit + push. Açılış animasyonuna dokunma.
- "Kendi kendini test et" kuralı (390×844, 360×740; `docs/qa/gorev20/`). Klavye senaryolarını visualViewport küçülterek test et.
- Maddeleri sırayla uygula, biten kutuyu `[x]` yap.

---

## A. Rehber (Yardımlı mod)

- [x] **20.1 HATA: Baloncuk yazılan alanı kapatıyor.** Kayıtta "Ad soyad" yazarken rehber baloncuğu tam input'un üstüne oturuyor (etiket ile kutu arasına giriyor); yazılan metin görünmüyor.
  - Kural: baloncuk **hedefle asla çakışmaz** ve hedef her zaman görünür kalır.
  - Yerleşim sırası: (1) hedefin üstünde yer varsa üstüne, (2) yoksa altına, (3) klavye açıkken ve iki tarafta da yer yoksa baloncuk **tek satırlık küçük şerit**e dönüşüp görünür alanın en üstüne yapışır ("Misafirin adını yazın · Tamam"), hedefi kapatmaz.
  - "Görünür alan" = visualViewport (klavye hariç). Hesap her klavye açılış/kapanışında ve her adım değişiminde yapılır.
  - Test: ad soyad, telefon, kapora, fiyat, not alanlarının her birinde klavye açıkken hedef kutunun dikdörtgeni ile baloncuğun dikdörtgeni kesişmemeli (Playwright'ta ölç).

- [x] **20.2 Karartılmış yerden de kaydırılabilsin.** Şu an perde kaydırmayı yutuyor; sadece aydınlık yerden kaydırılabiliyor. Perde `pointer-events:none` olsun (kaydırma, perdeden geçip sayfaya/panele gitsin). Hedef dışındaki **dokunuşları** (tıklama) engellemek için perde yerine, rehber açıkken belge seviyesinde yakalama (capture) aşamasında `click` dinle: hedefin dışındaki tıklamaları iptal et ve baloncuğu hafifçe salla. Kaydırma ve sürükleme hareketleri hiç engellenmesin. Çerçeve kaydırmayla eşzamanlı kalsın (19B.3).

- [x] **20.3 "Bu işlemi artık biliyor musunuz?" sorusu kalksın.** Ayrıca "Bu işlemin yardımı kapandı…" siyah bildirimi de kalksın. Yardımı kapatmanın tek yolu baloncuktaki **"Yardımı kapat"** (ve Hesap → Yardım → Yardımlı mod). "Yardımı kapat"a basınca Yardımlı mod tamamen kapanır, kısa ve sade bir bildirim: "Yardım kapatıldı. Hesap → Yardım'dan tekrar açabilirsiniz." (2 sn). 3 kez tamamlayınca sorma mantığı tamamen silinsin.

- [x] **20.4 Ücret kartında "Değiştir" sonrası onay.** "Değiştir"e basınca açılan fiyat alanının yanında **"Tamam"** (✓) butonu olsun; Tamam'a basınca tutar kaydedilir ve alan kapanır (klavye de kapanır). Rehberin ücret adımında hedef tüm ücret kartı olsun: kullanıcı kart içindeki herhangi bir "Değiştir"e basabilir, düzenleyebilir, Tamam diyebilir; baloncukta "İleri" sadece kart içinde açık düzenleme yoksa aktif. Aynı "Tamam" kuralı uygulamadaki tüm satır içi düzenlemelerde (kısa konaklama, depozito, kapora tutarı) geçerli.

## B. Takvimde normal seçim (rehbersiz) — alt panel

- [x] **20.5 İlk dokunuşta takvime odaklan.** Rehber kapalıyken takvimde bir güne dokununca:
  - Sayfa takvim ekranın ortasına gelecek şekilde yumuşakça kaysın (`--egri-gecis`, 400 ms) — takvim zaten tamamen görünüyorsa kaymasın.
  - Alttaki panel daha büyük ve dikkat çekici çıksın: alttan kayarak (`--egri-giris`, 320 ms); başlık **kalın ve yeşil** (bu panelde kalın yazı serbest): **"Çıkış gününü seçin"** (20 px), altında "Giriş: 27 Kasım Cuma · 16:00"; sağda ✕.
- [x] **20.6 Aralık seçilince odak.** Çıkış günü de seçilince:
  - Ekranın geri kalanı hafifçe kararsın (%35), aydınlık kalanlar: takvim ve alt panel. Karartılmış yere dokunmak seçimi temizler (Görev 18.1 kuralı) ve kararma kalkar. Kaydırma engellenmesin (20.2 gibi).
  - Panel başlığı kalın ve yeşil: **"27 → 28 Kasım · 1 gece"**, sağında büyük **toplam**: **6.200 ₺** (20.7).
  - Altında eşit genişlikte 3 buton (değişmez): **Rezervasyon · Teklif · Opsiyon**.
  - Panel açılırken içerik 40 ms arayla sırayla belirsin; kapanırken aşağı kayarak.

- [x] **20.7 Paneldeki tutar = konaklama ücreti toplamı.** Şu an "1 gece · 1.200 ₺" yazıyor; kısa konaklama ücreti dahil değil. Paneldeki tutar **geceler + kısa konaklama ücreti** (depozito HARİÇ) olsun: 1.200 + 5.000 = **6.200 ₺**. Altında küçük gri satır: "1.200 ₺ konaklama + 5.000 ₺ kısa konaklama · depozito ayrıca". Aynı toplam kuralı: misafir sayfası alt çubuğu, teklif ve opsiyon panelleri — hepsi aynı fonksiyonu kullansın (tek yerde hesap).

## C. Formlar karışmasın

- [x] **20.8 Her işlem kendi formunda.** Rezervasyon formundaki **"Teklif olarak gönder"** butonu kaldırılsın. Kural: Rezervasyon formunda sadece rezervasyon, Teklif panelinde sadece teklif, Opsiyon panelinde sadece opsiyon işlemleri olur; birinden ötekine geçiş butonu yok (kullanıcı vazgeçip alttaki panelden diğerini seçer). Tüm panelleri bu açıdan gözden geçir ve `docs/qa/gorev20/`'ye kaldırdığın çapraz butonları listele.

## D. Klavye (19B.4 tekrar kontrol)
- [x] **20.9** Kayıtta klavye açılıp kapandıkça rezervasyon paneli aşağı yukarı sekiyor. 19B.4 tamamlandıysa iPhone'a özgü durumları tekrar kontrol et: input odağında iOS'un otomatik sayfa kaydırmasını engelle (odaklanmadan önce panel içi kaydırmayı kendin yap; `focus({preventScroll:true})`), panel yüksekliğini visualViewport'a göre ayarla, klavye kapanınca panel aynı yerde kalsın (geri zıplamasın).

---

## Bitince
1. sw.js SURUM'u artır, `npx cap sync`, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: rehberle rezervasyon girerken adı yaz (yazdığın görünmeli), karartılmış yerden kaydır; rehber kapalıyken takvimde iki gün seç (panel büyük ve toplam 6.200 gibi kısa konaklama dahil olmalı)".
