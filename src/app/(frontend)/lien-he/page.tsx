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
      <div className="container pt-28 pb-20">
        <h1 className="text-h1">Liên hệ</h1>
        <div className="mt-12 grid gap-14 lg:grid-cols-2">
          <div>
            <a href={`tel:${tel}`} className="text-h2 block">
              {settings.hotlineLabel || '(+84) 939 899 283, Mr. Cường'}
            </a>
            <p className="mt-4">
              <a className="underline" href={settings.zaloUrl || 'https://zalo.me/0939899283'}>
                Zalo {settings.zalo}
              </a>
            </p>
            <p className="mt-2">
              <a className="underline" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
            <div className="mt-8 space-y-6">
              <div>
                <p>{settings.officeAddress}</p>
                {settings.officeAddress ? (
                  <a className="link-underline mt-2 inline-block" href={mapsUrl(settings.officeAddress)} target="_blank" rel="noopener noreferrer">
                    Xem bản đồ →
                  </a>
                ) : null}
              </div>
              <div>
                <p>{settings.branchAddress}</p>
                {settings.branchAddress ? (
                  <a className="link-underline mt-2 inline-block" href={mapsUrl(settings.branchAddress)} target="_blank" rel="noopener noreferrer">
                    Xem bản đồ →
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <ContactForm services={services.docs.map((s) => ({ id: s.id, name: s.name }))} />
        </div>

        <section className="mt-20" id="faq">
          <h2 className="text-h2 mb-8">Câu hỏi thường gặp</h2>
          <div>
            {faqs.docs.map((f) => (
              <details key={f.id} className="border-t border-[var(--line)] py-4 last:border-b">
                <summary className="cursor-pointer text-h3">{f.question}</summary>
                <p className="mt-3 max-w-3xl">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
