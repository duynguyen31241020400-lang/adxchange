'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SELECTOR = '.reveal-line, .reveal-image'

function revealAllImmediate() {
  document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add('is-in'))
}

export function RevealInit() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAllImmediate()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
    )

    const observePending = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.classList.contains('is-in')) io.observe(el)
      })
    }

    observePending()

    // Client navigations mount new reveal nodes after layout effect — re-scan briefly.
    const mo = new MutationObserver(() => observePending())
    mo.observe(document.body, { childList: true, subtree: true })

    // Safety: never leave covers clipped forever if IO misses (e.g. nested overflow).
    const fallback = window.setTimeout(() => revealAllImmediate(), 1200)

    return () => {
      io.disconnect()
      mo.disconnect()
      window.clearTimeout(fallback)
    }
  }, [pathname])

  return null
}
