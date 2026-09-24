import { describe, expect, test } from "bun:test";
import {
  calculateGoalProjection,
  calculateSipProjection,
  formatInr,
} from "./sip";

describe("SIP projection", () => {
  test("calculates a beginning-of-month SIP", () => {
    const result = calculateSipProjection({ monthlySip: 10_000, years: 10, annualRate: 12, initialInvestment: 0 });
    expect(result.totalContributions).toBe(1_200_000);
    expect(result.estimatedValue).toBeCloseTo(2_323_391.19, 0);
    expect(result.estimatedGrowth).toBeCloseTo(1_123_391.19, 0);
    expect(result.meaningfulCagr).toBeNull();
  });

  test("combines a lump sum and monthly SIP", () => {
    const result = calculateSipProjection({ monthlySip: 5_000, years: 5, annualRate: 10, initialInvestment: 100_000 });
    expect(result.totalContributions).toBe(400_000);
    expect(result.estimatedValue).toBeGreaterThan(result.totalContributions);
  });

  test("handles zero return and invalid input safely", () => {
    const zeroRate = calculateSipProjection({ monthlySip: 1_000, years: 1, annualRate: 0, initialInvestment: 5_000 });
    expect(zeroRate.estimatedValue).toBe(17_000);
    const invalid = calculateSipProjection({ monthlySip: -1, years: 0, annualRate: -5, initialInvestment: -10 });
    expect(invalid.estimatedValue).toBe(0);
    expect(Number.isFinite(invalid.estimatedValue)).toBe(true);
  });

  test("shows CAGR only for a lump-sum-only illustration", () => {
    const result = calculateSipProjection({ monthlySip: 0, years: 5, annualRate: 12, initialInvestment: 100_000 });
    expect(result.meaningfulCagr).not.toBeNull();
    expect(result.meaningfulCagr).toBeCloseTo(12.68, 1);
  });
});

describe("goal projection", () => {
  test("calculates the required monthly SIP", () => {
    const result = calculateGoalProjection({ targetAmount: 5_000_000, years: 15, annualRate: 11, initialInvestment: 0 });
    expect(result.requiredMonthlySip).toBeGreaterThan(0);
    expect(result.estimatedValue).toBeCloseTo(5_000_000, 0);
  });

  test("requires no SIP when the initial investment can reach the target", () => {
    const result = calculateGoalProjection({ targetAmount: 1_000_000, years: 10, annualRate: 10, initialInvestment: 1_000_000 });
    expect(result.requiredMonthlySip).toBe(0);
    expect(result.initialInvestmentMeetsTarget).toBe(true);
  });

  test("formats Indian currency safely", () => {
    expect(formatInr(1_234_567)).toContain("12,34,567");
    expect(formatInr(Number.NaN)).toContain("0");
  });
});