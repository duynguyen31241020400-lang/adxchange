'use client'

import { useEffect, useState } from 'react'

export function CookieBanner() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    try {
      if (!localStorage.getItem('adx-cookie-ok')) setShow(true)
    } catch {
      setShow(true)
    }
  }, [])
  if (!show) return null
  return (
    <div className="fixed bottom-4 left-4 z-[55] max-w-sm border border-[var(--line)] bg-[var(--bg)] p-4 text-small">
      <p>ADX dùng cookie đo lường khi bạn đồng ý.</p>
      <button
        type="button"
        className="btn mt-3 !h-10"
        onClick={() => {
          try {
            localStorage.setItem('adx-cookie-ok', '1')
          } catch {
            /* ignore */
          }
          setShow(false)
          window.dispatchEvent(new Event('adx-cookie-ok'))
        }}
      >
        Đồng ý →
      </button>
    </div>
  )
}
