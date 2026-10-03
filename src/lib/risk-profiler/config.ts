/**
 * Single source of truth for the website Risk Profile Assessment.
 * Points, dimensions and profile thresholds are PROVISIONAL website assessment
 * settings — not an official SEBI/AMFI scoring methodology. Edit values here;
 * the UI, scoring and submission payload read everything from this file.
 */

export type DimensionId = "capacity" | "tolerance" | "horizon";

export const dimensions: Record<DimensionId, { label: string; description: string }> = {
  capacity: { label: "Risk Capacity", description: "Financial ability to absorb temporary losses, based on life stage, income, responsibilities, reserves and existing assets." },
  tolerance: { label: "Risk Tolerance", description: "Comfort with market movement, based on experience, objectives and likely reactions to declines." },
  horizon: { label: "Time Horizon", description: "How long the money can stay invested and how soon it may be needed." },
};

export type ProfilerOption = { id: string; label: string; points: number };
export type ProfilerQuestion = { id: string; dimension: DimensionId; prompt: string; options: readonly ProfilerOption[] };

const opts = (...labels: string[]): ProfilerOption[] => labels.map((label, i) => ({ id: `o${i + 1}`, label, points: i + 1 }));

export const profilerQuestions: readonly ProfilerQuestion[] = [
  { id: "age", dimension: "capacity", prompt: "Which age group / life stage describes you?", options: opts("60 or above / retired", "46 to 59", "31 to 45", "30 or below") },
  { id: "income", dimension: "capacity", prompt: "How stable is your regular income?", options: opts("No regular income / uncertain", "Variable or business income", "Stable, with occasional variation", "Very stable salaried or pension income") },
  { id: "dependents", dimension: "capacity", prompt: "How many people depend on you financially?", options: opts("Three or more", "Two", "One", "None") },
  { id: "emergency", dimension: "capacity", prompt: "How many months of expenses do you hold as an emergency reserve?", options: opts("Less than 1 month", "1 to 3 months", "3 to 6 months", "More than 6 months") },
  { id: "assets", dimension: "capacity", prompt: "Approximately how large are your existing financial assets and investments (excluding your home)?", options: opts("Below ₹5 lakh", "₹5 lakh to ₹25 lakh", "₹25 lakh to ₹1 crore", "Above ₹1 crore") },
  { id: "allocation", dimension: "capacity", prompt: "How are your existing investments mostly allocated today?", options: opts("Mostly cash, deposits or savings", "Mostly debt / fixed income, some gold", "A mix of equity, debt and gold", "Mostly equity or equity mutual funds") },
  { id: "horizon", dimension: "horizon", prompt: "How long do you plan to keep this money invested?", options: opts("Less than 1 year", "1 to 3 years", "3 to 7 years", "More than 7 years") },
  { id: "liquidity", dimension: "horizon", prompt: "How likely is it that you will need a large part of this money at short notice?", options: opts("Very likely", "Somewhat likely", "Unlikely", "Very unlikely") },
  { id: "experience", dimension: "tolerance", prompt: "How much experience do you have with market-linked investments?", options: opts("None", "Limited (under 2 years)", "Moderate (2 to 5 years)", "Extensive (over 5 years, through market cycles)") },
  { id: "decline", dimension: "tolerance", prompt: "If your investments fell 20% during a market decline, what would you most likely do?", options: opts("Withdraw everything", "Withdraw some", "Hold and wait", "Invest more if suitable") },
  { id: "loss", dimension: "tolerance", prompt: "What temporary fall in value could you tolerate without changing your plan?", options: opts("Almost none", "Up to 10%", "Up to 20%", "More than 20%") },
  { id: "objective", dimension: "tolerance", prompt: "What is your main investment objective?", options: opts("Protect capital", "Regular income", "Balanced growth and stability", "Long-term wealth growth") },
  { id: "tradeoff", dimension: "tolerance", prompt: "Which do you prefer: stability or higher return potential?", options: opts("Stability, even with low returns", "Mostly stability", "Some fluctuation for better potential", "Higher potential, accepting large fluctuations") },
  { id: "continue", dimension: "tolerance", prompt: "During prolonged market volatility, would you continue regular investing (e.g. SIPs)?", options: opts("I would stop", "I would probably pause", "I would probably continue", "I would definitely continue") },
];

export const profileNames = ["Low", "Low to Moderate", "Moderate", "Moderately High", "High"] as const;
export type ProfileName = (typeof profileNames)[number];

/** Provisional, configurable thresholds on the total score (min 14, max 56). Must be contiguous and in order. */
export const profileThresholds: ReadonlyArray<{ name: ProfileName; min: number; max: number; explanation: string }> = [
  { name: "Low", min: 14, max: 22, explanation: "Your answers indicate a strong preference for capital stability and easy access to money, with limited capacity or comfort for market fluctuations." },
  { name: "Low to Moderate", min: 23, max: 30, explanation: "Your answers indicate a preference for stability, with some room for modest market movement." },
  { name: "Moderate", min: 31, max: 38, explanation: "Your answers indicate a balance between stability and growth potential, with reasonable capacity to absorb temporary declines." },
  { name: "Moderately High", min: 39, max: 46, explanation: "Your answers indicate good capacity and comfort for market movement in pursuit of long-term growth." },
  { name: "High", min: 47, max: 56, explanation: "Your answers indicate strong financial capacity, a long horizon and high comfort with substantial short-term fluctuations." },
];

export const SUBMISSION_RECIPIENT = "prashant_jog@hotmail.com";
export const SUBMISSION_SUBJECT = "New Risk Profile Assessment - Prashant Jog";
