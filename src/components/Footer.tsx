import Link from 'next/link'

type Social = { label: string; url: string }

type Props = {
  slogan?: string
  hotlineLabel?: string
  hotline?: string
  zalo?: string
  zaloUrl?: string
  email?: string
  officeAddress?: string
  branchAddress?: string
  legalName?: string
  taxId?: string
  social?: Social[]
  capabilityHref?: string
}

function Strip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="contact-strip">
      <div className="contact-strip-label">{label}</div>
      <div>{children}</div>
    </div>
  )
}

export function Footer(props: Props) {
  const tel = (props.hotline || '').replace(/[^\d+]/g, '') || '0939899283'
  const email = props.email || 'cuong@adxchange.agency'
  const mapsOffice = props.officeAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.officeAddress)}`
    : null
  const mapsBranch = props.branchAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.branchAddress)}`
    : null

  return (
    <footer className="section-ruby-deep mt-0">
      <div className="container py-16">
        <p className="text-h2">{props.slogan || 'ADX. Không thể không thấy.'}</p>

        <div className="mt-12">
          <Strip label="Gọi">
            <a className="text-h3" href={`tel:${tel}`}>
              {props.hotlineLabel?.replace(', Mr. Cường', '') || '(+84) 939 899 283'}
            </a>
            <p className="mt-1 text-small !text-white/70">Mr. Cường</p>
          </Strip>
          <Strip label="Nhắn">
            <a className="underline underline-offset-4" href={props.zaloUrl || 'https://zalo.me/0939899283'}>
              Zalo {props.zalo || '0939 899 283'}
            </a>
            {' · '}
            <a className="underline underline-offset-4" href={`mailto:${email}`}>
              {email}
            </a>
          </Strip>
          <Strip label="Văn phòng">
            {props.officeAddress ? (
              <p>
                {props.officeAddress}{' '}
                {mapsOffice ? (
                  <a className="underline underline-offset-4" href={mapsOffice} target="_blank" rel="noreferrer">
                    Xem bản đồ →
                  </a>
                ) : null}
              </p>
            ) : null}
            {props.branchAddress ? (
              <p className="mt-2">
                {props.branchAddress}{' '}
                {mapsBranch ? (
                  <a className="underline underline-offset-4" href={mapsBranch} target="_blank" rel="noreferrer">
                    Xem bản đồ →
                  </a>
                ) : null}
              </p>
            ) : null}
          </Strip>
          {(props.social || []).length ? (
            <Strip label="Mạng xã hội">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {(props.social || []).map((s) =>
                  s.url ? (
                    <a key={s.url} href={s.url} className="underline underline-offset-4" target="_blank" rel="noreferrer">
                      {s.label || s.url}
                    </a>
                  ) : null,
                )}
              </div>
            </Strip>
          ) : null}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          {props.capabilityHref ? (
            <a className="btn btn-on-ruby" href={props.capabilityHref} target="_blank" rel="noreferrer">
              Tải hồ sơ năng lực <span className="btn-arrow">→</span>
            </a>
          ) : null}
          <Link href="/chinh-sach-bao-mat" className="underline underline-offset-4">
            Chính sách bảo mật →
          </Link>
        </div>

        <p className="mt-12 border-t border-[var(--line-on-ruby)] pt-6 text-small !text-white/70">
          © 2026 {props.legalName || 'Công ty TNHH Nine Dozen'} · MST {props.taxId || '0316555777'}
        </p>
      </div>
    </footer>
  )
}
