'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/lib/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export function CoverParallax({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useGSAP(() => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    if (window.matchMedia('(max-width: 768px)').matches) return
    gsap.fromTo(
      img,
      { y: -30 },
      {
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  }, [src])

  return (
    <div ref={wrapRef} className="relative h-[70svh] overflow-hidden bg-[var(--ruby-deep)] md:h-[80svh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={src} alt={alt} fetchPriority="high" className="absolute inset-x-0 -top-[30px] h-[calc(100%+60px)] w-full object-cover" />
    </div>
  )
}
