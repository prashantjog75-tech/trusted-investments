import { createFileRoute } from "@tanstack/react-router";
import { SipCalculator } from "@/components/site/SipCalculator";
import { PageHero, Section } from "@/components/site/Section";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/sip-calculator")({
  head: () =>
    pageMeta({
      title: "SIP Calculator & Goal Projection",
      description:
        "Estimate a monthly SIP projection or calculate an illustrative SIP amount for a financial goal using editable, assumption-based inputs.",
      path: "/sip-calculator",
    }),
  component: SipCalculatorPage,
});

function SipCalculatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Investment tools · Illustration"
        title="SIP calculator and goal projection."
        lead="Explore how regular investing and time may shape an estimated outcome. Every result is based only on the assumptions you enter."
      />
      <Section>
        <SipCalculator />
      </Section>
    </>
  );
}