import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '@/lib/access'
import { revalidateGlobals } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cài đặt chung',
  access: {
    read: anyone,
    update: isAdmin,
  },
  hooks: {
    afterChange: [revalidateGlobals],
  },
  fields: [
    { name: 'displayName', type: 'text', label: 'Tên hiển thị', defaultValue: 'ADX' },
    { name: 'slogan', type: 'text', label: 'Slogan', required: true },
    {
      name: 'heroBanners',
      type: 'array',
      label: 'Banner hero',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text', label: 'Câu chữ', required: true },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Số liệu',
      fields: [
        { name: 'value', type: 'text', label: 'Số', required: true },
        { name: 'label', type: 'text', label: 'Nhãn', required: true },
      ],
    },
    { name: 'hotline', type: 'text', label: 'Hotline' },
    { name: 'hotlineLabel', type: 'text', label: 'Hotline (hiển thị)' },
    { name: 'zalo', type: 'text', label: 'Zalo' },
    { name: 'zaloUrl', type: 'text', label: 'Zalo URL' },
    { name: 'email', type: 'email', label: 'Email' },
    { name: 'officeAddress', type: 'textarea', label: 'Văn phòng' },
    { name: 'branchAddress', type: 'textarea', label: 'Chi nhánh' },
    {
      name: 'social',
      type: 'array',
      label: 'Mạng xã hội',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'legalName', type: 'text', label: 'Pháp nhân' },
    { name: 'taxId', type: 'text', label: 'Mã số thuế' },
    { name: 'foundedYear', type: 'text', label: 'Năm thành lập' },
    {
      name: 'capabilityFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Hồ sơ năng lực',
    },
    { name: 'heroSubline', type: 'text', label: 'Dòng phụ hero' },
    {
      name: 'heroVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Video hero (tùy chọn)',
      admin: {
        description: 'Video dưới 15 giây, đã nén. mp4/webm, tối đa 15MB.',
      },
      filterOptions: {
        mimeType: { in: ['video/mp4', 'video/webm'] },
      },
    },
  ],
}
