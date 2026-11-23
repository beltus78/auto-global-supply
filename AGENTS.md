# Auto Global Supply (autoglobalsupply.com)

Automotive parts import/export site for AUTO SPARE PARTS IMPORT EXPORT LLC (Florida doc L24000026269, Opa-locka FL; warehouse in Guangzhou, China).
TanStack Start on Cloudflare Workers + D1 (`DB`) + R2 (`MEDIA`). Deploys from branch `cloudflare`.

## Business rules (never change without the owner)
- Quote only. No prices anywhere on the site or in content. Every order starts with a written quotation.
- Contact details, company details and addresses live in src/lib/business.ts. Do not edit them.
- Do not promise plug-and-play fitment for upgrade/conversion kits, fixed delivery times, guarantees, or manufacturer affiliation.
- No invented statistics, reviews, testimonials or customer names.
- Positioning (owner, Nov 2026): Auto Global Supply holds its own stock in its Guangzhou, China warehouse and sells to bulk and trade buyers (workshops, dealers, parts retailers, fleets, importers). Never describe it as sourcing parts, searching a supplier network or working with suppliers/partners: that attracts supplier and partnership pitches. Do not claim every listing is in stock; availability and quantities are confirmed in each quotation.

## Priority search themes
Target market (owner, Nov 23 2026): focus SEO on US buyers for now. Write in American English (catalog, color, center, hood, windshield, gas, repair shop, transmission alongside gearbox), price-free but say quotes are in USD, mention US-relevant models (BMW X5/X7, Mercedes GLE/GLS/S-Class/Sprinter, Range Rover, Cayenne, F-150, Tahoe/Suburban, Escalade, Wrangler) and US buyer types (repair shops, dealers, parts stores, fleets, body shops). Use US search phrasing ("wholesale auto parts", "bulk car parts", "auto parts distributor", "car dashboard replacement"). US landing page: /wholesale-auto-parts-usa — link to it from new articles. Never state specific tariff rates or transit times; customs duties/tariffs on China-origin parts are confirmed by the buyer's customs broker. Do not rename listings or slugs to change spelling.
1. Dashboards (car dashboards, dashboard upgrade kits, W447 V-Class/Vito dashboards, clusters, screens) — hub /dashboards, brand pages /dashboards/<make>.
2. Interior parts (seats, steering wheels, consoles, door panels, trim, VIP van interiors) — hub /interior-parts, brand pages /interior-parts/<make>.
Hub copy, FAQs and linked guides: src/content/hubs.ts. Most requested configurations: src/content/upgrades.ts.

## Where things live
- Guides: src/content/guides.ts (append an object; `published: "YYYY-MM-DD"`; body markdown with ##, -, 1., **bold**, [text](/link)).
- Static page copy: src/content/pages.ts. FAQ page: FAQ in the same file.
- Catalogue: generated. Edit scripts/data-vehicles.mjs (makes, engines, vehicles, gearboxes), scripts/data-parts.mjs (part types) and scripts/data-extra.mjs (individual listings), then `npm run catalogue`. This rewrites src/data/taxonomy.json, src/data/catalogue-index.json and seed/catalogue.sql. Commit all three. On deploy, `npm run deploy:ci` syncs the live D1 table automatically (inserts new listings, removes dropped ones, updates changed names/search text), so no manual reseed is needed. Never rename existing listings: product URLs come from names. Never run a full reseed (FORCE_RESEED) without the owner: it writes ~100k rows.
- Search terms that fail because of wording (e.g. "hood" vs "bonnet") are fixed by adding words to SYN in scripts/build-catalogue.mjs.

## D1 usage (important)
- Catalogue filtering, counts, facets, related parts, hub tables and the sitemap run in memory from src/data/catalogue-index.json (src/lib/catalog-index.server.ts). Listing cards, product pages, related parts and hubs are built from the index too. D1 is read only for text search (one pass returning slugs, with an in-memory fallback), forms, trade accounts and the search log. Never add queries that scan or COUNT/GROUP BY the whole products table on page views: the account is limited to 5M D1 row reads per day on the free plan.

## Client search log
- Visitors' catalogue searches are stored in D1 table `search_log` (q, make, model, gen, engine, category, part, results, path, country, created_at), sent by the browser after results render (POST /api/search-log). Rows with results = 0 are the main signal. Also read `part_requests` (part_name, make, model, year, engine, oem) for what customers asked for by form.
- Weekly review: add genuine automotive parts that customers searched for and did not find. Real vehicles, engines and parts only; verify model years/engine codes with a reliable source; part numbers only when confirmed. Ignore spam, tests, gibberish and non-automotive searches.
- Real internal URLs: /parts (filters: ?make=&model=&gen=&engine=&category=&part=), /category/<slug>, /brands/<make>, /part/<slug>, /dashboards, /dashboards/<make>, /interior-parts, /interior-parts/<make>, /parts-upgrades, /guides/<slug>, /request-a-part, /quote, /trade, /wholesale, /faq, /shipping, /contact, /about.
- Part type slugs for ?part=: see `s` values in scripts/data-parts.mjs (e.g. dashboard, dashboard-upgrade-kit, instrument-cluster, infotainment-screen, steering-wheel, front-seat-set, complete-seat-set, vip-interior-conversion).
- SEO helpers: src/lib/seo.ts (pageHead adds title, description, canonical, OG, JSON-LD). Sitemap: src/routes/sitemap[.]xml.ts.

## Checks before pushing
`npm install --legacy-peer-deps && npx vite build`. Local data: `npx wrangler d1 migrations apply DB --local && npm run db:seed:local`; test the remote sync logic locally with `D1_LOCAL=1 node scripts/deploy-ci.mjs`, then `npx vite preview --port 4173`.
