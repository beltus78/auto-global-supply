// Deploy step for Cloudflare Workers Builds and for local use.
// 1. Applies new D1 migrations. 2. Loads the catalogue if the products table is empty.
// 3. Deploys the Worker. Database steps are skipped with a warning (not a failure)
// when the API token has no D1 permission, so a deploy is never blocked by them.
import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
const warn = (msg, e) => console.warn(`\n[deploy] WARNING: ${msg}\n${String(e?.stderr || e?.message || e).slice(0, 600)}\n`);

let dbOk = true;
try {
  console.log("[deploy] Applying D1 migrations…");
  console.log(run("npx wrangler d1 migrations apply DB --remote"));
} catch (e) {
  dbOk = false;
  warn("could not apply D1 migrations. Give the build API token 'D1: Edit' permission, or run `npm run golive` once from a computer.", e);
}

if (dbOk) {
  try {
    const out = run('npx wrangler d1 execute DB --remote --json --command "SELECT COUNT(*) AS n FROM products"');
    const n = JSON.parse(out)?.[0]?.results?.[0]?.n ?? 0;
    if (n === 0 || process.env.FORCE_RESEED === "1") {
      console.log(`[deploy] products table has ${n} rows: loading seed/catalogue.sql…`);
      console.log(run("npx wrangler d1 execute DB --remote --yes --file=seed/catalogue.sql"));
    } else {
      console.log(`[deploy] products table has ${n} rows: catalogue already loaded.`);
    }
  } catch (e) {
    warn("could not check or load the catalogue.", e);
  }
}

console.log("[deploy] Deploying Worker…");
execSync("npx wrangler deploy", { stdio: "inherit" });
