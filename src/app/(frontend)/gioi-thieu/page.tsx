import Link from 'next/link'
import { AboutToc, type TocItem } from '@/components/AboutToc'
import { ClientLogo } from '@/components/ClientLogo'
import { ContactCTA } from '@/components/ContactCTA'
import { MilestoneStrip } from '@/components/MilestoneStrip'
import { ServiceRows } from '@/components/ServiceRows'
import { clientLogoSrc } from '@/lib/clientLogos'
import {
  getAbout,
  getClients,
  getServices,
  getSiteSettings,
  mediaUrl,
} from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'Giới thiệu ADX | Agency ngoài trời TP.HCM',
  description:
    'Câu chuyện, dịch vụ, cột mốc, khách hàng và đội ngũ ADX — agency quảng cáo ngoài trời tại TP.HCM.',
  path: '/gioi-thieu',
})

function isRealTeam(team: { name?: string | null; title?: string | null }[] | null | undefined) {
  if (!team?.length) return false
  return team.some((m) => m.name && !/\[.*\]/.test(m.name))
}

export default async function AboutPage() {
  const [about, services, clients, settings] = await Promise.all([
    getAbout(),
    getServices(),
    getClients(),
    getSiteSettings(),
  ])

  const showTeam = isRealTeam(about.team)
  const toc: TocItem[] = [
    { id: 'cau-chuyen', label: 'Câu chuyện', number: '01' },
    { id: 'dich-vu', label: 'Dịch vụ', number: '02' },
    { id: 'cot-moc', label: 'Cột mốc', number: '03' },
    { id: 'khach-hang', label: 'Khách hàng', number: '04' },
  ]
  if (showTeam) toc.push({ id: 'doi-ngu', label: 'Đội ngũ', number: '05' })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Giới thiệu', path: '/gioi-thieu' },
          ]),
        )}
      />

      <header className="section-ruby">
        <div className="container pt-28 pb-16">
          <h1 className="text-display">Về ADX</h1>
        </div>
      </header>

      <div className="section-white">
        <div className="container flex flex-col gap-10 py-12 md:flex-row md:items-start md:gap-16 md:py-20">
          <AboutToc items={toc} />

          <div className="min-w-0 flex-1 space-y-24">
            <section id="cau-chuyen" className="scroll-mt-28">
              <h2 className="text-index !text-[var(--muted)]">01 · Câu chuyện</h2>
              <p className="mt-6 max-w-3xl text-lg text-[var(--ink)]">{about.intro}</p>
              <p className="text-h2 mt-12 !text-[var(--ruby)]">{about.vision}</p>
              <p className="text-h3 mt-8 max-w-2xl !text-[var(--ink)]">{about.mission}</p>
              <div className="mt-14 grid gap-8 md:grid-cols-3">
                {(about.values || []).map((v, i) => (
                  <div key={i} className="border-t border-[var(--line)] pt-5">
                    <p className="text-index">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="text-h3 mt-3 !text-[var(--ruby)]">{v.title}</h3>
                    <p className="mt-2 text-[var(--ink)]">{v.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="dich-vu" className="scroll-mt-28">
              <h2 className="text-index !text-[var(--muted)]">02 · Dịch vụ</h2>
              <div className="mt-8">
                <ServiceRows
                  services={services.docs.map((s) => ({
                    ...s,
                    relatedImageUrl: mediaUrl(s.image),
                  }))}
                />
              </div>
            </section>

            <section id="cot-moc" className="scroll-mt-28">
              <h2 className="text-index !text-[var(--muted)]">03 · Cột mốc</h2>
              <div className="mt-8">
                <MilestoneStrip items={about.milestones || []} />
              </div>
            </section>

            <section id="khach-hang" className="scroll-mt-28">
              <h2 className="text-index !text-[var(--muted)]">04 · Khách hàng</h2>
              <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {clients.docs.map((c) => {
                  const logo = (c.showLogo ? mediaUrl(c.logo) : null) || clientLogoSrc(c.name) || null
                  return (
                    <div key={c.id} className="border-t border-[var(--line)] pt-4">
                      {logo ? (
                        <ClientLogo name={c.name} src={logo} className="h-10 w-auto max-w-[12rem]" />
                      ) : (
                        <p className="text-h3 !text-[var(--ruby)]">{c.name}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {showTeam ? (
              <section id="doi-ngu" className="scroll-mt-28">
                <h2 className="text-index !text-[var(--muted)]">05 · Đội ngũ</h2>
                <div className="mt-10 grid gap-10 md:grid-cols-2">
                  {(about.team || []).map((member, i) => (
                    <div key={i}>
                      <div className="aspect-[4/5] bg-[var(--ruby)]/5 grid place-items-center">
                        <span className="text-small">[Ảnh]</span>
                      </div>
                      <h3 className="text-h3 mt-4 !text-[var(--ruby)]">{member.name}</h3>
                      <p className="text-small">{member.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <p className="text-small">
              <Link href="/lien-he" className="underline underline-offset-4">
                Liên hệ ADX →
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ContactCTA
        hotlineLabel={settings.hotlineLabel || undefined}
        hotline={settings.hotline || undefined}
      />
    </>
  )
}
