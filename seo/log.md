# SEO log — autoglobalsupply.com

## 2026-11-14 — launch of the Cloudflare rebuild
- Site rebuilt off Lovable on Cloudflare Workers + D1. 15,535 catalogue listings across 26 brands, 200 vehicle generations, 113 engine families, 31 gearboxes.
- Priority themes set by the owner: dashboards and interior parts. Added hubs /dashboards and /interior-parts with FAQPage schema, 26 brand pages for each, and three new guides (W447 dashboard upgrade guide, replacement dashboard options, interior parts checklist).
- All old URLs kept (/parts, /brands, /request-a-part, /how-it-works, /quality-fitment, /wholesale, /about, /contact, /faq, /shipping, /warranty, /returns, /guides, /privacy, /terms, /part/<old slugs>). /auth, /account, /garage, /wishlist and /factory 301 to their replacements.
- Search Console: confirm the property for autoglobalsupply.com exists and resubmit /sitemap.xml after the switch.

## 2026-11-17 — Catch-up run (missed article runs and health checks)
Brought the site level with the other sites, which had four article runs (Nov 9 ×2, Nov 13, Nov 17) and daily health checks before this repo existed.

**Search Console (last 28 days):** 4 query rows, 0 clicks, all on the old Lovable home page ("global auto parts supplier" pos ~90, "supply global body aftermarket replacement car parts" pos ~32). Expected: the domain still points at the Lovable site until it is moved to the Worker.

**Competitor/keyword findings:** results for dashboard and interior queries are dominated by owner forums (MBWorld threads on W222 dashboards lifting in heat) and retrofit specialists (genuine Mercedes retrofit kit sellers, German VIP van converters for the V-Class). Few plain-English buying guides from parts suppliers: room for clear guides that end in a quotation.

**Four new guides (3 dashboard/interior, 1 drivetrain):**
- Keyword: W222 dashboard peeling / S-Class dashboard replacement → https://autoglobalsupply.com/guides/mercedes-s-class-w222-dashboard-peeling-replacement
- Keyword: V-Class VIP interior conversion → https://autoglobalsupply.com/guides/mercedes-v-class-vip-interior-conversion-guide
- Keyword: replacement car seats (airbags, wiring, fitment) → https://autoglobalsupply.com/guides/replacement-car-seats-wiring-airbags-fitment
- Keyword: ZF 8HP gearbox replacement → https://autoglobalsupply.com/guides/zf-8hp-gearbox-identify-right-replacement
Linked from the /dashboards and /interior-parts hubs.

**Health check (local build, all 255 non-product sitemap URLs + 150 random product pages + nav pages):** all 200, one H1 each, canonicals and OG tags present, JSON-LD valid, 2,932 internal links checked, none broken.
**Found & fixed:**
- /social-preview.png (the og:image on every page) did not exist → added a 1200×630 preview image, plus og:image width/height.
- Missing apple-touch-icon, 32px PNG favicon, 192/512 icons and site.webmanifest (the other sites have them) → added and linked.
- 68 meta descriptions outside 120–160 chars (brand, category, hub, legal and product pages) → `fitDescription()` in src/lib/seo.ts now trims long ones at a sentence and completes short ones; product descriptions rewritten; legal/search descriptions rewritten by hand; 8 older guide descriptions lengthened.
- "Used, tested" condition label read badly in sentences → "Used and tested".

## 2026-11-17 (evening) — D1 daily read limit hit; catalogue reads moved to an in-memory index
- Symptom: every page reading the catalogue (home, /parts, hubs, brand, category and part pages) returned the error page. Cause: the account exceeded D1's free daily read limit (5M rows). Catalogue pages counted and grouped all 15,535 rows on every view (30k–45k rows per filtered page), and Googlebot started crawling the many filter links after the sitemap was submitted.
- Fix: scripts/build-catalogue.mjs now also writes src/data/catalogue-index.json (slug + category/type/make/vehicle/engine/gearbox per listing, 84 KB gzipped). src/lib/catalog-index.server.ts does filtering, counts, facets, related parts, hub tables and the sitemap in memory; D1 is read only for the rows a page displays (by slug). Text search (?q=) is the only remaining full scan (one pass returning slugs).
- If D1 is unavailable, listing pages still render (counts, links, tables) without the product cards instead of failing.
- robots.txt: disallow /search, ?q= URLs and /api/.
- Follow-up: the index now also carries name, SKU, side, part number and note, so listing cards, product pages, related parts, hubs and the sitemap need no D1 reads at all. Text search reads D1 once (slugs) and falls back to matching names/SKUs/vehicles from the index if D1 is unavailable. Tested with the local products table emptied and dropped: every page and search still renders. D1 is now only needed for forms, trade accounts, the search log and (later) product photos.

## 2026-11-23 — US focus
- Owner: focus SEO on US buyers for now. Switched site copy to American English (catalog, color, center, windshield, hood, gas, repair shop), html lang en-US, og:locale en_US, Organization areaServed United States first.
- New landing page /wholesale-auto-parts-usa (US buyers, USD quotes, shipping and customs to the US), linked from footer and home. Home title now "Wholesale Car Parts for US Buyers".
- Listing names and slugs left unchanged (British spellings in part type names stay, to keep URLs).

## 2026-11-23 — US-only presentation
- Owner: site must show strictly the US company. Removed every mention of China/Guangzhou, the China warehouse address and the Hong Kong (+852) number; contact is US only (+1 719-512-5025 phone/WhatsApp, Opa-locka FL office).
- Shipping page rewritten for every US state (courier, freight, pallet); "worldwide", air/sea freight and export wording removed; forms ask for US state instead of country.
- Guide how-to-import-auto-parts-from-china removed; its URL 301-redirects to /shipping.
- Quotations state where each order ships from and any duties, so the site makes no claim about shipping origin.

## 2026-11-23 — Free US shipping
- Owner: shipping is free within the US and takes 1 to 3 business days, bulk orders included. Updated shipping page, US page, FAQ, hubs, guides, product pages, trade page, home and meta descriptions; removed customs/duties wording.
