import { createFileRoute } from "@tanstack/react-router";
import { RiskAssessment } from "@/components/site/RiskAssessment";
import { PageHero, Section } from "@/components/site/Section";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/risk-assessment")({
  head: () => pageMeta({
    title: "Risk Profile Assessment",
    description: "A 14-question risk profile assessment covering risk capacity, risk tolerance and time horizon, from Prashant Jog, ARN 83625.",
    path: "/risk-assessment",
  }),
  component: () => <><PageHero eyebrow="Investor tools" title="Risk Profile Assessment" lead="Understand your risk capacity, risk tolerance and time horizon in 14 short questions. An assessment aid — not advice or a recommendation." /><Section><RiskAssessment /></Section></>,
});
