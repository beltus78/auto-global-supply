import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

/** Emails a one-time sign-in link to an approved trade account. Always answers the same way so emails cannot be probed. */
export const requestSignInLink = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ email: z.string().trim().toLowerCase().email().max(160) }).safeParse(d))
  .handler(async ({ data }) => {
    if (!data.success) return { ok: false as const, error: "Enter a valid email address." };
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { rateLimit } = await import("./server-utils.server");
    const ip = getRequestHeader("cf-connecting-ip") || "unknown";
    if (!(await rateLimit(`signin:${ip}`, 5, 900))) return { ok: false as const, error: "Too many attempts. Please wait a few minutes." };
    const { getDb } = await import("./env.server");
    const account = await getDb().prepare("SELECT id, contact_name FROM trade_accounts WHERE email = ? AND status = 'approved'").bind(data.data.email).first<{ id: string; contact_name: string }>();
    if (account) {
      const { createLoginToken } = await import("./trade.server");
      const { sendMail, mailHtml, siteUrl } = await import("./mail.server");
      const token = await createLoginToken(account.id, 1);
      await sendMail({
        to: data.data.email,
        subject: "Your Auto Global Supply trade sign-in link",
        html: mailHtml({ heading: "Sign in to your trade account", intro: `Hello ${account.contact_name}. Use the button below to sign in. The link works once and expires in one hour.`, button: { label: "Sign in", url: `${siteUrl()}/trade/verify?token=${token}` }, outro: "If you did not ask for this link you can ignore this email." }),
      });
    }
    return { ok: true as const };
  });

export const getTradeArea = createServerFn({ method: "GET" }).handler(async () => {
  const { currentAccount } = await import("./trade.server");
  const account = await currentAccount();
  if (!account) return null;
  const { getDb } = await import("./env.server");
  const db = getDb();
  const [quotes, requests] = await db.batch([
    db.prepare("SELECT ref, created_at, items, status, destination FROM quotes WHERE trade_account_id = ? ORDER BY created_at DESC LIMIT 100").bind(account.id),
    db.prepare("SELECT ref, created_at, part_name, quantity, status FROM part_requests WHERE trade_account_id = ? ORDER BY created_at DESC LIMIT 100").bind(account.id),
  ]);
  return {
    account,
    quotes: ((quotes?.results ?? []) as { ref: string; created_at: string; items: string; status: string; destination: string | null }[]).map((q) => ({ ...q, items: JSON.parse(q.items) as { name: string; sku: string; qty: number }[] })),
    requests: (requests?.results ?? []) as { ref: string; created_at: string; part_name: string; quantity: number; status: string }[],
  };
});

export const tradeAreaQuery = queryOptions({ queryKey: ["trade-area"], queryFn: () => getTradeArea(), staleTime: 30_000 });

/** Lightweight check used by forms to prefill details for signed-in trade buyers. */
export const getTradeProfile = createServerFn({ method: "GET" }).handler(async () => {
  const { currentAccount } = await import("./trade.server");
  const a = await currentAccount();
  return a ? { company: a.company, contact_name: a.contact_name, email: a.email, phone: a.phone, country: a.country } : null;
});
export const tradeProfileQuery = queryOptions({ queryKey: ["trade-profile"], queryFn: () => getTradeProfile(), staleTime: 60_000 });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const { getCookie, deleteCookie } = await import("@tanstack/react-start/server");
  const { SESSION_COOKIE } = await import("./trade.server");
  const { sha256 } = await import("./server-utils.server");
  const { getDb } = await import("./env.server");
  const token = getCookie(SESSION_COOKIE);
  if (token) await getDb().prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  deleteCookie(SESSION_COOKIE, { path: "/" });
  return { ok: true as const };
});
