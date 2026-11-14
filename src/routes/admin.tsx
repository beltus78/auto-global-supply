import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminDecideTrade, adminLoad, adminSetStatus } from "@/lib/admin.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  staticData: { sitemap: false },
  head: () => pageHead({ title: "Admin | Auto Global Supply", description: "Site administration.", path: "/admin", noindex: true }),
  component: AdminPage,
});

type Row = Record<string, string | number | null>;
type Data = { quotes: Row[]; requests: Row[]; accounts: Row[]; messages: Row[] };
const STATUSES = ["new", "quoted", "ordered", "closed"] as const;
const KEY = "ags-admin-key";

function AdminPage() {
  const [key, setKey] = useState("");
  useEffect(() => { try { setKey(sessionStorage.getItem(KEY) ?? ""); } catch { /* ignore */ } }, []);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"quotes" | "requests" | "accounts" | "messages">("quotes");
  const [links, setLinks] = useState<Record<string, string>>({});

  async function load(k = key) {
    setBusy(true);
    setError(null);
    try {
      const res = await adminLoad({ data: { key: k } });
      if (res.ok) {
        setData(res);
        try { sessionStorage.setItem(KEY, k); } catch { /* ignore */ }
      } else setError(res.error);
    } catch {
      setError("Could not load. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!data) {
    return (
      <div className="wrap flex min-h-[60vh] items-center justify-center py-16">
        <form className="panel w-full max-w-sm border-t-4 border-t-signal p-6" onSubmit={(e) => { e.preventDefault(); void load(); }}>
          <h1 className="text-3xl">Admin</h1>
          <label htmlFor="a-key" className="label mt-5">Admin key</label>
          <input id="a-key" type="password" className="field" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="current-password" />
          {error ? <p className="mt-3 text-[13px] text-danger">{error}</p> : null}
          <button type="submit" disabled={busy || !key} className="btn btn-dark mt-4 w-full">{busy ? "Checking…" : "Open"}</button>
        </form>
      </div>
    );
  }

  const tabs = [["quotes", `Quotes (${data.quotes.length})`], ["requests", `Part requests (${data.requests.length})`], ["accounts", `Trade accounts (${data.accounts.filter((a) => a.status === "pending").length} pending)`], ["messages", `Messages (${data.messages.length})`]] as const;
  const setStatus = async (table: "quotes" | "part_requests", id: string, status: string) => { await adminSetStatus({ data: { key, table, id, status: status as (typeof STATUSES)[number] } }); void load(); };
  const decide = async (id: string, approve: boolean) => {
    const res = await adminDecideTrade({ data: { key, id, approve } });
    if (res.ok && res.link) setLinks((l) => ({ ...l, [id]: `${res.link}${res.emailed ? "" : "  (email not sent: send this link yourself)"}` }));
    if (!res.ok) setError(res.error);
    void load();
  };
  const Info = ({ r, fields }: { r: Row; fields: [string, string][] }) => (
    <dl className="mt-2 grid gap-x-6 gap-y-1 text-[13px] sm:grid-cols-2">
      {fields.filter(([k]) => r[k] != null && r[k] !== "").map(([k, label]) => <div key={k} className="flex gap-2"><dt className="shrink-0 text-muted">{label}</dt><dd className="break-words">{String(r[k])}</dd></div>)}
    </dl>
  );
  const StatusSelect = ({ table, r }: { table: "quotes" | "part_requests"; r: Row }) => (
    <select className="field h-8 w-auto py-0 text-[13px]" value={String(r.status)} onChange={(e) => void setStatus(table, String(r.id), e.target.value)} aria-label="Status">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
  );

  return (
    <div className="wrap py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl">Admin</h1>
        <div className="flex gap-2">
          <button className="btn btn-line btn-sm" onClick={() => void load()}>{busy ? "Loading…" : "Refresh"}</button>
          <button className="btn btn-line btn-sm" onClick={() => { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } setData(null); setKey(""); }}>Lock</button>
        </div>
      </div>
      {error ? <p className="mt-3 text-[13px] text-danger">{error}</p> : null}
      <div className="mt-5 flex flex-wrap gap-1 border-b border-line-strong">
        {tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 font-display text-lg font-semibold uppercase ${tab === id ? "bg-steel text-steel-text" : "hover:bg-panel"}`}>{label}</button>)}
      </div>

      <div className="mt-5 space-y-3">
        {tab === "quotes" && data.quotes.map((q) => {
          let items: { name: string; sku: string; qty: number; note?: string | null }[] = [];
          try { items = JSON.parse(String(q.items)); } catch { /* ignore */ }
          return (
            <article key={String(q.id)} className="panel p-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><p className="mono text-[13px]">{String(q.ref)} · {String(q.created_at)} UTC</p><StatusSelect table="quotes" r={q} /></div>
              <p className="mt-1 font-semibold">{String(q.name)} <span className="font-normal text-muted">· {String(q.buyer_type ?? "")}{q.trade_company ? ` · Trade: ${String(q.trade_company)}` : ""}</span></p>
              <Info r={q} fields={[["email", "Email"], ["phone", "Phone"], ["company", "Company"], ["country", "Country"], ["destination", "Ship to"], ["notes", "Notes"]]} />
              <ul className="mt-3 border-t border-line pt-2 text-[13.5px]">{items.map((i) => <li key={i.sku}>{i.qty} × {i.name} <span className="mono text-[11px] text-muted">{i.sku}</span>{i.note ? <span className="text-muted"> — {i.note}</span> : null}</li>)}</ul>
            </article>
          );
        })}
        {tab === "requests" && data.requests.map((r) => (
          <article key={String(r.id)} className="panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><p className="mono text-[13px]">{String(r.ref)} · {String(r.created_at)} UTC</p><StatusSelect table="part_requests" r={r} /></div>
            <p className="mt-1 font-semibold">{String(r.quantity)} × {String(r.part_name)}</p>
            <Info r={r} fields={[["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["country", "Country"], ["make", "Make"], ["model", "Model"], ["year", "Year"], ["vin", "VIN"], ["engine", "Engine"], ["oem", "Part no."], ["condition", "Condition"], ["notes", "Notes"]]} />
          </article>
        ))}
        {tab === "accounts" && data.accounts.map((a) => (
          <article key={String(a.id)} className="panel p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{String(a.company)} <span className="tag ml-2">{String(a.status)}</span></p>
              <div className="flex gap-2">
                {a.status !== "approved" ? <button className="btn btn-signal btn-sm" onClick={() => void decide(String(a.id), true)}>Approve</button> : <button className="btn btn-line btn-sm" onClick={() => void decide(String(a.id), true)}>New sign-in link</button>}
                {a.status !== "rejected" ? <button className="btn btn-line btn-sm" onClick={() => void decide(String(a.id), false)}>{a.status === "approved" ? "Revoke" : "Reject"}</button> : null}
              </div>
            </div>
            <Info r={a} fields={[["contact_name", "Contact"], ["email", "Email"], ["phone", "Phone"], ["business_type", "Type"], ["country", "Country"], ["city", "City"], ["website", "Website"], ["monthly_volume", "Volume"], ["brands", "Brands"], ["notes", "Notes"], ["created_at", "Applied"]]} />
            {links[String(a.id)] ? <p className="mono mt-3 break-all border border-line-strong bg-paper p-2 text-[12px]">Sign-in link (valid 7 days, one use): {links[String(a.id)]}</p> : null}
          </article>
        ))}
        {tab === "messages" && data.messages.map((m) => (
          <article key={String(m.id)} className="panel p-4">
            <p className="mono text-[13px]">{String(m.created_at)} UTC</p>
            <p className="mt-1 font-semibold">{String(m.subject || "Message")} <span className="font-normal text-muted">· {String(m.name)}</span></p>
            <Info r={m} fields={[["email", "Email"], ["phone", "Phone"]]} />
            <p className="mt-2 whitespace-pre-wrap text-[14px]">{String(m.body)}</p>
          </article>
        ))}
        {data[tab].length === 0 ? <p className="panel p-5 text-ink-2">Nothing here yet.</p> : null}
      </div>
    </div>
  );
}
