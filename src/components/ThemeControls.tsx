'use client'

import { useEffect, useState } from 'react'

type Theme = 'a' | 'b' | 'c'
type Font = '1' | '2' | '3'

export function ThemeControls() {
  const [theme, setTheme] = useState<Theme>('a')
  const [font, setFont] = useState<Font>('1')

  useEffect(() => {
    try {
      const t = localStorage.getItem('adx-theme') as Theme | null
      const f = localStorage.getItem('adx-font') as Font | null
      if (t === 'a' || t === 'b' || t === 'c') setTheme(t)
      if (f === '1' || f === '2' || f === '3') setFont(f)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('adx-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-font', font)
    try {
      localStorage.setItem('adx-font', font)
    } catch {
      /* ignore */
    }
  }, [font])

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 text-small">
      <div className="flex overflow-hidden rounded-[2px] border border-[var(--line)] bg-[var(--bg)]" role="group" aria-label="Đổi màu">
        {(['a', 'b', 'c'] as Theme[]).map((t) => (
          <button
            key={t}
            type="button"
            className="px-2 py-1"
            style={{
              background: theme === t ? 'var(--primary)' : 'transparent',
              color: theme === t ? '#fff' : 'var(--ink)',
            }}
            onClick={() => setTheme(t)}
          >
            {t === 'a' ? 'Màu A' : t === 'b' ? 'B' : 'C'}
          </button>
        ))}
      </div>
      <div className="flex overflow-hidden rounded-[2px] border border-[var(--line)] bg-[var(--bg)]" role="group" aria-label="Đổi chữ">
        {(['1', '2', '3'] as Font[]).map((f) => (
          <button
            key={f}
            type="button"
            className="px-2 py-1"
            style={{
              background: font === f ? 'var(--primary)' : 'transparent',
              color: font === f ? '#fff' : 'var(--ink)',
            }}
            onClick={() => setFont(f)}
          >
            {f === '1' ? 'Chữ 1' : f === '2' ? '2' : '3'}
          </button>
        ))}
      </div>
    </div>
  )
}
