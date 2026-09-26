import { describe, expect, test } from "bun:test";
import { calculatePersonalizedProjection } from "./projection";
import { buildProjectionReport } from "./report";
import { riskQuestions, scoreRiskProfile, type RiskAnswers } from "./questionnaire";

function answersAt(points: 1 | 2 | 3): RiskAnswers {
  return Object.fromEntries(riskQuestions.map((question) => [question.id, question.options[points - 1].id]));
}

function mixed(points: number[]): RiskAnswers {
  return Object.fromEntries(riskQuestions.map((question, index) => [question.id, question.options[(points[index] ?? 1) - 1].id]));
}

describe("risk scoring", () => {
  test("scores every profile band", () => {
    expect(scoreRiskProfile(answersAt(1))?.profile).toBe("Conservative");
    expect(scoreRiskProfile(answersAt(2))?.profile).toBe("Moderate");
    expect(scoreRiskProfile(answersAt(3))?.profile).toBe("Aggressive");
  });
  test("honours all score boundaries", () => {
    expect(scoreRiskProfile(mixed([1, 1, 1, 1, 2, 3]))?.score).toBe(9);
    expect(scoreRiskProfile(mixed([1, 1, 1, 2, 2, 3]))?.profile).toBe("Moderate");
    expect(scoreRiskProfile(mixed([2, 2, 2, 2, 3, 3]))?.score).toBe(14);
    expect(scoreRiskProfile(mixed([2, 2, 2, 3, 3, 3]))?.profile).toBe("Aggressive");
  });
  test("rejects empty and unknown answers", () => {
    expect(scoreRiskProfile({})).toBeNull();
    expect(scoreRiskProfile({ ...answersAt(2), horizon: "unknown" })).toBeNull();
  });
});

describe("personalized projection and report", () => {
  test("combines a lump sum and monthly SIP", () => {
    const result = calculatePersonalizedProjection({ initialInvestment: 100_000, monthlySip: 5_000, years: 5, annualRate: 10, targetAmount: 750_000 });
    expect(result.valid).toBe(true);
    expect(result.totalContributions).toBe(400_000);
    expect(result.estimatedValue).toBeGreaterThan(result.totalContributions);
    expect(result.goalProgressPercent).toBeGreaterThan(0);
  });
  test("handles zero and invalid values without non-finite output", () => {
    const zero = calculatePersonalizedProjection({ initialInvestment: 0, monthlySip: 0, years: 1, annualRate: 0, targetAmount: 0 });
    expect(zero.estimatedValue).toBe(0);
    const invalid = calculatePersonalizedProjection({ initialInvestment: -1, monthlySip: -1, years: 0, annualRate: -1, targetAmount: -1 });
    expect(invalid.valid).toBe(false);
    expect(Number.isFinite(invalid.estimatedValue)).toBe(true);
  });
  test("reports a target already reached", () => {
    const result = calculatePersonalizedProjection({ initialInvestment: 1_000_000, monthlySip: 0, years: 1, annualRate: 0, targetAmount: 500_000 });
    expect(result.goalReached).toBe(true);
    expect(result.goalRemaining).toBe(0);
    expect(result.goalProgressPercent).toBe(200);
  });
  test("generates complete report data", () => {
    const risk = scoreRiskProfile(answersAt(2));
    expect(risk).not.toBeNull();
    if (!risk) return;
    const inputs = { initialInvestment: 100_000, monthlySip: 5_000, years: 5, annualRate: 10, targetAmount: 750_000 };
    const projection = calculatePersonalizedProjection(inputs);
    const report = buildProjectionReport(risk, inputs, projection, new Date("2026-09-26T00:00:00Z"));
    expect(report.profile).toBe("Moderate");
    expect(report.inputs).toHaveLength(5);
    expect(report.outputs).toHaveLength(4);
    expect(report.date).toContain("2026");
  });
});
