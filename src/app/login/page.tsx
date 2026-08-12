'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { roleHome, saveDemoSession, type DemoRole } from '@/modules/identity/mock-auth';
import { track } from '@/infrastructure/analytics';

export default function LoginPage(){
 const router=useRouter(); const [role,setRole]=useState<DemoRole>('advertiser'); const [email,setEmail]=useState('demo@adxchange.local');
 return <main className="container" style={{maxWidth:520,padding:'70px 0'}}><Link className="brand" href="/">ADXCHANGE</Link><div className="card" style={{marginTop:28}}><div className="demo-note">Demo auth: session chỉ nằm trong browser. Không dùng cho dữ liệu nhạy cảm hoặc payment thật.</div><h2>Đăng nhập</h2><div className="field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)}/></div><div className="field" style={{marginTop:14}}><label>Password</label><input type="password" defaultValue="demo1234"/></div><div className="field" style={{marginTop:14}}><label>Vai trò demo</label><select value={role} onChange={e=>setRole(e.target.value as DemoRole)}><option value="advertiser">Advertiser</option><option value="publisher">Publisher</option><option value="ops">Ops</option></select></div><button style={{marginTop:20,width:'100%'}} className="btn btn-primary" onClick={()=>{saveDemoSession({email,role});track({name:'login_completed',properties:{role}});router.push(roleHome(role));}}>Đăng nhập demo</button><p style={{fontSize:13}}>Chưa có tài khoản? <Link href="/register" style={{color:'var(--brand)'}}>Đăng ký</Link></p><p style={{fontSize:13}}><Link href="/forgot-password" style={{color:'var(--brand)'}}>Quên mật khẩu?</Link></p></div></main>;
}
