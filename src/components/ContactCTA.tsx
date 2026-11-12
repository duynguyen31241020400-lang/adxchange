import Link from 'next/link'

export function ContactCTA({
  hotlineLabel,
  hotline,
}: {
  hotlineLabel?: string
  hotline?: string
  zalo?: string
  zaloUrl?: string
  email?: string
}) {
  const tel = (hotline || '').replace(/[^\d+]/g, '') || '0939899283'
  return (
    <section className="section-ruby">
      <div className="container py-20 md:py-28">
        <h2 className="text-h1">Có chiến dịch? Gọi ADX.</h2>
        <a href={`tel:${tel}`} className="text-h2 mt-8 block underline underline-offset-8">
          {hotlineLabel?.replace(', Mr. Cường', '') || '(+84) 939 899 283'}
        </a>
        <Link href="/lien-he" className="btn btn-on-ruby mt-10">
          Gửi yêu cầu <span className="btn-arrow">→</span>
        </Link>
      </div>
    </section>
  )
}
