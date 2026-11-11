import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactCTA } from '@/components/ContactCTA'
import { ProjectCard } from '@/components/ProjectCard'
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  const title = `${project.name} | ADX`.slice(0, 60)
  const description =
    project.clientLabel
      ? `Dự án ${project.name} cho ${project.clientLabel} — ADX thực hiện tại TP.HCM.`
      : `Dự án ${project.name} — ADX, quảng cáo ngoài trời tại TP.HCM.`
  return pageMeta({
    title,
    description: description.slice(0, 160),
    path: `/du-an/${slug}`,
    image: `/og/${slug}.jpg`,
  })
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()])
  if (!project) notFound()

  const serviceIds = Array.isArray(project.services)
    ? project.services.map((s) => (typeof s === 'object' && s ? s.id : s))
    : []
  const all = await getPublishedProjects({ limit: 20 })
  const related = all.docs
    .filter((p) => p.slug !== project.slug)
    .filter((p) =>
      Array.isArray(p.services)
        ? p.services.some((s) => typeof s === 'object' && s && serviceIds.includes(s.id))
        : false,
    )
    .slice(0, 2)
  const relatedFinal =
    related.length >= 2
      ? related
      : [...related, ...all.docs.filter((p) => p.slug !== project.slug && !related.find((r) => r.id === p.id))].slice(
          0,
          2,
        )

  const cover = mediaUrl(project.coverImage)
  const gallery = (project.gallery || [])
    .map((g) => ({
      src: mediaUrl(g.image),
      alt: mediaAlt(g.image, project.name || ''),
    }))
    .filter((g): g is { src: string; alt: string } => Boolean(g.src))

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
          },
        ])}
      />

      <div className="relative h-[80svh] bg-[var(--dark)]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={mediaAlt(project.coverImage, project.name || '')}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-end p-8">
            <span className="text-h1 !text-white">{project.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container absolute inset-x-0 bottom-0 pb-10">
          <Link href="/du-an" className="text-small !text-white/80">
            ← Dự án
          </Link>
          <h1 className="text-h1 mt-4 !text-white">{project.name}</h1>
        </div>
      </div>

      <div className="container py-10">
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-[var(--line)] py-4 text-small">
          {project.clientLabel ? <span>Khách hàng · {project.clientLabel}</span> : null}
          {project.year ? <span>Năm · {project.year}</span> : null}
          {Array.isArray(project.services) &&
            project.services.map((s) =>
              typeof s === 'object' && s ? (
                <Link key={s.id} href={`/dich-vu/${s.slug}`} className="underline">
                  {s.name}
                </Link>
              ) : null,
            )}
        </div>

        <div className="mt-12 space-y-12">
          <section className="grid gap-6 md:grid-cols-12">
            <h2 className="text-small md:col-span-3">Bối cảnh</h2>
            <div className="md:col-span-7">
              <RichText data={project.context} />
            </div>
          </section>
          <section className="grid gap-6 md:grid-cols-12">
            <h2 className="text-small md:col-span-3">Cách làm</h2>
            <div className="md:col-span-7">
              <RichText data={project.approach} />
            </div>
          </section>
          <section className="grid gap-6 md:grid-cols-12">
            <h2 className="text-small md:col-span-3">Kết quả</h2>
            <div className="md:col-span-7">
              {project.results?.length ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {project.results.map((r, i) => (
                    <div key={i}>
                      <p className="text-stat">{r.value}</p>
                      <p className="text-small mt-2">{r.label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{project.resultText}</p>
              )}
            </div>
          </section>
        </div>

        {project.videoUrl ? (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-10"
          >
            Xem video →
          </a>
        ) : null}

        {gallery.length ? (
          <div className="mt-16">
            <GalleryLightbox images={gallery} />
          </div>
        ) : null}

        {relatedFinal.length ? (
          <div className="mt-20">
            <h2 className="text-h2">Dự án khác</h2>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {relatedFinal.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i + 1} aspect="4/3" />
              ))}
            </div>
          </div>
        ) : null}
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
