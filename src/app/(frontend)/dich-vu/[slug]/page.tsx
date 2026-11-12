import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactCTA } from '@/components/ContactCTA'
import { ProjectCard } from '@/components/ProjectCard'
import {
  getPublishedProjects,
  getServiceBySlug,
  getSiteSettings,
  mediaAlt,
  mediaUrl,
} from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}
  return pageMeta({
    title: `${service.name} | ADX`.slice(0, 60),
    description: String(service.description || '').slice(0, 160),
    path: `/dich-vu/${slug}`,
  })
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()])
  if (!service) notFound()
  const projects = await getPublishedProjects({ serviceSlug: slug })
  const img = mediaUrl(service.image)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Dịch vụ', path: '/dich-vu' },
            { name: service.name || '', path: `/dich-vu/${slug}` },
          ]),
        )}
      />
      <header className="section-ruby">
        <div className="container pt-28 pb-12">
          <Link href="/dich-vu" className="text-small !text-white/75 underline underline-offset-4">
            ← Dịch vụ
          </Link>
          <h1 className="text-display mt-6">{service.name}</h1>
        </div>
      </header>
      <div className="section-white">
        <div className="container pb-16 pt-10">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={mediaAlt(service.image, service.name || '')}
              className="aspect-[16/9] w-full object-cover"
            />
          ) : null}
          <p className="mt-8 max-w-3xl text-[var(--ink)]">{service.description}</p>

          {projects.docs.length ? (
            <div className="mt-16">
              <h2 className="text-h2 !text-[var(--ruby)]">Dự án</h2>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                {projects.docs.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i + 1} aspect="4/3" />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <ContactCTA
        hotlineLabel={settings.hotlineLabel || undefined}
        hotline={settings.hotline || undefined}
      />
    </>
  )
}
