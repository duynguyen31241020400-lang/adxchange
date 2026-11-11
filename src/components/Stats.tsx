'use client'

import { useEffect, useRef } from 'react'

function parseStat(value: string) {
  const match = value.match(/^([\d.,]+)(.*)$/)
  if (!match) return { num: null as number | null, suffix: value, raw: value }
  return { num: Number(match[1].replace(/\./g, '').replace(',', '.')), suffix: match[2], raw: value }
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const nums = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const target = Number(el.dataset.count)
          const suffix = el.dataset.suffix || ''
          if (!target) return
          const start = performance.now()
          const dur = 1200
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / dur)
            const val = Math.round(target * p)
            el.textContent = `${val.toLocaleString('vi-VN')}${suffix}`
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.unobserve(el)
        })
      },
      { threshold: 0.4 },
    )
    nums.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <section className="bg-[var(--dark)] py-16 text-[var(--bg)]" ref={ref}>
      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const parsed = parseStat(item.value)
          return (
            <div key={item.label}>
              <p
                className="text-stat !text-[var(--bg)]"
                data-count={parsed.num ?? undefined}
                data-suffix={parsed.num != null ? parsed.suffix : undefined}
              >
                {item.value}
              </p>
              <p className="mt-3 text-small !text-white/65">{item.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
