import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/lib/access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: { singular: 'Khách hàng', plural: 'Khách hàng' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'showLogo', 'updatedAt'],
    listSearchableFields: ['name'],
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Tên', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
    {
      name: 'showLogo',
      type: 'checkbox',
      label: 'Hiện logo trên web',
      defaultValue: false,
    },
  ],
}
