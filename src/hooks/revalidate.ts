import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateProject: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  try {
    revalidatePath('/')
    revalidatePath('/du-an')
    revalidatePath('/sitemap.xml')
    if (doc?.slug) revalidatePath(`/du-an/${doc.slug}`)
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
      revalidatePath(`/du-an/${previousDoc.slug}`)
    }
    // Related services
    const services = Array.isArray(doc?.services) ? doc.services : []
    for (const s of services) {
      const slug = typeof s === 'object' ? s?.slug : null
      if (slug) revalidatePath(`/dich-vu/${slug}`)
    }
    revalidatePath('/dich-vu')
    revalidatePath('/tim-kiem')
  } catch (e) {
    req.payload.logger.warn(`revalidateProject failed: ${e}`)
  }
  return doc
}

export const revalidateService: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  try {
    revalidatePath('/')
    revalidatePath('/dich-vu')
    revalidatePath('/sitemap.xml')
    if (doc?.slug) revalidatePath(`/dich-vu/${doc.slug}`)
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
      revalidatePath(`/dich-vu/${previousDoc.slug}`)
    }
  } catch (e) {
    req.payload.logger.warn(`revalidateService failed: ${e}`)
  }
  return doc
}

export const revalidateGlobals: GlobalAfterChangeHook = ({ doc, req, global }) => {
  try {
    revalidatePath('/')
    if (global.slug === 'about-page') {
      revalidatePath('/gioi-thieu')
      revalidatePath('/gioi-thieu/cau-chuyen')
      revalidatePath('/gioi-thieu/doi-ngu')
      revalidatePath('/gioi-thieu/khach-hang')
    }
    if (global.slug === 'privacy-page') {
      revalidatePath('/chinh-sach-bao-mat')
    }
    if (global.slug === 'site-settings') {
      revalidatePath('/lien-he')
    }
  } catch (e) {
    req.payload.logger.warn(`revalidateGlobals failed: ${e}`)
  }
  return doc
}
