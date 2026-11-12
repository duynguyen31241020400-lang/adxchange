import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Ảnh / File', plural: 'Media' },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'video/mp4', 'video/webm'],
    imageSizes: [
      { name: 'thumb', width: 400, height: 400, position: 'centre', formatOptions: { format: 'webp' } },
      { name: 'card', width: 1200, height: undefined, position: 'centre', formatOptions: { format: 'webp' } },
      { name: 'full', width: 2400, height: undefined, position: 'centre', formatOptions: { format: 'webp' } },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'webp' },
      },
    ],
    adminThumbnail: 'thumb',
  },
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        const file = req.file
        if (file && typeof file.size === 'number' && file.size > 15_000_000) {
          throw new Error('File vượt quá 15MB')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt (bắt buộc)',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Chú thích',
    },
  ],
}
