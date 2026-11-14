import { whatsappUrl } from "@/lib/business";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21l1.6-4.7A8.6 8.6 0 1 1 8 19.700z" />
      <path d="M9 8.400c-.4 1.200.3 3 1.800 4.500s3.300 2.300 4.600 1.900l.9-1.300-2-1.100-.9.800c-.9-.4-2-1.500-2.400-2.400l.8-.9-1.100-2z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppButton() {
  return (
    <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp" className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-whatsapp p-3 text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 lg:bottom-6 lg:right-6">
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
