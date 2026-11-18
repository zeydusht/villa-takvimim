// deno test supabase/functions/takvim-esitle/guvenlik_test.ts
import { adresKontrol, ozelIpMi, ipMi, guvenliGetir, BOYUT_SINIRI } from "../_shared/guvenlik.ts";
import { esit, dogru, hataVerir } from "../_shared/test_yardim.ts";

const ICS = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n";
const disIp = async (_h: string) => ["93.184.216.34"];
const cevap = (govde: string | Uint8Array, durum = 200, bas: Record<string, string> = {}) =>
  new Response(govde, { status: durum, headers: bas });

Deno.test("adres: yalnız https, IP ve yerel adres yok", async () => {
  await hataVerir(() => adresKontrol("http://www.airbnb.com/calendar/ical/1.ics"), "https");
  await hataVerir(() => adresKontrol("https://127.0.0.1/x.ics"), "ip");
  await hataVerir(() => adresKontrol("https://169.254.169.254/latest/meta-data"), "ip");
  await hataVerir(() => adresKontrol("https://[::1]/x.ics"), "ip");
  await hataVerir(() => adresKontrol("https://10.0.0.5/x.ics"), "ip");
  await hataVerir(() => adresKontrol("https://2130706433/x.ics"), "ip");
  await hataVerir(() => adresKontrol("https://0x7f000001/x.ics"), "ip");
  await hataVerir(() => adresKontrol("https://localhost/x.ics"), "yerel");
  await hataVerir(() => adresKontrol("https://router.local/x.ics"), "yerel");
  await hataVerir(() => adresKontrol("https://intranet/x.ics"), "yerel");
  await hataVerir(() => adresKontrol("https://user:pw@www.airbnb.com/x.ics"), "adres");
  await hataVerir(() => adresKontrol("https://www.airbnb.com:8443/x.ics"), "port");
  await hataVerir(() => adresKontrol("javascript:alert(1)"), "https");
  await hataVerir(() => adresKontrol("bu bir link değil"), "adres");
  esit(adresKontrol("https://www.airbnb.com/calendar/ical/123.ics?s=abc").hostname, "www.airbnb.com");
  esit(adresKontrol("https://admin.booking.com/hotel/hoteladmin/ical.html?t=x").hostname, "admin.booking.com");
});

Deno.test("özel ağ adresleri", () => {
  for (const ip of ["10.1.2.3", "172.16.0.1", "172.31.255.255", "192.168.1.1", "169.254.169.254", "127.0.0.1", "0.0.0.0", "100.64.0.1",
    "::1", "::", "fc00::1", "fd12:3456::1", "fe80::1", "::ffff:127.0.0.1", "::ffff:10.0.0.1", "224.0.0.1", "300.1.1.1"]) dogru(ozelIpMi(ip), ip + " özel sayılmalı");
  for (const ip of ["93.184.216.34", "8.8.8.8", "172.15.0.1", "172.32.0.1", "2606:4700::6810:85e5"]) dogru(!ozelIpMi(ip), ip + " genel sayılmalı");
  dogru(ipMi("[::1]") && ipMi("1.2.3.4") && !ipMi("www.airbnb.com"), "ipMi");
});

Deno.test("ad çözümlenince özel adres çıkarsa reddedilir (DNS ile iç ağa yönlendirme)", async () => {
  await hataVerir(() => guvenliGetir("https://kotu.example.com/x.ics", { cozumle: async () => ["10.0.0.7"], getir: async () => cevap(ICS) }), "ozel");
  await hataVerir(() => guvenliGetir("https://kotu.example.com/x.ics", { cozumle: async () => ["93.184.216.34", "::1"], getir: async () => cevap(ICS) }), "ozel");
});

Deno.test("yönlendirme: her adımda aynı kontrol, en fazla 3", async () => {
  // http'ye yönlendirme
  await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp,
    getir: async () => cevap("", 302, { location: "http://a.example.com/y.ics" }) }), "https");
  // iç ağa yönlendirme
  await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp,
    getir: async () => cevap("", 301, { location: "https://169.254.169.254/latest" }) }), "ip");
  // 3 yönlendirme geçer, 4. reddedilir
  let n = 0;
  const zincir = (sinir: number) => async (u: string | URL | Request) => {
    n++; return n <= sinir ? cevap("", 302, { location: "/a" + n + ".ics" }) : cevap(ICS);
  };
  n = 0; esit((await guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: zincir(3) as typeof fetch })).durum, 200);
  n = 0; await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: zincir(4) as typeof fetch }), "yonlendirme");
});

Deno.test("boyut sınırı 2 MB, takvim olmayan dosya, 304, durum kodları", async () => {
  const buyuk = new Uint8Array(BOYUT_SINIRI + 10).fill(65);
  await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: async () => cevap(buyuk) }), "buyuk");
  await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: async () => cevap("x", 200, { "content-length": String(BOYUT_SINIRI + 1) }) }), "buyuk");
  await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: async () => cevap("<html>giriş yapın</html>") }), "bicim");
  await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: async () => cevap("", 404) }), "yok");
  await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: async () => cevap("", 403) }), "izin");
  await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: async () => cevap("", 503) }), "sunucu");
  let gelen: Record<string, string> = {};
  const r = await guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, basliklar: { "If-None-Match": '"e1"' },
    getir: (async (_u: string, o: RequestInit) => { gelen = o.headers as Record<string, string>; return cevap(null as unknown as string, 304, { etag: '"e1"' }); }) as unknown as typeof fetch });
  esit([r.durum, r.etag, gelen["If-None-Match"]], [304, '"e1"', '"e1"']);
  const t = await guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: async () => cevap(ICS, 200, { etag: '"e2"' }) });
  esit([t.durum, t.etag, t.metin.startsWith("BEGIN:VCALENDAR")], [200, '"e2"', true]);
});

Deno.test("süre sınırı (8 sn; testte 60 ms)", async () => {
  const yavas = ((_u: string, o: RequestInit) => new Promise((_z, red) => {
    o.signal!.addEventListener("abort", () => red(new Error("abort")));
  })) as unknown as typeof fetch;
  const m = await hataVerir(() => guvenliGetir("https://a.example.com/x.ics", { cozumle: disIp, getir: yavas, sure: 60 }), "sure");
  esit(m, "Site 8 saniyede cevap vermedi.");
});
