import type { Metadata } from 'next'
import { Anton, Barlow_Condensed, Be_Vietnam_Pro, Oswald } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ThemeControls } from '@/components/ThemeControls'
import { RevealInit } from '@/components/Reveal'
import { CookieBanner } from '@/components/CookieBanner'
import { Analytics } from '@/components/Analytics'
import { getSiteSettings } from '@/lib/payload'
import './globals.css'

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

const barlow = Barlow_Condensed({
  subsets: ['latin', 'vietnamese'],
  weight: ['700', '800'],
  variable: '--font-barlow',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700'],
  variable: '--font-oswald',
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
      // en: '/en' — reserved for bilingual
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

  return (
    <html lang="vi" data-theme="a" data-font="1" className={`${beVietnam.variable} ${anton.variable} ${barlow.variable} ${oswald.variable}`}>
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
        />
        <ThemeControls />
        <RevealInit />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  )
}
