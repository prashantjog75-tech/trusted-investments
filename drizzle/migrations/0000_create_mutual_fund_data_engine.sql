CREATE TABLE public.data_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  provider_type text NOT NULL CHECK (provider_type IN ('amfi_nav','sebi_filings','amc_documents','custom')),
  official_base_url text,
  enabled boolean NOT NULL DEFAULT false,
  configured boolean NOT NULL DEFAULT false,
  schedule_cron text,
  freshness_hours integer NOT NULL DEFAULT 48 CHECK (freshness_hours > 0),
  status text NOT NULL DEFAULT 'not_configured' CHECK (status IN ('active','disabled','not_configured','error')),
  last_successful_sync_at timestamptz,
  next_scheduled_sync_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.data_providers TO anon, authenticated;
GRANT ALL ON public.data_providers TO service_role;
ALTER TABLE public.data_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read provider status" ON public.data_providers FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.fund_houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  amfi_name text,
  official_website_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','unverified')),
  source_provider_id uuid REFERENCES public.data_providers(id),
  source_url text,
  fetched_at timestamptz,
  last_successful_fetched_at timestamptz,
  source_effective_date date,
  sync_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fund_houses TO anon, authenticated;
GRANT ALL ON public.fund_houses TO service_role;
ALTER TABLE public.fund_houses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read fund houses" ON public.fund_houses FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_house_id uuid NOT NULL REFERENCES public.fund_houses(id),
  amfi_scheme_code text UNIQUE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  plan text,
  option_name text,
  isin_payout_or_growth text,
  isin_reinvestment text,
  category text,
  sub_category text,
  benchmark text,
  riskometer text,
  exit_load text,
  minimum_investment numeric,
  minimum_sip numeric,
  fund_manager text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','merged','unverified')),
  is_demonstration boolean NOT NULL DEFAULT false,
  source_provider_id uuid REFERENCES public.data_providers(id),
  source_url text,
  fetched_at timestamptz,
  last_successful_fetched_at timestamptz,
  source_effective_date date,
  sync_run_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schemes TO anon, authenticated;
GRANT ALL ON public.schemes TO service_role;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read schemes" ON public.schemes FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX schemes_fund_house_idx ON public.schemes(fund_house_id);
CREATE INDEX schemes_name_idx ON public.schemes(name);

CREATE TABLE public.sync_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.data_providers(id),
  trigger_type text NOT NULL DEFAULT 'manual' CHECK (trigger_type IN ('manual','scheduled','retry')),
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running','succeeded','partial','failed','skipped')),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  source_url text,
  records_created integer NOT NULL DEFAULT 0,
  records_updated integer NOT NULL DEFAULT 0,
  records_unchanged integer NOT NULL DEFAULT 0,
  records_failed integer NOT NULL DEFAULT 0,
  failed_source_count integer NOT NULL DEFAULT 0,
  error_summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sync_runs TO anon, authenticated;
GRANT ALL ON public.sync_runs TO service_role;
ALTER TABLE public.sync_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read sync summaries" ON public.sync_runs FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX sync_runs_provider_started_idx ON public.sync_runs(provider_id, started_at DESC);

ALTER TABLE public.fund_houses ADD CONSTRAINT fund_houses_sync_run_fk FOREIGN KEY (sync_run_id) REFERENCES public.sync_runs(id);
ALTER TABLE public.schemes ADD CONSTRAINT schemes_sync_run_fk FOREIGN KEY (sync_run_id) REFERENCES public.sync_runs(id);

CREATE TABLE public.scheme_data_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id uuid NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  value_json jsonb NOT NULL,
  display_value text,
  provider_id uuid NOT NULL REFERENCES public.data_providers(id),
  source_url text NOT NULL,
  fetched_at timestamptz NOT NULL,
  last_successful_fetched_at timestamptz NOT NULL,
  source_effective_date date,
  sync_run_id uuid NOT NULL REFERENCES public.sync_runs(id),
  status text NOT NULL DEFAULT 'verified' CHECK (status IN ('verified','stale','unavailable','not_configured')),
  checksum text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scheme_id, field_name, provider_id)
);
GRANT SELECT ON public.scheme_data_values TO anon, authenticated;
GRANT ALL ON public.scheme_data_values TO service_role;
ALTER TABLE public.scheme_data_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read scheme values" ON public.scheme_data_values FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX scheme_values_scheme_idx ON public.scheme_data_values(scheme_id);

CREATE TABLE public.nav_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id uuid NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  nav numeric NOT NULL CHECK (nav >= 0),
  nav_date date NOT NULL,
  provider_id uuid NOT NULL REFERENCES public.data_providers(id),
  source_url text NOT NULL,
  fetched_at timestamptz NOT NULL,
  sync_run_id uuid NOT NULL REFERENCES public.sync_runs(id),
  checksum text,
  UNIQUE (scheme_id, nav_date, provider_id)
);
GRANT SELECT ON public.nav_history TO anon, authenticated;
GRANT ALL ON public.nav_history TO service_role;
ALTER TABLE public.nav_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read NAV history" ON public.nav_history FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX nav_history_scheme_date_idx ON public.nav_history(scheme_id, nav_date DESC);

CREATE TABLE public.holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id uuid NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  security_name text NOT NULL,
  isin text,
  sector text,
  allocation_percent numeric CHECK (allocation_percent >= 0 AND allocation_percent <= 100),
  provider_id uuid NOT NULL REFERENCES public.data_providers(id),
  source_url text NOT NULL,
  fetched_at timestamptz NOT NULL,
  last_successful_fetched_at timestamptz NOT NULL,
  source_effective_date date,
  sync_run_id uuid NOT NULL REFERENCES public.sync_runs(id),
  status text NOT NULL DEFAULT 'verified' CHECK (status IN ('verified','stale','unavailable','not_configured')),
  checksum text,
  UNIQUE (scheme_id, security_name, source_effective_date, provider_id)
);
GRANT SELECT ON public.holdings TO anon, authenticated;
GRANT ALL ON public.holdings TO service_role;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read holdings" ON public.holdings FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.scheme_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id uuid NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  allocation_type text NOT NULL CHECK (allocation_type IN ('asset','sector','market_cap')),
  label text NOT NULL,
  allocation_percent numeric NOT NULL CHECK (allocation_percent >= 0 AND allocation_percent <= 100),
  provider_id uuid NOT NULL REFERENCES public.data_providers(id),
  source_url text NOT NULL,
  fetched_at timestamptz NOT NULL,
  last_successful_fetched_at timestamptz NOT NULL,
  source_effective_date date,
  sync_run_id uuid NOT NULL REFERENCES public.sync_runs(id),
  status text NOT NULL DEFAULT 'verified' CHECK (status IN ('verified','stale','unavailable','not_configured')),
  checksum text,
  UNIQUE (scheme_id, allocation_type, label, source_effective_date, provider_id)
);
GRANT SELECT ON public.scheme_allocations TO anon, authenticated;
GRANT ALL ON public.scheme_allocations TO service_role;
ALTER TABLE public.scheme_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read allocations" ON public.scheme_allocations FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.scheme_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id uuid REFERENCES public.schemes(id) ON DELETE CASCADE,
  fund_house_id uuid REFERENCES public.fund_houses(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('SID','KIM','SAI','Scheme Summary Document','Fact Sheet','Portfolio disclosure','Other')),
  title text NOT NULL,
  official_url text,
  provider_id uuid NOT NULL REFERENCES public.data_providers(id),
  source_url text,
  fetched_at timestamptz,
  last_successful_fetched_at timestamptz,
  source_effective_date date,
  disclosure_date date,
  sync_run_id uuid REFERENCES public.sync_runs(id),
  status text NOT NULL DEFAULT 'not_configured' CHECK (status IN ('available','stale','unavailable','not_configured','validation_failed')),
  checksum text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (scheme_id IS NOT NULL OR fund_house_id IS NOT NULL),
  CHECK (status <> 'available' OR (official_url IS NOT NULL AND last_successful_fetched_at IS NOT NULL))
);
GRANT SELECT ON public.scheme_documents TO anon, authenticated;
GRANT ALL ON public.scheme_documents TO service_role;
ALTER TABLE public.scheme_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read scheme documents" ON public.scheme_documents FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX scheme_documents_scheme_idx ON public.scheme_documents(scheme_id);

CREATE TABLE public.sync_failures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_run_id uuid NOT NULL REFERENCES public.sync_runs(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.data_providers(id),
  source_url text,
  error_category text NOT NULL,
  error_message text NOT NULL,
  affected_record_key text,
  affected_record_count integer NOT NULL DEFAULT 0,
  retry_status text NOT NULL DEFAULT 'pending' CHECK (retry_status IN ('pending','retrying','resolved','abandoned')),
  occurred_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sync_failures TO authenticated;
GRANT ALL ON public.sync_failures TO service_role;
ALTER TABLE public.sync_failures ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.source_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.data_providers(id),
  sync_run_id uuid NOT NULL REFERENCES public.sync_runs(id) ON DELETE CASCADE,
  source_url text NOT NULL,
  fetched_at timestamptz NOT NULL,
  checksum text NOT NULL,
  content_type text,
  record_count integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (provider_id, checksum)
);
GRANT SELECT ON public.source_snapshots TO authenticated;
GRANT ALL ON public.source_snapshots TO service_role;
ALTER TABLE public.source_snapshots ENABLE ROW LEVEL SECURITY;