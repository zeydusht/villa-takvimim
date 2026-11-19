# GÖREV 33 — Dış satışlarda düzeltmeler, rezervasyon kaynağı ve misafir takibi (CRM)

Zeyd telefonda Görev 32'yi denedi ("Deneme Villa (iCal testi)" villası, Aralık ayı). Bulduğu hatalar ve yeni istekler aşağıda.

**Veritabanı `docs/VERITABANI_GOREV33.sql`. Ürün yöneticisi uygular. Sen çalıştırma, sadece adları kullan:**
- `rezervasyonlar.kaynak`
- `dis_takvimler.kaynak` (yeni değerler eklendi)
- `blok_rez_olustur(p_blok, p_misafir)`: misafir adı artık **zorunlu**
- tablo `baglanti_talepleri`
- `talep_guncelle(p_id,p_durum,p_not)`
- `tum_talepler()`

Kanal (kaynak) listesi, kodda **tek bir yerde** tanımlı olsun (ad, kısa etiket, renk):

| Değer | Görünen ad | Kısa etiket |
|---|---|---|
| `direkt` | Direkt / WhatsApp | DR |
| `airbnb` | Airbnb | AB |
| `booking` | Booking.com | BK |
| `vrbo` | Vrbo | VR |
| `villasepeti` | Villasepeti | VS |
| `tatilsepeti` | Tatilsepeti | TS |
| `kalkanvilla` | Kalkan Villa | KV |
| `villapaketi` | Villa Paketi | VP |
| `tatilkentim` | Tatilkentim | TK |
| `tavsiye` | Tavsiye | TV |
| `diger` | Diğer | ·· |

Renkler `PALET`'ten (STIL.md) seçilsin ve her kanalın rengi farklı olsun. **Sitelerin logolarını kullanma** (marka hakkı). Ad + renk + kısa etiket yeterli.

---

## 33.1 HATA: Dış satışta giriş ve çıkış günü yarım olmalı

Bugün dış blok (Airbnb, Booking…) son günü de tam dolu gösteriyor. Zeyd çıkış gününe yeni bir rezervasyon girmek isteyince o güne dokunuyor, ama uygulama onu Airbnb satışına götürüyor.

**Doğrusu:** iCal'de bitiş günü = **çıkış günü**, o gece dolu değil. Dış bloklar da tıpkı bizim rezervasyonlarımız gibi çizilsin:
- giriş günü ikinci yarısı dolu (çapraz yarım);
- çıkış günü ilk yarısı dolu.

**Dokunma davranışı da bizim rezervasyonlarımızla birebir aynı olsun:**
- Çıkış gününe dokununca yeni seçim **o günden başlasın** (sabah çıkış, öğleden sonra giriş).
- Giriş gününü yeni bir seçimin **son günü** yapabilmek mümkün olsun.
- Ortadaki tam dolu günlere dokununca dış satış paneli açılsın.

Takvim, müsaitlik araması ve "dış satışa aralık seçilemez" kontrolünün hepsi aynı kuralı (bitiş hariç) kullansın. Testle doğrula: 1–5 Aralık Airbnb satışı varken 5–8 Aralık rezervasyonu girilebilmeli, 4–6 Aralık girilememeli.

## 33.2 HATA: "Misafir bilgisi ekle" boş geçilince hiçbir şey değişmemeli

Bugün "Misafir bilgisi ekle"ye basınca rezervasyon hemen oluşuyor ve adı "Airbnb misafiri" oluyor. Zeyd hiçbir şey yazmadan geri dönse de satış değişmiş oluyor.

**Doğrusu:**
- Düğmeye basınca **hiçbir şey kaydedilmeden** normal rezervasyon formu açılsın. Form şöyle dolu gelsin:
  - tarihler dış satıştan, değiştirilemez;
  - "Nereden geldi?" alanında site seçili (33.5);
  - ad alanı **boş**, imleç ad alanında.
- Kaydet'e basınca ve ad yazılmışsa: önce `blok_rez_olustur(p_blok, ad)`, sonra diğer alanlar (telefon, kişi, tutar, kapora…) normal kayıt yoluyla yazılsın.
- Ad yazılmadan Kaydet'e basılırsa: "Misafirin adını yazın". Ad alanı kırmızı olsun, kayıt yapılmasın.
- Geri / Vazgeç: hiçbir şey değişmesin, takvimde dış satış olduğu gibi kalsın. Formda bir şey yazılmışsa "Yazdıklarınız kaydedilmedi, çıkılsın mı?" diye sorulsun.

## 33.3 HATA: Bu formda düğmeler ve "TL" kaymış

Zeyd'in ekranında dış satıştan açılan formda bazı düğmeler yanlış yerde, "₺" da kaymış görünüyor.
- Formu dış satıştan açarak iPhone SE ve iPhone 15 boyutunda, Normal ve Büyük yazıda ekran görüntüsü al.
- Normal "Rezervasyon" formuyla yan yana karşılaştır. **İkisi piksel piksel aynı yerleşimde olmalı**, sadece tarihler kilitli.
- Kayan her şeyi düzelt.
- Önce ve sonra ekran görüntülerini `docs/qa/gorev33/` klasörüne koy.

## 33.4 Takvimde satışın nereden geldiği bir bakışta belli olsun

- **Dış blok:** çizgili zeminin üstünde kanal rengiyle küçük bir **kısa etiket** hapı (AB, BK, VS…). Hücre yeterince büyükse bloğun ilk gününde tam adı yazsın ("Airbnb").
- **Bizdeki rezervasyon** (`kaynak` dolu ve `direkt` değilse): rezervasyon bloğunun köşesinde aynı kısa etiket hapı.
- **Gösterge:** kanallar yalnızca o ay takvimde görünenlerle listelensin.
- **Rezervasyon detayı:** başlığın altında "Airbnb'den" gibi kanal adı ve rengi.
- Bu etiketler bakıcıda da görünsün (fiyat bilgisi değil).

## 33.5 "Nereden geldi?" alanı

- Rezervasyon formuna, misafir adının altına **"Nereden geldi?"** seçimi ekle:
  - büyük hap düğmeler, yatay kaydırılabilir;
  - sık kullanılanlar başta: Direkt/WhatsApp, Airbnb, Booking, Villasepeti, Tatilsepeti, Kalkan Villa, Villa Paketi, Tatilkentim, Tavsiye, Diğer.
- Yeni rezervasyonda varsayılan "Direkt/WhatsApp" olsun.
- Dış satıştan açıldıysa o site seçili ve kilitli olsun.
- Teklif ve opsiyondan rezervasyona dönüşünce de kaynak taşınsın.
- **Eski rezervasyonlar:** kaynak boş olanlar raporda "Belirtilmemiş" diye görünsün. Rezervasyonu açınca "Nereden geldi?" seçilebilsin.

**Villa ayarları → "Satış kanalları ve komisyon"** (sadece sahip):
- Her kanal için komisyon yüzdesi girilebilsin. Örnek: Airbnb %15, Villasepeti %20.
- `villalar.bilgi.komisyon = {airbnb:15, …}` olarak saklansın, veritabanı değişikliği gerekmez.

## 33.6 Kanal raporu (Gelir & gider ekranında)

Gelir & gider ekranına yeni bir bölüm ekle: **"Satış kanalları"**. Ay / Yıl / Tümü seçimine uysun.

Her kanal için bir satır:
- kanal hapı ve adı;
- rezervasyon sayısı;
- gece sayısı;
- ciro;
- komisyon girilmişse komisyon ve **net**;
- toplam cirodaki payı (yatay çubuk).

**Kurallar:**
- **Bilgisi girilmemiş dış satışlar** da sayılsın: `dis_bloklar` içinde `tur='rezervasyon'` ve `bagli_rezervasyon` boş olanlar. Bunlar ayrı bir satırda görünsün: "Airbnb: 3 satış (misafir bilgisi girilmemiş)". Gece sayısı belli, ciro "—". Satıra dokununca o satışların listesi açılsın, her birinde "Misafir bilgisi ekle".
- Sıralama ciroya göre olsun. Büyük yazıda satır alt satıra kayabilir ama üst üste binmesin.
- Bakıcı bu bölümü hiç görmesin.
- **Ölçüm:** `kanal_raporu_ac`.

## 33.7 Misafirler (CRM)

Ajanda sekmesinin üstüne iki parçalı bir seçim ekle: **"Ajanda | Misafirler"**.

**Misafirler listesi:**
- Bütün villalardaki rezervasyonlardan misafirleri topla. Aynı kişiyi **telefon numarasıyla** birleştir (rakamları sadeleştir, başındaki 0 / +90 farkını yok say). Telefon yoksa adla birleştir (büyük/küçük harf ve boşluk duyarsız).
- Her satırda:
  - ad;
  - "3 kez geldi" (ya da "İlk kez");
  - son geliş tarihi ve villası;
  - kanal hapları;
  - sahipte toplam ödeme.
- Üstte arama kutusu (ad ya da telefon).
- Sıralama: son geliş (varsayılan), en çok gelen, en çok ödeyen.
- Bilgisi girilmemiş dış satışlar bu listede yer almaz, çünkü misafiri bilinmiyor.

**Misafir detayı:**
- Ad, telefon ve büyük **WhatsApp** / **Ara** düğmeleri.
- Bütün konaklamaları: villa, tarih, gece, kanal, tutar (tutar sadece sahipte).
- Misafir notları (mevcut `misafir_notlari`).

**Tekrar gelen misafir:** yeni rezervasyon girilirken yazılan telefon daha önceki bir misafirle eşleşirse formda küçük bir hap görünsün: **"Daha önce 2 kez geldi"**. Dokununca misafir detayı açılsın. Rezervasyon detayında da "2. gelişi" yazsın.

- **Bakıcı:** sadece erişimi olan villaların misafirlerini görsün, para bilgisi görmesin.
- **KVKK:** bu bilgiler zaten uygulamada var, yeni veri toplanmıyor. Gizlilik metnindeki "Hangi veriler işleniyor?" bölümüne "misafir geçmişi (aynı misafirin önceki konaklamaları) sahibe gösterilir" cümlesini ekle.
- **Ölçüm:** `misafirler_ac`, `misafir_detay`, `tekrar_misafir_goruldu`.

## 33.8 "Bağlamayı bize bırakın"

Villa sahiplerinin çoğu iCal'i bilmiyor. "Airbnb, Booking ve diğer siteler" ekranında site seçildikten sonra iki seçenek olsun:

1. **"Linki kendim bağlayacağım"** → bugünkü akış (adım adım yardım + link alanı).
2. **"Bağlamayı Villa Takvimim ekibine bırakın"** (önerilen, üstte, ana düğme):
   - Sorulanlar:
     - "Villanızın o sitedeki sayfasının linki" (opsiyonel; tarayıcıdaki adres);
     - "Bize not" (opsiyonel; ör. "Sitedeki yetkili: Ahmet Bey 0532…").
   - Gönderince `baglanti_talepleri` tablosuna kayıt yapılsın.
   - Ekranda: **"Talebiniz alındı. Ekibimiz genellikle 24 saat içinde bağlantıyı kurar ve size haber verir."**
   - Satırda durum görünsün: "Bekliyor" / "Ekibimiz çalışıyor" / "Bağlandı ✓" / "Olmadı: <yönetici notu>".

**Yönetim paneli (sadece yönetici) → yeni "Bağlantı talepleri" bölümü:**
- `tum_talepler()` ile liste: villa, sahip e-postası ve telefonu (WhatsApp düğmesi), site, sayfa linki (dokununca açılır), not, durum.
- Bekleyen sayısı yönetim girişinde rozet olarak görünsün.
- Talebe dokununca:
  - durum değiştir (`talep_guncelle`) ve not yaz;
  - **"iCal linkini ekle"**: yönetici linki yapıştırır, `takvim-esitle` deneme moduyla test edilir, başarılıysa o villaya `dis_takvimler` satırı eklenir (yönetici politikası izin veriyor) ve talep otomatik "baglandi" olur.

**Bildirimler** (`takvim-esitle`'nin "tam" turuna ek, sadece kodla, deploy etme):
- Yeni talep gelince bütün yöneticilere push gitsin: "Yeni takvim bağlama talebi: <villa> · <site>". Anahtar `talep-<id>`, tekrar gönderme.
- Talep "baglandi" olunca villa sahibine push gitsin: "✓ <villa> artık <site> takvimiyle bağlı."

## 33.9 Test

- 33.1 tarih kuralı:
  - 1–5 Aralık Airbnb varken 5–8 girilir, 4–6 girilmez;
  - 5 Aralık'a dokununca yeni seçim başlar;
  - 3 Aralık'a dokununca dış satış paneli açılır.
- 33.2: boş geçiş → hiçbir şey değişmez; ad yazıp kaydet → bağlı rezervasyon, kaynak `airbnb`.
- 33.3: ekran görüntüleri önce/sonra.
- 33.6: 3 kanal, 1 bilgisi girilmemiş dış satış, komisyonlu net doğru mu?
- 33.7:
  - aynı telefon iki farklı yazımla ("0532 111 22 33" ve "+905321112233") tek misafir olarak birleşiyor mu?
  - bakıcıda para görünüyor mu? (Görünmemeli.)
- 33.8: talep gönder → yönetici panelinde görünür → link ekle → sahibin ekranında "Bağlandı ✓".
- Mevcut bütün testler geçmeli.

---

Her alt adımı ayrı commit'le. Netlify'a yayın yok. Edge Function deploy yok.

Bitince çok kısa bir özet yaz ve en alta test linkini koy: https://zeydusht.github.io/villa-takvimim/
