import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const s = z.string().trim().max(120).optional().nullable();
const body = z.object({ q: s, make: s, model: s, gen: s, engine: s, category: s, part: s, results: z.number().int().min(0).max(100000), path: z.string().max(80).optional() });

/**
 * Records a catalogue search (sent by the browser with navigator.sendBeacon after results render,
 * so crawlers and cached pages don't distort it). Only searches with text or with no results are kept.
 */
export const Route = createFileRoute("/api/search-log")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const parsed = body.safeParse(JSON.parse(await request.text()));
          if (!parsed.success) return new Response(null, { status: 204 });
          const d = parsed.data;
          if (!d.q && d.results > 0) return new Response(null, { status: 204 });
          const ip = request.headers.get("cf-connecting-ip") || "unknown";
          const { rateLimit } = await import("@/lib/server-utils.server");
          if (!(await rateLimit(`search:${ip}`, 30, 600))) return new Response(null, { status: 204 });
          const { getDb } = await import("@/lib/env.server");
          const country = (request as Request & { cf?: { country?: string } }).cf?.country ?? null;
          await getDb()
            .prepare("INSERT INTO search_log (q, make, model, gen, engine, category, part, results, path, country) VALUES (?,?,?,?,?,?,?,?,?,?)")
            .bind(d.q?.toLowerCase() || null, d.make || null, d.model || null, d.gen || null, d.engine || null, d.category || null, d.part || null, d.results, d.path ?? null, country)
            .run();
        } catch (e) {
          console.warn("search log failed", e);
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
