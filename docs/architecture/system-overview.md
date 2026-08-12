# System overview

Adxchange is implemented first as a market-validation front-end MVP.

## Surfaces

1. Public marketing site
2. Advertiser app prototype
3. Publisher/Earner portal prototype
4. Operations dashboard shell

## Boundary

Current UI -> application modules -> repository contracts -> mock repositories.

Future UI -> same application modules -> API repositories -> modular backend -> PostgreSQL/object storage/TV app.

The MVP must not treat mock payment, earnings, playback or authentication as production truth.
