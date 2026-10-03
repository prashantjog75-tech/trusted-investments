import { describe, expect, test } from "bun:test";
import { RISK_LEVELS } from "./riskometer";
import { RISKOMETER_ENTRIES } from "./riskometer-data";
import { staticSchemes } from "./amfi-snapshot";
import { isPublicAmc } from "./public-scope";

describe("riskometer", () => {
  test("uses the exact SEBI six-level colours", () => {
    expect(RISK_LEVELS.map((l) => [l.level, l.color])).toEqual([
      ["Low", "#08A04B"], ["Low to Moderate", "#7FFF00"], ["Moderate", "#FFFF33"],
      ["Moderately High", "#C68E17"], ["High", "#FF8C00"], ["Very High", "#F70D1A"],
    ]);
  });
  test("every entry maps to a public fund with level, date and official source", () => {
    const names = new Set(staticSchemes.map((s) => `${s.amc}\u0000${s.name}`));
    const levels = new Set(RISK_LEVELS.map((l) => l.level));
    for (const e of RISKOMETER_ENTRIES) {
      expect(isPublicAmc(e.amc)).toBe(true);
      expect(names.has(`${e.amc}\u0000${e.fund}`)).toBe(true);
      expect(levels.has(e.level)).toBe(true);
      expect(/^\d{4}-\d{2}-\d{2}$/.test(e.asOf)).toBe(true);
      expect(e.sourceUrl.startsWith("https://")).toBe(true);
    }
  });
});
