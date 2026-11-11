'use client'

import { useEffect } from 'react'

export function RevealInit() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-line, .reveal-image').forEach((el) => el.classList.add('is-in'))
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
      { threshold: 0.2 },
    )
    document.querySelectorAll('.reveal-line, .reveal-image').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
