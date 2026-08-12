'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage(){
 const [role,setRole]=useState('advertiser');
 return <main className="container" style={{maxWidth:520,padding:'70px 0'}}><Link className="brand" href="/">ADXCHANGE</Link><div className="card" style={{marginTop:28}}><div className="demo-note">Demo auth: chưa có backend và không dùng cho dữ liệu nhạy cảm.</div><h2>Đăng nhập</h2><div className="field"><label>Email</label><input defaultValue="demo@adxchange.local"/></div><div className="field" style={{marginTop:14}}><label>Password</label><input type="password" defaultValue="demo1234"/></div><div className="field" style={{marginTop:14}}><label>Vai trò demo</label><select value={role} onChange={e=>setRole(e.target.value)}><option value="advertiser">Advertiser</option><option value="publisher">Publisher</option><option value="ops">Ops</option></select></div><Link style={{marginTop:20,width:'100%'}} className="btn btn-primary" href={role==='advertiser'?'/app/advertiser/dashboard':role==='publisher'?'/earner/dashboard':'/ops/dashboard'}>Đăng nhập demo</Link><p style={{fontSize:13}}>Chưa có tài khoản? <Link href="/register" style={{color:'var(--brand)'}}>Đăng ký</Link></p></div></main>
}
