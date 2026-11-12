# UI v3 — Đợt 1

**Branch:** `cursor/ui-v3-a595` (brief `ui-v3`; cloud prefix required)  
**Base:** `cursor/adx-web-v2-a595`

## Shipped

1. Ruby/white palette; removed A/B/C themes, ThemeControls, Barlow/Oswald, `/dev/font-check`
2. Header (logo | page title | search + Menu) + fullscreen ruby menu
3. Footer strips + ContactCTA
4. IntroTrivision (skip, once/session, reduced-motion bypass)
5. Home v3 sections
6. `/du-an` film reel + list rows; `projects.summary`; `heroVideo` field; Neon column backfilled

## Decisions (also in DECISIONS.md)

- `--muted` darkened to `#6B5A5D` for ≥4.5:1 on white
- Hero keeps `bg-black/40` for type legibility (not decorative gradient)
- Included media URL rewrite cherry-pick so images keep working

## Not in Đợt 1

Project detail, about one-pager, contact page restyle, services polish, screenshots/Lighthouse/Playwright pack (Đợt 2 + §14).
