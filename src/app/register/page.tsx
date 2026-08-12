'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage(){
 const params=useSearchParams(); const preset=params.get('role')||'advertiser';
 return <main className="container" style={{maxWidth:620,padding:'70px 0'}}><Link className="brand" href="/">ADXCHANGE</Link><div className="card" style={{marginTop:28}}><div className="demo-note">Prototype registration để đo willingness-to-start; chưa tạo user thật.</div><h2>Tạo tài khoản</h2><div className="form-grid"><div className="field"><label>Họ tên</label><input placeholder="Nguyễn Văn A"/></div><div className="field"><label>Email</label><input placeholder="you@company.com"/></div><div className="field"><label>Điện thoại</label><input placeholder="09..."/></div><div className="field"><label>Vai trò</label><select defaultValue={preset}><option value="advertiser">Advertiser</option><option value="publisher">Publisher</option></select></div><div className="field"><label>Công ty / địa điểm</label><input placeholder="Business name"/></div><div className="field"><label>Password</label><input type="password" placeholder="••••••••"/></div></div><Link href={preset==='publisher'?'/earner/dashboard':'/app/advertiser/dashboard'} className="btn btn-primary" style={{marginTop:20}}>Tiếp tục với demo</Link></div></main>
}
