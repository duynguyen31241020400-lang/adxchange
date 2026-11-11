import { clientLogoNeedsDarkChip } from '@/lib/clientLogos'

type ClientLogoProps = {
  name: string
  src: string
  className?: string
}

/**
 * Renders a client brand mark. Light-on-transparent logos (flagged in
 * clientLogos) get a small dark chip so they stay readable on cream `--bg`.
 */
export function ClientLogo({ name, src, className }: ClientLogoProps) {
  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src={src} alt={name} className={`client-logo object-contain ${className ?? ''}`} />

  if (!clientLogoNeedsDarkChip(name)) return img

  return (
    <span className="client-logo-dark-chip inline-flex items-center rounded-sm bg-[var(--dark)] px-2 py-1.5">
      {img}
    </span>
  )
}
