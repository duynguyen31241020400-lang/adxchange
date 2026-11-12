# DECISIONS — ADX web v2

Các lựa chọn khi brief không nói rõ, hoặc môi trường buộc phải đổi.

## Repo

- Sửa trên repo sẵn có `duynguyen31241020400-lang/adxchange` (không tạo repo `adx-web` mới).
- Xóa prototype marketplace / coming-soon / static surfaces cũ; thay bằng site agency ADX + Payload.

## Stack phiên bản

- Brief: Next.js 15. Payload `3.93.0` peer range loại Next `15.5.x`, nên pin `next@15.4.11` (vẫn là Next 15 App Router).
- Local Postgres (apt) thay Docker/Neon khi chưa có `DATABASE_URI` production.
- Media: local disk khi thiếu R2; bật `@payloadcms/storage-s3` khi đủ biến `R2_*`.
- Netlify không giữ `media/` (gitignore + filesystem function tạm). Khi chưa có R2: mirror seed vào `public/media/file/` (`pnpm publish-media`). Payload vẫn resolve `url` thành `/api/media/file/...` lúc đọc → `mediaUrl()` + `src/middleware.ts` rewrite sang `/media/file/...`. R2 vẫn là hướng production đúng.

## Nội dung / ảnh

- Map thư mục `Activation Tràng Thi` → slug `khai-truong-topzone` (giả định theo brief; cần August xác nhận).
- Khách hàng dự án xe buýt: theo bảng brief = Thế Giới Di Động, Nha Khoa Kim (thư mục Drive ghi Samsung — cần xác nhận).
- Logo ADX ruby chưa có → dùng tạm `ADXCHANGE_Horizontallogo*.png`.
- Video OOH LED 163MB không đưa vào repo; trang dự án dẫn Facebook.
- `assets-raw/` và `seed-media/` trong `.gitignore`.
- Client logos Nestlé / Nutrinest: assets under `public/clients/{nestle,nutrinest}.png`. Seed name for NutriNest is **`Nutrinest`** (one capital N). Nestlé source was black line art on opaque white → punched near-white to alpha so it sits on cream A/C; theme B already pads all non-chip logos with a light chip, so `needsDarkChip` stays false. Nutrinest is red (#C5161D) on transparent — readable on A/C and B without a dark chip.

## Font tiêu đề

- So sánh Anton / Barlow Condensed / Oswald trên `/dev/font-check` với câu tiếng Việt.
- Cả 3 hiển thị dấu ổn trong screenshot; **mặc định giữ Anton (Chữ 1)** theo brief.

## Ảnh / Drive

- Tải được folder Drive `1iQV3gbPPmL_e2BS4Lo7wr3Rm7pOX2rTW` bằng `gdown --folder` vào `assets-raw/`.
- Lỗi 1 file Google Doc/Sheet: `ADX – Thông tin xây dựng Website` (cần quyền “Anyone with the link” hoặc tải thủ công).
- Banner `roadshow-xe-ban-tai-toshiba.png` không có đúng tên → fallback `roadshow-toshiba-dmx-01.jpg`.
- Nestea / Chuyện Nhà: không có ảnh dự án rõ trong Drive dump → cover placeholder nền tối.
- Video OOH 163MB nằm trong `assets-raw/03. Video/` (gitignored), không seed vào Media.

## Upload size

- Payload 3.93 `UploadConfig` không còn `limits.fileSize` → chặn 15MB bằng hook `beforeValidate` trên Media.

## Deploy

- Ưu tiên Netlify theo brief; nếu function limit → Railway Hobby (Node long-lived).
- Config đã commit: `netlify.toml`, `railway.toml`. `wrangler.toml` chỉ là stub “không deploy”.
- Môi trường agent **không có** Netlify / Railway / Neon / Cloudflare / R2 credentials → **chưa có URL production ổn định từ host Node**. Cần August đăng nhập platform + set env rồi `pnpm seed` trên DB prod.
- **Vercel vẫn đang linked** tới repo (`adxchange` + `adxchange-coming-soon`) → GitHub status check gắn Vercel dù brief chọn Netlify. Cần August disconnect hoặc set env trên Vercel, hoặc bỏ GitHub integration. (Vercel MCP auth trước đó bị decline — không dùng Vercel làm share URL trong lần này.)
- `coming-soon/` giữ stub HTML tối thiểu (brand ADX + ghi chú site đã chuyển) vì project Vercel `adxchange-coming-soon` rootDirectory = `coming-soon` (đã xóa trong rebuild → build fail). Stub chỉ để CI/Vercel project cũ không gãy; không phải surface production.
- Main app: `sitemap` `force-dynamic` + try/catch để `pnpm build` không cần Postgres live. Runtime vẫn cần `DATABASE_URI` + `PAYLOAD_SECRET` (và R2 nếu media remote).

### Cloudflare Pages / Workers — rejected for this stack (2026-11-11)

**Do not promise CF Pages as production for Payload+Postgres in this repo.**

Probe results:

1. **`@cloudflare/next-on-pages@1.13.16`** — npm deprecated; maintainers point to OpenNext. No official Next.js 15 support path for Pages via this package.
2. **`@opennextjs/cloudflare@1.20.16`** — peer requires `next@>=15.5.29 <16 || >=16.4.5`. App is pinned to **`next@15.4.11`** (Payload 3.93 peer). `pnpm add` reports unmet peer; forcing a probe build still fails (needs `.next/standalone` / OpenNext migrate). Upgrading Next solely for CF would fight the Payload pin.
3. **Runtime / data** — this app uses `@payloadcms/db-postgres` (`pg` pool) + `sharp`. Official Payload-on-Cloudflare path is the **D1 + R2** template (`with-cloudflare-d1`), not Postgres. Migrating DB adapter + storage is a product rewrite, not a share-URL fix.
4. **Auth** — `wrangler whoami` unauthenticated in agent env; cannot deploy Workers/Pages even if the stack fit.

**Cloudflare role going forward:** DNS / CDN / custom domain `adxchange.agency` in front of Netlify or Railway. Optional temporary share: `cloudflared tunnel` (quick `*.trycloudflare.com`) pointing at a Node host — ephemeral, not production.

### Stable share URL (August checklist)

| Platform | When | What to set |
| --- | --- | --- |
| **Netlify** (prefer) | Connect GitHub repo → uses `netlify.toml` | `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL`, `IP_HASH_SALT`; optional `R2_*`, Resend |
| **Railway Hobby** (fallback) | New service from repo → uses `railway.toml` | same env; start `pnpm start` |
| **Neon** | Free Postgres | create project → copy connection string → `DATABASE_URI` |
| **Cloudflare** | Later only | DNS to Netlify/Railway; do **not** host Payload here without D1 migration |

After host is live: set `NEXT_PUBLIC_SITE_URL` to the HTTPS origin, run `pnpm seed` once against that DB, rotate seed admin password (`august@adxchange.agency`).

### Temporary UI review URL (agent)

- Local Next (`127.0.0.1:3000`) + **cloudflared quick tunnel** (tmux `adx-ui-tunnel`) — keep running until replaced.
- URL at last check: `https://arms-suffering-console-subscriber.trycloudflare.com` (ephemeral; may rotate if tunnel restarts).
