import { RichText } from '@/components/RichText'
import { getPrivacy } from '@/lib/payload'
import { breadcrumbSchema, jsonLd, pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'Chính sách bảo mật | ADX',
  description:
    'Chính sách bảo mật dữ liệu cá nhân của Công ty TNHH Nine Dozen (ADX) khi bạn gửi yêu cầu trên website.',
  path: '/chinh-sach-bao-mat',
})

export default async function PrivacyPage() {
  const privacy = await getPrivacy()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema([
            { name: 'Trang chủ', path: '/' },
            { name: 'Chính sách bảo mật', path: '/chinh-sach-bao-mat' },
          ]),
        )}
      />
      <div className="container prose-like pt-28 pb-20">
        <h1 className="text-h1 mb-10">Chính sách bảo mật</h1>
        <RichText data={privacy.content} />
      </div>
    </>
  )
}
