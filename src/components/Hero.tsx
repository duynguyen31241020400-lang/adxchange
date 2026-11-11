'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { mediaAlt, mediaUrl } from '@/lib/media'

type Banner = {
  caption?: string | null
  image?: unknown
}

export function Hero({
  slogan,
  subline,
  banners,
}: {
  slogan: string
  subline?: string | null
  banners: Banner[]
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reduce || paused || banners.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000)
    return () => clearInterval(t)
  }, [banners.length, paused, reduce])

  return (
    <section
      className="relative h-[100svh] overflow-hidden bg-[var(--dark)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((b, i) => {
        const src = mediaUrl(b.image)
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1200ms]"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={mediaAlt(b.image, b.caption || '')}
                className="h-full w-full object-cover"
                style={{
                  transform: i === index && !reduce ? 'scale(1)' : 'scale(1.08)',
                  transition: reduce ? undefined : 'transform 6s linear',
                }}
              />
            ) : (
              <div className="h-full w-full bg-[var(--dark)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/20" />
          </div>
        )
      })}

      <div className="container relative z-10 flex h-full flex-col justify-end pb-16 pt-28">
        <p className="mb-3 text-[clamp(18px,2vw,28px)] text-white/90">{banners[index]?.caption}</p>
        <h1 className="text-display !text-white">{slogan}</h1>
        {subline ? <p className="mt-4 text-small !text-white/75">{subline}</p> : null}
        <Link href="/lien-he" className="btn mt-8 w-fit">
          Nhận báo giá →
        </Link>

        <div className="mt-8 flex gap-2" role="tablist" aria-label="Banner">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Banner ${i + 1}`}
              className="h-2 w-2 rounded-[2px]"
              style={{ background: i === index ? '#fff' : 'rgba(255,255,255,0.4)' }}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
