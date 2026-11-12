'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@/lib/useGSAP'

gsap.registerPlugin(ScrollTrigger)

export type FilmProject = {
  id: string | number
  slug?: string | null
  name?: string | null
  clientLabel?: string | null
  year?: number | null
  summary?: string | null
  coverUrl?: string | null
}

/** Height of the fixed header + sticky filter bar, so the pinned reel sits below them. */
function stickyOffset() {
  const header = document.querySelector('header')?.getBoundingClientRect().height || 0
  const bar = document.querySelector<HTMLElement>('[data-filterbar]')?.getBoundingClientRect().height || 0
  return Math.round(header + bar)
}

function isTypingTarget(t: EventTarget | null) {
  return (
    t instanceof HTMLInputElement ||
    t instanceof HTMLTextAreaElement ||
    t instanceof HTMLSelectElement ||
    (t instanceof HTMLElement && t.isContentEditable)
  )
}

/**
 * G.7 film reel. Desktop: pinned + scrub, capped at one screen of scroll (G.4.5)
 * with snapping per frame. Mobile / reduced motion: native horizontal swipe with snap.
 */
export function FilmReel({ projects }: { projects: FilmProject[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const dragRef = useRef<{ x: number; scroll: number; moved: boolean } | null>(null)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)
  const count = projects.length

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)')
    const apply = () => setPinned(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useGSAP(() => {
    const section = sectionRef.current
    const track = trackRef.current
    stRef.current = null
    if (!section || !track || !pinned || count < 2) return

    // Frame i is centred on screen at progress i/(n-1).
    const frames = () => Array.from(track.querySelectorAll<HTMLElement>('[data-frame]'))
    const centreX = (f?: HTMLElement) => (f ? section.clientWidth / 2 - (f.offsetLeft + f.offsetWidth / 2) : 0)
    const tween = gsap.fromTo(track, { x: () => centreX(frames()[0]) }, {
      x: () => centreX(frames()[count - 1]),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: () => `top top+=${stickyOffset()}`,
        end: () => `+=${Math.round(window.innerHeight * 0.9)}`,
        scrub: 0.4,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (count - 1), duration: { min: 0.15, max: 0.4 }, delay: 0.05 },
        onUpdate: (self) => setActive(Math.round(self.progress * (count - 1))),
      },
    })
    stRef.current = tween.scrollTrigger || null

    // Images change the layout after load; recompute positions once they are in.
    const imgs = Array.from(track.querySelectorAll('img'))
    let pending = imgs.filter((i) => !i.complete).length
    const onLoad = () => {
      pending -= 1
      if (pending <= 0) ScrollTrigger.refresh()
    }
    imgs.forEach((i) => {
      if (!i.complete) i.addEventListener('load', onLoad, { once: true })
    })
    return () => imgs.forEach((i) => i.removeEventListener('load', onLoad))
  }, [pinned, count])

  // Mobile: keep the counter in sync with native swipe.
  useEffect(() => {
    const track = trackRef.current
    if (!track || pinned) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const frames = Array.from(track.querySelectorAll<HTMLElement>('[data-frame]'))
        const mid = track.getBoundingClientRect().left + track.clientWidth / 2
        let best = 0
        let bestDist = Infinity
        frames.forEach((f, i) => {
          const r = f.getBoundingClientRect()
          const d = Math.abs(r.left + r.width / 2 - mid)
          if (d < bestDist) {
            bestDist = d
            best = i
          }
        })
        setActive(best)
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      track.removeEventListener('scroll', onScroll)
    }
  }, [pinned, count])

  const goTo = useCallback(
    (target: number) => {
      const next = Math.max(0, Math.min(count - 1, target))
      setActive(next)
      const track = trackRef.current
      if (!track) return
      const st = stRef.current
      if (pinned && st) {
        const progress = count <= 1 ? 0 : next / (count - 1)
        window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: 'smooth' })
        return
      }
      const frame = track.querySelectorAll<HTMLElement>('[data-frame]')[next]
      if (frame) track.scrollTo({ left: frame.offsetLeft - (track.clientWidth - frame.offsetWidth) / 2, behavior: 'smooth' })
    },
    [count, pinned],
  )

  // Arrow keys move the reel while it is on screen (G.4.6).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      if (e.altKey || e.metaKey || e.ctrlKey || isTypingTarget(e.target)) return
      if (document.querySelector('[role="dialog"]')) return
      const r = sectionRef.current?.getBoundingClientRect()
      if (!r || r.bottom <= 0 || r.top >= window.innerHeight) return
      e.preventDefault()
      goTo(active + (e.key === 'ArrowRight' ? 1 : -1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, goTo])

  // Desktop: drag horizontally (mouse or touch) to scrub the pinned reel.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!pinned || !stRef.current) return
    dragRef.current = { x: e.clientX, scroll: window.scrollY, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current
    const st = stRef.current
    const track = trackRef.current
    const section = sectionRef.current
    if (!drag || !st || !track || !section) return
    const dx = e.clientX - drag.x
    if (Math.abs(dx) > 5) drag.moved = true
    if (!drag.moved) return
    const fs = track.querySelectorAll<HTMLElement>('[data-frame]')
    const travel = Math.max(1, fs[fs.length - 1].offsetLeft - fs[0].offsetLeft)
    const ratio = (st.end - st.start) / travel
    window.scrollTo({ top: drag.scroll - dx * ratio })
  }
  const endDrag = () => {
    const drag = dragRef.current
    dragRef.current = null
    if (drag?.moved) {
      // Swallow the click that follows a drag so it doesn't open a project.
      const stop = (ev: Event) => {
        ev.preventDefault()
        ev.stopPropagation()
      }
      window.addEventListener('click', stop, { capture: true, once: true })
      setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0)
    }
  }

  if (!count) return null

  return (
    // Stable wrapper: GSAP's pin wraps <section> in a .pin-spacer, so React must only
    // ever remove this outer div — otherwise unmount throws in removeChild.
    <div className="section-ruby">
      <section ref={sectionRef} className="section-ruby fade-in overflow-hidden" aria-label="Cuộn phim dự án">
        <div className="film-sprocket" aria-hidden="true" />
        <div
          ref={trackRef}
          className={`flex gap-6 px-4 py-8 md:gap-10 md:px-10 ${
            pinned ? 'cursor-grab touch-pan-y select-none active:cursor-grabbing' : 'overflow-x-auto snap-x snap-mandatory'
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {projects.map((p, i) => {
            const on = i === active
            const meta = [p.clientLabel, p.year].filter(Boolean).join(' · ')
            return (
              <article
                key={p.id}
                data-frame
                className="flex w-[84vw] shrink-0 snap-center flex-col gap-5 transition-[opacity,transform] duration-300 md:w-auto md:flex-row md:items-end md:gap-8"
                style={{ opacity: on ? 1 : 0.6, transform: `scale(${on ? 1 : 0.92})` }}
                aria-current={on ? 'true' : undefined}
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[var(--ruby-deep)] md:h-[56svh] md:w-auto">
                  {p.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverUrl}
                      alt={p.name || ''}
                      draggable={false}
                      loading={i < 2 ? 'eager' : 'lazy'}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="md:w-[300px] md:shrink-0 lg:w-[340px]">
                  <p className="text-stat !text-white/80" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="text-h2 mt-2">{p.name}</h2>
                  {meta ? <p className="mt-2 text-small !text-white/80">{meta}</p> : null}
                  {p.summary ? <p className="mt-4 max-w-xl text-[15px] text-white">{p.summary}</p> : null}
                  <Link href={`/du-an/${p.slug}`} className="btn btn-on-ruby mt-6" draggable={false}>
                    Xem dự án <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
        <div className="film-sprocket" aria-hidden="true" />
        <div className="container flex items-center justify-between py-4">
          <p className="text-index !text-white" aria-live="polite">
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn btn-on-ruby !min-h-11 !px-4"
              aria-label="Khung trước"
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
            >
              ←
            </button>
            <button
              type="button"
              className="btn btn-on-ruby !min-h-11 !px-4"
              aria-label="Khung sau"
              disabled={active >= count - 1}
              onClick={() => goTo(active + 1)}
            >
              →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
