import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader, Section } from "./PageHeader";
import { PartArt } from "./PartArt";
import { ProductCard, ProductRowItem } from "./ProductCard";
import { CtaBand } from "./CtaBand";
import { TypeCycle } from "./Motion";
import { hubQuery } from "@/lib/catalog.functions";
import { MAKES, makeBy, modelsOf, partTypeBy, years, type Make } from "@/lib/taxonomy";
import { GUIDES } from "@/content/guides";
import { UPGRADES } from "@/content/upgrades";
import type { Hub } from "@/content/hubs";

const st = (i: number) => ({ "--i": i }) as CSSProperties;

function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="border border-line bg-panel">
      {items.map(([q, a]) => (
        <details key={q} className="group border-b border-line last:border-b-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 font-semibold [&::-webkit-details-marker]:hidden">
            {q}
            <span className="mono text-lg text-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="px-4 pb-4 text-[14.5px] text-ink-2">{a}</p>
        </details>
      ))}
    </div>
  );
}

function Guides({ slugs }: { slugs: string[] }) {
  const list = slugs.map((s) => GUIDES.find((g) => g.slug === s)).filter(Boolean);
  if (!list.length) return null;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {list.map((g, i) => (
        <Link key={g!.slug} data-reveal style={st(i)} to="/guides/$slug" params={{ slug: g!.slug }} className="panel bracket group flex flex-col p-5 hover:border-ink">
          <p className="mono text-[10.5px] uppercase tracking-[0.1em] text-muted">Guide</p>
          <h3 className="mt-2 text-xl leading-tight">{g!.title}</h3>
          <p className="mt-2 flex-1 text-[13.5px] text-ink-2">{g!.excerpt}</p>
          <span className="mono mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em]">Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
        </Link>
      ))}
    </div>
  );
}

export function hubFaqLd(faq: [string, string][]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
}

/** /dashboards and /interior-parts */
export function HubPage({ hub }: { hub: Hub }) {
  const { data } = useSuspenseQuery(hubQuery({ types: hub.types, limit: 12 }));
  const makes = MAKES.filter((m) => (data.byMake[m.slug] ?? 0) > 0).sort((a, b) => b.premium - a.premium || (data.byMake[b.slug] ?? 0) - (data.byMake[a.slug] ?? 0));
  const total = Object.values(data.byType).reduce((a, b) => a + b, 0);
  const examples = UPGRADES.filter((u) => hub.upgradeCategories.includes(u.category)).slice(0, 6);
  return (
    <>
      <PageHeader crumbs={[{ name: hub.h1 }]} eyebrow={hub.eyebrow} title={hub.h1} intro={hub.intro}>
        <p className="mono mt-5 text-[12px] uppercase tracking-[0.1em] text-steel-muted">Recent requests: <TypeCycle className="text-steel-text" phrases={hub.searchPhrases} /></p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/request-a-part" className="btn btn-signal">Request a quote</Link>
          <a href="#by-brand" className="btn btn-ghost-dark">Choose your brand</a>
        </div>
      </PageHeader>

      <Section eyebrow={`${total.toLocaleString("en-US")} listings`} title="What we supply">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {hub.featuredTypes.map((s, i) => {
            const pt = partTypeBy.get(s);
            if (!pt) return null;
            return (
              <Link key={s} data-reveal style={st(i)} to="/parts" search={{ part: s }} className="panel bracket group flex flex-col hover:border-ink">
                <PartArt icon={pt.i} className="aspect-[16/11] w-full" />
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg leading-tight sm:text-xl">{pt.n}</h3>
                    <span className="mono text-[11px] text-muted">{(data.byType[s] ?? 0).toLocaleString("en-US")}</span>
                  </div>
                  <p className="mt-2 line-clamp-3 hidden text-[13px] text-ink-2 sm:block">{pt.d}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {hub.types.filter((s) => !hub.featuredTypes.includes(s)).map((s) => {
            const pt = partTypeBy.get(s);
            return pt ? (
              <li key={s}><Link to="/parts" search={{ part: s }} className="tag h-9 gap-2 px-3 text-[12px] hover:border-ink hover:bg-signal hover:text-signal-ink">{pt.n}<span className="opacity-60">{(data.byType[s] ?? 0).toLocaleString("en-US")}</span></Link></li>
            ) : null;
          })}
        </ul>
      </Section>

      <section id="by-brand" className="scroll-mt-40 bg-steel text-steel-text grid-steel">
        <div className="wrap py-12 sm:py-16">
          <p data-reveal="wipe" className="eyebrow text-signal">By brand</p>
          <h2 data-reveal className="mt-2 text-3xl sm:text-4xl">{hub.key === "dashboards" ? "Dashboards by vehicle brand" : "Interior parts by vehicle brand"}</h2>
          <div className="mt-8 grid grid-cols-2 gap-px border border-steel-line bg-steel-line sm:grid-cols-3 lg:grid-cols-5">
            {makes.map((m, i) => (
              <Link key={m.slug} data-reveal style={st(i % 5)} to={hub.key === "dashboards" ? "/dashboards/$make" : "/interior-parts/$make"} params={{ make: m.slug }} className="group flex items-baseline justify-between gap-2 bg-steel px-4 py-4 hover:bg-steel-2">
                <span className="font-display text-xl font-semibold uppercase group-hover:text-signal">{m.name}</span>
                <span className="mono text-[11px] text-steel-muted">{(data.byMake[m.slug] ?? 0).toLocaleString("en-US")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Most requested" title="Popular listings" action={<Link to="/parts" search={{ part: hub.featuredTypes[0] }} className="btn btn-line">View all</Link>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{data.items.slice(0, 8).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </Section>

      <section className="border-y border-line bg-panel">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_22rem] lg:py-16">
          <article className="prose-ags max-w-3xl [&>section:first-child>h2]:mt-0">
            {hub.sections.map((s) => (
              <section key={s.h} data-reveal>
                <h2>{s.h}</h2>
                {s.p.map((t) => <p key={t.slice(0, 32)}>{t}</p>)}
                {s.list ? <ul>{s.list.map((t) => <li key={t}>{t}</li>)}</ul> : null}
              </section>
            ))}
            {hub.key === "interior-parts" ? <p><Link to="/dashboards">See all dashboards and dashboard upgrade kits</Link>, or browse the <Link to="/category/$slug" params={{ slug: "interior" }}>full interior catalogue</Link>.</p> : <p>Looking for seats or trim? See <Link to="/interior-parts">all interior parts</Link>.</p>}
          </article>
          {examples.length ? (
            <aside className="space-y-3">
              <p className="eyebrow text-muted">Recent configurations</p>
              {examples.map((u, i) => (
                <Link key={u.id} data-reveal style={st(i)} to="/request-a-part" search={{ part: `${u.title} (${u.make} ${u.model}${u.year ? ` ${u.year}` : ""})` }} className="group block border border-line bg-paper p-4 hover:border-ink">
                  <p className="mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{u.make} {u.model}{u.year ? ` · ${u.year}` : ""}</p>
                  <p className="mt-1 font-semibold group-hover:underline">{u.title}</p>
                  <p className="mt-1 text-[12.5px] text-ink-2">{u.confirmation}</p>
                </Link>
              ))}
              <Link to="/parts-upgrades" className="btn btn-dark btn-sm">All upgrades</Link>
            </aside>
          ) : null}
        </div>
      </section>

      <Section eyebrow="Questions" title="Frequently asked questions">
        <div className="max-w-3xl"><Faq items={hub.faq} /></div>
      </Section>
      <Section eyebrow="Guides" title="Before you order" className="!pt-0"><Guides slugs={hub.guides} /></Section>
      <CtaBand title="Tell us which car it's for" text="Send your VIN, the steering side and photographs of your current interior. We reply with the matching part or kit and a written quotation." />
    </>
  );
}

/** /dashboards/$make and /interior-parts/$make */
export function HubMakePage({ hub, make }: { hub: Hub; make: Make }) {
  const { data } = useSuspenseQuery(hubQuery({ types: hub.types, make: make.slug, limit: 600 }));
  const models = modelsOf(make.slug);
  const bySlot = new Map(data.items.map((p) => [`${p.veh}|${p.ptype}`, p]));
  const featured = data.items.filter((p) => hub.featuredTypes.includes(p.ptype)).slice(0, 8);
  const base = hub.key === "dashboards" ? "/dashboards" : "/interior-parts";
  const others = MAKES.filter((m) => m.slug !== make.slug && (data.byMake[m.slug] ?? 0) > 0).slice(0, 14);
  return (
    <>
      <PageHeader crumbs={[{ name: hub.h1, to: base }, { name: make.name }]} eyebrow={`${Object.values(data.byType).reduce((a, b) => a + b, 0).toLocaleString("en-US")} listings`} title={hub.makeTitle(make.name)} intro={hub.makeIntro(make.name, models.map((m) => m.name).slice(0, 6).join(", "))}>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/request-a-part" search={{ part: `${make.name} ${hub.key === "dashboards" ? "dashboard" : "interior part"}` }} className="btn btn-signal">Request a {make.name} quote</Link>
          <Link to="/brands/$slug" params={{ slug: make.slug }} className="btn btn-ghost-dark">All {make.name} parts</Link>
        </div>
      </PageHeader>

      <Section eyebrow="By model" title={`${make.name} models and generations`} intro="Each cell opens the listing for that generation. Your VIN confirms the exact version before we quote.">
        <div className="overflow-x-auto border border-line bg-panel">
          <table className="w-full min-w-[720px] border-collapse text-[14px]">
            <thead>
              <tr className="mono bg-steel text-left text-[10.5px] uppercase tracking-[0.1em] text-steel-muted">
                <th className="px-4 py-3 font-medium">Model</th>
                {hub.tableTypes.map((c) => <th key={c.s} className="px-3 py-3 font-medium">{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {models.flatMap((m) => m.gens).sort((a, b) => b.popular - a.popular).map((v) => (
                <tr key={v.id} className="border-t border-line hover:bg-paper">
                  <td className="px-4 py-3">
                    <span className="font-semibold">{v.model} {v.gen}</span>{v.popular ? <span className="tag ml-2 h-5 border-signal-deep bg-signal px-1.5 text-[9.5px] text-signal-ink">Most requested</span> : null}
                    <span className="mono block text-[11px] text-muted">{years(v)}</span>
                  </td>
                  {hub.tableTypes.map((c) => {
                    const p = bySlot.get(`${v.id}|${c.s}`);
                    return (
                      <td key={c.s} className="px-3 py-3">
                        {p ? <Link to="/part/$slug" params={{ slug: p.slug }} className="mono inline-flex h-7 items-center border border-line-strong px-2 text-[11px] uppercase hover:border-ink hover:bg-signal hover:text-signal-ink">View</Link> : <Link to="/request-a-part" search={{ part: `${v.name} ${c.label}` }} className="mono text-[11px] uppercase text-muted underline-offset-4 hover:underline">Ask</Link>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {featured.length ? (
        <Section eyebrow="Most requested" title={`Popular ${make.name} listings`} className="!pt-0">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </Section>
      ) : null}

      <Section eyebrow="Full list" title={`Every ${make.name} ${hub.key === "dashboards" ? "dashboard" : "interior"} listing`} className="!pt-0">
        <div className="border border-line">{data.items.slice(0, 60).map((p) => <ProductRowItem key={p.slug} p={p} />)}</div>
        {data.items.length > 60 ? <Link to="/parts" search={{ make: make.slug, category: "interior" }} className="btn btn-line mt-4">Show more in the catalogue</Link> : null}
      </Section>

      <section className="border-y border-line bg-panel">
        <div className="wrap grid gap-10 py-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">Questions about {make.name} {hub.key === "dashboards" ? "dashboards" : "interior parts"}</h2>
            <div className="mt-5"><Faq items={hub.faq.slice(1, 5)} /></div>
          </div>
          <div>
            <h2 className="text-3xl">Other brands</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {others.map((m) => <Link key={m.slug} to={hub.key === "dashboards" ? "/dashboards/$make" : "/interior-parts/$make"} params={{ make: m.slug }} className="tag h-9 px-3 text-[12px] hover:border-ink hover:bg-signal hover:text-signal-ink">{m.name}</Link>)}
            </div>
            <Link to={base} className="btn btn-dark mt-6">{hub.h1}</Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

export const makeForHub = (slug: string) => makeBy.get(slug);
