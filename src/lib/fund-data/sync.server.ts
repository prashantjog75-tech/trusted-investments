import { createHash } from "crypto";
import { AmfiNavProvider } from "./providers/amfi";
import { mergeNavRecords, type StoredNav } from "./ingestion";

const CHUNK_SIZE = 400;

function chunks<T>(items: T[], size = CHUNK_SIZE) {
  const output: T[][] = [];
  for (let index = 0; index < items.length; index += size) output.push(items.slice(index, index + size));
  return output;
}

export async function runAmfiSync(triggerType: "manual" | "scheduled" | "retry" = "scheduled") {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const providerAdapter = new AmfiNavProvider();
  const { data: provider, error: providerError } = await supabaseAdmin.from("data_providers").select("*").eq("code", "amfi-nav").single();
  if (providerError || !provider) throw new Error(providerError?.message ?? "AMFI provider is not registered");
  if (!provider.enabled || !provider.configured) return { ok: false, status: "skipped", message: "AMFI provider is disabled or not configured" } as const;
  const { data: run, error: runError } = await supabaseAdmin.from("sync_runs").insert({ provider_id: provider.id, trigger_type: triggerType, status: "running", source_url: providerAdapter.config.sourceUrl ?? null }).select("id").single();
  if (runError || !run) throw new Error(runError?.message ?? "Unable to start sync run");

  const fail = async (category: string, message: string, sourceUrl?: string) => {
    await supabaseAdmin.from("sync_failures").insert({ sync_run_id: run.id, provider_id: provider.id, source_url: sourceUrl ?? null, error_category: category, error_message: message, affected_record_count: 0 });
    await supabaseAdmin.from("sync_runs").update({ status: "failed", finished_at: new Date().toISOString(), records_failed: 1, failed_source_count: 1, error_summary: "The source could not be refreshed; previously verified values were preserved." }).eq("id", run.id);
    await supabaseAdmin.from("data_providers").update({ status: "error", updated_at: new Date().toISOString() }).eq("id", provider.id);
    return { ok: false, status: "failed", message } as const;
  };

  const result = await providerAdapter.fetchAndNormalize();
  if (!result.ok) return fail(result.category, result.message, result.sourceUrl);
  try {
    const fetchedAt = result.fetchedAt;
    const snapshotChecksum = createHash("sha256").update(result.records.map((record) => record.provenance.checksum).join("|")).digest("hex");
    await supabaseAdmin.from("source_snapshots").upsert({ provider_id: provider.id, sync_run_id: run.id, source_url: result.sourceUrl, fetched_at: fetchedAt, checksum: snapshotChecksum, content_type: "text/plain", record_count: result.records.length, metadata: { format: "AMFI NAVAll.txt", payloadStored: false } }, { onConflict: "provider_id,checksum", ignoreDuplicates: true });

    const houseNames = [...new Set(result.records.map((record) => record.fundHouse))];
    for (const batch of chunks(houseNames)) {
      const { error } = await supabaseAdmin.from("fund_houses").upsert(batch.map((name) => ({ name, amfi_name: name, source_provider_id: provider.id, source_url: result.sourceUrl, fetched_at: fetchedAt, last_successful_fetched_at: fetchedAt, sync_run_id: run.id, status: "active" })), { onConflict: "name", defaultToNull: false });
      if (error) throw error;
    }
    const { data: houses, error: housesError } = await supabaseAdmin.from("fund_houses").select("id,name").in("name", houseNames);
    if (housesError) throw housesError;
    const houseIds = new Map((houses ?? []).map((house) => [house.name, house.id]));
    const schemeRows = result.records.flatMap((record) => {
      const houseId = houseIds.get(record.fundHouse);
      if (!houseId) return [];
      return [{ fund_house_id: houseId, amfi_scheme_code: record.schemeCode, slug: `${record.schemeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72)}-${record.schemeCode.toLowerCase()}`, name: record.schemeName, ...(record.plan ? { plan: record.plan } : {}), ...(record.option ? { option_name: record.option } : {}), ...(record.isinGrowth ? { isin_payout_or_growth: record.isinGrowth } : {}), ...(record.isinReinvestment ? { isin_reinvestment: record.isinReinvestment } : {}), ...(record.category ? { category: record.category } : {}), source_provider_id: provider.id, source_url: result.sourceUrl, fetched_at: fetchedAt, last_successful_fetched_at: fetchedAt, source_effective_date: record.navDate, sync_run_id: run.id, status: "active", is_demonstration: false }];
    });
    const codes = schemeRows.map((row) => row.amfi_scheme_code);
    const existingRows: StoredNav[] = [];
    for (const batch of chunks(codes)) {
      const { data, error } = await supabaseAdmin.from("schemes").select("id,amfi_scheme_code,name,plan,option_name,isin_payout_or_growth,isin_reinvestment,category,source_url,fetched_at,last_successful_fetched_at,source_effective_date,sync_run_id").in("amfi_scheme_code", batch);
      if (error) throw error;
      const ids = (data ?? []).map((item) => item.id);
      const { data: navValues, error: navError } = ids.length ? await supabaseAdmin.from("scheme_data_values").select("scheme_id,value_json,source_effective_date,checksum").eq("field_name", "nav").in("scheme_id", ids) : { data: [], error: null };
      if (navError) throw navError;
      const navByScheme = new Map((navValues ?? []).map((item) => [item.scheme_id, item]));
      for (const item of data ?? []) {
        const navValue = navByScheme.get(item.id);
        const nav = typeof navValue?.value_json === "number" ? navValue.value_json : Number(navValue?.value_json ?? 0);
        existingRows.push({ id: item.id, schemeCode: item.amfi_scheme_code ?? "", schemeName: item.name, ...(item.plan ? { plan: item.plan } : {}), ...(item.option_name ? { option: item.option_name } : {}), ...(item.isin_payout_or_growth ? { isinGrowth: item.isin_payout_or_growth } : {}), ...(item.isin_reinvestment ? { isinReinvestment: item.isin_reinvestment } : {}), ...(item.category ? { category: item.category } : {}), nav, navDate: navValue?.source_effective_date ?? item.source_effective_date ?? "", fundHouse: "", provenance: { providerCode: "amfi-nav", sourceUrl: item.source_url ?? result.sourceUrl, fetchedAt: item.last_successful_fetched_at ?? item.fetched_at ?? fetchedAt, status: "live", ...(navValue?.checksum ? { checksum: navValue.checksum } : {}) } });
      }
    }
    const { stats } = mergeNavRecords(existingRows, result.records);
    for (const batch of chunks(schemeRows)) {
      const { error } = await supabaseAdmin.from("schemes").upsert(batch, { onConflict: "amfi_scheme_code", defaultToNull: false });
      if (error) throw error;
    }
    const schemeIds = new Map<string, string>();
    for (const batch of chunks(codes)) {
      const { data, error } = await supabaseAdmin.from("schemes").select("id,amfi_scheme_code").in("amfi_scheme_code", batch);
      if (error) throw error;
      for (const item of data ?? []) if (item.amfi_scheme_code) schemeIds.set(item.amfi_scheme_code, item.id);
    }
    const navValues = result.records.flatMap((record) => {
      const schemeId = schemeIds.get(record.schemeCode);
      return schemeId ? [{ scheme_id: schemeId, field_name: "nav", value_json: record.nav, display_value: `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 }).format(record.nav)}`, provider_id: provider.id, source_url: result.sourceUrl, fetched_at: fetchedAt, last_successful_fetched_at: fetchedAt, source_effective_date: record.navDate, sync_run_id: run.id, status: "verified", checksum: record.provenance.checksum ?? null }] : [];
    });
    const navHistory = result.records.flatMap((record) => {
      const schemeId = schemeIds.get(record.schemeCode);
      return schemeId ? [{ scheme_id: schemeId, nav: record.nav, nav_date: record.navDate, provider_id: provider.id, source_url: result.sourceUrl, fetched_at: fetchedAt, sync_run_id: run.id, checksum: record.provenance.checksum ?? null }] : [];
    });
    for (const batch of chunks(navValues)) {
      const { error } = await supabaseAdmin.from("scheme_data_values").upsert(batch, { onConflict: "scheme_id,field_name,provider_id", defaultToNull: false });
      if (error) throw error;
    }
    for (const batch of chunks(navHistory)) {
      const { error } = await supabaseAdmin.from("nav_history").upsert(batch, { onConflict: "scheme_id,nav_date,provider_id", ignoreDuplicates: true });
      if (error) throw error;
    }
    const finishedAt = new Date().toISOString();
    await supabaseAdmin.from("sync_runs").update({ status: stats.failed ? "partial" : "succeeded", finished_at: finishedAt, records_created: stats.created, records_updated: stats.updated, records_unchanged: stats.unchanged, records_failed: stats.failed }).eq("id", run.id);
    await supabaseAdmin.from("data_providers").update({ status: "active", last_successful_sync_at: finishedAt, updated_at: finishedAt }).eq("id", provider.id);
    return { ok: true, status: stats.failed ? "partial" : "succeeded", runId: run.id, stats } as const;
  } catch (error) {
    return fail("persistence", error instanceof Error ? error.message : "Unable to persist AMFI data", result.sourceUrl);
  }
}