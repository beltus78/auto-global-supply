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

## 2026-11-24 — US makes added
- Added GMC, Ram, Dodge, Chrysler, Lincoln, Buick; expanded Ford, Chevrolet, Cadillac, Jeep, Tesla. +82 generations, +41 engine codes (EcoBoost, Power Stroke, Godzilla, EcoTec3 L84/L87, Duramax L5P/LML/LM2/LWN, LT1/LT2/LT4, HEMI SC, Hurricane, Cummins…), +7 transmissions (6L80, 10L1000, 6R80, 10R140, TorqueFlite 8HP, AS69RC). Catalog 15,536 → 19,841 listings; sitemap ~19,985 URLs.
- IndexNow key added: 1ec7e6653cc9247630d3d9346cca3e73
- 2026-11-24 IndexNow: full sitemap submitted (19,985 URLs)

## 2026-11-25 — Daily check
- Build OK (no test files). Local crawl: all 144 non-product sitemap URLs + 2×150 random product pages (two samples), ~5,250 internal links. All 200, one H1, unique titles, canonicals/OG/JSON-LD valid, lang en-US, og:locale en_US, areaServed United States, no prices, no China/HK/import/customs/worldwide wording, delivery always "1 to 3 business days". Live home and /sitemap.xml: 200.
- Found & fixed (American English in visible copy): nav "Catalogue" → "Catalog"; "Enquire/enquiry/enquiries" → "Inquire/inquiry/inquiries" (header, footer, WhatsApp button, home, parts-upgrades, how-it-works, terms, privacy, FAQ, contact title); "Catalogue information" → "Catalog information"; "working days" → "business days"; finalised/fulfil/labour/colours/authorised → US spellings; /parts title "Automotive Parts Catalog".
- Part-type and engine descriptions (descriptions only; listing names and slugs untouched, catalogue-index.json and seed unchanged): centre → center, colour → color, bonnet → hood, windscreen → windshield, tyres → tires, aluminium → aluminum, silencers → mufflers, kerb → curb, boot lid → trunk lid; engine fuel label "Petrol" → "Gasoline"; Body & Exterior category text "hoods, fenders".
- /guides meta description no longer mentions "importing"; how-it-works "Destination country" → "Delivery state"; privacy "country" → "US state"; W447 guide "vary by country" → "vary by state".
- fitDescription() could return 161 characters when cutting at a word; now max 160 (3 pages).
- Left as intended: part type names inside listing names/slugs (Centre Console, Bonnet / Hood, Windscreen, Tailgate / Boot Lid), legal name "IMPORT EXPORT LLC", "we do not take on ... sourcing agents" deflection. 37 of 19,841 product titles are 66–72 chars (long listing names), minor.

## 2026-11-26 — Daily check
- Build OK (no test files). Local crawl: all 144 non-product sitemap URLs + 150 random product pages + nav pages (296 pages, ~5,500 internal links/images). All 200, one H1, unique titles ≤65 chars, descriptions 110–160, canonicals/OG/JSON-LD valid, lang en-US, og:locale en_US, no prices, no China/HK/worldwide/customs/freight wording, delivery always "1 to 3 business days". /quote noindex (intended). Live home and /sitemap.xml: 200.
- Found & fixed (American English in visible copy): part-type description "Windscreen wiper motor" → "Windshield wiper motor" (scripts/data-parts.mjs, all Wiper Motor & Linkage pages); BMW brand intro "saloons" → "sedans" (scripts/data-vehicles.mjs); two guides "saloons"/"saloon seats" → "sedans"/"sedan seats". `npm run catalogue` rerun: only taxonomy.json changed (catalogue-index.json and seed unchanged).
- Left as intended: part type names inside listing names/slugs and filter labels (Centre Console, Bonnet / Hood, Windscreen, Tailgate / Boot Lid), legal name "IMPORT EXPORT LLC", "we do not take on ... sourcing agents" deflection.

## 2026-11-27 — Daily check
- Build OK (no test files). Local crawl: all 144 non-product sitemap URLs + 150 random product pages (294 pages, 5,237 internal links/images). All 200, one H1, unique titles ≤65 chars, descriptions 110–160, canonicals on autoglobalsupply.com, OG tags and JSON-LD valid, lang en-US, og:locale en_US, no hreflang, all images have alt. Filtered views (/parts?…, /search) and /quote noindex (intended). robots.txt and sitemap (19,985 URLs) valid. No prices, no China/HK/worldwide/customs/air or sea freight wording, delivery always "1 to 3 business days"; every page that says "gearbox" also says "transmission". Live home and /sitemap.xml: 200.
- Found & fixed: OEM part number guide "catalogued" → "cataloged" (src/content/guides.ts).
- Left as intended: part type names inside listing names/slugs and filter labels (Centre Console, Bonnet / Hood, Windscreen, Tailgate / Boot Lid), legal name "IMPORT EXPORT LLC", "we do not take on ... sourcing agents" deflection.
- Note: the local workerd runtime crashed twice during the first crawl (shared sandbox; other sites' workerd processes trapped at the same moments). Retried URLs all returned 200; not a site issue.

## 2026-11-27 — Article: Ford F-150 dashboard replacement
- Keyword: Ford F-150 dashboard replacement (US dashboard keyword; the two previous article runs were replacement car seats [interior] and ZF 8HP [drivetrain], so this run had to be dashboard/interior) → https://autoglobalsupply.com/guides/ford-f-150-dashboard-replacement-guide
- Covers 2009–2014 (P415), 2015–2020 (P552) and 2021-on (P702) trucks: what changes the part (screen size, cluster type, head-up display, column vs console shifter, color), used vs new vs upgrade kit, airbags, fitting, multi-truck fleet orders. Links /dashboards, /dashboards/ford, /wholesale-auto-parts-usa, /part/ford-f-150-p702-dashboard-assembly, the upgrade-kit guide and /request-a-part. Added to the /dashboards hub guides list (now 5).
- Search Console (28 days, 150 query rows, 0 clicks): impressions mostly on the OEM part number guide ("how to find part number" 20 impr pos 74, "how to find oem part number" US pos 19.9, "oem part number" US pos 7.3, "what is an oem number" US pos 11.7) and the W214 exhaust page (16 impr pos 15.5, outside the US). US dashboard/interior queries: none on page one; best "parts of the interior of a car" pos 23, "automotive interior components" pos 40, "interior parts of a car" pos 54 (all the interior checklist guide). Non-US interior hits: "nissan interior parts" pos 12 (Sri Lanka), "audi a6 c8 rear seats" pos 4 (Denmark), "w906 interior" pos 2 (Bulgaria).
- Competitor findings: "F-150 dashboard replacement" results are retail dash bezels/trim panels, forum threads (mostly 1970s–2000s trucks) and single eBay listings. Nobody explains modern F-150 dashboards by generation and trim for repair shops and fleets. Retailers sell 8-to-12-inch screen upgrade kits for the 2021-on truck, and lower dash trim differs for the 12-inch screen and floor vs column shift.
- Ideas for next time: Chevrolet Tahoe/Suburban/GMC Yukon T1XX dashboard or seats (all listed), Cadillac Escalade steering wheel replacement, Ram 1500 dashboard; strengthen the OEM part number guide (several US queries at 7–20) as a quick-win run.
