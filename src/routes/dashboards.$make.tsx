import { createFileRoute, notFound } from "@tanstack/react-router";
import { HubMakePage, makeForHub } from "@/components/site/Hub";
import { HUBS } from "@/content/hubs";
import { hubQuery } from "@/lib/catalog.functions";
import { modelsOf } from "@/lib/taxonomy";
import { breadcrumbLd, pageHead } from "@/lib/seo";

const hub = HUBS["dashboards"];

export const Route = createFileRoute("/dashboards/$make")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const make = makeForHub(params.make);
    if (!make) throw notFound();
    const data = await context.queryClient.ensureQueryData(hubQuery({ types: hub.types, make: make.slug, limit: 600 }));
    if (!data.total) throw notFound();
    return { make, count: data.total };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const { make, count } = loaderData;
    const models = modelsOf(make.slug).map((m) => m.name).slice(0, 4).join(", ");
    return pageHead({
      title: hub.makeTitle(make.name),
      description: hub.makeDescription(make.name, models, count),
      path: `${hub.path}/${params.make}`,
      ld: [breadcrumbLd([{ name: hub.h1, path: hub.path }, { name: make.name, path: `${hub.path}/${make.slug}` }])],
    });
  },
  component: Page,
});

function Page() {
  const { make } = Route.useLoaderData();
  return <HubMakePage hub={hub} make={make} />;
}
