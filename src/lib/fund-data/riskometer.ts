/**
 * SEBI Risk-o-meter levels and colours (SEBI/HO/IMD/PoD1/CIR/P/2024/150, 5 Nov 2024).
 * Data lives in ./riskometer-data.ts (generated monthly from official disclosures); never infer levels.
 */
import { RISKOMETER_ENTRIES } from "./riskometer-data";

export const RISK_LEVELS = [
  { level: "Low", color: "#08A04B", colorName: "Irish Green" },
  { level: "Low to Moderate", color: "#7FFF00", colorName: "Chartreuse" },
  { level: "Moderate", color: "#FFFF33", colorName: "Neon Yellow" },
  { level: "Moderately High", color: "#C68E17", colorName: "Caramel" },
  { level: "High", color: "#FF8C00", colorName: "Dark Orange" },
  { level: "Very High", color: "#F70D1A", colorName: "Red" },
] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number]["level"];

export type RiskometerEntry = {
  amc: string;
  fund: string;
  level: RiskLevel;
  /** ISO date of the portfolio the risk level is based on. */
  asOf: string;
  sourceUrl: string;
};

const byFund = new Map(RISKOMETER_ENTRIES.map((e) => [`${e.amc}\u0000${e.fund}`, e]));

/** Scheme-level lookup: all options of one fund share the scheme's riskometer. */
export function getRiskometer(amc: string, fund: string): RiskometerEntry | undefined {
  return byFund.get(`${amc}\u0000${fund}`);
}

export function formatAsOf(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
