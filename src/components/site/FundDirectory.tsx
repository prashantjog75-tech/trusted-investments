import { useDeferredValue, useMemo, useState } from "react";
import { ExternalLink, FileText, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AMFI_SNAPSHOT_DATE, AMFI_SNAPSHOT_SOURCE, staticSchemes, type StaticSchemeRecord } from "@/lib/fund-data/amfi-snapshot";

const ALL = "__all__";
const PAGE_SIZE = 48;

type Filters = {
  amc: string;
  category: string;
  scheme: string;
  option: string;
  search: string;
};

const initialFilters: Filters = { amc: ALL, category: ALL, scheme: "", option: ALL, search: "" };

type FundRecord = {
  id: string;
  amc: string;
  name: string;
  category: string;
  options: string[];
};

const funds: readonly FundRecord[] = (() => {
  const grouped = new Map<string, FundRecord>();
  for (const scheme of staticSchemes) {
    const id = `${scheme.amc}\u0000${scheme.category}\u0000${scheme.name}`;
    const current = grouped.get(id);
    if (current) {
      if (!current.options.includes(scheme.option)) current.options.push(scheme.option);
      continue;
    }
    grouped.set(id, { id, amc: scheme.amc, name: scheme.name, category: scheme.category, options: [scheme.option] });
  }
  return [...grouped.values()]
    .map((fund) => ({ ...fund, options: fund.options.sort((a, b) => a.localeCompare(b)) }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();

function unique(field: "amc" | "category") {
  return [...new Set(funds.map((fund) => fund[field]))].sort((a, b) => a.localeCompare(b));
}

const options = {
  amcs: unique("amc"),
  categories: unique("category"),
  options: [...new Set(funds.flatMap((fund) => fund.options))].sort((a, b) => a.localeCompare(b)),
};

export function FundDirectory() {
  const [filters, setFilters] = useState(initialFilters);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const deferredScheme = useDeferredValue(filters.scheme.trim().toLocaleLowerCase("en-IN"));
  const deferredSearch = useDeferredValue(filters.search.trim().toLocaleLowerCase("en-IN"));

  const filtered = useMemo(() => funds.filter((fund) => {
    if (filters.amc !== ALL && fund.amc !== filters.amc) return false;
    if (filters.category !== ALL && fund.category !== filters.category) return false;
    if (filters.option !== ALL && !fund.options.includes(filters.option)) return false;
    if (deferredScheme && !fund.name.toLocaleLowerCase("en-IN").includes(deferredScheme)) return false;
    if (deferredSearch) {
      const haystack = `${fund.name} ${fund.amc}`.toLocaleLowerCase("en-IN");
      if (!haystack.includes(deferredSearch)) return false;
    }
    return true;
  }), [deferredScheme, deferredSearch, filters.amc, filters.category, filters.option]);

  const update = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="mt-10">
      <section aria-labelledby="directory-filters" className="border-y border-border bg-card px-5 py-7 shadow-soft md:px-7">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-5 w-5 text-gold" aria-hidden="true" />
          <h2 id="directory-filters" className="text-2xl font-medium">Refine the directory</h2>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <DirectorySelect label="AMC / Fund House" value={filters.amc} options={options.amcs} onChange={(value) => update("amc", value)} />
          <DirectorySelect label="Scheme Category" value={filters.category} options={options.categories} onChange={(value) => update("category", value)} />
          <DirectoryField label="Scheme Name" value={filters.scheme} placeholder="Filter by scheme name" onChange={(value) => update("scheme", value)} />
          <DirectorySelect label="Option" value={filters.option} options={options.options} onChange={(value) => update("option", value)} />
          <DirectoryField label="Search scheme or AMC name" value={filters.search} placeholder="Search the directory" icon onChange={(value) => update("search", value)} />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={() => { setFilters(initialFilters); setVisible(PAGE_SIZE); }}>
            <RotateCcw aria-hidden="true" /> Reset filters
          </Button>
        </div>
      </section>

      <div className="mt-9 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
           <p className="text-xs font-semibold uppercase text-gold" aria-live="polite">Showing {filtered.length.toLocaleString("en-IN")} unique funds</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Expense ratios are subject to change. Investors should refer to the official AMC website and scheme-related documents for the latest information.</p>
        </div>
        <a className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary underline decoration-gold underline-offset-4" href={AMFI_SNAPSHOT_SOURCE} target="_blank" rel="noopener noreferrer">
          Official AMFI source <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      {filtered.length ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
           {filtered.slice(0, visible).map((fund) => <FundCard key={fund.id} fund={fund} selectedOption={filters.option} />)}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-border bg-card px-6 py-14 text-center">
          <Search className="mx-auto h-7 w-7 text-gold" aria-hidden="true" />
           <h3 className="mt-4 text-2xl font-medium">No matching funds</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try a broader search or reset the filters.</p>
        </div>
      )}

      {visible < filtered.length && (
        <div className="mt-8 text-center">
           <Button type="button" variant="outline" size="lg" onClick={() => setVisible((current) => current + PAGE_SIZE)}>Show more funds</Button>
        </div>
      )}

      <div className="mt-12 border-l-2 border-gold bg-gold-soft/30 px-5 py-5 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">General information only.</strong> This information is provided for general awareness and mutual fund distribution purposes only. It does not constitute investment advice or a recommendation. Investors should refer to official scheme-related documents before investing.
        <span className="mt-2 block text-xs">Scheme identity snapshot: official AMFI Complete NAV Report, {AMFI_SNAPSHOT_DATE}. Official expense-ratio and statutory-document links are shown only when verified URLs are available in the scheme data.</span>
      </div>
    </div>
  );
}

function DirectorySelect({ label, value, options: values, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const id = label.toLocaleLowerCase("en-IN").replace(/[^a-z]+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-11 bg-background"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value={ALL}>All</SelectItem>{values.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function DirectoryField({ label, value, placeholder, icon = false, onChange }: { label: string; value: string; placeholder: string; icon?: boolean; onChange: (value: string) => void }) {
  const id = label.toLocaleLowerCase("en-IN").replace(/[^a-z]+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {icon && <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />}
        <Input id={id} value={value} onChange={(event) => onChange(event.target.value.slice(0, 120))} placeholder={placeholder} className={`h-11 bg-background ${icon ? "pl-9" : ""}`} />
      </div>
    </div>
  );
}

function FundCard({ fund, selectedOption }: { fund: FundRecord; selectedOption: string }) {
  const availableOptions = selectedOption === ALL ? fund.options : fund.options.filter((option) => option === selectedOption);
  const [option, setOption] = useState(availableOptions[0] ?? fund.options[0] ?? "Not specified");
  const activeOption = availableOptions.includes(option) ? option : (availableOptions[0] ?? fund.options[0] ?? "Not specified");
  return (
    <article className="flex h-full flex-col border border-border bg-card p-5 shadow-soft md:p-6">
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <SchemeDatum label="Fund house" value={fund.amc} />
        <SchemeDatum label="Fund name" value={fund.name} prominent />
        <SchemeDatum label="Category" value={fund.category} />
      </dl>
      <div className="mt-5 max-w-sm space-y-2">
        <Label htmlFor={`option-${safeId(fund.id)}`}>Option</Label>
        {availableOptions.length > 1 ? (
          <Select value={activeOption} onValueChange={setOption}>
            <SelectTrigger id={`option-${safeId(fund.id)}`} className="h-11 bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>{availableOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
          </Select>
        ) : <p id={`option-${safeId(fund.id)}`} className="text-sm text-foreground">{activeOption}</p>}
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gold"><FileText className="h-4 w-4" aria-hidden="true" /> Official sources &amp; documents</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <UnavailableDocument label="View Official Expense Ratio" />
          <UnavailableDocument label="SID / KIM" />
          <UnavailableDocument label="Statutory Disclosures" />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Verified scheme-specific official URLs are not available in the current AMFI data.</p>
      </div>
    </article>
  );
}

function safeId(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = Math.imul(31, hash) + value.charCodeAt(index) | 0;
  return Math.abs(hash).toString(36);
}

function SchemeDatum({ label, value, prominent = false }: { label: string; value: string; prominent?: boolean }) {
  return <div className={prominent ? "sm:col-span-2" : ""}><dt className="text-xs font-semibold uppercase text-muted-foreground">{label}</dt><dd className={`mt-1 leading-snug ${prominent ? "font-display text-xl font-medium" : "text-sm"}`}>{value}</dd></div>;
}

function UnavailableDocument({ label }: { label: string }) {
  return <Button type="button" variant="secondary" size="sm" disabled title="Verified official URL not supplied">{label}</Button>;
}