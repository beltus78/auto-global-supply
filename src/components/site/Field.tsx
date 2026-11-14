import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Field({ label, htmlFor, hint, required, children, className }: { label: string; htmlFor: string; hint?: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label" htmlFor={htmlFor}>{label}{required ? <span className="text-danger"> *</span> : null}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

/** Hidden field that real visitors never fill in. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} /></label>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p role="alert" className="border-l-4 border-danger bg-danger/8 px-3 py-2 text-sm text-danger">{message}</p>;
}

export function Success({ title, children, reference }: { title: string; children: ReactNode; reference?: string | undefined }) {
  return (
    <div className="panel border-l-4 border-l-ok p-6 sm:p-8">
      <CheckCircle2 className="h-9 w-9 text-ok" />
      <h2 className="mt-3 text-3xl">{title}</h2>
      {reference ? <p className="mono mt-3 inline-block border border-line-strong bg-paper px-3 py-1.5 text-sm">Reference {reference}</p> : null}
      <div className="mt-3 space-y-2 text-ink-2">{children}</div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/parts" className="btn btn-dark">Back to catalogue</Link>
        <Link to="/" className="btn btn-line">Home</Link>
      </div>
    </div>
  );
}

export const COUNTRIES_HINT = "Country the parts will be shipped to";
