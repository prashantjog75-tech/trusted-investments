/**
 * Static, browser-safe registry of verified official scheme documents.
 * Every URL here was opened on the AMC's own website and confirmed to load the
 * named page. Never add guessed URLs, PDF filename patterns, or third-party links.
 */
export type OfficialDocumentType =
  | "expenseRatio"
  | "factsheet"
  | "sid"
  | "sai"
  | "kim"
  | "statutoryDisclosures"
  | "schemePage";

export type DocumentScope = "amc" | "fund" | "variant";

export type OfficialDocument = {
  type: OfficialDocumentType;
  scope: DocumentScope;
  url: string;
  source: string;
  verified: true;
  verifiedOn: string;
  note?: string | undefined;
};

export const DOCUMENT_LABELS: Record<OfficialDocumentType, string> = {
  expenseRatio: "Expense Ratio",
  factsheet: "Factsheet",
  sid: "SID",
  sai: "SAI",
  kim: "KIM",
  statutoryDisclosures: "Statutory Disclosures",
  schemePage: "Official Scheme Page",
};

export const DOCUMENT_ORDER: readonly OfficialDocumentType[] = ["expenseRatio", "factsheet", "sid", "sai", "kim", "statutoryDisclosures", "schemePage"];

const VERIFIED_ON = "2 October 2026";
const VERIFIED_ON_2026_10_03 = "3 October 2026";

type AmcEntry = { source: string; common: Partial<Record<OfficialDocumentType, { url: string; note?: string }>> };

const DSP_DOWNLOADS = "https://www.dspim.com/downloads";

const amcDocuments: Record<string, AmcEntry> = {
  "DSP Mutual Fund": {
    source: "DSP Mutual Fund (dspim.com)",
    common: {
      expenseRatio: { url: "https://www.dspim.com/ter", note: "AMC Total Expense Ratio page" },
      factsheet: { url: "https://www.dspim.com/factsheets", note: "AMC factsheet library" },
      // DSP hosts SID and SAI together in its official download centre (SID/SAI section).
      sid: { url: DSP_DOWNLOADS, note: "Download centre - SID/SAI section" },
      sai: { url: DSP_DOWNLOADS, note: "Download centre - SID/SAI section" },
      kim: { url: "https://www.dspim.com/downloads?category=Information%20Documents&sub_category=Key%20Information%20Memorandum%20-%20KIM", note: "Download centre - KIM section" },
      statutoryDisclosures: { url: "https://www.dspim.com/mandatory-disclosures", note: "AMC mandatory disclosures" },
    },
  },
  "HDFC Mutual Fund": {
    source: "HDFC Mutual Fund (hdfcfund.com)",
    common: {
      expenseRatio: { url: "https://www.hdfcfund.com/statutory-disclosure/total-expense-ratio-of-mutual-fund-schemes/reports", note: "AMC Total Expense Ratio page" },
      factsheet: { url: "https://www.hdfcfund.com/mutual-funds/factsheets", note: "AMC factsheet library" },
      sid: { url: "https://www.hdfcfund.com/mutual-funds/fund-documents/sid", note: "AMC SID library" },
      kim: { url: "https://www.hdfcfund.com/mutual-funds/fund-documents/kim", note: "AMC KIM library" },
      sai: { url: "https://www.hdfcfund.com/statutory-disclosure", note: "AMC statutory disclosure page (SAI section)" },
      statutoryDisclosures: { url: "https://www.hdfcfund.com/statutory-disclosure", note: "AMC statutory disclosure page" },
    },
  },
  "SBI Mutual Fund": {
    source: "SBI Mutual Fund (sbimf.com)",
    common: {
      expenseRatio: { url: "https://www.sbimf.com/total-expense-ratio", note: "AMC Total Expense Ratio page" },
      factsheet: { url: "https://www.sbimf.com/factsheets", note: "AMC factsheet library" },
      // SBI hosts SID and KIM together on its official offer-document page.
      sid: { url: "https://www.sbimf.com/offer-document-sid-kim", note: "Offer documents - SID/KIM section" },
      kim: { url: "https://www.sbimf.com/offer-document-sid-kim", note: "Offer documents - SID/KIM section" },
      sai: { url: "https://www.sbimf.com/docs/default-source/documents/statement-of-additional-information.pdf", note: "Official SAI document" },
      statutoryDisclosures: { url: "https://www.sbimf.com/disclosure", note: "AMC disclosure page" },
    },
  },
  "Nippon India Mutual Fund": {
    source: "Nippon India Mutual Fund (mf.nipponindiaim.com)",
    common: {
      expenseRatio: { url: "https://mf.nipponindiaim.com/Pages/Total-Expense-Ratio-of-Mutual-Fund-Schemes1116-5337.aspx", note: "AMC Total Expense Ratio page" },
      factsheet: { url: "https://mf.nipponindiaim.com/investor-service/downloads/factsheet-portfolio-and-other-disclosures", note: "AMC factsheet & disclosure repository" },
      sid: { url: "https://mf.nipponindiaim.com/investor-service/downloads/scheme-information-document", note: "AMC SID library" },
      statutoryDisclosures: { url: "https://mf.nipponindiaim.com/investor-service/downloads/factsheet-portfolio-and-other-disclosures", note: "AMC factsheet & disclosure repository" },
    },
  },
  "Aditya Birla Sun Life Mutual Fund": {
    source: "Aditya Birla Sun Life Mutual Fund (mutualfund.adityabirlacapital.com)",
    common: {
      expenseRatio: { url: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/total-expense-ratio", note: "AMC Total Expense Ratio page" },
      factsheet: { url: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/factsheets", note: "AMC factsheet library" },
      // Aditya Birla Sun Life hosts SID and KIM together on its official forms page.
      sid: { url: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/forms", note: "Forms & downloads - SID/KIM section" },
      kim: { url: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/forms", note: "Forms & downloads - SID/KIM section" },
      statutoryDisclosures: { url: "https://mutualfund.adityabirlacapital.com/forms-and-downloads/disclosures", note: "AMC disclosures page" },
    },
  },
  "Tata Mutual Fund": {
    source: "Tata Mutual Fund (tatamutualfund.com)",
    common: {
      expenseRatio: { url: "https://www.tatamutualfund.com/expense-ratio/total-expense-ratio", note: "AMC Total Expense Ratio page" },
      factsheet: { url: "https://www.tatamutualfund.com/information-documents/factsheets", note: "AMC factsheet library" },
      // Tata hosts SID and SAI together on its official information-documents page.
      sid: { url: "https://www.tatamutualfund.com/information-documents/sai", note: "Information documents - SID/SAI section" },
      sai: { url: "https://www.tatamutualfund.com/information-documents/sai", note: "Information documents - SID/SAI section" },
    },
  },
  "UTI Mutual Fund": {
    source: "UTI Mutual Fund (utimf.com)",
    common: {
      factsheet: { url: "https://www.utimf.com/downloads/fact-sheet", note: "AMC factsheet library" },
      sid: { url: "https://www.utimf.com/downloads/sid", note: "AMC SID library" },
    },
  },
};

const DSP_SCHEMES = "https://www.dspim.com/invest/mutual-fund-schemes/";

/** Variant-level official pages keyed by `${amc}|${fund name}|${option}` (Regular Plan only). */
const variantPages: Record<string, string> = Object.fromEntries(
  ([
    ["DSP 10 year Constant Maturity Gilt Fund", "debt-funds/10y-g-sec-fund/dcmgs-regular-growth"],
    ["DSP Banking and PSU Debt Fund", "debt-funds/banking-and-psu-debt-fund/dspbp-regular-growth"],
    ["DSP Medium Term Fund", "debt-funds/bond-fund/dspbd-regular-growth"],
    ["DSP Corporate Bond Fund", "debt-funds/corporate-bond-fund/dspcb-regular-growth"],
    ["DSP Credit Risk Fund", "debt-funds/credit-risk-fund/dspfr-regular-growth"],
    ["DSP CRISIL-IBX 50:50 Gilt Plus SDL - April 2033 Index Fund", "debt-funds/crisil-sdl-plus-g-sec-2033-index-fund/dcsdl-regular-growth"],
    ["DSP Floating Interest Rates Fund", "debt-funds/floater-fund/dfltr-regular-growth"],
    ["DSP Gilt Fund", "debt-funds/gilt-fund/dspga-regular-growth"],
    ["DSP Liquid Fund", "debt-funds/liquidity-fund/dsplq-regular-growth"],
    ["DSP Ultra Short to Short Term Fund", "debt-funds/low-duration-fund/dustf-regular-growth"],
    ["DSP Nifty SDL Plus G-Sec Sep 2027 50:50 Index Fund", "debt-funds/nifty-sdl-plus-g-sec-2027-index-fund/dnspg-regular-growth"],
    ["DSP Nifty SDL Plus G-Sec Jun 2028 30:70 Index Fund", "debt-funds/nifty-sdl-plus-g-sec-2028-index-fund/dnsdl-regular-growth"],
    ["DSP Overnight Fund", "debt-funds/overnight-fund/dspon-regular-growth"],
    ["DSP Money Market Fund", "debt-funds/savings-fund/dspgb-regular-growth"],
    ["DSP Short Term Fund", "debt-funds/short-duration-fund/dspst-regular-growth"],
    ["DSP Dynamic Term Fund", "debt-funds/strategic-bond-fund/dspsb-regular-growth"],
    ["DSP Ultra Short Term Fund", "debt-funds/ultra-short-term-fund/dsplp-regular-growth"],
    ["DSP Healthcare Fund", "equity-funds/Healthcare-fund/dspwh-regular-growth"],
    ["DSP Arbitrage fund", "equity-funds/arbitrage-fund/dabef-regular-growth"],
    ["DSP ELSS Tax Saver Fund", "equity-funds/elss-tax-saver-fund/dspts-regular-growth"],
    ["DSP Large & Mid Cap Fund", "equity-funds/equity-opportunities-fund/dspop-regular-growth"],
    ["DSP Flexi Cap Fund", "equity-funds/flexi-cap-fund/dspeq-regular-growth"],
    ["DSP Focused Fund", "equity-funds/focus-fund/dsp25-regular-growth"],
    ["DSP Midcap Fund", "equity-funds/mid-cap-fund/dspsm-regular-growth"],
    ["DSP Natural Resources And New Energy Fund", "equity-funds/natural-resources-and-new-energy-fund/dnrne-regular-growth"],
    ["DSP Nifty 50 Equal Weight Index Fund", "equity-funds/nifty-50-equal-weight-index-fund/den50-regular-growth"],
    ["DSP Nifty 50 Index Fund", "equity-funds/nifty-50-index-fund/dn50i-regular-growth"],
    ["DSP Nifty Midcap 150 Quality 50 Index Fund", "equity-funds/nifty-midcap-150-quality-50-index-fund/dnmoq-regular-growth"],
    ["DSP Nifty Next 50 Index Fund", "equity-funds/nifty-next-50-index-fund/dnn50-regular-growth"],
    ["DSP Quant Fund", "equity-funds/quant-fund/dquaf-regular-growth"],
    ["DSP Small Cap Fund", "equity-funds/small-cap-fund/dspmc-regular-growth"],
    ["DSP India T.I.G.E.R. Fund", "equity-funds/tiger-fund/dspti-regular-growth"],
    ["DSP Large Cap Fund", "equity-funds/top-100-equity-fund/dspte-regular-growth"],
    ["DSP Value Fund", "equity-funds/value-fund/dvalf-regular-growth"],
    ["DSP Aggressive Hybrid Fund", "hybrid-funds/aggressive-hybrid-fund/dspbl-regular-growth"],
    ["DSP Dynamic Asset Allocation Fund", "hybrid-funds/dynamic-asset-allocation-fund/ddaaf-regular-growth"],
    ["DSP Equity Savings Fund", "hybrid-funds/equity-savings-fund/deqsf-regular-growth"],
    ["DSP Conservative Hybrid Fund", "hybrid-funds/regular-savings-fund/dspag-regular-growth"],
    ["DSP Global Clean Energy Overseas Equity Omni FoF", "international-funds/Global-Clean-Energy-Fund-of-Fund/dspwe-regular-growth"],
    ["DSP Income Plus Arbitrage Omni FoF", "international-funds/global-allocation-fund-of-fund/dgaf-regular-growth"],
    ["DSP Global Innovation Overseas Equity Omni FoF", "international-funds/global-innovation-fund-of-fund/dgiof-regular-growth"],
    ["DSP US Specific Equity Omni FoF", "international-funds/us-flexible-equity-fund-of-fund/dspus-regular-growth"],
    ["DSP World Gold Mining Overseas Equity Omni FoF", "international-funds/world-gold-fund/dspwg-regular-growth"],
    ["DSP World Mining Overseas Equity Omni FoF", "international-funds/world-mining-fund-of-fund/dspwm-regular-growth"],
  ] as const).map(([name, path]) => [`DSP Mutual Fund|${name}|Growth`, DSP_SCHEMES + path]),
);

/** Fund-level documents keyed by `${amc}|${fund name}`. None verified yet. */
const fundDocuments: Record<string, Partial<Record<OfficialDocumentType, string>>> = {};

/** Resolve documents for a fund + selected option; most specific scope wins. */
export function resolveDocuments(amc: string, fundName: string, option: string): Partial<Record<OfficialDocumentType, OfficialDocument>> {
  const result: Partial<Record<OfficialDocumentType, OfficialDocument>> = {};
  const amcEntry = amcDocuments[amc];
  if (amcEntry) {
    for (const [type, doc] of Object.entries(amcEntry.common) as [OfficialDocumentType, { url: string; note?: string }][]) {
      result[type] = { type, scope: "amc", url: doc.url, note: doc.note, source: amcEntry.source, verified: true, verifiedOn: VERIFIED_ON };
    }
  }
  const source = amcEntry?.source ?? amc;
  for (const [type, url] of Object.entries(fundDocuments[`${amc}|${fundName}`] ?? {}) as [OfficialDocumentType, string][]) {
    result[type] = { type, scope: "fund", url, source, verified: true, verifiedOn: VERIFIED_ON };
  }
  const page = variantPages[`${amc}|${fundName}|${option}`];
  if (page) result.schemePage = { type: "schemePage", scope: "variant", url: page, source, verified: true, verifiedOn: VERIFIED_ON };
  return result;
}
