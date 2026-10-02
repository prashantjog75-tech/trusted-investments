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

function unique(field: keyof Pick<StaticSchemeRecord, "amc" | "category" | "option">) {
  return [...new Set(staticSchemes.map((scheme) => scheme[field]))].sort((a, b) => a.localeCompare(b));
}

const options = {
  amcs: unique("amc"),
  categories: unique("category"),
  options: unique("option"),
};

export function FundDirectory() {
  const [filters, setFilters] = useState(initialFilters);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const deferredScheme = useDeferredValue(filters.scheme.trim().toLocaleLowerCase("en-IN"));
  const deferredSearch = useDeferredValue(filters.search.trim().toLocaleLowerCase("en-IN"));

  const filtered = useMemo(() => staticSchemes.filter((scheme) => {
    if (filters.amc !== ALL && scheme.amc !== filters.amc) return false;
    if (filters.category !== ALL && scheme.category !== filters.category) return false;
    if (filters.plan !== ALL && scheme.plan !== filters.plan) return false;
    if (filters.option !== ALL && scheme.option !== filters.option) return false;
    // (plan filter removed: the snapshot contains Regular Plan entries only)
    if (deferredScheme && !scheme.name.toLocaleLowerCase("en-IN").includes(deferredScheme)) return false;
    if (deferredSearch) {
      const haystack = `${scheme.name} ${scheme.amc}`.toLocaleLowerCase("en-IN");
      if (!haystack.includes(deferredSearch)) return false;
    }
    return true;
  }), [deferredScheme, deferredSearch, filters.amc, filters.category, filters.option, filters.plan]);

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
          <DirectorySelect label="Plan Type" value={filters.plan} options={options.plans} onChange={(value) => update("plan", value)} />
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
          <p className="text-xs font-semibold uppercase text-gold" aria-live="polite">Showing {filtered.length.toLocaleString("en-IN")} scheme entries</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Expense ratios are subject to change. Investors should refer to the official AMC website and scheme-related documents for the latest information.</p>
        </div>
        <a className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary underline decoration-gold underline-offset-4" href={AMFI_SNAPSHOT_SOURCE} target="_blank" rel="noopener noreferrer">
          Official AMFI source <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      {filtered.length ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.slice(0, visible).map((scheme, index) => <SchemeCard key={`${scheme.amc}-${scheme.name}-${scheme.plan}-${scheme.option}-${index}`} scheme={scheme} />)}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-border bg-card px-6 py-14 text-center">
          <Search className="mx-auto h-7 w-7 text-gold" aria-hidden="true" />
          <h3 className="mt-4 text-2xl font-medium">No matching scheme entries</h3>
          <p className="mt-2 text-sm text-muted-foreground">Try a broader search or reset the filters.</p>
        </div>
      )}

      {visible < filtered.length && (
        <div className="mt-8 text-center">
          <Button type="button" variant="outline" size="lg" onClick={() => setVisible((current) => current + PAGE_SIZE)}>Show more schemes</Button>
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

function SchemeCard({ scheme }: { scheme: StaticSchemeRecord }) {
  return (
    <article className="flex h-full flex-col border border-border bg-card p-5 shadow-soft md:p-6">
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <SchemeDatum label="AMC name" value={scheme.amc} />
        <SchemeDatum label="Scheme name" value={scheme.name} prominent />
        <SchemeDatum label="Category" value={scheme.category} />
        <SchemeDatum label="Plan type" value={scheme.plan} />
        <SchemeDatum label="Option" value={scheme.option} />
      </dl>
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

function SchemeDatum({ label, value, prominent = false }: { label: string; value: string; prominent?: boolean }) {
  return <div className={prominent ? "sm:col-span-2" : ""}><dt className="text-xs font-semibold uppercase text-muted-foreground">{label}</dt><dd className={`mt-1 leading-snug ${prominent ? "font-display text-xl font-medium" : "text-sm"}`}>{value}</dd></div>;
}

function UnavailableDocument({ label }: { label: string }) {
  return <Button type="button" variant="secondary" size="sm" disabled title="Verified official URL not supplied">{label}</Button>;
}