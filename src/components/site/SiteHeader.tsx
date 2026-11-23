import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, ClipboardList, Menu, Phone, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { BUSINESS, whatsappUrl } from "@/lib/business";
import { CATEGORIES, MAKES } from "@/lib/taxonomy";
import { useQuoteBasket } from "@/lib/quote-basket";

const NAV = [
  { to: "/dashboards", label: "Dashboards" },
  { to: "/interior-parts", label: "Interior" },
  { to: "/parts-upgrades", label: "Upgrades" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/shipping", label: "Shipping" },
  { to: "/trade", label: "Trade" },
] as const;

function SearchBox({ onDone, autoFocus }: { onDone?: () => void; autoFocus?: boolean }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      className="flex w-full"
      onSubmit={(e) => {
        e.preventDefault();
        void navigate({ to: "/parts", search: q.trim() ? { q: q.trim() } : {} });
        onDone?.();
      }}
    >
      <label htmlFor={autoFocus ? "site-search-m" : "site-search"} className="sr-only">Search parts</label>
      <input id={autoFocus ? "site-search-m" : "site-search"} autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Part name, part number, engine code or model" className="h-11 w-full min-w-0 rounded-l-[2px] border border-r-0 border-steel-line bg-steel-2 px-3 text-[15px] text-steel-text placeholder:text-steel-muted focus:border-signal focus:outline-none" />
      <button type="submit" className="btn btn-signal rounded-l-none" aria-label="Search"><Search className="h-4 w-4" /><span className="hidden sm:inline">Search</span></button>
    </form>
  );
}

export function SiteHeader() {
  const { count } = useQuoteBasket();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header data-site-header className="sticky top-0 z-50 bg-steel text-steel-text">
      <div className="hidden border-b border-steel-line lg:block">
        <div className="wrap mono flex h-9 items-center justify-between text-[11px] uppercase tracking-[0.1em] text-steel-muted">
          <span>Worldwide parts supply · Quote before purchase · VIN-checked fitment</span>
          <span className="flex items-center gap-5">
            <a href={BUSINESS.usPhoneHref} className="flex items-center gap-1.5 hover:text-signal"><Phone className="h-3 w-3" /> US {BUSINESS.usPhone}</a>
            <a href={BUSINESS.internationalPhoneHref} className="hover:text-signal">Intl {BUSINESS.internationalPhone}</a>
            <a href={`mailto:${BUSINESS.email}`} className="hover:text-signal">{BUSINESS.email}</a>
          </span>
        </div>
      </div>

      <div className="header-main wrap flex h-16 items-center gap-4 lg:h-[4.5rem] lg:gap-8">
        <Link to="/" aria-label="Auto Global Supply home" className="shrink-0"><Logo /></Link>
        <div className="hidden flex-1 lg:block"><SearchBox /></div>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/quote" className="btn btn-ghost-dark relative max-lg:px-3" aria-label={`Quote list, ${count} items`}>
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Quote list</span>
            <span className="mono flex h-5 min-w-5 items-center justify-center bg-signal px-1 text-[11px] font-medium text-signal-ink">{count}</span>
          </Link>
          <Link to="/request-a-part" className="btn btn-signal hidden lg:inline-flex">Request a quote</Link>
          <button type="button" className="btn btn-ghost-dark px-3 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
        </div>
      </div>

      <nav aria-label="Main" className="hidden border-t border-steel-line bg-steel-2 lg:block" onMouseLeave={() => setMega(false)}>
        <div className="wrap relative flex h-11 items-center gap-1 font-display text-[1.02rem] font-semibold uppercase tracking-wide">
          <button type="button" className="flex h-full items-center gap-1.5 bg-signal px-4 text-signal-ink" onMouseEnter={() => setMega(true)} onClick={() => setMega((v) => !v)} aria-expanded={mega}>
            <Menu className="h-4 w-4" /> All parts <ChevronDown className="h-4 w-4" />
          </button>
          <Link to="/parts" className="flex h-full items-center px-3 hover:text-signal" activeOptions={{ exact: true }} activeProps={{ className: "text-signal" }}>Catalogue</Link>
          <Link to="/brands" className="flex h-full items-center px-3 hover:text-signal" activeProps={{ className: "text-signal" }}>Brands</Link>
          {NAV.map((n) => <Link key={n.to} to={n.to} className="flex h-full items-center px-3 hover:text-signal" activeProps={{ className: "text-signal" }}>{n.label}</Link>)}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="ml-auto flex h-full items-center px-3 text-steel-muted hover:text-signal">WhatsApp enquiry</a>

          {mega ? (
            <div className="absolute left-4 right-4 top-full z-50 grid grid-cols-[1.5fr_1fr] gap-8 border border-t-0 border-line bg-panel p-6 font-sans text-[14px] font-normal normal-case tracking-normal text-ink shadow-2xl sm:left-6 sm:right-6">
              <div>
                <p className="eyebrow text-muted">Shop by category</p>
                <ul className="mt-3 grid grid-cols-2 gap-x-6">
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}><Link to="/category/$slug" params={{ slug: c.slug }} onClick={() => setMega(false)} className="flex items-center justify-between border-b border-line py-2 hover:text-ink hover:underline"><span className="font-medium">{c.name}</span><span className="mono text-[11px] text-muted">{c.count.toLocaleString("en-US")}</span></Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-muted">Shop by brand</p>
                <ul className="mt-3 grid grid-cols-2 gap-x-6">
                  {MAKES.filter((m) => m.premium).slice(0, 14).map((m) => (
                    <li key={m.slug}><Link to="/brands/$slug" params={{ slug: m.slug }} onClick={() => setMega(false)} className="block border-b border-line py-2 font-medium hover:underline">{m.name}</Link></li>
                  ))}
                </ul>
                <Link to="/brands" onClick={() => setMega(false)} className="mono mt-3 inline-block text-[11px] uppercase tracking-[0.1em] underline decoration-signal-deep underline-offset-4">All {MAKES.length} brands</Link>
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      <div className="border-t border-steel-line px-4 py-2.5 lg:hidden"><SearchBox /></div>

      {open ? (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-steel lg:hidden">
          <div className="wrap flex h-16 items-center justify-between">
            <Logo />
            <button type="button" className="btn btn-ghost-dark px-3" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
          </div>
          <div className="wrap pb-10">
            <ul className="font-display text-2xl font-semibold uppercase">
              {[{ to: "/parts", label: "Parts catalog" }, { to: "/brands", label: "Brands" }, { to: "/request-a-part", label: "Request a part" }, ...NAV, { to: "/wholesale", label: "Wholesale orders" }, { to: "/about", label: "About" }, { to: "/contact", label: "Contact" }].map((n) => (
                <li key={n.to} className="border-b border-steel-line"><Link to={n.to} onClick={() => setOpen(false)} className="block py-3.5">{n.label}</Link></li>
              ))}
            </ul>
            <p className="eyebrow mt-8 text-steel-muted">Categories</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 text-[14px]">
              {CATEGORIES.map((c) => <li key={c.slug}><Link to="/category/$slug" params={{ slug: c.slug }} onClick={() => setOpen(false)} className="block border-b border-steel-line py-2.5 text-steel-muted">{c.name}</Link></li>)}
            </ul>
            <div className="mt-8 grid gap-2 text-[14px] text-steel-muted">
              <a href={BUSINESS.usPhoneHref}>US {BUSINESS.usPhone}</a>
              <a href={BUSINESS.internationalPhoneHref}>International {BUSINESS.internationalPhone}</a>
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
