export function mediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { url?: string | null; sizes?: Record<string, { url?: string | null }> }
  return m.url || m.sizes?.card?.url || m.sizes?.full?.url || null
}

export function mediaAlt(media: unknown, fallback = ''): string {
  if (!media || typeof media !== 'object') return fallback
  return (media as { alt?: string }).alt || fallback
}
