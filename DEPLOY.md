# Deploying Auto Global Supply

Already created in your Cloudflare account: D1 database `auto-global-supply` (id in wrangler.jsonc) and R2 bucket `auto-global-supply-media`.
Code: GitHub `beltus78/auto-global-supply`, branch `cloudflare`.

## 1. Connect the repo (creates the Worker and deploys it on every push)
Cloudflare dashboard > Workers & Pages > Create > Import a repository > `beltus78/auto-global-supply`.
- Project name: `auto-global-supply` (must match wrangler.jsonc)
- Production branch: `cloudflare`
- Build command: `npm install --legacy-peer-deps && npx vite build`
- Deploy command: `npm run deploy:ci`

`deploy:ci` applies database changes, loads the 15,535 listings the first time (only when the table is empty) and deploys.
The default build token cannot write to D1, so for the database part either:
- give the token D1 access: My Profile > API Tokens > the "Workers Builds" token > Edit > add Account / D1 / Edit, then retry the build; or
- run once from a computer: `git clone https://github.com/beltus78/auto-global-supply && cd auto-global-supply && npm install --legacy-peer-deps && npx wrangler login && npm run golive`

## 2. Secrets
Workers & Pages > auto-global-supply > Settings > Variables and Secrets (type: Secret):
- `ADMIN_KEY`: any long password; opens /admin
- `RESEND_API_KEY`: resend.com key; verify `notify.autoglobalsupply.com` there so quote emails send

## 3. Domain
Settings > Domains & Routes > add `autoglobalsupply.com` and `www.autoglobalsupply.com`. This replaces the Lovable site.

## After changing the catalogue
`npm run catalogue`, commit and push. The deploy step adds new listings and removes dropped ones automatically.
A full reload (build variable `FORCE_RESEED=1`) writes about 100,000 rows: avoid it on the Workers Free plan (daily limit 100,000 writes for the whole account).

## Caching
Anonymous page views and catalogue data are cached at Cloudflare's edge for an hour (custom domain only; workers.dev isn't cached). Each deploy starts a fresh cache. Quote, trade, admin and API routes are never cached.

## Approving trade accounts
Open /admin with your ADMIN_KEY. Approve sends the applicant a sign-in link (and shows it so you can also send it on WhatsApp).
