'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { roleHome, saveDemoSession, type DemoRole } from './mock-auth';
import { track } from '@/infrastructure/analytics';

export function RegisterForm({ preset }: { preset: 'advertiser'|'publisher' }){
  const router=useRouter(); const [role,setRole]=useState<DemoRole>(preset); const [email,setEmail]=useState('you@company.com');
  return <div className="card" style={{marginTop:28}}><div className="demo-note">Prototype registration để đo willingness-to-start; chưa tạo user thật.</div><h2>Tạo tài khoản</h2><div className="form-grid"><div className="field"><label>Họ tên</label><input placeholder="Nguyễn Văn A"/></div><div className="field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)}/></div><div className="field"><label>Điện thoại</label><input placeholder="09..."/></div><div className="field"><label>Vai trò</label><select value={role} onChange={e=>setRole(e.target.value as DemoRole)}><option value="advertiser">Advertiser</option><option value="publisher">Publisher</option></select></div><div className="field"><label>Công ty / địa điểm</label><input placeholder="Business name"/></div><div className="field"><label>Password</label><input type="password" placeholder="••••••••"/></div></div><button className="btn btn-primary" style={{marginTop:20}} onClick={()=>{saveDemoSession({email,role});track({name:'register_completed',properties:{role}});router.push(roleHome(role));}}>Tiếp tục với demo</button></div>;
}
