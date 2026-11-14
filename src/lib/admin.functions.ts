import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function checkKey(key: string) {
  const { getEnv } = await import("./env.server");
  const { sha256 } = await import("./server-utils.server");
  const expected = getEnv().ADMIN_KEY;
  if (!expected || expected.length < 12) return false;
  // compare digests so timing does not leak the key
  return (await sha256(key)) === (await sha256(expected));
}

async function limit() {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  const { rateLimit } = await import("./server-utils.server");
  return rateLimit(`admin:${getRequestHeader("cf-connecting-ip") || "unknown"}`, 40, 600);
}

const keySchema = z.object({ key: z.string().min(1).max(200) });

export const adminLoad = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => keySchema.parse(d))
  .handler(async ({ data }) => {
    if (!(await limit())) return { ok: false as const, error: "Too many attempts. Wait a few minutes." };
    if (!(await checkKey(data.key))) return { ok: false as const, error: "Wrong admin key, or ADMIN_KEY is not set on the server." };
    const { getDb } = await import("./env.server");
    const db = getDb();
    const [quotes, requests, accounts, messages] = await db.batch([
      db.prepare("SELECT q.*, a.company AS trade_company FROM quotes q LEFT JOIN trade_accounts a ON a.id = q.trade_account_id ORDER BY q.created_at DESC LIMIT 200"),
      db.prepare("SELECT * FROM part_requests ORDER BY created_at DESC LIMIT 200"),
      db.prepare("SELECT * FROM trade_accounts ORDER BY (status = 'pending') DESC, created_at DESC LIMIT 300"),
      db.prepare("SELECT * FROM messages ORDER BY created_at DESC LIMIT 100"),
    ]);
    return {
      ok: true as const,
      quotes: (quotes?.results ?? []) as Record<string, string | number | null>[],
      requests: (requests?.results ?? []) as Record<string, string | number | null>[],
      accounts: (accounts?.results ?? []) as Record<string, string | number | null>[],
      messages: (messages?.results ?? []) as Record<string, string | number | null>[],
    };
  });

/** Approves or rejects a trade application. On approval, emails a sign-in link and returns it so it can also be sent by WhatsApp. */
export const adminDecideTrade = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => keySchema.extend({ id: z.string().max(60), approve: z.boolean() }).parse(d))
  .handler(async ({ data }) => {
    if (!(await limit()) || !(await checkKey(data.key))) return { ok: false as const, error: "Not authorised." };
    const { getDb } = await import("./env.server");
    const db = getDb();
    const account = await db.prepare("SELECT id, email, contact_name, company FROM trade_accounts WHERE id = ?").bind(data.id).first<{ id: string; email: string; contact_name: string; company: string }>();
    if (!account) return { ok: false as const, error: "Application not found." };
    await db.prepare("UPDATE trade_accounts SET status = ?, decided_at = datetime('now') WHERE id = ?").bind(data.approve ? "approved" : "rejected", data.id).run();
    if (!data.approve) {
      await db.prepare("DELETE FROM sessions WHERE account_id = ?").bind(data.id).run();
      return { ok: true as const, link: null, emailed: false };
    }
    const { createLoginToken } = await import("./trade.server");
    const { sendMail, mailHtml, siteUrl } = await import("./mail.server");
    const link = `${siteUrl()}/trade/verify?token=${await createLoginToken(account.id, 24 * 7)}`;
    const emailed = await sendMail({
      to: account.email,
      subject: "Your Auto Global Supply trade account is approved",
      html: mailHtml({
        heading: "Your trade account is approved",
        intro: `Hello ${account.contact_name}. ${account.company} now has a trade account with Auto Global Supply. Use the button below to sign in. The link works once and is valid for seven days. After that, request a new link from the trade page with this email address.`,
        button: { label: "Open trade area", url: link },
      }),
    });
    return { ok: true as const, link, emailed };
  });

export const adminSetStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => keySchema.extend({ table: z.enum(["quotes", "part_requests"]), id: z.string().max(60), status: z.enum(["new", "quoted", "ordered", "closed"]) }).parse(d))
  .handler(async ({ data }) => {
    if (!(await limit()) || !(await checkKey(data.key))) return { ok: false as const, error: "Not authorised." };
    const { getDb } = await import("./env.server");
    await getDb().prepare(`UPDATE ${data.table} SET status = ? WHERE id = ?`).bind(data.status, data.id).run();
    return { ok: true as const };
  });
