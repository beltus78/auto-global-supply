# Deploying Auto Global Supply

Already created in your Cloudflare account: D1 database `auto-global-supply` (id in wrangler.jsonc) and R2 bucket `auto-global-supply-media`.

## First deploy (from this folder on your Mac)
```bash
npm install --legacy-peer-deps
npx wrangler login
npm run golive          # creates the tables, loads the 15,535 listings, builds and deploys
npx wrangler secret put RESEND_API_KEY   # resend.com key; verify notify.autoglobalsupply.com there
npx wrangler secret put ADMIN_KEY        # any long password; opens /admin
```
Then in Cloudflare: Workers & Pages > auto-global-supply > Settings > Domains & Routes: add `autoglobalsupply.com` and `www.autoglobalsupply.com`. This replaces the Lovable site on the domain.

## Automatic deploys (needed for the SEO schedule)
Workers & Pages > auto-global-supply > Settings > Build > Connect to Git: repo `beltus78/auto-global-supply`, branch `cloudflare`, build command `npm install --legacy-peer-deps && npx vite build`, deploy command `npx wrangler deploy`.

## After changing the catalogue
`npm run catalogue && npm run db:seed:remote`

## Approving trade accounts
Open /admin with your ADMIN_KEY. Approve sends the applicant a sign-in link (and shows it so you can also send it on WhatsApp).
