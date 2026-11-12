import { ContactCTA } from '@/components/ContactCTA'
import { ProjectsBrowser, type BrowserProject } from '@/components/ProjectsBrowser'
import { getPublishedProjects, getServices, getSiteSettings, mediaUrl } from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'Dự án quảng cáo ngoài trời và roadshow đã làm | ADX',
  description:
    'Các dự án quảng cáo ngoài trời, màn hình LED, roadshow xe buýt 2 tầng, human billboard và livestream ADX đã làm cho thương hiệu tại TP.HCM.',
  path: '/du-an',
})

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ 'dich-vu'?: string }>
}) {
  const sp = await searchParams
  const [allProjects, services, settings] = await Promise.all([
    getPublishedProjects({ limit: 100 }),
    getServices(),
    getSiteSettings(),
  ])

  const projects: BrowserProject[] = allProjects.docs.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    clientLabel: p.clientLabel,
    year: p.year,
    summary: (p as { summary?: string | null }).summary,
    coverUrl: mediaUrl(p.coverImage),
    serviceSlugs: (Array.isArray(p.services) ? p.services : []).flatMap((s) =>
      typeof s === 'object' && s && 'slug' in s && s.slug ? [String(s.slug)] : [],
    ),
  }))

  const used = new Set(projects.flatMap((p) => p.serviceSlugs))
  const filterServices = services.docs
    .filter((s) => s.slug && used.has(s.slug))
    .map((s) => ({ slug: s.slug, name: s.name }))

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
        <div className="container pt-28 pb-6 md:pt-32">
          <h1 className="text-display !text-[var(--ruby)]">Dự án</h1>
        </div>
      </div>

      <ProjectsBrowser projects={projects} services={filterServices} initialService={sp['dich-vu']} />

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
