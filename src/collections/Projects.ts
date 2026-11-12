import type { CollectionConfig } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { isAdminOrEditor, publishedOnly } from '@/lib/access'
import { slugify } from '@/lib/normalize'
import { revalidateProject } from '@/hooks/revalidate'

const simpleRichText = lexicalEditor({
  features: () => [
    BoldFeature(),
    ItalicFeature(),
    LinkFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
  ],
})

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Dự án', plural: 'Dự án' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['coverImage', 'name', 'year', '_status', 'updatedAt'],
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
    afterChange: [revalidateProject],
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
      name: 'clients',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      label: 'Khách hàng',
    },
    {
      name: 'clientLabel',
      type: 'text',
      label: 'Nhãn khách hàng (hiển thị)',
      admin: {
        description: 'Chuỗi hiển thị trên thẻ, ví dụ "Toshiba × Điện Máy Xanh"',
      },
    },
    {
      name: 'year',
      type: 'number',
      label: 'Năm',
      admin: { position: 'sidebar' },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Dịch vụ',
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Tóm tắt nhanh',
      required: true,
      maxLength: 180,
      admin: {
        description: 'Tối đa 180 ký tự. Dùng cho cuộn phim dự án và mô tả SEO dự phòng.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh bìa',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      labels: { singular: 'Ảnh', plural: 'Ảnh' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'context',
      type: 'richText',
      label: 'Bối cảnh',
      editor: simpleRichText,
    },
    {
      name: 'approach',
      type: 'richText',
      label: 'Cách làm',
      editor: simpleRichText,
    },
    {
      name: 'results',
      type: 'array',
      label: 'Kết quả',
      fields: [
        { name: 'value', type: 'text', label: 'Số', required: true },
        { name: 'label', type: 'text', label: 'Chỉ số', required: true },
      ],
    },
    {
      name: 'resultText',
      type: 'textarea',
      label: 'Kết quả (chữ, khi không có số)',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Nổi bật trên trang chủ',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredOrder',
      type: 'number',
      label: 'Thứ tự nổi bật',
      admin: { position: 'sidebar', condition: (_, siblingData) => Boolean(siblingData?.featured) },
    },
  ],
}
