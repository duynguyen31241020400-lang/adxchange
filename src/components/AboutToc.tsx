'use client'

import { useEffect, useState } from 'react'

export type TocItem = { id: string; label: string; number: string }

export function AboutToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id || '')

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1))
        if (visible[0]?.target?.id) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [items])

  return (
    <nav
      aria-label="Mục lục"
      className="sticky top-16 z-20 -mx-4 mb-8 overflow-x-auto border-b border-[var(--line)] bg-[var(--white)] px-4 py-3 md:top-28 md:mx-0 md:mb-0 md:w-48 md:shrink-0 md:overflow-visible md:border-b-0 md:bg-transparent md:px-0 md:py-0 lg:w-56"
    >
      <ul className="flex min-w-max gap-5 md:min-w-0 md:flex-col md:gap-3">
        {items.map((item) => {
          const on = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`inline-flex items-center gap-2 whitespace-nowrap text-[14px] uppercase tracking-[0.06em] ${
                  on ? 'text-[var(--ruby)]' : 'text-[var(--muted)]'
                }`}
              >
                {on ? <span className="hidden h-px w-4 bg-[var(--ruby)] md:inline-block" aria-hidden="true" /> : null}
                <span>
                  {item.number} {item.label}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
