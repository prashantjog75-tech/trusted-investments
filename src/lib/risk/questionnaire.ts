import { z } from "zod";

export const profileNames = ["Conservative", "Moderate", "Aggressive"] as const;
export type RiskProfileName = (typeof profileNames)[number];

export type RiskAnswerOption = {
  id: string;
  label: string;
  detail: string;
  points: number;
};

export type RiskQuestion = {
  id: "horizon" | "goal" | "lossTolerance" | "experience" | "liquidity" | "volatilityReaction";
  title: string;
  prompt: string;
  options: readonly RiskAnswerOption[];
};

export type RiskAnswers = Partial<Record<RiskQuestion["id"], string>>;

export const riskQuestions: readonly RiskQuestion[] = [
  {
    id: "horizon",
    title: "Investment horizon",
    prompt: "How long do you expect to keep most of this money invested?",
    options: [
      { id: "short", label: "Up to 3 years", detail: "The money may be needed relatively soon.", points: 1 },
      { id: "medium", label: "3 to 7 years", detail: "There is time for some market movement.", points: 2 },
      { id: "long", label: "More than 7 years", detail: "The goal has a longer time horizon.", points: 3 },
    ],
  },
  {
    id: "goal",
    title: "Financial goal",
    prompt: "Which description best matches your main reason for investing?",
    options: [
      { id: "preserve", label: "Preserve capital", detail: "Stability matters more than higher growth potential.", points: 1 },
      { id: "balanced", label: "Balance stability and growth", detail: "Both measured growth and stability matter.", points: 2 },
      { id: "growth", label: "Pursue long-term growth", detail: "Long-term growth potential is the priority.", points: 3 },
    ],
  },
  {
    id: "lossTolerance",
    title: "Loss tolerance",
    prompt: "What temporary decline could you accept without changing course?",
    options: [
      { id: "low", label: "Very little", detail: "Even a small decline would be uncomfortable.", points: 1 },
      { id: "some", label: "A moderate decline", detail: "Some fluctuation is acceptable for potential growth.", points: 2 },
      { id: "high", label: "A substantial decline", detail: "Large short-term movements are acceptable for a long horizon.", points: 3 },
    ],
  },
  {
    id: "experience",
    title: "Investment experience",
    prompt: "How familiar are you with market-linked investments?",
    options: [
      { id: "new", label: "New to them", detail: "I have little or no direct experience.", points: 1 },
      { id: "familiar", label: "Somewhat familiar", detail: "I understand basic market movements and risk.", points: 2 },
      { id: "experienced", label: "Experienced", detail: "I have invested through multiple market cycles.", points: 3 },
    ],
  },
  {
    id: "liquidity",
    title: "Liquidity requirements",
    prompt: "How likely are you to need a significant part of this money unexpectedly?",
    options: [
      { id: "likely", label: "Quite likely", detail: "Access at short notice is important.", points: 1 },
      { id: "possible", label: "Possible", detail: "I have reserves, but may need some access.", points: 2 },
      { id: "unlikely", label: "Unlikely", detail: "Separate reserves cover foreseeable needs.", points: 3 },
    ],
  },
  {
    id: "volatilityReaction",
    title: "Reaction to market volatility",
    prompt: "If your investment fell noticeably during a market decline, what would you most likely do?",
    options: [
      { id: "exit", label: "Move out to limit further decline", detail: "Reducing uncertainty would be my priority.", points: 1 },
      { id: "wait", label: "Wait and review calmly", detail: "I would pause before making a change.", points: 2 },
      { id: "continue", label: "Continue my long-term approach", detail: "I would accept volatility as part of market-linked investing.", points: 3 },
    ],
  },
] as const;

export const riskAnswersSchema = z.object({
  horizon: z.string().min(1),
  goal: z.string().min(1),
  lossTolerance: z.string().min(1),
  experience: z.string().min(1),
  liquidity: z.string().min(1),
  volatilityReaction: z.string().min(1),
});

export const profileBands = [
  { name: "Conservative", min: 6, max: 9, description: "Your answers suggest a stronger preference for stability, access to money, and limiting short-term fluctuations." },
  { name: "Moderate", min: 10, max: 14, description: "Your answers suggest a balanced comfort with market movement while still valuing stability and flexibility." },
  { name: "Aggressive", min: 15, max: 18, description: "Your answers suggest greater comfort with substantial market movement in pursuit of long-term growth potential." },
] as const satisfies ReadonlyArray<{ name: RiskProfileName; min: number; max: number; description: string }>;

export type ScoreBreakdownItem = {
  questionId: RiskQuestion["id"];
  question: string;
  answer: string;
  points: number;
};

export type RiskResult = {
  profile: RiskProfileName;
  score: number;
  maximumScore: number;
  description: string;
  breakdown: ScoreBreakdownItem[];
};

export function scoreRiskProfile(answers: RiskAnswers): RiskResult | null {
  if (!riskAnswersSchema.safeParse(answers).success) return null;
  const breakdown: ScoreBreakdownItem[] = [];
  for (const question of riskQuestions) {
    const answerId = answers[question.id];
    const option = question.options.find((candidate) => candidate.id === answerId);
    if (!option) return null;
    breakdown.push({ questionId: question.id, question: question.title, answer: option.label, points: option.points });
  }
  const score = breakdown.reduce((sum, item) => sum + item.points, 0);
  const band = profileBands.find((candidate) => score >= candidate.min && score <= candidate.max);
  if (!band) return null;
  return { profile: band.name, score, maximumScore: 18, description: band.description, breakdown };
}

export type FutureProductMapping = {
  profile: RiskProfileName;
  fundSlugs: readonly string[];
  enabled: false;
};

export const futureProductMappings: readonly FutureProductMapping[] = [];
