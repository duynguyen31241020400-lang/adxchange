import { campaigns, screens, venues } from '@/infrastructure/mock-data';
import type { CampaignRepository } from '@/modules/advertising/data/repository';
import type { PublishingRepository } from '@/modules/publishing/data/repository';
import type { Campaign } from '@/domain/types';

export const mockCampaignRepository: CampaignRepository = {
  async list(){ return campaigns; },
  async getById(id){ return campaigns.find(c=>c.id===id) ?? null; },
  async create(input){ return { ...input, id:`cmp_demo_${Date.now()}` }; },
  async update(id,patch){ const current=campaigns.find(c=>c.id===id); if(!current) throw new Error('Campaign not found'); return { ...current, ...patch } as Campaign; }
};

export const mockPublishingRepository: PublishingRepository = {
  async listVenues(){ return venues; },
  async listScreens(){ return screens; },
  async pairScreen(screenId){ const screen=screens.find(s=>s.id===screenId) ?? screens[0]; return { ...screen, status:'online' }; }
};
