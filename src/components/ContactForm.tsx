'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { submitLead } from '@/actions/submitLead'

export function ContactForm({
  services,
  variant = 'default',
}: {
  services: { id: string | number; name?: string | null }[]
  variant?: 'default' | 'onRuby'
}) {
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({})
  const [pending, start] = useTransition()
  const onRuby = variant === 'onRuby'
  const inputClass = onRuby ? 'input input-on-ruby' : 'input'
  const selectClass = onRuby ? 'select input-on-ruby' : 'select'
  const textareaClass = onRuby ? 'textarea input-on-ruby' : 'textarea'
  const labelClass = onRuby ? 'mb-2 block text-small !text-white/80' : 'text-small mb-2 block'
  const errorClass = onRuby ? 'mt-1 text-small font-semibold !text-white' : 'mt-1 text-small font-semibold !text-[var(--ruby)]'

  if (done) {
    return <p className="text-h3">Đã nhận. ADX gọi lại trong 24 giờ làm việc.</p>
  }

  return (
    <form
      className="space-y-6"
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

      <Field label="Họ tên" name="name" required error={errors.name?.[0]} className={inputClass} labelClass={labelClass} errorClass={errorClass} />
      <Field label="Số điện thoại" name="phone" required error={errors.phone?.[0]} className={inputClass} labelClass={labelClass} errorClass={errorClass} />
      <Field label="Email" name="email" type="email" error={errors.email?.[0]} className={inputClass} labelClass={labelClass} errorClass={errorClass} />
      <Field label="Công ty" name="company" error={errors.company?.[0]} className={inputClass} labelClass={labelClass} errorClass={errorClass} />

      <div>
        <label className={labelClass} htmlFor="serviceId">
          Dịch vụ
        </label>
        <select id="serviceId" name="serviceId" className={selectClass}>
          <option value="">—</option>
          {services.map((s) => (
            <option key={s.id} value={String(s.id)}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="message">
          Nội dung
        </label>
        <textarea id="message" name="message" className={textareaClass} />
      </div>

      <label className={`flex items-start gap-3 text-small ${onRuby ? '!text-white/80' : ''}`}>
        <input type="checkbox" name="consent" className="mt-1" required />
        <span>
          Tôi đồng ý để ADX dùng thông tin trên để liên hệ tư vấn, theo{' '}
          <Link href="/chinh-sach-bao-mat" className="underline">
            Chính sách bảo mật
          </Link>
          .
        </span>
      </label>
      {errors.consent?.[0] ? <p className={errorClass} role="alert">{errors.consent[0]}</p> : null}

      <button type="submit" className={onRuby ? 'btn btn-on-ruby' : 'btn'} disabled={pending}>
        {pending ? 'Đang gửi…' : (
          <>
            Gửi yêu cầu <span className="btn-arrow">→</span>
          </>
        )}
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
  className,
  labelClass,
  errorClass,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string
  className: string
  labelClass: string
  errorClass: string
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={className}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error ? (
        <p id={`${name}-error`} className={errorClass} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
