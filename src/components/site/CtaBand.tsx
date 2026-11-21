import { Link } from "@tanstack/react-router";
import { whatsappUrl } from "@/lib/business";
import { WhatsAppIcon } from "./WhatsAppButton";

export function CtaBand({ title = "Buying parts in volume?", text = "Send your parts list, part numbers or VINs. We check every line against our warehouse stock and reply with one written quotation including shipping." }: { title?: string; text?: string }) {
  return (
    <section className="bg-signal text-signal-ink">
      <div className="wrap flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-2 text-[15px]">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/request-a-part" className="btn btn-dark btn-lg">Request a part</Link>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-lg border-signal-ink/40 hover:bg-signal-deep"><WhatsAppIcon className="h-5 w-5" /> WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
