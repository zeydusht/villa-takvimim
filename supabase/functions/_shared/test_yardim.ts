// Küçük test yardımcıları (jsr:@std/assert'e bağlı kalmadan; Deno ve Node'da aynı çalışır)
export function esit(gercek: unknown, beklenen: unknown, mesaj = ""): void {
  const a = JSON.stringify(gercek), b = JSON.stringify(beklenen);
  if (a !== b) throw new Error((mesaj ? mesaj + ": " : "") + "beklenen " + b + ", gelen " + a);
}
export function dogru(x: unknown, mesaj = "doğru olmalı"): void { if (!x) throw new Error(mesaj); }
export async function hataVerir(f: () => Promise<unknown> | unknown, kod?: string): Promise<string> {
  try { await f(); } catch (e) {
    // deno-lint-ignore no-explicit-any
    const k = (e as any).kod;
    if (kod && k !== kod) throw new Error("beklenen hata kodu " + kod + ", gelen " + k + " (" + (e as Error).message + ")");
    return (e as Error).message;
  }
  throw new Error("hata bekleniyordu" + (kod ? " (" + kod + ")" : ""));
}
