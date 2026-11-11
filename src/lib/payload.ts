import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'

export { mediaUrl, mediaAlt } from './media'

function hasDatabaseUri() {
  return Boolean(process.env.DATABASE_URI || process.env.DATABASE_URL)
}

export async function getPayloadClient() {
  if (!hasDatabaseUri()) {
    throw new Error('DATABASE_URI is not configured')
  }
  return getPayload({ config })
}

export async function getDraft() {
  const { isEnabled } = await draftMode()
  return isEnabled
}

export async function getSiteSettings() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 2 })
}

export async function getPublishedProjects(options?: {
  limit?: number
  serviceSlug?: string
  featured?: boolean
}) {
  const payload = await getPayloadClient()
  const draft = await getDraft()
  const and: Where[] = []
  if (options?.serviceSlug) {
    const services = await payload.find({
      collection: 'services',
      where: { slug: { equals: options.serviceSlug } },
      limit: 1,
      draft,
      overrideAccess: draft,
    })
    const id = services.docs[0]?.id
    if (id) and.push({ services: { contains: id } })
  }
  if (options?.featured) and.push({ featured: { equals: true } })

  return payload.find({
    collection: 'projects',
    where: and.length ? { and } : undefined,
    sort: options?.featured ? 'featuredOrder' : '-updatedAt',
    limit: options?.limit ?? 50,
    depth: 2,
    draft,
    overrideAccess: draft,
  })
}

export async function getProjectBySlug(slug: string) {
  const payload = await getPayloadClient()
  const draft = await getDraft()
  const result = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    draft,
    overrideAccess: draft,
  })
  return result.docs[0] || null
}

export async function getServices() {
  const payload = await getPayloadClient()
  const draft = await getDraft()
  return payload.find({
    collection: 'services',
    sort: 'order',
    limit: 50,
    depth: 1,
    draft,
    overrideAccess: draft,
  })
}

export async function getServiceBySlug(slug: string) {
  const payload = await getPayloadClient()
  const draft = await getDraft()
  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft,
    overrideAccess: draft,
  })
  return result.docs[0] || null
}

export async function getFaqs() {
  const payload = await getPayloadClient()
  return payload.find({ collection: 'faqs', sort: 'order', limit: 50 })
}

export async function getAbout() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about-page', depth: 2 })
}

export async function getPrivacy() {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'privacy-page', depth: 1 })
}

export async function getClients() {
  const payload = await getPayloadClient()
  return payload.find({ collection: 'clients', limit: 100, sort: 'name', depth: 1 })
}

