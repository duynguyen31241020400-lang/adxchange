import type { Campaign } from '@/domain/types';

export interface CampaignRepository {
  list(): Promise<Campaign[]>;
  getById(id: string): Promise<Campaign | null>;
  create(input: Omit<Campaign, 'id'>): Promise<Campaign>;
  update(id: string, patch: Partial<Campaign>): Promise<Campaign>;
}
