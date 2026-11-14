import { getCookie } from "@tanstack/react-start/server";
import { getDb } from "./env.server";
import { randomToken, sha256 } from "./server-utils.server";

export const SESSION_COOKIE = "ags_trade";
export type TradeAccount = { id: string; company: string; contact_name: string; email: string; phone: string; country: string; city: string | null; business_type: string; status: string; created_at: string };

/** The approved trade account for the current request, or null. */
export async function currentAccount(): Promise<TradeAccount | null> {
  const token = getCookie(SESSION_COOKIE);
  if (!token || token.length > 128) return null;
  const row = await getDb()
    .prepare("SELECT a.id,a.company,a.contact_name,a.email,a.phone,a.country,a.city,a.business_type,a.status,a.created_at FROM sessions s JOIN trade_accounts a ON a.id = s.account_id WHERE s.token_hash = ? AND s.expires_at > datetime('now') AND a.status = 'approved'")
    .bind(await sha256(token))
    .first<TradeAccount>();
  return row ?? null;
}

/** Creates a one-time sign-in token and returns the raw value for the link. */
export async function createLoginToken(accountId: string, hours: number) {
  const token = randomToken();
  await getDb().prepare("INSERT INTO login_tokens (token_hash, account_id, expires_at) VALUES (?, ?, datetime('now', ?))").bind(await sha256(token), accountId, `+${hours} hours`).run();
  return token;
}

/** Exchanges a sign-in token for a session token. Returns null when the token is invalid, used or expired. */
export async function redeemLoginToken(token: string) {
  const db = getDb();
  const hash = await sha256(token);
  const row = await db.prepare("SELECT t.account_id FROM login_tokens t JOIN trade_accounts a ON a.id = t.account_id WHERE t.token_hash = ? AND t.used = 0 AND t.expires_at > datetime('now') AND a.status = 'approved'").bind(hash).first<{ account_id: string }>();
  if (!row) return null;
  const session = randomToken();
  await db.batch([
    db.prepare("UPDATE login_tokens SET used = 1 WHERE token_hash = ?").bind(hash),
    db.prepare("INSERT INTO sessions (token_hash, account_id, expires_at) VALUES (?, ?, datetime('now', '+30 days'))").bind(await sha256(session), row.account_id),
    db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')"),
    db.prepare("DELETE FROM login_tokens WHERE expires_at < datetime('now', '-7 days')"),
  ]);
  return session;
}
