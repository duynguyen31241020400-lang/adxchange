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
  const [depth, setDepth] = useState(30)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!supports3d()) return
    const n = window.matchMedia('(max-width: 768px)').matches ? 7 : 14
    setPanels(n)
    // Apothem of an equilateral triangle: each face sits w/(2√3) from the axis.
    setDepth(window.innerWidth / n / (2 * Math.sqrt(3)))
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
      // G.5: hold 0.5s → flip L→R → hold 0.5s → flip → fade. Whole run ≤ 2.4s,
      // so the per-louver stagger shrinks below 40ms when there are many louvers.
      const HOLD = 0.5
      const FLIP = 0.34
      const FADE = 0.25
      const n = Math.max(1, louvers.length)
      const stagger = Math.min(0.04, (2.4 - 2 * HOLD - 2 * FLIP - FADE * 0.5) / (2 * Math.max(1, n - 1)))
      const sweep = (n - 1) * stagger + FLIP
      const tl = gsap.timeline({ onComplete: dismiss })
      louvers.forEach((el, i) => {
        tl.to(el, { rotateY: -120, duration: FLIP, ease: 'power2.inOut' }, HOLD + i * stagger)
      })
      const secondAt = HOLD + sweep + HOLD
      louvers.forEach((el, i) => {
        tl.to(el, { rotateY: -240, duration: FLIP, ease: 'power2.inOut' }, secondAt + i * stagger)
      })
      tl.to(root, { opacity: 0, duration: FADE, ease: 'power1.out' }, secondAt + sweep - FADE * 0.5)
    },
    [visible, panels, depth, bannerSrc],
  )

  if (!visible) return null

  // Each face holds a layer as wide as the whole screen, shifted left by i faces,
  // so the slices line up into one word / one photo — like a real trivision board.
  const slice = (i: number) => ({ width: `${panels * 100}%`, left: `-${i * 100}%` })
  const word =
    'absolute inset-y-0 flex items-center justify-center whitespace-nowrap font-[family-name:var(--font-anton)] text-[clamp(56px,16vw,240px)] leading-none uppercase'

  return (
    <div
      ref={rootRef}
      data-intro
      className="fixed inset-0 z-[60] bg-[var(--ruby)]"
      onClick={dismiss}
      role="presentation"
    >
      <div className="flex h-full w-full overflow-hidden" style={{ perspective: '1600px' }} aria-hidden="true">
        {Array.from({ length: panels }).map((_, i) => (
          <div key={i} className="relative h-full flex-1">
            <div
              data-louver
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d', transformOrigin: `center center -${depth}px` }}
            >
              {/* Face 1 — ruby, "KHÔNG THỂ" */}
              <div
                className="absolute inset-0 overflow-hidden bg-[var(--ruby)] text-[var(--white)]"
                style={{ transform: `rotateY(0deg) translateZ(0px)`, backfaceVisibility: 'hidden' }}
              >
                <span className={word} style={slice(i)}>
                  Không thể
                </span>
              </div>
              {/* Face 2 — white, "KHÔNG THẤY" */}
              <div
                className="absolute inset-0 overflow-hidden bg-[var(--white)] text-[var(--ruby)]"
                style={{
                  transformOrigin: `center center -${depth}px`,
                  transform: 'rotateY(120deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <span className={word} style={slice(i)}>
                  Không thấy
                </span>
              </div>
              {/* Face 3 — slice of the first hero banner */}
              <div
                className="absolute inset-0 overflow-hidden bg-[var(--ruby-deep)]"
                style={{
                  transformOrigin: `center center -${depth}px`,
                  transform: 'rotateY(240deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {bannerSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bannerSrc} alt="" className="absolute inset-y-0 h-full max-w-none object-cover" style={slice(i)} />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-on-ruby absolute right-4 bottom-4 z-10 shadow-[0_0_0_1px_var(--ruby)] md:right-8 md:bottom-8"
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
