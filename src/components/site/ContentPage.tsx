import { Link } from "@tanstack/react-router";
import { PageHeader } from "./PageHeader";
import { CtaBand } from "./CtaBand";
import type { PageContent } from "@/content/pages";

export function ContentPage({ page }: { page: PageContent }) {
  return (
    <>
      <PageHeader crumbs={[{ name: page.h1 }]} eyebrow={page.eyebrow} title={page.h1} intro={page.intro} />
      {page.cards ? (
        <div className="wrap pt-10">
          <ul className={`grid gap-px border border-line bg-line sm:grid-cols-2 ${page.cards.length === 5 ? "lg:grid-cols-5" : page.cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
            {page.cards.map((c, i) => (
              <li key={c.title} className="bg-panel p-5">
                {page.cardsNumbered ? <span className="font-display text-5xl font-bold text-signal-deep">{String(i + 1).padStart(2, "0")}</span> : <span className="block h-1.5 w-8 bg-signal-deep" />}
                <h2 className="mt-3 text-xl">{c.title}</h2>
                <p className="mt-1.5 text-[13.5px] text-ink-2">{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <article className="wrap py-10 lg:py-14">
        <div className="prose-ags max-w-3xl">
          {page.blocks.map((b, i) => (
            <section key={i} className={i === 0 ? "[&>h2]:mt-0" : ""}>
              {b.h ? <h2>{b.h}</h2> : null}
              {b.p?.map((t) => <p key={t.slice(0, 40)}>{t}</p>)}
              {b.list ? (b.ordered ? <ol>{b.list.map((t) => <li key={t}>{t}</li>)}</ol> : <ul>{b.list.map((t) => <li key={t}>{t}</li>)}</ul>) : null}
            </section>
          ))}
          {page.cta ? <Link to={page.cta.to} className="btn btn-dark mt-8 !no-underline">{page.cta.label}</Link> : null}
        </div>
      </article>
      <CtaBand />
    </>
  );
}
