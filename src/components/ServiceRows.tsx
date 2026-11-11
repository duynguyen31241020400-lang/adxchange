'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@/lib/useGSAP'
import { mediaUrl } from '@/lib/media'

type ServiceLike = {
  slug?: string | null
  name?: string | null
  order?: number | null
  image?: unknown
  relatedImageUrl?: string | null
}

export function ServiceRows({ services }: { services: ServiceLike[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const xTo = useRef<((v: number) => void) | null>(null)
  const yTo = useRef<((v: number) => void) | null>(null)

  useGSAP(() => {
    if (!imgRef.current) return
    xTo.current = gsap.quickTo(imgRef.current, 'x', { duration: 0.4, ease: 'power3' })
    yTo.current = gsap.quickTo(imgRef.current, 'y', { duration: 0.4, ease: 'power3' })
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseMove={(e) => {
        if (!wrapRef.current) return
        const rect = wrapRef.current.getBoundingClientRect()
        xTo.current?.(e.clientX - rect.left - 180)
        yTo.current?.(e.clientY - rect.top - 225)
      }}
    >
      <div
        ref={imgRef}
        className="pointer-events-none absolute top-0 left-0 z-10 hidden h-[450px] w-[360px] overflow-hidden opacity-0 transition-opacity md:block"
        style={{ opacity: active ? 1 : 0 }}
        aria-hidden="true"
      >
        {services.map((s) => {
          const src = s.relatedImageUrl || mediaUrl(s.image)
          if (!src || s.slug !== active) return null
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s.slug} src={src} alt="" className="h-full w-full object-cover" />
          )
        })}
      </div>

      <ul>
        {services.map((s, i) => (
          <li key={s.slug} className="border-t border-[var(--line)] last:border-b">
            <Link
              href={`/dich-vu/${s.slug}`}
              className="group flex items-center justify-between gap-4 py-5 md:py-7"
              onMouseEnter={() => setActive(s.slug || null)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="flex items-baseline gap-4 md:gap-8">
                <span className="text-index">{String(s.order ?? i + 1).padStart(2, '0')}</span>
                <span
                  className="text-service transition-colors"
                  style={{ color: active === s.slug ? 'var(--primary-text)' : undefined }}
                >
                  {s.name}
                </span>
              </span>
              <span aria-hidden="true" className="text-h3">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
