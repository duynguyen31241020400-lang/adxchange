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
  videoUrl,
}: {
  slogan: string
  subline?: string | null
  banners: Banner[]
  videoUrl?: string | null
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduce, setReduce] = useState(false)
  const poster = mediaUrl(banners[0]?.image)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (videoUrl || reduce || paused || banners.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000)
    return () => clearInterval(t)
  }, [banners.length, paused, reduce, videoUrl])

  return (
    <section
      className="relative h-[100svh] overflow-hidden bg-[var(--ruby-deep)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        banners.map((b, i) => {
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
                <div className="h-full w-full bg-[var(--ruby-deep)]" />
              )}
            </div>
          )
        })
      )}
      <div className="absolute inset-0 bg-black/40" />

      <div className="container relative z-10 flex h-full flex-col justify-end pb-16 pt-28">
        {!videoUrl ? (
          <p className="mb-3 text-[clamp(18px,2vw,28px)] text-white/90">{banners[index]?.caption}</p>
        ) : null}
        <h1 className="text-display !text-white">{slogan}</h1>
        {subline ? <p className="mt-4 text-small !text-white/75">{subline}</p> : null}
        <Link href="/lien-he" className="btn btn-on-ruby mt-8 w-fit">
          Nhận báo giá <span className="btn-arrow">→</span>
        </Link>

        {!videoUrl && banners.length > 1 ? (
          <div className="mt-8 flex gap-2" role="tablist" aria-label="Banner">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Banner ${i + 1}`}
                className="h-2 w-2"
                style={{ background: i === index ? '#fff' : 'rgba(255,255,255,0.4)' }}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
