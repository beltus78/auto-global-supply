import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MAKES, engineBy, modelsOf, years } from "@/lib/taxonomy";

type Initial = { make?: string; model?: string; gen?: string; engine?: string; category?: string };

/** Make > model > generation > engine selector. Submits to the catalog with the chosen filters. */
export function VehicleFinder({ initial = {}, tone = "dark", compact = false }: { initial?: Initial; tone?: "dark" | "light"; compact?: boolean }) {
  const navigate = useNavigate();
  const [make, setMake] = useState(initial.make ?? "");
  const [model, setModel] = useState(initial.model ?? "");
  const [gen, setGen] = useState(initial.gen ?? "");
  const [engine, setEngine] = useState(initial.engine ?? "");

  const models = useMemo(() => (make ? modelsOf(make) : []), [make]);
  const gens = useMemo(() => models.find((m) => m.slug === model)?.gens ?? [], [models, model]);
  const engines = useMemo(() => (gens.find((g) => g.genSlug === gen)?.engines ?? []).map((c) => engineBy.get(c)).filter(Boolean), [gens, gen]);

  const label = tone === "dark" ? "label !text-steel-muted" : "label";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void navigate({ to: "/parts", search: { ...(initial.category ? { category: initial.category } : {}), ...(make ? { make } : {}), ...(model ? { model } : {}), ...(gen ? { gen } : {}), ...(engine ? { engine } : {}) } });
  };

  return (
    <form onSubmit={submit} className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end"}>
      <div>
        <label className={label} htmlFor="vf-make">01 Make</label>
        <select id="vf-make" className="field" value={make} onChange={(e) => { setMake(e.target.value); setModel(""); setGen(""); setEngine(""); }}>
          <option value="">Select make</option>
          {MAKES.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="vf-model">02 Model</label>
        <select id="vf-model" className="field" value={model} disabled={!make} onChange={(e) => { setModel(e.target.value); setGen(""); setEngine(""); }}>
          <option value="">{make ? "All models" : "Select make first"}</option>
          {models.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="vf-gen">03 Generation / years</label>
        <select id="vf-gen" className="field" value={gen} disabled={!model} onChange={(e) => { setGen(e.target.value); setEngine(""); }}>
          <option value="">{model ? "All generations" : "Select model first"}</option>
          {gens.map((g) => <option key={g.id} value={g.genSlug}>{g.gen} ({years(g)})</option>)}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="vf-engine">04 Engine</label>
        <select id="vf-engine" className="field" value={engine} disabled={!gen || !engines.length} onChange={(e) => setEngine(e.target.value)}>
          <option value="">{gen ? (engines.length ? "Any engine" : "Not applicable") : "Select generation first"}</option>
          {engines.map((e) => <option key={e!.code} value={e!.code}>{e!.code} · {e!.disp} {e!.fuel === "D" ? "diesel" : "gas"}</option>)}
        </select>
      </div>
      <button type="submit" className="btn btn-signal"><Search className="h-4 w-4" /> Find parts</button>
    </form>
  );
}
