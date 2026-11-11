'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { submitLead } from '@/actions/submitLead'

export function ContactForm({
  services,
}: {
  services: { id: string | number; name?: string | null }[]
}) {
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({})
  const [pending, start] = useTransition()

  if (done) {
    return <p className="text-h3">Đã nhận. ADX gọi lại trong 24 giờ làm việc.</p>
  }

  return (
    <form
      className="space-y-5"
      action={(fd) => {
        start(async () => {
          const res = await submitLead(fd)
          if (res.ok) setDone(true)
          else setErrors(res.errors || {})
        })
      }}
    >
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input type="hidden" name="sourcePage" value="/lien-he" />

      <Field label="Họ tên" name="name" required error={errors.name?.[0]} />
      <Field label="Số điện thoại" name="phone" required error={errors.phone?.[0]} />
      <Field label="Email" name="email" type="email" error={errors.email?.[0]} />
      <Field label="Công ty" name="company" error={errors.company?.[0]} />

      <div>
        <label className="text-small mb-2 block" htmlFor="serviceId">
          Dịch vụ
        </label>
        <select id="serviceId" name="serviceId" className="select">
          <option value="">—</option>
          {services.map((s) => (
            <option key={s.id} value={String(s.id)}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-small mb-2 block" htmlFor="message">
          Nội dung
        </label>
        <textarea id="message" name="message" className="textarea" />
      </div>

      <label className="flex items-start gap-3 text-small">
        <input type="checkbox" name="consent" className="mt-1" required />
        <span>
          Tôi đồng ý để ADX dùng thông tin trên để liên hệ tư vấn, theo{' '}
          <Link href="/chinh-sach-bao-mat" className="underline">
            Chính sách bảo mật
          </Link>
          .
        </span>
      </label>
      {errors.consent?.[0] ? <p className="text-small text-[var(--primary)]">{errors.consent[0]}</p> : null}

      <button type="submit" className="btn" disabled={pending}>
        {pending ? 'Đang gửi…' : 'Gửi yêu cầu →'}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  error,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
}) {
  return (
    <div>
      <label className="text-small mb-2 block" htmlFor={name}>
        {label}
        {required ? ' *' : ''}
      </label>
      <input id={name} name={name} type={type} className="input" required={required} placeholder="" />
      {error ? <p className="text-small mt-1 text-[var(--primary)]">{error}</p> : null}
    </div>
  )
}
