import Link from 'next/link'
import { notFound } from 'next/navigation'
import { clientLogoSrc } from '@/lib/clientLogos'
import { getAbout, getClients, getPublishedProjects } from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const titles: Record<string, string> = {
  'cau-chuyen': 'Câu chuyện',
  'doi-ngu': 'Đội ngũ',
  'khach-hang': 'Khách hàng',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = titles[slug]
  if (!title) return {}
  return pageMeta({
    title: `${title} | ADX`.slice(0, 60),
    description: `Tìm hiểu ${title.toLowerCase()} của ADX — agency quảng cáo ngoài trời tại TP.HCM.`,
    path: `/gioi-thieu/${slug}`,
  })
}

export default async function AboutSubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!titles[slug]) notFound()
  const about = await getAbout()

  if (slug === 'cau-chuyen') {
    return (
      <AboutShell slug={slug} title="Câu chuyện">
        <p className="max-w-3xl text-lg">{about.intro}</p>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-h3">Tầm nhìn</h2>
            <p className="mt-3">{about.vision}</p>
          </div>
          <div>
            <h2 className="text-h3">Sứ mệnh</h2>
            <p className="mt-3">{about.mission}</p>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-h3">Giá trị</h2>
          <ul className="mt-6 space-y-4">
            {(about.values || []).map((v, i) => (
              <li key={i} className="border-t border-[var(--line)] pt-4">
                <strong>{v.title}</strong> — {v.description}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12">
          <h2 className="text-h3">Cột mốc</h2>
          <ul className="mt-6 space-y-4">
            {(about.milestones || []).map((m, i) => (
              <li key={i} className="grid gap-2 border-t border-[var(--line)] pt-4 md:grid-cols-12">
                <span className="text-index md:col-span-3">{m.year}</span>
                <span className="md:col-span-7">{m.content}</span>
              </li>
            ))}
          </ul>
        </div>
      </AboutShell>
    )
  }

  if (slug === 'doi-ngu') {
    return (
      <AboutShell slug={slug} title="Đội ngũ">
        <div className="grid gap-10 md:grid-cols-2">
          {(about.team || [{ name: '[...]', title: '[...]' }]).map((member, i) => (
            <div key={i}>
              <div className="aspect-[4/5] bg-[var(--bg-alt)] grid place-items-center text-muted">
                <span className="text-small">[Ảnh đội ngũ]</span>
              </div>
              <h2 className="text-h3 mt-4">{member.name}</h2>
              <p className="text-small">{member.title}</p>
            </div>
          ))}
        </div>
      </AboutShell>
    )
  }

  const [clients, projects] = await Promise.all([getClients(), getPublishedProjects({ limit: 50 })])

  return (
    <AboutShell slug={slug} title="Khách hàng">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {clients.docs.map((c) => {
          const related = projects.docs.filter((p) =>
            Array.isArray(p.clients)
              ? p.clients.some((cl) => typeof cl === 'object' && cl && cl.id === c.id)
              : false,
          )
          const logo = clientLogoSrc(c.name)
          return (
            <div key={c.id} className="border-t border-[var(--line)] pt-4">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={c.name}
                  className="h-10 w-auto max-w-[12rem] object-contain"
                />
              ) : (
                <p className="text-h3">{c.name}</p>
              )}
              {related.length ? (
                <ul className="mt-3 space-y-1">
                  {related.map((p) => (
                    <li key={p.id}>
                      <Link href={`/du-an/${p.slug}`} className="text-small underline">
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>
    </AboutShell>
  )
}

function AboutShell({
  slug,
  title,
  children,
}: {
  slug: string
  title: string
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Giới thiệu', path: '/gioi-thieu' },
            { name: title, path: `/gioi-thieu/${slug}` },
          ]),
        )}
      />
      <div className="container pt-28 pb-20">
        <Link href="/gioi-thieu" className="text-small">
          ← Giới thiệu
        </Link>
        <h1 className="text-h1 mt-4 mb-10">{title}</h1>
        {children}
      </div>
    </>
  )
}
