import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { catalogueQuery, PAGE_SIZE, type CatalogueSearch } from "@/lib/catalog.functions";
import { CATEGORIES, PART_TYPES, categoryBy, engineBy, findVehicles, makeBy, partTypeBy } from "@/lib/taxonomy";
import { ProductCard, ProductRowItem } from "./ProductCard";
import { VehicleFinder } from "./VehicleFinder";
import { cn } from "@/lib/utils";

type Target = { to: "/parts" } | { to: "/category/$slug"; params: { slug: string } } | { to: "/search" };

/** Search params without a key (and without the page, which resets on any filter change). */
function without(s: CatalogueSearch, ...keys: (keyof CatalogueSearch)[]): CatalogueSearch {
  const next: CatalogueSearch = { ...s };
  for (const k of [...keys, "page" as const]) delete next[k];
  return next;
}

export function Catalogue({ search, target, lockCategory }: { search: CatalogueSearch; target: Target; lockCategory?: string }) {
  const effective: CatalogueSearch = lockCategory ? { ...search, category: lockCategory } : search;
  const { data } = useSuspenseQuery(catalogueQuery(effective));
  const [view, setView] = useState<"list" | "grid">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const pages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
  const vehicle = effective.make && effective.model && effective.gen ? findVehicles(effective.make, effective.model, effective.gen)[0] : undefined;
  const allCount = Object.values(data.categories).reduce((a, b) => a + b, 0);

  // Report text searches and empty results so the weekly review can add what customers look for.
  useEffect(() => {
    if (!effective.q && data.total > 0) return;
    if (!effective.q && !effective.make && !effective.part && !effective.engine) return;
    try {
      const payload = JSON.stringify({ q: effective.q, make: effective.make, model: effective.model, gen: effective.gen, engine: effective.engine, category: effective.category, part: effective.part, results: data.total, path: window.location.pathname.slice(0, 80) });
      navigator.sendBeacon?.("/api/search-log", new Blob([payload], { type: "application/json" }));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effective.q, effective.make, effective.model, effective.gen, effective.engine, effective.category, effective.part, data.total]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkTo = (s: CatalogueSearch) => ({ ...(target as any), search: s }) as any;
  const partOptions = PART_TYPES.filter((p) => !effective.category || p.c === effective.category);

  const chips: { label: string; clear: CatalogueSearch }[] = [];
  if (search.q) chips.push({ label: `“${search.q}”`, clear: without(search, "q") });
  if (search.make) chips.push({ label: [makeBy.get(search.make)?.name ?? search.make, vehicle ? `${vehicle.model} ${vehicle.gen}` : search.model ? findVehicles(search.make, search.model)[0]?.model : ""].filter(Boolean).join(" "), clear: without(search, "make", "model", "gen", "engine") });
  if (search.engine) chips.push({ label: `Engine ${engineBy.get(search.engine)?.code ?? search.engine}`, clear: without(search, "engine") });
  if (search.category && !lockCategory) chips.push({ label: categoryBy.get(search.category)?.name ?? search.category, clear: without(search, "category") });
  if (search.part) chips.push({ label: partTypeBy.get(search.part)?.n ?? search.part, clear: without(search, "part") });

  const filters = (
    <div className="space-y-6">
      <div className="panel p-4">
        <p className="eyebrow mb-3 text-muted">Vehicle</p>
        <VehicleFinder key={`${search.make}-${search.model}-${search.gen}-${search.engine}`} tone="light" compact initial={{ make: search.make, model: search.model, gen: search.gen, engine: search.engine, category: lockCategory ? undefined : search.category }} />
      </div>
      {!lockCategory ? (
        <div className="panel p-4">
          <p className="eyebrow mb-2 text-muted">Category</p>
          <ul className="text-[14px]">
            <li><Link {...linkTo(without(search, "category", "part"))} className={cn("flex justify-between border-b border-line py-2", !search.category && "font-semibold")}><span>All categories</span><span className="mono text-[11px] text-muted">{allCount.toLocaleString("en-US")}</span></Link></li>
            {CATEGORIES.map((c) => {
              const count = data.categories[c.slug] ?? 0;
              if (!count && search.category !== c.slug) return null;
              return (
                <li key={c.slug}>
                  <Link {...linkTo({ ...without(search, "part"), category: c.slug })} className={cn("flex justify-between gap-2 border-b border-line py-2 last:border-b-0 hover:text-ink", search.category === c.slug ? "font-semibold text-ink" : "text-ink-2")}>
                    <span>{c.name}</span><span className="mono text-[11px] text-muted">{count.toLocaleString("en-US")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      <div className="panel p-4">
        <label className="eyebrow mb-3 text-muted" htmlFor="cat-part">Part type</label>
        <PartSelect options={partOptions} value={search.part ?? ""} search={search} linkTo={linkTo} />
      </div>
    </div>
  );

  return (
    <div className="wrap grid gap-6 py-8 lg:grid-cols-[18rem_1fr] lg:py-10">
      <aside className="hidden lg:block">{filters}</aside>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono text-[12px] uppercase tracking-[0.08em] text-ink-2"><span className="text-ink">{data.total.toLocaleString("en-US")}</span> {data.total === 1 ? "part" : "parts"}{pages > 1 ? ` · page ${data.page} of ${pages}` : ""}</p>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-line btn-sm lg:hidden" onClick={() => setFiltersOpen((v) => !v)} aria-expanded={filtersOpen}><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <div className="flex border border-line-strong" role="group" aria-label="View">
              <button type="button" onClick={() => setView("list")} aria-pressed={view === "list"} className={cn("flex h-[2.15rem] w-9 items-center justify-center", view === "list" ? "bg-steel text-steel-text" : "bg-panel")} aria-label="List view"><List className="h-4 w-4" /></button>
              <button type="button" onClick={() => setView("grid")} aria-pressed={view === "grid"} className={cn("flex h-[2.15rem] w-9 items-center justify-center", view === "grid" ? "bg-steel text-steel-text" : "bg-panel")} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        {filtersOpen ? <div className="mt-4 lg:hidden">{filters}</div> : null}

        {chips.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <Link key={c.label} {...linkTo(c.clear)} className="tag h-7 gap-1.5 border-ink bg-steel pr-1.5 text-steel-text hover:bg-steel-3">{c.label}<X className="h-3.5 w-3.5" /></Link>
            ))}
            {chips.length > 1 ? <Link {...linkTo({})} className="mono text-[11px] uppercase tracking-[0.08em] text-muted underline underline-offset-4">Clear all</Link> : null}
          </div>
        ) : null}

        {vehicle ? (
          <p className="mt-4 border-l-4 border-signal-deep bg-panel px-4 py-3 text-[13.5px] text-ink-2">
            Showing parts listed for the <strong className="text-ink">{vehicle.name}</strong> ({vehicle.from}–{vehicle.to || "present"}), including parts for the engines fitted to this model. Fitment is confirmed against your VIN before any quotation.
          </p>
        ) : null}

        {data.items.length ? (
          view === "list" ? (
            <div className="mt-4 border border-line">{data.items.map((p) => <ProductRowItem key={p.slug} p={p} />)}</div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{data.items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          )
        ) : (
          <div className="panel mt-4 p-8">
            <h2 className="text-2xl">No listing matches those filters</h2>
            <p className="mt-2 max-w-xl text-ink-2">The catalogue shows the parts we are asked for most. We supply far more than is listed. Send the part name or number with your VIN and we will search for it.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/request-a-part" className="btn btn-signal">Request this part</Link>
              <Link {...linkTo({})} className="btn btn-line">Clear filters</Link>
            </div>
          </div>
        )}

        {pages > 1 ? (
          <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3">
            {data.page > 1 ? <Link {...linkTo({ ...search, page: data.page - 1 })} className="btn btn-line">Previous</Link> : <span />}
            <span className="mono text-[12px] text-muted">{data.page} / {pages}</span>
            {data.page < pages ? <Link {...linkTo({ ...search, page: data.page + 1 })} className="btn btn-dark">Next page</Link> : <span />}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

import { useNavigate } from "@tanstack/react-router";
import type { PartType } from "@/lib/taxonomy";

function PartSelect({ options, value, search, linkTo }: { options: PartType[]; value: string; search: CatalogueSearch; linkTo: (s: CatalogueSearch) => { to: string } }) {
  const navigate = useNavigate();
  return (
    <select
      id="cat-part"
      className="field"
      value={value}
      onChange={(e) => {
        const next = without(search, "part");
        if (e.target.value) next.part = e.target.value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void navigate(linkTo(next) as any);
      }}
    >
      <option value="">All part types</option>
      {[...options].sort((a, b) => a.n.localeCompare(b.n)).map((p) => <option key={p.s} value={p.s}>{p.n}</option>)}
    </select>
  );
}
