import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => ({
    ...pageMeta({
      title: "FAQ",
      description:
        "Answers to common questions about working with an AMFI Registered Mutual Fund Distributor: fees, minimum SIP amounts, reviews, risk and India-wide service.",
      path: "/faq",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions families often ask."
        lead="If yours isn't here, just ask — we're always happy to talk."
      />
      <Section>
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`} className="border-border">
              <AccordionTrigger className="py-5 text-left font-display text-lg font-medium hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
      <CtaBand />
    </>
  );
}
