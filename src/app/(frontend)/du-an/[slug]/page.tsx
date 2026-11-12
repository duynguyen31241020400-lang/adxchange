import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactCTA } from '@/components/ContactCTA'
import { CoverParallax } from '@/components/CoverParallax'
import { GalleryLightbox } from '@/components/GalleryLightbox'
import { RichText } from '@/components/RichText'
import {
  getProjectBySlug,
  getPublishedProjects,
  getSiteSettings,
  mediaAlt,
  mediaUrl,
} from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

/** Plain text of a Lexical value (or a string) — used to hide unfilled "[...]" placeholders. */
function plainText(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { text?: string; children?: unknown[]; root?: unknown }
    if (n.root) return walk(n.root)
    return (n.text || '') + (Array.isArray(n.children) ? n.children.map(walk).join(' ') : '')
  }
  return walk(value).trim()
}
const filled = (value: unknown) => {
  const t = plainText(value)
  return t.length > 0 && !/^\[[^\]]*\]$/.test(t)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  const title = `${project.name} | ADX`.slice(0, 60)
  const summary = (project as { summary?: string | null }).summary
  const description = (
    summary ||
    (project.clientLabel
      ? `Dự án ${project.name} cho ${project.clientLabel} — ADX thực hiện tại TP.HCM.`
      : `Dự án ${project.name} — ADX, quảng cáo ngoài trời tại TP.HCM.`)
  ).slice(0, 160)
  return pageMeta({
    title,
    description,
    path: `/du-an/${slug}`,
    image: `/og/${slug}.jpg`,
  })
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, settings, all] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
    getPublishedProjects({ limit: 50 }),
  ])
  if (!project) notFound()

  const ordered = all.docs
  const idx = ordered.findIndex((p) => p.slug === project.slug)
  const next = ordered[(idx >= 0 ? idx + 1 : 0) % ordered.length]
  const nextProject = next && next.slug !== project.slug ? next : ordered.find((p) => p.slug !== project.slug)

  const cover = mediaUrl(project.coverImage)
  const summary = (project as { summary?: string | null }).summary || ''
  const gallery = (project.gallery || [])
    .map((g) => ({
      src: mediaUrl(g.image),
      alt: mediaAlt(g.image, project.name || ''),
    }))
    .filter((g): g is { src: string; alt: string } => Boolean(g.src))

  const services = (Array.isArray(project.services) ? project.services : []).flatMap((s) =>
    typeof s === 'object' && s && 'id' in s
      ? [{ id: s.id, slug: s.slug, name: s.name }]
      : [],
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Dự án', path: '/du-an' },
            { name: project.name || '', path: `/du-an/${slug}` },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.name,
            creator: { '@type': 'Organization', name: 'ADX' },
            dateCreated: project.year ? String(project.year) : undefined,
            image: cover || undefined,
            description: (project as { summary?: string | null }).summary || undefined,
          },
        ])}
      />

      <header className="section-ruby">
        <div className="container pt-28 pb-12">
          <Link href="/du-an" className="text-small !text-white/75 underline underline-offset-4">
            ← Dự án
          </Link>
          <h1 className="text-display mt-6">{project.name}</h1>
          <div className="mt-10 flex flex-wrap gap-x-0 border-t border-[var(--line-on-ruby)]">
            {project.clientLabel ? (
              <div className="min-w-[160px] flex-1 border-b border-[var(--line-on-ruby)] py-4 md:border-r md:pr-6">
                <p className="text-small !text-white/80">Khách hàng</p>
                <p className="mt-1">{project.clientLabel}</p>
              </div>
            ) : null}
            {project.year ? (
              <div className="min-w-[120px] flex-1 border-b border-[var(--line-on-ruby)] py-4 md:border-r md:px-6">
                <p className="text-small !text-white/80">Năm</p>
                <p className="mt-1">{project.year}</p>
              </div>
            ) : null}
            {services.length ? (
              <div className="min-w-[180px] flex-[1.4] border-b border-[var(--line-on-ruby)] py-4 md:pl-6">
                <p className="text-small !text-white/80">Dịch vụ</p>
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  {services.map((s) => (
                    <Link key={s.id} href={`/dich-vu/${s.slug}`} className="underline underline-offset-4">
                      {s.name}
                    </Link>
                  ))}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {cover ? (
        <CoverParallax src={cover} alt={mediaAlt(project.coverImage, project.name || '')} />
      ) : null}

      <div className="section-white">
        <div className="container space-y-16 py-16 md:py-24">
          {filled(summary) ? (
            <p className="text-h3 max-w-4xl !normal-case !font-[family-name:var(--font-body-family)] !text-[clamp(22px,2.4vw,32px)] !leading-snug !text-[var(--ink)]">
              {summary}
            </p>
          ) : null}
          {filled(project.context) && plainText(project.context) !== summary ? (
            <section className="grid gap-6 md:grid-cols-12">
              <h2 className="text-small !text-[var(--ruby)] md:col-span-3">Bối cảnh</h2>
              <div className="text-body-ink md:col-span-7">
                <RichText data={project.context} />
              </div>
            </section>
          ) : null}
          {filled(project.approach) ? (
            <section className="grid gap-6 md:grid-cols-12">
              <h2 className="text-small !text-[var(--ruby)] md:col-span-3">Cách làm</h2>
              <div className="text-body-ink md:col-span-7">
                <RichText data={project.approach} />
              </div>
            </section>
          ) : null}
          {project.results?.length || filled(project.resultText) ? (
            <section className="grid gap-6 md:grid-cols-12">
              <h2 className="text-small !text-[var(--ruby)] md:col-span-3">Kết quả</h2>
              <div className="text-body-ink md:col-span-7">
                {project.results?.length ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {project.results.map((r, i) => (
                      <div key={i}>
                        <p className="text-stat !text-[var(--ruby)]">{r.value}</p>
                        <p className="text-small mt-2">{r.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{project.resultText}</p>
                )}
              </div>
            </section>
          ) : null}

          {project.videoUrl ? (
            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="btn">
              Xem video <span className="btn-arrow">→</span>
            </a>
          ) : null}

          {gallery.length ? <GalleryLightbox images={gallery} /> : null}
        </div>
      </div>

      {nextProject ? (
        <section className="section-ruby">
          <div className="container flex min-h-[100svh] flex-col justify-center py-20">
            <p className="text-index !text-white/80">Dự án tiếp theo</p>
            <h2 className="text-display mt-6">
              <Link href={`/du-an/${nextProject.slug}`}>{nextProject.name}</Link>
            </h2>
            <Link href={`/du-an/${nextProject.slug}`} className="btn btn-on-ruby mt-10 w-fit">
              Xem dự án tiếp <span className="btn-arrow">→</span>
            </Link>
          </div>
        </section>
      ) : (
        <ContactCTA
          hotlineLabel={settings.hotlineLabel || undefined}
          hotline={settings.hotline || undefined}
        />
      )}
    </>
  )
}
