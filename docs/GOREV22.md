# Görev 22 — Rehberi kapatmak geçici olsun

_Hazırlayan: Claude (ürün yöneticisi), 16 Kasım 2026. Zeyd yanlışlıkla "Yardımı kapat"a bastı; rehber tamamen kapandı ve "+ Rezervasyon"a basınca da bir daha gelmedi. Yaşlı kullanıcı bunu geri açamaz._

## Önce oku
- Netlify yok; commit + push. Testler `docs/qa/gorev22/`.
- Görev 20.3'teki "Yardımı kapat = Yardımlı modu tamamen kapatır" kuralı bu görevle **değişiyor**.

---

- [x] **22.1 Baloncuktaki kapatma sadece o anki rehberi kapatır.**
  - Baloncuktaki "Yardımı kapat" yerine sağ üstte **✕** ve yanında küçük "Kapat" yazısı. Basınca sadece **o anki** rehber kapanır; işlem (form, panel) açık kalır, kullanıcı kendisi devam edebilir.
  - Yardımlı mod ayarı **değişmez**. Bir sonraki işlemde (yeni rezervasyon, teklif, opsiyon vb.) rehber yine baştan gelir.
  - Kapatınca kısa bildirim YOK (sessiz kapanış). Sadece perde ve baloncuk solarak kaybolur (200 ms).

- [x] **22.2 Yarıda kapatılan rehbere geri dönüş.** Rehber kapatıldıktan sonra açık kalan panelin (rezervasyon formu, teklif, opsiyon, fiyat vb.) üst kısmında, başlığın yanında küçük yuvarlak **"?"** düğmesi (`circle-help`, 44 pt dokunma alanı) dursun. Basınca o işlemin rehberi **kaldığı adımdan** (bilinmiyorsa ilk boş alandan) yeniden başlar. Bu "?" düğmesi Yardımlı mod kapalıyken de görünür ve rehberi tek seferlik açar.

- [x] **22.3 Kalıcı kapatma sadece Hesap'tan.** Rehberi tamamen kapatmanın tek yolu: Hesap → Yardım → "Yardımlı mod" aç/kapa (varsayılan açık). Açıklama satırı: "Açıkken her işlemde adım adım yardım gösterilir." Kapatılırsa her paneldeki "?" ile tek seferlik yardım yine alınabilir.

- [x] **22.4 Mevcut kullanıcıları düzelt.** Görev 19–20 sürümlerinde "Yardımı kapat"a basıp Yardımlı modu farkında olmadan kapatmış olanlar için: bu sürüme geçişte cihazda kayıtlı "yardım kapalı" tercihi **bir kez sıfırlansın** (Yardımlı mod tekrar açık). İşlem başına kapatma kayıtları (Görev 19.2'deki "bu işlem için kapat") da silinsin; o mantık artık yok.

- [x] **22.5 Test:** Playwright'ta: rehberi 2. adımda ✕ ile kapat → form açık kalmalı → formu kapat → "+ Rezervasyon"a tekrar bas → rehber 1. adımdan gelmeli. "?" ile yarıda kalan rehber kaldığı adımdan dönmeli. Hesap'tan kapatınca rehber gelmemeli, "?" ile tek seferlik gelmeli.

---

## Bitince
1. sw.js SURUM'u artır, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: rehberi ✕ ile kapat, sonra yeni rezervasyon başlat — rehber yine gelmeli".
