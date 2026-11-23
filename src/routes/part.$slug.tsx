import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ClipboardCheck, FileSearch, ShieldCheck, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/site/PageHeader";
import { AddToQuote, ProductCard, ProductImage } from "@/components/site/ProductCard";
import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import { CtaBand } from "@/components/site/CtaBand";
import { productQuery } from "@/lib/catalog.functions";
import { BUSINESS, whatsappUrl } from "@/lib/business";
import { aspName, categoryBy, conditions, engineBy, fuelName, gearboxBy, makeBy, partTypeBy, productDescription, vehicleBy, years, type ProductRow } from "@/lib/taxonomy";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/part/$slug")({
  staticData: { sitemap: true },
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return { name: data.product.name, description: productDescription(data.product), sku: data.product.sku, cat: data.product.cat, make: data.product.make };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Part not found" }, { name: "robots", content: "noindex" }] };
    const cat = categoryBy.get(loaderData.cat);
    return pageHead({
      title: loaderData.name,
      description: loaderData.description,
      path: `/part/${params.slug}`,
      ld: [
        breadcrumbLd([{ name: "Parts catalog", path: "/parts" }, ...(cat ? [{ name: cat.name, path: `/category/${cat.slug}` }] : []), { name: loaderData.name, path: `/part/${params.slug}` }]),
        { "@context": "https://schema.org", "@type": "Product", name: loaderData.name, sku: loaderData.sku, description: loaderData.description, category: cat?.name, brand: { "@type": "Brand", name: BUSINESS.brand }, url: `${BUSINESS.website}/part/${params.slug}` },
      ],
    });
  },
  component: PartPage,
});

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9.5rem_1fr] gap-3 border-b border-line px-4 py-2.5 last:border-b-0">
      <dt className="mono pt-0.5 text-[11px] uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="text-[14px]">{children}</dd>
    </div>
  );
}

function PartPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  if (!data) return null;
  const { product: p, related } = data;
  const pt = partTypeBy.get(p.ptype);
  const cat = categoryBy.get(p.cat);
  const v = p.veh ? vehicleBy.get(p.veh) : undefined;
  const e = p.eng ? engineBy.get(p.eng) : undefined;
  const g = p.gbx ? gearboxBy.get(p.gbx) : undefined;
  const make = makeBy.get(v?.make ?? p.make);
  const fitVehicles = e ? e.vehicles.map((id) => vehicleBy.get(id)).filter(Boolean) : [];
  const wa = whatsappUrl(`Hello Auto Global Supply, I'd like a quotation for: ${p.name} (${p.sku}). My VIN is: `);

  return (
    <>
      <div className="border-b border-line bg-panel">
        <div className="wrap py-3.5">
          <Breadcrumbs tone="light" items={[{ name: "Parts catalog", to: "/parts" }, ...(cat ? [{ name: cat.name, to: "/category/$slug", params: { slug: cat.slug } }] : []), { name: p.name }]} />
        </div>
      </div>

      <div className="wrap grid gap-8 py-8 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:py-12">
        <div>
          <ProductImage p={p} className="aspect-[4/3] w-full border border-line" />
          {!p.image ? <p className="mt-2 text-[12.5px] text-muted">Technical illustration of the part type. Photographs of the actual part are supplied with your quotation.</p> : null}
        </div>

        <div>
          <p className="mono flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.1em] text-muted">
            <span>{cat?.name}</span>
            <span className="text-ink">SKU {p.sku}</span>
            {p.oem ? <span className="text-ink">OEM ref {p.oem}</span> : null}
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{p.name}</h1>
          <p className="mt-3 text-[15px] text-ink-2">
            {v ? `For ${make?.name} ${v.model} ${v.gen}, model years ${years(v)}.` : e ? `For vehicles fitted with the ${e.code} ${e.disp} ${e.layout} ${fuelName(e.fuel).toLowerCase()} engine.` : g ? `Used in: ${g.apps}.` : ""}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {conditions(pt).map((c) => <span key={c} className="tag h-7 px-2.5">{c}</span>)}
          </div>

          <div className="panel mt-6 border-l-4 border-l-signal-deep p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-2xl font-bold uppercase">Price on quotation</p>
                <p className="mt-0.5 text-[13px] text-muted">Price, condition, lead time and shipping are confirmed in writing before you order.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <AddToQuote p={p} size="lg" />
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-lg bg-whatsapp text-white hover:brightness-110"><WhatsAppIcon className="h-5 w-5" /> Ask on WhatsApp</a>
            </div>
            <p className="mt-3 text-[13px] text-ink-2">Added parts go to your <Link to="/quote" className="underline decoration-signal-deep decoration-2 underline-offset-4">quote list</Link>. Send the list with your VIN when you are ready.</p>
          </div>

          <ul className="mt-6 grid gap-3 text-[13.5px] sm:grid-cols-2">
            {[[FileSearch, "Fitment checked against your VIN"], [ClipboardCheck, "Written quotation before purchase"], [ShieldCheck, "Warranty terms stated in the quotation"], [Truck, "Export packing and worldwide shipping"]].map(([Icon, text]) => {
              const I = Icon as typeof Truck;
              return <li key={text as string} className="flex items-center gap-2.5"><I className="h-4.5 w-4.5 shrink-0 text-ink" />{text as string}</li>;
            })}
          </ul>
        </div>
      </div>

      <div className="border-y border-line bg-panel">
        <div className="wrap grid gap-10 py-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:py-14">
          <div>
            <h2 className="text-3xl">About this part</h2>
            <div className="prose-ags">
              {p.note ? <p>{p.note}</p> : null}
              <p>{pt?.d}</p>
              <p>
                Catalog listings describe the part type and the vehicles it is listed for. The exact part number depends on the build of your vehicle, so we confirm it from your VIN before quoting. If more than one version exists for your car, the quotation shows which one we matched and why.
              </p>
              <h3>What to send for a quotation</h3>
              <ul>
                <li><strong>VIN</strong> (17 characters). This settles most fitment questions.</li>
                <li>The <strong>part number</strong> printed on your existing part, if you can read it.</li>
                <li>A <strong>photograph</strong> of the part or its label.</li>
                <li>The <strong>condition</strong> you prefer and the <strong>country</strong> we are shipping to.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-3xl">Specification & fitment</h2>
            <dl className="mt-5 border border-line bg-paper">
              <Spec label="Part type">{pt?.n}{p.side ? `, ${p.side} side` : ""}</Spec>
              <Spec label="Category">{cat ? <Link to="/category/$slug" params={{ slug: cat.slug }} className="underline underline-offset-4">{cat.name}</Link> : null}{p.cat === "interior" && v ? <> · <Link to={["dashboard", "dashboard-upgrade-kit"].includes(p.ptype) ? "/dashboards/$make" : "/interior-parts/$make"} params={{ make: v.make }} className="underline underline-offset-4">All {make?.name} {["dashboard", "dashboard-upgrade-kit"].includes(p.ptype) ? "dashboards" : "interior parts"}</Link></> : null}</Spec>
              <Spec label="SKU"><span className="mono">{p.sku}</span></Spec>
              <Spec label="Conditions offered">{conditions(pt).join(", ")}</Spec>
              {v ? (
                <>
                  <Spec label="Make"><Link to="/brands/$slug" params={{ slug: v.make }} className="underline underline-offset-4">{make?.name}</Link></Spec>
                  <Spec label="Model">{v.model}</Spec>
                  <Spec label="Generation"><span className="mono">{v.gen}</span></Spec>
                  <Spec label="Model years">{years(v)}</Spec>
                  {v.engines.length ? <Spec label="Engines in range"><span className="flex flex-wrap gap-1.5">{v.engines.map((c) => <Link key={c} to="/parts" search={{ engine: c }} className="tag hover:border-ink">{c}</Link>)}</span></Spec> : null}
                </>
              ) : null}
              {e ? (
                <>
                  <Spec label="Engine code"><span className="mono">{e.code}</span></Spec>
                  <Spec label="Displacement">{e.disp}</Spec>
                  <Spec label="Layout">{e.layout}</Spec>
                  <Spec label="Fuel">{fuelName(e.fuel)}</Spec>
                  <Spec label="Induction">{aspName(e.asp)}</Spec>
                  <Spec label="About the engine">{e.note}</Spec>
                </>
              ) : null}
              {g ? (
                <>
                  <Spec label="Gearbox">{g.name}</Spec>
                  <Spec label="Type">{g.kind === "dct" ? "Dual-clutch automatic" : "Torque-converter automatic"}</Spec>
                  <Spec label="Applications">{g.apps}</Spec>
                </>
              ) : null}
              <Spec label="Ships from">Our warehouse in Guangzhou, China</Spec>
            </dl>

            {fitVehicles.length ? (
              <>
                <h3 className="mt-8 text-xl">Vehicles listed with this engine</h3>
                <div className="mt-3 border border-line bg-paper">
                  {fitVehicles.map((fv) => (
                    <Link key={fv!.id} to="/parts" search={{ make: fv!.make, model: fv!.modelSlug, gen: fv!.genSlug }} className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 text-[14px] last:border-b-0 hover:bg-panel">
                      <span className="font-medium">{fv!.name}</span>
                      <span className="mono text-[11.5px] text-muted">{years(fv!)}</span>
                    </Link>
                  ))}
                </div>
                <p className="mt-2 text-[12.5px] text-muted">Engine variants differ between models and years. This list is a guide. Your VIN confirms the match.</p>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="wrap py-12">
          <p className="eyebrow text-muted">{v ? `More for the ${v.model} ${v.gen}` : e ? `More for the ${e.code}` : "Related"}</p>
          <h2 className="mt-2 text-3xl">Related parts</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{related.map((r: ProductRow) => <ProductCard key={r.slug} p={r} />)}</div>
          {v ? <Link to="/parts" search={{ make: v.make, model: v.modelSlug, gen: v.genSlug }} className="btn btn-line mt-6">All parts for the {v.model} {v.gen}</Link> : null}
        </section>
      ) : null}
      <CtaBand />
    </>
  );
}
