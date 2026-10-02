import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Handshake, ListChecks, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/site/Section";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/explore")({
  head: () => pageMeta({
    title: "Explore Your Next Step",
    description: "Explore Regular Plan mutual funds, life goals, Prashant Jog's mutual fund distribution process, and investment assistance.",
    path: "/explore",
  }),
  component: ExplorePage,
});

const paths = [
  { to: "/funds" as const, title: "Explore Funds", body: "Search the Regular Plan fund directory by fund house, category, and fund name.", icon: Compass },
  { to: "/goals" as const, title: "Start with a Life Goal", body: "Consider the timeline and purpose behind retirement, education, a home, or another family goal.", icon: Target },
  { to: "/services" as const, title: "Investment Assistance", body: "Understand the mutual fund distribution assistance Prashant Jog offers to families.", icon: Handshake },
  { to: "/process" as const, title: "How It Works", body: "See the discover, assess, invest, and review process before arranging a conversation.", icon: ListChecks },
];

function ExplorePage() {
  return <>
    <PageHero eyebrow="Explore" title="Begin with what you want to accomplish." lead="Choose a clear path to discover funds, think through a life goal, understand available assistance, or see how the process works." />
    <Section>
      <SectionHeading eyebrow="Choose a path" title="Find the information that matches your intent" />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {paths.map((item) => <article key={item.to} className="border-t-2 border-gold bg-card p-7 shadow-soft">
          <item.icon className="h-7 w-7 text-gold" aria-hidden="true" />
          <h2 className="mt-5 text-2xl font-medium">{item.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          <Button asChild variant="link" className="mt-4 px-0"><Link to={item.to}>Continue <ArrowRight /></Link></Button>
        </article>)}
      </div>
    </Section>
  </>;
}