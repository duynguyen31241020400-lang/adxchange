import type { Metadata } from 'next'
import { Anton, Be_Vietnam_Pro } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { RevealInit } from '@/components/Reveal'
import { CookieBanner } from '@/components/CookieBanner'
import { Analytics } from '@/components/Analytics'
import { getSiteSettings, mediaUrl } from '@/lib/payload'
import './globals.css'

/** CMS-backed chrome (header/footer); avoid Postgres during static prerender without DATABASE_URI. */
export const dynamic = 'force-dynamic'

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600'],
  variable: '--font-body-family',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin', 'vietnamese'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adxchange.agency'
const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEX === 'true'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ADX | Quảng cáo ngoài trời & roadshow TP.HCM',
    template: '%s',
  },
  description:
    'ADX làm quảng cáo ngoài trời, roadshow và sự kiện tại TP. Hồ Chí Minh. Không thể không thấy.',
  robots: allowIndex ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'ADX',
    images: [{ url: '/og/home.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  alternates: {
    canonical: '/',
    languages: {
      vi: '/',
    },
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null
  try {
    settings = await getSiteSettings()
  } catch {
    settings = null
  }

  const capabilityHref = mediaUrl(settings?.capabilityFile) || undefined

  return (
    <html lang="vi" className={`${beVietnam.variable} ${anton.variable}`}>
      <body>
        <Header hotlineDisplay={settings?.hotlineLabel || '0939 899 283'} />
        <main>{children}</main>
        <Footer
          slogan={settings?.slogan || undefined}
          hotlineLabel={settings?.hotlineLabel || undefined}
          hotline={settings?.hotline || undefined}
          zalo={settings?.zalo || undefined}
          zaloUrl={settings?.zaloUrl || undefined}
          email={settings?.email || undefined}
          officeAddress={settings?.officeAddress || undefined}
          branchAddress={settings?.branchAddress || undefined}
          legalName={settings?.legalName || undefined}
          taxId={settings?.taxId || undefined}
          social={(settings?.social || []).map((s) => ({ label: s.label || '', url: s.url || '' }))}
          capabilityHref={capabilityHref}
        />
        <RevealInit />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  )
}
