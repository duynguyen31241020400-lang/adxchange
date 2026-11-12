'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Hit = {
  id: string
  title: string
  href: string
  kind: string
  clientLabel?: string
  imageUrl?: string | null
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<Hit[]>([])
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    setQ('')
    setHits([])
    setActive(0)
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    if (q.trim().length < 2) {
      setHits([])
      return
    }
    const handle = setTimeout(async () => {
      const res = await fetch(`/api/tim-kiem?q=${encodeURIComponent(q.slice(0, 80))}`)
      if (!res.ok) return
      const data = await res.json()
      setHits(data.results || [])
      setActive(0)
    }, 200)
    return () => clearTimeout(handle)
  }, [q, open])

  const groups = useMemo(() => {
    const projects = hits.filter((h) => h.kind === 'projects')
    const services = hits.filter((h) => h.kind === 'services')
    return { projects, services }
  }, [hits])

  if (!open) return null

  const flat = [...groups.projects, ...groups.services]

  const highlight = (text: string) => {
    const terms = q.trim().split(/\s+/).filter(Boolean)
    if (!terms.length) return text
    const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig')
    const parts = text.split(re)
    return parts.map((part, i) =>
      re.test(part) ? (
        <mark key={i} className="bg-transparent font-semibold text-[var(--ruby)]">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[var(--white)] text-[var(--ruby)]" role="dialog" aria-modal="true" aria-label="Tìm kiếm">
      <div className="container py-8">
        <div className="flex items-start justify-between gap-4">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(a + 1, Math.max(flat.length - 1, 0)))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(a - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                if (flat[active]) {
                  router.push(flat[active].href)
                  onClose()
                } else if (q.trim()) {
                  router.push(`/tim-kiem?q=${encodeURIComponent(q.trim())}`)
                  onClose()
                }
              }
            }}
            className="text-h2 w-full border-0 border-b border-[var(--line)] bg-transparent pb-2 outline-none focus:border-[var(--ruby)]"
            placeholder=""
            aria-label="Từ khóa tìm kiếm"
            maxLength={80}
          />
          <button type="button" className="text-h2 grid h-12 w-12 shrink-0 place-items-center" aria-label="Đóng" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {(['projects', 'services'] as const).map((kind) => {
            const list = kind === 'projects' ? groups.projects : groups.services
            if (!list.length) return null
            return (
              <div key={kind}>
                <p className="text-small mb-4">{kind === 'projects' ? 'Dự án' : 'Dịch vụ'}</p>
                <ul>
                  {list.map((hit) => {
                    const idx = flat.findIndex((f) => f.id === hit.id)
                    return (
                      <li key={hit.id}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 border-t border-[var(--line)] py-3 pl-3 text-left"
                          style={{
                            background: idx === active ? 'rgba(165, 15, 45, 0.07)' : 'transparent',
                            boxShadow: idx === active ? 'inset 3px 0 0 var(--ruby)' : undefined,
                          }}
                          aria-current={idx === active ? 'true' : undefined}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            router.push(hit.href)
                            onClose()
                          }}
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden bg-[var(--ruby-deep)]">
                            {hit.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={hit.imageUrl} alt="" className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <div className="text-h3">{highlight(hit.title)}</div>
                            {hit.clientLabel ? <div className="text-small">{hit.clientLabel}</div> : null}
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
