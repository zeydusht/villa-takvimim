# Görev 48 — Rehber ve karartma 60 FPS, daha hissedilir titreşim, rehber daha az ısrarcı

Zeyd TestFlight sürümünü (build 278) gerçek iPhone'da denedi. Genel olarak iyi, üç şikâyet var:
1. **Kasma.** Ekran griye kararırken ve rehberin beyaz balonu kayarken takılma oluyor. "Akıcılık bizim en güçlü yanımız, 60 FPS olmak zorunda."
2. **Titreşim zayıf.** Bir yere dokununca, sekme değiştirince ya da bir düğmeye basınca diğer uygulamalardaki gibi hafif ama hissedilen "tık" olsun. Abartısız.
3. **Rehber ısrarcı.**
   - Tanıtımın ikinci adımında hemen "rezervasyon girin" diyor.
   - Alana bir şey yazmadan geçilemiyor.
   - Kapat düğmesi uzak.
   - 10. kullanımda da aynı ipuçları çıkarsa kullanıcı sıkılır.

**Kurallar:**
- Veritabanına dokunma.
- Yayın yapma: `canli` dalına ve Cloudflare'a gönderme yok.
- Her adım ayrı commit olsun, main'e push et. `[skip ci]` koyma; iOS derlemesi çalışsın ki Zeyd TestFlight'ta denesin.

**Test kuralı:**
- Kısa tut.
- Ölçümler **webkit** ile, CPU 4 kat yavaş.
- 3 denemede geçmeyen testte dur, özete yaz.

---

## 48.1 — Karartma ve rehber: iPhone'da 60 FPS

**Önce ölç.** `docs/qa/gorev44/performans.md` dosyasındaki yöntemle, ama **webkit** ile ve CPU 4 kat yavaş. Şu hareketlerin kare sürelerini ölç:
- alttan açılan pencerenin açılması, kapanması ve aşağı çekilmesi (gri karartma dahil);
- rehberin açılması;
- rehberde adımdan adıma geçiş: balonun kayması, vurgunun yer değiştirmesi;
- rehberin kapanması.

**Muhtemel sebepler. Kontrol et ve düzelt:**
- **Bulanıklık.** `backdrop-filter: blur` (`--morf-bulanik`) iPhone'un WebView'inde çok pahalı. **Uygulama içinde (Capacitor) hiç kullanma**, sadece düz yarı saydam karartma kalsın. Sitede de hareket sırasında kullanma.
- **Rehberdeki ışık deliği (spotlight).**
  - Büyük bir `box-shadow: 0 0 0 9999px …` ile yapılıyor ve boyutu ya da konumu animasyonla değişiyorsa, her karede bütün ekran yeniden boyanır. Bu, kasmanın bir numaralı adayı.
  - Delik konumu değişirken sadece `transform` ve `opacity` hareket etsin.
  - Seçenekler: deliği tek bir katmanda tut, sadece `transform: translate/scale` ile taşı. Ya da karartmayı sabit bırak, deliği `clip-path`/mask yerine dört dikdörtgenle yap. Ölçümle en hızlısını seç.
- **Balonun hareketi.** Balon `top/left` ile değil `transform` ile kaysın. Hareket süresince `will-change: transform` olsun, sonra kaldır.
- **Sayfa kaydırma.** Rehber hedefe giderken sayfayı kaydırıyorsa, kaydırma ile balon hareketi aynı anda çalışırken layout zorlanmasın (`scrollIntoView` + ölçme + yazma iç içe). Okumaları önce yap, yazmaları rAF'te yap.
- **Gölgeler.** Balonun büyük gölgesi hareket sırasında yeniden boyanmasın: gölgeyi ayrı bir katmanda tut ya da hareket bitince ekle.

**Hedef:** Webkit, CPU 4× yavaş. Hareket boyunca karelerin %95'i 16,7 ms'nin altında, hiçbir kare 33 ms'yi geçmesin. Önce/sonra tablosunu `docs/qa/gorev48/performans.md` dosyasına yaz.

**Telefonda görmek için FPS göstergesi.**
- Hesap → Gelişmiş bölümüne gizli bir **"Akıcılık göstergesi"** anahtarı ekle.
- Açıkken ekranın köşesinde küçük bir kutu, son 1 saniyenin FPS'ini ve en kötü kare süresini göstersin.
- Böylece Zeyd TestFlight'ta kendisi ölçebilir.
- Varsayılan kapalı. Normal kullanıcı görmesin: sadece yönetici hesabında görünsün.

## 48.2 — Titreşim: hissedilir ama abartısız

**Durum:**
- `TITRESIM_DILI` (index.html) ve `VTNative.titret` (native.js) var.
- Ama düğmelere ve gezinmeye dokunurken çoğu yerde titreşim yok.
- Sekme değişimi `selectionChanged` kullanıyor, bu çok zayıf hissediliyor.

**Yeni eşleme.** iOS'un kendi uygulamalarındaki gibi olsun.

| Olay | Titreşim |
|---|---|
| Alt sekme değiştirme (Villalar / Takvim / Hesap) | `impact LIGHT` |
| Herhangi bir ana düğmeye basma (`.big`, Kaydet, Villa ekle, Ödemeyi al…) | `impact LIGHT`, parmak **kalkınca** değil **basınca** (touchstart) |
| Kart ya da listeye dokunup yeni ekran açma (villa kartı, rezervasyon) | `impact LIGHT` |
| Hap, segment, filtre, takvim günü seçme | `selection` (mevcut) |
| Alttan açılan pencere açılınca | `impact LIGHT` |
| Pencere aşağı çekilip kapanma eşiği geçilince (41.5) | `impact MEDIUM`, bir kez |
| Kenardan kaydırarak geri: eşik geçilince (43.2) | `impact LIGHT`, bir kez |
| Kaydetme, ödeme ve villa ekleme başarılı | `notification SUCCESS` (mevcut) |
| Hata ya da eksik alan | `notification WARNING` (mevcut) |
| Silme | `impact MEDIUM` (mevcut) |

**Kurallar:**
- Kaydırma sırasında (parmak 10 pt'den fazla kayarsa) titreşim **olmasın**.
- Aynı titreşim 80 ms içinde iki kez çalmasın: art arda basılan düğmeler "vızıldamasın".
- Hesap → Titreşim ayarı kapalıysa hiçbir titreşim olmasın (mevcut).
- Bu **yalnız uygulamada** olsun, sitede bir şey değişmez.
- Titreşim çağrısı dokunmayı geciktirmesin; asenkron çalışsın.

## 48.3 — Rehber: az, kısa, her an kapatılabilir

**Önce mevcut rehberi oku.** `www/rehber.js` ve `vt-yardim` ayarı. Hangi adımlar var, ne zaman ve kaç kez çıkıyor, hangileri kullanıcıyı bekletiyor? Raporda kısa bir liste ver.

Sonra şu kurallara göre düzelt:

1. **İlk tanıtım kısa olsun.**
   - En fazla **4 adım**, sadece uygulamanın ana fikri: villalarınız burada → takvimden tarih seçilir → rezervasyon kaydedilir → villa sayfası paylaşılır.
   - Tanıtım sadece **gösterir**, kullanıcıyı bir şey yapmaya zorlamaz.
   - Tanıtım biter bitmez "rezervasyon girin" ya da benzeri bir görev başlatılmaz.
2. **Her adımda iki büyük düğme.** Balonun altında yan yana:
   - **"İleri"**: ana düğme;
   - **"Rehberi kapat"**: ikincil düğme, aynı büyüklükte, kolay basılır.

   Sağ üstteki küçük ×'e bağlı kalınmasın. Kapat düğmesi baş parmağın kolay eriştiği yerde olsun.
3. **Yazma bekleyen adımlar zorlamasın.**
   - Örnek: "Misafirin adını yazın". Kullanıcı yazmak istemezse **"Bu adımı geç"** ile geçebilsin.
   - Rehber, kullanıcı yazana kadar başka hiçbir yere dokunmayı engellemesin.
4. **Hedefi gösteren ok.**
   - Doldurulacak alanı ya da basılacak düğmeyi, balondan hedefe doğru tombul bir **ok** göstersin.
   - Ok uygulamanın lime/yeşil vurgu renginde olsun. **Kırmızı değil**: kırmızı uygulamada "fazla ödeme / hata" anlamına geliyor.
   - Ok hafifçe ileri geri sallansın (2–3 kez, sonra dursun). `prefers-reduced-motion` açıksa sallanmasın.
5. **İpuçları bir kez gösterilsin.**
   - Her ekranın ya da özelliğin ipucu, kullanıcı o ekrana **ilk kez** geldiğinde bir kere çıksın.
   - Kullanıcı o işi bir kez kendisi yaptıysa (örneğin ilk rezervasyonunu kaydettiyse) o ipucu bir daha hiç çıkmasın.
   - Hangi ipucunun gösterildiği **hesaba bağlı** saklansın (yerel kayıt yeterli, veritabanı gerekmez). Uygulama silinip kurulursa en fazla bir kez daha çıkabilir, sorun değil.
6. **Kullanıcı sıkılırsa sussun.** Kullanıcı rehberi 2 kez "Rehberi kapat" ile kapatırsa otomatik ipuçları tamamen kapansın. Sadece "Nasıl?" düğmeleri kalsın.
7. **Yardım her zaman ulaşılabilir olsun.**
   - "Nasıl?" düğmeleri aynen kalsın.
   - Hesap → Yardım bölümüne **"Tanıtımı baştan göster"** ekle.
8. Rehber adımlarının metinleri kısa olsun: en fazla 2 kısa cümle, büyük yazıda da 4 satırı geçmesin.

## 48.4 — Test ve bitiş

- Webkit ile kare süresi ölçümü (48.1), önce/sonra.
- Rehber akış testleri:
  - tanıtım 4 adımı geçmiyor;
  - her adımda "Rehberi kapat" görünür;
  - yazma adımı "Bu adımı geç" ile geçiliyor;
  - aynı ipucu ikinci girişte çıkmıyor;
  - iki kez kapatınca otomatik ipucu çıkmıyor.
- Titreşim: sahte `Capacitor.Plugins.Haptics` ile hangi olayda hangi titreşimin çağrıldığını kaydeden test. Kaydırmada titreşim yok, 80 ms kuralı geçerli.
- Ekran görüntüleri `docs/qa/gorev48/` klasörüne: yeni rehber balonu (ok, iki düğme), 390 ve 320 + Çok büyük yazı.
- `docs/PROJE_DURUMU.md` dosyasına Görev 48'i ekle.
- Mesajının en altına çok kısa özet yaz:
  - en kötü hareketin önce/sonra kare süresi;
  - yeni TestFlight build numarası.

  Altına test linkini koy: https://zeydusht.github.io/villa-takvimim/
