import type React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Boxes, CarFront, Globe2, PackageSearch, Truck } from "lucide-react";
import { VehicleFinder } from "@/components/site/VehicleFinder";
import { PartArt } from "@/components/site/PartArt";
import { HeroRig, Ticker } from "@/components/site/HeroRig";
import { CountUp, TypeCycle } from "@/components/site/Motion";
import { ProductCard } from "@/components/site/ProductCard";
import { CtaBand } from "@/components/site/CtaBand";
import { Reviews } from "@/components/site/Reviews";
import { Section } from "@/components/site/PageHeader";
import { featuredQuery } from "@/lib/catalog.functions";
import { CATEGORIES, ENGINES, MAKES, TOTAL_PRODUCTS, VEHICLES } from "@/lib/taxonomy";
import { pageHead } from "@/lib/seo";

const FEATURES = [
  { Icon: CarFront, title: "VIN-based fitment", text: "Vehicle details identify the required specification before an order is finalized." },
  { Icon: Globe2, title: "US registered company", text: "AUTO SPARE PARTS IMPORT EXPORT LLC, registered in Opa-locka, Florida." },
  { Icon: Boxes, title: "New & replacement parts", text: "New, used and remanufactured options, depending on the part and your preference." },
  { Icon: PackageSearch, title: "Built for bulk buyers", text: "Send a full parts list and get one quotation, with volume pricing for repeat orders." },
  { Icon: Truck, title: "Free shipping, 1–3 business days", text: "Free to every US state, bulk orders included. Courier, freight and pallet delivery." },
];

const STEPS = [
  ["Send your details", "VIN, part number, vehicle details or a photo of the part."],
  ["We verify the specification", "The information is checked against the vehicle build before anything is offered."],
  ["We check our stock", "Availability and quantities are confirmed in our warehouse."],
  ["You receive a quotation", "Price, condition, lead time and shipping, in writing."],
  ["Shipping is arranged", "Packed securely and shipped by the agreed method."],
];

// Requests our parts desk handles most often. Each links to the matching catalog view.
const REQUESTED: { label: string; search: Record<string, string> }[] = [
  { label: "V-Class & Vito W447 dashboard kits", search: { make: "mercedes-benz", model: "v-class", part: "dashboard-upgrade-kit" } },
  { label: "Van VIP interior conversions", search: { part: "vip-interior-conversion" } },
  { label: "Facelift & new-look conversion kits", search: { part: "facelift-conversion-kit" } },
  { label: "Front cuts (complete front ends)", search: { part: "front-cut" } },
  { label: "Complete engines", search: { part: "complete-engine" } },
  { label: "Automatic & dual-clutch gearboxes", search: { part: "gearbox" } },
  { label: "LED, matrix & laser headlights", search: { part: "headlight" } },
  { label: "Air suspension struts", search: { part: "front-air-strut" } },
  { label: "ABS & stability control units", search: { part: "abs-pump-module" } },
  { label: "Complete seat sets", search: { part: "complete-seat-set" } },
  { label: "Turbochargers", search: { part: "turbocharger" } },
  { label: "Engine control units", search: { part: "engine-ecu" } },
];

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () =>
    pageHead({
      title: "Wholesale Car Parts for US Buyers | Auto Global Supply",
      description: "Wholesale car parts for US repair shops, dealers, parts stores and fleets, from a Florida-registered company. Bulk quotes in US dollars.",
      path: "/",
    }),
  loader: ({ context }) => context.queryClient.ensureQueryData(featuredQuery({ limit: 8 })),
  component: HomePage,
});

function HomePage() {
  const { data: featured } = useSuspenseQuery(featuredQuery({ limit: 8 }));
  const n = (x: number) => x.toLocaleString("en-US");
  return (
    <>
      <section className="relative overflow-hidden bg-steel text-steel-text grid-steel grid-drift">
        <div className="wrap grid gap-10 pb-28 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-32 lg:pt-20">
          <div>
            <p data-reveal="wipe" className="eyebrow text-signal">Wholesale automotive parts · own warehouse stock</p>
            <h1 className="mt-5 text-[2.9rem] sm:text-6xl lg:text-7xl">
              <span data-reveal className="block" style={{ "--i": 1 } as React.CSSProperties}>Car parts in volume.</span>
              <span data-reveal className="block" style={{ "--i": 2 } as React.CSSProperties}>From our own warehouse.</span>
              <span data-reveal className="block text-signal" style={{ "--i": 3 } as React.CSSProperties}>Free US shipping.</span>
            </h1>
            <p data-reveal style={{ "--i": 4 } as React.CSSProperties} className="mt-5 max-w-xl text-base text-steel-muted sm:text-lg">
              Auto Global Supply is a Florida-registered parts wholesaler selling to repair shops, dealers, parts stores and fleets across the United States, from its own stock. Send your parts list for a bulk quotation in US dollars.
            </p>
            <p data-reveal style={{ "--i": 5 } as React.CSSProperties} className="mono mt-5 text-[12px] uppercase tracking-[0.1em] text-steel-muted">
              Customers are searching for: <TypeCycle className="text-steel-text" phrases={["W447 V-Class dashboard kit", "S-Class W222 dashboard", "X5 G05 front seats", "Range Rover L405 steering wheel", "B58 turbocharger", "Cayenne 9YA matrix headlight"]} />
            </p>
            <div data-reveal style={{ "--i": 6 } as React.CSSProperties} className="mt-7 flex flex-wrap gap-3">
              <Link to="/request-a-part" className="btn btn-signal btn-lg">Get a bulk quote</Link>
              <Link to="/parts" className="btn btn-ghost-dark btn-lg">Browse {n(TOTAL_PRODUCTS)} parts <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          <div data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <HeroRig />
            <dl className="grid grid-cols-2 border-x border-b border-steel-line bg-steel-2 sm:grid-cols-4">
              {[[TOTAL_PRODUCTS, "Part listings"], [VEHICLES.length, "Vehicle generations"], [ENGINES.length, "Engine families"], [MAKES.length, "Vehicle brands"]].map(([v, l]) => (
                <div key={l as string} className="border-r border-steel-line px-4 py-4 last:border-r-0 max-sm:[&:nth-child(2n)]:border-r-0 max-sm:[&:nth-child(-n+2)]:border-b">
                  <dt className="mono text-[10px] uppercase tracking-[0.12em] text-steel-muted">{l}</dt>
                  <dd className="mt-1 font-display text-3xl font-bold text-signal"><CountUp value={v as number} /></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="hazard-run absolute inset-x-0 bottom-0 h-1.5" />
      </section>
      <Ticker items={["Dashboards", ...MAKES.filter((m) => m.premium).map((m) => m.name), "Interior parts", "Engines", "Gearboxes", "Headlights", "Air suspension", "Conversion kits"]} />

      <div className="wrap relative z-10 mt-8">
        <div data-reveal className="panel border-t-4 border-t-signal p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl">Search by vehicle</h2>
            <p className="text-[13px] text-muted">Or search by part name, part number or engine code in the bar above.</p>
          </div>
          <VehicleFinder tone="light" />
        </div>
      </div>

      <section className="wrap grid gap-px overflow-hidden pt-12 sm:grid-cols-2 lg:grid-cols-5">
        {FEATURES.map(({ Icon, title, text }) => (
          <div key={title} data-reveal style={{ "--i": FEATURES.findIndex((f) => f.title === title) } as React.CSSProperties} className="border-l-2 border-line-strong py-1 pl-4 transition-colors hover:border-signal-deep max-lg:mb-5">
            <Icon className="h-6 w-6" />
            <h3 className="mt-3 text-lg">{title}</h3>
            <p className="mt-1.5 text-[13.5px] text-ink-2">{text}</p>
          </div>
        ))}
      </section>

      <Section eyebrow="Catalog" title="Shop by category" intro="Twelve component groups, each filterable by make, model, generation and engine." action={<Link to="/parts" className="btn btn-line">View full catalog</Link>}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} data-reveal style={{ "--i": CATEGORIES.indexOf(c) % 4 } as React.CSSProperties} to="/category/$slug" params={{ slug: c.slug }} className="panel bracket group flex flex-col transition-colors hover:border-ink">
              <PartArt icon={c.icon} className="aspect-[16/10] w-full" />
              <div className="flex flex-1 items-start justify-between gap-2 p-3.5">
                <div>
                  <h3 className="text-lg leading-tight sm:text-xl">{c.name}</h3>
                  <p className="mt-1 hidden text-[13px] text-muted sm:block">{c.description}</p>
                </div>
                <span className="mono shrink-0 text-[11px] text-muted">{n(c.count)}</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <section className="border-y border-line bg-panel">
        <div className="wrap grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
          <div>
            <p className="eyebrow text-muted">From our inquiry desk</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">What customers ask us for most</h2>
            <p className="mt-3 text-ink-2">These are the requests that reach our parts desk most often, from single components to complete conversions. Each opens the matching part of the catalog.</p>
            <Link to="/parts-upgrades" className="btn btn-dark mt-5">Parts & upgrades</Link>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {REQUESTED.map((r, i) => (
              <li key={r.label} className="border-b border-line">
                <Link to="/parts" search={r.search} className="group flex items-center gap-3 py-3 font-medium">
                  <span className="mono w-6 text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 group-hover:underline decoration-signal-deep decoration-2 underline-offset-4">{r.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap grid gap-3 pt-12 sm:pt-16 lg:grid-cols-2">
        {[
          { to: "/dashboards", icon: "dashboard", eyebrow: "Most requested", title: "Dashboards & upgrade kits", text: "Replacement dashboards, W447 V-Class and Vito upgrade kits, instrument clusters and infotainment screens, matched by steering side and trim." },
          { to: "/interior-parts", icon: "seat", eyebrow: "Interior", title: "Seats, wheels, trim & VIP interiors", text: "Seat sets, steering wheels, consoles, door panels, headliners, trim and complete van interior conversions." },
        ].map((h, i) => (
          <Link key={h.to} to={h.to} data-reveal style={{ "--i": i } as React.CSSProperties} className="bracket group grid overflow-hidden border border-line bg-steel text-steel-text sm:grid-cols-[0.9fr_1.1fr]">
            <PartArt icon={h.icon} className="aspect-[16/10] sm:aspect-auto sm:min-h-64" />
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="eyebrow text-signal">{h.eyebrow}</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">{h.title}</h2>
              <p className="mt-3 text-[14px] text-steel-muted">{h.text}</p>
              <span className="mono mt-5 flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] text-signal">Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" /></span>
            </div>
          </Link>
        ))}
      </section>

      <Section eyebrow="Most requested" title="Popular listings" action={<Link to="/parts" className="btn btn-line">All parts</Link>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </Section>

      <section className="bg-steel text-steel-text grid-steel">
        <div className="wrap py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-signal">Fitment</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Browse parts by vehicle brand</h2>
            </div>
            <Link to="/brands" className="btn btn-ghost-dark">View all represented brands</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-px border border-steel-line bg-steel-line sm:grid-cols-3 lg:grid-cols-5">
            {MAKES.slice(0, 20).map((m) => (
              <Link key={m.slug} to="/brands/$slug" params={{ slug: m.slug }} className="group flex items-baseline justify-between gap-2 bg-steel px-4 py-4 hover:bg-steel-2">
                <span className="font-display text-xl font-semibold uppercase group-hover:text-signal">{m.name}</span>
                <span className="mono text-[11px] text-steel-muted">{n(m.count)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="How it works" title="From inquiry to quotation in five clear steps" action={<Link to="/how-it-works" className="btn btn-line">See the parts supply process</Link>}>
        <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(([title, text], i) => (
            <li key={title} data-reveal style={{ "--i": i } as React.CSSProperties} className="group bg-panel p-5 transition-colors hover:bg-steel hover:text-steel-text">
              <span className="font-display text-5xl font-bold text-signal-deep transition-colors group-hover:text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-xl">{title}</h3>
              <p className="mt-1.5 text-[13.5px] text-ink-2 group-hover:text-steel-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <section className="wrap pb-14">
        <div className="grid border border-line bg-panel lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-10">
            <p className="eyebrow text-muted">Repair shops · dealers · fleets · parts stores</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">Trade accounts for regular buyers</h2>
            <p className="mt-3 max-w-xl text-ink-2">For businesses that buy parts in volume. Approved trade buyers send multi-line parts lists in one request, get volume pricing on repeat lines and keep every quotation in one place.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/trade" className="btn btn-signal">Apply for a trade account</Link>
              <Link to="/wholesale" className="btn btn-line">Wholesale orders</Link>
              <Link to="/wholesale-auto-parts-usa" className="btn btn-line">US buyers</Link>
            </div>
          </div>
          <ul className="grid content-center gap-px border-t border-line bg-line lg:border-l lg:border-t-0">
            {["One request for a complete parts list", "Quotation history in your trade area", "Repeat requirements handled by the same desk", "Consolidated shipping for mixed orders"].map((t) => (
              <li key={t} className="flex items-center gap-3 bg-paper px-6 py-4 text-[14px] font-medium"><span className="h-2 w-2 shrink-0 bg-signal-deep" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <Reviews />
      <CtaBand />
    </>
  );
}
