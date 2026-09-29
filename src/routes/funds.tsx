import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/funds")({
  head: () => ({ meta: [{ title: "Fund Information | Prashant Jog" }, { name: "description", content: "Official-source mutual fund information and clearly labelled data availability." }, { property: "og:title", content: "Fund Information | Prashant Jog" }, { property: "og:description", content: "Official-source mutual fund information and clearly labelled data availability." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: FundsLayout,
});

function FundsLayout() {
  return <Outlet />;
}