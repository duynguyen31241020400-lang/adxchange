import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadSeedEnv } from './loadEnv'
import { servicesSeed } from './services'
import { projectsSeed } from './projects'
import {
  aboutSeed,
  clientLogoFiles,
  clientNames,
  faqsSeed,
  privacyPlainSections,
  siteSettingsSeed,
} from './site'

// Must run before dynamic-importing payload.config (ESM imports are hoisted).
loadSeedEnv()

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const seedMedia = path.join(root, 'seed-media')

type PayloadClient = Awaited<ReturnType<typeof import('payload').getPayload>>

async function uploadFile(
  payload: PayloadClient,
  relativePath: string,
  alt: string,
) {
  const filePath = path.join(seedMedia, relativePath)
  const data = await fs.readFile(filePath)
  const filename = path.basename(relativePath)
  const mimeType = filename.endsWith('.png')
    ? 'image/png'
    : filename.endsWith('.jpg') || filename.endsWith('.jpeg')
      ? 'image/jpeg'
      : 'image/webp'

  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: mimeType,
      name: filename,
      size: data.byteLength,
    },
    overrideAccess: true,
  })
  return media
}

function plainToLexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              text,
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr' as const,
        },
      ],
      direction: 'ltr' as const,
    },
  }
}

function privacyToLexical() {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: privacyPlainSections.flatMap((section) => [
        {
          type: 'heading',
          tag: 'h2',
          format: '' as const,
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              text: section.heading,
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr' as const,
        },
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              text: section.body,
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr' as const,
        },
      ]),
      direction: 'ltr' as const,
    },
  }
}

async function clearCollection(payload: PayloadClient, slug: 'projects' | 'services' | 'clients' | 'faqs' | 'media' | 'leads') {
  const existing = await payload.find({ collection: slug, limit: 200, overrideAccess: true })
  for (const doc of existing.docs) {
    await payload.delete({ collection: slug, id: doc.id, overrideAccess: true })
  }
}

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding users...')
  const users = await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
  if (!users.docs.length) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'august@adxchange.agency',
        password: 'ChangeMeADX2026!',
        name: 'August',
        role: 'admin',
      },
      overrideAccess: true,
    })
    console.log('Created admin august@adxchange.agency / ChangeMeADX2026!')
  }

  console.log('Clearing content collections...')
  await clearCollection(payload, 'projects')
  await clearCollection(payload, 'services')
  await clearCollection(payload, 'faqs')
  await clearCollection(payload, 'clients')
  // Keep media to avoid orphan issues — clear media too for clean seed
  await clearCollection(payload, 'media')

  console.log('Seeding clients...')
  const clientIdByName = new Map<string, string | number>()
  for (const name of clientNames) {
    const logoFile = clientLogoFiles[name]
    let logoId: string | number | undefined
    if (logoFile) {
      const logo = await uploadFile(payload, logoFile, `Logo ${name}`)
      logoId = logo.id
    }
    const c = await payload.create({
      collection: 'clients',
      data: {
        name,
        logo: logoId,
        showLogo: Boolean(logoId),
      },
      overrideAccess: true,
    })
    clientIdByName.set(name, c.id)
  }

  console.log('Seeding services...')
  const serviceIdBySlug = new Map<string, string | number>()
  for (const s of servicesSeed) {
    let imageId: string | number | undefined
    if ('imageFile' in s && s.imageFile) {
      const media = await uploadFile(payload, s.imageFile, s.imageAlt || s.name)
      imageId = media.id
    }
    const doc = await payload.create({
      collection: 'services',
      data: {
        name: s.name,
        slug: s.slug,
        order: s.order,
        description: s.description,
        image: imageId,
        _status: 'published',
      },
      overrideAccess: true,
      draft: false,
    })
    serviceIdBySlug.set(s.slug, doc.id)
  }

  console.log('Seeding projects...')
  for (const p of projectsSeed) {
    let coverId: string | number | undefined
    const gallery: { image: string | number }[] = []

    if (p.coverFile && p.coverAlt) {
      const cover = await uploadFile(payload, p.coverFile, p.coverAlt)
      coverId = cover.id
    }

    if (p.galleryDir) {
      const dir = path.join(seedMedia, p.galleryDir)
      const files = (await fs.readdir(dir))
        .filter((f) => /^\d{2}\.webp$/.test(f))
        .sort()
      let i = 0
      for (const file of files) {
        // skip 01 if already used as cover — still include in gallery
        const alt = p.galleryAlts[i] || `${p.name} — ảnh ${i + 1}`
        const media = await uploadFile(payload, path.join(p.galleryDir, file), alt)
        gallery.push({ image: media.id })
        i += 1
      }
    }

    const clientIds = p.clientNames
      .map((n) => clientIdByName.get(n))
      .filter((id): id is string | number => id !== undefined)

    await payload.create({
      collection: 'projects',
      data: {
        name: p.name,
        slug: p.slug,
        clients: clientIds,
        clientLabel: p.clientLabel,
        year: p.year ?? undefined,
        services: p.serviceSlugs.map((s) => serviceIdBySlug.get(s)).filter(Boolean) as (string | number)[],
        coverImage: coverId,
        gallery,
        context: plainToLexical(p.context),
        approach: plainToLexical(p.approach),
        results: p.results,
        resultText: p.resultText ?? undefined,
        videoUrl: p.videoUrl ?? undefined,
        featured: p.featured,
        featuredOrder: p.featuredOrder,
        _status: 'published',
      },
      overrideAccess: true,
      draft: false,
    })
  }

  console.log('Seeding FAQs...')
  for (const f of faqsSeed) {
    await payload.create({
      collection: 'faqs',
      data: f,
      overrideAccess: true,
    })
  }

  console.log('Seeding site settings / about / privacy...')
  const heroBanners = []
  for (const b of siteSettingsSeed.heroBanners) {
    const media = await uploadFile(payload, b.file, b.alt)
    heroBanners.push({ image: media.id, caption: b.caption })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      ...siteSettingsSeed,
      heroBanners,
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      intro: aboutSeed.intro,
      vision: aboutSeed.vision,
      mission: aboutSeed.mission,
      values: aboutSeed.values,
      milestones: aboutSeed.milestones,
      team: aboutSeed.team.map((t) => ({ name: t.name, title: t.title })),
    },
    overrideAccess: true,
  })

  await payload.updateGlobal({
    slug: 'privacy-page',
    data: {
      content: privacyToLexical(),
    },
    overrideAccess: true,
  })

  console.log('Seed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
