import Link from 'next/link';
import { LogoutButton } from '@/modules/identity/logout-button';

export function MarketingNav() {
  return <header className="nav"><div className="container nav-inner"><Link className="brand" href="/">ADXCHANGE</Link><nav className="nav-links"><Link href="/advertisers">Nhà quảng cáo</Link><Link href="/publishers">Chủ địa điểm</Link><Link href="/register">Đăng ký</Link><Link className="btn btn-primary" href="/login">Đăng nhập</Link></nav></div></header>;
}

export function Footer() { return <footer className="footer"><div className="container">ADXCHANGE · Market-validation MVP · Các số liệu trong dashboard demo không phải dữ liệu vận hành thật.</div></footer>; }

export function AppShell({ role, title, children }: { role: 'advertiser'|'publisher'|'ops'; title: string; children: React.ReactNode }) {
  const links = role === 'advertiser' ? [['Dashboard','/app/advertiser/dashboard'],['Campaigns','/app/advertiser/campaigns'],['Tạo campaign','/app/advertiser/campaigns/new'],['Reports','/app/advertiser/reports'],['Billing','/app/advertiser/billing']] : role === 'publisher' ? [['Onboarding','/earner/onboarding'],['Dashboard','/earner/dashboard'],['Venues','/earner/venues'],['Screens','/earner/screens'],['Content','/earner/content'],['Earnings','/earner/earnings'],['Payouts','/earner/payouts']] : [['Overview','/ops/dashboard'],['Campaigns','/ops/campaigns'],['Venues','/ops/venues'],['Screens','/ops/screens'],['Playbacks','/ops/playbacks'],['Reconciliation','/ops/reconciliation']];
  return <div className="app-shell"><aside className="sidebar"><Link href="/" className="brand">ADXCHANGE</Link><div style={{fontSize:12,opacity:.55,marginBottom:12,textTransform:'uppercase'}}>{role}</div>{links.map(([label,href])=><Link className="side-link" href={href} key={href}>{label}</Link>)}<LogoutButton/></aside><main className="app-main"><div className="app-top"><div><div className="kicker">{role} workspace</div><h2 style={{margin:0}}>{title}</h2></div></div>{children}</main></div>;
}
