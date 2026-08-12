'use client';

export type AnalyticsEvent = { name: string; properties?: Record<string, string | number | boolean> };

export function track(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  const key = 'adx_demo_analytics';
  const current = JSON.parse(localStorage.getItem(key) || '[]') as Array<AnalyticsEvent & { at: string }>;
  current.push({ ...event, at: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(current.slice(-200)));
  window.dispatchEvent(new CustomEvent('adx:analytics', { detail: event }));
}
