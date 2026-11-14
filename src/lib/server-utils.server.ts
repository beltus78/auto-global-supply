import { getDb } from "./env.server";

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function randomToken(bytes = 32) {
  return [...crypto.getRandomValues(new Uint8Array(bytes))].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Reference shown to the customer, e.g. AGS-Q-261109-7K2M. */
export function makeRef(kind: "Q" | "R" | "T") {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = [...crypto.getRandomValues(new Uint8Array(4))].map((n) => chars[n % chars.length]).join("");
  return `AGS-${kind}-${ymd}-${suffix}`;
}

/** Allows `max` submissions per bucket in the window. Returns false when the limit is hit. */
export async function rateLimit(bucket: string, max = 6, windowSeconds = 600) {
  const db = getDb();
  const now = Math.floor(Date.now() / 1000);
  const row = await db.prepare("SELECT COUNT(*) AS n FROM rate_limits WHERE bucket = ? AND created_at > ?").bind(bucket, now - windowSeconds).first<{ n: number }>();
  if ((row?.n ?? 0) >= max) return false;
  await db.batch([
    db.prepare("INSERT INTO rate_limits (bucket, created_at) VALUES (?, ?)").bind(bucket, now),
    db.prepare("DELETE FROM rate_limits WHERE created_at < ?").bind(now - 86400),
  ]);
  return true;
}
