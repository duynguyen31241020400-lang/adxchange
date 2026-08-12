'use client';

export type DemoRole = 'advertiser' | 'publisher' | 'ops';
export type DemoSession = { email: string; role: DemoRole };

const KEY = 'adx_demo_session';

export function saveDemoSession(session: DemoSession) {
  if (typeof window !== 'undefined') localStorage.setItem(KEY, JSON.stringify(session));
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as DemoSession; } catch { return null; }
}

export function clearDemoSession() {
  if (typeof window !== 'undefined') localStorage.removeItem(KEY);
}

export function roleHome(role: DemoRole) {
  return role === 'advertiser' ? '/app/advertiser/dashboard' : role === 'publisher' ? '/earner/dashboard' : '/ops/dashboard';
}
