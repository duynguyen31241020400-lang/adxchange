import type { CollectionConfig } from 'payload'
import { isAdminOrEditor, publishedOnly } from '@/lib/access'
import { slugify } from '@/lib/normalize'
import { revalidateService } from '@/hooks/revalidate'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Dịch vụ', plural: 'Dịch vụ' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', '_status', 'updatedAt'],
    listSearchableFields: ['name'],
  },
  versions: {
    drafts: {
      schedulePublish: true,
    },
  },
  access: {
    read: publishedOnly,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateService],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Tên', required: true },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return slugify(String(value))
            if (data?.name) return slugify(String(data.name))
            return value
          },
        ],
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự',
      required: true,
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh',
    },
  ],
}
