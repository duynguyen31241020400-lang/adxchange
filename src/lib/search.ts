import { getPayload } from 'payload'
import config from '@payload-config'
import { normalizeSearchText } from '@/lib/normalize'
import { mediaUrl } from '@/lib/media'

export type SearchHit = {
  id: string
  title: string
  href: string
  kind: string
  clientLabel?: string
  image?: unknown
  imageUrl?: string | null
  priority: number
}

export async function searchContent(q: string, limit = 6): Promise<SearchHit[]> {
  const query = normalizeSearchText(q).slice(0, 80)
  if (!query) return []
  const terms = query.split(' ').filter(Boolean)
  if (!terms.length) return []

  const payload = await getPayload({ config })

  // Fetch a reasonable candidate set then filter in JS for AND-of-terms
  const result = await payload.find({
    collection: 'search',
    limit: 100,
    depth: 1,
    overrideAccess: true,
  })

  const scored: SearchHit[] = []
  for (const doc of result.docs) {
    const row = doc as unknown as {
      id: string | number
      searchText?: string | null
      title?: string | null
      titleNormalized?: string | null
      clientLabel?: string | null
      kind?: string | null
      href?: string | null
      image?: unknown
      doc?: { relationTo?: string }
    }
    const searchText = String(row.searchText || '')
    if (!terms.every((t) => searchText.includes(t))) continue

    const title = String(row.title || '')
    const titleNorm = String(row.titleNormalized || normalizeSearchText(title))
    const clientLabel = String(row.clientLabel || '')
    const clientNorm = normalizeSearchText(clientLabel)
    let rank = 300
    if (terms.every((t) => titleNorm.includes(t))) rank = 100
    else if (terms.every((t) => clientNorm.includes(t))) rank = 200

    const kind = String(row.kind || row.doc?.relationTo || '')
    const href = String(row.href || '#')
    const image = row.image
    scored.push({
      id: String(row.id),
      title,
      href,
      kind,
      clientLabel: clientLabel || undefined,
      image,
      imageUrl: mediaUrl(image),
      priority: rank,
    })
  }

  scored.sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title))
  return scored.slice(0, limit)
}
