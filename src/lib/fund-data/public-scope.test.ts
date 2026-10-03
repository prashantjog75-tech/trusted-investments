import { describe, expect, test } from "bun:test";
import { staticSchemes } from "./amfi-snapshot";
import { PUBLIC_AMCS, isPublicAmc, isPublicPlan } from "./public-scope";

describe("public fund scope", () => {
  test("allowlist has exactly 23 fund houses", () => {
    expect(PUBLIC_AMCS.length).toBe(23);
    expect(new Set(PUBLIC_AMCS).size).toBe(23);
  });

  test("excluded fund houses and other plans are rejected", () => {
    expect(isPublicAmc("quant Mutual Fund")).toBe(false);
    expect(isPublicAmc("LIC Mutual Fund")).toBe(false);
    expect(isPublicAmc(undefined)).toBe(false);
    expect(isPublicPlan("Regular Plan", "Growth")).toBe(true);
    expect(isPublicPlan("Not specified", "Growth")).toBe(false);
  });

  test("static directory only contains approved Regular Plan schemes", () => {
    const amcs = new Set(staticSchemes.map((s) => s.amc));
    expect([...amcs].every((amc) => isPublicAmc(amc))).toBe(true);
    expect(amcs.size).toBe(23);
    expect(staticSchemes.every((s) => isPublicPlan(s.plan, s.option))).toBe(true);
  });
});
