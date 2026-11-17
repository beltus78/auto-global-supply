import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { backgroundContext } from "./lib/background.server";

type ServerEntry = { fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response };

let serverEntryPromise: Promise<ServerEntry> | undefined;
async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) serverEntryPromise = import("@tanstack/react-start/server-entry").then((m) => (m.default ?? m) as ServerEntry);
  return serverEntryPromise;
}

// Pages from the previous site that no longer exist, sent to their closest replacement.
const REDIRECTS: Record<string, string> = { "/auth": "/trade", "/account": "/trade/account", "/garage": "/trade", "/wishlist": "/quote", "/factory": "/about" };

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"}; try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
  const body = await response.clone().text();
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    if (!(payload.unhandled === true && payload.message === "HTTPError")) return response;
  } catch {
    return response;
  }
  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } });
}

declare const __BUILD_ID__: string;

// Edge cache for anonymous GET traffic (pages, catalogue data calls, sitemap). Keys include the
// build id so a new deploy never serves pages that point at old JS/CSS files.
const NO_CACHE = [/^\/admin/, /^\/trade/, /^\/quote/, /^\/api\//, /^\/media\//];
const TTL_SECONDS = 3600;

function cacheable(request: Request, url: URL) {
  if (request.method !== "GET") return false;
  if (NO_CACHE.some((r) => r.test(url.pathname))) return false;
  if ((request.headers.get("cookie") ?? "").includes("ags_trade=")) return false;
  return true;
}

type Ctx = { waitUntil?: (p: Promise<unknown>) => void };

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url0 = new URL(request.url);
    if (typeof caches !== "undefined" && cacheable(request, url0)) {
      const key = new Request(`${url0.origin}${url0.pathname}${url0.search}${url0.search ? "&" : "?"}__b=${__BUILD_ID__}`, { method: "GET" });
      const cache = (caches as unknown as { default: Cache }).default;
      const hit = await cache.match(key);
      if (hit) {
        const res = new Response(hit.body, hit);
        res.headers.set("x-ags-cache", "HIT");
        return res;
      }
      const fresh = await handle(request, env, ctx);
      if (fresh.status !== 200 || fresh.headers.has("set-cookie")) return fresh;
      const res = new Response(fresh.body, fresh);
      const copy = new Response(res.clone().body, res);
      copy.headers.set("Cache-Control", `public, max-age=${TTL_SECONDS}`);
      const put = cache.put(key, copy).catch(() => undefined);
      (ctx as Ctx)?.waitUntil?.(put);
      res.headers.set("x-ags-cache", "MISS");
      return res;
    }
    return handle(request, env, ctx);
  },
};

async function handle(request: Request, env: unknown, ctx: unknown): Promise<Response> {
  {
    try {
      const url = new URL(request.url);
      if (url.hostname.startsWith("www.")) {
        url.hostname = url.hostname.slice(4);
        return Response.redirect(url.toString(), 301);
      }
      const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname;
      const target = REDIRECTS[path];
      if (target) return Response.redirect(new URL(target, url.origin).toString(), 301);

      const handler = await getServerEntry();
      const background = ctx && typeof ctx === "object" && "waitUntil" in ctx && typeof ctx.waitUntil === "function" ? { waitUntil: ctx.waitUntil.bind(ctx) } : {};
      const response = await backgroundContext.run(background, () => handler.fetch(request, env, ctx));
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } });
    }
  }
}
