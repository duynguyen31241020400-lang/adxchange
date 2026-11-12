'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@/lib/useGSAP'

const STORAGE_KEY = 'adx-intro-seen-v3'

function supports3d() {
  if (typeof window === 'undefined') return false
  const el = document.createElement('div')
  el.style.transformStyle = 'preserve-3d'
  return el.style.transformStyle === 'preserve-3d'
}

export function IntroTrivision({ bannerSrc }: { bannerSrc?: string | null }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [panels, setPanels] = useState(14)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!supports3d()) return
    setPanels(window.matchMedia('(max-width: 768px)').matches ? 7 : 14)
    setVisible(true)
  }, [])

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  useGSAP(
    () => {
      if (!visible || !rootRef.current) return
      const root = rootRef.current
      const louvers = root.querySelectorAll<HTMLElement>('[data-louver]')
      const tl = gsap.timeline({ onComplete: dismiss })
      tl.to({}, { duration: 0.5 })
      louvers.forEach((el, i) => {
        tl.to(el, { rotateY: -120, duration: 0.42, ease: 'power2.inOut' }, 0.5 + i * 0.04)
      })
      const afterFirst = 0.5 + (louvers.length - 1) * 0.04 + 0.42
      tl.to({}, { duration: 0.5 }, afterFirst)
      const secondAt = afterFirst + 0.5
      louvers.forEach((el, i) => {
        tl.to(el, { rotateY: -240, duration: 0.42, ease: 'power2.inOut' }, secondAt + i * 0.04)
      })
      tl.to(root, { opacity: 0, duration: 0.3, ease: 'power1.out' }, secondAt + (louvers.length - 1) * 0.04 + 0.25)
    },
    [visible, panels, bannerSrc],
  )

  if (!visible) return null

  const depth = 28

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] bg-[var(--ruby)]"
      aria-hidden="true"
      onClick={dismiss}
      role="presentation"
    >
      <div className="flex h-full w-full overflow-hidden" style={{ perspective: '1400px' }}>
        {Array.from({ length: panels }).map((_, i) => {
          const pos = `${(i / panels) * 100}%`
          const size = `${panels * 100}%`
          return (
            <div key={i} className="relative h-full flex-1" style={{ perspective: '1200px' }}>
              <div
                data-louver
                className="relative h-full w-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                }}
              >
                {/* Face 1 — ruby */}
                <div
                  className="absolute inset-0 overflow-hidden bg-[var(--ruby)] text-[var(--white)]"
                  style={{ transform: `rotateY(0deg) translateZ(${depth}px)`, backfaceVisibility: 'hidden' }}
                >
                  <span
                    className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap font-[family-name:var(--font-anton)] text-[clamp(36px,9vw,110px)] uppercase"
                    style={{ width: size, marginLeft: `-${(i / panels) * 100}%`, textAlign: 'center' }}
                  >
                    Không thể
                  </span>
                </div>
                {/* Face 2 — white */}
                <div
                  className="absolute inset-0 overflow-hidden bg-[var(--white)] text-[var(--ruby)]"
                  style={{ transform: `rotateY(120deg) translateZ(${depth}px)`, backfaceVisibility: 'hidden' }}
                >
                  <span
                    className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap font-[family-name:var(--font-anton)] text-[clamp(36px,9vw,110px)] uppercase"
                    style={{ width: size, marginLeft: `-${(i / panels) * 100}%`, textAlign: 'center' }}
                  >
                    Không thấy
                  </span>
                </div>
                {/* Face 3 — banner slice */}
                <div
                  className="absolute inset-0 overflow-hidden bg-[var(--ruby-deep)]"
                  style={{
                    transform: `rotateY(240deg) translateZ(${depth}px)`,
                    backfaceVisibility: 'hidden',
                    backgroundImage: bannerSrc ? `url(${bannerSrc})` : undefined,
                    backgroundSize: bannerSrc ? `${size} 100%` : undefined,
                    backgroundPosition: bannerSrc ? `${pos} center` : undefined,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="btn btn-on-ruby absolute right-4 bottom-4 z-10 md:right-8 md:bottom-8"
        onClick={(e) => {
          e.stopPropagation()
          dismiss()
        }}
      >
        Bỏ qua <span className="btn-arrow">→</span>
      </button>
    </div>
  )
}
