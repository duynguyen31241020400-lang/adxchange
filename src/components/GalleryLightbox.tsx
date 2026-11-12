'use client'

import { useEffect, useRef, useState } from 'react'

export function GalleryLightbox({ images }: { images: { src: string; alt: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const count = images.length

  const step = (dir: 1 | -1) => setOpen((i) => (i == null ? i : (i + dir + count) % count))

  useEffect(() => {
    if (open == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open == null, count])

  useEffect(() => {
    if (open != null) closeRef.current?.focus()
    else openerRef.current?.focus()
  }, [open])

  return (
    <>
      <div className="grid gap-6 md:grid-cols-12">
        {images.map((img, i) => {
          const wide = i % 2 === 0
          return (
            <button
              key={img.src + i}
              type="button"
              className={`${wide ? 'md:col-span-7' : 'md:col-span-5'} cursor-zoom-in overflow-hidden`}
              onClick={(e) => {
                openerRef.current = e.currentTarget
                setOpen(i)
              }}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </button>
          )
        })}
      </div>

      {open != null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh ${open + 1} / ${count}`}
          onClick={() => setOpen(null)}
        >
          <button
            ref={closeRef}
            type="button"
            className="absolute top-4 right-4 grid h-12 w-12 place-items-center text-3xl text-white"
            aria-label="Đóng"
            onClick={() => setOpen(null)}
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[open].src}
            alt={images[open].alt}
            className="max-h-[80vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {count > 1 ? (
            <div
              className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="btn btn-on-ruby !min-h-11 !px-4" aria-label="Ảnh trước" onClick={() => step(-1)}>
                ←
              </button>
              <p className="text-index !text-white">
                {String(open + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
              <button type="button" className="btn btn-on-ruby !min-h-11 !px-4" aria-label="Ảnh sau" onClick={() => step(1)}>
                →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
