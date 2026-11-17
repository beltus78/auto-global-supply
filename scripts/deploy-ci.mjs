// Deploy step for Cloudflare Workers Builds and for local use.
// 1. Applies new D1 migrations.
// 2. Syncs the products table with seed/catalogue.sql: loads everything when the table is empty,
//    otherwise inserts only new listings, removes dropped ones and updates changed names/search text,
//    so routine catalogue additions cost a few writes instead of a full reload.
// 3. Deploys the Worker.
// Database steps never block a deploy: they warn and continue if the token lacks D1 permission.
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const WHERE = process.env.D1_LOCAL === "1" ? "--local" : "--remote";
const run = (cmd) => execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
const warn = (msg, e) => console.warn(`\n[deploy] WARNING: ${msg}\n${String(e?.stderr || e?.message || e).slice(0, 800)}\n`);
const query = (sql) => JSON.parse(run(`npx wrangler d1 execute DB ${WHERE} --json --command "${sql}"`))[0].results;

let dbOk = true;
try {
  console.log("[deploy] Applying D1 migrations…");
  console.log(run(`npx wrangler d1 migrations apply DB ${WHERE}`));
} catch (e) {
  dbOk = false;
  warn("could not apply D1 migrations. Give the build API token 'D1: Edit' permission, or run `npm run golive` once from a computer.", e);
}

if (dbOk) {
  try {
    const n = query("SELECT COUNT(*) AS n FROM products")[0].n;
    const sql = readFileSync("seed/catalogue.sql", "utf8");
    if (n === 0 || process.env.FORCE_RESEED === "1") {
      console.log(`[deploy] products table has ${n} rows: loading the full catalogue…`);
      console.log(run(`npx wrangler d1 execute DB ${WHERE} --yes --file=seed/catalogue.sql`));
    } else {
      // Parse the seed rows: each value tuple sits on its own line, "(id,'slug','sku','name',...,'search',oem,note)" + "," or ";".
      const seed = new Map();
      for (const line of sql.split("\n")) {
        const m = line.match(/^\(\d+,'((?:[^']|'')*)','(?:[^']|'')*','((?:[^']|'')*)',.*$/);
        if (m) seed.set(m[1], { name: m[2], tuple: line.replace(/^\(\d+,/, "(NULL,").replace(/[,;]$/, "") });
      }
      const cols = sql.match(/INSERT INTO products \(([^)]+)\)/)[1];
      const live = new Map(query("SELECT slug, name, search FROM products").map((r) => [r.slug, r]));
      const add = [...seed.keys()].filter((s) => !live.has(s));
      const drop = [...live.keys()].filter((s) => !seed.has(s));
      const changed = [...seed.entries()].filter(([s, r]) => live.has(s) && (live.get(s).name.replace(/'/g, "''") !== r.name || !r.tuple.includes(`'${live.get(s).search.replace(/'/g, "''")}'`))).map(([s]) => s);
      console.log(`[deploy] catalogue sync: ${add.length} new, ${drop.length} removed, ${changed.length} changed (live ${live.size}, seed ${seed.size}).`);
      const stmts = [];
      for (const s of [...drop, ...changed]) stmts.push(`DELETE FROM products WHERE slug = '${s.replace(/'/g, "''")}';`);
      const ins = [...add, ...changed];
      for (let i = 0; i < ins.length; i += 40) stmts.push(`INSERT INTO products (${cols}) VALUES\n${ins.slice(i, i + 40).map((s) => seed.get(s).tuple).join(",\n")};`);
      if (stmts.length) {
        const f = join(mkdtempSync(join(tmpdir(), "ags-")), "sync.sql");
        writeFileSync(f, stmts.join("\n") + "\n");
        console.log(run(`npx wrangler d1 execute DB ${WHERE} --yes --file=${f}`));
      }
    }
  } catch (e) {
    warn("could not sync the catalogue.", e);
  }
}

console.log("[deploy] Deploying Worker…");
if (process.env.D1_LOCAL !== "1") execSync("npx wrangler deploy", { stdio: "inherit" });
