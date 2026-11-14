# Auto Global Supply (autoglobalsupply.com)

Automotive parts import/export site for AUTO SPARE PARTS IMPORT EXPORT LLC (Florida doc L24000026269, Opa-locka FL; warehouse in Guangzhou, China).
TanStack Start on Cloudflare Workers + D1 (`DB`) + R2 (`MEDIA`). Deploys from branch `cloudflare`.

## Business rules (never change without the owner)
- Quote only. No prices anywhere on the site or in content. Every order starts with a written quotation.
- Contact details, company details and addresses live in src/lib/business.ts. Do not edit them.
- Do not promise plug-and-play fitment for upgrade/conversion kits, fixed delivery times, guarantees, or manufacturer affiliation.
- No invented statistics, reviews, testimonials or customer names.

## Priority search themes
1. Dashboards (car dashboards, dashboard upgrade kits, W447 V-Class/Vito dashboards, clusters, screens) — hub /dashboards, brand pages /dashboards/<make>.
2. Interior parts (seats, steering wheels, consoles, door panels, trim, VIP van interiors) — hub /interior-parts, brand pages /interior-parts/<make>.
Hub copy, FAQs and linked guides: src/content/hubs.ts. Most requested configurations: src/content/upgrades.ts.

## Where things live
- Guides: src/content/guides.ts (append an object; `published: "YYYY-MM-DD"`; body markdown with ##, -, 1., **bold**, [text](/link)).
- Static page copy: src/content/pages.ts. FAQ page: FAQ in the same file.
- Catalogue: generated. Edit scripts/data-vehicles.mjs (makes, engines, vehicles, gearboxes) and scripts/data-parts.mjs (part types), then `npm run catalogue`. This rewrites src/data/taxonomy.json and seed/catalogue.sql. The live D1 database must then be reseeded: `npm run db:seed:remote` (needs Cloudflare login, owner runs it). Do not change existing slugs: product URLs come from names.
- Real internal URLs: /parts (filters: ?make=&model=&gen=&engine=&category=&part=), /category/<slug>, /brands/<make>, /part/<slug>, /dashboards, /dashboards/<make>, /interior-parts, /interior-parts/<make>, /parts-upgrades, /guides/<slug>, /request-a-part, /quote, /trade, /wholesale, /faq, /shipping, /contact, /about.
- Part type slugs for ?part=: see `s` values in scripts/data-parts.mjs (e.g. dashboard, dashboard-upgrade-kit, instrument-cluster, infotainment-screen, steering-wheel, front-seat-set, complete-seat-set, vip-interior-conversion).
- SEO helpers: src/lib/seo.ts (pageHead adds title, description, canonical, OG, JSON-LD). Sitemap: src/routes/sitemap[.]xml.ts.

## Checks before pushing
`npm install --legacy-peer-deps && npx vite build`. Local data: `npx wrangler d1 migrations apply DB --local && npm run db:seed:local`, then `npx vite preview --port 4173`.
