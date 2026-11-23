import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import displayFont from "@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2?url";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { MobileBar } from "@/components/site/MobileBar";
import { MotionObserver } from "@/components/site/Motion";
import { QuoteBasketProvider } from "@/lib/quote-basket";
import { organizationLd } from "@/lib/seo";

function NotFoundComponent() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="mono text-sm text-muted">ERROR 404</p>
      <h1 className="mt-2 text-6xl">Page not found</h1>
      <p className="mt-3 max-w-md text-ink-2">That page does not exist or has moved. Search the catalog, or send us the part you need and we will find it.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/parts" className="btn btn-signal">Browse the catalog</Link>
        <Link to="/request-a-part" className="btn btn-line">Request a part</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-start justify-center py-16">
      <h1 className="text-5xl">This page did not load</h1>
      <p className="mt-3 max-w-md text-ink-2">Something went wrong on our side. Try again, or go back to the home page.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => { void router.invalidate(); reset(); }} className="btn btn-signal">Try again</button>
        <a href="/" className="btn btn-line">Go home</a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1c2330" },
      { title: "Auto Global Supply" },
      { name: "description", content: "Wholesale automotive parts from our warehouse in Guangzhou, China, for repair shops, dealers and importers. Send a parts list for a quotation." },
      { property: "og:site_name", content: "Auto Global Supply" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preload", href: displayFont, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
    ],
    scripts: [
      // Marks the page as JS-capable before first paint so reveal animations never flash content.
      { children: "document.documentElement.classList.add('js')" },
      { type: "application/ld+json", children: JSON.stringify(organizationLd) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <QuoteBasketProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <MobileBar />
        <MotionObserver />
        <WhatsAppButton />
      </QuoteBasketProvider>
    </QueryClientProvider>
  );
}
