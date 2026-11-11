#!/usr/bin/env node
/**
 * Mirror Payload local `media/` into `public/media/file/` and rewrite DB URLs
 * from `/api/media/file/...` → `/media/file/...` so Netlify can serve them
 * as static assets without R2.
 *
 * Usage: node scripts/publish-media.mjs
 * Requires DATABASE_URI / DATABASE_URL (loads .env.local then .env).
 */
import { createRequire } from 'module'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'fs'
import path from 'path'

const root = process.cwd()
for (const file of ['.env.local', '.env']) {
  const p = path.join(root, file)
  if (!existsSync(p)) continue
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue
    const i = line.indexOf('=')
    const k = line.slice(0, i)
    let v = line.slice(i + 1)
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (!process.env[k]) process.env[k] = v
  }
}

const uri = process.env.DATABASE_URI || process.env.DATABASE_URL
if (!uri) {
  console.error('DATABASE_URI / DATABASE_URL missing')
  process.exit(1)
}

import { pathToFileURL } from 'url'
const require = createRequire(pathToFileURL(path.join(root, 'package.json')))
const pgCandidates = [
  path.join(root, 'node_modules/pg'),
  path.join(root, 'node_modules/.pnpm/pg@8.20.0/node_modules/pg'),
]
let pg
for (const candidate of pgCandidates) {
  try {
    pg = require(candidate)
    break
  } catch {}
}
if (!pg) {
  console.error('Cannot resolve pg')
  process.exit(1)
}

const srcDir = path.join(root, 'media')
const destDir = path.join(root, 'public/media/file')
mkdirSync(destDir, { recursive: true })

let copied = 0
if (existsSync(srcDir)) {
  for (const name of readdirSync(srcDir)) {
    const from = path.join(srcDir, name)
    const to = path.join(destDir, name)
    if (!existsSync(to)) {
      copyFileSync(from, to)
      copied++
    }
  }
}

const client = new pg.Client({ connectionString: uri, connectionTimeoutMillis: 15000 })
await client.connect()
const result = await client.query(`
  update media set
    url = replace(url, '/api/media/file/', '/media/file/'),
    thumbnail_u_r_l = replace(thumbnail_u_r_l, '/api/media/file/', '/media/file/'),
    sizes_thumb_url = replace(sizes_thumb_url, '/api/media/file/', '/media/file/'),
    sizes_card_url = replace(sizes_card_url, '/api/media/file/', '/media/file/'),
    sizes_full_url = replace(sizes_full_url, '/api/media/file/', '/media/file/'),
    sizes_og_url = replace(sizes_og_url, '/api/media/file/', '/media/file/')
`)
await client.end()

console.log(`publish-media: copied ${copied} new files, rewrote ${result.rowCount} media rows`)
