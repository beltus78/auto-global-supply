import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Field, FormError, Honeypot, Success } from "@/components/site/Field";
import { useQuoteBasket } from "@/lib/quote-basket";
import { submitQuote } from "@/lib/forms.functions";
import { tradeProfileQuery } from "@/lib/trade.functions";
import { whatsappUrl } from "@/lib/business";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/quote")({
  staticData: { sitemap: false },
  head: () => pageHead({ title: "Your Quote List | Auto Global Supply", description: "Review the parts in your quote list and send them to our parts team for a written quotation.", path: "/quote", noindex: true }),
  component: QuotePage,
});

const BUYER_TYPES = ["Vehicle owner", "Repair shop / garage", "Dealer / reseller", "Fleet / company", "Other"] as const;

function QuotePage() {
  const basket = useQuoteBasket();
  const { data: trade } = useQuery(tradeProfileQuery);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", country: "", destination: "", buyer_type: "Vehicle owner" as (typeof BUYER_TYPES)[number], notes: "", hp: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (trade) setForm((f) => ({ ...f, name: f.name || trade.contact_name, email: f.email || trade.email, phone: f.phone || trade.phone, company: f.company || trade.company, country: f.country || trade.country, buyer_type: f.buyer_type === "Vehicle owner" ? "Dealer / reseller" : f.buyer_type }));
  }, [trade]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await submitQuote({ data: { ...form, items: basket.items.map((i) => ({ slug: i.slug, sku: i.sku, name: i.name, qty: i.qty, note: i.note })) } });
      if (res.ok) {
        setDone(res.ref ?? "");
        basket.clear();
        window.scrollTo({ top: 0 });
      } else setError(res.error);
    } catch {
      setError("We could not send your request. Check your connection and try again, or contact us on WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader crumbs={[{ name: "Quote list" }]} eyebrow="Quotation request" title="Your quote list" intro="Send the list to our parts team. We check fitment and availability for each part and reply by email with price, condition, lead time and shipping." />
      <div className="wrap py-8 lg:py-12">
        {done !== null ? (
          <Success title="Request received" reference={done || undefined}>
            <p>Thank you. Your request is with our parts team and a confirmation has been sent to your email address.</p>
            <p>If you have a VIN, part numbers or photographs you have not sent yet, reply to that email or send them on WhatsApp with your reference.</p>
          </Success>
        ) : basket.items.length === 0 ? (
          <div className="panel p-8">
            <h2 className="text-3xl">Your quote list is empty</h2>
            <p className="mt-2 max-w-xl text-ink-2">Add parts from the catalog, or describe what you need and we will identify it for you.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/parts" className="btn btn-signal">Browse the catalog</Link>
              <Link to="/request-a-part" className="btn btn-line">Request a part</Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section aria-label="Parts in your list">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl">{basket.items.length} {basket.items.length === 1 ? "part" : "parts"}</h2>
                <button type="button" onClick={basket.clear} className="mono text-[11px] uppercase tracking-[0.08em] text-muted underline underline-offset-4">Clear list</button>
              </div>
              <ul className="border border-line bg-panel">
                {basket.items.map((i) => (
                  <li key={i.slug} className="border-b border-line p-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <Link to="/part/$slug" params={{ slug: i.slug }} className="font-semibold hover:underline">{i.name}</Link>
                        <p className="mono mt-0.5 text-[11px] uppercase tracking-[0.06em] text-muted">{i.sku}</p>
                      </div>
                      <div className="flex items-center border border-line-strong">
                        <button type="button" className="flex h-9 w-8 items-center justify-center" onClick={() => basket.setQty(i.slug, i.qty - 1)} aria-label="Decrease quantity"><Minus className="h-3.5 w-3.5" /></button>
                        <input aria-label={`Quantity for ${i.name}`} inputMode="numeric" className="mono h-9 w-10 border-x border-line-strong bg-panel text-center text-sm" value={i.qty} onChange={(e) => basket.setQty(i.slug, parseInt(e.target.value, 10))} />
                        <button type="button" className="flex h-9 w-8 items-center justify-center" onClick={() => basket.setQty(i.slug, i.qty + 1)} aria-label="Increase quantity"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <button type="button" onClick={() => basket.remove(i.slug)} className="flex h-9 w-9 items-center justify-center text-muted hover:text-danger" aria-label={`Remove ${i.name}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <input className="field mt-3 h-9 text-[13.5px]" placeholder="Note for this part: side, color, part number, condition…" value={i.note ?? ""} onChange={(e) => basket.setNote(i.slug, e.target.value)} aria-label={`Note for ${i.name}`} />
                  </li>
                ))}
              </ul>
              <Link to="/parts" className="btn btn-line mt-4">Add more parts</Link>
            </section>

            <form onSubmit={onSubmit} className="panel relative h-fit border-t-4 border-t-signal p-5 sm:p-6">
              <h2 className="text-2xl">Your details</h2>
              {trade ? <p className="mt-2 border-l-4 border-ok bg-ok/8 px-3 py-2 text-[13px]">Signed in as trade account <strong>{trade.company}</strong>. This request is saved to your trade area.</p> : null}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="q-name" required><input id="q-name" className="field" required value={form.name} onChange={set("name")} autoComplete="name" /></Field>
                <Field label="Email" htmlFor="q-email" required><input id="q-email" type="email" className="field" required value={form.email} onChange={set("email")} autoComplete="email" /></Field>
                <Field label="Phone / WhatsApp" htmlFor="q-phone"><input id="q-phone" type="tel" className="field" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+1 555 000 0000" /></Field>
                <Field label="Company" htmlFor="q-company"><input id="q-company" className="field" value={form.company} onChange={set("company")} autoComplete="organization" /></Field>
                <Field label="Ship to country" htmlFor="q-country" required><input id="q-country" className="field" required value={form.country} onChange={set("country")} autoComplete="country-name" /></Field>
                <Field label="City / port / postcode" htmlFor="q-dest"><input id="q-dest" className="field" value={form.destination} onChange={set("destination")} /></Field>
                <Field label="I am a" htmlFor="q-type" className="sm:col-span-2"><select id="q-type" className="field" value={form.buyer_type} onChange={set("buyer_type")}>{BUYER_TYPES.map((b) => <option key={b}>{b}</option>)}</select></Field>
                <Field label="VIN and notes" htmlFor="q-notes" className="sm:col-span-2" hint="Your VIN lets us confirm fitment for every part on the list."><textarea id="q-notes" className="field" value={form.notes} onChange={set("notes")} placeholder="VIN, preferred condition (new, used or remanufactured), deadline…" /></Field>
              </div>
              <Honeypot value={form.hp} onChange={(v) => setForm((f) => ({ ...f, hp: v }))} />
              <div className="mt-4"><FormError message={error} /></div>
              <button type="submit" disabled={busy} className="btn btn-signal btn-lg mt-5 w-full">{busy ? "Sending…" : "Send quote request"}</button>
              <p className="mt-3 text-[12.5px] text-muted">No payment is taken. An order exists only once you approve a written quotation. Prefer chat? <a className="underline" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>.</p>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
