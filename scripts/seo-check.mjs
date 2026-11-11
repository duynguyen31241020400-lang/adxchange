#!/usr/bin/env node
import { chromium } from 'playwright'

const base = process.env.SEO_BASE || 'http://127.0.0.1:3000'

async function main() {
  const sitemap = await fetch(`${base}/sitemap.xml`).then((r) => r.text())
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const rows = []

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    const data = await page.evaluate(() => {
      const title = document.title || ''
      const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      const h1 = [...document.querySelectorAll('h1')].map((el) => el.textContent?.trim())
      const imgs = [...document.querySelectorAll('img')]
      const missingAlt = imgs.filter((img) => !img.hasAttribute('alt')).length
      return { title, desc, h1Count: h1.length, h1, missingAlt, imgCount: imgs.length }
    })
    rows.push({
      url,
      titleLen: data.title.length,
      descLen: data.desc.length,
      titleOk: data.title.length >= 50 && data.title.length <= 60,
      descOk: data.desc.length >= 120 && data.desc.length <= 160,
      h1Ok: data.h1Count === 1,
      altOk: data.missingAlt === 0,
      ...data,
    })
  }

  console.table(
    rows.map((r) => ({
      path: r.url.replace(base, ''),
      titleLen: r.titleLen,
      descLen: r.descLen,
      h1: r.h1Count,
      missingAlt: r.missingAlt,
      titleOk: r.titleOk,
      descOk: r.descOk,
      h1Ok: r.h1Ok,
      altOk: r.altOk,
    })),
  )
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
