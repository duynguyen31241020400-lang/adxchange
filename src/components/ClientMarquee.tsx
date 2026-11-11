export function ClientMarquee({ names }: { names: string[] }) {
  const row = [...names, ...names]
  return (
    <section className="marquee overflow-hidden border-y border-[var(--line)] py-10" aria-label="Khách hàng">
      <div className="marquee-track">
        {row.map((name, i) => (
          <span key={`a-${i}`} className="text-h3 !text-[var(--muted)]">
            {name}
            <span className="mx-4">/</span>
          </span>
        ))}
      </div>
      <div className="marquee-track reverse mt-6">
        {row.map((name, i) => (
          <span key={`b-${i}`} className="text-h3 !text-[var(--muted)]">
            {name}
            <span className="mx-4">/</span>
          </span>
        ))}
      </div>
    </section>
  )
}
