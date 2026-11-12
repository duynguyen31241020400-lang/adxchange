'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/lib/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export type FilmProject = {
  id: string | number
  slug?: string | null
  name?: string | null
  clientLabel?: string | null
  year?: number | null
  summary?: string | null
  coverUrl?: string | null
}

export function FilmReel({ projects }: { projects: FilmProject[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(true)
  const items = useMemo(() => projects, [projects])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)')
    const apply = () => setPinned(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useGSAP(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || !pinned || items.length === 0) return

    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-frame]'))
    const amount = Math.max(0, track.scrollWidth - section.clientWidth)

    gsap.to(track, {
      x: -amount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(amount, section.clientWidth)}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(items.length - 1, Math.round(self.progress * (items.length - 1)))
          setActive(idx)
          cards.forEach((card, i) => {
            const on = i === idx
            gsap.to(card, {
              opacity: on ? 1 : 0.6,
              scale: on ? 1 : 0.92,
              duration: 0.2,
              overwrite: true,
            })
          })
        },
      },
    })
  }, [pinned, items.length])

  const go = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(items.length - 1, active + dir))
    setActive(next)
    const track = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return
    const card = track.querySelectorAll<HTMLElement>('[data-frame]')[next]
    if (!card) return
    if (!pinned) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      return
    }
    const st = ScrollTrigger.getAll().find((t) => t.trigger === section)
    if (!st) return
    const progress = items.length <= 1 ? 0 : next / (items.length - 1)
    window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: 'smooth' })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, pinned, items.length])

  if (!items.length) return null

  return (
    <section ref={sectionRef} className="section-ruby">
      <div className="film-sprocket" aria-hidden="true" />
      <div
        ref={trackRef}
        className={`flex gap-6 px-4 py-10 md:gap-10 md:px-10 ${
          pinned ? '' : 'overflow-x-auto snap-x snap-mandatory'
        }`}
      >
        {items.map((p, i) => (
          <article
            key={p.id}
            data-frame
            className="w-[84vw] shrink-0 snap-center md:w-[62vw]"
            style={{ opacity: i === active ? 1 : 0.6, transform: `scale(${i === active ? 1 : 0.92})` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--ruby-deep)]">
              {p.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverUrl} alt={p.name || ''} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-stat opacity-40">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="text-h2 mt-2">{p.name}</h2>
                <p className="mt-2 text-small !text-white/75">
                  {[p.clientLabel, p.year].filter(Boolean).join(' · ')}
                </p>
                {p.summary ? <p className="mt-4 max-w-xl text-[15px] text-white/90">{p.summary}</p> : null}
              </div>
              <Link href={`/du-an/${p.slug}`} className="btn btn-on-ruby">
                Xem dự án <span className="btn-arrow">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="film-sprocket" aria-hidden="true" />
      <div className="container flex items-center justify-between py-6">
        <p className="text-index !text-white/80">
          {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn btn-on-ruby !min-h-10 !px-3" aria-label="Khung trước" onClick={() => go(-1)}>
            ←
          </button>
          <button type="button" className="btn btn-on-ruby !min-h-10 !px-3" aria-label="Khung sau" onClick={() => go(1)}>
            →
          </button>
        </div>
      </div>
    </section>
  )
}
