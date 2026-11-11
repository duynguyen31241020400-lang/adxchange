'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SearchOverlay } from './SearchOverlay'

const nav = [
  { href: '/du-an', label: 'Dự án' },
  { href: '/dich-vu', label: 'Dịch vụ' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export function Header({ hotlineDisplay = '0939 899 283' }: { hotlineDisplay?: string }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const transparent = isHome && !scrolled && !open
  const tel = hotlineDisplay.replace(/[^\d+]/g, '') || '0939899283'

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-colors"
        style={{
          background: transparent ? 'transparent' : 'var(--bg)',
          borderBottom: transparent ? 'none' : '1px solid var(--line)',
          color: transparent ? '#fff' : 'var(--ink)',
        }}
      >
        <div className="container flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href="/" aria-label="ADX trang chủ" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={transparent ? '/brand/logo-dark.png' : '/brand/logo-light.png'}
              alt="ADX"
              className="h-8 w-auto md:h-9"
            />
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Chính">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-[15px] hover:underline">
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              aria-label="Tìm kiếm"
              className="grid h-10 w-10 place-items-center"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <span className="text-index" aria-hidden="true">
              VI / EN
            </span>
            <a href={`tel:${tel}`} className="btn !h-10 !px-4 !text-xs">
              {hotlineDisplay.replace(', Mr. Cường', '')} →
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button type="button" aria-label="Tìm kiếm" className="grid h-10 w-10 place-items-center" onClick={() => setSearchOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center"
              aria-label={open ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="text-h3 leading-none">{open ? '×' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-[var(--bg)] pt-24" role="dialog" aria-label="Menu">
          <nav className="container flex flex-col gap-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-h2">
                {item.label}
              </Link>
            ))}
            <a href={`tel:${tel}`} className="btn mt-4 w-fit">
              {hotlineDisplay.replace(', Mr. Cường', '')} →
            </a>
          </nav>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
