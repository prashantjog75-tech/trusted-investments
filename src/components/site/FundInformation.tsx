import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BriefcaseBusiness,
  Calculator,
  FileText,
  Gauge,
  Info,
  LockKeyhole,
  ReceiptText,
  Scale,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FundRecord } from "@/lib/funds";
import { site } from "@/lib/site-config";

const sectionLinks = [
  ["overview", "Overview"],
  ["metrics", "Key metrics"],
  ["portfolio", "Portfolio"],
  ["costs", "Costs & disclosures"],
  ["documents", "Documents"],
  ["tools", "Investment tools"],
] as const;

export function FundDirectoryCard({ fund }: { fund: FundRecord }) {
  return (
    <article className="card-premium flex h-full flex-col p-6 md:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{fund.label}</Badge>
        <span className="text-xs text-muted-foreground">Placeholder data</span>
      </div>
      <h2 className="mt-5 text-2xl font-medium">{fund.name}</h2>
      <p className="mt-2 text-sm font-medium text-gold">{fund.category}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{fund.overview}</p>
      <Button asChild variant="outline" className="mt-6 w-full justify-between">
        <Link to="/funds/$fundSlug" params={{ fundSlug: fund.slug }}>
          View information <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </article>
  );
}

export function FundInformation({ fund }: { fund: FundRecord }) {
  const metrics = [
    ["Expense ratio", fund.expenseRatio],
    ["NAV", fund.nav],
    ["Minimum investment", fund.minimumInvestment],
    ["Exit load", fund.exitLoad],
  ];

  return (
    <>
      <nav aria-label="Fund page sections" className="sticky top-18 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container-site flex gap-1 overflow-x-auto py-3">
          {sectionLinks.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section id="overview" className="section-pad scroll-mt-32">
        <div className="container-site grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow">Fund overview</p>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl">About this scheme page</h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{fund.overview}</p>
          </div>
          <dl className="grid gap-4 rounded-lg border border-border bg-card p-6 shadow-soft">
            <InfoRow label="Investment objective" value={fund.objective} />
            <InfoRow label="Risk-o-meter" value={fund.riskLevel} />
            <InfoRow label="Benchmark" value={fund.benchmark} />
            <InfoRow label="Plan / option" value={fund.planType} />
          </dl>
        </div>
      </section>

      <section id="metrics" className="section-pad scroll-mt-32 bg-ivory-gradient">
        <div className="container-site">
          <p className="eyebrow">Key metrics</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-soft">
                <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
                <p className="mt-3 font-display text-xl font-medium">{value}</p>
                <p className="mt-2 text-xs text-muted-foreground">Verified source pending</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">NAV source date: {fund.navAsOf}.</p>
        </div>
      </section>

      <section id="portfolio" className="section-pad scroll-mt-32">
        <div className="container-site">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Portfolio</p>
              <h2 className="mt-3 text-3xl font-medium md:text-4xl">Current portfolio / holdings</h2>
            </div>
            <Badge variant="outline">As of: {fund.holdingsAsOf}</Badge>
          </div>
          {fund.holdings.length > 0 ? (
            <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-card">
              <table className="w-full min-w-xl text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                  <tr><th className="p-4 font-medium">Holding</th><th className="p-4 font-medium">Sector</th><th className="p-4 text-right font-medium">Allocation</th></tr>
                </thead>
                <tbody>{fund.holdings.map((holding) => <tr key={holding.name} className="border-b border-border last:border-0"><td className="p-4">{holding.name}</td><td className="p-4 text-muted-foreground">{holding.sector}</td><td className="p-4 text-right">{holding.allocation}</td></tr>)}</tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={BriefcaseBusiness} title="Holdings data is not yet connected" body="Verified holdings and allocation data from the official source will appear here. No sample securities or allocations have been invented." />
          )}
        </div>
      </section>

      <section id="costs" className="section-pad scroll-mt-32 bg-navy-gradient text-navy-foreground">
        <div className="container-site grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-navy-foreground/15 bg-navy-foreground/5 p-6">
            <ReceiptText className="h-6 w-6 text-gold" />
            <p className="eyebrow mt-5">Costs</p>
            <h2 className="mt-2 text-2xl font-medium">Expense ratio</h2>
            <p className="mt-4 text-lg">{fund.expenseRatio}</p>
            <p className="mt-3 text-sm leading-relaxed text-navy-foreground/70">The verified plan-specific expense ratio and official source date will appear here when connected.</p>
          </div>
          <div className="rounded-lg border border-navy-foreground/15 bg-navy-foreground/5 p-6">
            <Scale className="h-6 w-6 text-gold" />
            <p className="eyebrow mt-5">Distributor disclosure</p>
            <h2 className="mt-2 text-2xl font-medium">Commission disclosure</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-foreground/75">{fund.commissionDisclosure}</p>
          </div>
        </div>
      </section>

      <section id="documents" className="section-pad scroll-mt-32">
        <div className="container-site">
          <p className="eyebrow">Documents</p>
          <h2 className="mt-3 text-3xl font-medium md:text-4xl">Official scheme documents</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">Only verified Asset Management Company documents will be linked here. No placeholder files are offered for download.</p>
          <Accordion type="multiple" className="mt-8 rounded-lg border border-border bg-card px-5 md:px-7">
            {fund.documents.map((document) => (
              <AccordionItem key={document.kind} value={document.kind}>
                <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                  <span className="flex min-w-0 items-center gap-3"><FileText className="h-5 w-5 shrink-0 text-gold" /><span>{document.kind}</span><Badge variant="secondary" className="hidden sm:inline-flex">Not connected</Badge></span>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <p className="max-w-2xl leading-relaxed text-muted-foreground">{document.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button type="button" variant="outline" size="sm" disabled><LockKeyhole className="h-4 w-4" /> Document unavailable</Button>
                    <span className="text-xs text-muted-foreground">Official URL and issue date pending verification.</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="tools" className="section-pad scroll-mt-32 bg-ivory-gradient">
        <div className="container-site">
          <p className="eyebrow">Investment tools</p>
          <h2 className="mt-3 text-3xl font-medium md:text-4xl">Tools for informed conversations</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <ToolCard icon={Calculator} title="SIP illustration" body="Explore assumption-based SIP and goal projections with clearly labelled estimated values." to="/sip-calculator" />
            <ToolCard icon={Gauge} title="Risk questionnaire" body="A structured, informational questionnaire will be connected here after its assumptions and disclosures are approved." />
            <ToolCard icon={FileText} title="Document checklist" body="A scheme-document comparison checklist will appear here when verified sources are connected." />
          </div>
          <div className="mt-8 rounded-lg border border-gold/30 bg-gold-soft/40 p-5 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Information only.</strong> This page does not constitute an offer or solicitation. Prashant Jog operates only as an AMFI Registered Mutual Fund Distributor ({site.arn}). {site.disclaimerShort}
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase text-muted-foreground">{label}</dt><dd className="mt-1 text-sm leading-relaxed">{value}</dd></div>;
}

function EmptyState({ icon: Icon, title, body }: { icon: typeof BriefcaseBusiness; title: string; body: string }) {
  return <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-8 text-center"><Icon className="mx-auto h-7 w-7 text-gold" /><h3 className="mt-4 text-xl font-medium">{title}</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{body}</p></div>;
}

function ToolCard({ icon: Icon, title, body, to }: { icon: typeof Calculator; title: string; body: string; to?: "/sip-calculator" }) {
  return <article className="rounded-lg border border-border bg-card p-6 shadow-soft"><Icon className="h-6 w-6 text-gold" /><div className="mt-5 flex items-center justify-between gap-3"><h3 className="text-xl font-medium">{title}</h3><Badge variant="secondary">{to ? "Available" : "Coming soon"}</Badge></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>{to && <Button asChild variant="outline" className="mt-5 w-full"><Link to={to}>Open calculator <ArrowRight className="h-4 w-4" /></Link></Button>}</article>;
}