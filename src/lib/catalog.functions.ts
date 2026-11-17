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

function tokens(q?: string) {
  return (q ?? "").toLowerCase().replace(/[^a-z0-9.\- ]+/g, " ").split(/\s+/).filter(Boolean).slice(0, 8);
}

export const searchCatalogue = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => searchSchema.parse(d ?? {}))
  .handler(async ({ data: s }) => {
    const { ITEMS, matcher, rowsFor } = await import("./catalog-index.server");
    const page = s.page ?? 1;
    let pool = ITEMS;
    const words = tokens(s.q);
    if (words.length) {
      // Text search is the one case that still reads D1 broadly: one pass returning only slugs.
      const { getDb } = await import("./env.server");
      const { results } = await getDb()
        .prepare(`SELECT slug FROM products WHERE ${words.map(() => "search LIKE ?").join(" AND ")}`)
        .bind(...words.map((w) => `%${w}%`))
        .all<{ slug: string }>();
      const hit = new Set(results.map((r) => r.slug));
      pool = ITEMS.filter((i) => hit.has(i.slug));
    }
    const all = pool.filter(matcher(s));
    const categories: Record<string, number> = {};
    for (const i of pool.filter(matcher(s, true))) categories[i.cat] = (categories[i.cat] ?? 0) + 1;
    const slugs = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((i) => i.slug);
    return { items: await rowsFor(slugs), total: all.length, categories, page };
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
    const { relatedSlugs, rowsFor } = await import("./catalog-index.server");
    const related = await rowsFor(relatedSlugs(product));
    return { product, related };
  });

export const productQuery = (slug: string) => queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }), staleTime: 300_000 });

/** Most requested listings for the home page and brand pages. */
export const getFeatured = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ make: slug, category: slug, limit: z.number().int().min(1).max(24).optional() }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const { ITEMS, rowsFor } = await import("./catalog-index.server");
    // spread the selection: one listing per part type, and at most two per brand site-wide
    const limit = data.limit ?? 12;
    const picked: string[] = [];
    const types = new Set<string>();
    const makes = new Map<string, number>();
    for (const i of ITEMS) {
      if (data.make && !i.makes.includes(data.make)) continue;
      if (data.category && i.cat !== data.category) continue;
      if (types.has(i.ptype) || (!data.make && (makes.get(i.make) ?? 0) >= 2)) continue;
      types.add(i.ptype);
      makes.set(i.make, (makes.get(i.make) ?? 0) + 1);
      picked.push(i.slug);
      if (picked.length >= limit) break;
    }
    return rowsFor(picked);
  });

export const featuredQuery = (o: { make?: string; category?: string; limit?: number } = {}) =>
  queryOptions({ queryKey: ["featured", o], queryFn: () => getFeatured({ data: o }), staleTime: 300_000 });

/** Listings of a set of part types, with counts by make and type. Feeds the dashboard and interior hubs. */
export const getHub = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ types: z.array(z.string().max(60)).min(1).max(20), make: slug, limit: z.number().int().min(1).max(600).optional() }).parse(d))
  .handler(async ({ data }) => {
    const { ITEMS, rowsFor } = await import("./catalog-index.server");
    const types = new Set(data.types);
    const inTypes = ITEMS.filter((i) => types.has(i.ptype));
    const byMake: Record<string, number> = {};
    for (const i of inTypes) byMake[i.make] = (byMake[i.make] ?? 0) + 1;
    const scoped = data.make ? inTypes.filter((i) => i.make === data.make) : inTypes;
    const byType: Record<string, number> = {};
    for (const i of scoped) byType[i.ptype] = (byType[i.ptype] ?? 0) + 1;
    // vehicle|part type -> slug, for the model table on brand pages (no D1 needed)
    const slots: Record<string, string> = {};
    if (data.make) for (const i of scoped) if (i.veh) slots[`${i.veh}|${i.ptype}`] ??= i.slug;
    const items = await rowsFor(scoped.slice(0, Math.min(data.limit ?? 24, 60)).map((i) => i.slug));
    return { items, byMake, byType, slots, total: scoped.length };
  });

export const hubQuery = (o: { types: string[]; make?: string; limit?: number }) => queryOptions({ queryKey: ["hub", o], queryFn: () => getHub({ data: o }), staleTime: 300_000 });
