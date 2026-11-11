import type { CollectionConfig } from 'payload'
import { anyone, isAdminOrEditor } from '@/lib/access'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Câu hỏi', plural: 'Câu hỏi thường gặp' },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
    listSearchableFields: ['question'],
  },
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'question', type: 'text', label: 'Câu hỏi', required: true },
    { name: 'answer', type: 'textarea', label: 'Trả lời', required: true },
    { name: 'order', type: 'number', label: 'Thứ tự', defaultValue: 0 },
  ],
}
