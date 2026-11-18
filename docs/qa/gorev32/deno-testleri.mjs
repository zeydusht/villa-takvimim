// Deno birim testlerini Deno kurulu olmayan makinede Node ile çalıştırır (Node 23.6+ TypeScript türlerini kendisi siler).
//   node --no-warnings docs/qa/gorev32/deno-testleri.mjs
// Deno kuruluysa aynı dosyalar doğrudan: deno test --allow-read supabase/functions/takvim-esitle/
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const testler = [];
globalThis.Deno = {
  test: (ad, f) => testler.push({ ad, f }),
  readTextFile: async (u) => readFileSync(u instanceof URL ? fileURLToPath(u) : u, "utf8"),
  env: { get: () => undefined },
};
const kok = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../supabase/functions");
const dosyalar = ["takvim-esitle/ical_test.ts", "takvim-esitle/guvenlik_test.ts", "takvim-ver/ver_test.ts"];
let gecen = 0, kalan = 0;
for (const d of dosyalar) {
  const once = testler.length;
  try { await import(pathToFileURL(path.join(kok, d)).href); } catch (e) { if (e.code === "ERR_MODULE_NOT_FOUND" && /ver_test/.test(d)) continue; throw e; }
  for (const t of testler.slice(once)) {
    try { await t.f(); gecen++; console.log("✓ " + d + " · " + t.ad); }
    catch (e) { kalan++; console.log("✗ " + d + " · " + t.ad + "\n    " + e.message); }
  }
}
console.log("\n" + gecen + " geçti, " + kalan + " kaldı");
process.exit(kalan ? 1 : 0);
