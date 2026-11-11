'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  const [ok, setOk] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('adx-cookie-ok')) setOk(true)
    } catch {
      /* ignore */
    }
    const onOk = () => setOk(true)
    window.addEventListener('adx-cookie-ok', onOk)
    return () => window.removeEventListener('adx-cookie-ok', onOk)
  }, [])

  if (!id || !ok) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${id}');`}
      </Script>
    </>
  )
}
