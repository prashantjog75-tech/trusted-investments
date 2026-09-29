import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FundInformation } from "@/components/site/FundInformation";
import { Button } from "@/components/ui/button";
import { getFundBySlug } from "@/lib/fund-data/functions";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site-config";

export const Route = createFileRoute("/funds/$fundSlug")({
  loader: async ({ params }) => {
    const fund = await getFundBySlug({ data: { slug: params.fundSlug } });
    if (!fund) throw notFound();
    return fund;
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageMeta({
          title: `${loaderData.name} — Fund Information`,
          description: `View the structured information page for ${loaderData.name}, including costs, portfolio, disclosures and official document placeholders. General information from Prashant Jog, AMFI Registered Mutual Fund Distributor, ARN 83625.`,
          path: `/funds/${loaderData.slug}`,
        })
      : pageMeta({ title: "Fund Information Unavailable", description: "The requested fund information page is unavailable.", path: "/funds" }),
  component: FundPage,
  notFoundComponent: FundNotFound,
});

function FundPage() {
  const fund = Route.useLoaderData();
  return (
    <>
      <section className="bg-navy-gradient grain text-navy-foreground">
        <div className="container-site relative z-10 py-16 md:py-24">
          <Button asChild variant="outlineLight" size="sm"><Link to="/funds"><ArrowLeft className="h-4 w-4" /> All fund information</Link></Button>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase text-gold">
            <span>{fund.label}</span><span aria-hidden="true">·</span><span>{site.arn}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium sm:text-5xl md:text-6xl">{fund.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-foreground/75">{fund.category}. {fund.isDemonstration ? "This page remains a clearly labelled demonstration until verified source data is available." : "Source and freshness details are shown with each available value."}</p>
        </div>
      </section>
      <FundInformation fund={fund} />
    </>
  );
}

function FundNotFound() {
  return <main className="container-site py-24 text-center"><p className="eyebrow">Fund information</p><h1 className="mt-3 text-4xl font-medium">This scheme page is unavailable.</h1><p className="mt-4 text-muted-foreground">Return to the fund information directory to browse the available demonstration pages.</p><Button asChild variant="gold" size="lg" className="mt-8"><Link to="/funds">View fund information</Link></Button></main>;
}