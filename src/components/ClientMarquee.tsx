import { ClientLogo } from '@/components/ClientLogo'
import { clientLogoSrc } from '@/lib/clientLogos'
import { mediaUrl } from '@/lib/media'

export type MarqueeClient = {
  name: string
  showLogo?: boolean | null
  logo?: unknown
}

function resolveLogo(client: MarqueeClient): string | undefined {
  if (client.showLogo) {
    const fromCms = mediaUrl(client.logo)
    if (fromCms) return fromCms
  }
  // Static fallbacks under /public/clients (Wikimedia zip + extras)
  return clientLogoSrc(client.name)
}

function MarqueeItem({ client }: { client: MarqueeClient }) {
  const src = resolveLogo(client)
  return (
    <span className="inline-flex items-center gap-4 text-h3 !text-[var(--muted)]">
      {src ? (
        <ClientLogo
          name={client.name}
          src={src}
          className="h-8 w-auto max-w-[9rem] opacity-90 md:h-10 md:max-w-[11rem]"
        />
      ) : (
        <span>{client.name}</span>
      )}
      <span className="mx-2" aria-hidden>
        /
      </span>
    </span>
  )
}

export function ClientMarquee({
  clients,
  names,
}: {
  clients?: MarqueeClient[]
  /** @deprecated prefer `clients` so CMS logos can win when seeded */
  names?: string[]
}) {
  const items: MarqueeClient[] =
    clients && clients.length
      ? clients
      : (names || []).map((name) => ({ name }))
  if (!items.length) return null

  const row = [...items, ...items]
  return (
    <section className="marquee overflow-hidden border-y border-[var(--line)] py-10" aria-label="Khách hàng">
      {/* Screen readers get the list once; the scrolling copies are decorative. */}
      <ul className="sr-only">
        {items.map((c) => (
          <li key={c.name}>{c.name}</li>
        ))}
      </ul>
      <div className="marquee-track items-center" aria-hidden="true">
        {row.map((client, i) => (
          <MarqueeItem key={`a-${i}`} client={client} />
        ))}
      </div>
      <div className="marquee-track reverse mt-6 items-center" aria-hidden="true">
        {row.map((client, i) => (
          <MarqueeItem key={`b-${i}`} client={client} />
        ))}
      </div>
    </section>
  )
}
