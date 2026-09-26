import { z } from "zod";
import { calculateSipProjection } from "@/lib/calculators/sip";

const MAX_AMOUNT = 1_000_000_000;

export const personalizedProjectionSchema = z.object({
  initialInvestment: z.number().min(0).max(MAX_AMOUNT),
  monthlySip: z.number().min(0).max(10_000_000),
  years: z.number().int().min(1).max(50),
  annualRate: z.number().min(0).max(100),
  targetAmount: z.number().min(0).max(MAX_AMOUNT),
});

export type PersonalizedProjectionInputs = z.infer<typeof personalizedProjectionSchema>;

export type PersonalizedProjectionResult = ReturnType<typeof calculateSipProjection> & {
  targetAmount: number | null;
  goalProgressPercent: number | null;
  goalRemaining: number | null;
  goalReached: boolean;
  valid: boolean;
};

export function calculatePersonalizedProjection(input: PersonalizedProjectionInputs): PersonalizedProjectionResult {
  const parsed = personalizedProjectionSchema.safeParse(input);
  if (!parsed.success) {
    const safe = calculateSipProjection({ initialInvestment: 0, monthlySip: 0, years: 1, annualRate: 0 });
    return { ...safe, targetAmount: null, goalProgressPercent: null, goalRemaining: null, goalReached: false, valid: false };
  }
  const projection = calculateSipProjection(parsed.data);
  const targetAmount = parsed.data.targetAmount > 0 ? parsed.data.targetAmount : null;
  const rawProgress = targetAmount ? (projection.estimatedValue / targetAmount) * 100 : null;
  const goalProgressPercent = rawProgress === null || !Number.isFinite(rawProgress) ? null : Math.max(0, rawProgress);
  return {
    ...projection,
    targetAmount,
    goalProgressPercent,
    goalRemaining: targetAmount ? Math.max(0, targetAmount - projection.estimatedValue) : null,
    goalReached: targetAmount !== null && projection.estimatedValue >= targetAmount,
    valid: true,
  };
}
