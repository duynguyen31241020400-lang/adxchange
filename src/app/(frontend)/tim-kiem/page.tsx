import Link from 'next/link'
import { ProjectCard } from '@/components/ProjectCard'
import { getServices } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'
import { searchContent } from '@/lib/search'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'Tìm kiếm | ADX',
  description: 'Kết quả tìm kiếm trên website ADX.',
  path: '/tim-kiem',
  noIndex: true,
})

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.slice(0, 80)
  const results = query ? await searchContent(query, 50) : []
  const projectHits = results.filter((r) => r.kind === 'projects')
  const services = await getServices()

  return (
    <div className="container pt-28 pb-20">
      <h1 className="text-h1">Tìm kiếm</h1>
      <p className="text-small mt-4">“{query}”</p>

      {!projectHits.length ? (
        <div className="mt-12">
          <p>Không tìm thấy “{query}”.</p>
          <ul className="mt-8">
            {services.docs.map((s) => (
              <li key={s.id} className="border-t border-[var(--line)] last:border-b">
                <Link href={`/dich-vu/${s.slug}`} className="flex justify-between py-5">
                  <span className="text-service">{s.name}</span>
                  <span>→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {projectHits.map((hit, i) => (
            <ProjectCard
              key={hit.id}
              index={i + 1}
              project={{
                slug: hit.href.replace('/du-an/', ''),
                name: hit.title,
                clientLabel: hit.clientLabel,
                coverImage: hit.image ? { url: hit.imageUrl, alt: hit.title } : null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
