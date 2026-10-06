import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeIndianRupee, BookOpen, Calculator, CircleHelp, FileText, Gauge, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/resources")({
  head: () => pageMeta({
    title: "Investor Resources",
    description: "Investor education, mutual fund tools, FAQs, data information, disclosures, and useful documents from Prashant Jog, ARN 83625.",
    path: "/resources",
  }),
  component: ResourcesPage,
});

const resources = [
  { to: "/learn" as const, title: "Mutual Fund Basics", body: "Plain-language explanations of mutual funds, SIPs, risk, asset allocation, and compounding.", icon: BookOpen },
  { to: "/risk-assessment" as const, title: "Risk Profile Assessment", body: "Answer 14 questions on your risk capacity, tolerance and time horizon and see your profile on a five-level meter.", icon: Gauge },
  { to: "/sip-calculator" as const, title: "SIP Calculator", body: "Create an assumption-based illustration for a monthly SIP and a chosen time horizon.", icon: Calculator },
  { to: "/risk-profile" as const, title: "Risk Self-Assessment", body: "Use an educational questionnaire to understand your responses to time, liquidity, and market movement.", icon: Gauge },
  { to: "/transparency" as const, title: "Transparency & Commissions", body: "Understand how mutual fund distribution commissions, service fees, and applicable scheme costs work.", icon: BadgeIndianRupee },
  { to: "/faq" as const, title: "Frequently Asked Questions", body: "Read answers about Prashant Jog's role, reviews, risk, and global client service.", icon: CircleHelp },
  { to: "/funds" as const, title: "Fund Documents", body: "Find available official sources and document states alongside each fund in the directory.", icon: FileText },
  { to: "/data-status" as const, title: "Data Information", body: "Review source, freshness, availability, and synchronization information for fund data.", icon: RefreshCw },
  { to: "/grievance" as const, title: "Grievance Redressal", body: "Raise a complaint or concern and receive a reference number for follow-up.", icon: CircleHelp },
  { href: "https://www.dspim.com/invest#goto=kyc", title: "DSP KYC — Register / Modify KYC", body: "Start or update your KYC on DSP Mutual Fund's official website. DSP's flow guides you to its KYC partner for document verification.", icon: FileText },
  { to: "/feedback" as const, title: "Feedback", body: "Rate your experience and tell us what was useful or could be improved.", icon: BookOpen },
];

function ResourcesPage() {
  return <>
    <PageHero eyebrow="Resources" title="Useful information, gathered in one place." lead="Learn the basics, use educational tools, review common questions, and find fund-document and data disclosures." />
    <Section>
      <SectionHeading eyebrow="Investor information" title="Learn, calculate, and verify" lead="These resources are for general awareness and mutual fund distribution purposes only." />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((item) => <article key={item.title} className="flex flex-col border border-border bg-card p-7 shadow-soft">
          <item.icon className="h-7 w-7 text-gold" aria-hidden="true" />
          <h2 className="mt-5 text-2xl font-medium">{item.title}</h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          <Button asChild variant="link" className="mt-4 justify-start px-0">{"href" in item && item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer">Open official DSP page <ArrowRight /><span className="sr-only"> (opens in a new tab)</span></a> : <Link to={(item as { to: "/learn" }).to}>Open resource <ArrowRight /></Link>}</Button>
        </article>)}
      </div>
      <p className="mt-10 text-sm text-muted-foreground">{site.disclaimerShort}</p>
    </Section>
  </>;
}