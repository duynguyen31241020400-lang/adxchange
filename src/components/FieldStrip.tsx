'use client'

import { useEffect, useRef } from 'react'
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

    const amount = Math.max(0, track.scrollWidth - section.clientWidth)
    gsap.to(track, {
      x: -amount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${amount}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    })
  }, [images.length])

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

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
            className="relative h-[46vh] w-[72vw] shrink-0 snap-center overflow-hidden md:h-[70vh] md:w-[42vw]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  )
}
