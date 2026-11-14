import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { PageHeader } from "@/components/site/PageHeader";
import { Field, FormError, Honeypot, Success } from "@/components/site/Field";
import { submitTradeApplication } from "@/lib/forms.functions";
import { requestSignInLink, tradeProfileQuery } from "@/lib/trade.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/trade/")({
  staticData: { sitemap: true },
  validateSearch: z.object({ link: z.string().optional().catch(undefined) }),
  head: () => pageHead({ title: "Trade Accounts for Workshops, Dealers & Resellers", description: "Apply for an Auto Global Supply trade account. For workshops, parts retailers, dealers, fleets and exporters who buy automotive parts regularly.", path: "/trade" }),
  component: TradePage,
});

const TYPES = ["Workshop / garage", "Parts retailer", "Parts wholesaler / distributor", "Vehicle dealer", "Fleet operator", "Body shop", "Exporter / importer", "Other"] as const;
const BENEFITS = [
  ["One request, whole parts list", "Send a multi-line list with part numbers or VINs and receive one consolidated quotation."],
  ["Quotation history", "Every request sent while signed in is kept in your trade area with its reference."],
  ["A consistent parts desk", "Repeat requirements are handled with your previous orders and preferences on file."],
  ["Consolidated shipping", "Mixed orders are packed and shipped together where it reduces your freight cost."],
];

function SignIn({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="bg-steel p-6 text-steel-text grid-steel">
      <p className="eyebrow text-signal">Existing trade buyers</p>
      <h2 className="mt-2 text-2xl">Sign in</h2>
      {expired ? <p className="mt-3 border-l-4 border-signal bg-steel-2 px-3 py-2 text-[13.5px]">That sign-in link has expired or was already used. Request a new one below.</p> : null}
      {state === "sent" ? (
        <p className="mt-3 text-[14px] text-steel-muted">If that email belongs to an approved trade account, a sign-in link is on its way. The link works once and expires in one hour.</p>
      ) : (
        <form
          className="mt-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setState("busy");
            setError(null);
            try {
              const res = await requestSignInLink({ data: { email } });
              if (res.ok) setState("sent");
              else { setError(res.error); setState("idle"); }
            } catch {
              setError("Could not send the link. Try again."); setState("idle");
            }
          }}
        >
          <p className="text-[14px] text-steel-muted">No password. Enter your account email and we send a one-time sign-in link.</p>
          <label htmlFor="si-email" className="label mt-4 !text-steel-muted">Account email</label>
          <input id="si-email" type="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          {error ? <p className="mt-2 text-[13px] text-signal">{error}</p> : null}
          <button type="submit" disabled={state === "busy"} className="btn btn-signal mt-4 w-full">{state === "busy" ? "Sending…" : "Email me a sign-in link"}</button>
        </form>
      )}
    </div>
  );
}

function TradePage() {
  const { link } = Route.useSearch();
  const { data: trade } = useQuery(tradeProfileQuery);
  const [form, setForm] = useState({ company: "", contact_name: "", email: "", phone: "", country: "", city: "", business_type: "Workshop / garage" as (typeof TYPES)[number], website: "", monthly_volume: "", brands: "", notes: "", hp: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await submitTradeApplication({ data: form });
      if (res.ok) { setDone(true); window.scrollTo({ top: 0 }); } else setError(res.error);
    } catch {
      setError("We could not send your application. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader crumbs={[{ name: "Trade accounts" }]} eyebrow="Workshops · dealers · fleets · resellers" title="Trade accounts" intro="For businesses that buy automotive parts regularly. Apply once. We review each application and reply by email. Anyone can request a quotation without an account." />
      <div className="wrap py-8 lg:py-12">
        <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(([t, d], i) => (
            <li key={t} className="bg-panel p-5">
              <span className="mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 text-xl">{t}</h3>
              <p className="mt-1.5 text-[13.5px] text-ink-2">{d}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {done ? (
            <Success title="Application received">
              <p>Thank you. We review each application and reply by email. Once approved you receive a sign-in link for the trade area.</p>
              <p>You can request quotations in the meantime without an account.</p>
            </Success>
          ) : (
            <form onSubmit={onSubmit} className="panel relative border-t-4 border-t-signal p-5 sm:p-7">
              <h2 className="text-2xl">Apply for a trade account</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Company name" htmlFor="t-company" required><input id="t-company" className="field" required value={form.company} onChange={set("company")} autoComplete="organization" /></Field>
                <Field label="Business type" htmlFor="t-type" required><select id="t-type" className="field" value={form.business_type} onChange={set("business_type")}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
                <Field label="Contact name" htmlFor="t-name" required><input id="t-name" className="field" required value={form.contact_name} onChange={set("contact_name")} autoComplete="name" /></Field>
                <Field label="Work email" htmlFor="t-email" required><input id="t-email" type="email" className="field" required value={form.email} onChange={set("email")} autoComplete="email" /></Field>
                <Field label="Phone / WhatsApp" htmlFor="t-phone" required><input id="t-phone" type="tel" className="field" required value={form.phone} onChange={set("phone")} autoComplete="tel" /></Field>
                <Field label="Website or social page" htmlFor="t-web"><input id="t-web" className="field" value={form.website} onChange={set("website")} /></Field>
                <Field label="Country" htmlFor="t-country" required><input id="t-country" className="field" required value={form.country} onChange={set("country")} autoComplete="country-name" /></Field>
                <Field label="City" htmlFor="t-city"><input id="t-city" className="field" value={form.city} onChange={set("city")} /></Field>
                <Field label="Typical monthly parts volume" htmlFor="t-vol"><input id="t-vol" className="field" value={form.monthly_volume} onChange={set("monthly_volume")} placeholder="e.g. 10 to 20 orders, or one container" /></Field>
                <Field label="Brands you work on" htmlFor="t-brands"><input id="t-brands" className="field" value={form.brands} onChange={set("brands")} placeholder="e.g. BMW, Mercedes-Benz, Range Rover" /></Field>
                <Field label="Anything else we should know" htmlFor="t-notes" className="sm:col-span-2"><textarea id="t-notes" className="field" value={form.notes} onChange={set("notes")} /></Field>
              </div>
              <Honeypot value={form.hp} onChange={(v) => setForm((f) => ({ ...f, hp: v }))} />
              <div className="mt-4"><FormError message={error} /></div>
              <button type="submit" disabled={busy} className="btn btn-signal btn-lg mt-6">{busy ? "Sending…" : "Submit application"}</button>
            </form>
          )}

          <aside className="space-y-4">
            {trade ? (
              <div className="panel border-l-4 border-l-ok p-6">
                <p className="eyebrow text-muted">Signed in</p>
                <h2 className="mt-2 text-2xl">{trade.company}</h2>
                <Link to="/trade/account" className="btn btn-dark mt-4">Open trade area</Link>
              </div>
            ) : (
              <SignIn expired={link === "expired"} />
            )}
            <div className="panel p-6">
              <h2 className="text-xl">Buying in volume?</h2>
              <p className="mt-2 text-[14px] text-ink-2">Send your full parts list for a consolidated quotation. No account is needed to start.</p>
              <Link to="/wholesale" className="btn btn-line mt-4">Wholesale orders</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
