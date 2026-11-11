import Link from 'next/link'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Giới thiệu ADX | Agency ngoài trời TP.HCM',
  description:
    'Câu chuyện, đội ngũ và khách hàng của ADX — agency quảng cáo ngoài trời và roadshow tại TP.HCM.',
  path: '/gioi-thieu',
})

const rows = [
  { href: '/gioi-thieu/cau-chuyen', name: 'Câu chuyện', order: '01' },
  { href: '/gioi-thieu/doi-ngu', name: 'Đội ngũ', order: '02' },
  { href: '/gioi-thieu/khach-hang', name: 'Khách hàng', order: '03' },
]

export default function AboutIndexPage() {
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
      <div className="container pt-28 pb-20">
        <h1 className="text-h1 mb-10">Giới thiệu</h1>
        <ul>
          {rows.map((r) => (
            <li key={r.href} className="border-t border-[var(--line)] last:border-b">
              <Link href={r.href} className="flex items-center justify-between py-6 md:py-8">
                <span className="flex items-baseline gap-6">
                  <span className="text-index">{r.order}</span>
                  <span className="text-service">{r.name}</span>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
