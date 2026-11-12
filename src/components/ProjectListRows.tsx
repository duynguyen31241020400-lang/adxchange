'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@/lib/useGSAP'

type Row = {
  id: string | number
  slug?: string | null
  name?: string | null
  clientLabel?: string | null
  year?: number | null
  coverUrl?: string | null
}

export function ProjectListRows({ projects }: { projects: Row[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | number | null>(null)
  const xTo = useRef<((v: number) => void) | null>(null)
  const yTo = useRef<((v: number) => void) | null>(null)

  useGSAP(() => {
    if (!imgRef.current) return
    xTo.current = gsap.quickTo(imgRef.current, 'x', { duration: 0.35, ease: 'power3' })
    yTo.current = gsap.quickTo(imgRef.current, 'y', { duration: 0.35, ease: 'power3' })
  }, [])

  return (
    <section className="section-white">
      <div className="container py-20">
        <h2 className="text-h3 text-center !text-[var(--ruby)]">Tất cả dự án</h2>
        <div
          ref={wrapRef}
          className="relative mt-12"
          onMouseMove={(e) => {
            if (!wrapRef.current) return
            const rect = wrapRef.current.getBoundingClientRect()
            xTo.current?.(e.clientX - rect.left + 24)
            yTo.current?.(e.clientY - rect.top - 80)
          }}
        >
          <div
            ref={imgRef}
            className="pointer-events-none absolute top-0 left-0 z-10 hidden h-40 w-56 overflow-hidden opacity-0 transition-opacity md:block"
            style={{ opacity: active != null ? 1 : 0 }}
            aria-hidden="true"
          >
            {projects.map((p) =>
              p.coverUrl && p.id === active ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={p.id} src={p.coverUrl} alt="" className="h-full w-full object-cover" />
              ) : null,
            )}
          </div>

          <ul>
            {projects.map((p) => (
              <li key={p.id} className="border-t border-[var(--line)] last:border-b">
                <Link
                  href={`/du-an/${p.slug}`}
                  className="group flex flex-col gap-1 py-5 md:flex-row md:items-center md:justify-between md:gap-6"
                  onMouseEnter={() => setActive(p.id)}
                  onMouseLeave={() => setActive(null)}
                >
                  <span className="text-[28px] leading-tight text-[var(--ink)] transition group-hover:translate-x-2 group-hover:text-[var(--ruby)] md:text-[28px]">
                    {p.name}
                  </span>
                  <span className="flex items-center gap-3 text-small">
                    <span>
                      {[p.clientLabel, p.year].filter(Boolean).join(' · ')}
                    </span>
                    <span aria-hidden="true" className="text-[var(--ruby)]">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
