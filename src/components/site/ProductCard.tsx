import { Link } from "@tanstack/react-router";
import { Check, Plus } from "lucide-react";
import { PartArt } from "./PartArt";
import { useQuoteBasket } from "@/lib/quote-basket";
import { categoryBy, conditions, fitmentLine, partTypeBy, type ProductRow } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

export function ProductImage({ p, className }: { p: ProductRow; className?: string }) {
  const pt = partTypeBy.get(p.ptype);
  if (p.image) {
    const src = /^https?:\/\//.test(p.image) || p.image.startsWith("/") ? p.image : `/media/${p.image}`;
    return <img src={src} alt={p.name} loading="lazy" className={cn("bg-panel object-cover", className)} />;
  }
  return <PartArt icon={pt?.i ?? "ecu"} className={className} />;
}

export function AddToQuote({ p, size = "sm", className }: { p: ProductRow; size?: "sm" | "lg"; className?: string }) {
  const basket = useQuoteBasket();
  const added = basket.has(p.slug);
  return (
    <button type="button" onClick={() => basket.add({ slug: p.slug, sku: p.sku, name: p.name })} className={cn("btn", size === "sm" ? "btn-sm" : "btn-lg", added ? "btn-dark" : "btn-signal", className)} aria-label={`Add ${p.name} to quote list`}>
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {added ? "In quote list" : "Add to quote"}
    </button>
  );
}

/** Grid card. */
export function ProductCard({ p }: { p: ProductRow }) {
  const pt = partTypeBy.get(p.ptype);
  return (
    <article data-reveal className="panel bracket group flex flex-col transition-colors hover:border-ink">
      <Link to="/part/$slug" params={{ slug: p.slug }} className="block">
        <ProductImage p={p} className="aspect-[4/3] w-full" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="mono flex items-center justify-between gap-2 text-[10.5px] uppercase tracking-[0.08em] text-muted">
          <span>{categoryBy.get(p.cat)?.name}</span>
          <span>{p.sku}</span>
        </div>
        <h3 className="mt-2 text-[1.15rem] leading-tight">
          <Link to="/part/$slug" params={{ slug: p.slug }} className="hover:underline decoration-signal-deep decoration-2 underline-offset-4">{p.name}</Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] text-muted">{fitmentLine(p)}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {conditions(pt).map((c) => <span key={c} className="tag">{c}</span>)}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="mono text-[11px] uppercase tracking-[0.08em] text-ink-2">Price on quote</span>
          <AddToQuote p={p} />
        </div>
      </div>
    </article>
  );
}

/** Dense catalog row for the trade list view. */
export function ProductRowItem({ p }: { p: ProductRow }) {
  const pt = partTypeBy.get(p.ptype);
  return (
    <article className="flex items-center gap-3 border-b border-line bg-panel px-3 py-3 last:border-b-0 hover:bg-paper sm:gap-4 sm:px-4">
      <Link to="/part/$slug" params={{ slug: p.slug }} className="hidden shrink-0 sm:block">
        <ProductImage p={p} className="h-16 w-[5.4rem]" />
      </Link>
      <div className="min-w-0 flex-1">
        <h3 className="font-sans text-[15px] font-semibold normal-case leading-snug tracking-normal">
          <Link to="/part/$slug" params={{ slug: p.slug }} className="hover:underline decoration-signal-deep decoration-2 underline-offset-4">{p.name}</Link>
        </h3>
        <p className="mt-0.5 truncate text-[13px] text-muted">{fitmentLine(p)}</p>
        <p className="mono mt-1 flex flex-wrap gap-x-3 text-[10.5px] uppercase tracking-[0.06em] text-ink-2">
          <span>{p.sku}</span>
          <span className="text-muted">{conditions(pt).join(" / ")}</span>
        </p>
      </div>
      <AddToQuote p={p} className="shrink-0 max-sm:px-2.5 max-sm:[&]:text-[0px] max-sm:[&_svg]:h-5 max-sm:[&_svg]:w-5" />
    </article>
  );
}
