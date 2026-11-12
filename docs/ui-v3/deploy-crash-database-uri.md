# Deploy crash — DATABASE_URI missing on Vercel

## Symptom
- Vercel: server-side exception digest `2445818715` / `140714200`
- Netlify: user saw client-side exception on older preview; current DP HTML returns content

## Root cause
Runtime log: `Error: DATABASE_URI is not configured` from `getPayloadClient()`. Layout caught it; homepage `Promise.all` did not → RSC digest error.

Vercel project `adxchange` had **zero** env vars.

## Fix
1. Added encrypted `DATABASE_URI`, `DATABASE_URL`, `PAYLOAD_SECRET` + plain `NEXT_PUBLIC_SITE_URL` to Vercel (prod/preview/dev)
2. Hardened homepage try/catch in `page.tsx` (commit `b4f6efd`)
3. Redeployed phase2 → **200 OK** with CMS content

Preview: https://adxchange-git-cursor-4fd22e-duynguyen31241020400-langs-projects.vercel.app
