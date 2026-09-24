import { z } from "zod";

const MAX_AMOUNT = 1_000_000_000;

const commonSchema = z.object({
  years: z.number().int().min(1).max(50),
  annualRate: z.number().min(0).max(100),
  initialInvestment: z.number().min(0).max(MAX_AMOUNT),
});

export const sipInputSchema = commonSchema.extend({
  monthlySip: z.number().min(0).max(10_000_000),
});

export const goalInputSchema = commonSchema.extend({
  targetAmount: z.number().min(1).max(MAX_AMOUNT),
});

export type SipInputs = z.infer<typeof sipInputSchema>;
export type GoalInputs = z.infer<typeof goalInputSchema>;

export type ProjectionPoint = {
  month: number;
  label: string;
  invested: number;
  estimatedValue: number;
};

export type ProjectionResult = {
  totalContributions: number;
  estimatedGrowth: number;
  estimatedValue: number;
  assumedAnnualRate: number;
  meaningfulCagr: number | null;
  chartData: ProjectionPoint[];
};

export type GoalProjectionResult = ProjectionResult & {
  targetAmount: number;
  requiredMonthlySip: number;
  initialInvestmentMeetsTarget: boolean;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? Math.max(0, value) : 0);
}

function finiteOrZero(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function monthlyRate(annualRate: number) {
  return finiteOrZero(annualRate) / 100 / 12;
}

function sipFactor(months: number, rate: number) {
  if (months <= 0) return 0;
  if (rate === 0) return months;
  return (((1 + rate) ** months - 1) / rate) * (1 + rate);
}

function valueAtMonth(monthlySip: number, initialInvestment: number, annualRate: number, month: number) {
  const rate = monthlyRate(annualRate);
  return initialInvestment * (1 + rate) ** month + monthlySip * sipFactor(month, rate);
}

export function buildProjectionSeries(
  monthlySip: number,
  initialInvestment: number,
  annualRate: number,
  months: number,
): ProjectionPoint[] {
  const safeMonths = Math.max(0, Math.floor(finiteOrZero(months)));
  const checkpoints = new Set([0, safeMonths]);
  for (let month = 12; month < safeMonths; month += 12) checkpoints.add(month);

  return [...checkpoints]
    .sort((a, b) => a - b)
    .map((month) => ({
      month,
      label: month === 0 ? "Start" : month % 12 === 0 ? `Year ${month / 12}` : `Month ${month}`,
      invested: finiteOrZero(initialInvestment + monthlySip * month),
      estimatedValue: finiteOrZero(valueAtMonth(monthlySip, initialInvestment, annualRate, month)),
    }));
}

export function calculateSipProjection(input: SipInputs): ProjectionResult {
  const parsed = sipInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      totalContributions: 0,
      estimatedGrowth: 0,
      estimatedValue: 0,
      assumedAnnualRate: 0,
      meaningfulCagr: null,
      chartData: [{ month: 0, label: "Start", invested: 0, estimatedValue: 0 }],
    };
  }

  const { monthlySip, initialInvestment, annualRate, years } = parsed.data;
  const months = years * 12;
  const totalContributions = initialInvestment + monthlySip * months;
  const estimatedValue = finiteOrZero(valueAtMonth(monthlySip, initialInvestment, annualRate, months));
  const meaningfulCagr =
    monthlySip === 0 && initialInvestment > 0 && estimatedValue > 0
      ? ((estimatedValue / initialInvestment) ** (1 / years) - 1) * 100
      : null;

  return {
    totalContributions,
    estimatedGrowth: Math.max(0, estimatedValue - totalContributions),
    estimatedValue,
    assumedAnnualRate: annualRate,
    meaningfulCagr,
    chartData: buildProjectionSeries(monthlySip, initialInvestment, annualRate, months),
  };
}

export function calculateGoalProjection(input: GoalInputs): GoalProjectionResult {
  const parsed = goalInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      targetAmount: 0,
      requiredMonthlySip: 0,
      initialInvestmentMeetsTarget: false,
      totalContributions: 0,
      estimatedGrowth: 0,
      estimatedValue: 0,
      assumedAnnualRate: 0,
      meaningfulCagr: null,
      chartData: [{ month: 0, label: "Start", invested: 0, estimatedValue: 0 }],
    };
  }

  const { targetAmount, initialInvestment, annualRate, years } = parsed.data;
  const months = years * 12;
  const rate = monthlyRate(annualRate);
  const projectedInitialValue = initialInvestment * (1 + rate) ** months;
  const remainingTarget = Math.max(0, targetAmount - projectedInitialValue);
  const factor = sipFactor(months, rate);
  const requiredMonthlySip = factor > 0 ? remainingTarget / factor : 0;
  const totalContributions = initialInvestment + requiredMonthlySip * months;
  const estimatedValue = finiteOrZero(
    valueAtMonth(requiredMonthlySip, initialInvestment, annualRate, months),
  );

  return {
    targetAmount,
    requiredMonthlySip: finiteOrZero(requiredMonthlySip),
    initialInvestmentMeetsTarget: remainingTarget === 0,
    totalContributions,
    estimatedGrowth: Math.max(0, estimatedValue - totalContributions),
    estimatedValue,
    assumedAnnualRate: annualRate,
    meaningfulCagr: null,
    chartData: buildProjectionSeries(requiredMonthlySip, initialInvestment, annualRate, months),
  };
}