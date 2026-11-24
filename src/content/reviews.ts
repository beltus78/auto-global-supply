/**
 * Customer reviews shown on the site.
 *
 * RULES (owner's business depends on these — FTC fake-review rule, Google policies):
 * - Only reviews posted by real customers on the Auto Global Supply Google Business Profile
 *   (or another platform where they can be checked), copied word for word.
 * - Never write, edit, combine, translate or "improve" a review. Never add reviews supplied as a
 *   text list without a verifiable source. Keep low ratings too.
 * - `name` exactly as the platform shows it; `date` = month the review was posted (YYYY-MM).
 */
export type Review = { name: string; rating: 1 | 2 | 3 | 4 | 5; date: string; text: string; source: "Google" };

export const REVIEWS: Review[] = [];
