import { formatInr } from "@/lib/calculators/sip";
import type { PersonalizedProjectionInputs, PersonalizedProjectionResult } from "./projection";
import type { RiskResult } from "./questionnaire";

export type ProjectionReport = {
  title: string;
  date: string;
  profile: RiskResult["profile"];
  scoreLabel: string;
  profileExplanation: string;
  inputs: ReadonlyArray<{ label: string; value: string }>;
  outputs: ReadonlyArray<{ label: string; value: string }>;
  assumptions: string;
  breakdown: RiskResult["breakdown"];
};

export function buildProjectionReport(
  risk: RiskResult,
  inputs: PersonalizedProjectionInputs,
  projection: PersonalizedProjectionResult,
  date = new Date(),
): ProjectionReport {
  const outputs = [
    { label: "Total contributions", value: formatInr(projection.totalContributions) },
    { label: "Estimated growth", value: formatInr(projection.estimatedGrowth) },
    { label: "Projected value", value: formatInr(projection.estimatedValue) },
  ];
  if (projection.targetAmount !== null) {
    outputs.push({
      label: "Goal progress",
      value: projection.goalReached
        ? `${projection.goalProgressPercent?.toFixed(1) ?? "0.0"}% · illustrative target reached`
        : `${projection.goalProgressPercent?.toFixed(1) ?? "0.0"}% · ${formatInr(projection.goalRemaining ?? 0)} remaining`,
    });
  }
  return {
    title: "Educational Risk Profile & Projection Report",
    date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date),
    profile: risk.profile,
    scoreLabel: `${risk.score} of ${risk.maximumScore}`,
    profileExplanation: risk.description,
    inputs: [
      { label: "Initial investment", value: formatInr(inputs.initialInvestment) },
      { label: "Monthly SIP", value: formatInr(inputs.monthlySip) },
      { label: "Investment duration", value: `${inputs.years} years` },
      { label: "Assumed annual return", value: `${inputs.annualRate.toFixed(1)}%` },
      { label: "Optional target", value: inputs.targetAmount > 0 ? formatInr(inputs.targetAmount) : "Not entered" },
    ],
    outputs,
    assumptions: "Monthly compounding is used. SIP instalments are assumed to be invested at the beginning of each month. The annual return is an assumption only.",
    breakdown: risk.breakdown,
  };
}
