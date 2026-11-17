// In-memory catalogue index (built by scripts/build-catalogue.mjs). Server only.
// Filtering, counting, related parts and the sitemap use this instead of scanning D1,
// which keeps D1 reads to the handful of rows a page actually shows.
import data from "@/data/catalogue-index.json";
import { findVehicles, vehicleBy, type ProductRow } from "./taxonomy";

type Raw = [string, number, number, number, number[] | 0, number, number, number];
const D = data as unknown as { cats: string[]; ptypes: string[]; makes: string[]; vehs: string[]; engs: string[]; gbxs: string[]; rows: Raw[] };

export type Item = { slug: string; cat: string; ptype: string; make: string; makes: string[]; veh: string | null; eng: string | null; gbx: string | null; rank: number };

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
}));

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

/** Rows for the given slugs from D1, returned in the order of the slugs. One indexed lookup per row. */
export async function rowsFor(slugs: string[]): Promise<ProductRow[]> {
  if (!slugs.length) return [];
  const { getDb } = await import("./env.server");
  const out: ProductRow[] = [];
  try {
    for (let i = 0; i < slugs.length; i += 90) {
      const part = slugs.slice(i, i + 90);
      const { results } = await getDb()
        .prepare(`SELECT slug,sku,name,cat,ptype,make,veh,eng,gbx,side,image FROM products WHERE slug IN (${part.map(() => "?").join(",")})`)
        .bind(...part)
        .all<ProductRow>();
      out.push(...results);
    }
  } catch (e) {
    // Keep pages up if D1 is unavailable (e.g. a daily limit): listings are omitted, counts and links still render.
    console.error("rowsFor failed", e);
  }
  const pos = new Map(slugs.map((s, n) => [s, n]));
  return out.sort((a, b) => (pos.get(a.slug) ?? 0) - (pos.get(b.slug) ?? 0));
}

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
