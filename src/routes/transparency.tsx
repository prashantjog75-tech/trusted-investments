import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  Check,
  ExternalLink,
  FileSearch,
  HandCoins,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/Section";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/transparency")({
  head: () =>
    pageMeta({
      title: "Transparency & Commissions",
      description:
        "Understand how mutual fund distribution commissions and service fees work with Prashant Jog, AMFI Registered Mutual Fund Distributor, ARN-83625.",
      path: "/transparency",
    }),
  component: TransparencyPage,
});

const feeClarifications = [
  "No separate distributor service fee for mutual fund distribution services",
  "No hidden distributor service charges",
  "Clear communication about how distribution commissions work",
];

const costClarifications = [
  "A scheme’s expenses, including the applicable Total Expense Ratio (TER)",
  "Transaction, statutory, tax or other charges that may apply",
  "Costs and terms disclosed in the scheme’s current official documents",
];

function BrandLockup({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={
          inverse
            ? "grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold font-display text-xl font-semibold text-gold-foreground"
            : "grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-navy font-display text-xl font-semibold text-gold"
        }
        aria-hidden="true"
      >
        P
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-display text-xl font-semibold">{site.name}</span>
        <span
          className={
            inverse
              ? "block text-[10px] font-semibold tracking-[0.12em] text-navy-foreground/65 uppercase"
              : "block text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase"
          }
        >
          AMFI Registered Mutual Fund Distributor · {site.arn}
        </span>
      </span>
    </div>
  );
}

function TransparencyPage() {
  return (
    <>
      <section className="bg-navy-gradient grain overflow-hidden text-navy-foreground">
        <div className="container-site relative z-10 py-16 md:py-24">
          <Button asChild variant="outlineLight" size="sm">
            <Link to="/resources">
              <ArrowLeft aria-hidden="true" /> Resources
            </Link>
          </Button>
          <div className="mt-12 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <p className="eyebrow">Clear by design</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-medium leading-[1.08] sm:text-5xl md:text-6xl">
                Transparent Commissions
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-navy-foreground/75 md:text-lg">
                A straightforward explanation of how mutual fund distribution is compensated and which costs may
                still apply to an investment.
              </p>
            </div>
            <p className="shrink-0 border-l-2 border-gold pl-4 text-sm leading-relaxed text-navy-foreground/75">
              {site.name}
              <br />
              <span className="font-semibold text-gold">{site.arn}</span>
            </p>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Our approach"
          title="Clarity before every transaction"
          lead="We believe investors should understand both how their distributor is compensated and the costs disclosed by a mutual fund scheme."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="grain relative overflow-hidden rounded-2xl bg-navy-gradient p-7 text-navy-foreground shadow-elevated sm:p-9 lg:min-h-[31rem]">
            <div className="relative z-10 flex h-full flex-col">
              <BrandLockup inverse />
              <div className="my-10 h-px bg-navy-foreground/15" />
              <BadgeIndianRupee className="h-9 w-9 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-gold uppercase">How we are compensated</p>
              <h2 className="mt-3 text-3xl font-medium sm:text-4xl">Commission, disclosed clearly.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-navy-foreground/75 sm:text-base">
                As an AMFI Registered Mutual Fund Distributor, Prashant Jog may receive commission from mutual fund
                companies for distribution services when investments are made through us. The amount can vary by
                AMC, scheme, period and applicable rules.
              </p>
              <div className="mt-auto pt-8">
                <p className="border-t border-navy-foreground/15 pt-5 text-xs leading-relaxed text-navy-foreground/60">
                  Actual commission information should be read from the latest official AMC and scheme disclosures.
                </p>
              </div>
            </div>
          </article>

          <article className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-elevated sm:p-9 lg:min-h-[31rem]">
            <BrandLockup />
            <div className="my-10 h-px bg-border" />
            <HandCoins className="h-9 w-9 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-gold uppercase">Our service-fee promise</p>
            <h2 className="mt-3 text-3xl font-medium sm:text-4xl">No separate distributor service fee.</h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Investors do not separately pay us a service fee for our mutual fund distribution service. This does
              not mean that mutual fund investing is free of every cost.
            </p>
            <ul className="mt-7 space-y-3">
              {feeClarifications.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section tone="ivory">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Important distinction"
              title="No separate service fee does not mean zero investment costs"
              lead="Mutual fund investments can carry costs and charges under applicable rules and scheme terms."
            />
          </div>
          <div className="rounded-2xl border border-border bg-card p-7 shadow-soft sm:p-9">
            <p className="font-display text-xl font-medium">An investor may still bear:</p>
            <ul className="mt-6 space-y-4">
              {costClarifications.map((item) => (
                <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 text-sm leading-relaxed text-muted-foreground">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 rounded-2xl border border-gold/40 bg-card p-7 shadow-soft md:grid-cols-[auto_minmax(0,1fr)] md:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
            <FileSearch className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Commission & trail information</p>
            <h2 className="mt-3 text-3xl font-medium">Refer to current official disclosures for actual rates</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Commission and trail rates are not fixed across all mutual funds. They may change by fund house,
              scheme, period and applicable requirements. We therefore do not publish a generic rate range here.
              Please refer to the latest official AMC or scheme disclosure for current information, or ask us for a
              clear explanation before investing.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="outline" size="lg">
                <Link to="/funds">
                  View official fund documents <ExternalLink aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="gold" size="lg">
                <Link to="/contact">
                  Ask a question <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <section className="bg-navy-gradient text-navy-foreground">
        <div className="container-site py-12 md:py-16">
          <p className="eyebrow">Please read carefully</p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-navy-foreground/75">
            {site.disclaimerShort} Information on this page is for general awareness and mutual fund distribution
            purposes only. It is not investment advice, a recommendation, or an assurance of returns. Scheme costs,
            charges and terms should be verified from current official scheme-related documents before investing.
          </p>
          <p className="mt-5 text-xs font-semibold tracking-[0.12em] text-gold uppercase">
            {site.name} · AMFI Registered Mutual Fund Distributor · {site.arn}
          </p>
        </div>
      </section>
    </>
  );
}