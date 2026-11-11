'use client'

import { useEffect, useState } from 'react'

export function GalleryLightbox({ images }: { images: { src: string; alt: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i == null ? i : (i + 1) % images.length))
      if (e.key === 'ArrowLeft') setOpen((i) => (i == null ? i : (i - 1 + images.length) % images.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, images.length])

  return (
    <>
      <div className="grid gap-6 md:grid-cols-12">
        {images.map((img, i) => {
          const wide = i % 2 === 0
          return (
            <button
              key={img.src + i}
              type="button"
              className={`${wide ? 'md:col-span-7' : 'md:col-span-5'} overflow-hidden`}
              onClick={() => setOpen(i)}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="aspect-[4/3] w-full object-cover" />
            </button>
          )
        })}
      </div>

      {open != null ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-label="Lightbox"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-3xl text-white"
            aria-label="Đóng"
            onClick={() => setOpen(null)}
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[open].src}
            alt={images[open].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  )
}
