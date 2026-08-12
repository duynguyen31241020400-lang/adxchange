# Repository layout

The repository is organized by business domain first rather than by global technical layer.

## Business groups

- `identity`: authentication, account, roles and future organization membership
- `advertising`: advertiser dashboard, campaigns, targeting, scheduling, creatives and checkout
- `publishing`: publisher onboarding, venues, screens, venue content and brand-safety UI
- `delivery`: playback, proof-of-play and uptime concepts
- `finance`: payments, revenue, earnings, reconciliation and payouts
- `operations`: internal views over the other domains

`marketing`, `shared` and `infrastructure` are supporting layers. Business rules must not be moved into generic shared utilities.

The backend will be added later behind repository/API contracts; the current mock repositories must never be treated as a production security or data boundary.
