import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { GUIDES } from "@/content/guides";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/guides/")({
  staticData: { sitemap: true },
  head: () => pageHead({ title: "Automotive Parts Guides | Auto Global Supply", description: "Practical guides to identifying engines, finding part numbers, checking fitment, planning upgrades and importing automotive parts.", path: "/guides" }),
  component: GuidesPage,
});

function GuidesPage() {
  const guides = [...GUIDES].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <>
      <PageHeader crumbs={[{ name: "Parts guides" }]} eyebrow="Knowledge" title="Parts guides" intro="Short, practical guides from our parts desk: how to identify what you need and what to check before you order." />
      <div className="wrap grid gap-3 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:py-14">
        {guides.map((g) => (
          <Link key={g.slug} to="/guides/$slug" params={{ slug: g.slug }} className="panel group flex flex-col p-5 transition-colors hover:border-ink">
            <p className="mono flex flex-wrap gap-2 text-[10.5px] uppercase tracking-[0.1em] text-muted">{g.tags.map((t) => <span key={t}>{t}</span>)}</p>
            <h2 className="mt-3 text-2xl leading-tight">{g.title}</h2>
            <p className="mt-2 flex-1 text-[14px] text-ink-2">{g.excerpt}</p>
            <span className="mono mt-4 text-[11px] uppercase tracking-[0.1em] underline decoration-signal-deep decoration-2 underline-offset-4">Read guide</span>
          </Link>
        ))}
      </div>
      <CtaBand />
    </>
  );
}
