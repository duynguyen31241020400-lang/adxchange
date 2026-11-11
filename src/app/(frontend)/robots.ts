import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEX === 'true'
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://adxchange.agency'
  if (!allow) {
    return {
      rules: { userAgent: '*', disallow: '/' },
      sitemap: `${site}/sitemap.xml`,
    }
  }
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    ],
    sitemap: `${site}/sitemap.xml`,
  }
}
