import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://adxchange.agency'
const allowIndex = process.env.NEXT_PUBLIC_ALLOW_INDEX === 'true'

export function pageMeta({
  title,
  description,
  path,
  image,
  noIndex,
}: {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const url = `${siteUrl}${path}`
  const index = allowIndex && !noIndex
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url,
      locale: 'vi_VN',
      type: 'website',
      images: [{ url: image || '/og/home.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || '/og/home.jpg'],
    },
  }
}

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  }
}

export function orgSchema(settings: {
  legalName?: string | null
  email?: string | null
  hotline?: string | null
  officeAddress?: string | null
  branchAddress?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'ADX',
    legalName: settings.legalName || 'Công ty TNHH Nine Dozen',
    url: siteUrl,
    email: settings.email,
    telephone: settings.hotline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.officeAddress,
      addressLocality: 'Hồ Chí Minh',
      addressCountry: 'VN',
    },
    department: settings.branchAddress
      ? {
          '@type': 'LocalBusiness',
          name: 'Chi nhánh ADX',
          address: settings.branchAddress,
        }
      : undefined,
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}
