'use client'

import Link from 'next/link'

export function ProjectFilters({
  services,
  active,
}: {
  services: { slug?: string | null; name?: string | null }[]
  active?: string
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px]" role="navigation" aria-label="Lọc dịch vụ">
      <Link
        href="/du-an"
        className={!active ? 'underline decoration-[var(--primary)] underline-offset-4' : ''}
      >
        Tất cả
      </Link>
      {services.map((s) => (
        <Link
          key={s.slug}
          href={`/du-an?dich-vu=${s.slug}`}
          className={active === s.slug ? 'underline decoration-[var(--primary)] underline-offset-4' : ''}
        >
          {s.name}
        </Link>
      ))}
    </div>
  )
}
