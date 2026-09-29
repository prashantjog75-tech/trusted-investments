import { createHash } from "crypto";
import type { DataProvider, NormalizedNavRecord, ProviderConfig, ProviderResult } from "../domain";

export const AMFI_NAV_URL = "https://portal.amfiindia.com/spages/NAVAll.txt";
export const amfiConfig: ProviderConfig = { code: "amfi-nav", name: "AMFI Complete NAV Report", type: "amfi_nav", sourceUrl: AMFI_NAV_URL, enabled: true, configured: true, freshnessHours: 48, schedule: "Weekdays after AMFI publication" };

function isoDate(value: string) {
  const match = value.trim().match(/^(\d{2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return null;
  const months: Record<string, string> = { Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12" };
  const monthName = match[2];
  if (!monthName) return null;
  const month = months[monthName];
  if (!month) return null;
  const result = `${match[3]}-${month}-${match[1]}`;
  return Number.isFinite(new Date(`${result}T00:00:00Z`).getTime()) ? result : null;
}
export function slugifyScheme(name: string, code: string) { return `${name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,72)}-${code.toLowerCase()}`; }
export function parseAmfiNav(text: string, fetchedAt = new Date().toISOString()): NormalizedNavRecord[] {
  if (!text.includes("Scheme Code;") || text.length < 100) throw new Error("AMFI payload header is missing or incomplete");
  let category: string | undefined;
  let fundHouse = "";
  const records: NormalizedNavRecord[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("Scheme Code;")) continue;
    if (!line.includes(";")) {
      const categoryMatch = line.match(/^(?:Open|Close) Ended Schemes\((.+)\)$/i);
      if (categoryMatch) category = categoryMatch[1]; else fundHouse = line;
      continue;
    }
    const parts = line.split(";");
    if (parts.length < 8) continue;
    const [schemeCode, isinGrowth, isinReinvestment, schemeName, plan, option, navRaw, dateRaw] = parts;
    const nav = Number(navRaw);
    const navDate = isoDate(dateRaw ?? "");
    if (!schemeCode || !schemeName || !fundHouse || !Number.isFinite(nav) || nav < 0 || !navDate) continue;
    records.push({ schemeCode, schemeName, nav, navDate, fundHouse, ...(isinGrowth && isinGrowth !== "-" ? { isinGrowth } : {}), ...(isinReinvestment && isinReinvestment !== "-" ? { isinReinvestment } : {}), ...(plan ? { plan } : {}), ...(option ? { option } : {}), ...(category ? { category } : {}), provenance: { providerCode: amfiConfig.code, sourceUrl: AMFI_NAV_URL, fetchedAt, effectiveDate: navDate, status: "live", checksum: createHash("sha256").update(line).digest("hex") } });
  }
  if (records.length === 0) throw new Error("AMFI payload contained no valid NAV records");
  return records;
}
export class AmfiNavProvider implements DataProvider<NormalizedNavRecord> {
  readonly config = amfiConfig;
  async fetchAndNormalize(): Promise<ProviderResult<NormalizedNavRecord>> {
    try {
      const response = await fetch(AMFI_NAV_URL, { headers: { Accept: "text/plain" } });
      if (!response.ok) return { ok: false, category: "fetch", message: `AMFI returned HTTP ${response.status}`, sourceUrl: AMFI_NAV_URL };
      const fetchedAt = new Date().toISOString();
      try { return { ok: true, records: parseAmfiNav(await response.text(), fetchedAt), fetchedAt, sourceUrl: AMFI_NAV_URL }; }
      catch (error) { return { ok: false, category: "parse", message: error instanceof Error ? error.message : "Unable to parse AMFI payload", sourceUrl: AMFI_NAV_URL }; }
    } catch (error) { return { ok: false, category: "fetch", message: error instanceof Error ? error.message : "Unable to fetch AMFI payload", sourceUrl: AMFI_NAV_URL }; }
  }
}
