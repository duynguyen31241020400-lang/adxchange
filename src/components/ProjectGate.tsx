'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Project = {
  name?: string | null
  clientLabel?: string | null
  coverUrl?: string | null
}

export function ProjectGate({ projects, totalCount }: { projects: Project[]; totalCount: number }) {
  const [index, setIndex] = useState(0)
  const [clipOk, setClipOk] = useState(true)
  const list = projects.filter((p) => p.coverUrl)
  const active = list[index] || list[0]

  useEffect(() => {
    const ok =
      typeof CSS !== 'undefined' &&
      (CSS.supports('-webkit-background-clip', 'text') || CSS.supports('background-clip', 'text'))
    setClipOk(ok)
  }, [])

  useEffect(() => {
    if (list.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setIndex((i) => (i + 1) % list.length), 2500)
    return () => clearInterval(t)
  }, [list.length])

  return (
    <section className="section-ruby relative overflow-hidden">
      {!clipOk && active?.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={active.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" aria-hidden="true" />
      ) : null}
      <div className="container relative py-24 md:py-32">
        <Link href="/du-an" className="block" aria-label="Xem tất cả dự án">
          <span
            className={`text-display block py-[0.1em] text-center ${clipOk && active?.coverUrl ? 'giant-clip-text' : '!text-white'}`}
            style={
              clipOk && active?.coverUrl
                ? { backgroundImage: `url(${active.coverUrl})` }
                : undefined
            }
          >
            Dự án
          </span>
        </Link>
        {active ? (
          <p className="mt-6 text-center text-small !text-white/80">
            {active.name}
            {active.clientLabel ? ` · ${active.clientLabel}` : ''}
          </p>
        ) : null}
        <div className="mt-10 flex justify-center">
          <Link href="/du-an" className="btn btn-on-ruby !min-h-14 !px-8 !text-base">
            Xem {totalCount} dự án <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
