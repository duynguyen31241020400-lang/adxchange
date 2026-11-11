import Link from 'next/link'

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
}

export function Footer(props: Props) {
  const tel = (props.hotline || '').replace(/[^\d+]/g, '') || '0939899283'
  return (
    <footer className="mt-24 bg-[var(--dark)] text-[var(--bg)]">
      <div className="container py-16">
        <p className="text-h1 !text-[var(--bg)]">{props.slogan || 'ADX. Không thể không thấy.'}</p>
        <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-3">
          <div>
            <p className="text-small !text-white/60">Liên hệ</p>
            <a className="mt-3 block text-h3 !text-[var(--bg)]" href={`tel:${tel}`}>
              {props.hotlineLabel || '(+84) 939 899 283'}
            </a>
            <a className="mt-2 block underline" href={props.zaloUrl || 'https://zalo.me/0939899283'}>
              Zalo {props.zalo || '0939 899 283'}
            </a>
            <a className="mt-2 block underline" href={`mailto:${props.email || 'cuong@adxchange.agency'}`}>
              {props.email || 'cuong@adxchange.agency'}
            </a>
          </div>
          <div>
            <p className="text-small !text-white/60">Địa chỉ</p>
            <p className="mt-3">{props.officeAddress}</p>
            <p className="mt-4">{props.branchAddress}</p>
          </div>
          <div>
            <p className="text-small !text-white/60">Liên kết</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/du-an" className="underline">
                Dự án
              </Link>
              <Link href="/dich-vu" className="underline">
                Dịch vụ
              </Link>
              <Link href="/gioi-thieu" className="underline">
                Giới thiệu
              </Link>
              <Link href="/chinh-sach-bao-mat" className="underline">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-12 border-t border-white/15 pt-6 text-small !text-white/55">
          © 2026 {props.legalName || 'Công ty TNHH Nine Dozen'} · MST {props.taxId || '0316555777'}
        </p>
      </div>
    </footer>
  )
}
