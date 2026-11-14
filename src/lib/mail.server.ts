import { getEnv } from "./env.server";
import { BUSINESS } from "./business";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export type MailRow = [label: string, value: unknown];

/** Plain, table-based email body that renders the same in every mail client. */
export function mailHtml(opts: { heading: string; intro?: string; rows?: MailRow[]; items?: { name: string; sku?: string; qty?: number; note?: string }[]; button?: { label: string; url: string }; outro?: string }) {
  const rows = (opts.rows ?? []).filter(([, v]) => v != null && String(v).trim() !== "");
  return `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1c2330">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #d9dce2">
<tr><td style="background:#1c2330;padding:18px 24px;color:#ffffff;font-size:18px;font-weight:bold;letter-spacing:.04em">AUTO GLOBAL SUPPLY</td></tr>
<tr><td style="height:4px;background:#f5c518;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:24px">
<h1 style="margin:0 0 12px;font-size:20px">${esc(opts.heading)}</h1>
${opts.intro ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.5">${esc(opts.intro)}</p>` : ""}
${rows.length ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${rows.map(([k, v]) => `<tr><td style="padding:7px 8px;border-bottom:1px solid #e6e8ec;color:#5b6472;width:38%;vertical-align:top">${esc(k)}</td><td style="padding:7px 8px;border-bottom:1px solid #e6e8ec;vertical-align:top">${esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>` : ""}
${opts.items?.length ? `<h2 style="margin:22px 0 8px;font-size:15px">Parts</h2><table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${opts.items.map((i) => `<tr><td style="padding:7px 8px;border-bottom:1px solid #e6e8ec;vertical-align:top">${esc(i.name)}${i.sku ? `<br><span style="color:#5b6472;font-family:monospace;font-size:12px">${esc(i.sku)}</span>` : ""}${i.note ? `<br><span style="color:#5b6472">${esc(i.note)}</span>` : ""}</td><td style="padding:7px 8px;border-bottom:1px solid #e6e8ec;text-align:right;white-space:nowrap;vertical-align:top">Qty ${esc(i.qty ?? 1)}</td></tr>`).join("")}</table>` : ""}
${opts.button ? `<p style="margin:22px 0 0"><a href="${esc(opts.button.url)}" style="display:inline-block;background:#f5c518;color:#1c2330;font-weight:bold;text-decoration:none;padding:12px 20px">${esc(opts.button.label)}</a></p>` : ""}
${opts.outro ? `<p style="margin:18px 0 0;font-size:14px;line-height:1.5">${esc(opts.outro)}</p>` : ""}
</td></tr>
<tr><td style="padding:16px 24px;background:#f7f8fa;border-top:1px solid #e6e8ec;font-size:12px;color:#5b6472;line-height:1.5">${esc(BUSINESS.legalName)} · ${esc(BUSINESS.address)}<br>${esc(BUSINESS.email)} · ${esc(BUSINESS.usPhone)}</td></tr>
</table></td></tr></table></body></html>`;
}

/** Sends through Resend. Returns false (and logs) when mail is not configured or the send fails; callers never depend on it. */
export async function sendMail(opts: { to: string; subject: string; html: string; replyTo?: string }): Promise<boolean> {
  const env = getEnv();
  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; email skipped:", opts.subject);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.MAIL_FROM || `${BUSINESS.brand} <noreply@notify.autoglobalsupply.com>`,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    if (!res.ok) console.error("Email send failed", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("Email send failed", e);
    return false;
  }
}

export const salesInbox = () => getEnv().SALES_EMAIL || BUSINESS.email;
export const siteUrl = () => (getEnv().SITE_URL || BUSINESS.website).replace(/\/$/, "");
