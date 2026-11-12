'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/lib/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export type CreditProject = {
  id: string | number
  slug?: string | null
  name?: string | null
  clientLabel?: string | null
  year?: number | null
  summary?: string | null
  coverUrl?: string | null
}

const isPlaceholder = (s?: string | null) => !s || /^\s*\[.*\]\s*$/.test(s)

/**
 * /du-an — projects roll upward like end credits: alternating left/right frames,
 * the right column drifts a little faster, a sticky centre counter names the
 * frame passing the middle of the screen. Plain document scroll, nothing pinned.
 */
export function ProjectCredits({ projects }: { projects: CreditProject[] }) {
  const rootRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const count = projects.length

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-credit]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index || 0))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [count])

  useGSAP(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(max-width: 768px)').matches) return
    root.querySelectorAll<HTMLElement>('[data-credit]').forEach((el, i) => {
      const drift = i % 2 ? 140 : 60
      gsap.fromTo(
        el,
        { y: drift },
        {
          y: -drift,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
    })
  }, [count])

  if (!count) return null
  const current = projects[active]

  return (
    <section ref={rootRef} className="section-ruby fade-in relative overflow-x-clip" aria-label="Danh sách dự án">
      <div className="container relative pt-16 pb-24 md:pt-28 md:pb-48">
        {/* Sticky centre credit: which frame is passing the middle of the screen */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[24%] -translate-x-1/2 md:block" aria-hidden="true">
          <div className="sticky top-[46vh] text-center">
            <p className="text-stat !text-white">
              {String(active + 1).padStart(2, '0')}
              <span className="text-white/60"> / {String(count).padStart(2, '0')}</span>
            </p>
            <p className="mt-3 text-small !text-white/80 uppercase tracking-[0.08em]">{current?.clientLabel}</p>
          </div>
        </div>

        <ol className="relative flex flex-col gap-20 md:gap-0">
          {projects.map((p, i) => {
            const href = `/du-an/${p.slug}`
            const meta = [p.clientLabel, p.year].filter(Boolean).join(' · ')
            const right = i % 2 === 1
            return (
              <li
                key={p.id}
                data-credit
                data-index={i}
                className={`w-full md:w-[38%] ${right ? 'md:ml-auto' : ''} ${i > 0 ? 'md:-mt-[14vh]' : ''}`}
              >
                <Link href={href} tabIndex={-1} aria-hidden="true" className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ruby-deep)]">
                    {p.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverUrl}
                        alt=""
                        loading={i < 2 ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-end p-6">
                        <span className="text-h2 !text-white">{p.name}</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="mt-6">
                  <p className="text-index !text-white/80">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="text-h2 mt-3">
                    <Link href={href} className="hover:underline hover:underline-offset-[0.12em]">
                      {p.name}
                    </Link>
                  </h2>
                  {meta ? <p className="mt-2 text-small !text-white/80">{meta}</p> : null}
                  {!isPlaceholder(p.summary) ? <p className="mt-4 max-w-md text-white">{p.summary}</p> : null}
                  <Link href={href} className="btn btn-on-ruby mt-6">
                    Xem dự án <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
