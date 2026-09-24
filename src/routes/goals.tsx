import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { CtaBand } from "@/components/site/CtaBand";
import { goals } from "@/lib/content";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/goals")({
  head: () =>
    pageMeta({
      title: "Life Goals",
      description:
        "Explore goal-based mutual fund investing for retirement, education, wealth creation, a home and financial resilience with an AMFI Registered Mutual Fund Distributor.",
      path: "/goals",
    }),
  component: GoalsPage,
});

function GoalsPage() {
  return (
    <>
      <PageHero
        eyebrow="Life goals"
        title="Every dream deserves a considered investing approach."
        lead="Different goals have different timelines and different needs. We help you give each one a suitable place in your portfolio."
      />
      <Section>
        <FeatureGrid items={goals} />
        <p className="mt-10 text-sm text-muted-foreground">{site.disclaimerShort}</p>
      </Section>
      <CtaBand title="Tell us which goal is on your mind." />
    </>
  );
}
