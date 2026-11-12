'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/lib/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export function HomeValues({
  vision,
  values,
}: {
  vision: string
  values: { title?: string | null; description?: string | null }[]
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const root = ref.current
    if (!root) return
    const words = root.querySelectorAll('[data-word]')
    gsap.fromTo(
      words,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: { trigger: root, start: 'top 75%' },
      },
    )
  }, [vision])

  return (
    <section ref={ref} className="section-white">
      <div className="container py-24 md:py-32">
        <h2 className="sr-only">Tầm nhìn</h2>
        <p className="text-h1 !text-[var(--ruby)]">
          {vision.split(' ').map((word, i) => (
            <span key={`${word}-${i}`} className="mask-line">
              <span data-word className="inline-block pr-[0.25em]">
                {word}
              </span>
            </span>
          ))}
        </p>
        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {values.slice(0, 3).map((v, i) => (
            <div key={v.title || i} className="border-t border-[var(--line)] pt-6">
              <p className="text-index !text-[var(--muted)]">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="text-h3 mt-4 !text-[var(--ruby)]">{v.title}</h3>
              <p className="text-body-ink mt-3">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
