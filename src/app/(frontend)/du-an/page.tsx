import { ProjectCard } from '@/components/ProjectCard'
import { ContactCTA } from '@/components/ContactCTA'
import { ProjectFilters } from '@/components/ProjectFilters'
import { getPublishedProjects, getServices, getSiteSettings } from '@/lib/payload'
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
  const [projects, services, settings] = await Promise.all([
    getPublishedProjects({ serviceSlug }),
    getServices(),
    getSiteSettings(),
  ])

  const usedServiceIds = new Set<string | number>()
  const allProjects = serviceSlug
    ? (await getPublishedProjects()).docs
    : projects.docs
  for (const p of allProjects) {
    if (Array.isArray(p.services)) {
      for (const s of p.services) {
        if (typeof s === 'object' && s && 'id' in s) usedServiceIds.add(s.id)
      }
    }
  }

  const filterServices = services.docs.filter((s) => usedServiceIds.has(s.id))

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
      <div className="container pt-28 pb-10">
        <h1 className="text-h1">Dự án</h1>
        <ProjectFilters services={filterServices} active={serviceSlug} />
        <div className="mt-12 hidden gap-x-8 gap-y-14 lg:grid lg:grid-cols-12">
          {projects.docs.map((p, i) => {
            const row = Math.floor(i / 2)
            const oddRow = row % 2 === 0
            const first = i % 2 === 0
            const span = oddRow ? (first ? 'col-span-7' : 'col-span-5') : first ? 'col-span-5' : 'col-span-7'
            const aspect = i % 2 === 0 ? '4/3' : '4/5'
            return (
              <div key={p.id} className={span}>
                <ProjectCard project={p} index={i + 1} aspect={aspect} />
              </div>
            )
          })}
        </div>
        <div className="mt-12 grid gap-10 lg:hidden">
          {projects.docs.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i + 1} aspect="4/5" />
          ))}
        </div>
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
