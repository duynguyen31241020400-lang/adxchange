export type CampaignStatus = 'draft' | 'pending_review' | 'pending_payment' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
export type ScreenStatus = 'pending' | 'pairing' | 'online' | 'offline' | 'disabled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface Campaign { id: string; name: string; status: CampaignStatus; venues: number; budget: number; plays: number; }
export interface Venue { id: string; name: string; category: string; district: string; selected?: boolean; }
export interface Screen { id: string; name: string; venue: string; status: ScreenStatus; uptime: number; revenue: number; }
