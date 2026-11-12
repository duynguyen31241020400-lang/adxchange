'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'

export function ProjectFilters({
  services,
  active,
  counts,
  total,
  onSelect,
}: {
  services: { slug?: string | null; name?: string | null }[]
  active?: string
  counts?: Record<string, number>
  total?: number
  /** Client-side filtering; links still work without JS. */
  onSelect?: (slug?: string) => void
}) {
  const itemClass = (on: boolean) =>
    `whitespace-nowrap py-1 text-[20px] transition-colors md:text-[24px] ${
      on ? 'font-semibold text-[var(--ruby)]' : 'text-[var(--muted)] hover:text-[var(--ruby)]'
    }`

  const handle = (slug?: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!onSelect || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    onSelect(slug)
  }

  return (
    <nav className="-mx-4 overflow-x-auto px-4 py-3 md:mx-0 md:px-0" aria-label="Lọc dịch vụ">
      <div className="flex min-w-max items-center gap-3 md:min-w-0 md:flex-wrap md:gap-x-4 md:gap-y-1">
        <Link
          href="/du-an"
          scroll={false}
          className={itemClass(!active)}
          aria-current={!active ? 'true' : undefined}
          onClick={handle(undefined)}
        >
          Tất cả{typeof total === 'number' ? ` (${total})` : ''}
        </Link>
        {services.map((s) => {
          const count = s.slug && counts ? counts[s.slug] || 0 : undefined
          if (count === 0 || !s.slug) return null
          const on = active === s.slug
          return (
            <span key={s.slug} className="flex items-center gap-3 md:gap-4">
              <span className="text-[var(--line)]" aria-hidden="true">
                |
              </span>
              <Link
                href={`/du-an?dich-vu=${s.slug}`}
                scroll={false}
                className={itemClass(on)}
                aria-current={on ? 'true' : undefined}
                onClick={handle(s.slug)}
              >
                {s.name}
                {typeof count === 'number' ? ` (${count})` : ''}
              </Link>
            </span>
          )
        })}
      </div>
    </nav>
  )
}
