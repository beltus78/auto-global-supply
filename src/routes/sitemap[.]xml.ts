import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";
import { CATALOGUE_DATE, CATEGORIES, MAKES } from "@/lib/taxonomy";
import { GUIDES } from "@/content/guides";
import { BUSINESS } from "@/lib/business";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));
        for (const c of CATEGORIES) entries.push({ path: `/category/${c.slug}`, lastmod: CATALOGUE_DATE });
        for (const m of MAKES) entries.push({ path: `/brands/${m.slug}`, lastmod: CATALOGUE_DATE });
        for (const m of MAKES) entries.push({ path: `/dashboards/${m.slug}`, lastmod: CATALOGUE_DATE }, { path: `/interior-parts/${m.slug}`, lastmod: CATALOGUE_DATE });
        for (const g of GUIDES) entries.push({ path: `/guides/${g.slug}`, lastmod: g.published });
        const { ITEMS } = await import("@/lib/catalog-index.server");
        for (const i of ITEMS.slice(0, 45000)) entries.push({ path: `/part/${i.slug}`, lastmod: CATALOGUE_DATE });
        return new Response(sitemapXML(BUSINESS.website, entries), { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
