'use client'

import Link from 'next/link'

export function ProjectFilters({
  services,
  active,
  counts,
  total,
}: {
  services: { slug?: string | null; name?: string | null }[]
  active?: string
  counts?: Record<string, number>
  total?: number
}) {
  const itemClass = (on: boolean) =>
    `whitespace-nowrap text-[20px] md:text-[24px] ${
      on ? 'font-semibold text-[var(--ruby)]' : 'text-[var(--muted)]'
    }`

  return (
    <div
      className="sticky top-16 z-30 -mx-4 overflow-x-auto border-y border-[var(--line)] bg-[var(--white)] px-4 py-4 md:top-20 md:mx-0 md:px-0"
      role="navigation"
      aria-label="Lọc dịch vụ"
    >
      <div className="flex min-w-max items-center gap-3 md:flex-wrap md:gap-x-4 md:gap-y-2">
        <Link href="/du-an" className={itemClass(!active)}>
          Tất cả{typeof total === 'number' ? ` (${total})` : ''}
        </Link>
        {services.map((s) => {
          const count = s.slug && counts ? counts[s.slug] : undefined
          if (count === 0) return null
          return (
            <span key={s.slug} className="flex items-center gap-3">
              <span className="text-[var(--line)]" aria-hidden="true">
                |
              </span>
              <Link href={`/du-an?dich-vu=${s.slug}`} className={itemClass(active === s.slug)}>
                {s.name}
                {typeof count === 'number' ? ` (${count})` : ''}
              </Link>
            </span>
          )
        })}
      </div>
    </div>
  )
}
