import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader, Section } from "@/components/site/PageHeader";
import { PartArt } from "@/components/site/PartArt";
import { CtaBand } from "@/components/site/CtaBand";
import { UPGRADES, UPGRADE_CATEGORIES } from "@/content/upgrades";
import { partTypeBy } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/parts-upgrades")({
  staticData: { sitemap: true },
  head: () => pageHead({ title: "Parts & Upgrades | Auto Global Supply", description: "Dashboard and infotainment upgrades, facelift conversion kits, VIP van interiors, front cuts, seat sets and engines. Examples of what customers request, each quoted individually.", path: "/parts-upgrades" }),
  component: UpgradesPage,
});

const TYPES = ["dashboard-upgrade-kit", "facelift-conversion-kit", "vip-interior-conversion", "front-cut", "body-kit", "infotainment-upgrade", "interior-upgrade-package", "complete-seat-set"];

function UpgradesPage() {
  const [cat, setCat] = useState<string>("");
  const list = UPGRADES.filter((u) => !cat || u.category === cat);
  return (
    <>
      <PageHeader crumbs={[{ name: "Parts & upgrades" }]} eyebrow="Upgrades · conversions · assemblies" title="Parts & upgrades" intro="Dashboard kits, new-look conversions, VIP interiors, front cuts and complete assemblies. These go beyond a single replacement part, so each one is specified and quoted individually." />

      <Section eyebrow="In the catalogue" title="Upgrade and conversion types" intro="Each type is listed per vehicle generation in the catalogue. Open one to see the vehicles covered.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((s) => {
            const pt = partTypeBy.get(s);
            if (!pt) return null;
            return (
              <Link key={s} to="/parts" search={{ part: s }} className="panel group flex flex-col transition-colors hover:border-ink">
                <PartArt icon={pt.i} className="aspect-[16/9] w-full" />
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-xl leading-tight">{pt.n}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-[13px] text-ink-2">{pt.d}</p>
                  <span className="mono mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em]">View vehicles <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <section className="border-y border-line bg-panel">
        <div className="wrap py-12 sm:py-16">
          <p className="eyebrow text-muted">From our enquiry desk</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">Configurations customers have requested</h2>
          <p className="mt-3 max-w-2xl text-ink-2">Real requests handled by our parts desk, shown as examples of scope. Availability, contents and price are confirmed for your vehicle in a written quotation.</p>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {["", ...UPGRADE_CATEGORIES].map((c) => (
              <button key={c || "all"} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={cn("tag h-8 cursor-pointer px-3", cat === c ? "border-ink bg-steel text-steel-text" : "hover:border-ink")}>{c || "All"}</button>
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {list.map((u) => (
              <article key={u.id} className="flex border border-line bg-paper">
                <PartArt icon={u.icon} className="hidden w-32 shrink-0 sm:block" />
                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                  <p className="mono flex flex-wrap gap-x-3 text-[10.5px] uppercase tracking-[0.08em] text-muted"><span>{u.category}</span><span>{u.make} {u.model}{u.year ? ` · ${u.year}` : ""}</span></p>
                  <h3 className="mt-2 text-xl leading-tight">{u.title}</h3>
                  <ul className="mt-2 space-y-1 text-[13.5px] text-ink-2">{u.details.map((d) => <li key={d}>{d}</li>)}</ul>
                  <p className="mt-3 border-l-2 border-signal-deep pl-3 text-[13px]"><span className="font-semibold">Before quoting:</span> {u.confirmation}</p>
                  <div className="mt-auto pt-4">
                    <Link to="/request-a-part" search={{ part: `${u.title} (${u.make} ${u.model}${u.year ? ` ${u.year}` : ""})` }} className="btn btn-dark btn-sm">Enquire about this</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Have a different upgrade in mind?" text="Describe the result you want and send your VIN with photographs of the car. We tell you what can be supplied and what installation involves." />
    </>
  );
}
