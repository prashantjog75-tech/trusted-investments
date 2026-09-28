export type DataStatus = "live" | "stale" | "unavailable" | "not-configured" | "demonstration";
export type DocumentKind = "Fact Sheet" | "KIM" | "SID" | "SAI" | "Scheme Summary Document" | "Portfolio disclosure";
export type Provenance = { providerCode: string; sourceUrl: string; fetchedAt: string; effectiveDate?: string; syncRunId?: string; status: DataStatus; checksum?: string };
export type NormalizedNavRecord = { schemeCode: string; isinGrowth?: string; isinReinvestment?: string; schemeName: string; plan?: string; option?: string; nav: number; navDate: string; fundHouse: string; category?: string; provenance: Provenance };
export type ProviderConfig = { code: string; name: string; type: "amfi_nav" | "sebi_filings" | "amc_documents" | "custom"; sourceUrl?: string; enabled: boolean; configured: boolean; freshnessHours: number; schedule?: string };
export type SyncStats = { created: number; updated: number; unchanged: number; failed: number };
export type ProviderResult<T> = { ok: true; records: T[]; fetchedAt: string; sourceUrl: string } | { ok: false; category: "disabled" | "not_configured" | "fetch" | "parse" | "validation"; message: string; sourceUrl?: string };
export interface DataProvider<T> { readonly config: ProviderConfig; fetchAndNormalize(): Promise<ProviderResult<T>>; }
export function freshnessStatus(lastSuccessful: string | null | undefined, freshnessHours: number, now = new Date()): DataStatus {
  if (!lastSuccessful) return "unavailable";
  const timestamp = new Date(lastSuccessful).getTime();
  if (!Number.isFinite(timestamp)) return "unavailable";
  return now.getTime() - timestamp > freshnessHours * 3_600_000 ? "stale" : "live";
}
export function documentAvailability(document: { officialUrl?: string | null; lastSuccessfulFetchedAt?: string | null; status: string }) {
  return document.status === "available" && Boolean(document.officialUrl) && Boolean(document.lastSuccessfulFetchedAt);
}
