import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { learnTopics } from "@/lib/content";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/learn")({
  head: () =>
    pageMeta({
      title: "Learn the Basics",
      description:
        "Simple explanations of mutual funds, SIPs, risk profiling, asset allocation, compounding and long-term investing for general education.",
      path: "/learn",
    }),
  component: LearnPage,
});

function LearnPage() {
  return (
    <>
      <PageHero
        eyebrow="Learn"
        title="Investing, explained simply."
        lead="Short, jargon-free notes on the ideas behind disciplined investing, provided for general education only."
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {learnTopics.map((t, i) => (
            <article key={t.title} className="card-premium p-8">
              <span className="font-display text-sm text-gold">0{i + 1}</span>
              <h2 className="mt-2 text-2xl font-medium">{t.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{t.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground">{site.disclaimerShort}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="lg">
            <Link to="/funds">Explore fund information <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/sip-calculator"><Calculator className="h-4 w-4" /> Try the SIP calculator</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/risk-profile"><Gauge className="h-4 w-4" /> Explore your risk profile</Link>
          </Button>
        </div>
      </Section>
      <CtaBand title="Have a question about any of this?" lead="We're happy to explain further in a relaxed conversation." />
    </>
  );
}
