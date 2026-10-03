import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarDays, Handshake, Search } from "lucide-react";
import growth from "@/assets/growth-sapling.jpg";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { Section, SectionHeading } from "@/components/site/Section";
import { TrustStats } from "@/components/site/TrustStats";
import { FeatureGrid } from "@/components/site/FeatureGrid";
import { ProcessSteps } from "@/components/site/ProcessSteps";
import { CtaBand } from "@/components/site/CtaBand";
import { goals, services, whyUs } from "@/lib/content";
import { site } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageMeta({
      title: "Invest with Purpose. Plan for the Life You Want",
      description:
        "AMFI Registered Mutual Fund Distributor (ARN-83625) with 15+ years of experience helping 500+ families across India and globally invest toward retirement, education and life goals.",
      path: "/",
    }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient grain relative overflow-hidden text-navy-foreground">
        <div className="container-site relative z-10 grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <p className="eyebrow animate-fade-up">AMFI Registered Mutual Fund Distributor · {site.arn}</p>
            <h1 className="animate-fade-up delay-100 mt-5 text-4xl font-medium leading-[1.08] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              Invest with Purpose. <span className="text-gold-gradient">Plan for the Life You Want.</span>
            </h1>
            <p className="animate-fade-up delay-200 mt-6 max-w-xl text-lg leading-relaxed text-navy-foreground/75">
              For over 15 years, we have helped 500+ families across India and globally work toward their dreams —
              comfortably, through disciplined, goal-based mutual fund investing.
            </p>
            <div className="animate-fade-up delay-300 mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="gold" size="xl">
                <Link to="/contact">Book a Meeting</Link>
              </Button>
              <Button asChild variant="outlineLight" size="xl">
                <Link to="/services">
                  Explore Our Services <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <dl className="animate-fade-up delay-500 mt-12 grid grid-cols-3 gap-6 border-t border-navy-foreground/10 pt-8 text-sm">
              {[
                ["15+", "Years of experience"],
                ["500+", "Families served"],
                ["Global", "Client service"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dd className="font-display text-3xl font-semibold text-gold">{v}</dd>
                  <dt className="mt-1 text-navy-foreground/60">{l}</dt>
                </div>
              ))}
            </dl>
          </div>

          <HeroCarousel />
        </div>
      </section>

      {/* Trust stats */}
      <div className="container-site relative z-20 mt-12 lg:-mt-12">
        <TrustStats className="shadow-elevated" />
      </div>

      <Section>
        <SectionHeading
          eyebrow="Start here"
          title="What would you like to do?"
          lead="Go directly to fund information, investor education, personal assistance, or a conversation with Prashant Jog."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: "/funds", title: "Explore Funds", body: "Search and filter Regular Plan mutual funds.", icon: Search },
            { to: "/resources", title: "Understand Mutual Funds", body: "Find clear education, tools, and disclosures.", icon: BookOpen },
            { to: "/services", title: "Investment Assistance", body: "See how Prashant Jog can assist your family.", icon: Handshake },
            { to: "/contact", title: "Book a Meeting", body: "Choose a convenient way to start a conversation.", icon: CalendarDays },
          ].map((item) => (
            <Link key={item.to} to={item.to} className="group border-t-2 border-gold bg-card p-6 shadow-soft transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <item.icon className="h-6 w-6 text-gold" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-medium">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Intro / relationship */}
      <Section tone="ivory">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src={growth}
              alt="A father and daughter planting a sapling together"
              width={1408}
              height={1008}
              loading="lazy"
              className="aspect-[7/5] w-full rounded-[1.75rem] object-cover shadow-soft"
            />
            <div className="absolute -right-3 -bottom-3 hidden h-32 w-32 rounded-full border border-gold/40 md:block" />
          </div>
          <div>
            <SectionHeading
              eyebrow="Personal. Patient. Purposeful."
              title="Investing is not about markets. It is about the life you are building."
              lead="Every family has its own dreams — a comfortable retirement, a child's education abroad, a home with a garden. Our work is simple: understand those dreams, match them with suitable mutual fund solutions, and walk beside you through every review, every market cycle, every milestone."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Our story</Link>
              </Button>
              <Button asChild variant="link" size="lg">
                <Link to="/process">
                  How we work <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section>
        <SectionHeading
          eyebrow="What we do"
          title="Services built around your family's goals"
          lead="Mutual fund distribution and goal-based investing support — offered with clarity, discipline and long-term commitment."
          align="center"
        />
        <FeatureGrid items={services} className="mt-14" />
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link to="/services">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="link" size="lg">
            <Link to="/funds">Explore fund information <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </Section>

      {/* Process */}
      <Section tone="navy" className="grain relative">
        <div className="relative z-10">
          <SectionHeading
            eyebrow="Our process"
            title="Four simple steps, followed with care"
            lead="A calm, structured way to move from ambition to action — and to stay on course over the years."
            className="[&_p]:text-navy-foreground/75"
          />
          <div className="mt-14">
            <ProcessSteps tone="dark" />
          </div>
        </div>
      </Section>

      {/* Goals */}
      <Section tone="ivory">
        <SectionHeading
          eyebrow="Life goals"
          title="What are you investing for?"
          lead="Each goal has its own timeline and its own suitable plan. Here are the milestones families most often bring to us."
        />
        <FeatureGrid items={goals} className="mt-14" />
      </Section>

      {/* Why us */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading
            eyebrow="Why families choose us"
            title="Trusted by 500+ families, for reasons that don't change with the market"
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {whyUs.map((w) => (
              <li key={w.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-navy text-gold">
                  <w.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-medium">{w.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand />

      <p className="container-site pb-10 text-center text-xs text-muted-foreground">{site.disclaimerShort}</p>
    </>
  );
}
