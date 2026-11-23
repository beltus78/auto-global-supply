import { useEffect, useState } from "react";
import { PartArt } from "./PartArt";

const RIG = [
  { icon: "dashboard", name: "Dashboard assembly", ref: "INT-DSH", spec: "LHD / RHD · HUD · trim color" },
  { icon: "engine", name: "Complete engine", ref: "ENG-CMP", spec: "Code · index · ancillaries" },
  { icon: "headlight", name: "Matrix LED headlight", ref: "LGT-HDL", spec: "Halogen · LED · matrix · laser" },
  { icon: "seat", name: "Front seat set", ref: "INT-SEA", spec: "Heat · vent · memory · massage" },
  { icon: "strut", name: "Front air strut", ref: "SUS-AIR", spec: "Adaptive damping · side" },
  { icon: "gearbox", name: "Automatic gearbox", ref: "TRN-GBX", spec: "Type plate code · ratio" },
  { icon: "steeringwheel", name: "Steering wheel", ref: "INT-STW", spec: "Paddles · heated rim · trim" },
  { icon: "turbo", name: "Turbocharger", ref: "TRB-TRB", spec: "New · remanufactured · used" },
];

/** Hero showpiece: an inspection bench that draws one part after another. */
export function HeroRig() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % RIG.length), 3400);
    return () => clearInterval(t);
  }, []);
  const part = RIG[i]!;
  return (
    <div className="relative border border-steel-line bg-steel-2">
      <div className="mono flex items-center justify-between border-b border-steel-line px-4 py-2.5 text-[10.5px] uppercase tracking-[0.14em] text-steel-muted">
        <span className="flex items-center gap-2"><span className="pulse-dot h-2 w-2 rounded-full bg-signal" />Parts desk · fitment check</span>
        <span>{String(i + 1).padStart(2, "0")} / {String(RIG.length).padStart(2, "0")}</span>
      </div>
      <div className="relative">
        <PartArt key={part.icon} icon={part.icon} className="aspect-[4/3] w-full sm:aspect-[16/11]" />
        {/* measurement overlay */}
        <svg viewBox="0 0 400 275" className="pointer-events-none absolute inset-0 h-full w-full text-steel-muted/70" fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden="true">
          <path d="M24 250h352M24 244v12M376 244v12" />
          <path d="M376 24v226M370 24h12M370 250h12" />
          <circle cx="200" cy="137" r="4" className="text-signal" stroke="currentColor" />
          <path d="M200 120v-10M200 154v10M183 137h-10M217 137h10" className="text-signal" stroke="currentColor" />
        </svg>
        <span className="mono absolute left-4 top-4 bg-steel/85 px-2 py-1 text-[10.5px] uppercase tracking-[0.12em] text-signal">{part.ref}-••••</span>
      </div>
      <div key={part.name} className="grid gap-1 border-t border-steel-line px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <p data-reveal="wipe" className="is-in font-display text-2xl font-bold uppercase text-steel-text">{part.name}</p>
        <p className="mono text-[11px] uppercase tracking-[0.08em] text-steel-muted">Checks: {part.spec}</p>
      </div>
      <div className="flex h-1">
        {RIG.map((r, n) => <span key={r.icon} className={`flex-1 transition-colors duration-500 ${n === i ? "bg-signal" : n < i ? "bg-steel-3" : "bg-steel"}`} />)}
      </div>
    </div>
  );
}

/** Brand and part-type ticker that runs under the hero. */
export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee border-y border-steel-line bg-steel py-3 text-steel-muted">
      <div>
        {row.map((t, n) => (
          <span key={n} className="flex items-center gap-6 px-3 font-display text-lg font-semibold uppercase tracking-wide">
            {t}<span className="h-1.5 w-1.5 rotate-45 bg-signal" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
