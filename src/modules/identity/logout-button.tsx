'use client';
import { useRouter } from 'next/navigation';
import { clearDemoSession } from './mock-auth';
import { track } from '@/infrastructure/analytics';

export function LogoutButton(){
  const router = useRouter();
  return <button className="side-link side-button" onClick={()=>{clearDemoSession();track({name:'logout'});router.push('/login')}}>Đăng xuất demo</button>;
}
