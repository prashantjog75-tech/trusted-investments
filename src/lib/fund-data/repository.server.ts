import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { freshnessStatus, type DataStatus } from "./domain";
import { funds as demonstrationFunds, type FundDocument, type FundRecord } from "@/lib/funds";

function publicClient() {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error("The public fund-data connection is not configured.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (async (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      }) as typeof fetch,
    },
  });
}

type SchemeRow = Database["public"]["Tables"]["schemes"]["Row"] & {
  fund_houses: { name: string } | null;
  data_providers: { code: string; name: string; freshness_hours: number } | null;
};
type BaseSchemeRow = Database["public"]["Tables"]["schemes"]["Row"];
type FundHouseRow = Pick<Database["public"]["Tables"]["fund_houses"]["Row"], "id" | "name">;
type ProviderRow = Pick<Database["public"]["Tables"]["data_providers"]["Row"], "id" | "code" | "name" | "freshness_hours">;
type ValueRow = Database["public"]["Tables"]["scheme_data_values"]["Row"];
type HoldingRow = Database["public"]["Tables"]["holdings"]["Row"];
type DocumentRow = Database["public"]["Tables"]["scheme_documents"]["Row"];

const documentDescriptions: Record<string, string> = {
  "Fact Sheet": "The latest official scheme factsheet published by the Asset Management Company.",
  KIM: "Key Information Memorandum with the scheme's essential terms and risk information.",
  SID: "Scheme Information Document covering the scheme's features, risks, fees and operation.",
  SAI: "Statement of Additional Information for the mutual fund and its statutory disclosures.",
  "Scheme Summary Document": "The official summary document for this scheme.",
  "Portfolio disclosure": "The official portfolio disclosure published by the Asset Management Company.",
};

function formatNumber(value: number | null, prefix = "") {
  return value === null ? "Not yet connected" : `${prefix}${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 }).format(value)}`;
}

function field(values: ValueRow[], name: string) {
  return values.find((value) => value.field_name === name);
}

function mapDocument(row: DocumentRow): FundDocument {
  const available = row.status === "available" && Boolean(row.official_url) && Boolean(row.last_successful_fetched_at);
  return {
    kind: row.document_type as FundDocument["kind"],
    description: documentDescriptions[row.document_type] ?? "Official scheme disclosure document.",
    status: available ? "available" : row.status === "stale" ? "stale" : "not-connected",
    ...(available && row.official_url ? { url: row.official_url } : {}),
    ...((row.source_effective_date ?? row.disclosure_date) ? { asOf: row.source_effective_date ?? row.disclosure_date as string } : {}),
    ...(row.last_successful_fetched_at ? { lastFetched: row.last_successful_fetched_at } : {}),
  };
}

function defaultDocuments(rows: DocumentRow[]): FundDocument[] {
  const kinds: FundDocument["kind"][] = ["Fact Sheet", "KIM", "SID", "SAI", "Scheme Summary Document", "Portfolio disclosure"];
  return kinds.map((kind) => {
    const row = rows.find((item) => item.document_type === kind);
    return row ? mapDocument(row) : { kind, description: documentDescriptions[kind] ?? "Official scheme disclosure document.", status: "not-connected" };
  });
}

function mapScheme(row: SchemeRow, values: ValueRow[], holdings: HoldingRow[], documents: DocumentRow[]): FundRecord {
  const nav = field(values, "nav");
  const expenseRatio = field(values, "expense_ratio");
  const aum = field(values, "aum");
  const freshnessHours = row.data_providers?.freshness_hours ?? 48;
  const dataStatus: DataStatus = row.is_demonstration
    ? "demonstration"
    : freshnessStatus(row.last_successful_fetched_at, freshnessHours);
  return {
    slug: row.slug,
    name: row.name,
    label: row.is_demonstration ? "Demonstration page" : dataStatus === "live" ? "Official source data" : dataStatus === "stale" ? "Stale source data" : "Source unavailable",
    dataStatus,
    isDemonstration: row.is_demonstration,
    category: row.category ?? "Category not available from the connected source",
    overview: row.is_demonstration
      ? "This demonstration page shows where verified scheme information will appear."
      : `${row.fund_houses?.name ?? "Fund house"} scheme information sourced from official/public data where available.`,
    objective: "Official investment objective not yet connected.",
    riskLevel: row.riskometer ?? "Official Risk-o-meter not yet connected",
    benchmark: row.benchmark ?? "Official benchmark not yet connected",
    planType: [row.plan, row.option_name].filter(Boolean).join(" · ") || "Plan and option data not yet connected",
    expenseRatio: expenseRatio?.display_value ?? "Not yet connected",
    nav: nav?.display_value ?? (typeof nav?.value_json === "number" ? formatNumber(nav.value_json, "₹") : "Not yet connected"),
    navAsOf: nav?.source_effective_date ?? row.source_effective_date ?? "Source date pending",
    aum: aum?.display_value ?? "Not yet connected",
    minimumInvestment: formatNumber(row.minimum_investment, "₹"),
    minimumSip: formatNumber(row.minimum_sip, "₹"),
    exitLoad: row.exit_load ?? "Not yet connected",
    holdingsAsOf: holdings[0]?.source_effective_date ?? "Official portfolio date pending",
    holdings: holdings.map((holding) => ({
      name: holding.security_name,
      sector: holding.sector ?? "Not reported",
      allocation: holding.allocation_percent === null ? "Not reported" : `${holding.allocation_percent}%`,
    })),
    commissionDisclosure: "Prashant Jog may receive commission from Asset Management Companies on mutual fund investments made through his distribution services. Scheme-specific commission information must be verified before investing.",
    documents: defaultDocuments(documents),
    sourceName: row.data_providers?.name ?? "Source not configured",
    ...(row.source_url ? { sourceUrl: row.source_url } : {}),
    ...(row.last_successful_fetched_at ? { lastUpdated: row.last_successful_fetched_at } : {}),
  };
}

async function enrichSchemes(client: ReturnType<typeof publicClient>, rows: BaseSchemeRow[]): Promise<SchemeRow[]> {
  const houseIds = [...new Set(rows.map((row) => row.fund_house_id))];
  const providerIds = [...new Set(rows.map((row) => row.source_provider_id).filter((id): id is string => Boolean(id)))];
  const [housesResult, providersResult] = await Promise.all([
    houseIds.length ? client.from("fund_houses").select("id,name").in("id", houseIds) : Promise.resolve({ data: [] as FundHouseRow[], error: null }),
    providerIds.length ? client.from("data_providers").select("id,code,name,freshness_hours").in("id", providerIds) : Promise.resolve({ data: [] as ProviderRow[], error: null }),
  ]);
  const lookupError = housesResult.error ?? providersResult.error;
  if (lookupError) throw new Error(`Unable to load fund sources: ${lookupError.message}`);
  const houses = new Map((housesResult.data ?? []).map((house) => [house.id, house]));
  const providers = new Map((providersResult.data ?? []).map((provider) => [provider.id, provider]));
  return rows.map((row) => ({
    ...row,
    fund_houses: houses.get(row.fund_house_id) ?? null,
    data_providers: row.source_provider_id ? providers.get(row.source_provider_id) ?? null : null,
  }));
}

export async function listFundRecords(): Promise<FundRecord[]> {
  const client = publicClient();
  const { data, error } = await client
    .from("schemes")
    .select("*")
    .eq("status", "active")
    .order("name")
    .limit(120);
  if (error) throw new Error(`Unable to load fund information: ${error.message}`);
  if (!data || data.length === 0) return demonstrationFunds;
  const schemes = await enrichSchemes(client, data);
  return schemes.map((row) => mapScheme(row, [], [], []));
}

export async function getFundRecord(slug: string): Promise<FundRecord | undefined> {
  const client = publicClient();
  const { data: scheme, error } = await client
    .from("schemes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Unable to load fund information: ${error.message}`);
  if (!scheme) return demonstrationFunds.find((item) => item.slug === slug);
  const [row] = await enrichSchemes(client, [scheme]);
  if (!row) return undefined;
  const [valuesResult, holdingsResult, documentsResult] = await Promise.all([
    client.from("scheme_data_values").select("*").eq("scheme_id", row.id),
    client.from("holdings").select("*").eq("scheme_id", row.id).order("allocation_percent", { ascending: false }),
    client.from("scheme_documents").select("*").eq("scheme_id", row.id),
  ]);
  const queryError = valuesResult.error ?? holdingsResult.error ?? documentsResult.error;
  if (queryError) throw new Error(`Unable to load scheme details: ${queryError.message}`);
  return mapScheme(row, valuesResult.data ?? [], holdingsResult.data ?? [], documentsResult.data ?? []);
}

export type PublicProviderStatus = {
  id: string;
  name: string;
  code: string;
  status: string;
  configured: boolean;
  enabled: boolean;
  officialUrl?: string;
  freshnessHours: number;
  schedule?: string;
  lastSuccessfulSyncAt?: string;
  nextScheduledSyncAt?: string;
  latestRun?: { status: string; startedAt: string; finishedAt?: string; created: number; updated: number; unchanged: number; failed: number };
};

export async function getPublicDataStatus() {
  const client = publicClient();
  const [providersResult, runsResult, schemesResult, docsResult] = await Promise.all([
    client.from("data_providers").select("*").order("name"),
    client.from("sync_runs").select("provider_id,status,started_at,finished_at,records_created,records_updated,records_unchanged,records_failed").order("started_at", { ascending: false }).limit(30),
    client.from("schemes").select("id,last_successful_fetched_at,is_demonstration,source_provider_id"),
    client.from("scheme_documents").select("id,status,official_url"),
  ]);
  const queryError = providersResult.error ?? runsResult.error ?? schemesResult.error ?? docsResult.error;
  if (queryError) throw new Error(`Unable to load data status: ${queryError.message}`);
  const runs = runsResult.data ?? [];
  const providers: PublicProviderStatus[] = (providersResult.data ?? []).map((provider) => {
    const latest = runs.find((run) => run.provider_id === provider.id);
    return {
      id: provider.id,
      name: provider.name,
      code: provider.code,
      status: provider.status,
      configured: provider.configured,
      enabled: provider.enabled,
      ...(provider.official_base_url ? { officialUrl: provider.official_base_url } : {}),
      freshnessHours: provider.freshness_hours,
      ...(provider.schedule_cron ? { schedule: provider.schedule_cron } : {}),
      ...(provider.last_successful_sync_at ? { lastSuccessfulSyncAt: provider.last_successful_sync_at } : {}),
      ...(provider.next_scheduled_sync_at ? { nextScheduledSyncAt: provider.next_scheduled_sync_at } : {}),
      ...(latest ? { latestRun: { status: latest.status, startedAt: latest.started_at, ...(latest.finished_at ? { finishedAt: latest.finished_at } : {}), created: latest.records_created, updated: latest.records_updated, unchanged: latest.records_unchanged, failed: latest.records_failed } } : {}),
    };
  });
  const schemes = schemesResult.data ?? [];
  const staleSchemes = schemes.filter((scheme) => {
    if (scheme.is_demonstration) return false;
    const provider = providers.find((item) => item.id === scheme.source_provider_id);
    return freshnessStatus(scheme.last_successful_fetched_at, provider?.freshnessHours ?? 48) === "stale";
  }).length;
  return {
    providers,
    schemeCount: schemes.filter((scheme) => !scheme.is_demonstration).length,
    staleSchemes,
    missingDocuments: (docsResult.data ?? []).filter((doc) => doc.status !== "available" || !doc.official_url).length,
    schedulerActive: providers.some((provider) => Boolean(provider.nextScheduledSyncAt)),
  };
}