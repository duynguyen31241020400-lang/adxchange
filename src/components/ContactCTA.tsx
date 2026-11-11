import Link from 'next/link'

export function ContactCTA({
  hotlineLabel,
  hotline,
  zalo,
  zaloUrl,
  email,
}: {
  hotlineLabel?: string
  hotline?: string
  zalo?: string
  zaloUrl?: string
  email?: string
}) {
  const tel = (hotline || '').replace(/[^\d+]/g, '') || '0939899283'
  return (
    <section className="container py-20">
      <h2 className="text-h2">Có chiến dịch? Gọi ADX.</h2>
      <a href={`tel:${tel}`} className="text-h1 mt-6 block">
        {hotlineLabel?.replace(', Mr. Cường', '') || '(+84) 939 899 283'}
      </a>
      <p className="mt-4 text-small">
        <a className="underline" href={zaloUrl || 'https://zalo.me/0939899283'}>
          Zalo {zalo || '0939 899 283'}
        </a>
        {' · '}
        <a className="underline" href={`mailto:${email || 'cuong@adxchange.agency'}`}>
          Email
        </a>
      </p>
      <Link href="/lien-he" className="btn mt-8">
        Gửi yêu cầu →
      </Link>
    </section>
  )
}
