import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Field, FormError, Honeypot } from "@/components/site/Field";
import { WhatsAppIcon } from "@/components/site/WhatsAppButton";
import { submitContact } from "@/lib/forms.functions";
import { BUSINESS, whatsappUrl } from "@/lib/business";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => pageHead({ title: "Contact Auto Global Supply | Automotive Parts Enquiries", description: "Contact Auto Global Supply by email, phone or WhatsApp. Registered and principal office in Opa-locka, Florida, USA.", path: "/contact" }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", body: "", hp: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await submitContact({ data: form });
      if (res.ok) setDone(true);
      else setError(res.error);
    } catch {
      setError("We could not send your message. Please email or WhatsApp us instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader crumbs={[{ name: "Contact" }]} eyebrow="Contact" title="Contact us" intro="For a quotation, the request form or WhatsApp is fastest. We hold our own stock and do not take on new suppliers, sourcing agents or partnership offers, so those messages are not answered." />
      <div className="wrap grid gap-8 py-8 lg:grid-cols-[1fr_1fr] lg:py-12">
        <div className="space-y-4">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            <a href={`mailto:${BUSINESS.email}`} className="bg-panel p-5 hover:bg-paper"><Mail className="h-5 w-5" /><p className="label mt-3">Email</p><p className="font-semibold">{BUSINESS.email}</p></a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="bg-panel p-5 hover:bg-paper"><WhatsAppIcon className="h-5 w-5 text-whatsapp" /><p className="label mt-3">WhatsApp</p><p className="font-semibold">{BUSINESS.usPhone}</p></a>
            <a href={BUSINESS.usPhoneHref} className="bg-panel p-5 hover:bg-paper"><Phone className="h-5 w-5" /><p className="label mt-3">US contact</p><p className="font-semibold">{BUSINESS.usPhone}</p></a>
          </div>
          <div className="panel p-5">
            <MapPin className="h-5 w-5" />
            <p className="label mt-3">Florida, USA. Registered and principal office</p>
            <p className="font-semibold">{BUSINESS.legalName}</p>
            <p className="text-ink-2">{BUSINESS.address}</p>
            <p className="mono mt-1 text-[12px] text-muted">Florida document number {BUSINESS.registration}</p>
          </div>
        </div>

        {done ? (
          <div className="panel h-fit border-l-4 border-l-ok p-6"><h2 className="text-3xl">Message sent</h2><p className="mt-2 text-ink-2">Thank you. We reply by email, normally within one to two working days.</p></div>
        ) : (
          <form onSubmit={onSubmit} className="panel relative h-fit border-t-4 border-t-signal p-5 sm:p-7">
            <h2 className="text-2xl">Send a message</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="c-name" required><input id="c-name" className="field" required value={form.name} onChange={set("name")} autoComplete="name" /></Field>
              <Field label="Email" htmlFor="c-email" required><input id="c-email" type="email" className="field" required value={form.email} onChange={set("email")} autoComplete="email" /></Field>
              <Field label="Phone / WhatsApp" htmlFor="c-phone"><input id="c-phone" type="tel" className="field" value={form.phone} onChange={set("phone")} autoComplete="tel" /></Field>
              <Field label="Subject" htmlFor="c-subject"><input id="c-subject" className="field" value={form.subject} onChange={set("subject")} /></Field>
              <Field label="Message" htmlFor="c-body" required className="sm:col-span-2"><textarea id="c-body" className="field min-h-36" required value={form.body} onChange={set("body")} /></Field>
            </div>
            <Honeypot value={form.hp} onChange={(v) => setForm((f) => ({ ...f, hp: v }))} />
            <div className="mt-4"><FormError message={error} /></div>
            <button type="submit" disabled={busy} className="btn btn-signal btn-lg mt-5">{busy ? "Sending…" : "Send message"}</button>
          </form>
        )}
      </div>
    </>
  );
}
