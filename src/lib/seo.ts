import { BUSINESS } from "./business";

const abs = (path: string) => `${BUSINESS.website}${path.startsWith("/") ? path : `/${path}`}`;

/** Standard head for a page: title, description, canonical and Open Graph. */
export function pageHead(opts: { title: string; description: string; path: string; noindex?: boolean; ld?: unknown[] }) {
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
