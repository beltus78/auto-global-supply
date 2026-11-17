import { createFileRoute } from "@tanstack/react-router";
import { Catalogue } from "@/components/site/Catalogue";
import { PageHeader } from "@/components/site/PageHeader";
import { catalogueQuery } from "@/lib/catalog.functions";
import { catalogueParams } from "@/lib/search-params";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/search")({
  staticData: { sitemap: true },
  validateSearch: catalogueParams,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(catalogueQuery(deps)),
  head: ({ match }) =>
    pageHead({
      title: "Search Automotive Parts | Auto Global Supply",
      description: "Search 15,000+ automotive parts by part name, part number, engine code or vehicle model, then send your list for a written quotation with shipping.",
      path: "/search",
      noindex: Object.keys(match.search).length > 0,
    }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  return (
    <>
      <PageHeader crumbs={[{ name: "Search" }]} eyebrow="Search" title={search.q ? `Results for “${search.q}”` : "Search automotive parts"} intro="Search by part name, part number, engine code or model. Use the filters to narrow the results to your vehicle." />
      <Catalogue search={search} target={{ to: "/search" }} />
    </>
  );
}
