import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { findVehicles, vehicleBy, type ProductRow } from "./taxonomy";

const COLS = "slug,sku,name,cat,ptype,make,veh,eng,gbx,side,image";
export const PAGE_SIZE = 30;

const slug = z.string().max(80).regex(/^[a-z0-9.\- ]*$/i).optional();
export const searchSchema = z.object({
  q: z.string().max(120).optional(),
  category: slug,
  make: slug,
  model: slug,
  gen: slug,
  engine: z.string().max(40).optional(),
  part: slug,
  page: z.number().int().min(1).max(500).optional(),
});
export type CatalogueSearch = z.infer<typeof searchSchema>;

function buildWhere(s: CatalogueSearch, skipCategory = false) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (s.category && !skipCategory) {
    where.push("cat = ?");
    args.push(s.category);
  }
  if (s.part) {
    where.push("ptype = ?");
    args.push(s.part);
  }
  if (s.engine) {
    where.push("eng = ?");
    args.push(s.engine);
  }
  if (s.make && (s.model || s.gen)) {
    const vs = findVehicles(s.make, s.model, s.gen);
    if (!vs.length) where.push("0");
    else {
      const engines = [...new Set(vs.flatMap((v) => v.engines))];
      const parts = [`veh IN (${vs.map(() => "?").join(",")})`];
      args.push(...vs.map((v) => v.id));
      if (engines.length && !s.engine) {
        parts.push(`eng IN (${engines.map(() => "?").join(",")})`);
        args.push(...engines);
      }
      where.push(`(${parts.join(" OR ")})`);
    }
  } else if (s.make) {
    where.push("makes LIKE ?");
    args.push(`%,${s.make},%`);
  }
  const tokens = (s.q ?? "").toLowerCase().replace(/[^a-z0-9.\- ]+/g, " ").split(/\s+/).filter(Boolean).slice(0, 8);
  for (const tok of tokens) {
    where.push("search LIKE ?");
    args.push(`%${tok}%`);
  }
  return { sql: where.length ? `WHERE ${where.join(" AND ")}` : "", args };
}

export const searchCatalogue = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => searchSchema.parse(d ?? {}))
  .handler(async ({ data: s }) => {
    const { getDb } = await import("./env.server");
    const db = getDb();
    const page = s.page ?? 1;
    const w = buildWhere(s);
    const facet = buildWhere(s, true);
    const [rows, total, cats] = await db.batch([
      db.prepare(`SELECT ${COLS} FROM products ${w.sql} ORDER BY pop DESC, name LIMIT ? OFFSET ?`).bind(...w.args, PAGE_SIZE, (page - 1) * PAGE_SIZE),
      db.prepare(`SELECT COUNT(*) AS n FROM products ${w.sql}`).bind(...w.args),
      db.prepare(`SELECT cat, COUNT(*) AS n FROM products ${facet.sql} GROUP BY cat`).bind(...facet.args),
    ]);
    return {
      items: (rows?.results ?? []) as ProductRow[],
      total: ((total?.results?.[0] as { n: number } | undefined)?.n ?? 0) as number,
      categories: Object.fromEntries(((cats?.results ?? []) as { cat: string; n: number }[]).map((r) => [r.cat, r.n])) as Record<string, number>,
      page,
    };
  });

export const catalogueQuery = (s: CatalogueSearch) =>
  queryOptions({ queryKey: ["catalogue", s], queryFn: () => searchCatalogue({ data: s }), staleTime: 60_000 });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(160) }).parse(d))
  .handler(async ({ data }) => {
    const { getDb } = await import("./env.server");
    const db = getDb();
    const product = await db.prepare(`SELECT ${COLS},oem,note FROM products WHERE slug = ?`).bind(data.slug).first<ProductRow>();
    if (!product) return null;
    let related: ProductRow[] = [];
    if (product.veh) {
      const v = vehicleBy.get(product.veh);
      const engines = v?.engines ?? [];
      const sql = `SELECT ${COLS} FROM products WHERE slug != ? AND (veh = ?${engines.length ? ` OR eng IN (${engines.map(() => "?").join(",")})` : ""}) ORDER BY (cat = ?) DESC, pop DESC, name LIMIT 8`;
      related = (await db.prepare(sql).bind(product.slug, product.veh, ...engines, product.cat).all<ProductRow>()).results;
    } else if (product.eng) {
      related = (await db.prepare(`SELECT ${COLS} FROM products WHERE slug != ? AND eng = ? ORDER BY pop DESC, name LIMIT 8`).bind(product.slug, product.eng).all<ProductRow>()).results;
    } else if (product.gbx) {
      related = (await db.prepare(`SELECT ${COLS} FROM products WHERE slug != ? AND (gbx = ? OR (ptype = 'gearbox' AND make = ?)) ORDER BY (gbx = ?) DESC, pop DESC LIMIT 8`).bind(product.slug, product.gbx, product.make, product.gbx).all<ProductRow>()).results;
    }
    return { product, related };
  });

export const productQuery = (slug: string) => queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }), staleTime: 300_000 });

/** Most requested listings for the home page and brand pages. */
export const getFeatured = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ make: slug, category: slug, limit: z.number().int().min(1).max(24).optional() }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const { getDb } = await import("./env.server");
    const where: string[] = [];
    const args: (string | number)[] = [];
    if (data.make) {
      where.push("makes LIKE ?");
      args.push(`%,${data.make},%`);
    }
    if (data.category) {
      where.push("cat = ?");
      args.push(data.category);
    }
    const sql = `SELECT ${COLS} FROM products ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY pop DESC, id LIMIT 400`;
    const { results } = await getDb().prepare(sql).bind(...args).all<ProductRow>();
    // spread the selection: one listing per part type, and at most two per brand site-wide
    const limit = data.limit ?? 12;
    const picked: ProductRow[] = [];
    const types = new Set<string>();
    const makes = new Map<string, number>();
    for (const r of results) {
      if (types.has(r.ptype) || (!data.make && (makes.get(r.make) ?? 0) >= 2)) continue;
      types.add(r.ptype);
      makes.set(r.make, (makes.get(r.make) ?? 0) + 1);
      picked.push(r);
      if (picked.length >= limit) break;
    }
    return picked;
  });

export const featuredQuery = (o: { make?: string; category?: string; limit?: number } = {}) =>
  queryOptions({ queryKey: ["featured", o], queryFn: () => getFeatured({ data: o }), staleTime: 300_000 });

/** Listings of a set of part types, with counts by make and type. Feeds the dashboard and interior hubs. */
export const getHub = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ types: z.array(z.string().max(60)).min(1).max(20), make: slug, limit: z.number().int().min(1).max(600).optional() }).parse(d))
  .handler(async ({ data }) => {
    const { getDb } = await import("./env.server");
    const db = getDb();
    const marks = data.types.map(() => "?").join(",");
    const makeSql = data.make ? " AND make = ?" : "";
    const args = data.make ? [...data.types, data.make] : data.types;
    const [rows, byMake, byType] = await db.batch([
      db.prepare(`SELECT ${COLS} FROM products WHERE ptype IN (${marks})${makeSql} ORDER BY pop DESC, name LIMIT ?`).bind(...args, data.limit ?? 24),
      db.prepare(`SELECT make, COUNT(*) AS n FROM products WHERE ptype IN (${marks}) GROUP BY make`).bind(...data.types),
      db.prepare(`SELECT ptype, COUNT(*) AS n FROM products WHERE ptype IN (${marks})${makeSql} GROUP BY ptype`).bind(...args),
    ]);
    const toMap = (r: unknown[] | undefined, k: string) => Object.fromEntries(((r ?? []) as Record<string, string | number>[]).map((x) => [x[k] as string, x.n as number])) as Record<string, number>;
    return { items: (rows?.results ?? []) as ProductRow[], byMake: toMap(byMake?.results, "make"), byType: toMap(byType?.results, "ptype") };
  });

export const hubQuery = (o: { types: string[]; make?: string; limit?: number }) => queryOptions({ queryKey: ["hub", o], queryFn: () => getHub({ data: o }), staleTime: 300_000 });
