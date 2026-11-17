// Generates src/data/taxonomy.json and seed/catalogue.sql from the data files in this folder.
// Run: npm run catalogue
import { writeFileSync, mkdirSync } from "node:fs";
import { MAKES, ENGINES, VEHICLES, GEARBOXES } from "./data-vehicles.mjs";
import { CATEGORIES, PART_TYPES, LEGACY } from "./data-parts.mjs";
import { EXTRA } from "./data-extra.mjs";

const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36).toUpperCase().padStart(7, "0").slice(-6);
};
const SKU_PREFIX = { engines: "ENG", "turbo-performance": "TRB", transmission: "TRN", suspension: "SUS", brakes: "BRK", "body-parts": "BDY", lighting: "LGT", cooling: "CLG", electrical: "ELE", interior: "INT", "fuel-exhaust": "FEX", wheels: "WHL" };
const ENGINE_BRAND = { audi: "Audi / VW", "land-rover": "Jaguar Land Rover", toyota: "Toyota / Lexus", hyundai: "Hyundai / Kia", jeep: "Jeep / Chrysler", chevrolet: "GM" };
const PORT_INJECTED = new Set(["N52", "M272", "M273", "M156", "2ZR-FE", "2TR-FE", "1GR-FE", "1UR-FE", "3UR-FE", "QR25DE", "3.6 Pentastar", "5.7 HEMI", "6.4 HEMI", "M48"]);
const SYN = {
  bonnet: "hood", "front-fender": "wing fender", tailgate: "trunk boot lid liftgate", "wing-mirror": "door mirror side mirror", "front-grille": "kidney grille radiator grille",
  "engine-ecu": "dme ecm pcm engine computer", gearbox: "transmission", "mechatronic-unit": "tcu tcm valve body mechatronics", "front-air-strut": "air shock airmatic air spring",
  "rear-air-spring": "air bag air bellow airmatic", "air-suspension-compressor": "air pump airmatic", "alloy-wheel-set": "rims wheels", headlight: "headlamp head lamp led xenon matrix laser",
  "tail-light": "taillight rear lamp tail lamp", "steering-rack": "steering gear power steering eps", dashboard: "dash board instrument panel", "complete-engine": "motor long block engine assembly",
  "abs-pump-module": "dsc esp abs pump", "instrument-cluster": "speedometer digital cockpit", "infotainment-head-unit": "navigation idrive mmi comand mbux pcm nbt", "transfer-case": "transfer box vtg atc",
  "radiator-fan": "cooling fan", "ac-compressor": "air con compressor aircon", "catalytic-converter": "cat", turbocharger: "turbo", "fuel-injector-set": "injectors nozzle",
  "body-kit": "m sport amg line s line bodykit", "front-brake-disc-set": "rotors brake rotor", "rear-brake-disc-set": "rotors brake rotor", "wheel-hub-bearing": "wheel bearing",
  "drive-unit": "motor electric motor", "front-cut": "nose cut half cut front clip front end assembly", "facelift-conversion-kit": "upgrade kit new look lci conversion body kit",
  "dashboard-upgrade-kit": "dash upgrade screen upgrade interior conversion", "vip-interior-conversion": "maybach style luxury van interior captain seats", "infotainment-upgrade": "android screen carplay head unit upgrade",
  "complete-seat-set": "seats full set", "interior-upgrade-package": "interior kit retrofit", "front-bumper": "bumper cover", "rear-bumper": "bumper cover", "side-step-set": "running boards",
};

const FOCUS = new Set(["dashboard", "dashboard-upgrade-kit", "vip-interior-conversion", "complete-seat-set", "steering-wheel"]);
const makeBy = Object.fromEntries(MAKES.map(([slug, name, premium, intro]) => [slug, { slug, name, premium, intro, count: 0 }]));
const tierRank = { lite: 1, std: 2, deep: 3 };

const engines = ENGINES.map(([make, code, disp, fuel, asp, layout, note]) => ({ code, slug: slugify(code), make, disp, fuel, asp, layout, note, vehicles: [], tier: 0, popular: 0 }));
const engineBy = Object.fromEntries(engines.map((e) => [e.code, e]));

function splitEngines(str) {
  // codes may contain spaces ("5.2 V10 FSI"): match greedily against known codes
  const out = [];
  let rest = str.trim();
  const codes = engines.map((e) => e.code).sort((a, b) => b.length - a.length);
  while (rest) {
    const hit = codes.find((c) => rest === c || rest.startsWith(c + " "));
    if (!hit) throw new Error(`Unknown engine in "${str}" at "${rest}"`);
    out.push(hit);
    rest = rest.slice(hit.length).trim();
  }
  return out;
}

const vehicles = VEHICLES.map(([make, model, gen, from, to, body, tier, flags, eng, popular]) => {
  const m = makeBy[make];
  if (!m) throw new Error(`Unknown make ${make}`);
  const genIsCode = !/\s/.test(gen);
  const base = model.startsWith(m.name) ? model : `${m.name} ${model}`;
  const name = genIsCode ? `${base} ${gen}` : base;
  const v = { id: `${make}:${slugify(model)}:${slugify(gen)}`, make, model, modelSlug: slugify(model), gen, genSlug: slugify(gen), from, to, body, tier, flags: flags.split(" ").filter(Boolean), engines: splitEngines(eng), popular: popular ? 1 : 0, name, count: 0 };
  for (const c of v.engines) {
    const e = engineBy[c];
    e.vehicles.push(v.id);
    e.tier = Math.max(e.tier, tierRank[tier]);
    e.popular += v.popular;
  }
  return v;
});
const ids = new Set();
for (const v of vehicles) {
  if (ids.has(v.id)) throw new Error(`Duplicate vehicle ${v.id}`);
  ids.add(v.id);
}
const vehicleBy = Object.fromEntries(vehicles.map((v) => [v.id, v]));
const gearboxes = GEARBOXES.map(([make, slug, name, kind, apps]) => ({ make, slug, name, kind, apps }));

const products = [];
const slugs = new Set();
const legacyUsed = new Set();
function push(key, p) {
  const legacy = LEGACY[key];
  if (legacy) {
    legacyUsed.add(key);
    p.slug = legacy[0];
    p.sku = legacy[1];
  } else {
    p.slug = slugify(p.name);
    p.sku = `${SKU_PREFIX[p.cat]}-${hash(key)}`;
  }
  if (slugs.has(p.slug)) throw new Error(`Duplicate slug ${p.slug}`);
  slugs.add(p.slug);
  products.push(p);
}

const TWO_DOOR = new Set(["coupe", "sports"]);
const TALL = new Set(["suv", "van", "pickup", "wagon"]);
function vehicleOk(pt, v) {
  if (pt.tier > tierRank[v.tier]) return false;
  const ev = v.flags.includes("ev");
  for (const r of pt.req.split(" ").filter(Boolean)) {
    if (r === "air" && !v.flags.includes("air")) return false;
    if (r === "awd" && !v.flags.includes("awd")) return false;
    if (r === "ev" && !ev) return false;
    if (r === "noev" && ev) return false;
    if (r === "no2door" && TWO_DOOR.has(v.body)) return false;
    if (r === "suvvan" && !TALL.has(v.body)) return false;
    if (r === "van" && v.body !== "van") return false;
  }
  return true;
}
function partNameFor(pt, v) {
  if (pt.s === "tailgate") return TALL.has(v.body) || v.body === "hatch" ? "Tailgate" : "Boot Lid";
  if (pt.s === "rear-door" && v.body === "van") return "Sliding Door";
  return pt.n;
}

for (const v of vehicles) {
  for (const pt of PART_TYPES.filter((p) => p.scope === "v")) {
    if (!vehicleOk(pt, v)) continue;
    const sides = pt.sides ? ["left", "right"] : [null];
    for (const side of sides) {
      const part = partNameFor(pt, v) + (side ? ` (${side === "left" ? "Left" : "Right"})` : "");
      push(`v|${v.make}|${v.model}|${v.gen}|${pt.s}${side ? "|" + side : ""}`, {
        name: `${v.name} ${part}`, cat: pt.c, ptype: pt.s, make: v.make, makes: [v.make], veh: v.id, eng: null, gbx: null, side,
        // dashboards and interior conversions are the owner's priority search themes
        pop: pt.pop * 2 + v.popular * 2 + (v.tier === "deep" ? 1 : 0) + (FOCUS.has(pt.s) ? 3 : pt.c === "interior" ? 1 : 0) + (v.gen === "W447" && pt.c === "interior" ? 4 : 0),
        search: `${v.model} ${v.gen} ${makeBy[v.make].name}`,
      });
    }
  }
}
for (const e of engines) {
  if (!e.vehicles.length) continue;
  const brand = ENGINE_BRAND[e.make] || makeBy[e.make].name;
  const label = /\d\.\d/.test(e.code) ? `${brand} ${e.code}` : `${brand} ${e.code} ${e.disp}`;
  const fitMakes = [...new Set(e.vehicles.map((id) => vehicleBy[id].make))];
  const fitText = [...new Set(e.vehicles.map((id) => `${vehicleBy[id].model} ${vehicleBy[id].gen}`))].join(" ");
  for (const pt of PART_TYPES.filter((p) => p.scope === "e")) {
    if (pt.tier > Math.max(e.tier, 1)) continue;
    const req = pt.req.split(" ").filter(Boolean);
    if (req.includes("turbo") && e.asp !== "T") continue;
    if (req.includes("sc") && e.asp !== "S") continue;
    if (req.includes("boosted") && e.asp === "N") continue;
    if (req.includes("diesel") && e.fuel !== "D") continue;
    if (req.includes("petrol") && e.fuel !== "P") continue;
    if (pt.s === "high-pressure-fuel-pump" && PORT_INJECTED.has(e.code)) continue;
    push(`e|${e.code}|${pt.s}`, {
      name: `${label} ${pt.n}`, cat: pt.c, ptype: pt.s, make: e.make, makes: [...new Set([e.make, ...fitMakes])], veh: null, eng: e.code, gbx: null, side: null,
      pop: pt.pop * 2 + Math.min(e.popular, 3) + (e.tier === 3 ? 1 : 0),
      search: `${fitText} ${fitMakes.map((m) => makeBy[m].name).join(" ")} ${e.layout} ${e.fuel === "D" ? "diesel" : "petrol gasoline"}`,
    });
  }
}
for (const g of gearboxes) {
  for (const pt of PART_TYPES.filter((p) => p.scope === "g")) {
    if (pt.tier > 3) continue;
    if (pt.req === "auto" && g.kind !== "auto") continue;
    if (pt.req === "dct" && g.kind !== "dct") continue;
    const part = pt.s === "gearbox" ? (g.kind === "dct" ? "Dual-Clutch Gearbox" : "Automatic Gearbox") : pt.n;
    push(`g|${g.slug}|${pt.s}`, {
      name: `${g.name} ${part}`, cat: pt.c, ptype: pt.s, make: g.make, makes: [g.make], veh: null, eng: null, gbx: g.slug, side: null,
      pop: pt.pop * 2 + 2, search: g.apps,
    });
  }
}
// Individual listings (weekly client-search review and one-off additions)
const ptByS = Object.fromEntries(PART_TYPES.map((p) => [p.s, p]));
const engineCodes = new Set(engines.map((e) => e.code));
for (const x of EXTRA) {
  const pt = ptByS[x.ptype];
  if (!pt) throw new Error(`EXTRA ${x.key}: unknown ptype ${x.ptype}`);
  if (!makeBy[x.make]) throw new Error(`EXTRA ${x.key}: unknown make ${x.make}`);
  if (x.veh && !vehicleBy[x.veh]) throw new Error(`EXTRA ${x.key}: unknown vehicle ${x.veh}`);
  if (x.eng && !engineCodes.has(x.eng)) throw new Error(`EXTRA ${x.key}: unknown engine ${x.eng}`);
  if (x.gbx && !gearboxes.some((g) => g.slug === x.gbx)) throw new Error(`EXTRA ${x.key}: unknown gearbox ${x.gbx}`);
  const v = x.veh ? vehicleBy[x.veh] : null;
  push(x.key, {
    name: x.name, cat: pt.c, ptype: pt.s, make: x.make, makes: [x.make], veh: x.veh ?? null, eng: x.eng ?? null, gbx: x.gbx ?? null, side: x.side ?? null,
    pop: pt.pop * 2 + 3, oem: x.oem ?? null, note: x.note ?? null,
    search: `${x.search ?? ""} ${v ? `${v.model} ${v.gen}` : ""} ${makeBy[x.make].name} ${x.oem ?? ""}`,
  });
}

const missing = Object.keys(LEGACY).filter((k) => !legacyUsed.has(k));
if (missing.length) throw new Error(`Legacy keys not matched: ${missing.join(", ")}`);

const catCount = {};
const ptBy = Object.fromEntries(PART_TYPES.map((p) => [p.s, p]));
for (const p of products) {
  catCount[p.cat] = (catCount[p.cat] || 0) + 1;
  for (const m of p.makes) makeBy[m].count++;
  if (p.veh) vehicleBy[p.veh].count++;
  p.search = `${p.name} ${p.sku} ${p.search} ${SYN[p.ptype] || ""} ${ptBy[p.ptype].n}`.toLowerCase().replace(/[^a-z0-9.\- ]+/g, " ").replace(/\s+/g, " ").trim();
}
// stable order: most requested first, then name
products.sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));

const taxonomy = {
  generated: new Date().toISOString().slice(0, 10),
  total: products.length,
  makes: Object.values(makeBy).map((m, i) => ({ ...m, sort: i })),
  categories: CATEGORIES.map(([slug, name, description, icon]) => ({ slug, name, description, icon, count: catCount[slug] || 0 })),
  partTypes: PART_TYPES.map(({ s, n, c, i, scope, pop, cond, d, sides }) => ({ s, n, c, i, scope, pop, cond, d, sides: sides ? 1 : 0 })),
  vehicles: vehicles.map(({ tier, genSlug, ...v }) => ({ ...v, genSlug })),
  engines: engines.filter((e) => e.vehicles.length).map(({ tier, popular, ...e }) => e),
  gearboxes,
};
mkdirSync(new URL("../src/data/", import.meta.url), { recursive: true });
writeFileSync(new URL("../src/data/taxonomy.json", import.meta.url), JSON.stringify(taxonomy));

const q = (v) => (v == null ? "NULL" : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const lines = ["DELETE FROM products;"];
const cols = "id,slug,sku,name,cat,ptype,make,makes,veh,eng,gbx,side,pop,search,oem,note";
for (let i = 0; i < products.length; i += 40) {
  const rows = products.slice(i, i + 40).map((p, j) =>
    `(${[i + j + 1, p.slug, p.sku, p.name, p.cat, p.ptype, p.make, `,${p.makes.join(",")},`, p.veh, p.eng, p.gbx, p.side, p.pop, p.search, p.oem ?? null, p.note ?? null].map(q).join(",")})`);
  lines.push(`INSERT INTO products (${cols}) VALUES\n${rows.join(",\n")};`);
}
mkdirSync(new URL("../seed/", import.meta.url), { recursive: true });
writeFileSync(new URL("../seed/catalogue.sql", import.meta.url), lines.join("\n") + "\n");

console.log(`${products.length} products, ${vehicles.length} vehicles, ${taxonomy.engines.length} engines, ${gearboxes.length} gearboxes`);
console.log(Object.entries(catCount).map(([k, v]) => `${k}: ${v}`).join(" | "));
