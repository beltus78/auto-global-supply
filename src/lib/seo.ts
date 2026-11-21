import { BUSINESS } from "./business";

const abs = (path: string) => `${BUSINESS.website}${path.startsWith("/") ? path : `/${path}`}`;

// [text to add, word that means the description already says it]
const PADDING: [string, RegExp][] = [
  [" Fitment is confirmed against your VIN before quoting.", /\bVIN\b/],
  [" Shipped worldwide from our warehouse in China.", /shipping/i],
  [" Written quotation before purchase.", /quot/i],
  [" Auto Global Supply.", /Auto Global Supply/],
];

/**
 * Keeps meta descriptions inside what search results show (about 120–160 characters):
 * long ones are cut at the last full sentence (or word) that fits, short ones get a closing line.
 */
export function fitDescription(text: string, min = 120, max = 160): string {
  let d = text.replace(/\s+/g, " ").trim();
  if (d.length > max) {
    const cut = d.slice(0, max + 1);
    const sentence = cut.lastIndexOf(". ");
    d = sentence >= min - 20 ? cut.slice(0, sentence + 1) : `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}.`;
  }
  for (const [pad, has] of PADDING) {
    if (d.length >= min) break;
    if (!has.test(d) && d.length + pad.length <= max) d += pad;
  }
  return d;
}

/** Standard head for a page: title, description, canonical and Open Graph. */
export function pageHead(opts: { title: string; description: string; path: string; noindex?: boolean; ld?: unknown[] }) {
  opts = { ...opts, description: fitDescription(opts.description) };
  // Keep titles inside what search results display: drop the brand suffix when it would push past ~65 characters.
  const title = opts.title.includes(BUSINESS.brand) || opts.title.length > 44 ? opts.title : `${opts.title} | ${BUSINESS.brand}`;
  return {
    meta: [
      { title },
      { name: "description", content: opts.description },
      { property: "og:title", content: title },
      { property: "og:description", content: opts.description },
      { property: "og:url", content: abs(opts.path) },
      { property: "og:image", content: abs("/social-preview.png") },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: opts.description },
      { name: "twitter:image", content: abs("/social-preview.png") },
      ...(opts.noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    ],
    links: [{ rel: "canonical", href: abs(opts.path) }],
    scripts: (opts.ld ?? []).map((ld) => ({ type: "application/ld+json", children: JSON.stringify(ld) })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: abs(item.path) })),
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: BUSINESS.brand,
  legalName: BUSINESS.legalName,
  url: BUSINESS.website,
  email: BUSINESS.email,
  telephone: BUSINESS.usPhone,
  address: { "@type": "PostalAddress", streetAddress: "13740 NW 19th Avenue, Unit 6", addressLocality: "Opa-locka", addressRegion: "FL", postalCode: "33054", addressCountry: "US" },
  areaServed: "Worldwide",
};
