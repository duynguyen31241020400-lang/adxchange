import type { Screen, Venue } from '@/domain/types';

export interface PublishingRepository {
  listVenues(): Promise<Venue[]>;
  listScreens(): Promise<Screen[]>;
  pairScreen(screenId: string, code: string): Promise<Screen>;
}
