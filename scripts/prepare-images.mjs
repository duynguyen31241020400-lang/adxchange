#!/usr/bin/env node
/**
 * Prepare assets-raw → seed-media + public logos/favicons/OG.
 * Run: pnpm images
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const raw = path.join(root, 'assets-raw')
const seedMedia = path.join(root, 'seed-media')
const publicDir = path.join(root, 'public')

const PROJECT_MAP = [
  {
    slug: 'roadshow-xe-ban-tai-toshiba-dien-may-xanh',
    dirs: ['02. Ảnh dự án & Banner/Roadshow Toshiba x Điện Máy Xanh'],
    // Cover: truck with clear Toshiba branding, landscape subject
    preferredCover: 'roadshow-toshiba-dmx-01.jpg',
    max: 8,
  },
  {
    slug: 'human-billboard-nguyen-kim',
    dirs: [
      '02. Ảnh dự án & Banner/Human Walking Billboard - Sài Gòn',
      '02. Ảnh dự án & Banner/Ảnh khác (trích từ credential)',
    ],
    include: [/human-walking/i, /human-billboard/i],
    preferredCover: 'human-walking-01.jpg',
    max: 8,
  },
  {
    slug: 'roadshow-xe-buyt-2-tang',
    dirs: [
      '02. Ảnh dự án & Banner/Roadshow xe buýt 2 tầng Samsung',
      '02. Ảnh dự án & Banner/Ảnh khác (trích từ credential)',
    ],
    include: [/samsung-bus/i, /xe-buyt/i],
    preferredCover: 'samsung-bus-01.jpg',
    max: 8,
  },
  {
    slug: 'khai-truong-topzone',
    dirs: [
      '02. Ảnh dự án & Banner/Activation Tràng Thi - đợt 1',
      '02. Ảnh dự án & Banner/Activation Tràng Thi - đợt 2 (2-9)',
    ],
    preferredCover: 'trang-thi-dot1-01.jpg',
    max: 8,
  },
  {
    slug: 'ooh-led-nguyen-kim-dai-le-30-4',
    dirs: ['02. Ảnh dự án & Banner/OOH LED Nguyễn Kim - 30-4-2025'],
    preferredCover: 'nguyen-kim-ooh-30-4-01.jpg',
    max: 8,
  },
]

const SERVICE_IMAGES = [
  {
    out: 'services/livestream.webp',
    src: '02. Ảnh dự án & Banner/Ảnh khác (trích từ credential)/livestream-studio.png',
  },
]

const HERO_CANDIDATES = [
  {
    name: 'roadshow-xe-buyt-2-tang',
    src: '02. Ảnh dự án & Banner/Ảnh khác (trích từ credential)/roadshow-xe-buyt-2-tang.png',
  },
  {
    name: 'roadshow-human-billboard-nguyenkim',
    src: '02. Ảnh dự án & Banner/Ảnh khác (trích từ credential)/roadshow-human-billboard-nguyenkim.png',
  },
  {
    name: 'roadshow-xe-ban-tai-toshiba',
    // Exact name missing — use best Toshiba cover
    src: '02. Ảnh dự án & Banner/Roadshow Toshiba x Điện Máy Xanh/roadshow-toshiba-dmx-01.jpg',
    fallbackNote: true,
  },
]

function slugifyName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function listImages(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    return entries
      .filter((e) => e.isFile() && /\.(jpe?g|png|webp|tif?f)$/i.test(e.name))
      .map((e) => path.join(dir, e.name))
  } catch {
    return []
  }
}

async function processImage(src, outFull, outCard) {
  const pipeline = sharp(src).rotate()
  const meta = await pipeline.metadata()
  const longest = Math.max(meta.width || 0, meta.height || 0)
  const full = sharp(src).rotate()
  if (longest > 2400) {
    full.resize({
      width: meta.width >= meta.height ? 2400 : undefined,
      height: meta.height > meta.width ? 2400 : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }
  await full.webp({ quality: 80 }).toFile(outFull)

  await sharp(src)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outCard)
}

async function copyLogoAndIcons() {
  const logoLight = path.join(raw, '01. Logo/ADXCHANGE_Horizontallogo.png')
  const logoDark = path.join(raw, '01. Logo/ADXCHANGE_HorizontallogoW.png')
  const icon = path.join(raw, '01. Logo/ADXCHANGE_Icon.png')
  await ensureDir(path.join(publicDir, 'brand'))
  await fs.copyFile(logoLight, path.join(publicDir, 'brand/logo-light.png'))
  await fs.copyFile(logoDark, path.join(publicDir, 'brand/logo-dark.png'))

  const sizes = [16, 32, 180, 192, 512]
  for (const size of sizes) {
    const name =
      size === 180
        ? 'apple-touch-icon.png'
        : size === 16 || size === 32
          ? `favicon-${size}.png`
          : `icon-${size}.png`
    await sharp(icon)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, name))
  }
  // favicon.ico as 32 png copy for simplicity
  await fs.copyFile(path.join(publicDir, 'favicon-32.png'), path.join(publicDir, 'favicon.ico'))
}

async function makeOg(src, outPath, label) {
  const base = sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: '#9B1B30',
    },
  })
  try {
    const overlay = await sharp(src)
      .rotate()
      .resize(1200, 630, { fit: 'cover' })
      .modulate({ brightness: 0.7 })
      .toBuffer()
    await sharp(overlay)
      .composite([
        {
          input: Buffer.from(
            `<svg width="1200" height="630"><rect width="1200" height="220" y="410" fill="rgba(31,20,22,0.75)"/><text x="48" y="520" font-family="Arial Black, sans-serif" font-size="48" fill="#FAF6F2">${label.replace(/[<>&]/g, '')}</text></svg>`,
          ),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 85 })
      .toFile(outPath)
  } catch {
    await base.jpeg({ quality: 85 }).toFile(outPath)
  }
}

async function main() {
  await ensureDir(seedMedia)
  await ensureDir(path.join(seedMedia, 'projects'))
  await ensureDir(path.join(seedMedia, 'services'))
  await ensureDir(path.join(seedMedia, 'hero'))
  await ensureDir(path.join(publicDir, 'og'))

  console.log('Preparing logos & favicons...')
  await copyLogoAndIcons()

  for (const project of PROJECT_MAP) {
    const outDir = path.join(seedMedia, 'projects', project.slug)
    await ensureDir(outDir)
    let files = []
    for (const dir of project.dirs) {
      files.push(...(await listImages(path.join(raw, dir))))
    }
    if (project.include) {
      files = files.filter((f) => project.include.some((re) => re.test(path.basename(f))))
    }
    // Prefer cover first
    files.sort((a, b) => {
      const aPref = path.basename(a) === project.preferredCover ? -1 : 0
      const bPref = path.basename(b) === project.preferredCover ? -1 : 0
      return aPref - bPref || path.basename(a).localeCompare(path.basename(b))
    })
    files = files.slice(0, project.max)
    console.log(`${project.slug}: ${files.length} images`)
    let i = 1
    for (const file of files) {
      const n = String(i).padStart(2, '0')
      await processImage(
        file,
        path.join(outDir, `${n}.webp`),
        path.join(outDir, `${n}-card.webp`),
      )
      i += 1
    }
    if (files[0]) {
      await makeOg(files[0], path.join(publicDir, 'og', `${project.slug}.jpg`), project.slug)
    }
  }

  for (const svc of SERVICE_IMAGES) {
    const src = path.join(raw, svc.src)
    try {
      await sharp(src)
        .rotate()
        .resize({ width: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(seedMedia, svc.out))
      console.log(`service image: ${svc.out}`)
    } catch (e) {
      console.warn(`skip service image ${svc.out}:`, e.message)
    }
  }

  for (const hero of HERO_CANDIDATES) {
    const src = path.join(raw, hero.src)
    try {
      await sharp(src)
        .rotate()
        .resize({ width: 2400, height: 1600, fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(path.join(seedMedia, 'hero', `${hero.name}.webp`))
      if (hero.fallbackNote) {
        console.log(`hero ${hero.name}: FALLBACK (exact banner name missing)`)
      } else {
        console.log(`hero ${hero.name}: ok`)
      }
    } catch (e) {
      console.warn(`hero ${hero.name} missing:`, e.message)
    }
  }

  // Home OG — use first hero
  const homeHero = path.join(seedMedia, 'hero/roadshow-xe-buyt-2-tang.webp')
  await makeOg(homeHero, path.join(publicDir, 'og/home.jpg'), 'ADX. Không thể không thấy.')

  // Manifest of cover choices for seed
  const manifest = {
    covers: Object.fromEntries(PROJECT_MAP.map((p) => [p.slug, p.preferredCover])),
    heroFallbacks: HERO_CANDIDATES.filter((h) => h.fallbackNote).map((h) => h.name),
  }
  await fs.writeFile(path.join(seedMedia, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log('Done. Wrote seed-media/ and public assets.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
