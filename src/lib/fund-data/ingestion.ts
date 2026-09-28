import type { NormalizedNavRecord, SyncStats } from "./domain";
export type StoredNav = NormalizedNavRecord & { id: string };
export function mergeNavRecords(existing: readonly StoredNav[], incoming: readonly NormalizedNavRecord[]) {
  const current = new Map(existing.map((record) => [record.schemeCode, record]));
  const promoted: NormalizedNavRecord[] = [];
  const stats: SyncStats = { created: 0, updated: 0, unchanged: 0, failed: 0 };
  for (const record of incoming) {
    if (!record.schemeCode || !record.navDate || !Number.isFinite(record.nav) || record.nav < 0) { stats.failed++; continue; }
    const previous = current.get(record.schemeCode);
    if (!previous) stats.created++;
    else if (previous.nav === record.nav && previous.navDate === record.navDate && previous.schemeName === record.schemeName) { stats.unchanged++; continue; }
    else stats.updated++;
    promoted.push(record);
  }
  return { promoted, stats };
}
export function preserveOmittedFields<T extends Record<string, unknown>>(current: T, incoming: Partial<T>): T {
  const merged = { ...current };
  for (const [key, value] of Object.entries(incoming)) if (value !== undefined && value !== null) merged[key as keyof T] = value as T[keyof T];
  return merged;
}
