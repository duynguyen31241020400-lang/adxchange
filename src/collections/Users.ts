import type { CollectionConfig } from 'payload'
import { adminField, isAdmin, isAdminOrEditor } from '@/lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Tài khoản', plural: 'Tài khoản' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    hidden: ({ user }) => user?.role !== 'admin',
  },
  auth: true,
  access: {
    read: isAdminOrEditor,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tên',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Vai trò',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Quản trị', value: 'admin' },
        { label: 'Biên tập', value: 'editor' },
      ],
      access: {
        update: adminField,
      },
    },
  ],
}
