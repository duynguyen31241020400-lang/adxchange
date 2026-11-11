'use server'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { leadSchema } from '@/lib/leadSchema'

const rate = new Map<string, { count: number; reset: number }>()

function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT || 'adx'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

export async function submitLead(formData: FormData) {
  const raw = {
    name: String(formData.get('name') || ''),
    phone: String(formData.get('phone') || ''),
    email: String(formData.get('email') || ''),
    company: String(formData.get('company') || ''),
    serviceId: String(formData.get('serviceId') || ''),
    message: String(formData.get('message') || ''),
    consent: formData.get('consent') === 'on' || formData.get('consent') === 'true',
    website: String(formData.get('website') || ''),
    sourcePage: String(formData.get('sourcePage') || '/lien-he'),
  }

  // honeypot
  if (raw.website) {
    return { ok: true as const }
  }

  const parsed = leadSchema.safeParse({ ...raw, consent: raw.consent ? true : undefined })
  if (!parsed.success) {
    return { ok: false as const, errors: parsed.error.flatten().fieldErrors }
  }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  const ipHash = hashIp(ip)
  const now = Date.now()
  const bucket = rate.get(ipHash)
  if (!bucket || bucket.reset < now) {
    rate.set(ipHash, { count: 1, reset: now + 60 * 60 * 1000 })
  } else if (bucket.count >= 5) {
    return { ok: false as const, errors: { phone: ['Quá nhiều yêu cầu. Thử lại sau 1 giờ.'] } }
  } else {
    bucket.count += 1
  }

  const payload = await getPayload({ config })
  await payload.create({
    collection: 'leads',
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      company: parsed.data.company || undefined,
      service: parsed.data.serviceId ? Number(parsed.data.serviceId) : undefined,
      message: parsed.data.message || undefined,
      sourcePage: parsed.data.sourcePage,
      consentAt: new Date().toISOString(),
      status: 'new',
      ipHash,
    },
    overrideAccess: true,
  })

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'ADX Web <noreply@adxchange.agency>',
        to: [process.env.LEAD_NOTIFY_EMAIL || 'cuong@adxchange.agency'],
        subject: `Yêu cầu mới từ ${parsed.data.name}`,
        text: `Họ tên: ${parsed.data.name}\nSĐT: ${parsed.data.phone}\nEmail: ${parsed.data.email}\nCông ty: ${parsed.data.company}\nNội dung: ${parsed.data.message}`,
      })
    } catch {
      /* optional */
    }
  }

  return { ok: true as const }
}
