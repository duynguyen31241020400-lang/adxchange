import { ServiceRows } from '@/components/ServiceRows'
import { ContactCTA } from '@/components/ContactCTA'
import { getServices, getSiteSettings, mediaUrl } from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'Dịch vụ quảng cáo ngoài trời | ADX',
  description:
    'OOH, roadshow, KOL, livestream, TikTok Ads và đăng báo — danh sách dịch vụ ADX tại TP.HCM.',
  path: '/dich-vu',
})

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()])
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Dịch vụ', path: '/dich-vu' },
          ]),
        )}
      />
      <div className="container pt-28 pb-16">
        <h1 className="text-h1 mb-10">Dịch vụ</h1>
        <ServiceRows
          services={services.docs.map((s) => ({
            ...s,
            relatedImageUrl: mediaUrl(s.image),
          }))}
        />
      </div>
      <ContactCTA
        hotlineLabel={settings.hotlineLabel || undefined}
        hotline={settings.hotline || undefined}
        zalo={settings.zalo || undefined}
        zaloUrl={settings.zaloUrl || undefined}
        email={settings.email || undefined}
      />
    </>
  )
}
