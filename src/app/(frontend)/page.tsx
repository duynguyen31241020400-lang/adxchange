import { Hero } from '@/components/Hero'
import { IntroTrivision } from '@/components/IntroTrivision'
import { HomeValues } from '@/components/HomeValues'
import { ProjectGate } from '@/components/ProjectGate'
import { ServiceRows } from '@/components/ServiceRows'
import { FieldStrip } from '@/components/FieldStrip'
import { Stats } from '@/components/Stats'
import { ClientMarquee } from '@/components/ClientMarquee'
import { ContactCTA } from '@/components/ContactCTA'
import {
  getAbout,
  getClients,
  getPublishedProjects,
  getServices,
  getSiteSettings,
  mediaAlt,
  mediaUrl,
} from '@/lib/payload'
import { jsonLd, orgSchema, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'ADX | Quảng cáo ngoài trời & roadshow TP.HCM',
  description:
    'ADX làm biển LED, roadshow xe buýt, human billboard và chiến dịch ngoài trời tại TP. Hồ Chí Minh.',
  path: '/',
  image: '/og/home.jpg',
})

export default async function HomePage() {
  const [settings, projects, allProjects, services, clients, about] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects({ featured: true, limit: 7 }),
    getPublishedProjects({ limit: 50 }),
    getServices(),
    getClients(),
    getAbout(),
  ])

  const featured = projects.docs
  const serviceRows = services.docs.map((s) => {
    const related = featured.find((p) =>
      Array.isArray(p.services)
        ? p.services.some((svc) => typeof svc === 'object' && svc && 'id' in svc && svc.id === s.id)
        : false,
    )
    return {
      ...s,
      relatedImageUrl: related ? mediaUrl(related.coverImage) : mediaUrl(s.image),
    }
  })

  const firstBanner = mediaUrl(settings.heroBanners?.[0]?.image)
  const videoUrl = mediaUrl(settings.heroVideo)
  const fieldImages = featured
    .flatMap((p) => {
      const gallery = Array.isArray(p.gallery) ? p.gallery : []
      return gallery
        .map((g) => {
          const src = mediaUrl(g.image)
          if (!src) return null
          return { src, alt: mediaAlt(g.image, p.name || '') }
        })
        .filter(Boolean) as { src: string; alt: string }[]
    })
    .slice(0, 10)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(orgSchema(settings))} />
      <IntroTrivision bannerSrc={firstBanner} />
      <Hero
        slogan={settings.slogan || 'ADX. Không thể không thấy.'}
        subline={settings.heroSubline}
        banners={(settings.heroBanners || []).map((b) => ({
          caption: b.caption,
          image: b.image,
        }))}
        videoUrl={videoUrl}
      />

      <HomeValues
        vision={about.vision || 'Làm thương hiệu được nhìn thấy.'}
        values={(about.values || []).map((v) => ({ title: v.title, description: v.description }))}
      />

      <ProjectGate
        totalCount={allProjects.docs.length}
        projects={featured.map((p) => ({
          name: p.name,
          clientLabel: p.clientLabel,
          coverUrl: mediaUrl(p.coverImage),
        }))}
      />

      <section className="section-white">
        <div className="container py-20">
          <h2 className="text-h2 reveal-line !text-[var(--ruby)]">Dịch vụ</h2>
          <div className="mt-10">
            <ServiceRows services={serviceRows} />
          </div>
        </div>
      </section>

      <FieldStrip images={fieldImages} />

      <Stats
        items={(settings.stats || []).map((s) => ({
          value: s.value || '',
          label: s.label || '',
        }))}
      />

      <section className="section-white py-16">
        <ClientMarquee
          clients={clients.docs.map((c) => ({
            name: c.name,
            showLogo: c.showLogo,
            logo: c.logo,
          }))}
        />
      </section>

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
