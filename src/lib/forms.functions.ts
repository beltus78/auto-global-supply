import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const opt = (max: number) => text(max).optional().transform((v) => (v ? v : null));
const email = z.string().trim().toLowerCase().email("Enter a valid email address").max(160);
const hp = z.string().max(0, "Rejected").optional();

export const quoteSchema = z.object({
  name: text(100).min(2, "Enter your name"),
  email,
  phone: opt(40),
  company: opt(120),
  country: text(80).min(2, "Enter your country"),
  destination: opt(160),
  buyer_type: z.enum(["Vehicle owner", "Workshop / garage", "Dealer / reseller", "Fleet / company", "Other"]),
  notes: opt(2000),
  items: z.array(z.object({ slug: text(160), sku: text(40), name: text(200), qty: z.number().int().min(1).max(999), note: opt(300) })).min(1, "Add at least one part").max(100),
  hp,
});

export const partRequestSchema = z.object({
  name: text(100).min(2, "Enter your name"),
  email,
  phone: opt(40),
  country: text(80).min(2, "Enter your country"),
  make: opt(60),
  model: opt(80),
  year: opt(20),
  vin: opt(40),
  engine: opt(60),
  part_name: text(300).min(2, "Tell us which part you need"),
  oem: opt(120),
  condition: z.enum(["Any", "New", "Used, tested", "Remanufactured"]),
  quantity: z.number().int().min(1).max(9999),
  notes: opt(2000),
  hp,
});

export const tradeSchema = z.object({
  company: text(140).min(2, "Enter your company name"),
  contact_name: text(100).min(2, "Enter your name"),
  email,
  phone: text(40).min(5, "Enter a phone or WhatsApp number"),
  country: text(80).min(2, "Enter your country"),
  city: opt(80),
  business_type: z.enum(["Workshop / garage", "Parts retailer", "Parts wholesaler / distributor", "Vehicle dealer", "Fleet operator", "Body shop", "Exporter / importer", "Other"]),
  website: opt(200),
  monthly_volume: opt(80),
  brands: opt(300),
  notes: opt(2000),
  hp,
});

export const contactSchema = z.object({
  name: text(100).min(2, "Enter your name"),
  email,
  phone: opt(40),
  subject: opt(160),
  body: text(4000).min(5, "Enter your message"),
  hp,
});

type Result = { ok: true; ref?: string } | { ok: false; error: string };
const firstIssue = (e: z.ZodError) => e.issues[0]?.message ?? "Check the form and try again.";

async function guard(kind: string): Promise<string | null> {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  const { rateLimit } = await import("./server-utils.server");
  const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for") || "unknown";
  return (await rateLimit(`${kind}:${ip}`)) ? null : "Too many requests from this connection. Please wait a few minutes or contact us on WhatsApp.";
}

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d)
  .handler(async ({ data }): Promise<Result> => {
    const parsed = quoteSchema.safeParse(data);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const v = parsed.data;
    const limited = await guard("quote");
    if (limited) return { ok: false, error: limited };
    const { getDb } = await import("./env.server");
    const { makeRef } = await import("./server-utils.server");
    const { currentAccount } = await import("./trade.server");
    const account = await currentAccount();
    const ref = makeRef("Q");
    try {
      await getDb()
        .prepare("INSERT INTO quotes (id,ref,name,email,phone,company,country,destination,buyer_type,notes,items,trade_account_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(crypto.randomUUID(), ref, v.name, v.email, v.phone, v.company, v.country, v.destination, v.buyer_type, v.notes, JSON.stringify(v.items), account?.id ?? null)
        .run();
    } catch (e) {
      console.error("quote save failed", e);
      return { ok: false, error: "We could not save your request. Please try again or contact us on WhatsApp." };
    }
    const { sendMail, mailHtml, salesInbox } = await import("./mail.server");
    const items = v.items.map((i) => ({ name: i.name, sku: i.sku, qty: i.qty, note: i.note ?? undefined }));
    await Promise.allSettled([
      sendMail({
        to: salesInbox(),
        replyTo: v.email,
        subject: `Quote request ${ref}: ${v.items.length} part${v.items.length === 1 ? "" : "s"} from ${v.name}`,
        html: mailHtml({
          heading: `Quote request ${ref}`,
          rows: [["Name", v.name], ["Email", v.email], ["Phone / WhatsApp", v.phone], ["Company", v.company], ["Buyer type", v.buyer_type], ["Trade account", account ? `${account.company} (approved)` : null], ["Country", v.country], ["Ship to", v.destination], ["Notes", v.notes]],
          items,
        }),
      }),
      sendMail({
        to: v.email,
        subject: `We received your quote request ${ref}`,
        html: mailHtml({
          heading: "Your quote request is with our parts team",
          intro: `Thank you, ${v.name}. Your reference is ${ref}. We check fitment and availability for each part and reply by email with price, condition, lead time and shipping cost. If you have a VIN or part numbers you have not sent yet, reply to this email with them.`,
          items,
          outro: "Nothing is charged at this stage. An order is only placed once you approve the quotation.",
        }),
      }),
    ]);
    return { ok: true, ref };
  });

export const submitPartRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d)
  .handler(async ({ data }): Promise<Result> => {
    const parsed = partRequestSchema.safeParse(data);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const v = parsed.data;
    const limited = await guard("request");
    if (limited) return { ok: false, error: limited };
    const { getDb } = await import("./env.server");
    const { makeRef } = await import("./server-utils.server");
    const { currentAccount } = await import("./trade.server");
    const account = await currentAccount();
    const ref = makeRef("R");
    try {
      await getDb()
        .prepare("INSERT INTO part_requests (id,ref,name,email,phone,country,make,model,year,vin,engine,part_name,oem,condition,quantity,notes,trade_account_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(crypto.randomUUID(), ref, v.name, v.email, v.phone, v.country, v.make, v.model, v.year, v.vin, v.engine, v.part_name, v.oem, v.condition, v.quantity, v.notes, account?.id ?? null)
        .run();
    } catch (e) {
      console.error("part request save failed", e);
      return { ok: false, error: "We could not save your request. Please try again or contact us on WhatsApp." };
    }
    const { sendMail, mailHtml, salesInbox } = await import("./mail.server");
    const rows: [string, unknown][] = [["Part needed", v.part_name], ["Part number", v.oem], ["Quantity", v.quantity], ["Condition", v.condition], ["Vehicle", [v.make, v.model, v.year].filter(Boolean).join(" ")], ["VIN", v.vin], ["Engine", v.engine], ["Notes", v.notes]];
    await Promise.allSettled([
      sendMail({
        to: salesInbox(),
        replyTo: v.email,
        subject: `Part request ${ref}: ${v.part_name.slice(0, 70)}`,
        html: mailHtml({ heading: `Part request ${ref}`, rows: [["Name", v.name], ["Email", v.email], ["Phone / WhatsApp", v.phone], ["Country", v.country], ["Trade account", account ? `${account.company} (approved)` : null], ...rows] }),
      }),
      sendMail({
        to: v.email,
        subject: `We received your part request ${ref}`,
        html: mailHtml({
          heading: "Your part request is with our parts team",
          intro: `Thank you, ${v.name}. Your reference is ${ref}. We identify the exact part from the details you sent and reply by email with a quotation. Photos of the part or its label help. You can send them by replying to this email or on WhatsApp, quoting your reference.`,
          rows,
        }),
      }),
    ]);
    return { ok: true, ref };
  });

export const submitTradeApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d)
  .handler(async ({ data }): Promise<Result> => {
    const parsed = tradeSchema.safeParse(data);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const v = parsed.data;
    const limited = await guard("trade");
    if (limited) return { ok: false, error: limited };
    const { getDb } = await import("./env.server");
    const db = getDb();
    const existing = await db.prepare("SELECT status FROM trade_accounts WHERE email = ?").bind(v.email).first<{ status: string }>();
    if (existing) {
      return existing.status === "approved"
        ? { ok: false, error: "This email already has an approved trade account. Use the sign-in box on this page." }
        : { ok: false, error: "We already have an application for this email. We will reply once it has been reviewed." };
    }
    try {
      await db
        .prepare("INSERT INTO trade_accounts (id,company,contact_name,email,phone,country,city,business_type,website,monthly_volume,brands,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(crypto.randomUUID(), v.company, v.contact_name, v.email, v.phone, v.country, v.city, v.business_type, v.website, v.monthly_volume, v.brands, v.notes)
        .run();
    } catch (e) {
      console.error("trade application save failed", e);
      return { ok: false, error: "We could not save your application. Please try again or contact us." };
    }
    const { sendMail, mailHtml, salesInbox, siteUrl } = await import("./mail.server");
    await Promise.allSettled([
      sendMail({
        to: salesInbox(),
        replyTo: v.email,
        subject: `Trade account application: ${v.company}`,
        html: mailHtml({
          heading: "New trade account application",
          rows: [["Company", v.company], ["Contact", v.contact_name], ["Email", v.email], ["Phone / WhatsApp", v.phone], ["Location", [v.city, v.country].filter(Boolean).join(", ")], ["Business type", v.business_type], ["Website", v.website], ["Monthly volume", v.monthly_volume], ["Brands", v.brands], ["Notes", v.notes]],
          button: { label: "Review in admin", url: `${siteUrl()}/admin` },
        }),
      }),
      sendMail({
        to: v.email,
        subject: "We received your trade account application",
        html: mailHtml({ heading: "Trade account application received", intro: `Thank you, ${v.contact_name}. We review each application and reply by email. Once approved you receive a sign-in link for the trade area. You can request quotations in the meantime without an account.` }),
      }),
    ]);
    return { ok: true };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d)
  .handler(async ({ data }): Promise<Result> => {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
    const v = parsed.data;
    const limited = await guard("contact");
    if (limited) return { ok: false, error: limited };
    const { getDb } = await import("./env.server");
    try {
      await getDb().prepare("INSERT INTO messages (id,name,email,phone,subject,body) VALUES (?,?,?,?,?,?)").bind(crypto.randomUUID(), v.name, v.email, v.phone, v.subject, v.body).run();
    } catch (e) {
      console.error("message save failed", e);
      return { ok: false, error: "We could not send your message. Please email or WhatsApp us instead." };
    }
    const { sendMail, mailHtml, salesInbox } = await import("./mail.server");
    await sendMail({ to: salesInbox(), replyTo: v.email, subject: `Website message: ${v.subject || v.name}`, html: mailHtml({ heading: "Website message", rows: [["Name", v.name], ["Email", v.email], ["Phone", v.phone], ["Subject", v.subject], ["Message", v.body]] }) });
    return { ok: true };
  });
