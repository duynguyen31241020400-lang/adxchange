import { ContactForm } from '@/components/ContactForm'
import { getFaqs, getServices, getSiteSettings } from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'Liên hệ ADX | Báo giá quảng cáo ngoài trời',
  description:
    'Gọi hotline hoặc gửi yêu cầu báo giá cho chiến dịch OOH, roadshow và sự kiện với ADX tại TP.HCM.',
  path: '/lien-he',
})

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

function Strip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="contact-strip">
      <div className="contact-strip-label">{label}</div>
      <div>{children}</div>
    </div>
  )
}

export default async function ContactPage() {
  const [settings, services, faqs] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getFaqs(),
  ])
  const tel = (settings.hotline || '').replace(/[^\d+]/g, '') || '0939899283'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          breadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Liên hệ', path: '/lien-he' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.docs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          },
        ])}
      />

      <div className="section-ruby min-h-screen">
        <div className="container pt-28 pb-20">
          <h1 className="text-display">Liên hệ</h1>

          <div className="mt-14">
            <Strip label="Gọi">
              <a href={`tel:${tel}`} className="text-h2">
                {settings.hotlineLabel?.replace(', Mr. Cường', '') || '(+84) 939 899 283'}
              </a>
              <p className="mt-1 text-small !text-white/70">Mr. Cường</p>
            </Strip>
            <Strip label="Nhắn">
              <a className="underline underline-offset-4" href={settings.zaloUrl || 'https://zalo.me/0939899283'}>
                Zalo {settings.zalo || '0939 899 283'}
              </a>
              {' · '}
              <a className="underline underline-offset-4" href={`mailto:${settings.email || 'cuong@adxchange.agency'}`}>
                {settings.email || 'cuong@adxchange.agency'}
              </a>
            </Strip>
            <Strip label="Văn phòng">
              {settings.officeAddress ? (
                <p>
                  {settings.officeAddress}{' '}
                  <a className="underline underline-offset-4" href={mapsUrl(settings.officeAddress)} target="_blank" rel="noopener noreferrer">
                    Xem bản đồ →
                  </a>
                </p>
              ) : null}
              {settings.branchAddress ? (
                <p className="mt-2">
                  {settings.branchAddress}{' '}
                  <a className="underline underline-offset-4" href={mapsUrl(settings.branchAddress)} target="_blank" rel="noopener noreferrer">
                    Xem bản đồ →
                  </a>
                </p>
              ) : null}
            </Strip>
            {(settings.social || []).length ? (
              <Strip label="Mạng xã hội">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {(settings.social || []).map((s) =>
                    s.url ? (
                      <a key={s.url} href={s.url} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                        {s.label || s.url}
                      </a>
                    ) : null,
                  )}
                </div>
              </Strip>
            ) : null}
          </div>

          <div className="mt-16 max-w-2xl">
            <h2 className="text-h3 mb-8">Gửi yêu cầu</h2>
            <ContactForm
              variant="onRuby"
              services={services.docs.map((s) => ({ id: s.id, name: s.name }))}
            />
          </div>

          <section className="mt-20" id="faq">
            <h2 className="text-h2 mb-2">Câu hỏi thường gặp</h2>
            <div>
              {faqs.docs.map((f) => (
                <details key={f.id} className="border-t border-[var(--line-on-ruby)] py-5 last:border-b">
                  <summary className="cursor-pointer text-h3 list-none">{f.question}</summary>
                  <p className="mt-3 max-w-3xl text-white/85">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
