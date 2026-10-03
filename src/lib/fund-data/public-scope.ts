/**
 * Canonical public display scope for the fund universe.
 * Every public fund read (static directory, scheme pages, lists) must pass through
 * these helpers. Underlying AMFI/database data stays intact for future expansion.
 */
export const PUBLIC_AMCS: readonly string[] = [
  "Aditya Birla Sun Life Mutual Fund",
  "ICICI Prudential Mutual Fund",
  "DSP Mutual Fund",
  "SBI Mutual Fund",
  "HSBC Mutual Fund",
  "Franklin Templeton Mutual Fund",
  "Mahindra Manulife Mutual Fund",
  "WhiteOak Capital Mutual Fund",
  "Bandhan Mutual Fund",
  "Kotak Mahindra Mutual Fund",
  "HDFC Mutual Fund",
  "Tata Mutual Fund",
  "PPFAS Mutual Fund",
  "Motilal Oswal Mutual Fund",
  "Nippon India Mutual Fund",
  "Axis Mutual Fund",
  "Mirae Asset Mutual Fund",
  "Invesco Mutual Fund",
  "Canara Robeco Mutual Fund",
  "Edelweiss Mutual Fund",
  "PGIM India Mutual Fund",
  "Sundaram Mutual Fund",
  "UTI Mutual Fund",
];

const publicAmcSet = new Set(PUBLIC_AMCS);

export function isPublicAmc(amc: string | null | undefined): boolean {
  return !!amc && publicAmcSet.has(amc);
}

/** Only Regular Plan entries may be shown; option labels mentioning other plans are dropped. */
export function isPublicPlan(plan: string | null | undefined, option: string | null | undefined): boolean {
  return plan === "Regular Plan" && !/direct/i.test(option ?? "");
}
