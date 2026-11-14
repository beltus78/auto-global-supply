import { createFileRoute } from "@tanstack/react-router";
import { Catalogue } from "@/components/site/Catalogue";
import { PageHeader } from "@/components/site/PageHeader";
import { catalogueQuery } from "@/lib/catalog.functions";
import { catalogueParams } from "@/lib/search-params";
import { TOTAL_PRODUCTS, categoryBy, findVehicles, makeBy, partTypeBy } from "@/lib/taxonomy";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/parts")({
  staticData: { sitemap: true },
  validateSearch: catalogueParams,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(catalogueQuery(deps)),
  head: ({ match }) => {
    const s = match.search;
    const filtered = Object.keys(s).length > 0;
    return pageHead({
      title: "Automotive Parts Catalogue | Auto Global Supply",
      description: `Browse ${TOTAL_PRODUCTS.toLocaleString("en-US")} automotive parts by make, model, generation, engine and category. Add parts to your quote list and receive a written quotation.`,
      path: "/parts",
      // filtered views are useful to visitors but duplicate the category and brand pages for search engines
      noindex: filtered,
    });
  },
  component: PartsPage,
});

function PartsPage() {
  const search = Route.useSearch();
  const v = search.make && search.model ? findVehicles(search.make, search.model, search.gen)[0] : undefined;
  const bits = [search.make ? makeBy.get(search.make)?.name : null, v ? (search.gen ? `${v.model} ${v.gen}` : v.model) : null, search.part ? partTypeBy.get(search.part)?.n : search.category ? categoryBy.get(search.category)?.name : null].filter(Boolean);
  return (
    <>
      <PageHeader crumbs={[{ name: "Parts catalogue" }]} eyebrow="Catalogue" title={bits.length ? bits.join(" · ") : "Automotive parts catalogue"} intro="Filter by vehicle, category or part type. Add what you need to your quote list and we reply with price, condition and shipping." />
      <Catalogue search={search} target={{ to: "/parts" }} />
    </>
  );
}
