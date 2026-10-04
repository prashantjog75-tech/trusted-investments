import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { RequestForm, type FieldDef } from "@/components/site/RequestForm";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/feedback")({
  head: () => pageMeta({ title: "Feedback", description: "Share feedback on your experience with Prashant Jog, AMFI Registered Mutual Fund Distributor, ARN 83625.", path: "/feedback" }),
  component: FeedbackPage,
});

const fields: FieldDef[] = [
  { id: "name", label: "Name", required: true },
  { id: "phone", label: "Mobile / Phone", required: true, type: "tel" },
  { id: "email", label: "Email", required: true, type: "email" },
  { id: "rating", label: "Overall experience rating (1–5)", required: true, type: "rating" },
  { id: "useful", label: "What did you find useful?", type: "textarea" },
  { id: "improve", label: "What could we improve?", type: "textarea" },
  { id: "comments", label: "Additional comments", type: "textarea" },
];

function FeedbackPage() {
  return <>
    <PageHero eyebrow="Feedback" title="How are we doing?" lead="Your feedback helps us serve families better. It takes about a minute." />
    <Section>
      <div className="card-premium mx-auto max-w-3xl p-7 hover:translate-y-0 md:p-10">
        <RequestForm fields={fields} prefix="FBK" subject="New Feedback - Prashant Jog" kind="Feedback" />
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-xs text-muted-foreground">AMFI Registered Mutual Fund Distributor · {site.arn}. {site.disclaimerShort}</p>
    </Section>
  </>;
}
