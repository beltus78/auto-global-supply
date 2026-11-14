import { env as workerEnv } from "cloudflare:workers";

export type AppEnv = {
  DB: D1Database;
  MEDIA: R2Bucket;
  SITE_URL?: string;
  MAIL_FROM?: string;
  SALES_EMAIL?: string;
  RESEND_API_KEY?: string;
  ADMIN_KEY?: string;
};

/** Cloudflare bindings and secrets. Server-only. */
export const getEnv = () => workerEnv as unknown as AppEnv;
export const getDb = () => getEnv().DB;
