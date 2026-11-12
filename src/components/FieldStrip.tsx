'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/lib/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export function FieldStrip({ images }: { images: { src: string; alt: string }[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || images.length === 0) return
    if (window.matchMedia('(max-width: 768px)').matches) return

    // G.4.5: no pin — the strip slides sideways while the section passes
    // through the viewport, so it never holds the page.
    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => -Math.max(0, track.scrollWidth - section.clientWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  }, [images.length])

  if (!images.length) return null

  return (
    <section ref={sectionRef} className="section-white overflow-hidden">
      <div className="container py-10">
        <p className="text-index !text-[var(--muted)]">Hiện trường</p>
      </div>
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto px-4 pb-16 snap-x snap-mandatory md:gap-6 md:overflow-visible md:px-8"
      >
        {images.map((img) => (
          <div
            key={img.src}
            className="relative h-[46vh] w-[72vw] shrink-0 snap-center overflow-hidden md:h-[60vh] md:w-[34vw]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  )
}
