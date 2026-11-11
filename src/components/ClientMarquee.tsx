import { clientLogoSrc } from '@/lib/clientLogos'

function MarqueeItem({ name }: { name: string }) {
  const src = clientLogoSrc(name)
  return (
    <span className="inline-flex items-center gap-4 text-h3 !text-[var(--muted)]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-8 w-auto max-w-[9rem] object-contain opacity-80 md:h-10 md:max-w-[11rem]"
        />
      ) : (
        <span>{name}</span>
      )}
      <span className="mx-2" aria-hidden>
        /
      </span>
    </span>
  )
}

export function ClientMarquee({ names }: { names: string[] }) {
  const row = [...names, ...names]
  return (
    <section className="marquee overflow-hidden border-y border-[var(--line)] py-10" aria-label="Khách hàng">
      <div className="marquee-track">
        {row.map((name, i) => (
          <MarqueeItem key={`a-${i}`} name={name} />
        ))}
      </div>
      <div className="marquee-track reverse mt-6">
        {row.map((name, i) => (
          <MarqueeItem key={`b-${i}`} name={name} />
        ))}
      </div>
    </section>
  )
}
