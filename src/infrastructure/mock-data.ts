import type { Campaign, Venue, Screen } from '@/domain/types';

export const campaigns: Campaign[] = [
  { id:'cmp_demo_001', name:'District 1 Lunch Reach', status:'active', venues:12, budget:180, plays:4280 },
  { id:'cmp_demo_002', name:'Weekend Café Trial', status:'scheduled', venues:8, budget:120, plays:0 },
  { id:'cmp_demo_003', name:'Gym Radius Test', status:'completed', venues:15, budget:220, plays:7120 },
];

export const venues: Venue[] = [
  { id:'ven_001', name:'Goal Café Nguyễn Thị Minh Khai', category:'Football café', district:'District 3' },
  { id:'ven_002', name:'Studio Nail Lê Văn Sỹ', category:'Nail salon', district:'District 3' },
  { id:'ven_003', name:'Northside Gym', category:'Gym', district:'Phú Nhuận' },
  { id:'ven_004', name:'The Corner Café', category:'Café', district:'District 1' },
];

export const screens: Screen[] = [
  { id:'scr_001', name:'Main TV', venue:'Goal Café Nguyễn Thị Minh Khai', status:'online', uptime:98.4, revenue:36 },
  { id:'scr_002', name:'Waiting Area', venue:'Studio Nail Lê Văn Sỹ', status:'online', uptime:96.7, revenue:31 },
  { id:'scr_003', name:'Front Screen', venue:'Northside Gym', status:'offline', uptime:82.1, revenue:19 },
];
