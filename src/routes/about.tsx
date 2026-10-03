import { createFileRoute } from "@tanstack/react-router";
import aboutDesk from "@/assets/about-desk.jpg";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { TrustStats } from "@/components/site/TrustStats";
import { CtaBand } from "@/components/site/CtaBand";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { whyUs } from "@/lib/content";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta({
      title: "About",
      description:
        "Meet an AMFI Registered Mutual Fund Distributor (ARN-83625) with 15+ years of experience and a relationship-led approach to helping 500+ families across India and globally invest with purpose.",
      path: "/about",
    }),
  component: AboutPage,
});

const values = [
  ["Suitability first", "Every mutual fund discussion begins with your goals, horizon and risk comfort — never with what is popular this quarter."],
  ["Patience", "Wealth is built over decades, not weeks. We help families stay invested through the noise."],
  ["Plain language", "If you cannot explain it to your family at dinner, we have not explained it well enough."],
  ["Continuity", "The person who onboards you is the person who reviews with you years later."],
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A practice built on relationships, one family at a time."
        lead="For more than 15 years, Prashant Jog has helped families across India and globally invest, track and stay the course — as an AMFI Registered Mutual Fund Distributor, ARN-83625."
      />

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <img
            src={aboutDesk}
            alt="A quiet study desk with a notebook, pen and a cup of chai"
            width={1200}
            height={1408}
            loading="lazy"
            className="aspect-[6/7] w-full rounded-[1.75rem] object-cover shadow-elevated"
          />
          <div>
            <SectionHeading eyebrow="Our story" title="Why we do this work" />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              <p>
                {site.name} began this practice with a simple observation: most families do not lack ambition — they
                value a consistent mutual fund distributor who will sit with them, understand what they are working
                toward, and help them invest with discipline.
              </p>
              <p>
                Over 15+ years and more than 500 families, that conviction has only deepened. Families have invested
                toward retirement, education and homes — not through luck or timing, but
                through disciplined, goal-based investing, reviewed patiently year after year.
              </p>
              <p>
                Today we serve families across India and globally, combining in-person conversations where possible
                with convenient digital servicing, while keeping the one thing that matters most: a personal
                relationship you can rely on.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <div className="container-site">
        <TrustStats />
      </div>

      <Section>
        <SectionHeading eyebrow="Our values" title="The principles behind every conversation" align="center" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {values.map(([t, b]) => (
            <div key={t} className="card-premium p-7">
              <h3 className="text-xl font-medium">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ivory">
        <SectionHeading eyebrow="Why families choose us" title="What working with us feels like" />
        <FeatureGrid items={whyUs} className="mt-12" />
      </Section>

      <CtaBand title="Let's begin with a conversation about your family." />
    </>
  );
}
