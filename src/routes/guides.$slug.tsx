import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Markdown } from "@/components/site/Markdown";
import { CtaBand } from "@/components/site/CtaBand";
import { GUIDES, guideBy } from "@/content/guides";
import { BUSINESS } from "@/lib/business";
import { breadcrumbLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/guides/$slug")({
  staticData: { sitemap: true },
  loader: ({ params }) => {
    const guide = guideBy.get(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Guide not found" }, { name: "robots", content: "noindex" }] };
    const g = loaderData.guide;
    return pageHead({
      title: g.title,
      description: g.description,
      path: `/guides/${params.slug}`,
      ld: [
        breadcrumbLd([{ name: "Parts guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]),
        { "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description, datePublished: g.published, author: { "@type": "Organization", name: BUSINESS.brand }, publisher: { "@type": "Organization", name: BUSINESS.brand }, mainEntityOfPage: `${BUSINESS.website}/guides/${g.slug}` },
      ],
    });
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 4);
  return (
    <>
      <PageHeader crumbs={[{ name: "Parts guides", to: "/guides" }, { name: guide.title }]} eyebrow={guide.tags.join(" · ")} title={guide.title} intro={guide.excerpt} />
      <div className="wrap grid gap-10 py-10 lg:grid-cols-[1fr_20rem] lg:py-14">
        <article className="max-w-3xl [&>div>h2:first-child]:mt-0 [&>div>p:first-child]:mt-0">
          <Markdown source={guide.body} />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/request-a-part" className="btn btn-signal">Request a part</Link>
            <Link to="/parts" className="btn btn-line">Browse the catalogue</Link>
          </div>
        </article>
        <aside>
          <p className="eyebrow text-muted">More guides</p>
          <ul className="mt-3 border border-line bg-panel">
            {others.map((g) => <li key={g.slug} className="border-b border-line last:border-b-0"><Link to="/guides/$slug" params={{ slug: g.slug }} className="block px-4 py-3 text-[14px] font-medium hover:bg-paper">{g.title}</Link></li>)}
          </ul>
        </aside>
      </div>
      <CtaBand />
    </>
  );
}
