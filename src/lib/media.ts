/** Payload local uploads resolve to `/api/media/file/...` at read time.
 *  On Netlify those binaries are mirrored under `public/media/file/` (no R2 yet),
 *  so rewrite local API paths to static public paths. Absolute/R2 URLs stay as-is.
 */
function toPublicMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('/api/media/file/')) {
    return url.replace('/api/media/file/', '/media/file/')
  }
  return url
}

export function mediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { url?: string | null; sizes?: Record<string, { url?: string | null }> }
  return (
    toPublicMediaUrl(m.url) ||
    toPublicMediaUrl(m.sizes?.card?.url) ||
    toPublicMediaUrl(m.sizes?.full?.url) ||
    null
  )
}

export function mediaAlt(media: unknown, fallback = ''): string {
  if (!media || typeof media !== 'object') return fallback
  return (media as { alt?: string }).alt || fallback
}
