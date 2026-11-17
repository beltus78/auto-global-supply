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
