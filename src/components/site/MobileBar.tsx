import { Link } from "@tanstack/react-router";
import { ClipboardList, Home, LayoutGrid, MessageSquareText, Phone } from "lucide-react";
import { useQuoteBasket } from "@/lib/quote-basket";

const item = "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] uppercase tracking-[0.08em] text-steel-muted";
const active = { className: "!text-signal" };

/** Fixed bottom navigation on phones. */
export function MobileBar() {
  const { count } = useQuoteBasket();
  return (
    <nav aria-label="Quick links" className="mono fixed inset-x-0 bottom-0 z-40 flex h-14 border-t border-steel-line bg-steel lg:hidden">
      <Link to="/" className={item} activeOptions={{ exact: true }} activeProps={active}><Home className="h-5 w-5" />Home</Link>
      <Link to="/parts" className={item} activeProps={active}><LayoutGrid className="h-5 w-5" />Parts</Link>
      <Link to="/request-a-part" className={item} activeProps={active}><MessageSquareText className="h-5 w-5" />Request</Link>
      <Link to="/quote" className={item} activeProps={active}><span className="relative"><ClipboardList className="h-5 w-5" />{count ? <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center bg-signal px-0.5 text-[10px] text-signal-ink">{count}</span> : null}</span>Quote</Link>
      <Link to="/contact" className={item} activeProps={active}><Phone className="h-5 w-5" />Contact</Link>
    </nav>
  );
}
