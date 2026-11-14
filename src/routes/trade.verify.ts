import { createFileRoute } from "@tanstack/react-router";

/** One-time sign-in link target: exchanges the emailed token for a session cookie. */
export const Route = createFileRoute("/trade/verify")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token") ?? "";
        const { redeemLoginToken, SESSION_COOKIE } = await import("@/lib/trade.server");
        const session = /^[a-f0-9]{64}$/.test(token) ? await redeemLoginToken(token) : null;
        if (!session) return new Response(null, { status: 302, headers: { Location: "/trade?link=expired", "Cache-Control": "no-store" } });
        const secure = url.protocol === "https:" ? " Secure;" : "";
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/trade/account",
            "Set-Cookie": `${SESSION_COOKIE}=${session}; Path=/; HttpOnly;${secure} SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
            "Cache-Control": "no-store",
            "Referrer-Policy": "no-referrer",
          },
        });
      },
    },
  },
});
