import Link from 'next/link';
import { Footer, MarketingNav } from '@/shared/site';

export default function HomePage() {
  return <>
    <MarketingNav />
    <main>
      <section className="hero"><div className="container hero-grid">
        <div>
          <span className="eyebrow">Vietnam DOOH Marketplace</span>
          <h1>Biến màn hình nhàn rỗi thành mạng lưới quảng cáo địa phương.</h1>
          <p style={{fontSize:18,maxWidth:680}}>Adxchange kết nối trực tiếp thương hiệu cần tiếp cận khách hàng quanh khu vực với các địa điểm đang có sẵn màn hình TV.</p>
          <div className="hero-actions"><Link href="/advertisers" className="btn btn-primary">Tôi muốn quảng cáo</Link><Link href="/publishers" className="btn btn-secondary">Tôi có màn hình</Link></div>
        </div>
        
      </div></section>
      <section className="section"><div className="container">
        <div className="section-head"><div className="kicker">Hai phía, một nền tảng</div><h2>Bạn đến Adxchange để làm gì?</h2></div>
        <div className="split-cta">
          <div className="card card-accent"><div className="kicker" style={{color:'white'}}>Advertiser</div><h2>Tiếp cận đúng khu vực.</h2><p>Khởi tạo campaign, chọn địa điểm, time slot và creative; theo dõi play logs và proof-of-play.</p><Link className="btn btn-secondary" href="/advertisers">Khám phá luồng Advertiser →</Link></div>
          <div className="card"><div className="kicker">Publisher</div><h2>Kiếm tiền từ màn hình.</h2><p>Đăng ký địa điểm, kết nối screen, quản lý nội dung và theo dõi earnings trong Earner Portal.</p><Link className="btn btn-primary" href="/publishers">Khám phá luồng Publisher →</Link></div>
        </div>
      </div></section>
      <section className="section"><div className="container"><div className="grid-3">
        <div className="card"><div className="kicker">Self-serve</div><div className="metric">5 phút</div><p>Tạo campaign nhanh và rõ ràng, chỉ qua vài bước.</p></div>
        <div className="card"><div className="kicker">Publisher</div><div className="metric">50 / 50</div><p>Doanh thu được chia sẻ minh bạch giữa nền tảng và chủ địa điểm.</p></div>
        <div className="card"><div className="kicker">Measurement</div><div className="metric">Logs + Proof</div><p>Báo cáo campaign hiển thị playback logs và proof-of-play.</p></div>
      </div></div></section>
    </main>
    <Footer />
  </>;
}
