import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { normalizeSearchText } from '@/lib/normalize'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adxchange.agency'

const hasR2 =
  Boolean(process.env.R2_BUCKET) &&
  Boolean(process.env.R2_ACCESS_KEY_ID) &&
  Boolean(process.env.R2_SECRET_ACCESS_KEY) &&
  Boolean(process.env.R2_ACCOUNT_ID)

export const plugins: Plugin[] = [
  seoPlugin({
    collections: ['projects', 'services'],
    globals: ['site-settings', 'about-page', 'privacy-page'],
    uploadsCollection: 'media',
    generateTitle: ({ doc }) => {
      const title = (doc as { name?: string; title?: string })?.name || (doc as { title?: string })?.title
      return title ? `${String(title).slice(0, 50)} | ADX` : 'ADX | Quảng cáo ngoài trời'
    },
    generateDescription: ({ doc }) => {
      const d = doc as { description?: string; clientLabel?: string; name?: string }
      if (d.description) return String(d.description).slice(0, 160)
      if (d.clientLabel && d.name) {
        return `Dự án ${d.name} cho ${d.clientLabel} — ADX, quảng cáo ngoài trời và roadshow tại TP.HCM.`
      }
      return 'ADX làm quảng cáo ngoài trời, roadshow và sự kiện tại TP. Hồ Chí Minh.'
    },
    generateURL: ({ doc, collectionSlug }) => {
      const slug = (doc as { slug?: string })?.slug
      if (!slug) return siteUrl
      if (collectionSlug === 'projects') return `${siteUrl}/du-an/${slug}`
      if (collectionSlug === 'services') return `${siteUrl}/dich-vu/${slug}`
      return siteUrl
    },
  }),
  searchPlugin({
    collections: ['projects', 'services', 'faqs'],
    defaultPriorities: {
      projects: 10,
      services: 20,
      faqs: 30,
    },
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        hidden: true,
      },
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'searchText',
          type: 'textarea',
          index: true,
          admin: { readOnly: true },
        },
        {
          name: 'titleNormalized',
          type: 'text',
          admin: { readOnly: true, position: 'sidebar' },
        },
        {
          name: 'kind',
          type: 'select',
          options: [
            { label: 'Project', value: 'projects' },
            { label: 'Service', value: 'services' },
            { label: 'FAQ', value: 'faqs' },
            { label: 'About', value: 'about' },
          ],
          admin: { position: 'sidebar' },
        },
        {
          name: 'clientLabel',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'href',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  }),
  ...(hasR2
    ? [
        s3Storage({
          collections: {
            media: {
              disableLocalStorage: true,
            },
          },
          bucket: process.env.R2_BUCKET as string,
          config: {
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            },
            region: 'auto',
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            forcePathStyle: true,
          },
          clientUploads: true,
        }),
      ]
    : []),
]

export { normalizeSearchText, siteUrl }
