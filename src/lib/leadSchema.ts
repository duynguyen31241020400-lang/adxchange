import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().trim().min(1, 'Nhập họ tên').max(120),
  phone: z
    .string()
    .trim()
    .min(8, 'Số điện thoại không hợp lệ')
    .max(20)
    .regex(/^[0-9+\s()-]+$/, 'Số điện thoại không hợp lệ'),
  email: z.string().trim().email('Email không hợp lệ').optional().or(z.literal('')),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  serviceId: z.string().optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Cần đồng ý xử lý dữ liệu' }),
  }),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
  sourcePage: z.string().optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
