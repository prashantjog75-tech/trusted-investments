import { z } from "zod";
import { dimensions, profileThresholds, profilerQuestions, type DimensionId, type ProfileName } from "./config";

export type ProfilerAnswers = Record<string, string>;

export type ProfilerResult = {
  profile: ProfileName;
  profileIndex: number;
  score: number;
  minScore: number;
  maxScore: number;
  explanation: string;
  dimensions: Array<{ id: DimensionId; label: string; score: number; max: number; level: "Lower" | "Medium" | "Higher" }>;
  breakdown: Array<{ questionId: string; dimension: string; question: string; answer: string; points: number }>;
};

export function scoreProfiler(answers: ProfilerAnswers): ProfilerResult | null {
  const breakdown: ProfilerResult["breakdown"] = [];
  for (const q of profilerQuestions) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (!opt) return null;
    breakdown.push({ questionId: q.id, dimension: dimensions[q.dimension].label, question: q.prompt, answer: opt.label, points: opt.points });
  }
  const score = breakdown.reduce((s, b) => s + b.points, 0);
  const idx = profileThresholds.findIndex((t) => score >= t.min && score <= t.max);
  const band = profileThresholds[idx];
  if (!band) return null;
  const dims = (Object.keys(dimensions) as DimensionId[]).map((id) => {
    const qs = profilerQuestions.filter((q) => q.dimension === id);
    const max = qs.reduce((s, q) => s + Math.max(...q.options.map((o) => o.points)), 0);
    const min = qs.reduce((s, q) => s + Math.min(...q.options.map((o) => o.points)), 0);
    const sub = qs.reduce((s, q) => s + (q.options.find((o) => o.id === answers[q.id])?.points ?? 0), 0);
    const ratio = max === min ? 1 : (sub - min) / (max - min);
    return { id, label: dimensions[id].label, score: sub, max, level: (ratio < 0.34 ? "Lower" : ratio < 0.67 ? "Medium" : "Higher") as "Lower" | "Medium" | "Higher" };
  });
  const minScore = profileThresholds[0]?.min ?? 0;
  const maxScore = profileThresholds[profileThresholds.length - 1]?.max ?? 0;
  return { profile: band.name, profileIndex: idx, score, minScore, maxScore, explanation: band.explanation, dimensions: dims, breakdown };
}

export const contactSchema = z.object({
  name: z.string().trim().nonempty("Name is required").max(100, "Name must be under 100 characters"),
  phone: z.string().trim().regex(/^(\+?91[\s-]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().nonempty("Email is required").max(255).email("Enter a valid email address"),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy notice to continue" }) }),
});
export type ProfilerContact = z.infer<typeof contactSchema>;

export function buildSubmissionMessage(contact: ProfilerContact, result: ProfilerResult, now = new Date()) {
  const date = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(now);
  const lines = [
    `Timestamp: ${now.toISOString()}`,
    `Assessment date: ${date}`,
    `Name: ${contact.name || "Not provided"}`,
    `Mobile: ${contact.phone}`,
    `Email: ${contact.email || "Not provided"}`,
    "",
    "ANSWERS",
    ...result.breakdown.map((b, i) => `${i + 1}. [${b.dimension}] ${b.question}\n   Answer: ${b.answer} — ${b.points} pts`),
    "",
    "DIMENSION SUBTOTALS",
    ...result.dimensions.map((d) => `${d.label}: ${d.score} / ${d.max} (${d.level})`),
    "",
    `TOTAL SCORE: ${result.score} / ${result.maxScore}`,
    `PROFILE: ${result.profile} (provisional website assessment band)`,
  ];
  return { date, text: lines.join("\n") };
}
