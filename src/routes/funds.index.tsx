import { createFileRoute, Link } from "@tanstack/react-router";
import { FileSearch, ShieldCheck } from "lucide-react";
import { FundDirectoryCard } from "@/components/site/FundInformation";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { listFunds } from "@/lib/fund-data/functions";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const Route = createFileRoute("/funds/")({
  loader: () => listFunds(),
  head: () =>
    pageMeta({
      title: "Fund Information & Investment Tools",
      description:
        "Explore clearly organised mutual fund scheme information, costs, holdings, distributor disclosures and official document links from Prashant Jog, AMFI Registered Mutual Fund Distributor, ARN 83625.",
      path: "/funds",
    }),
  component: FundsPage,
});

function FundsPage() {
  const funds = Route.useLoaderData();
  return (
    <>
      <PageHero
        eyebrow={`Fund information · ${site.arn}`}
        title="Scheme information, organised for careful review."
        lead="Find costs, portfolio information, distributor disclosures and official scheme documents in one clear place, with source and freshness states shown clearly."
      />
      <Section>
        <SectionHeading
          eyebrow="Fund directory"
          title="Explore scheme information"
          lead="Official AMFI data appears after a successful refresh. Demonstration pages remain explicitly labelled and contain no invented figures or documents."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {funds.map((fund) => <FundDirectoryCard key={fund.slug} fund={fund} />)}
        </div>
      </Section>
      <Section tone="ivory">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-7 shadow-soft">
            <FileSearch className="h-7 w-7 text-gold" />
            <h2 className="mt-5 text-2xl font-medium">What each page contains</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Fund overview, key metrics, portfolio holdings, expense ratio, distributor commission disclosure, Fact Sheet, KIM, SID, SAI, and clearly identified investment tools.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-7 shadow-soft">
            <ShieldCheck className="h-7 w-7 text-gold" />
            <h2 className="mt-5 text-2xl font-medium">A note on our role</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Prashant Jog operates only as an AMFI Registered Mutual Fund Distributor ({site.arn}). Information is general and provided in connection with mutual fund distribution. {site.disclaimerShort}</p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg"><Link to="/contact">Ask about mutual fund investing</Link></Button>
        </div>
      </Section>
    </>
  );
}