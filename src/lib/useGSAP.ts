'use client'

import { useEffect } from 'react'

/** Minimal GSAP effect helper (avoid @gsap/react dependency). */
export function useGSAP(effect: () => void | (() => void), deps: unknown[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
