import Link from 'next/link'
import { Hero } from '@/components/Hero'
import { ProjectCard } from '@/components/ProjectCard'
import { ServiceRows } from '@/components/ServiceRows'
import { Stats } from '@/components/Stats'
import { ClientMarquee } from '@/components/ClientMarquee'
import { ContactCTA } from '@/components/ContactCTA'
import { getClients, getPublishedProjects, getServices, getSiteSettings, mediaUrl } from '@/lib/payload'
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
  const [settings, projects, services, clients] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects({ featured: true, limit: 5 }),
    getServices(),
    getClients(),
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(orgSchema(settings))}
      />
      <Hero
        slogan={settings.slogan || 'ADX. Không thể không thấy.'}
        subline={settings.heroSubline}
        banners={(settings.heroBanners || []).map((b) => ({
          caption: b.caption,
          image: b.image,
        }))}
      />

      <section className="container py-20">
        <h2 className="text-h2 reveal-line">Dự án</h2>
        <div className="mt-10 hidden gap-8 lg:grid lg:grid-cols-12">
          {featured[0] ? (
            <div className="col-span-7">
              <ProjectCard project={featured[0]} index={1} aspect="4/5" />
            </div>
          ) : null}
          <div className="col-span-5 mt-[120px] flex flex-col gap-10">
            {featured[1] ? <ProjectCard project={featured[1]} index={2} aspect="4/3" /> : null}
            {featured[2] ? <ProjectCard project={featured[2]} index={3} aspect="4/3" /> : null}
          </div>
          {featured[3] ? (
            <div className="col-span-5">
              <ProjectCard project={featured[3]} index={4} aspect="4/5" />
            </div>
          ) : null}
          {featured[4] ? (
            <div className="col-span-6 col-start-7">
              <ProjectCard project={featured[4]} index={5} aspect="4/3" />
            </div>
          ) : null}
        </div>
        <div className="mt-10 grid gap-10 lg:hidden">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i + 1} aspect="4/5" />
          ))}
        </div>
        <Link href="/du-an" className="link-underline mt-10 inline-block">
          Tất cả dự án →
        </Link>
      </section>

      <section className="container py-10">
        <h2 className="text-h2 reveal-line mb-8">Dịch vụ</h2>
        <ServiceRows services={serviceRows} />
      </section>

      <Stats
        items={(settings.stats || []).map((s) => ({
          value: s.value || '',
          label: s.label || '',
        }))}
      />

      <ClientMarquee
        clients={clients.docs.map((c) => ({
          name: c.name,
          showLogo: c.showLogo,
          logo: c.logo,
        }))}
      />

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
