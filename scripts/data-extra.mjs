// Individual listings added on top of the generated catalogue, mainly from the weekly
// "client searches" review: parts customers searched for that the catalogue did not cover.
//
// Prefer fixing coverage at the source first:
//   - a missing make, model/generation or engine  -> scripts/data-vehicles.mjs
//   - a missing kind of part that applies widely  -> new part type in scripts/data-parts.mjs
//   - a search that failed only because of wording -> add words to SYN in scripts/build-catalogue.mjs
// Use this list for one specific item that doesn't fit those patterns.
//
// Fields:
//   key     unique, stable id (never change it: the SKU is derived from it)
//   name    listing title, as a buyer would search it (the URL slug comes from it, so keep it stable)
//   ptype   an existing part type slug from data-parts.mjs (gives category, description, conditions, icon).
//           A part type with tier 9 is never generated automatically and exists only for these extras.
//   make    make slug from data-vehicles.mjs
//   veh     optional vehicle id "make:model-slug:gen-slug" (see src/data/taxonomy.json vehicles[].id)
//   eng     optional engine code, gbx optional gearbox slug
//   oem     optional part number. ONLY when confirmed by the customer's request or a reliable source. Never guess.
//   note    optional one-paragraph description shown above the part type text
//   search  optional extra search words (alternative names, misspellings customers used)
//   added   date added, source: what prompted it (e.g. "search: 'vezel dct gearbox' x4")
export const EXTRA = [
  {
    key: "x|honda-vezel-hybrid-dct",
    name: "Honda Vezel Hybrid i-DCD Dual-Clutch Transmission",
    ptype: "gearbox",
    make: "honda",
    veh: "honda:vezel-hr-v:ru",
    gbx: "honda-i-dcd-7-speed",
    oem: "22000-5P8-0561",
    note: "Seven-speed dual-clutch transmission for the Honda Vezel Hybrid (i-DCD). Part number 22000-5P8-0561 was supplied by a customer for a 2016 Vezel Hybrid; identity and compatibility are confirmed against your VIN before quoting.",
    search: "vezel hybrid dct gearbox transmission hrv hr-v i-dcd 22000-5p8-0561",
    added: "2026-11-17",
    source: "previous customer enquiry (parts & upgrades page)",
  },
];
