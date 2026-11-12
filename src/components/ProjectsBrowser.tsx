'use client'

import { useMemo, useState } from 'react'
import { ProjectCredits, type CreditProject } from './ProjectCredits'
import { ProjectFilters } from './ProjectFilters'
import { ProjectListRows } from './ProjectListRows'

export type BrowserProject = CreditProject & { serviceSlugs: string[] }

/**
 * Client-side filter for /du-an. The filter bar stays sticky over both the
 * credits roll and the "Tất cả dự án" list, and keeps `?dich-vu=` in the URL.
 */
export function ProjectsBrowser({
  projects,
  services,
  initialService,
}: {
  projects: BrowserProject[]
  services: { slug?: string | null; name?: string | null }[]
  initialService?: string
}) {
  const [active, setActive] = useState<string | undefined>(
    initialService && services.some((s) => s.slug === initialService) ? initialService : undefined,
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const p of projects) for (const s of p.serviceSlugs) c[s] = (c[s] || 0) + 1
    return c
  }, [projects])

  const filtered = useMemo(
    () => (active ? projects.filter((p) => p.serviceSlugs.includes(active)) : projects),
    [projects, active],
  )

  const select = (slug?: string) => {
    setActive(slug)
    try {
      const url = new URL(window.location.href)
      if (slug) url.searchParams.set('dich-vu', slug)
      else url.searchParams.delete('dich-vu')
      window.history.replaceState(window.history.state, '', url)
    } catch {
      /* ignore */
    }
    const bar = document.querySelector<HTMLElement>('[data-filterbar]')
    const wrap = bar?.parentElement
    if (wrap && wrap.getBoundingClientRect().top < 0) {
      const header = document.querySelector('header')?.offsetHeight || 0
      window.scrollTo({ top: window.scrollY + wrap.getBoundingClientRect().top - header })
    }
  }

  return (
    <div className="relative">
      <div
        data-filterbar
        className="section-white sticky top-16 z-30 border-y border-[var(--line)] md:top-20"
      >
        <div className="container">
          <ProjectFilters services={services} active={active} counts={counts} total={projects.length} onSelect={select} />
        </div>
      </div>
      <ProjectCredits key={active || 'all'} projects={filtered} />
      <ProjectListRows projects={filtered} />
    </div>
  )
}
