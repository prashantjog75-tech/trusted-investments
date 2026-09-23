import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    ...pageMeta({
      title: "Terms of Use",
      description: "Terms governing the use of this website and the information it contains.",
      path: "/terms",
    }),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" lead="Placeholder — replace with your final terms of use." />
      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-muted-foreground">
          <p>
            This website is operated by {site.name}, an AMFI Registered Mutual Fund Distributor ({site.arn}). The content
            is provided for general information and education only and does not constitute personalised investment
            advice, an offer, or a solicitation to buy or sell any financial product.
          </p>
          <p>{site.disclaimerLong}</p>
          <p>By using this website you agree to these terms. We may update them from time to time.</p>
          <p className="text-xs">Last updated: [date]. This is placeholder text and should be reviewed by a legal professional.</p>
        </div>
      </Section>
    </>
  );
}
