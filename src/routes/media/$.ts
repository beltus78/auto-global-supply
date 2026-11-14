import { createFileRoute } from "@tanstack/react-router";

/** Serves product photos stored in the R2 media bucket at /media/<key>. */
export const Route = createFileRoute("/media/$")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = (params as { _splat?: string })._splat ?? "";
        if (!key || key.includes("..")) return new Response("Not found", { status: 404 });
        const { getEnv } = await import("@/lib/env.server");
        const object = await getEnv().MEDIA.get(key);
        if (!object) return new Response("Not found", { status: 404 });
        const headers = new Headers({ "Cache-Control": "public, max-age=31536000, immutable", ETag: object.httpEtag });
        object.writeHttpMetadata(headers);
        if (!headers.has("Content-Type")) headers.set("Content-Type", "image/jpeg");
        return new Response(object.body, { headers });
      },
    },
  },
});
