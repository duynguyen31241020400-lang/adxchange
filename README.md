# Adxchange

Market-validation front-end MVP for Adxchange.

## Current surfaces

- Public marketing site
- Advertiser app prototype
- Publisher / Earner portal prototype
- Operations dashboard shell

## Architecture

The frontend is intentionally backend-ready: UI -> module/service boundary -> repository contract -> mock implementation today, API implementation later. Business code is grouped by domain so related information is easy to find: identity, advertising, publishing, delivery, finance and operations.

See `docs/architecture/system-overview.md`, `docs/architecture/security.md`, `docs/architecture/repository-layout.md` and `docs/product/open-questions.md`.
