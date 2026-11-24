import { Star } from "lucide-react";
import { REVIEWS } from "@/content/reviews";
import { BUSINESS } from "@/lib/business";

const month = (d: string) => new Date(`${d}-01T12:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** Real customer reviews from Google. Renders nothing until reviews are added to src/content/reviews.ts. */
export function Reviews({ limit = 6 }: { limit?: number }) {
  if (!REVIEWS.length) return null;
  const list = [...REVIEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
  return (
    <section className="wrap py-12 sm:py-16" aria-labelledby="reviews-h">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 id="reviews-h" className="mt-2 text-3xl sm:text-4xl">What our buyers say</h2>
        </div>
        <a href={BUSINESS.googleReviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line">Leave a review on Google</a>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <figure key={`${r.name}-${r.date}-${r.text.slice(0, 12)}`} data-reveal className="panel flex flex-col p-5">
            <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-signal text-signal-deep" : "text-line-strong"}`} />)}
            </div>
            <blockquote className="mt-3 flex-1 text-[15px] text-ink-2">“{r.text}”</blockquote>
            <figcaption className="mono mt-4 text-[12px] text-muted">{r.name} · {month(r.date)} · {r.source}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
