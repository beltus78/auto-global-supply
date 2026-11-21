import { cn } from "@/lib/utils";

/** Wordmark: hex-nut mark with the company name. `tone` picks colours for dark or light backgrounds. */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <path d="M20 2l15.6 9v18L20 38 4.4 29V11z" className="fill-signal" />
        <circle cx="20" cy="20" r="7.5" className={tone === "dark" ? "fill-steel" : "fill-ink"} />
        <path d="M20 9.5v4M20 26.5v4M10.9 14.75l3.5 2M25.6 23.25l3.5 2M10.9 25.25l3.5-2M25.6 16.75l3.5-2" stroke="currentColor" strokeWidth="2" className="text-signal-ink" />
      </svg>
      <span className="leading-none">
        <span className={cn("block font-display text-[1.35rem] font-bold uppercase tracking-wide", tone === "dark" ? "text-steel-text" : "text-ink")}>Auto Global Supply</span>
        <span className={cn("mono mt-0.5 block text-[9.5px] uppercase tracking-[0.2em]", tone === "dark" ? "text-steel-muted" : "text-muted")}>Wholesale Auto Parts</span>
      </span>
    </span>
  );
}
