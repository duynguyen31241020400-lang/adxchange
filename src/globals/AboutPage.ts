import type { GlobalConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/lib/access'
import { revalidateGlobals } from '@/hooks/revalidate'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Trang giới thiệu',
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobals],
  },
  fields: [
    { name: 'intro', type: 'textarea', label: 'Đoạn giới thiệu' },
    { name: 'vision', type: 'textarea', label: 'Tầm nhìn' },
    { name: 'mission', type: 'textarea', label: 'Sứ mệnh' },
    {
      name: 'values',
      type: 'array',
      label: 'Giá trị',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
    {
      name: 'milestones',
      type: 'array',
      label: 'Cột mốc',
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'content', type: 'textarea', required: true },
      ],
    },
    {
      name: 'team',
      type: 'array',
      label: 'Đội ngũ',
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'name', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
      ],
    },
  ],
}
