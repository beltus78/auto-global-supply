import { Link } from "@tanstack/react-router";
import type { CSSProperties, ReactNode } from "react";

export type Crumb = { name: string; to?: string; search?: Record<string, string>; params?: Record<string, string> };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const base = tone === "dark" ? "text-steel-muted" : "text-muted";
  const hover = tone === "dark" ? "hover:text-signal" : "hover:text-ink";
  return (
    <nav aria-label="Breadcrumb" className={`mono flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.1em] ${base}`}>
      <Link to="/" className={hover}>Home</Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          {c.to ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Link to={c.to as any} params={c.params as any} search={c.search as any} className={hover}>{c.name}</Link>
          ) : (
            <span className={tone === "dark" ? "text-steel-text" : "text-ink"}>{c.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string; title: string; intro?: ReactNode; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden bg-steel text-steel-text grid-steel grid-drift">
      <div className="hazard-run absolute inset-x-0 bottom-0 h-1.5" />
      <div className="wrap py-10 sm:py-14">
        {crumbs ? <Breadcrumbs items={crumbs} /> : null}
        {eyebrow ? <p data-reveal="wipe" className="eyebrow mt-6 text-signal">{eyebrow}</p> : null}
        <h1 data-reveal style={{ "--i": 1 } as CSSProperties} className="mt-3 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {intro ? <p data-reveal style={{ "--i": 2 } as CSSProperties} className="mt-4 max-w-2xl text-base text-steel-muted sm:text-lg">{intro}</p> : null}
        {children}
      </div>
    </header>
  );
}

export function Section({ eyebrow, title, intro, children, className = "", action }: { eyebrow?: string; title?: string; intro?: ReactNode; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={`wrap py-12 sm:py-16 ${className}`}>
      {(title || eyebrow) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {eyebrow ? <p data-reveal="wipe" className="eyebrow text-muted">{eyebrow}</p> : null}
            {title ? <h2 data-reveal className="mt-2 text-3xl sm:text-4xl">{title}</h2> : null}
            {intro ? <p className="mt-3 text-ink-2">{intro}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
