import { createFileRoute } from "@tanstack/react-router";
import { RiskProfileFlow } from "@/components/site/RiskProfileFlow";
import { PageHero, Section } from "@/components/site/Section";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/risk-profile")({
  head: () => pageMeta({
    title: "Educational Risk Profile & Personalized Projection",
    description: "Complete an educational risk self-assessment, explore an assumption-based investment projection, and create a printable report.",
    path: "/risk-profile",
  }),
  component: RiskProfilePage,
});

function RiskProfilePage() {
  return <><PageHero eyebrow="Investment tools · Educational" title="Understand your comfort with investment risk." lead="Answer six short questions, review the transparent score, and explore a personalized projection based only on your assumptions." /><Section><RiskProfileFlow /></Section></>;
}
