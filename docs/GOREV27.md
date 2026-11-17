# Görev 27 — Müsaitlik arama: "17–21 arası hangi villam boş?"

_Hazırlayan: Claude (ürün yöneticisi), 17 Kasım 2026. Zeyd: "5 villası olan biri 17–21 arası boşluk arıyorsa tek tek mi bakacak? Takvimde tarihi seçsin, boş olan villalar fiyatlarıyla listelensin."_

## Önce oku
- Görev 26 bitmediyse önce onu bitir; bu görev ondan sonra.
- Netlify yok; her madde sonunda commit + push. Stil: `docs/STIL.md` (varsa), renk/ikon kuralları. Tarih seçimi kuralları Görev 18.1 ile aynı; seçim görünümü Görev 18.2 ile aynı.
- Fiyat hesabı tek yerden (Görev 20.7): **konaklama toplamı = geceler + kısa konaklama ücreti (dönem kuralına göre, Görev 15.9), depozito hariç**.
- Testler `docs/qa/gorev27/`.

---

- [x] **27.1 Takvim sekmesinin en üstüne "Müsaitlik ara".** Takvim sekmesinde başlığın altında, mevcut giriş/çıkış listesinin ÜSTÜNDE belirgin bir kart: `search` ikonu, **"Hangi villam boş?"**, altında "Tarih seçin, boş villaları fiyatlarıyla görün". Dokununca 27.2 açılır. (Tek villası olan kullanıcıda da görünür ama daha küçük.)
- [ ] **27.2 Tarih seçimi.** Tam ekran panel: üstte ay takvimi (tüm villaların toplam doluluğu gösterilmez; sade, boş takvim), Görev 18.1 kuralıyla giriş → çıkış seçilir. Altta sabit satır: "17 → 21 Kasım · 4 gece" + **Kişi sayısı** (− 2 +, isteğe bağlı; seçilirse kapasitesi yetmeyen villalar elenir) + büyük **"Boş villaları göster"** butonu. Hızlı seçim hapları: "Bu hafta sonu", "Gelecek hafta sonu", "7 gece".
- [ ] **27.3 Sonuç listesi.** Başlık: "17 → 21 Kasım · 4 gece · **3 villa boş**".
  - **Boş villalar** (üstte): her biri kart — kapak fotoğrafı, villa adı, kapasite ("8 kişi · 4 oda"), sağda büyük **toplam fiyat** ("18.400 ₺") ve altında küçük "4 gece · kısa konaklama dahil · depozito 5.000 ₺". Sıralama: varsayılan kullanıcının villa sırası (Görev 18.16); üstte küçük seçici "Sırala: Benim sıram · Fiyat (artan)".
  - Kartın altında yan yana üç küçük buton: **Rezervasyon · Teklif · Opsiyon** (o villa ve tarihlerle ilgili formu doğrudan açar; rehber açıksa rehberli).
  - **Kural engeli:** dönem kuralına göre en az gece sağlanmıyorsa kart soluk ve üstünde "Bu dönemde en az 5 gece" etiketi (yine de işlem yapılabilir — sahip karar verir).
  - **Kısmen boş** (ayrı bölüm, kapalı-açılır): seçili aralığın bir kısmı boş olan villalar: "17–19 boş, 19'dan itibaren dolu" gibi; dokununca o villanın takvimi açılır.
  - **Fiyatı girilmemiş geceler** varsa: "2 gecenin fiyatı girilmemiş" uyarısı, toplam yerine "Fiyat eksik" + "Fiyat gir" bağlantısı.
  - Hiç boş villa yoksa: çizimli boş durum + "Bu tarihlerde boş villa yok" + en yakın boşluk önerisi: "En yakın boşluk: Villa Salta · 22–26 Kasım" (dokununca o tarihlerle aramayı yeniler).
- [ ] **27.4 Müşteriye tek mesajla gönder.** Sonuç listesinde üstte **"Seç ve gönder"**: villalar onay kutusuyla seçilir → **"WhatsApp'ta gönder"** / "Kopyala". Mesaj (düzenlenebilir önizleme):
  ```
  Merhaba, 17–21 Kasım (4 gece) için müsait villalarımız:
  • Villa Salta (8 kişi) – 18.400 ₺ – <villa sayfası bağlantısı>
  • Villa Defne (6 kişi) – 15.200 ₺ – <bağlantı>
  Fiyatlara konaklama dahildir; girişte iade edilen hasar depozitosu alınır.
  ```
  Bağlantılar o tarihleri seçili açar (`?giris=…&cikis=…`; g.html bu parametreleri okuyup takvimde seçsin). Villa sayfası yayında olmayan villada bağlantı yerine "(sayfa yok)".
- [ ] **27.5 Kısayollar.** Villalarım ekranında başlık satırına küçük `search` butonu ("Boş villa ara") → 27.2. Bakıcı hesabında bu özellik fiyatsız çalışsın (bakıcı fiyat görmez): sadece boş/dolu listesi.
- [ ] **27.6 Rehber.** Yardımlı modda: "Müşterinin istediği giriş gününe dokunun" → "çıkış gününe" → "Boş villaları göster'e dokunun" → sonuç listesi vurgulu: "Boş villalar ve toplam fiyatları burada. Müşteriye göndermek için 'Seç ve gönder'."
- [ ] **27.7 Test:** 5 villalı sahte veriyle (farklı doluluk, fiyat, kapasite, dönem kuralı, eksik fiyat): 17–21 Kasım için boş/kısmen boş/eksik fiyat/kural engeli sınıflandırması doğru; toplamlar Görev 20.7 fonksiyonuyla birebir; kişi sayısı filtresi doğru; WhatsApp mesaj metni doğru; g.html `?giris&cikis` ile tarihleri seçili açıyor. Ekran görüntüleri 360/390/430.

---

## Bitince
1. sw.js SURUM'u artır, commit, push. **Netlify yok.**
2. `docs/PROJE_DURUMU.md`'yi güncelle.
3. Mesajının en altına kısa özet + https://zeydusht.github.io/villa-takvimim/ + "önce şunu dene: Takvim sekmesi → Hangi villam boş? → 17–21 Kasım seç → boş villaları seç ve WhatsApp'ta gönder".
