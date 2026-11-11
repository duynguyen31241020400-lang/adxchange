# ADX (adxchange.agency)

Website agency ADX — Next.js 15 App Router + Payload CMS 3 + Postgres + Tailwind 4.

## Dev

```bash
pnpm install
cp .env.example .env   # chỉnh DATABASE_URI, PAYLOAD_SECRET
pnpm images            # assets-raw → seed-media + public
pnpm dev               # lần đầu Payload push schema
pnpm seed
```

Admin: http://localhost:3000/admin  
Seed admin mặc định: `august@adxchange.agency` / `ChangeMeADX2026!`

## Scripts

- `pnpm images` — xử lý ảnh từ `assets-raw/`
- `pnpm seed` — nạp nội dung + media
- `pnpm test:unit` — Vitest (normalize search)
- `pnpm seo-check` — crawl SEO sau `pnpm build && pnpm start`
- `pnpm typecheck` / `pnpm lint` / `pnpm build`

## Env

Xem `.env.example`. Thiếu R2 → lưu media local trong `media/`.

## Docs

- `DECISIONS.md` — lựa chọn kỹ thuật
- `HUONG-DAN-QUAN-TRI.md` — hướng dẫn admin tiếng Việt
