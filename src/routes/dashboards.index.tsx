import { createFileRoute } from "@tanstack/react-router";
import { HubPage, hubFaqLd } from "@/components/site/Hub";
import { HUBS } from "@/content/hubs";
import { hubQuery } from "@/lib/catalog.functions";
import { breadcrumbLd, pageHead } from "@/lib/seo";

const hub = HUBS["dashboards"];

export const Route = createFileRoute("/dashboards/")({
  staticData: { sitemap: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(hubQuery({ types: hub.types, limit: 12 })),
  head: () => pageHead({ title: hub.title, description: hub.description, path: hub.path, ld: [breadcrumbLd([{ name: hub.h1, path: hub.path }]), hubFaqLd(hub.faq)] }),
  component: () => <HubPage hub={hub} />,
});
