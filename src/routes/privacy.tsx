import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    ...pageMeta({
      title: "Privacy Policy",
      description: "How we collect, use and protect the personal information you share with us.",
      path: "/privacy",
    }),
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" lead="Placeholder — replace with your final privacy policy." />
      <Section>
        <div className="prose-custom mx-auto max-w-3xl space-y-5 text-muted-foreground">
          <p>
            {site.name} ({site.arn}) collects personal information — such as your name, phone number, email and city —
            only when you submit an enquiry or engage our services. We use it solely to respond to you, service your
            investments and meet regulatory obligations.
          </p>
          <p>We do not sell or rent your information. Details may be shared with Asset Management Companies and registrars strictly as required to process your investments.</p>
          <p>You may request access to, correction of, or deletion of your information by writing to {site.email}.</p>
          <p className="text-xs">Last updated: [date]. This is placeholder text and should be reviewed by a legal professional.</p>
        </div>
      </Section>
    </>
  );
}
