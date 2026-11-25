// Görev 29: yönetici sahte sunucu yanıtları
const { veri27 } = require("./veri27.js");
const KUL = [
  { id: "u1", ad: "Deneme Kullanıcı", eposta: "s@o.com", telefon: "05320000000", onay: true, askida: false, yonetici: true, kayit: "2026-09-01T10:00:00Z", villa_sayisi: 5 },
  { id: "a2000000-0000-4000-8000-000000000002", ad: "Ayşe Kaya", eposta: "ayse@ornek.com", telefon: "05321112233", onay: true, askida: false, yonetici: false, kayit: "2026-10-12T10:00:00Z", villa_sayisi: 2 },
  { id: "a2000000-0000-4000-8000-000000000003", ad: "Mehmet Demir", eposta: "mehmet@ornek.com", telefon: "", onay: false, askida: false, yonetici: false, kayit: "2026-11-15T10:00:00Z", villa_sayisi: 0 },
  { id: "a2000000-0000-4000-8000-000000000004", ad: "Hasan Ak", eposta: "hasan@ornek.com", telefon: "05325556677", onay: true, askida: false, yonetici: false, kayit: "2026-08-03T10:00:00Z", villa_sayisi: 7 }
];
const simdi = Date.parse("2026-11-16T10:00:00+03:00");
const once = dk => new Date(simdi - dk * 60000).toISOString();
const SG = [{ kullanici: "u1", son: once(1), platform: "web", surum: "1.0.0" },
  { kullanici: "a2000000-0000-4000-8000-000000000002", son: once(180), platform: "ios", surum: "1.0.0" },
  { kullanici: "a2000000-0000-4000-8000-000000000004", son: once(60 * 24 * 5), platform: "android", surum: "1.0.0" }];
const OZET = { kullanici_toplam: 4, kullanici_onayli: 3, onay_bekleyen: 1, aktif_1g: 2, aktif_7g: 3, aktif_30g: 3, villa_toplam: 14, rez_toplam: 61, rez_30g: 9, teklif_toplam: 6,
  villa_dagilim: { "0": 1, "2": 1, "4+": 2 },
  haftalik_kayit: [{ hafta: "2026-11-09", n: 2 }, { hafta: "2026-10-12", n: 1 }, { hafta: "2026-09-28", n: 3 }],
  en_cok_olay_30g: [{ ad: "ekran_gor", n: 120 }, { ad: "uygulama_ac", n: 40 }, { ad: "rez_ekle", n: 9 }, { ad: "musaitlik_ara", n: 5 }, { ad: "hata", n: 2 }],
  platform_30g: { ios: 1, web: 1, android: 1 },
  huni: { kayit: 4, onay: 3, ilk_villa: 3, ilk_rez: 2 } };
const ETK = [{ zaman: once(10), ad: "rez_ekle", ekran: "villa_takvim", veri: { gece: 4, kisi: 2 }, platform: "ios", surum: "1.0.0" },
  { zaman: once(12), ad: "hata", ekran: "takvim", veri: { tur: "TypeError", yer: "index.html:4012" }, platform: "ios", surum: "1.0.0" },
  { zaman: once(15), ad: "bildirim_izni", ekran: "hesap", veri: { verildi: true }, platform: "ios", surum: "1.0.0" },
  { zaman: once(20), ad: "uygulama_ac", ekran: "villalarim", veri: {}, platform: "ios", surum: "1.0.0" }];
// yonetici: true → sunucu RPC'leri veri döner; false → "Yetkiniz yok" (400)
function veri29(yonetici, kayit) {
  const yetki = (r, govde) => { if (kayit) kayit.push(r.request().url().split("/rpc/")[1]); return yonetici ? { govde } : { govde: { message: "Yetkiniz yok", code: "P0001" }, durum: 400 }; };
  return Object.assign(veri27(), {
    profil: yonetici ? { yonetici: true } : {},
    ozelYol: {
      "rpc/istatistik_ozet": r => yetki(r, OZET),
      "rpc/son_gorulmeler": r => yetki(r, SG),
      "rpc/kullanici_etkinlik_gor": r => yetki(r, ETK),
      "rpc/tum_kullanicilar": r => yetki(r, KUL),
      "rpc/kullanici_villalari": () => ({ govde: [{ villa_id: "v1", villa_ad: "Villa Salta", rol: "sahip" }] })
    }
  });
}
module.exports = { veri29, KUL };
