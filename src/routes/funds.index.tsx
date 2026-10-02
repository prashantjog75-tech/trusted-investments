import { createFileRoute, Link } from "@tanstack/react-router";
import { FileSearch, ShieldCheck } from "lucide-react";
import { FundDirectory } from "@/components/site/FundDirectory";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const Route = createFileRoute("/funds/")({
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
  return (
    <>
      <PageHero
        eyebrow={`Fund information · ${site.arn}`}
        title="Scheme information, organised for careful review."
        lead="Search and compare fund information in one clear place. Each Regular Plan fund appears once, with its available options grouped together."
      />
      <Section>
        <SectionHeading
          eyebrow="Fund directory"
          title="Explore scheme information"
          lead="Browse a static snapshot of official AMFI scheme identity data. Search by fund or fund house, refine by category and option, and see one card for each unique Regular Plan fund."
        />
        <FundDirectory />
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