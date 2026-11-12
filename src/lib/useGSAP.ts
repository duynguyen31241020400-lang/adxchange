'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Run a GSAP setup inside `gsap.context()` and auto-revert on unmount
 * (required for Next.js client navigations).
 */
export function useGSAP(effect: (ctx: gsap.Context) => void | (() => void), deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    let innerCleanup: void | (() => void)
    // gsap.context() runs the callback synchronously and passes itself in;
    // reading `ctx` here would hit the TDZ before the const is assigned.
    const ctx = gsap.context((self: gsap.Context) => {
      innerCleanup = effect(self)
    })

    return () => {
      if (typeof innerCleanup === 'function') innerCleanup()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
