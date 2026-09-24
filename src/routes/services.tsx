import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { CtaBand } from "@/components/site/CtaBand";
import { services } from "@/lib/content";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () =>
    pageMeta({
      title: "Services",
      description:
        "Mutual fund distribution, goal-based investing, SIP assistance, retirement-focused investing and portfolio review from Prashant Jog, AMFI Registered Mutual Fund Distributor, ARN 83625.",
      path: "/services",
    }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Mutual fund solutions, shaped around your life goals."
        lead="Everything we offer is in service of one outcome: helping your family invest with discipline toward the things that matter."
      />
      <Section>
        <FeatureGrid items={services} />
        <div className="mt-12 rounded-2xl border border-gold/30 bg-gold-soft/40 p-6 text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">A note on our role.</strong> We operate as an AMFI Registered Mutual
          Fund Distributor ({site.arn}), not an investment adviser. Information shared is general or incidental to
          mutual fund distribution and does not constitute personalised investment advice. {site.disclaimerShort}
        </div>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="Fund information"
          title="Review scheme information and documents in one place"
          lead="Explore the source-ready layout for expense ratios, holdings, distributor disclosures, fact sheets, KIM, SID and SAI. All unavailable data is clearly marked."
        />
        <div className="mt-8">
          <Link to="/funds" className="inline-flex items-center rounded-md border border-border bg-card px-5 py-3 text-sm font-medium shadow-soft transition-colors hover:bg-muted">Explore fund information</Link>
        </div>
      </Section>
      <Section tone="ivory">
        <SectionHeading
          eyebrow="Who we work with"
          title="Families at every stage"
          lead="Young professionals starting their first SIP, parents planning for education, and couples approaching retirement — across cities and towns throughout India."
          align="center"
        />
      </Section>
      <CtaBand />
    </>
  );
}
