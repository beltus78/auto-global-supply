import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/site/PageHeader";
import { signOut, tradeAreaQuery } from "@/lib/trade.functions";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/trade/account")({
  staticData: { sitemap: false },
  loader: async ({ context }) => {
    const data = await context.queryClient.fetchQuery(tradeAreaQuery);
    if (!data) throw redirect({ to: "/trade" });
    return null;
  },
  head: () => pageHead({ title: "Trade Area | Auto Global Supply", description: "Your trade account, quotation requests and part requests.", path: "/trade/account", noindex: true }),
  component: TradeAccountPage,
});

const date = (s: string) => new Date(`${s.replace(" ", "T")}Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
const STATUS: Record<string, string> = { new: "Received", quoted: "Quoted", ordered: "Ordered", closed: "Closed" };

function TradeAccountPage() {
  const { data } = useSuspenseQuery(tradeAreaQuery);
  const router = useRouter();
  const qc = useQueryClient();
  if (!data) return null;
  const { account, quotes, requests } = data;
  return (
    <>
      <PageHeader crumbs={[{ name: "Trade accounts", to: "/trade" }, { name: "Trade area" }]} eyebrow="Approved trade account" title={account.company} intro={`${account.contact_name} · ${account.email} · ${[account.city, account.country].filter(Boolean).join(", ")}`}>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/parts" className="btn btn-signal">Build a quote list</Link>
          <Link to="/request-a-part" className="btn btn-ghost-dark">Send a parts list</Link>
          <button type="button" className="btn btn-ghost-dark" onClick={async () => { await signOut(); qc.clear(); await router.navigate({ to: "/trade" }); }}>Sign out</button>
        </div>
      </PageHeader>
      <div className="wrap grid gap-10 py-10 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl">Quote requests</h2>
          {quotes.length ? (
            <ul className="mt-4 border border-line bg-panel">
              {quotes.map((q) => (
                <li key={q.ref} className="border-b border-line p-4 last:border-b-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="mono text-[12.5px]">{q.ref}</span>
                    <span className="flex items-center gap-2"><span className="tag">{STATUS[q.status] ?? q.status}</span><span className="mono text-[11px] text-muted">{date(q.created_at)}</span></span>
                  </div>
                  <ul className="mt-2 text-[13.5px] text-ink-2">
                    {q.items.slice(0, 6).map((i) => <li key={i.sku}>{i.qty} × {i.name}</li>)}
                    {q.items.length > 6 ? <li className="text-muted">+ {q.items.length - 6} more</li> : null}
                  </ul>
                </li>
              ))}
            </ul>
          ) : <p className="panel mt-4 p-5 text-[14px] text-ink-2">No quote requests yet. Requests you send while signed in appear here.</p>}
        </section>
        <section>
          <h2 className="text-2xl">Part requests</h2>
          {requests.length ? (
            <ul className="mt-4 border border-line bg-panel">
              {requests.map((r) => (
                <li key={r.ref} className="border-b border-line p-4 last:border-b-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="mono text-[12.5px]">{r.ref}</span>
                    <span className="flex items-center gap-2"><span className="tag">{STATUS[r.status] ?? r.status}</span><span className="mono text-[11px] text-muted">{date(r.created_at)}</span></span>
                  </div>
                  <p className="mt-2 text-[13.5px] text-ink-2">{r.quantity} × {r.part_name}</p>
                </li>
              ))}
            </ul>
          ) : <p className="panel mt-4 p-5 text-[14px] text-ink-2">No part requests yet.</p>}
        </section>
      </div>
    </>
  );
}
