import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Technical line illustrations, one per part family. Drawn on a 120 x 90 grid.
 * .a = accent stroke, .t = thin detail stroke.
 */
const ART: Record<string, ReactNode> = {
  engine: (<><rect x="32" y="38" width="58" height="32" rx="2" /><rect x="36" y="25" width="50" height="13" rx="2" /><path d="M42 25v-6h7v6M57 25v-6h7v6M72 25v-6h7v6" className="a" /><circle cx="25" cy="55" r="9" /><circle cx="25" cy="55" r="3" /><path d="M90 44h9l3 4v14l-3 4h-9M38 70v6h46v-6" /><path d="M40 47h42M40 54h42M40 61h42" className="t" /></>),
  "cylinder-head": (<><path d="M18 34h84v22H18z" /><path d="M22 34v-8h76v8" /><circle cx="33" cy="45" r="6" /><circle cx="51" cy="45" r="6" /><circle cx="69" cy="45" r="6" /><circle cx="87" cy="45" r="6" /><path d="M28 26v-5M46 26v-5M64 26v-5M82 26v-5M92 26v-5" className="a" /><path d="M18 62h84" className="t" /><path d="M24 56v6M96 56v6" /></>),
  crankshaft: (<><path d="M10 45h14M96 45h14" /><path d="M24 30h8v30h-8zM40 38h8v30h-8zM56 22h8v30h-8zM72 38h8v30h-8zM88 30h8v30h-8z" /><path d="M32 36h8M48 60h8M64 30h8M80 52h8" className="a" /><circle cx="12" cy="45" r="5" className="t" /></>),
  piston: (<><path d="M38 14h44v30H38z" /><path d="M38 21h44M38 27h44M38 33h44" className="a" /><circle cx="60" cy="42" r="5" /><path d="M54 46l-3 26M66 46l3 26" /><circle cx="60" cy="74" r="9" /><circle cx="60" cy="74" r="4" className="t" /></>),
  timing: (<><circle cx="38" cy="28" r="12" /><circle cx="82" cy="28" r="12" /><circle cx="60" cy="68" r="9" /><circle cx="38" cy="28" r="3" className="t" /><circle cx="82" cy="28" r="3" className="t" /><circle cx="60" cy="68" r="3" className="t" /><path d="M27 33l25 40M93 33L68 73M40 16h40" className="a" strokeDasharray="3 2.5" /></>),
  gasket: (<><path d="M12 28h96v34H12z" /><circle cx="30" cy="45" r="10" /><circle cx="50" cy="45" r="10" /><circle cx="70" cy="45" r="10" /><circle cx="90" cy="45" r="10" /><circle cx="18" cy="33" r="1.5" className="a" /><circle cx="18" cy="57" r="1.5" className="a" /><circle cx="102" cy="33" r="1.5" className="a" /><circle cx="102" cy="57" r="1.5" className="a" /><circle cx="40" cy="32" r="1.5" className="a" /><circle cx="60" cy="32" r="1.5" className="a" /><circle cx="80" cy="32" r="1.5" className="a" /><circle cx="40" cy="58" r="1.5" className="a" /><circle cx="60" cy="58" r="1.5" className="a" /><circle cx="80" cy="58" r="1.5" className="a" /></>),
  pump: (<><circle cx="52" cy="46" r="22" /><circle cx="52" cy="46" r="8" /><path d="M52 24v-8M52 76v-8M30 46h-8M82 46h-8" className="t" /><path d="M72 36h22v20H72" /><path d="M94 40h8v12h-8" className="a" /><path d="M46 46a6 6 0 0 1 12 0" className="a" /></>),
  mount: (<><path d="M30 66h60v8H30z" /><path d="M40 66l6-26h28l6 26" /><path d="M46 40h28v-8H46z" className="a" /><path d="M60 32V16M52 16h16" /><path d="M46 52h28" className="t" /></>),
  ecu: (<><rect x="24" y="22" width="72" height="42" rx="3" /><path d="M34 64v9M44 64v9M54 64v9M64 64v9M74 64v9M84 64v9" className="a" /><rect x="46" y="33" width="28" height="20" rx="1.5" /><path d="M50 38h20M50 43h20M50 48h12" className="t" /><circle cx="31" cy="29" r="1.6" /><circle cx="89" cy="29" r="1.6" /></>),
  wiring: (<><path d="M14 30c24 0 20 30 46 30s22-30 46-30" /><path d="M14 40c24 0 20 26 46 26" className="t" /><path d="M60 60v14M60 44V30" /><rect x="6" y="24" width="10" height="22" rx="1.5" className="a" /><rect x="104" y="22" width="10" height="16" rx="1.5" className="a" /><rect x="54" y="74" width="12" height="8" rx="1.5" className="a" /><rect x="54" y="20" width="12" height="10" rx="1.5" /></>),
  turbo: (<><circle cx="44" cy="48" r="24" /><circle cx="44" cy="48" r="9" /><path d="M44 24h26v14" /><circle cx="86" cy="52" r="17" /><circle cx="86" cy="52" r="6" className="t" /><path d="M68 48h4" /><path d="M39 48a5 5 0 0 1 10 0M44 43v10" className="a" /><path d="M86 69v9h14" /></>),
  radiator: (<><rect x="26" y="18" width="68" height="54" rx="2" /><path d="M26 26h68M26 64h68" /><path d="M34 26v38M42 26v38M50 26v38M58 26v38M66 26v38M74 26v38M82 26v38" className="t" /><path d="M94 30h9M17 60h9" className="a" /><path d="M56 18v-5h8v5" /></>),
  manifold: (<><rect x="18" y="20" width="84" height="18" rx="9" /><path d="M30 38v26M38 38v26M50 38v26M58 38v26M70 38v26M78 38v26M90 38v26M98 38v26" /><path d="M26 64h16M46 64h16M66 64h16M86 64h16" className="a" /><path d="M8 29h10" /></>),
  throttle: (<><circle cx="52" cy="45" r="26" /><circle cx="52" cy="45" r="18" /><path d="M39 33l26 24" className="a" /><circle cx="52" cy="45" r="2.5" /><rect x="78" y="32" width="26" height="26" rx="2" /><path d="M84 40h14M84 46h14M84 52h8" className="t" /></>),
  injector: (<><path d="M52 12h16v14H52z" /><path d="M68 16h14v8H68" className="a" /><path d="M54 26h12v22H54z" /><path d="M56 48h8l-1 18h-6z" /><path d="M60 66v12" className="a" /><path d="M50 34h20M50 40h20" className="t" /></>),
  exhaust: (<><rect x="36" y="30" width="50" height="26" rx="13" /><path d="M6 43h30M86 38h16M86 48h16" /><path d="M102 34h10v8h-10zM102 44h10v8h-10z" className="a" /><path d="M48 36v14M58 36v14M68 36v14" className="t" /><path d="M14 43v-8M22 43v-8" /></>),
  alternator: (<><circle cx="56" cy="46" r="26" /><circle cx="56" cy="46" r="15" className="t" /><circle cx="56" cy="46" r="6" /><path d="M56 20v8M56 64v8M30 46h8M74 46h8M38 28l5 5M69 59l5 5M74 28l-5 5M43 59l-5 5" className="a" /><path d="M82 40h14v12H82" /><path d="M40 70l-8 10M72 70l8 10" /></>),
  gearbox: (<><path d="M14 26l18-6v50l-18-6z" /><path d="M32 24h34l22 8v26l-22 8H32z" /><path d="M88 38h12v14H88" /><circle cx="104" cy="45" r="5" className="a" /><path d="M36 66v8h30v-8" className="a" /><path d="M42 30v30M54 30v30M66 30v30" className="t" /></>),
  differential: (<><circle cx="60" cy="46" r="20" /><circle cx="60" cy="46" r="9" /><path d="M8 42h32v8H8zM80 42h32v8H80z" /><path d="M54 26v-12h12v12" className="a" /><path d="M52 14h16" /><path d="M48 34l-4-4M72 34l4-4M48 58l-4 4M72 58l4 4" className="t" /></>),
  driveshaft: (<><path d="M30 42h60v6H30z" /><path d="M14 36l16 4v10l-16 4zM106 36l-16 4v10l16 4z" /><path d="M18 37v16M22 38v14M26 39v12M102 37v16M98 38v14M94 39v12" className="t" /><path d="M4 42h10v6H4zM106 42h10v6h-10z" className="a" /></>),
  motor: (<><rect x="26" y="22" width="52" height="46" rx="8" /><path d="M36 22v46M46 22v46M56 22v46M66 22v46" className="t" /><path d="M78 34h16v22H78" /><circle cx="100" cy="45" r="6" className="a" /><path d="M14 38h12M14 52h12" /><path d="M34 16h36" className="a" /></>),
  strut: (<><path d="M46 10h28M50 10v6h20v-6" /><rect x="47" y="16" width="26" height="26" rx="6" /><path d="M47 24h26M47 32h26" className="a" /><path d="M54 42h12v26H54z" /><path d="M60 68v6" /><circle cx="60" cy="79" r="5" /><path d="M60 16V6" className="t" /></>),
  airspring: (<><path d="M44 16h32" /><path d="M46 16c-6 8-6 14 0 20c-6 8-6 14 0 20h28c6-6 6-12 0-20c6-6 6-12 0-20z" /><path d="M44 36h32" className="a" /><path d="M50 56v10h20V56M44 70h32" /><path d="M60 16v-8h10" className="t" /></>),
  compressor: (<><rect x="18" y="34" width="46" height="26" rx="13" /><rect x="64" y="28" width="24" height="38" rx="2" /><path d="M70 28v-8h12v8" /><path d="M88 40h8c8 0 8 12 0 12s-8 12 0 12h10" className="a" /><path d="M30 34v26M42 34v26M54 34v26" className="t" /><path d="M24 60v8M58 60v8M18 68h46" /></>),
  controlarm: (<><path d="M18 24l74 18-74 28" /><path d="M30 31l44 12-44 18" className="t" /><circle cx="18" cy="24" r="7" /><circle cx="18" cy="70" r="7" /><circle cx="96" cy="43" r="8" className="a" /><circle cx="96" cy="43" r="3" /></>),
  subframe: (<><path d="M14 22h92l-8 18H22z" /><path d="M22 40v24h76V40" /><path d="M36 40v24M84 40v24M36 52h48" className="t" /><circle cx="18" cy="22" r="5" className="a" /><circle cx="102" cy="22" r="5" className="a" /><circle cx="24" cy="66" r="5" className="a" /><circle cx="96" cy="66" r="5" className="a" /></>),
  rack: (<><path d="M30 42h60v8H30z" /><path d="M30 40l-4 3 4 3-4 3 4 3M90 40l4 3-4 3 4 3-4 3" /><path d="M26 46H10M94 46h16" /><circle cx="8" cy="46" r="4" className="a" /><circle cx="112" cy="46" r="4" className="a" /><path d="M62 42V26l8-8" /><rect x="54" y="50" width="20" height="16" rx="2" className="a" /></>),
  hub: (<><circle cx="60" cy="45" r="30" /><circle cx="60" cy="45" r="12" /><circle cx="60" cy="45" r="5" className="t" /><circle cx="60" cy="24" r="3" className="a" /><circle cx="80" cy="38" r="3" className="a" /><circle cx="72" cy="62" r="3" className="a" /><circle cx="48" cy="62" r="3" className="a" /><circle cx="40" cy="38" r="3" className="a" /></>),
  disc: (<><circle cx="56" cy="45" r="32" /><circle cx="56" cy="45" r="13" /><circle cx="56" cy="45" r="4" className="t" /><path d="M56 16v10M56 64v10M27 45h10M75 45h10M36 25l7 7M69 58l7 7M76 25l-7 7M43 58l-7 7" className="t" /><path d="M82 22c12 12 12 34 0 46l10 4c10-16 10-38 0-54z" className="a" /></>),
  caliper: (<><path d="M24 26h72c6 0 10 4 10 10v18c0 6-4 10-10 10H24c-6 0-10-4-10-10V36c0-6 4-10 10-10z" /><circle cx="36" cy="45" r="9" /><circle cx="60" cy="45" r="9" /><circle cx="84" cy="45" r="9" /><path d="M30 26v-6h60v6" className="a" /><path d="M24 64v6M96 64v6" /></>),
  pads: (<><path d="M20 24h34v42H20z" /><path d="M26 30h22v30H26z" className="t" /><path d="M66 24h34v42H66z" /><path d="M72 30h22v30H72z" className="t" /><path d="M37 30v30M83 30v30" className="a" /><path d="M20 20h34M66 20h34" /></>),
  bumper: (<><path d="M10 34c20-8 80-8 100 0v20c-6 10-18 14-30 14H40c-12 0-24-4-30-14z" /><path d="M36 52h48v10H36z" /><path d="M42 52v10M52 52v10M62 52v10M72 52v10" className="t" /><path d="M16 46h14l-4 8h-8zM104 46H90l4 8h8z" className="a" /><path d="M10 34c20 6 80 6 100 0" className="t" /></>),
  bonnet: (<><path d="M24 70l10-48h52l10 48z" /><path d="M46 22l-6 48M74 22l6 48" className="t" /><path d="M56 22v10M64 22v10" className="a" /><path d="M24 70c20-6 52-6 72 0" /></>),
  fender: (<><path d="M12 62V40c10-16 40-22 96-22v32H84a22 22 0 0 0-44 0v12z" /><path d="M40 62a22 22 0 0 1 44 0" className="a" /><path d="M20 42c14-10 40-14 80-14" className="t" /></>),
  grille: (<><path d="M14 30c0-6 4-10 10-10h72c6 0 10 4 10 10v22c0 10-8 18-18 18H32c-10 0-18-8-18-18z" /><path d="M22 34h76M22 44h76M26 54h68M36 64h48" className="t" /><circle cx="60" cy="44" r="9" className="a" /></>),
  door: (<><path d="M24 78V40l16-26h48a8 8 0 0 1 8 8v56z" /><path d="M32 42l12-20h40a4 4 0 0 1 4 4v16z" /><path d="M70 54h16" className="a" /><path d="M24 62h72" className="t" /></>),
  tailgate: (<><path d="M18 74V28c0-8 6-14 14-14h56c8 0 14 6 14 14v46z" /><path d="M28 24h64v22H28z" /><path d="M44 58h32v8H44z" className="a" /><path d="M18 52h84" className="t" /></>),
  mirror: (<><path d="M34 22h46c10 0 18 8 18 18v6c0 10-8 18-18 18H46c-10 0-18-8-18-18v-4z" /><path d="M42 30h36c6 0 10 4 10 10v4c0 6-4 10-10 10H48c-6 0-10-4-10-10z" className="t" /><path d="M28 50l-16 8v10h16" /><path d="M80 36l6 6" className="a" /></>),
  panel: (<><rect x="16" y="22" width="88" height="46" rx="6" /><rect x="24" y="30" width="72" height="30" rx="3" className="t" /><path d="M60 30v30" className="a" /><path d="M32 54l12-18M70 54l12-18" className="t" /></>),
  headlight: (<><path d="M10 54c4-20 24-32 60-32h34c4 0 6 4 4 8L96 58c-2 4-6 6-10 6H18c-6 0-10-4-8-10z" /><circle cx="46" cy="44" r="10" /><circle cx="72" cy="44" r="8" /><circle cx="46" cy="44" r="4" className="t" /><path d="M20 58h62l8-8" className="a" /></>),
  taillight: (<><path d="M12 30h70c14 0 26 8 26 22v6c0 4-4 6-8 6H26c-8 0-14-6-14-14z" /><path d="M22 40h60c8 0 14 4 16 10" className="a" /><path d="M22 48h56M26 56h60" className="t" /></>),
  foglight: (<><rect x="22" y="26" width="76" height="38" rx="19" /><circle cx="46" cy="45" r="11" /><circle cx="46" cy="45" r="4" className="t" /><path d="M66 38h20M66 45h20M66 52h20" className="a" /></>),
  fan: (<><rect x="20" y="12" width="80" height="66" rx="3" /><circle cx="60" cy="45" r="27" /><circle cx="60" cy="45" r="6" className="a" /><path d="M60 39c-4-10 2-18 10-18c2 8-2 14-10 18zM66 45c10-4 18 2 18 10c-8 2-14-2-18-10zM60 51c4 10-2 18-10 18c-2-8 2-14 10-18zM54 45c-10 4-18-2-18-10c8-2 14 2 18 10z" /></>),
  tank: (<><path d="M22 30h50l8-10h18a6 6 0 0 1 6 6v36a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z" /><path d="M40 30v-8h14v8" className="a" /><path d="M14 52h90" className="t" /><path d="M30 58c6-4 10 4 16 0s10 4 16 0" className="t" /></>),
  cluster: (<><path d="M10 62c0-24 20-42 50-42s50 18 50 42v6H10z" /><circle cx="38" cy="50" r="15" /><circle cx="82" cy="50" r="15" /><path d="M38 50l8-10M82 50l-6-11" className="a" /><rect x="54" y="42" width="12" height="16" rx="1" className="t" /></>),
  screen: (<><rect x="12" y="20" width="96" height="46" rx="3" /><rect x="18" y="26" width="84" height="34" rx="1" className="t" /><path d="M24 34h30v18H24z" className="a" /><path d="M62 34h34M62 42h34M62 50h20" className="t" /><path d="M48 66l-4 10h32l-4-10" /></>),
  sensor: (<><rect x="26" y="22" width="68" height="46" rx="6" /><circle cx="60" cy="45" r="15" /><circle cx="60" cy="45" r="7" className="a" /><path d="M94 38h10v14H94" /><circle cx="34" cy="30" r="2" className="t" /><path d="M56 41l3 3" className="t" /></>),
  regulator: (<><path d="M30 12l60 66M90 12L30 78" /><path d="M24 12h72M24 78h72" className="a" /><circle cx="60" cy="45" r="8" /><rect x="68" y="50" width="24" height="14" rx="3" /></>),
  dashboard: (<><path d="M6 44c10-16 30-22 54-22s44 6 54 22v14H6z" /><path d="M6 58h108" /><rect x="20" y="30" width="30" height="16" rx="5" /><circle cx="29" cy="38" r="5" className="t" /><circle cx="41" cy="38" r="5" className="t" /><rect x="56" y="30" width="34" height="16" rx="2" className="a" /><path d="M60 35h18M60 40h12" className="t" /><path d="M96 34h10v6H96zM10 46h10v6H10z" /><path d="M64 58v10h22V58" /><path d="M18 76a17 17 0 0 1 34 0" /><circle cx="35" cy="76" r="4" className="a" /></>),
  seat: (<><path d="M44 10c8 0 12 4 12 10v32H36l-4-30c-1-8 4-12 12-12z" /><path d="M30 52h54c6 0 8 4 8 8v4H34c-4 0-6-4-4-12z" /><path d="M40 64v14M82 64v14M34 78h54" /><path d="M40 24h12M40 32h14M40 40h15" className="t" /><path d="M41 10l-2-6h12l-2 6" className="a" /></>),
  steeringwheel: (<><circle cx="60" cy="45" r="33" /><circle cx="60" cy="45" r="26" className="t" /><path d="M27 42h20l6 6h14l6-6h20M54 54l-4 22M66 54l4 22" /><rect x="52" y="40" width="16" height="12" rx="2" className="a" /></>),
  wheel: (<><circle cx="60" cy="45" r="36" /><circle cx="60" cy="45" r="29" /><circle cx="60" cy="45" r="7" /><path d="M60 38V16M66 43l21-7M64 51l13 18M56 51L43 69M54 43l-21-7" /><path d="M57 38l-6-20M63 38l6-20" className="t" /><circle cx="60" cy="45" r="2.5" className="a" /></>),
};

const ALIAS: Record<string, string> = {};

export function PartArt({ icon, className, label }: { icon: string; className?: string; label?: string }) {
  const art = ART[icon] ?? ART[ALIAS[icon] ?? "ecu"];
  return (
    <div className={cn("blueprint relative overflow-hidden bg-steel grid-steel text-steel-text", className)}>
      <span className="scan" aria-hidden="true" />
      <svg viewBox="0 0 120 90" className="absolute inset-0 h-full w-full p-[9%] [&_.a]:stroke-signal [&_.t]:opacity-45 [&_.t]:[stroke-width:1]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {art}
      </svg>
      <span className="absolute left-2 top-2 h-2 w-2 border-l border-t border-steel-muted/60" />
      <span className="absolute right-2 top-2 h-2 w-2 border-r border-t border-steel-muted/60" />
      <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-steel-muted/60" />
      <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-steel-muted/60" />
      {label ? <span className="mono absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.14em] text-steel-muted">{label}</span> : null}
    </div>
  );
}
