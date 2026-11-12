'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/lib/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export function MilestoneStrip({
  items,
}: {
  items: { year?: string | null; content?: string | null }[]
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || items.length === 0) return
    if (window.matchMedia('(max-width: 768px)').matches) return
    const amount = Math.max(0, track.scrollWidth - section.clientWidth)
    gsap.to(track, {
      x: -amount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: () => `+=${Math.max(amount, 400)}`,
        scrub: true,
      },
    })
  }, [items.length])

  return (
    <div ref={sectionRef} className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-10 overflow-x-auto pb-4 snap-x snap-mandatory md:overflow-visible"
      >
        {items.map((m, i) => {
          const year = m.year && !/\[.*\]/.test(m.year) ? m.year : '—'
          return (
            <div key={i} className="w-[72vw] shrink-0 snap-start border-t border-[var(--line)] pt-6 md:w-[28vw]">
              <p className="text-stat !text-[var(--ruby)]">{year}</p>
              <p className="text-body-ink mt-4">{m.content}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
