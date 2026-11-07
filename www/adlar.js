// Yaygın Türkçe adlar: misafire hitap ("Hasan Bey", "Beyza Hanım") için cinsiyet tahmini.
// Hem erkek hem kadın adı olabilen adlar (Deniz, Umut, Ümit, Özgür, Evren, Bilge, Doğa, Kader…) bilerek listede YOK:
// onlar için sadece ad kullanılır. Tahmin yanlışsa misafir kartından "Bey / Hanım / Sadece ad" seçilir.
(function () {
  var ERKEK = ("Abdullah Abdulkadir Abdurrahman Adem Adil Adnan Ahmet Akif Akın Alaattin Alattin Ali Alican Alp Alparslan Alper Alptekin " +
    "Arda Arif Arslan Asaf Aslan Atakan Atilla Avni Ayhan Aykut Aytekin Azat Aziz Bahadır Bahri Baki Barış Batuhan Battal Bayram " +
    "Bedir Bekir Berat Berkay Berk Berkan Bilal Bora Burak Burhan Bülent Caner Cafer Can Celal Cem Cemal Cemil Cengiz Cenk Cevdet " +
    "Cihan Cihat Coşkun Cumali Cüneyt Çağan Çağatay Çağlar Çağrı Çetin Davut Doğan Doğukan Dursun Ebubekir Ecevit Efe Ekrem Emin " +
    "Emir Emirhan Emre Ender Enes Engin Ensar Enver Eray Erdal Erdem Erdinç Erdoğan Eren Ergün Erhan Erkan Erol Ersin Ertan Ertuğrul " +
    "Ercan Esat Eyüp Fadıl Fahri Faik Faruk Fatih Fehmi Ferdi Feridun Ferhat Ferit Fethi Fevzi Fikret Fuat Furkan Gani Gökay Gökhan " +
    "Gökmen Görkem Güven Hakan Hakkı Halil Halis Haluk Hamdi Hamza Harun Hasan Haşim Hayati Haydar Hikmet Hilmi Hüseyin Hulusi " +
    "Ibrahim İbrahim İhsan İlhan İlker İlyas İrfan İsa İshak İskender İsmail İsmet İzzet Kaan Kadir Kamil Kâmil Kazım Kemal Kenan " +
    "Kerem Kerim Koray Korkmaz Kubilay Kudret Kutay Kutlu Levent Lütfi Mahir Mahmut Mehmet Mehmetali Melih Mert Mesut Metin Mevlüt " +
    "Mithat Muammer Muhammed Muhammet Muharrem Muhittin Murat Musa Mustafa Muzaffer Mücahit Mümin Necati Necdet Necip Nedim Nevzat " +
    "Nihat Nuri Nurettin Nusret Oğuz Oğuzhan Okan Onur Orhan Osman Ozan Ömer Önder Özcan Özer Özkan Polat Rahmi Ramazan Rasim " +
    "Recep Refik Remzi Reşat Rıdvan Rıza Rüştü Sabri Sadık Sadi Safa Salih Sami Samet Savaş Sedat Selahattin Selami Selçuk Selim " +
    "Semih Sencer Serdar Serhat Serkan Sermet Sezai Sinan Soner Suat Sulhi Süleyman Şahin Şakir Şenol Şevket Şükrü Talat Talha " +
    "Taner Tahir Tamer Tarık Tayfun Tayyar Tekin Temel Tevfik Timur Tolga Tuncay Tuncer Turan Turgay Turgut Tuğrul Uğur Ulaş " +
    "Utku Vahit Vedat Veli Volkan Yahya Yakup Yalçın Yasin Yaşar Yavuz Yener Yiğit Yılmaz Yunus Yusuf Yüksel Zafer Zahit Zeki " +
    "Ziya Zübeyir Aras Ata Ayaz Baran Batu Berkehan Çınar Demir Egemen Eymen Göktuğ Hüsnü Kayra Mirza Ömer Ozgür Poyraz Rüzgar " +
    "Sarp Tuna Toprak Yağız Yusufhan Kuzey Alperen Arif Ekin Erkut Fırat Güray Gürkan Hayri Kurtuluş Mazhar Oktay Oral Orçun " +
    "Recai Rifat Sabahattin Sefa Sezgin Şener Şeref Taha Tufan Uygar Yalın Yücel Zekeriya Hilmi Necmi Nazım Orkun Tamay Tümer").split(" ");
  var KADIN = ("Ayşe Fatma Emine Hatice Zeynep Elif Meryem Şerife Zehra Sultan Hanife Merve Havva Zeliha Esra Fadime Özlem Hacer " +
    "Yasemin Hülya Cemile Sevim Gülsüm Leyla Dilek Büşra Aysel Songül Kübra Rabia Hacer Sibel Ebru Tuba Derya Gamze Seda Sevgi " +
    "Gül Gülay Gülşen Gülten Güler Gönül Nurten Nuran Nurcan Nazlı Nermin Necla Neslihan Nesrin Nihal Nilay Nilüfer Nur Nuray " +
    "Pınar Reyhan Rukiye Saadet Sabiha Saliha Sanem Sedef Sema Semra Serap Serpil Sevda Sevilay Sevinç Sinem Suna Sevil Şahika " +
    "Şengül Şenay Şeyma Şule Şükran Tuğba Tülay Tülin Türkan Ümran Ülkü Yağmur Yeliz Yeşim Yıldız Zerrin Zübeyde Zuhal Zümrüt " +
    "Ahu Ada Aleyna Alev Almila Arzu Asena Asiye Aslı Aslıhan Aybüke Aycan Ayla Aylin Aynur Ayperi Aysun Ayşegül Ayşen Azra " +
    "Bahar Banu Begüm Belgin Belma Berfin Berna Beril Berrak Betül Beyza Bihter Birgül Burcu Buse Cansu Ceren Cemre Canan Cennet " +
    "Damla Defne Demet Dilara Dilan Dilber Didem Duygu Duru Ebrar Ece Ecrin Eda Elçin Elvan Emel Emine Esin Esma Eylül Feride " +
    "Ferda Fidan Figen Filiz Funda Füsun Gizem Gökçe Gülcan Gülden Gülizar Gülnur Gülperi Gülsen Gülseren Gülsüm Hale Halime " +
    "Hande Hazal Hilal Hümeyra Irmak Işıl Işık İclal İlayda İlknur İnci İpek İrem Jale Kader Kadriye Kamile Kevser Kezban Lale " +
    "Lamia Leman Mehtap Melek Melike Melis Meltem Mine Miray Muazzez Mukaddes Müberra Müge Münevver Naciye Nagehan Naile Nalan " +
    "Narin Nazan Nazife Nazmiye Nebahat Necmiye Nehir Nergis Nesibe Neşe Nevin Nihan Nil Nilgün Nisa Nursel Nurhan Oya Öykü " +
    "Özge Özgül Perihan Perver Rana Rengin Rezzan Ruken Rüya Sabriye Safiye Saniye Selda Selen Selin Selma Semiha Senem Serra " +
    "Sevtap Seher Sıla Simge Suzan Süheyla Sümeyye Şebnem Şenel Şeref Tansu Tuana Tuğçe Ufuk Vildan Yaprak Yelda Yonca Zarife " +
    "Zekiye Zühal Zülal Asuman Aynur Bedia Behiye Canan Cahide Dürdane Emel Fazilet Fehime Firdevs Gülbahar Güllü Hamide Hayriye " +
    "Hediye Helin Hicran Hüsniye İlkay Kıymet Kumru Lütfiye Makbule Medine Melahat Meral Mihriban Mualla Muhsine Mürüvvet Nadide " +
    "Nafiya Nazire Necibe Nedime Nefise Nesrin Nevriye Nimet Nuriye Pakize Ruhsar Rümeysa Sabahat Sacide Sakine Selvi Semiye " +
    "Sermin Servet Şaziye Şefika Şehriban Şeyda Tülay Ülfet Vesile Yadigar Yeter Zahide Zarife Zeynep Zişan Elanur Eflin Lina Mira").split(" ");
  // "Kader", "Ufuk", "Şeref", "İlkay", "Servet" iki cinste de kullanılır: kadın listesinden çıkar
  ["Ekin","Tuna","Ozgür"].forEach(function (a) { var i; while ((i = ERKEK.indexOf(a)) >= 0) ERKEK.splice(i, 1); });
  ["Kader","Ufuk","Şeref","İlkay","Servet","Yıldız"].forEach(function (a) { var i; while ((i = KADIN.indexOf(a)) >= 0) KADIN.splice(i, 1); });
  var kucuk = function (s) { return String(s || "").trim().toLocaleLowerCase("tr"); };
  var E = {}, K = {};
  ERKEK.forEach(function (a) { if (a) E[kucuk(a)] = 1; });
  KADIN.forEach(function (a) { if (a) K[kucuk(a)] = 1; });
  // "erkek" | "kadin" | "" (bilinmiyor / iki cinste kullanılan ad)
  window.adCinsiyet = function (ad) {
    var k = kucuk(ad);
    if (E[k] && !K[k]) return "erkek";
    if (K[k] && !E[k]) return "kadin";
    return "";
  };
})();
