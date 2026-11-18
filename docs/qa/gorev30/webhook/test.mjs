// abonelik-webhook birim testi: Deno.serve ve fetch taklit edilir
import fs from "fs";
const kaynak = fs.readFileSync(new URL("../../../../supabase/functions/abonelik-webhook/index.ts", import.meta.url), "utf8");
fs.writeFileSync(new URL("./fn.ts", import.meta.url), kaynak);
let isle = null; const ENV = { RC_WEBHOOK_SECRET: "gizli-123", SUPABASE_URL: "https://x.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "srv" };
globalThis.Deno = { serve: f => { isle = f; }, env: { get: k => ENV[k] } };
const DB = {}; const yazilan = [];
globalThis.fetch = async (u, o = {}) => {
  if ((o.method || "GET") === "GET") { const id = /kullanici=eq\.([^&]+)/.exec(u)[1]; return new Response(JSON.stringify(DB[id] ? [DB[id]] : []), { status: 200 }); }
  const s = JSON.parse(o.body); yazilan.push({ u, prefer: o.headers.Prefer, yetki: o.headers.Authorization, s });
  if (s.kullanici === "00000000-0000-4000-8000-00000000dead") return new Response('{"code":"23503"}', { status: 409 });
  DB[s.kullanici] = s; return new Response("", { status: 201 });
};
await import("./fn.ts");
const U = "a2000000-0000-4000-8000-000000000002";
const simdi = Date.now(), gun = 864e5;
const gonder = async (ev, yetki = "gizli-123", yontem = "POST") => {
  const r = await isle(new Request("https://f/abonelik-webhook", { method: yontem, headers: yetki ? { Authorization: yetki } : {}, body: yontem === "POST" ? JSON.stringify({ api_version: "1.0", event: ev }) : undefined }));
  return r.status + " " + (await r.text());
};
const ev = (ek) => Object.assign({ type: "INITIAL_PURCHASE", app_user_id: U, product_id: "villatakvim_pro_aylik", period_type: "TRIAL", store: "APP_STORE", expiration_at_ms: simdi + 30 * gun, event_timestamp_ms: simdi }, ek);
const R = [];
R.push(["yetkisiz", await gonder(ev({}), "yanlis")]);
R.push(["başlıksız", await gonder(ev({}), null)]);
R.push(["Bearer kabul", await gonder(ev({}), "Bearer gizli-123")]);
R.push(["GET", await gonder(ev({}), "gizli-123", "GET")]);
R.push(["deneme", await gonder(ev({ event_timestamp_ms: simdi + 1 })), DB[U].durum, DB[U].kaynak, DB[U].bitis]);
R.push(["yenileme", await gonder(ev({ type: "RENEWAL", period_type: "NORMAL", event_timestamp_ms: simdi + 2 })), DB[U].durum]);
R.push(["iptal", await gonder(ev({ type: "CANCELLATION", period_type: "NORMAL", event_timestamp_ms: simdi + 3 })), DB[U].durum]);
R.push(["iptal geri", await gonder(ev({ type: "UNCANCELLATION", period_type: "NORMAL", event_timestamp_ms: simdi + 4 })), DB[U].durum]);
R.push(["ödeme sorunu", await gonder(ev({ type: "BILLING_ISSUE", period_type: "NORMAL", event_timestamp_ms: simdi + 5 })), DB[U].durum]);
R.push(["ürün değişti", await gonder(ev({ type: "PRODUCT_CHANGE", period_type: "NORMAL", new_product_id: "villatakvim_pro_yillik", event_timestamp_ms: simdi + 6 })), DB[U].urun]);
R.push(["süre bitti", await gonder(ev({ type: "EXPIRATION", period_type: "NORMAL", expiration_at_ms: simdi - 1000, event_timestamp_ms: simdi + 7 })), DB[U].durum]);
R.push(["eski olay sonra geldi", await gonder(ev({ type: "RENEWAL", period_type: "NORMAL", event_timestamp_ms: simdi + 3 })), DB[U].durum]);
R.push(["iptal ama süre geçmiş (iade)", await gonder(ev({ type: "CANCELLATION", app_user_id: "b2000000-0000-4000-8000-000000000009", expiration_at_ms: simdi - 5, store: "PLAY_STORE" })), DB["b2000000-0000-4000-8000-000000000009"].durum, DB["b2000000-0000-4000-8000-000000000009"].kaynak]);
R.push(["anonim + alias", await gonder(ev({ app_user_id: "$RCAnonymousID:abc", original_app_user_id: "$RCAnonymousID:abc", aliases: ["$RCAnonymousID:abc", "C3000000-0000-4000-8000-000000000003"] })), !!DB["c3000000-0000-4000-8000-000000000003"]]);
R.push(["uuid yok", await gonder(ev({ app_user_id: "$RCAnonymousID:x", aliases: [] }))]);
R.push(["TEST olayı", await gonder({ type: "TEST", app_user_id: U })]);
R.push(["Stripe", await gonder(ev({ store: "STRIPE" }))]);
R.push(["silinmiş kullanıcı", await gonder(ev({ app_user_id: "00000000-0000-4000-8000-00000000dead" }))]);
R.push(["bozuk gövde", (await isle(new Request("https://f/", { method: "POST", headers: { Authorization: "gizli-123" }, body: "{" }))).status]);
ENV.RC_WEBHOOK_SECRET = ""; R.push(["gizli ayarlı değil", await gonder(ev({}), "")]);
R.push(["yazma başlığı", yazilan[0].prefer, yazilan[0].u.replace("https://x.supabase.co", ""), yazilan[0].yetki === "Bearer srv"]);
console.log(R.map(x => x.join(" | ")).join("\n"));
