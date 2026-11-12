import { ContactCTA } from '@/components/ContactCTA'
import { ProjectFilters } from '@/components/ProjectFilters'
import { FilmReel } from '@/components/FilmReel'
import { ProjectListRows } from '@/components/ProjectListRows'
import { getPublishedProjects, getServices, getSiteSettings, mediaUrl } from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'Dự án quảng cáo ngoài trời | ADX',
  description:
    'Xem các dự án OOH, roadshow, human billboard và livestream do ADX thực hiện tại TP.HCM.',
  path: '/du-an',
})

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ 'dich-vu'?: string }>
}) {
  const sp = await searchParams
  const serviceSlug = sp['dich-vu']
  const [projects, services, settings, allProjects] = await Promise.all([
    getPublishedProjects({ serviceSlug }),
    getServices(),
    getSiteSettings(),
    getPublishedProjects({ limit: 100 }),
  ])

  const counts: Record<string, number> = {}
  for (const p of allProjects.docs) {
    if (Array.isArray(p.services)) {
      for (const s of p.services) {
        if (typeof s === 'object' && s && 'slug' in s && s.slug) {
          counts[String(s.slug)] = (counts[String(s.slug)] || 0) + 1
        }
      }
    }
  }

  const filterServices = services.docs.filter((s) => s.slug && (counts[s.slug] || 0) > 0)

  const rows = projects.docs.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    clientLabel: p.clientLabel,
    year: p.year,
    summary: (p as { summary?: string | null }).summary,
    coverUrl: mediaUrl(p.coverImage),
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Dự án', path: '/du-an' },
          ]),
        )}
      />
      <div className="section-white">
        <div className="container pt-28 pb-10">
          <h1 className="text-display !text-[var(--ruby)]">Dự án</h1>
          <ProjectFilters
            services={filterServices}
            active={serviceSlug}
            counts={counts}
            total={allProjects.docs.length}
          />
        </div>
      </div>

      <FilmReel projects={rows} />
      <ProjectListRows projects={rows} />

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
