#!/usr/bin/env node
import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

const base = process.env.SHOT_BASE || 'http://127.0.0.1:3000'
const out = path.resolve('screenshots')
await fs.mkdir(out, { recursive: true })

const pages = [
  '/',
  '/du-an',
  '/du-an/ooh-led-nguyen-kim-dai-le-30-4',
  '/dich-vu',
  '/dich-vu/roadshow-su-kien',
  '/gioi-thieu',
  '/gioi-thieu/cau-chuyen',
  '/gioi-thieu/doi-ngu',
  '/gioi-thieu/khach-hang',
  '/lien-he',
  '/chinh-sach-bao-mat',
  '/tim-kiem?q=roadshow',
  '/dev/font-check',
  '/admin',
]

const widths = [390, 768, 1440]

const browser = await chromium.launch()
for (const w of widths) {
  const context = await browser.newContext({
    viewport: { width: w, height: w === 390 ? 844 : 900 },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  for (const p of pages) {
    const name = `${p === '/' ? 'home' : p.replace(/^\//, '').replace(/[/?=&]/g, '_')}_${w}`
    try {
      await page.goto(`${base}${p}`, { waitUntil: 'networkidle', timeout: 90000 })
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true })
      console.log('ok', name)
    } catch (e) {
      console.warn('fail', name, e.message)
    }
  }
  await context.close()
}
await browser.close()
