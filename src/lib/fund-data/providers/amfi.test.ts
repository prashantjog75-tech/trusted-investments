import { describe, expect, test } from "bun:test";
import { documentAvailability, freshnessStatus } from "../domain";
import { mergeNavRecords, preserveOmittedFields } from "../ingestion";
import { ConfiguredSourceProvider } from "./configured";
import { parseAmfiNav } from "./amfi";
const payload = `Scheme Code;ISIN Div Payout/ ISIN Growth;ISIN Div Reinvestment;Scheme Name;Plan;Option;Net Asset Value;Date\nOpen Ended Schemes(Equity Scheme - Large Cap Fund)\nExample Mutual Fund\n12345;INF000000001;-;Example Fund;Direct Plan;Growth;42.1250;25-Sep-2026\n12346;-;-;Bad NAV;Regular Plan;Growth;abc;25-Sep-2026\n12347;-;-;Bad Date;Regular Plan;Growth;10.00;invalid`;
describe("AMFI provider", () => {
 test("parses and normalizes the official text shape",()=>{ const rows=parseAmfiNav(payload,"2026-09-26T00:00:00Z"); expect(rows).toHaveLength(1); expect(rows[0]?.fundHouse).toBe("Example Mutual Fund"); expect(rows[0]?.nav).toBe(42.125); expect(rows[0]?.category).toContain("Large Cap"); });
 test("rejects malformed payloads",()=>expect(()=>parseAmfiNav("not a feed")).toThrow());
 test("skips invalid NAV and dates",()=>expect(parseAmfiNav(payload)).toHaveLength(1));
});
describe("safe ingestion",()=>{
 test("creates, updates and is idempotent",()=>{ const row=parseAmfiNav(payload)[0]; if(!row) throw new Error("fixture"); expect(mergeNavRecords([], [row]).stats.created).toBe(1); const stored={...row,id:"1"}; expect(mergeNavRecords([stored],[row]).stats.unchanged).toBe(1); expect(mergeNavRecords([stored],[{...row,nav:43}]).stats.updated).toBe(1); });
 test("preserves omitted valid fields",()=>expect(preserveOmittedFields<{ nav: number; benchmark: string | undefined }>({nav:10,benchmark:"Index"},{nav:11,benchmark:undefined})).toEqual({nav:11,benchmark:"Index"}));
 test("preserves valid records when a source produces none",()=>{ const row=parseAmfiNav(payload)[0]; if(!row) throw new Error("fixture"); expect(mergeNavRecords([{...row,id:"1"}],[]).promoted).toHaveLength(0); });
});
describe("status rules",()=>{
 test("calculates fresh and stale data",()=>{ const now=new Date("2026-09-28T00:00:00Z"); expect(freshnessStatus("2026-09-27T12:00:00Z",24,now)).toBe("live"); expect(freshnessStatus("2026-09-26T00:00:00Z",24,now)).toBe("stale"); });
 test("requires validated document provenance",()=>{ expect(documentAvailability({officialUrl:"https://amc.example/doc.pdf",lastSuccessfulFetchedAt:"2026-09-28",status:"available"})).toBe(true); expect(documentAvailability({officialUrl:null,lastSuccessfulFetchedAt:null,status:"available"})).toBe(false); });
 test("reports disabled and unconfigured providers",async()=>{ const disabled=await new ConfiguredSourceProvider({code:"x",name:"X",type:"custom",enabled:false,configured:false,freshnessHours:24}).fetchAndNormalize(); expect(disabled.ok).toBe(false); if(!disabled.ok) expect(disabled.category).toBe("disabled"); const missing=await new ConfiguredSourceProvider({code:"x",name:"X",type:"custom",enabled:true,configured:false,freshnessHours:24}).fetchAndNormalize(); if(!missing.ok) expect(missing.category).toBe("not_configured"); });
});
