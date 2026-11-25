// Görev 27: 5 villalı sahte veri (bugün 16 Kasım 2026 Pazartesi; arama 17–21 Kasım, 4 gece)
const V = ["a1000000-0000-4000-8000-000000000001", "a1000000-0000-4000-8000-000000000002", "a1000000-0000-4000-8000-000000000003",
  "a1000000-0000-4000-8000-000000000004", "a1000000-0000-4000-8000-000000000005"];
const gunler = (a, b) => { const l = []; for (let d = new Date(a + "T12:00:00"); d.toISOString().slice(0, 10) < b; d.setDate(d.getDate() + 1)) l.push(d.toISOString().slice(0, 10)); return l; };
function veri27(ek = {}) {
  const villalar = [
    // boş; kısa konaklama 4 gece ve altı +2.000; yayında sayfa; 21'inde giriş (sınır) → yine boş
    { id: V[0], ad: "Villa Salta", renk: "#0B5B57", bilgi: { konum: "Kalkan", kurulumGizli: true, kapasite: "8", oda: "4", depozito: 5000, kisaSinir: 4, kisaUcret: 2000 },
      paylasim: { ad: "villa-salta-x", yayin: true, imza: "x" }, silindi_tarih: null },
    // boş; 17'sinde çıkış (sınır); sayfa yok
    { id: V[1], ad: "Villa Defne", renk: "#3C4E8C", bilgi: { konum: "Kaş", kurulumGizli: true, kapasite: "6", oda: "3", depozito: 4000 }, silindi_tarih: null },
    // boş ama 19 ve 20 Kasım gecelerinin fiyatı yok
    { id: V[2], ad: "Villa Zeytin", renk: "#7A4B8C", bilgi: { konum: "Kalkan", kurulumGizli: true, kapasite: "4", oda: "2" }, silindi_tarih: null },
    // boş; Kasım–Aralık döneminde en az 5 gece (4 gece → kural engeli)
    { id: V[3], ad: "Villa Lavanta", renk: "#4F6B22", bilgi: { konum: "Kaş", kurulumGizli: true, kapasite: "10", oda: "5", depozito: 8000,
      enAzDonem: [{ bas: "2026-11-01", bit: "2026-12-31", gece: 5 }] },
      paylasim: { ad: "villa-lavanta-x", yayin: true, imza: "x" }, silindi_tarih: null },
    // kısmen boş: 19'unda giriş
    { id: V[4], ad: "Villa Mimoza Deniz Manzaralı", renk: "#9B2C4A", bilgi: { konum: "Kalkan", kurulumGizli: true, kapasite: "6", oda: "3", depozito: 3000 }, silindi_tarih: null }
  ];
  const r = (n, v, a, b, ad) => ({ id: "b2000000-0000-4000-8000-00000000000" + n, villa_id: v, baslangic: a, bitis: b, misafir: ad, kisi: 2, renk: "#3C4E8C" });
  const rezler = [r(1, V[0], "2026-11-21", "2026-11-24", "Hasan Demir"), r(2, V[1], "2026-11-14", "2026-11-17", "Ayşe Yılmaz"),
    r(3, V[4], "2026-11-19", "2026-11-23", "Mehmet Kaya"), r(4, V[3], "2026-11-24", "2026-11-28", "Elif Şahin")];
  const fiyat = [];
  const koy = (v, tutar, atla = []) => gunler("2026-11-01", "2027-01-31").forEach(k => { if (!atla.includes(k)) fiyat.push({ villa_id: v, tarih: k, tutar }); });
  koy(V[0], 4100); koy(V[1], 3800); koy(V[2], 3000, ["2026-11-19", "2026-11-20"]); koy(V[3], 5000); koy(V[4], 4500);
  return Object.assign({ villalar, rezler, fiyatlar: fiyat }, ek);
}
module.exports = { veri27, V };
