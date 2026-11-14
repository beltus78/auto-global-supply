import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { FAQ } from "@/content/pages";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  staticData: { sitemap: true },
  head: () =>
    pageHead({
      title: "Automotive Parts Supply FAQ | Auto Global Supply",
      description: "Answers about quotations, fitment checks, part condition, upgrade kits, shipping, customs, returns and warranty.",
      path: "/faq",
      ld: [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.flatMap((g) => g.items).map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }],
    }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "FAQ" }]} eyebrow="Questions" title="Frequently asked questions" intro="How quotations, fitment checks, shipping and after-sales work." />
      <div className="wrap grid gap-10 py-10 lg:grid-cols-[14rem_1fr] lg:py-14">
        <nav aria-label="FAQ sections" className="hidden lg:block">
          <ul className="sticky top-44 border-l-2 border-line-strong">
            {FAQ.map((g) => <li key={g.group}><a href={`#${g.group.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="block py-1.5 pl-4 text-[14px] font-medium hover:text-ink hover:underline">{g.group}</a></li>)}
          </ul>
        </nav>
        <div className="max-w-3xl">
          {FAQ.map((g) => (
            <section key={g.group} id={g.group.toLowerCase().replace(/[^a-z]+/g, "-")} className="mb-10 scroll-mt-44">
              <h2 className="text-2xl">{g.group}</h2>
              <div className="mt-4 border border-line bg-panel">
                {g.items.map(([q, a]) => (
                  <details key={q} className="group border-b border-line last:border-b-0">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 font-semibold [&::-webkit-details-marker]:hidden">
                      {q}
                      <span className="mono text-lg text-muted group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="px-4 pb-4 text-[14.5px] text-ink-2">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
          <p className="text-ink-2">Something else? <Link to="/contact" className="underline decoration-signal-deep decoration-2 underline-offset-4">Contact us</Link>.</p>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
