import { z } from "zod";

const s = z.string().max(120).optional().catch(undefined);
/** URL search params for catalogue pages. Invalid values are dropped rather than failing the page. */
export const catalogueParams = z.object({
  q: s,
  category: s,
  make: s,
  model: s,
  gen: s,
  engine: s,
  part: s,
  page: z.coerce.number().int().min(1).max(500).optional().catch(undefined),
});
