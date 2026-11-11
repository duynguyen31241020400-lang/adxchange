import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

/** Avoid Postgres at `next build` (Vercel preview may lack DATABASE_URI). */
export const dynamic = 'force-dynamic'

const STATIC_ROUTES = [
  '',
  '/du-an',
  '/dich-vu',
  '/gioi-thieu',
  '/gioi-thieu/cau-chuyen',
  '/gioi-thieu/doi-ngu',
  '/gioi-thieu/khach-hang',
  '/lien-he',
  '/chinh-sach-bao-mat',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://adxchange.agency'
  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${site}${path || '/'}`,
    lastModified: new Date(),
  }))

  if (!process.env.DATABASE_URI && !process.env.DATABASE_URL) {
    return staticEntries
  }

  try {
    const payload = await getPayload({ config })
    const [projects, services] = await Promise.all([
      payload.find({
        collection: 'projects',
        limit: 200,
        depth: 0,
        select: { slug: true, updatedAt: true },
        overrideAccess: false,
      }),
      payload.find({
        collection: 'services',
        limit: 50,
        depth: 0,
        select: { slug: true, updatedAt: true },
        overrideAccess: false,
      }),
    ])

    return [
      ...staticEntries,
      ...projects.docs.map((p) => ({
        url: `${site}/du-an/${p.slug}`,
        lastModified: new Date(p.updatedAt),
      })),
      ...services.docs.map((s) => ({
        url: `${site}/dich-vu/${s.slug}`,
        lastModified: new Date(s.updatedAt),
      })),
    ]
  } catch {
    // Misconfigured env / DB down: still emit static routes.
    return staticEntries
  }
}
