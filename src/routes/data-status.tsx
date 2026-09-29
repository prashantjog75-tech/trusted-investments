import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock3, Database, ExternalLink, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { getDataStatus } from "@/lib/fund-data/functions";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const Route = createFileRoute("/data-status")({
  loader: () => getDataStatus(),
  head: () => pageMeta({ title: "Mutual Fund Data Status", description: "View connected official mutual fund data sources, freshness, and recent refresh status.", path: "/data-status" }),
  component: DataStatusPage,
  errorComponent: () => <main className="container-site py-24"><h1 className="text-4xl font-medium">Data status is temporarily unavailable.</h1><p className="mt-4 text-muted-foreground">Previously verified fund information remains unchanged while the status service recovers.</p></main>,
});

function dateTime(value?: string) {
  return value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value)) : "Not yet available";
}

function DataStatusPage() {
  const status = Route.useLoaderData();
  return <>
    <PageHero eyebrow={`Data transparency · ${site.arn}`} title="Mutual fund data status." lead="See which official sources are connected, when they last refreshed, and where source configuration is still required." />
    <Section>
      <SectionHeading eyebrow="Current coverage" title="A clear view of source readiness" lead="Source freshness describes data recency only. It does not indicate scheme suitability or expected performance." />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Verified schemes" value={status.schemeCount} />
        <Stat label="Stale schemes" value={status.staleSchemes} />
        <Stat label="Missing documents" value={status.missingDocuments} />
      </div>
      <div className="mt-10 space-y-5">
        {status.providers.map((provider) => <article key={provider.id} className="rounded-lg border border-border bg-card p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-medium">{provider.name}</h2><Badge variant={provider.status === "active" ? "default" : "secondary"}>{provider.configured ? provider.status : "Configuration required"}</Badge></div><p className="mt-2 text-sm text-muted-foreground">Freshness window: {provider.freshnessHours} hours</p></div>
            {provider.officialUrl && <Button asChild variant="outline" size="sm"><a href={provider.officialUrl} target="_blank" rel="noreferrer">Official source <ExternalLink className="h-4 w-4" /></a></Button>}
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatusItem icon={CheckCircle2} label="Last successful sync" value={dateTime(provider.lastSuccessfulSyncAt)} />
            <StatusItem icon={Clock3} label="Next scheduled sync" value={dateTime(provider.nextScheduledSyncAt)} />
            <StatusItem icon={Database} label="Schedule" value={provider.schedule ?? "Not active"} />
            <StatusItem icon={provider.latestRun?.status === "failed" ? AlertTriangle : CheckCircle2} label="Latest run" value={provider.latestRun ? `${provider.latestRun.status} · ${provider.latestRun.created + provider.latestRun.updated} changed` : "No run recorded"} />
          </dl>
        </article>)}
      </div>
    </Section>
    <Section tone="ivory">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div><p className="eyebrow">Source policy</p><h2 className="mt-3 text-3xl font-medium">Official sources only, with honest gaps.</h2><p className="mt-4 leading-relaxed text-muted-foreground">NAV data uses the official AMFI machine-readable report. SEBI filing metadata and AMC documents remain unconnected until stable, verifiable source-specific URLs are configured. Existing valid values are preserved when a refresh fails.</p></div>
        <div className="rounded-lg border border-border bg-card p-6"><LockKeyhole className="h-6 w-6 text-gold"/><h3 className="mt-4 text-xl font-medium">Administrative controls are protected</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Manual refresh and detailed failure records are not exposed publicly. A server-held scheduler secret and administrator access are required.</p><Button type="button" variant="outline" className="mt-5" disabled>Run sync requires administrator access</Button></div>
      </div>
      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">Information is sourced from official/public sources where available. Verify current scheme documents and official AMC, SEBI and AMFI disclosures before investing. {site.disclaimerShort}</p>
    </Section>
  </>;
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-lg border border-border bg-card p-5"><p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl font-medium">{new Intl.NumberFormat("en-IN").format(value)}</p></div>; }
function StatusItem({ icon: Icon, label, value }: { icon: typeof Clock3; label: string; value: string }) { return <div><Icon className="h-5 w-5 text-gold"/><dt className="mt-2 text-xs font-semibold uppercase text-muted-foreground">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>; }