import { createFileRoute, notFound } from "@tanstack/react-router";
import { Catalogue } from "@/components/site/Catalogue";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { catalogueQuery } from "@/lib/catalog.functions";
import { catalogueParams } from "@/lib/search-params";
import { categoryBy } from "@/lib/taxonomy";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/category/$slug")({
  staticData: { sitemap: true },
  validateSearch: catalogueParams,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params, deps }) => {
    const category = categoryBy.get(params.slug);
    if (!category) throw notFound();
    await context.queryClient.ensureQueryData(catalogueQuery({ ...deps, category: category.slug }));
    return { category };
  },
  head: ({ loaderData, params, match }) => {
    if (!loaderData) return { meta: [{ title: "Category not found" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.category;
    return pageHead({
      title: `${c.name} | Automotive Parts`,
      description: `${c.description} ${c.count.toLocaleString("en-US")} listings for BMW, Mercedes-Benz, Audi, Porsche, Range Rover and more. Quotation on request.`,
      path: `/category/${params.slug}`,
      noindex: Object.keys(match.search).length > 0,
      ld: [breadcrumbLd([{ name: "Parts catalogue", path: "/parts" }, { name: c.name, path: `/category/${c.slug}` }])],
    });
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const search = Route.useSearch();
  return (
    <>
      <PageHeader crumbs={[{ name: "Parts catalogue", to: "/parts" }, { name: category.name }]} eyebrow={`${category.count.toLocaleString("en-US")} listings`} title={category.name} intro={category.description} />
      <Catalogue search={search} target={{ to: "/category/$slug", params: { slug: category.slug } }} lockCategory={category.slug} />
      <CtaBand />
    </>
  );
}
