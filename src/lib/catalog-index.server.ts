// In-memory catalogue index (built by scripts/build-catalogue.mjs). Server only.
// Filtering, counting, related parts and the sitemap use this instead of scanning D1,
// which keeps D1 reads to the handful of rows a page actually shows.
import data from "@/data/catalogue-index.json";
import { findVehicles, vehicleBy, type ProductRow } from "./taxonomy";

type Raw = [string, number, number, number, number[] | 0, number, number, number, string, string, string | 0, string | 0, string | 0];
const D = data as unknown as { cats: string[]; ptypes: string[]; makes: string[]; vehs: string[]; engs: string[]; gbxs: string[]; rows: Raw[] };

export type Item = { slug: string; cat: string; ptype: string; make: string; makes: string[]; veh: string | null; eng: string | null; gbx: string | null; rank: number; name: string; sku: string; side: string | null; oem: string | null; note: string | null };

export const ITEMS: Item[] = D.rows.map((r, rank) => ({
  slug: r[0],
  cat: D.cats[r[1]]!,
  ptype: D.ptypes[r[2]]!,
  make: D.makes[r[3]]!,
  makes: [D.makes[r[3]]!, ...(r[4] ? r[4].map((i) => D.makes[i]!) : [])],
  veh: r[5] >= 0 ? D.vehs[r[5]]! : null,
  eng: r[6] >= 0 ? D.engs[r[6]]! : null,
  gbx: r[7] >= 0 ? D.gbxs[r[7]]! : null,
  rank,
  name: r[8],
  sku: r[9],
  side: r[10] || null,
  oem: r[11] || null,
  note: r[12] || null,
}));

/** Lower-case text used by the fallback search: name, SKU, part number, make, model and generation. */
const hayCache = new Map<string, string>();
export function haystack(i: Item): string {
  let h = hayCache.get(i.slug);
  if (!h) {
    const v = i.veh ? vehicleBy.get(i.veh) : undefined;
    h = `${i.name} ${i.sku} ${i.oem ?? ""} ${i.makes.join(" ")} ${v ? `${v.model} ${v.gen}` : ""} ${i.eng ?? ""}`.toLowerCase();
    hayCache.set(i.slug, h);
  }
  return h;
}

export const BY_SLUG = new Map(ITEMS.map((i) => [i.slug, i]));

export function toRow(i: Item): ProductRow {
  return { slug: i.slug, sku: i.sku, name: i.name, cat: i.cat, ptype: i.ptype, make: i.make, veh: i.veh, eng: i.eng, gbx: i.gbx, side: i.side, image: null, oem: i.oem, note: i.note };
}

export type Filters = { category?: string; part?: string; engine?: string; make?: string; model?: string; gen?: string };

/** Same matching rules the D1 queries used: a vehicle filter also matches parts for the engines fitted to it. */
export function matcher(f: Filters, skipCategory = false): (i: Item) => boolean {
  let vehIds: Set<string> | null = null;
  let vehEngines: Set<string> | null = null;
  if (f.make && (f.model || f.gen)) {
    const vs = findVehicles(f.make, f.model, f.gen);
    vehIds = new Set(vs.map((v) => v.id));
    vehEngines = f.engine ? new Set() : new Set(vs.flatMap((v) => v.engines));
  }
  return (i) => {
    if (f.category && !skipCategory && i.cat !== f.category) return false;
    if (f.part && i.ptype !== f.part) return false;
    if (f.engine && i.eng !== f.engine) return false;
    if (vehIds) {
      if (!((i.veh && vehIds.has(i.veh)) || (i.eng && vehEngines!.has(i.eng)))) return false;
    } else if (f.make && !i.makes.includes(f.make)) return false;
    return true;
  };
}

/**
 * Rows for the given slugs, built from the bundled index (no D1 read). Product photos are the only
 * per-row data that lives in D1; they are merged in with one small indexed query when any exist.
 */
export async function rowsFor(slugs: string[]): Promise<ProductRow[]> {
  const rows = slugs.map((s) => BY_SLUG.get(s)).filter((i): i is Item => !!i).map(toRow);
  if (rows.length && HAS_IMAGES) {
    try {
      const { getDb } = await import("./env.server");
      const { results } = await getDb()
        .prepare(`SELECT slug, image FROM products WHERE image IS NOT NULL AND slug IN (${rows.map(() => "?").join(",")})`)
        .bind(...rows.map((r) => r.slug))
        .all<{ slug: string; image: string }>();
      const img = new Map(results.map((r) => [r.slug, r.image]));
      for (const r of rows) r.image = img.get(r.slug) ?? null;
    } catch (e) {
      console.error("image lookup failed", e);
    }
  }
  return rows;
}

/** Set to true once product photos are uploaded (R2) and recorded in products.image. */
const HAS_IMAGES = false;

/** Related listings for a product page: same vehicle (and its engines), same engine, or same gearbox family. */
export function relatedSlugs(p: { slug: string; cat: string; make: string; veh: string | null; eng: string | null; gbx: string | null }, limit = 8): string[] {
  let pick: (i: Item) => boolean;
  if (p.veh) {
    const engines = new Set(vehicleBy.get(p.veh)?.engines ?? []);
    pick = (i) => i.veh === p.veh || (i.eng !== null && engines.has(i.eng));
  } else if (p.eng) pick = (i) => i.eng === p.eng;
  else if (p.gbx) pick = (i) => i.gbx === p.gbx || (i.ptype === "gearbox" && i.make === p.make);
  else return [];
  const hits = ITEMS.filter((i) => i.slug !== p.slug && pick(i));
  // same category first, then most requested (ITEMS is already in that order)
  hits.sort((a, b) => Number(b.cat === p.cat) - Number(a.cat === p.cat) || a.rank - b.rank);
  return hits.slice(0, limit).map((i) => i.slug);
}
