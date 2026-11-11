import type { BeforeSync } from '@payloadcms/plugin-search/types'
import { normalizeSearchText } from '@/lib/normalize'

function lexicalToPlain(data: unknown): string {
  if (!data || typeof data !== 'object') return ''
  const root = (data as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''
  const parts: string[] = []
  const walk = (nodes: unknown[]) => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue
      const n = node as { text?: string; children?: unknown[] }
      if (typeof n.text === 'string') parts.push(n.text)
      if (Array.isArray(n.children)) walk(n.children)
    }
  }
  walk(root.children)
  return parts.join(' ')
}

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
  const collection = searchDoc.doc.relationTo
  const doc = originalDoc as Record<string, unknown>

  let title = ''
  let clientLabel = ''
  let body = ''
  let href = ''
  let image: unknown = undefined
  const kind = collection

  if (collection === 'projects') {
    title = String(doc.name || '')
    clientLabel = String(doc.clientLabel || '')
    body = [
      lexicalToPlain(doc.context),
      lexicalToPlain(doc.approach),
      String(doc.resultText || ''),
      Array.isArray(doc.results)
        ? (doc.results as { value?: string; label?: string }[])
            .map((r) => `${r.value || ''} ${r.label || ''}`)
            .join(' ')
        : '',
    ].join(' ')
    href = `/du-an/${doc.slug}`
    image = doc.coverImage
  } else if (collection === 'services') {
    title = String(doc.name || '')
    body = String(doc.description || '')
    href = `/dich-vu/${doc.slug}`
    image = doc.image
  } else if (collection === 'faqs') {
    title = String(doc.question || '')
    body = String(doc.answer || '')
    href = '/lien-he#faq'
  }

  const searchText = normalizeSearchText([title, clientLabel, body].filter(Boolean).join(' '))

  return {
    ...searchDoc,
    title,
    searchText,
    titleNormalized: normalizeSearchText(title),
    kind,
    clientLabel,
    href,
    image: typeof image === 'object' && image && 'id' in image ? (image as { id: string | number }).id : image,
  }
}
