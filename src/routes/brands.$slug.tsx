import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { CtaBand } from "@/components/site/CtaBand";
import { featuredQuery } from "@/lib/catalog.functions";
import { CATEGORIES, engineBy, makeBy, modelsOf, years } from "@/lib/taxonomy";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/brands/$slug")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const make = makeBy.get(params.slug);
    if (!make) throw notFound();
    await context.queryClient.ensureQueryData(featuredQuery({ make: make.slug, limit: 8 }));
    return { make };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Brand not found" }, { name: "robots", content: "noindex" }] };
    const m = loaderData.make;
    return pageHead({
      title: `${m.name} Parts | Engines, Body, Lighting & Suspension`,
      description: `${m.intro} ${m.count.toLocaleString("en-US")} listings. Send your VIN for fitment confirmation and a quotation.`,
      path: `/brands/${params.slug}`,
      ld: [breadcrumbLd([{ name: "Brands", path: "/brands" }, { name: m.name, path: `/brands/${m.slug}` }])],
    });
  },
  component: BrandPage,
});

function BrandPage() {
  const { make } = Route.useLoaderData();
  const { data: featured } = useSuspenseQuery(featuredQuery({ make: make.slug, limit: 8 }));
  const models = modelsOf(make.slug);
  const engines = [...new Set(models.flatMap((m) => m.gens.flatMap((g) => g.engines)))].map((c) => engineBy.get(c)).filter(Boolean);
  return (
    <>
      <PageHeader crumbs={[{ name: "Brands", to: "/brands" }, { name: make.name }]} eyebrow={`${make.count.toLocaleString("en-US")} listings`} title={`${make.name} parts`} intro={make.intro}>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/parts" search={{ make: make.slug }} className="btn btn-signal">All {make.name} parts</Link>
          <Link to="/dashboards/$make" params={{ make: make.slug }} className="btn btn-ghost-dark">{make.name} dashboards</Link>
          <Link to="/interior-parts/$make" params={{ make: make.slug }} className="btn btn-ghost-dark">{make.name} interior</Link>
        </div>
      </PageHeader>

      <Section eyebrow="Fitment" title="Models and generations" intro="Choose a generation to see every part listed for it, including parts for the engines fitted.">
        <div className="border border-line bg-panel">
          {models.map((m) => (
            <div key={m.slug} className="grid gap-2 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[14rem_1fr] sm:items-center sm:px-5">
              <Link to="/parts" search={{ make: make.slug, model: m.slug }} className="font-display text-xl font-semibold uppercase hover:underline decoration-signal-deep decoration-2 underline-offset-4">{m.name}</Link>
              <div className="flex flex-wrap gap-2">
                {m.gens.map((g) => (
                  <Link key={g.id} to="/parts" search={{ make: make.slug, model: m.slug, gen: g.genSlug }} className="tag h-8 gap-2 px-2.5 hover:border-ink hover:bg-signal hover:text-signal-ink">
                    <span className="font-medium">{g.gen}</span><span className="opacity-70">{years(g)}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {featured.length ? (
        <Section eyebrow="Most requested" title={`Popular ${make.name} parts`} className="!pt-0" action={<Link to="/parts" search={{ make: make.slug }} className="btn btn-line">View all</Link>}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </Section>
      ) : null}

      <section className="border-y border-line bg-panel">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-muted">By category</p>
            <h2 className="mt-2 text-3xl">{make.name} parts by category</h2>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug} className="border-b border-line"><Link to="/parts" search={{ make: make.slug, category: c.slug }} className="block py-2.5 font-medium hover:underline">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          {engines.length ? (
            <div>
              <p className="eyebrow text-muted">By engine</p>
              <h2 className="mt-2 text-3xl">Engine families</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {engines.map((e) => (
                  <Link key={e!.code} to="/parts" search={{ engine: e!.code }} className="tag h-8 gap-2 px-2.5 hover:border-ink hover:bg-signal hover:text-signal-ink"><span className="font-medium">{e!.code}</span><span className="opacity-70">{e!.disp} {e!.fuel === "D" ? "diesel" : "petrol"}</span></Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
