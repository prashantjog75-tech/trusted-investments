import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { ProcessSteps } from "@/components/site/ProcessSteps";
import { CtaBand } from "@/components/site/CtaBand";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/process")({
  head: () =>
    pageMeta({
      title: "Our Process",
      description:
        "Discover, Plan, Invest, Review — a simple four-step, goal-based approach to mutual fund investing followed with families across India for 15+ years.",
      path: "/process",
    }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="Discover. Plan. Invest. Review."
        lead="A calm, repeatable way of working that turns life goals into a suitable investment plan — and keeps it on track for years."
      />
      <Section>
        <ProcessSteps />
      </Section>
      <Section tone="ivory">
        <SectionHeading
          eyebrow="What to expect"
          title="Your first conversation"
          lead="Around 45 minutes, in person or on a video call. Bring your questions and, if you like, a summary of existing investments. There is no obligation and nothing to sign — just an honest discussion about where you are and where you'd like to be."
        />
      </Section>
      <CtaBand />
    </>
  );
}
