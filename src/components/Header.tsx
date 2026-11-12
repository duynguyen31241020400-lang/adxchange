'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SearchOverlay } from './SearchOverlay'

const nav = [
  { href: '/', label: 'Trang chủ', number: '01' },
  { href: '/du-an', label: 'Dự án', number: '02' },
  { href: '/dich-vu', label: 'Dịch vụ', number: '03' },
  { href: '/gioi-thieu', label: 'Giới thiệu', number: '04' },
  { href: '/lien-he', label: 'Liên hệ', number: '05' },
]

function pageTitle(pathname: string) {
  if (pathname === '/') return 'Trang chủ'
  if (pathname.startsWith('/du-an')) return 'Dự án'
  if (pathname.startsWith('/dich-vu')) return 'Dịch vụ'
  if (pathname.startsWith('/gioi-thieu')) return 'Giới thiệu'
  if (pathname.startsWith('/lien-he')) return 'Liên hệ'
  if (pathname.startsWith('/tim-kiem')) return 'Tìm kiếm'
  if (pathname.startsWith('/chinh-sach-bao-mat')) return 'Bảo mật'
  return 'ADX'
}

export function Header({ hotlineDisplay = '0939 899 283' }: { hotlineDisplay?: string }) {
  const pathname = usePathname()
  const title = pageTitle(pathname)
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const menuId = useId()
  const tel = hotlineDisplay.replace(/[^\d+]/g, '') || '0939899283'

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setSearchOpen(false)
      }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--white)] text-[var(--ruby)]">
        <div className="container grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 md:h-20">
          <Link href="/" aria-label="ADX trang chủ" className="justify-self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-light.png" alt="ADX" className="h-8 w-auto md:h-9" />
          </Link>

          <p className="justify-self-center text-center text-[13px] uppercase tracking-[0.14em] md:text-[14px]">
            {title}
          </p>

          <div className="flex items-center justify-end gap-2 md:gap-3">
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
            <button
              type="button"
              className="inline-flex items-center gap-2"
              aria-label={open ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="hidden text-[13px] uppercase tracking-[0.12em] sm:inline">Menu</span>
              <span
                className="grid h-10 w-10 place-items-center rounded-full border border-[var(--ruby)] text-lg leading-none"
                aria-hidden="true"
              >
                {open ? '×' : '+'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id={menuId}
          className="fixed inset-0 z-40 flex flex-col bg-[var(--ruby)] pt-24 text-[var(--white)]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <nav className="container flex flex-1 flex-col justify-center gap-2 pb-10">
            {nav.map((item) => {
              const active =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-baseline gap-4"
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="text-index !text-white/55">{item.number}</span>
                  <span
                    className={`text-display !text-[clamp(42px,10vw,120px)] ${
                      active ? 'underline decoration-2 underline-offset-8' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
          <div className="container border-t border-[var(--line-on-ruby)] py-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm uppercase tracking-[0.08em]">
              <a href={`tel:${tel}`} className="underline underline-offset-4">
                {hotlineDisplay.replace(', Mr. Cường', '')} →
              </a>
              <a href="mailto:cuong@adxchange.agency" className="underline underline-offset-4">
                cuong@adxchange.agency →
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
