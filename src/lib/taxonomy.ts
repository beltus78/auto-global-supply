import data from "@/data/taxonomy.json";

export type Make = { slug: string; name: string; premium: number; intro: string; count: number; sort: number };
export type Category = { slug: string; name: string; description: string; icon: string; count: number };
export type PartType = { s: string; n: string; c: string; i: string; scope: "v" | "e" | "g"; pop: number; cond: string; d: string; sides: number };
export type Vehicle = { id: string; make: string; model: string; modelSlug: string; gen: string; genSlug: string; from: number; to: number; body: string; flags: string[]; engines: string[]; popular: number; name: string; count: number };
export type Engine = { code: string; slug: string; make: string; disp: string; fuel: string; asp: string; layout: string; note: string; vehicles: string[] };
export type Gearbox = { make: string; slug: string; name: string; kind: string; apps: string };
export type ProductRow = { slug: string; sku: string; name: string; cat: string; ptype: string; make: string; veh: string | null; eng: string | null; gbx: string | null; side: string | null; image: string | null; oem?: string | null; note?: string | null };

const T = data as unknown as { generated: string; total: number; makes: Make[]; categories: Category[]; partTypes: PartType[]; vehicles: Vehicle[]; engines: Engine[]; gearboxes: Gearbox[] };

export const TOTAL_PRODUCTS = T.total;
export const CATALOGUE_DATE = T.generated;
export const MAKES = T.makes;
export const CATEGORIES = T.categories;
export const PART_TYPES = T.partTypes;
export const VEHICLES = T.vehicles;
export const ENGINES = T.engines;
export const GEARBOXES = T.gearboxes;

const by = <X, K extends keyof X>(list: X[], key: K) => new Map(list.map((x) => [x[key] as unknown as string, x]));
export const makeBy = by(MAKES, "slug");
export const categoryBy = by(CATEGORIES, "slug");
export const partTypeBy = by(PART_TYPES, "s");
export const vehicleBy = by(VEHICLES, "id");
export const engineBy = by(ENGINES, "code");
export const engineBySlug = by(ENGINES, "slug");
export const gearboxBy = by(GEARBOXES, "slug");

export const years = (v: Pick<Vehicle, "from" | "to">) => `${v.from}–${v.to || "present"}`;
export const fuelName = (f: string) => (f === "D" ? "Diesel" : "Petrol");
export const aspName = (a: string) => (a === "T" ? "Turbocharged" : a === "S" ? "Supercharged" : "Naturally aspirated");
export const CONDITION_NAMES: Record<string, string> = { N: "New", U: "Used and tested", R: "Remanufactured" };
export const conditions = (pt: PartType | undefined) => (pt?.cond ?? "N").split("").map((c) => CONDITION_NAMES[c] ?? c);

/** Models of a make with their generations, in catalogue order. */
export function modelsOf(make: string) {
  const out: { slug: string; name: string; gens: Vehicle[] }[] = [];
  for (const v of VEHICLES) {
    if (v.make !== make) continue;
    let m = out.find((x) => x.slug === v.modelSlug);
    if (!m) out.push((m = { slug: v.modelSlug, name: v.model, gens: [] }));
    m.gens.push(v);
  }
  return out;
}

export function findVehicles(make?: string, model?: string, gen?: string) {
  if (!make) return [];
  return VEHICLES.filter((v) => v.make === make && (!model || v.modelSlug === model) && (!gen || v.genSlug === gen));
}

/** One-line fitment summary for cards and rows. */
export function fitmentLine(p: Pick<ProductRow, "veh" | "eng" | "gbx">): string {
  if (p.veh) {
    const v = vehicleBy.get(p.veh);
    return v ? `${makeBy.get(v.make)?.name} ${v.model} · ${v.gen} · ${years(v)}` : "";
  }
  if (p.eng) {
    const e = engineBy.get(p.eng);
    if (!e) return "";
    const names = [...new Set(e.vehicles.map((id) => vehicleBy.get(id)).filter(Boolean).map((v) => `${v!.model} ${v!.gen}`))];
    return `${e.disp} ${e.layout} · fits ${names.slice(0, 3).join(", ")}${names.length > 3 ? ` +${names.length - 3} more` : ""}`;
  }
  if (p.gbx) return gearboxBy.get(p.gbx)?.apps ?? "";
  return "";
}

export function productDescription(p: ProductRow): string {
  const pt = partTypeBy.get(p.ptype);
  const c = conditions(pt).map((x) => x.toLowerCase());
  const cond = c.length > 1 ? `${c.slice(0, -1).join(", ")} or ${c[c.length - 1]}` : c[0];
  return `${p.name}, ${cond}, shipped from our Guangzhou warehouse. Single units or bulk quantities. Fitment confirmed against your VIN before quoting.`;
}
