import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./WhatsAppButton";
import { BUSINESS, whatsappUrl } from "@/lib/business";
import { CATEGORIES } from "@/lib/taxonomy";

const col = "mono text-[11px] uppercase tracking-[0.14em] text-steel-muted";
const link = "block py-1 text-[14px] text-steel-text/85 hover:text-signal";

export function SiteFooter() {
  return (
    <footer className="bg-steel text-steel-text">
      <div className="hazard-run h-1.5" />
      <div className="wrap grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-[14px] text-steel-muted">Wholesale automotive parts shipped from our own warehouse in Guangzhou, China. We sell to repair shops, dealers, parts retailers, fleets and importers buying in volume.</p>
          <div className="mt-5 grid gap-1.5 text-[14px]">
            <a href={`mailto:${BUSINESS.email}`} className="hover:text-signal">{BUSINESS.email}</a>
            <a href={BUSINESS.usPhoneHref} className="hover:text-signal"><span className="text-steel-muted">US contact</span> {BUSINESS.usPhone}</a>
            <a href={BUSINESS.internationalPhoneHref} className="hover:text-signal"><span className="text-steel-muted">International contact</span> {BUSINESS.internationalPhone}</a>
          </div>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-sm mt-5 bg-whatsapp text-white hover:brightness-110"><WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp</a>
        </div>
        <div>
          <p className={col}>Catalog</p>
          <div className="mt-3">
            {CATEGORIES.slice(0, 8).map((c) => <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className={link}>{c.name}</Link>)}
            <Link to="/dashboards" className={link}>Dashboards & dashboard kits</Link>
            <Link to="/interior-parts" className={link}>Interior parts</Link>
            <Link to="/brands" className={link}>Vehicle brands</Link>
            <Link to="/parts-upgrades" className={link}>Parts & upgrades</Link>
          </div>
        </div>
        <div>
          <p className={col}>Parts & services</p>
          <div className="mt-3">
            <Link to="/request-a-part" className={link}>Request a quote</Link>
            <Link to="/how-it-works" className={link}>How it works</Link>
            <Link to="/quality-fitment" className={link}>Quality & fitment</Link>
            <Link to="/shipping" className={link}>International shipping</Link>
            <Link to="/returns" className={link}>Returns</Link>
            <Link to="/warranty" className={link}>Warranty information</Link>
            <Link to="/wholesale" className={link}>Wholesale orders</Link>
            <Link to="/wholesale-auto-parts-usa" className={link}>US buyers</Link>
            <Link to="/trade" className={link}>Trade accounts</Link>
          </div>
          <p className={`${col} mt-7`}>Company</p>
          <div className="mt-3">
            <Link to="/about" className={link}>About</Link>
            <Link to="/contact" className={link}>Contact</Link>
            <Link to="/faq" className={link}>FAQ</Link>
            <Link to="/guides" className={link}>Parts guides</Link>
          </div>
        </div>
        <div>
          <p className={col}>Business locations</p>
          <div className="mt-3 space-y-5 text-[14px]">
            <div>
              <p className="font-semibold">Florida, USA. Registered and principal office</p>
              <p className="mt-1 text-steel-muted">{BUSINESS.address}</p>
            </div>
            <div>
              <p className="font-semibold">{BUSINESS.chinaWarehouse.label}</p>
              <p className="mt-1 text-steel-muted">{BUSINESS.chinaWarehouse.address}</p>
              <p className="mt-1 text-[12.5px] text-steel-muted">{BUSINESS.chinaWarehouse.role}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-steel-line">
        <div className="wrap flex flex-col gap-2 py-5 text-[12.5px] text-steel-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BUSINESS.brand}. {BUSINESS.legalName} · Florida document number {BUSINESS.registration}</p>
          <p className="flex gap-4"><Link to="/privacy" className="hover:text-signal">Privacy Policy</Link><Link to="/terms" className="hover:text-signal">Terms & Conditions</Link></p>
        </div>
        <div className="wrap pb-24 text-[11.5px] leading-relaxed text-steel-muted/80 lg:pb-6">
          <p>Vehicle manufacturer names, model names and part numbers are used for identification and fitment reference only. Auto Global Supply is an independent parts wholesaler and is not affiliated with or endorsed by any vehicle manufacturer.</p>
        </div>
      </div>
    </footer>
  );
}
