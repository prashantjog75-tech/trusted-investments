import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { RequestForm, type FieldDef } from "@/components/site/RequestForm";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/grievance")({
  head: () => pageMeta({ title: "Grievance Redressal", description: "Raise a grievance or complaint with Prashant Jog, AMFI Registered Mutual Fund Distributor, ARN 83625, and receive a reference number.", path: "/grievance" }),
  component: GrievancePage,
});

const fields: FieldDef[] = [
  { id: "name", label: "Name", required: true },
  { id: "phone", label: "Mobile / Phone", required: true, type: "tel" },
  { id: "email", label: "Email", required: true, type: "email" },
  { id: "type", label: "Grievance type", required: true, type: "select", options: ["Transaction / processing", "Account statement / documents", "Service quality", "Communication / response delay", "KYC / account details", "Other"] },
  { id: "service", label: "Related service / scheme" },
  { id: "contact", label: "Preferred contact method", type: "select", options: ["Phone", "WhatsApp", "Email"] },
  { id: "description", label: "Description of grievance", required: true, type: "textarea" },
];

function GrievancePage() {
  return <>
    <PageHero eyebrow="Grievance redressal" title="Tell us what went wrong." lead="Every grievance is recorded with a reference number and reviewed personally." />
    <Section>
      <div className="card-premium mx-auto max-w-3xl p-7 hover:translate-y-0 md:p-10">
        <RequestForm fields={fields} prefix="GRV" subject="New Grievance - Prashant Jog" kind="Grievance" />
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-xs text-muted-foreground">AMFI Registered Mutual Fund Distributor · {site.arn}. {site.disclaimerShort}</p>
    </Section>
  </>;
}
