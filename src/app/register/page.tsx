import Link from 'next/link';
import { RegisterForm } from '@/modules/identity/register-form';

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ role?: string }> }){
 const params = await searchParams; const preset = params.role === 'publisher' ? 'publisher' : 'advertiser';
 return <main className="container" style={{maxWidth:620,padding:'70px 0'}}><Link className="brand" href="/">ADXCHANGE</Link><RegisterForm preset={preset}/></main>;
}
