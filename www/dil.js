/* ============================================================
   Villa Takvim — dil katmanı
   Uygulama Türkçe yazıldı; bu dosya arayüzü İngilizceye çevirir.
   ============================================================ */
(function () {
  "use strict";

  var ANAHTAR = "villa-takvim-dil";
  var D = { dil: "tr" };

  try { D.dil = localStorage.getItem(ANAHTAR) || "tr"; } catch (e) {}

  D.ingilizce = function () { return D.dil === "en"; };

  D.AYLAR = {
    tr: ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
    en: ["January","February","March","April","May","June","July","August","September","October","November","December"]
  };
  D.GUNLER = {
    tr: ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],
    en: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  };
  D.KISAGUN = {
    tr: ["Pt","Sa","Ça","Pe","Cu","Ct","Pz"],
    en: ["Mo","Tu","We","Th","Fr","Sa","Su"]
  };

  // ---------- birebir karşılıklar ----------
  var S = {

    // Özellik ve olanak listeleri
    "Özel havuz":"Private pool", "Korunaklı havuz":"Secluded pool",
    "Isıtmalı havuz":"Heated pool", "Çocuk havuzu":"Children's pool", "Jakuzi":"Jacuzzi",
    "Deniz manzarası":"Sea view", "Doğa manzarası":"Nature view", "Klima":"Air conditioning",
    "İnternet":"Internet", "Barbekü":"Barbecue", "Barbekü / Mangal":"Barbecue / grill",
    "Şömine":"Fireplace", "Bulaşık makinesi":"Dishwasher", "Çamaşır makinesi":"Washing machine",
    "Otopark":"Parking", "Sessiz konum":"Quiet location", "Araç gerekli":"Car needed",
    "Bebek ekipmanı":"Baby equipment", "Engelli erişimi":"Accessible",
    "Buzdolabı":"Refrigerator", "Fırın":"Oven", "Su ısıtıcı":"Kettle",
    "Tost makinesi":"Sandwich maker", "Mikrodalga":"Microwave", "TV":"TV",
    "Saç kurutma makinesi":"Hair dryer", "Ütü":"Iron", "Sineklik":"Insect screens",
    "Hamak":"Hammock", "Bebek yatağı":"Cot", "Mama sandalyesi":"High chair",

    // Mesafeler
    "Havaalanı":"Airport", "Merkeze":"To the centre", "Plaja":"To the beach",
    "Markete":"To a shop", "Restorana":"To a restaurant", "Toplu taşımaya":"To public transport",

    // Kalan arayüz
    "Villa boş":"Villa is free", "Yaklaşan rezervasyonlar":"Upcoming reservations",
    "Kişi":"Guests", "Özellikler":"Features", "Ev hakkında":"About the house",
    "Ödeme":"Payment", "Ödemeyi kaydet":"Save payment",
    "Toplam tutarı düzenle":"Edit total amount", "Net kazanç":"Net earnings",
    "Sayfa hazırlanıyor…":"Preparing the page…", "Sigara içilebilir":"Smoking allowed",
    "Kısa konaklama sınırı (gece)":"Short-stay limit (nights)",
    "Kısa konaklama ücreti (₺)":"Short-stay fee (₺)",
    "Bu gece sayısı ve altındaki konaklamalara ek ücret eklenir. Boş bırakırsanız uygulanmaz.":
      "Stays of this many nights or fewer get an extra fee. Leave blank to disable.",
    "Bu bilgiler paylaştığınız sayfada görünür. İstediğiniz zaman değiştirebilirsiniz.":
      "This information appears on the page you share. You can change it any time.",
    "Fiyat vermek istediğiniz ilk ve son güne dokunun. Tek gün için aynı güne iki kez dokunun.":
      "Tap the first and last day you want to price. For a single day, tap it twice.",
    "Paylaşılan sayfada \"WhatsApp'tan bilgi al\" butonu olarak çıkar.":
      "Appears as a \"Ask on WhatsApp\" button on the shared page.",
    "Bu bilgiler paylaştığınız sayfada görünür. İstediğiniz zaman güncelleyebilirsiniz.":
      "This information appears on the page you share. You can update it any time.",
    "Paylaşılan sayfada \"WhatsApp'tan bilgi al\" butonu olarak çıkar. Boş bırakırsanız buton görünmez.":
      "Appears as an \"Ask on WhatsApp\" button on the shared page. Leave blank to hide the button.",
    "Önceki ay":"Previous month", "Sonraki ay":"Next month",
    "Önceki":"Previous", "Sonraki":"Next",
    "Villa adı":"Villa name", "Örn. Kalkan, İslamlar":"e.g. Kalkan, İslamlar",
    "Rezervasyon formunda görünür":"Shown on the reservation form",
    "Villanızı tanıtın: konumu, manzarası, öne çıkan yanları…":
      "Describe your villa: location, views, what makes it special…",
    "Her satıra bir oda yazın. Örn:":"Write one room per line. For example:",
    "Örn. depozito iadesi, ek hizmet":"e.g. deposit refund, extra service",
    "Örn. kapora, nakit, havale":"e.g. deposit, cash, transfer",

    "Bakıcılar rezervasyonları görüp ekleyebilir, gider girebilir ve girişte tahsil edilecek kalan tutarı görür. Fiyatlar, ödemeler ve kazanç bilgileri onlara kapalıdır.":
      "Caretakers can view and add reservations, enter expenses and see the balance to collect at check-in. Prices, payments and earnings are hidden from them.",
    "Villa sahibinin verdiği 6 haneli kodu yazın.":"Enter the 6-character code the villa owner gave you.",
    "ÖRN. K7M2XQ":"E.G. K7M2XQ",
    "Örn. temizlik, havuz bakımı":"e.g. cleaning, pool maintenance",
    "· isteğe bağlı":"· optional",
    "bakıcı · görüntüle":"caretaker · view",
    "villa sahibi · görüntüle":"villa owner · view",
    "Bu bağlantıyı gönderdiğiniz kişi fotoğrafları, boş günleri ve fiyatları görür; tarih seçip size istek gönderebilir.":
      "Anyone you send this link to can see the photos, availability and prices, pick dates and send you a request.",
    "Misafirin gördüğü hâli":"What the guest sees",
    "Misafirlerinize göndereceğiniz sayfa hazır. Her paylaşımda en güncel takvim ve fiyatlar gönderilir.":
      "Your page is ready to send to guests. Each share includes the latest calendar and prices.",
    "Sayfayı önizle":"Preview the page",
    "Villa sayfanız hazır":"Your villa page is ready",
    "Oluşturma":"Created",
    "Her satıra bir oda yazın. Örn:\nSalon · Zemin kat · Klima, TV\n1. Yatak Odası · Zemin kat · Çift kişilik yatak, duş":
      "Write one room per line. For example:\nLiving room · Ground floor · A/C, TV\nBedroom 1 · Ground floor · Double bed, shower",

    "Villalarınızı ve rezervasyonlarınızı tek yerden yönetin":
      "Manage your villas and reservations in one place",
    "Adınız":"Your name", "Şifreyi tekrar yazın":"Re-enter the password",
    "Kaydınızı aldık. Hesabınız onaylandığında uygulamayı kullanmaya başlayabilirsiniz.":
      "We have received your registration. You can start using the app once your account is approved.",
    "Hesabınız geçici olarak kullanıma kapatıldı. Kayıtlarınız silinmedi; erişim yeniden açıldığında kaldığınız yerden devam edebilirsiniz.":
      "Your account has been temporarily suspended. Your records have not been deleted; you can continue where you left off once access is restored.",
    "Hesabınız geçici olarak kullanıma kapatıldı. Kayıtlarınız silinmedi.":
      "Your account has been temporarily suspended. Your records have not been deleted.",
    "Hesabınız onaylandığında devam edebilirsiniz.":"You can continue once your account is approved.",

    "Tümünü seç":"Select all", "Seçimi kaldır":"Clear selection",
    "misafir":"guests",

    "Onay bekleyenler":"Pending approvals", "Bekleyen yok":"None pending",
    "Bekleyen kayıt yok.":"No pending registrations.",
    "Onayladığınız kişiler uygulamayı kullanmaya başlar.":
      "People you approve can start using the app.",
    "Onayla":"Approve",

    // Genel eylemler
    "Kaydet":"Save", "Kapat":"Close", "Vazgeç":"Cancel", "Sil":"Delete", "Ekle":"Add",
    "Geri":"Back", "Aç":"Enable", "Kaldır":"Remove", "Durdur":"Suspend",
    "Tamam":"Done", "Bitir":"Finish", "Temizle":"Clear", "Kopyala":"Copy", "Paylaş":"Share",
    "Yenile":"Refresh", "Devam":"Continue", "Değişiklikleri kaydet":"Save changes",
    "Tekrar dene":"Try again", "Hazırlanıyor…":"Preparing…", "Yükleniyor…":"Loading…",
    "Kaydediliyor…":"Saving…", "Oluşturuluyor…":"Creating…", "Kontrol ediliyor…":"Checking…",
    "Lütfen bekleyin…":"Please wait…", "Gönderiliyor…":"Sending…", "Kaldırılıyor…":"Removing…",
    "İzin isteniyor…":"Requesting permission…", "Fiş yükleniyor…":"Uploading receipt…",

    // Ana ekran
    "Villalarım":"My villas", "Villa ekle":"Add villa", "Henüz villa yok.":"No villas yet.",
    "Aşağıdan ilk villanızı ekleyin.":"Add your first villa below.",
    "Yedek al":"Back up", "Geri yükle":"Restore", "Hesabım":"My account",
    "Villa davet kodu gir":"Enter villa invite code", "Bakıcıysanız":"If you are a caretaker",
    "Kullanıcılar":"Users", "Bugün ve yarın":"Today and tomorrow",
    "Bugün boş":"Free today", "Bugün dolu":"Occupied today", "Henüz yok":"None yet",
    "Sıradaki":"Next", "Ana ekrana ekleyin":"Add to home screen",
    "Uygulama gibi tek dokunuşla açılsın":"Open it with one tap, like an app",
    "Ana Ekrana Ekle":"Add to Home Screen",

    // Takvim
    "Bugün":"Today", "Giriş":"Check-in", "Çıkış":"Check-out",
    "Giriş saati":"Check-in time", "Çıkış saati":"Check-out time",
    "Fiyat gir":"Set prices", "Fiyat modu":"Price mode", "Fiyat belirle":"Set price",
    "Fiyatı uygula":"Apply price", "Tüm ay":"Whole month", "Fiyatlar":"Prices",
    "Gecelik fiyat":"Nightly rate", "Bu günlerin fiyatını sil":"Clear price for these days",
    "Kayıtlı rezervasyon yok":"No reservations yet",
    "Henüz rezervasyon yok. Takvimden tarih aralığı seçerek başlayın.":
      "No reservations yet. Start by selecting a date range on the calendar.",
    "Rezervasyonlar":"Reservations", "Villa bilgileri":"Villa details",
    "Bakıcılar":"Caretakers", "Misafirler":"Guests", "Gelir & gider":"Income & expenses",
    "Villayı sil":"Delete villa", "Villa sayfası":"Villa page",

    // Rezervasyon
    "Yeni rezervasyon":"New reservation", "Rezervasyonu kaydet":"Save reservation",
    "Rezervasyonu düzenle":"Edit reservation", "Rezervasyonu sil":"Delete reservation",
    "Ad soyad":"Full name", "Kaç kişi":"Number of guests", "Telefon":"Phone",
    "Not":"Note", "İsteğe bağlı":"Optional", "Kim gelecek?":"Who is coming?",
    "Konaklama tutarı (₺)":"Accommodation total (₺)", "İndirim (₺)":"Discount (₺)",
    "Ön ödeme (%)":"Prepayment (%)", "Ön ödeme (₺)":"Prepayment (₺)",
    "Alınan / kapora (₺)":"Received / deposit (₺)",
    "İkisinden birini yazmanız yeter, diğeri kendiliğinden hesaplanır.":
      "Fill in either one; the other is calculated automatically.",
    "Ad soyad boş olamaz.":"Name cannot be empty.",
    "Tarihleri seçin.":"Please select dates.",
    "Çıkış tarihi girişten sonra olmalı.":"Check-out must be after check-in.",
    "En az bir gecelik seçim yapın.":"Select at least one night.",
    "En az bir gecelik seçim yapın: giriş ve çıkış günü farklı olmalı.":
      "Select at least one night: check-in and check-out must differ.",
    "Giriş günü seçtiğiniz günün akşamı dolu.":"That check-in day is already booked for the evening.",
    "Çıkış günü seçtiğiniz günün sabahı dolu.":"That check-out day is already booked in the morning.",
    "Seçtiğiniz aralıkta dolu gün var.":"There is a booked day in the selected range.",
    "O gün tamamen dolu, başka bir çıkış günü seçin.":"That day is fully booked; choose another check-out day.",
    "Bu günde iki rezervasyon var":"Two reservations on this day",
    "Hangisini açmak istersiniz?":"Which one would you like to open?",
    "Akşam giriş":"Evening check-in", "Sabah çıkış":"Morning check-out",
    "Rezervasyon güncellendi.":"Reservation updated.",
    "Tarihleri değiştirirseniz takvim güncellenir. Alınan ödemeler korunur.":
      "Changing the dates updates the calendar. Payments already received are kept.",
    "Boş güne dokunup tarih seçin. Dolu güne dokununca rezervasyon açılır.":
      "Tap a free day to pick dates. Tap a booked day to open the reservation.",
    "Çıkış gününü seçin":"Select the check-out day",
    "Rezervasyon formu (PDF)":"Reservation form (PDF)",
    "Villa şu anda başkası tarafından düzenleniyor.":"Someone else is editing this villa right now.",

    // Ödeme
    "Ödeme al / güncelle":"Take / update payment", "Ödeme al":"Take payment",
    "Alınan tutar (₺)":"Amount received (₺)", "Alınan ödemeler":"Payments received",
    "Alınan":"Received", "Alınan tutarı girin.":"Enter the amount received.",
    "Bu ödemeyi sil":"Delete this payment", "Ödeme silindi.":"Payment deleted.",
    "Konaklama":"Accommodation", "Kısa konaklama ücreti":"Short-stay fee",
    "İndirim":"Discount", "Ara toplam":"Subtotal", "Toplam":"Total",
    "Hasar depozitosu":"Damage deposit", "Girişte alınacak":"Due at check-in",
    "Depozito alındı":"Deposit received", "Depozito tutarı (₺)":"Deposit amount (₺)",
    "Alınma tarihi":"Date received",
    "Hasar depozitosu girişte alınır, hasar yoksa çıkışta iade edilir.":
      "The damage deposit is collected at check-in and refunded at check-out if there is no damage.",
    "Hasar depozitosu, hasar bulunmaması hâlinde çıkışta iade edilir.":
      "The damage deposit is refunded at check-out if no damage is found.",

    // Kasa
    "Gelir ve gider":"Income and expenses", "Ay":"Month", "Yıl":"Year", "Tümü":"All",
    "Tahsil edilen":"Collected", "Bekleyen":"Outstanding", "Gider":"Expenses", "Net":"Net",
    "Gelir":"Income", "Gelir ekle":"Add income", "Gider ekle":"Add expense",
    "Açıklama":"Description", "Tutar (₺)":"Amount (₺)", "Tarih":"Date",
    "Açıklama ve tutar girin.":"Enter a description and an amount.",
    "Diğer gelir ve giderler":"Other income and expenses", "Diğer gelirler":"Other income",
    "Giderler":"Expenses", "Kaydı sil":"Delete record", "Fiş / fatura":"Receipt / invoice",
    "Fotoğraf ekle":"Add photo", "Sezon özeti":"Season summary", "Doluluk":"Occupancy",
    "Gecelik ortalama":"Average per night", "En yoğun ay":"Busiest month",
    "Geçen yıla göre":"vs. last year", "Tekrar gelen":"Returning",
    "Dönem raporunu indir (PDF)":"Download period report (PDF)",
    "GELİR VE GİDER RAPORU":"INCOME AND EXPENSE REPORT",
    "Toplam tahsil edilen":"Total collected",
    "Villa Takvim ile hazırlanmıştır.":"Prepared with Villa Takvim.",
    "Rapor oluşturulamadı.":"Could not create the report.",
    "Henüz veri yok.":"No data yet.",

    // Misafirler
    "Misafir defteri":"Guest book", "Tekrar gelen":"Returning", "Geçen yıl":"Last year",
    "İsim veya telefon ara":"Search name or phone", "Konaklama geçmişi":"Stay history",
    "Teklif gönder":"Send an offer", "Toplu teklif":"Bulk offer", "Seç":"Select",
    "Göndermeye başla":"Start sending", "Misafir notu":"Guest note",
    "Kayıtlı misafir yok.":"No saved guests yet.",

    // Paylaşım
    "Villa sayfası oluştur":"Create villa page", "Linki paylaş":"Share the link",
    "Paylaşımı kaldır":"Remove the page", "Villa sayfasını aç":"Open villa page",
    "Fotoğraf · takvim · fiyat":"Photos · calendar · prices",
    "Bağlantı kopyalandı.":"Link copied.",
    "Bağlantı kopyalandı, mesaja yapıştırın.":"Link copied — paste it into your message.",
    "Misafirlerinizin fotoğrafları, boş günleri ve fiyatları görüp size WhatsApp'tan istek gönderebileceği bir sayfa oluşturur.":
      "Creates a page where guests can see photos, availability and prices, and send you a request on WhatsApp.",

    // Villa bilgileri
    "Konum":"Location", "Ev sahibi adı soyadı":"Owner's full name",
    "Kaç kişilik":"Capacity", "Yatak odası":"Bedrooms", "Banyo":"Bathrooms",
    "Büyüklük (m²)":"Size (m²)", "Tanıtım yazısı":"Description",
    "Öne çıkan özellikler":"Highlights", "Ev olanakları":"Amenities",
    "Oda ve banyo bilgileri":"Rooms and bathrooms", "Havuz ölçüsü":"Pool size",
    "Havuz derinliği":"Pool depth", "Yakınlarda ne var (km)":"What's nearby (km)",
    "Konum bağlantısı":"Location link", "Ev kuralları":"House rules",
    "Sigara":"Smoking", "Evcil hayvan":"Pets", "Parti / kalabalık misafir":"Parties / large groups",
    "Su bedeli fiyata dahil":"Water included in the price",
    "Elektrik bedeli fiyata dahil":"Electricity included in the price",
    "Hasar depozitosu (₺)":"Damage deposit (₺)", "Ön ödeme oranı (%)":"Prepayment rate (%)",
    "WhatsApp numarası":"WhatsApp number", "Kısa konaklama":"Short stays",
    "Ayarlar kaydedildi.":"Settings saved.",
    "Misafir sayfasında ve rezervasyon hesabında ön ödeme bu orandan hesaplanır.":
      "Prepayment is calculated from this rate on the guest page and in reservation totals.",

    // Hesap / giriş
    "Giriş yap":"Sign in", "Hesap oluştur":"Create account",
    "Hesabım yok, oluştur":"I don't have an account", "Zaten hesabım var":"I already have an account",
    "Şifremi unuttum":"Forgot my password", "Çıkış yap":"Sign out",
    "E-posta":"Email", "Şifre":"Password", "Yeni şifre":"New password", "Tekrar":"Repeat",
    "En az 6 karakter":"At least 6 characters", "Şifreyi kaydet":"Save password",
    "Yeni şifre belirleyin":"Set a new password",
    "Hesabınız için yeni bir şifre yazın.":"Enter a new password for your account.",
    "Şifre en az 6 karakter olmalı.":"Password must be at least 6 characters.",
    "İki şifre aynı değil.":"The two passwords do not match.",
    "Geçerli bir e-posta yazın.":"Enter a valid email address.",
    "E-posta veya şifre hatalı.":"Incorrect email or password.",
    "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.":"This email is already registered. Try signing in.",
    "Şifreniz güncellendi.":"Your password has been updated.",
    "Bağlantı gönderildi":"Link sent",
    "Bilgilerim":"My details", "Bilgilerimi kaydet":"Save my details",
    "Adınız ve soyadınız":"Your full name", "Bilgilerinizi tamamlayın":"Complete your details",
    "Bir sorun olduğunda size ulaşabilmemiz için. Misafirlerinizle paylaşılmaz.":
      "So we can reach you if there is a problem. Never shared with your guests.",
    "Bilgileriniz kaydedildi.":"Your details have been saved.",
    "Verilerimi indir":"Download my data", "Verileriniz indirildi.":"Your data has been downloaded.",
    "Hesabımı kalıcı olarak sil":"Permanently delete my account",
    "Gizlilik ve kişisel veriler":"Privacy and personal data",
    "Hesabınız onay bekliyor":"Your account is awaiting approval",
    "Erişiminiz durduruldu":"Your access has been suspended",
    "Durumu yenile":"Check status",
    "Hesabınız henüz onaylanmadı.":"Your account has not been approved yet.",
    "Gizlilik metnini okudum, kişisel verilerin burada anlatıldığı şekilde işlenmesini kabul ediyorum.":
      "I have read the privacy notice and agree to my personal data being processed as described.",
    "Devam etmek için gizlilik metnini onaylayın.":"Please accept the privacy notice to continue.",
    "Çıkış yapıldı, cihazdaki kayıtlar temizlendi.":"Signed out; local records cleared.",

    // Bildirim
    "Bildirimler":"Notifications",
    "Giriş, çıkış ve tahsilat hatırlatmaları":"Check-in, check-out and payment reminders",
    "Bir gün önce ve o gün sabahı":"One day before and on the day",
    "Bildirimler açıldı.":"Notifications enabled.", "Bildirimler kapatıldı.":"Notifications disabled.",
    "Kapalı.":"Off.", "Açık. Uygulama kapalıyken de hatırlatma alırsınız.":
      "On. You will get reminders even when the app is closed.",
    "Bu tarayıcı bildirimi desteklemiyor.":"This browser does not support notifications.",
    "Uygulama bildirimleri bir sonraki sürümde geliyor.":"App notifications are coming in the next version.",

    // Villa sayfası önizleme, iptal / geri al, form uyarısı
    "Yayınla":"Publish", "Villa bilgilerini doldur":"Fill in villa details",
    "Boş günler ve fiyatlar":"Free days and prices",
    "Yayınlayınca bir bağlantı oluşur. Bu bağlantıyı gönderdiğiniz kişi şunları görür:":
      "Publishing creates a link. Anyone you send it to will see:",
    "Henüz fotoğraf yok. Fotoğrafsız sayfa misafire boş görünür.":
      "No photos yet. Without photos the page looks empty to guests.",
    "Villa bilgileri yarım (konum, kişi sayısı, açıklama, WhatsApp…).":
      "Villa details are incomplete (location, guests, description, WhatsApp…).",
    "Önümüzdeki günler için fiyat girilmemiş.":"No prices have been entered for the coming days.",
    "Rezervasyon iptal edildi.":"Reservation cancelled.", "Geri al":"Undo",
    "Rezervasyon geri alındı.":"Reservation restored.",
    "Misafir adını yazın":"Enter the guest's name",
    "· tutar girilmedi":"· no amount entered",

    // Alt sekmeler, Takvim sekmesi, telefon, onay ekranı
    "Villanızı hazırlayın":"Get your villa ready", "Gecelik fiyat gir":"Enter nightly prices",
    "Villa sayfasını paylaş":"Share the villa page", "+ Rezervasyon":"+ Reservation",
    "Rezervasyon":"Reservation", "Gizle":"Hide", "Kart gizlendi.":"Card hidden.",
    "Aylar":"Months", "Günler":"Days", "Fiyat yok":"No price", "Tüm aya uygula":"Apply to whole month",
    "Uygula":"Apply", "Hafta sonu farklı fiyat":"Different weekend price",
    "Cuma ve Cumartesi geceleri":"Friday and Saturday nights", "₺ / gece":"₺ / night",
    "Hafta sonu fiyatını girin.":"Enter the weekend price.",
    "Güne dokunun. Sonra başka bir güne dokunursanız arası seçilir. Tek tek eklemek için basılı tutun.":"Tap a day. Tap another day to select the days in between. Press and hold to add single days.",
    "Bu ay gelir":"Income this month", "Sonraki giriş":"Next check-in",
    "Giriş/çıkış":"Check-in/out", "Boş günleri paylaş":"Share free days", "Dolu":"Booked", "Boş":"Free",
    "Giriş gününe dokunun.":"Tap the check-in day.",
    "Villalar":"Villas", "Takvim":"Calendar", "Hesap":"Account", "Ara":"Call", "Yedek":"Backup",
    "Yarın":"Tomorrow", "Ana menü":"Main menu",
    "Tüm villaların önümüzdeki 30 gündeki giriş ve çıkışları":"Check-ins and check-outs for all villas in the next 30 days",
    "Önümüzdeki 30 günde giriş veya çıkış yok.":"No check-ins or check-outs in the next 30 days.",
    "Henüz villa yok. Aşağıdan ilk villanızı ekleyin.":"No villas yet. Add your first villa below.",
    "Hesabınız genellikle 24 saat içinde onaylanır. Acele ediyorsanız bize WhatsApp'tan yazın.":
      "Accounts are usually approved within 24 hours. In a hurry? Message us on WhatsApp.",
    "WhatsApp'tan bize yazın":"Message us on WhatsApp",

    // Uyarı paneli ve dosya paylaşımı
    "Anladım":"OK", "Dosya paylaşılamadı.":"The file could not be shared.",
    "Gecelik fiyat girin.":"Enter a nightly price.",
    "Bu cihazda fotoğraf için yer kalmadı. Villa fotoğrafsız eklendi.":
      "There is no room left for photos on this device. The villa was added without a photo.",
    "Fiş fotoğrafı kaydedilemedi, hafıza dolu. Kayıt fotoğrafsız eklendi.":
      "The receipt photo could not be saved, storage is full. The entry was added without a photo.",
    "Bu cihazda fotoğraf için yer kalmadı. Giriş yaparsanız fotoğraflar buluta yüklenir ve sınır kalkar.":
      "There is no room left for photos on this device. If you sign in, photos are uploaded to the cloud and the limit goes away.",
    "Project URL https:// ile başlamalı.":"Project URL must start with https://.",
    "Anahtarı eksiksiz yapıştırın.":"Paste the full key.",
    "Bu gizli anahtar. sb_publishable_ ile başlayan anahtarı kullanın.":
      "This is a secret key. Use the key that starts with sb_publishable_.",
    "Dosya okunamadı. Yedek dosyasını seçtiğinizden emin olun.":
      "The file could not be read. Make sure you selected the backup file.",

    // Bakıcı / davet
    "Bakıcı ekle":"Add caretaker", "Davet et":"Invite", "Davet kodu":"Invite code",
    "Yeni bakıcı davet et":"Invite a new caretaker", "Davet kodu oluştur":"Create invite code",
    "Bakıcıya gönder":"Send to caretaker", "Kodu kopyala":"Copy code",
    "7 gün geçerli, tek kullanımlık":"Valid for 7 days, single use",
    "Villaya katıl":"Join villa", "Henüz bakıcı yok.":"No caretakers yet.",
    "Erişimi kaldır":"Remove access", "Erişim kaldırıldı.":"Access removed.",
    "Erişim kaldırılsın mı?":"Remove access?", "Evet, kaldır":"Yes, remove",
    "Villa sahibi":"Villa owner", "bakıcı":"caretaker",

    // Yönetici
    "Onay bekleyen hesaplar":"Accounts awaiting approval", "Bekleyen":"Pending",
    "Askıda":"Suspended", "Aktif":"Active", "Yönetici":"Administrator",
    "Onay bekliyor":"Awaiting approval", "Villalar":"Villas",
    "Erişebildiği villalar":"Villas they can access", "kaldırılamaz":"cannot be removed",
    "Hesap silinsin mi?":"Delete this account?", "Evet, sil":"Yes, delete",
    "Hesap onaylandı.":"Account approved.", "Hesap silindi.":"Account deleted.",
    "Erişim açıldı.":"Access enabled.", "Erişim durduruldu.":"Access suspended.",
    "Bu listede kimse yok.":"Nobody in this list.",
    "İsim veya e-posta ara":"Search name or email",
    "Telefon kayıtlı değil.":"No phone number on file.",
    "Destek için villaya gir":"Enter villa for support", "Kullanıcıya dön":"Back to user",
    "Destek modu":"Support mode",
    "Misafir bilgileri, ödemeler ve gelir kayıtları bu ekranda gösterilmez.":
      "Guest details, payments and income records are not shown on this screen.",

    // Fotoğraf
    "Fotoğraflar":"Photos", "Fotoğraf":"Photo", "Fotoğraf seç":"Choose photo",
    "Fotoğrafı sil":"Delete photo", "Fotoğrafı değiştir":"Replace photo",
    "Evet, fotoğrafı sil":"Yes, delete the photo", "Fotoğraflar yükleniyor":"Uploading photos",
    "fotoğraf eklendi.":"photos added.",

    // Taşıma / yedek
    "Telefonunuzdaki kayıtlar":"Records on this phone", "Hesabıma taşı":"Move to my account",
    "Şimdi değil":"Not now", "Kayıtlarınız hesabınıza taşındı.":"Your records have been moved to your account.",
    "Yedek alındı.":"Backup created.", "Yedek geri yüklendi.":"Backup restored.",

    // Hatalar
    "Buluta kaydedilemedi":"Could not save to the cloud",
    "Değişiklikleriniz bu cihazda duruyor, kaybolmadı. Sunucunun verdiği yanıt:":
      "Your changes are still on this device and are not lost. The server responded:",
    "Bağlantı kurulamadı":"Could not connect", "Bağlantı kurulamadı.":"Could not connect.",
    "Oturumunuzun süresi dolmuş. Tekrar giriş yapın.":"Your session has expired. Please sign in again.",
    "Yetkiniz yok":"You do not have permission",
    "Bu bağlantı artık geçerli değil.":"This link is no longer valid."
  };

  // ---------- kalıplı metinler ----------
  function goreli(t){
    if (t === "bugün") return "today";
    if (t === "yarın") return "tomorrow";
    var m = /^(\d+) gün sonra$/.exec(t);
    return m ? "in " + m[1] + " days" : t;
  }
  var GORELI = "(bugün|yarın|\\d+ gün sonra)";

  var K = [
    [/^· kalan (.+)$/, "· balance $1"],
    [/^Bu ay (\d+) gece boş$/, "$1 free nights this month"],
    [/^(\d+) ay seçildi$/, "$1 months selected"],
    [/^(\d+) gün seçildi$/, "$1 days selected"],
    [/^(\d+) gün fiyatsız$/, "$1 days without a price"],
    [/^(\d+) ay için gecelik fiyat$/, "Nightly price for $1 months"],
    [/^(\d+) gün için gecelik fiyat$/, "Nightly price for $1 days"],
    [/^(.+) için gecelik fiyat$/, "Nightly price for $1"],
    [/^(\d+) aya uygula$/, "Apply to $1 months"],
    [/^(\d+) gün (.+) yapıldı$/, "$1 days set to $2"],
    [/^(\d+) gün fiyatlandı · hafta içi (.+), hafta sonu (.+)$/, "$1 days priced · weekdays $2, weekends $3"],
    [/^(\d+) günün fiyatı silindi$/, "Prices removed for $1 days"],
    [/^([\d.,]+) ₺ \/ gece$/, "$1 ₺ / night"],
    [/^(\d+) gün$/, "$1 days"],
    [/^(\d+) \/ (\d+) gece$/, "$1 of $2 nights"],
    [/^Giriş (\d+:\d+) · (.+)$/, "Check-in $1 · $2"],
    [/^Çıkış (\d+:\d+) · (.+)$/, "Check-out $1 · $2"],
    [/^(Bugün|Yarın) · (.+)$/, function (_, a, b) { return (a === "Bugün" ? "Today" : "Tomorrow") + " · " + b; }],
    [/^(Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar) · (.+)$/, function (_, a, b) {
      var g = {"Pazartesi":"Monday","Salı":"Tuesday","Çarşamba":"Wednesday","Perşembe":"Thursday","Cuma":"Friday","Cumartesi":"Saturday","Pazar":"Sunday"};
      return g[a] + " · " + b; }],
    [/^Alınan (.+₺)$/, "Received $1"],
    [/^(\d+) konaklama · son (.+)$/, "$1 stays · last $2"],
    [/^(\d+) konaklama · sıradaki (.+)$/, "$1 stays · next $2"],
    [/^Bugün dolu · (.+)$/, "Occupied today · $1"],
    [/^Bugün giriş · (.+)$/, "Check-in today · $1"],
    [/^Bugün çıkış · (.+)$/, "Check-out today · $1"],
    [/^Bugün (.+) çıkıyor, (.+) giriyor$/, "Today $1 checks out, $2 checks in"],
    [new RegExp("^Çıkış (.+) \\(" + GORELI + "\\)$"),
      function (_, a, b) { return "Check-out " + a + " (" + goreli(b) + ")"; }],
    [new RegExp("^Sıradaki: (.+) \\(" + GORELI + "\\)$"),
      function (_, a, b) { return "Next: " + a + " (" + goreli(b) + ")"; }],
    [/^Bugün (\d+:\d+) giriş yaptı · çıkış (.+)$/, "Checked in today at $1 · check-out $2"],
    [/^(\d+) gece$/, "$1 nights"],
    [/^(\d+) gece · (.+)$/, "$1 nights · $2"],
    [/^(\d+) kişi$/, "$1 guests"],
    [/^(\d+) kişi seçildi$/, "$1 guests selected"],
    [/^(\d+) villa$/, "$1 villas"],
    [/^(\d+) villada sahip$/, "owner of $1"],
    [/^(\d+) villada bakıcı$/, "caretaker of $1"],
    [/^(\d+) bakıcı$/, "$1 caretakers"],
    [/^(\d+) kişi$/, "$1 people"],
    [/^(\d+) rezervasyon$/, "$1 reservations"],
    [/^(\d+) konaklama$/, "$1 stays"],
    [/^(\d+) fotoğraf$/, "$1 photos"],
    [/^(\d+) adet$/, "$1 items"],
    [/^(\d+) kayıt$/, "$1 records"],
    [/^(\d+) yatak odası$/, "$1 bedrooms"],
    [/^(\d+) banyo$/, "$1 bathrooms"],
    [/^(\d+) gün$/, "$1 days"],
    [/^Ön ödeme \(%(\d+)\)$/, "Prepayment ($1%)"],
    [/^Bugün (\d+:\d+) giriş$/, "Check-in today at $1"],
    [/^Bugün (\d+:\d+) çıkış$/, "Check-out today at $1"],
    [/^Yarın (\d+:\d+) giriş$/, "Check-in tomorrow at $1"],
    [/^Yarın (\d+:\d+) çıkış$/, "Check-out tomorrow at $1"],
    [/^Tahsil edilecek$/, "To be collected"],
    [/^Villa dolu · (.+)$/, "Occupied · $1"],
    [/^Sıradaki: (.+)$/, "Next: $1"],
    [/^Giriş (\d+:\d+) · Çıkış (\d+:\d+)$/, "Check-in $1 · Check-out $2"],
    [/^Doluluk$/, "Occupancy"],
    [/^(\d+) onay bekliyor$/, "$1 awaiting approval"],
    [/^Konaklama · (\d+) gece$/, "Accommodation · $1 nights"],
    [/^(\d+) \/ (\d+) gün dolu$/, "$1 of $2 days booked"],
    [/^(\d+) villa · bugün (\d+) dolu, (\d+) boş$/, "$1 villas · today $2 occupied, $3 free"],
    [/^(\d+) kayıt · (\d+) misafir$/, "$1 records · $2 guests"],
    [/^(\d+) misafir · (\d+) kişi tekrar geldi$/, "$1 guests · $2 returning"],
    [/^(.+) için fiyat girilmemiş$/, "No prices set for $1"],
    [/^(\d+) nights · (\d+) kişi$/, "$1 nights · $2 guests"],
    [/^(.+) · (\d+) gece$/, "$1 · $2 nights"],
    [/^· gün aralığı seçin$/, "· select a date range"],
    [/^Çıkışta (.+) depozito iade edilir \(hasar yoksa\)\.$/,
      "$1 deposit is refunded at check-out (if there is no damage)."],
    [/^(\d+)% · (\d+) \/ (\d+) gece$/, "$1% · $2 of $3 nights"],
    [/^Boş güne dokunup tarih seçin\. Dolu güne dokununca rezervasyon açılır\. Giriş (\d+:\d+), çıkış (\d+:\d+)\.$/,
      "Tap a free day to pick dates. Tap a booked day to open the reservation. Check-in $1, check-out $2."],
    [/^Her satıra bir oda yazın\. Örn:/, "Write one room per line. For example:"]
  ];

  function bosluksuz(t){ return String(t).replace(/\s+/g, " ").trim(); }

  D.cevir = function (metin) {
    if (!D.ingilizce()) return metin;
    var t = String(metin);
    var kirp = t.trim();
    if (!kirp) return metin;
    if (S[kirp]) return t.replace(kirp, S[kirp]);
    var tek = bosluksuz(kirp);
    if (S[tek]) return S[tek];
    for (var i = 0; i < K.length; i++) {
      if (K[i][0].test(kirp)) return t.replace(kirp, kirp.replace(K[i][0], K[i][1]));
    }
    return metin;
  };

  // ---------- DOM üzerinde uygula ----------
  function dugumCevir(n) {
    if (n.nodeType === 3) {
      var y = D.cevir(n.nodeValue);
      if (y !== n.nodeValue) n.nodeValue = y;
      return;
    }
    if (n.nodeType !== 1) return;
    var etiket = n.tagName;
    if (etiket === "SCRIPT" || etiket === "STYLE") return;
    ["placeholder", "aria-label", "title"].forEach(function (a) {
      var v = n.getAttribute && n.getAttribute(a);
      if (v) { var y2 = D.cevir(v); if (y2 !== v) n.setAttribute(a, y2); }
    });
    for (var c = n.firstChild; c; c = c.nextSibling) dugumCevir(c);
  }

  D.uygula = function (kok) {
    if (!D.ingilizce()) return;
    dugumCevir(kok || document.body);
  };

  D.izle = function () {
    if (!D.ingilizce() || !window.MutationObserver) return;
    var g = new MutationObserver(function (kayitlar) {
      kayitlar.forEach(function (k) {
        for (var i = 0; i < k.addedNodes.length; i++) dugumCevir(k.addedNodes[i]);
        if (k.type === "characterData" && k.target) dugumCevir(k.target);
      });
    });
    g.observe(document.body, { childList: true, subtree: true, characterData: true });
    D.uygula(document.body);
  };

  D.ayarla = function (yeni) {
    D.dil = yeni;
    try { localStorage.setItem(ANAHTAR, yeni); } catch (e) {}
    location.reload();
  };

  window.DIL = D;
})();
