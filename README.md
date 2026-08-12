# Adxchange

Market-validation front-end MVP for Adxchange, based on the current landing-page brief and pre-seed product deck.

## What is implemented

- Public onboarding / audience routing
- Advertiser landing
- Publisher landing
- Demo login/register UX
- Advertiser dashboard, campaign wizard, reporting and billing shell
- Publisher dashboard, venue/screen setup, content, earnings and payouts
- Operations dashboard shell
- Shared domain types and repository contracts
- Mock data boundary ready to be replaced by API repositories
- SEO sitemap/robots
- Architecture, security and unresolved-product documentation

## Architecture

Business code is grouped by bounded context:

- `identity`
- `advertising`
- `publishing`
- `delivery`
- `finance`
- `operations`

The front-end must access data through repository contracts rather than coupling UI directly to a future backend.

## Run

```bash
npm install
npm run dev
```

## Important

Dashboard values, pricing, earnings, payment, proof-of-play and authentication are demo/prototype data unless explicitly connected to production services later.
