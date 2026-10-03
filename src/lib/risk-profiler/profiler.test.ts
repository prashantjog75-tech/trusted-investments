import { describe, expect, test } from "bun:test";
import { profileThresholds, profilerQuestions } from "./config";
import { buildSubmissionMessage, contactSchema, scoreProfiler } from "./scoring";

const at = (n: number) => Object.fromEntries(profilerQuestions.map((q) => [q.id, q.options[n - 1]!.id]));

describe("risk profiler", () => {
  test("has 14 questions with explicit points and contiguous thresholds", () => {
    expect(profilerQuestions).toHaveLength(14);
    for (let i = 1; i < profileThresholds.length; i++) expect(profileThresholds[i]!.min).toBe(profileThresholds[i - 1]!.max + 1);
  });
  test("scores extremes and middle", () => {
    expect(scoreProfiler(at(1))?.profile).toBe("Low");
    expect(scoreProfiler(at(4))?.profile).toBe("High");
    expect(scoreProfiler(at(4))?.score).toBe(56);
    expect(scoreProfiler({})).toBeNull();
  });
  test("phone mandatory, email optional", () => {
    expect(contactSchema.safeParse({ phone: "", consent: true }).success).toBe(false);
    expect(contactSchema.safeParse({ phone: "9822223949", email: "", consent: true }).success).toBe(true);
    expect(contactSchema.safeParse({ phone: "9822223949", consent: false }).success).toBe(false);
  });
  test("message contains every question, answer and points", () => {
    const r = scoreProfiler(at(3))!;
    const { text } = buildSubmissionMessage({ phone: "9822223949", consent: true }, r);
    for (const b of r.breakdown) expect(text).toContain(`${b.question}\n   Answer: ${b.answer} — ${b.points} pts`);
    expect(text).toContain("Mobile: 9822223949");
    expect(text).toContain(`TOTAL SCORE: ${r.score}`);
    expect(text).toContain("Risk Capacity");
  });
});
