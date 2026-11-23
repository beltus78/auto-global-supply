import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Field, FormError, Honeypot, Success } from "@/components/site/Field";
import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import { submitPartRequest } from "@/lib/forms.functions";
import { tradeProfileQuery } from "@/lib/trade.functions";
import { BUSINESS, whatsappUrl } from "@/lib/business";
import { MAKES } from "@/lib/taxonomy";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/request-a-part")({
  staticData: { sitemap: true },
  validateSearch: z.object({ part: z.string().max(300).optional().catch(undefined) }),
  head: () => pageHead({ title: "Request an Automotive Parts Quote | Auto Global Supply", description: "Send a parts list, part numbers or VINs. We check our stock and reply with a written quotation including shipping.", path: "/request-a-part" }),
  component: RequestPage,
});

const CONDITIONS = ["Any", "New", "Used, tested", "Remanufactured"] as const;

function RequestPage() {
  const { data: trade } = useQuery(tradeProfileQuery);
  const { part } = Route.useSearch();
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", make: "", model: "", year: "", vin: "", engine: "", part_name: part ?? "", oem: "", condition: "Any" as (typeof CONDITIONS)[number], quantity: "1", notes: "", hp: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (trade) setForm((f) => ({ ...f, name: f.name || trade.contact_name, email: f.email || trade.email, phone: f.phone || trade.phone, country: f.country || trade.country }));
  }, [trade]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await submitPartRequest({ data: { ...form, quantity: Math.max(1, parseInt(form.quantity, 10) || 1) } });
      if (res.ok) {
        setDone(res.ref ?? "");
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
      <PageHeader crumbs={[{ name: "Request a part" }]} eyebrow="Send VIN / part number" title="Request a quote" intro="Tell us the parts, quantities and vehicles. A parts list with part numbers or VINs gets the fastest quotation. This form is for buyers only: supplier and partnership offers are not answered." />
      <div className="wrap grid gap-8 py-8 lg:grid-cols-[1.25fr_0.75fr] lg:py-12">
        {done !== null ? (
          <Success title="Request received" reference={done || undefined}>
            <p>Thank you. Our parts team will identify the part and reply by email with a quotation.</p>
            <p>Photographs of the part or its label help. Reply to the confirmation email with them, or send them on WhatsApp with your reference.</p>
          </Success>
        ) : (
          <form onSubmit={onSubmit} className="panel relative border-t-4 border-t-signal p-5 sm:p-7">
            <h2 className="text-2xl">01 · The part</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Part needed" htmlFor="r-part" required className="sm:col-span-2" hint="One part or a list. Include left or right, front or rear where it matters."><textarea id="r-part" className="field" required value={form.part_name} onChange={set("part_name")} placeholder="e.g. Front left air strut and both front control arms" /></Field>
              <Field label="Part number (if known)" htmlFor="r-oem"><input id="r-oem" className="field mono" value={form.oem} onChange={set("oem")} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Quantity" htmlFor="r-qty"><input id="r-qty" type="number" min={1} className="field" value={form.quantity} onChange={set("quantity")} /></Field>
                <Field label="Condition" htmlFor="r-cond"><select id="r-cond" className="field" value={form.condition} onChange={set("condition")}>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select></Field>
              </div>
            </div>

            <h2 className="mt-8 text-2xl">02 · The vehicle</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="VIN" htmlFor="r-vin" className="sm:col-span-2" hint="17 characters, on the registration document or the lower corner of the windshield."><input id="r-vin" className="field mono uppercase" maxLength={20} value={form.vin} onChange={set("vin")} placeholder="WBA…" /></Field>
              <Field label="Make" htmlFor="r-make"><input id="r-make" className="field" list="r-makes" value={form.make} onChange={set("make")} /><datalist id="r-makes">{MAKES.map((m) => <option key={m.slug} value={m.name} />)}</datalist></Field>
              <Field label="Model" htmlFor="r-model"><input id="r-model" className="field" value={form.model} onChange={set("model")} placeholder="e.g. X5 G05" /></Field>
              <Field label="Year" htmlFor="r-year"><input id="r-year" className="field" value={form.year} onChange={set("year")} /></Field>
              <Field label="Engine" htmlFor="r-engine"><input id="r-engine" className="field" value={form.engine} onChange={set("engine")} placeholder="e.g. B58 3.0 gas" /></Field>
            </div>

            <h2 className="mt-8 text-2xl">03 · Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="r-name" required><input id="r-name" className="field" required value={form.name} onChange={set("name")} autoComplete="name" /></Field>
              <Field label="Email" htmlFor="r-email" required><input id="r-email" type="email" className="field" required value={form.email} onChange={set("email")} autoComplete="email" /></Field>
              <Field label="Phone / WhatsApp" htmlFor="r-phone"><input id="r-phone" type="tel" className="field" value={form.phone} onChange={set("phone")} autoComplete="tel" /></Field>
              <Field label="Ship to state" htmlFor="r-country" required><input id="r-country" className="field" required placeholder="e.g. Texas" value={form.country} onChange={set("country")} autoComplete="address-level1" /></Field>
              <Field label="Anything else" htmlFor="r-notes" className="sm:col-span-2"><textarea id="r-notes" className="field" value={form.notes} onChange={set("notes")} placeholder="Deadline, city or port, how the fault shows up…" /></Field>
            </div>
            <Honeypot value={form.hp} onChange={(v) => setForm((f) => ({ ...f, hp: v }))} />
            <div className="mt-4"><FormError message={error} /></div>
            <button type="submit" disabled={busy} className="btn btn-signal btn-lg mt-6 w-full sm:w-auto">{busy ? "Sending…" : "Send request"}</button>
          </form>
        )}

        <aside className="space-y-4">
          <div className="bg-steel p-6 text-steel-text grid-steel">
            <p className="eyebrow text-signal">Faster with photos</p>
            <h2 className="mt-2 text-2xl">Send it on WhatsApp</h2>
            <p className="mt-2 text-[14px] text-steel-muted">Photograph the part, its label and your VIN plate. Our parts desk replies in the same chat.</p>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn mt-4 bg-whatsapp text-white hover:brightness-110"><WhatsAppIcon className="h-5 w-5" /> Open WhatsApp</a>
            <div className="mt-5 grid gap-1 border-t border-steel-line pt-4 text-[13.5px] text-steel-muted">
              <a href={BUSINESS.usPhoneHref} className="hover:text-signal">US {BUSINESS.usPhone}</a>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-signal">{BUSINESS.email}</a>
            </div>
          </div>
          <div className="panel p-6">
            <h2 className="text-xl">What happens next</h2>
            <ol className="mt-3 space-y-3 text-[14px] text-ink-2">
              {["We check the part against your vehicle build.", "We check availability and quantity in our warehouse.", "You receive a written quotation: part, condition, price, lead time and shipping.", "Nothing is ordered until you approve it."].map((t, i) => (
                <li key={t} className="flex gap-3"><span className="mono mt-0.5 text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span><span>{t}</span></li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}
