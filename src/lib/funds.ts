export type FundDocumentKind = "Fact Sheet" | "KIM" | "SID" | "SAI";

export type FundDocument = {
  kind: FundDocumentKind;
  description: string;
  status: "not-connected";
  url?: string;
  asOf?: string;
};

export type FundHolding = {
  name: string;
  sector: string;
  allocation: string;
};

export type FundRecord = {
  slug: string;
  name: string;
  label: string;
  category: string;
  overview: string;
  objective: string;
  riskLevel: string;
  benchmark: string;
  planType: string;
  expenseRatio: string;
  nav: string;
  navAsOf: string;
  minimumInvestment: string;
  exitLoad: string;
  holdingsAsOf: string;
  holdings: FundHolding[];
  commissionDisclosure: string;
  documents: FundDocument[];
};

const placeholderDocuments: FundDocument[] = [
  {
    kind: "Fact Sheet",
    description: "The latest official scheme factsheet published by the Asset Management Company.",
    status: "not-connected",
  },
  {
    kind: "KIM",
    description: "Key Information Memorandum with the scheme's essential terms and risk information.",
    status: "not-connected",
  },
  {
    kind: "SID",
    description: "Scheme Information Document covering the scheme's features, risks, fees and operation.",
    status: "not-connected",
  },
  {
    kind: "SAI",
    description: "Statement of Additional Information for the mutual fund and its statutory disclosures.",
    status: "not-connected",
  },
];

export const funds: FundRecord[] = [
  {
    slug: "sample-equity-scheme",
    name: "Sample Equity Scheme",
    label: "Demonstration page",
    category: "Category pending verified source",
    overview:
      "This sample page demonstrates how verified scheme information will be organised. It does not represent an actual mutual fund scheme or an investment recommendation.",
    objective: "Official investment objective not yet connected.",
    riskLevel: "Official Risk-o-meter not yet connected",
    benchmark: "Official benchmark not yet connected",
    planType: "Plan and option data not yet connected",
    expenseRatio: "Not yet connected",
    nav: "Not yet connected",
    navAsOf: "Source date pending",
    minimumInvestment: "Not yet connected",
    exitLoad: "Not yet connected",
    holdingsAsOf: "Official portfolio date pending",
    holdings: [],
    commissionDisclosure:
      "Prashant Jog may receive commission from Asset Management Companies on mutual fund investments made through his distribution services. Scheme-specific commission information is not yet connected and must be verified before publication.",
    documents: placeholderDocuments,
  },
  {
    slug: "sample-debt-scheme",
    name: "Sample Debt Scheme",
    label: "Demonstration page",
    category: "Category pending verified source",
    overview:
      "This sample page demonstrates the structure for official scheme information and documents. It is not an actual offer, recommendation, or performance representation.",
    objective: "Official investment objective not yet connected.",
    riskLevel: "Official Risk-o-meter not yet connected",
    benchmark: "Official benchmark not yet connected",
    planType: "Plan and option data not yet connected",
    expenseRatio: "Not yet connected",
    nav: "Not yet connected",
    navAsOf: "Source date pending",
    minimumInvestment: "Not yet connected",
    exitLoad: "Not yet connected",
    holdingsAsOf: "Official portfolio date pending",
    holdings: [],
    commissionDisclosure:
      "Prashant Jog may receive commission from Asset Management Companies on mutual fund investments made through his distribution services. Scheme-specific commission information is not yet connected and must be verified before publication.",
    documents: placeholderDocuments,
  },
  {
    slug: "sample-hybrid-scheme",
    name: "Sample Hybrid Scheme",
    label: "Demonstration page",
    category: "Category pending verified source",
    overview:
      "This sample page shows where verified portfolio, cost, disclosure and statutory-document data will appear. It is not an actual mutual fund listing.",
    objective: "Official investment objective not yet connected.",
    riskLevel: "Official Risk-o-meter not yet connected",
    benchmark: "Official benchmark not yet connected",
    planType: "Plan and option data not yet connected",
    expenseRatio: "Not yet connected",
    nav: "Not yet connected",
    navAsOf: "Source date pending",
    minimumInvestment: "Not yet connected",
    exitLoad: "Not yet connected",
    holdingsAsOf: "Official portfolio date pending",
    holdings: [],
    commissionDisclosure:
      "Prashant Jog may receive commission from Asset Management Companies on mutual fund investments made through his distribution services. Scheme-specific commission information is not yet connected and must be verified before publication.",
    documents: placeholderDocuments,
  },
];

export function getFund(slug: string) {
  return funds.find((fund) => fund.slug === slug);
}