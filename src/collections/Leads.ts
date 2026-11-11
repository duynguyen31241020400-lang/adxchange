import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '@/lib/access'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Yêu cầu', plural: 'Yêu cầu báo giá' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'status', 'createdAt'],
    listSearchableFields: ['name', 'phone', 'email'],
  },
  access: {
    read: isAdminOrEditor,
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Họ tên', required: true, access: { update: () => false } },
    { name: 'phone', type: 'text', label: 'Số điện thoại', required: true, access: { update: () => false } },
    { name: 'email', type: 'email', label: 'Email', access: { update: () => false } },
    { name: 'company', type: 'text', label: 'Công ty', access: { update: () => false } },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Dịch vụ',
      access: { update: () => false },
    },
    { name: 'message', type: 'textarea', label: 'Nội dung', access: { update: () => false } },
    { name: 'sourcePage', type: 'text', label: 'Nguồn trang', access: { update: () => false } },
    {
      name: 'consentAt',
      type: 'date',
      label: 'Đã đồng ý lúc',
      admin: { date: { displayFormat: 'dd/MM/yyyy HH:mm' } },
      access: { update: () => false },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      defaultValue: 'new',
      options: [
        { label: 'Mới', value: 'new' },
        { label: 'Đã liên hệ', value: 'contacted' },
        { label: 'Đã báo giá', value: 'quoted' },
        { label: 'Bỏ qua', value: 'skipped' },
      ],
    },
    { name: 'internalNote', type: 'textarea', label: 'Ghi chú nội bộ' },
    {
      name: 'ipHash',
      type: 'text',
      label: 'Hash IP',
      admin: { readOnly: true, position: 'sidebar' },
      access: { update: () => false },
    },
  ],
}
