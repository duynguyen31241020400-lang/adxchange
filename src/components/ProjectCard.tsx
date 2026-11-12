import Link from 'next/link'
import { mediaAlt, mediaUrl } from '@/lib/media'

type ProjectLike = {
  slug?: string | null
  name?: string | null
  clientLabel?: string | null
  year?: number | null
  coverImage?: unknown
}

export function ProjectCard({
  project,
  index,
  aspect = '4/3',
}: {
  project: ProjectLike
  index: number
  aspect?: '4/3' | '4/5'
}) {
  const href = `/du-an/${project.slug}`
  const src = mediaUrl(project.coverImage)
  const alt = mediaAlt(project.coverImage, project.name || '')
  const meta = [project.clientLabel, project.year].filter(Boolean).join(' · ')

  return (
    <Link href={href} className="project-card group block">
      <div
        className="reveal-image relative overflow-hidden bg-[var(--ruby-deep)]"
        style={{ aspectRatio: aspect }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-end p-6">
            <span className="text-h3 !text-white">{project.name}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start gap-3">
        <span className="text-index">{String(index).padStart(2, '0')}</span>
        <div>
          <h3 className="project-name text-h3 inline">{project.name}</h3>
          {meta ? <p className="text-small mt-1">{meta}</p> : null}
        </div>
      </div>
    </Link>
  )
}
