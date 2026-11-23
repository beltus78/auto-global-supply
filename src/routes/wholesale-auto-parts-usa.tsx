import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
import { PAGES } from "@/content/pages";
import { pageHead } from "@/lib/seo";

const page = PAGES["usa"]!;

export const Route = createFileRoute("/wholesale-auto-parts-usa")({
  staticData: { sitemap: true },
  head: () => pageHead({ title: page.title, description: page.description, path: page.path }),
  component: () => <ContentPage page={page} />,
});
