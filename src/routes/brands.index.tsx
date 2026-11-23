import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { MAKES, modelsOf } from "@/lib/taxonomy";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/brands/")({
  staticData: { sitemap: true },
  head: () => pageHead({ title: "Vehicle Brands | Auto Global Supply", description: "Browse automotive parts by vehicle brand: BMW, Mercedes-Benz, Audi, Porsche, Range Rover, Land Rover, Bentley, Rolls-Royce and more.", path: "/brands" }),
  component: BrandsPage,
});

function BrandsPage() {
  const groups = [
    { title: "European & premium", makes: MAKES.filter((m) => m.premium) },
    { title: "Japanese, Korean & American", makes: MAKES.filter((m) => !m.premium) },
  ];
  return (
    <>
      <PageHeader crumbs={[{ name: "Brands" }]} eyebrow="Fitment" title="Vehicle brands" intro={`Parts listed for ${MAKES.length} vehicle brands. Choose a brand to see its models, generations and most requested parts.`} />
      {groups.map((g) => (
        <Section key={g.title} title={g.title} className="!pb-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.makes.map((m) => {
              const models = modelsOf(m.slug);
              return (
                <Link key={m.slug} to="/brands/$slug" params={{ slug: m.slug }} className="panel group flex flex-col p-5 transition-colors hover:border-ink">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-2xl">{m.name}</h3>
                    <span className="mono text-[11px] text-muted">{m.count.toLocaleString("en-US")} parts</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13.5px] text-ink-2">{models.map((x) => x.name).join(" · ")}</p>
                  <span className="mono mt-4 text-[11px] uppercase tracking-[0.1em] underline decoration-signal-deep decoration-2 underline-offset-4">{models.length} models</span>
                </Link>
              );
            })}
          </div>
        </Section>
      ))}
      <div className="h-12" />
      <CtaBand title="Brand or model not listed?" text="We supply parts for many more vehicles than the catalog shows. Send the vehicle details and the part you need." />
    </>
  );
}
