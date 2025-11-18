import { SORT_ORDER } from './api';
import type { SportType } from './pack';

export type CardCondition = 'MINT' | 'NEAR_MINT';
export type CardRarity = 'GRAIL' | 'CHASE' | 'LINEUP';

export type CardSortBy = 'name' | 'rarity' | 'estimatedValue' | 'createdAt';
export type CardSortOrder = SORT_ORDER;

export interface Card {
  id: string;
  packId: string;
  pack?: {
    id: string;
    name: string;
  };
  name: string;
  playerName?: string;
  sportType: SportType;
  rarity: CardRarity;
  imageUrl?: string;
  bannerUrl?: string;
  estimatedValue?: string;
  serialNumber?: string;
  description?: string;
  year?: number | null;
  manufacturer?: string;
  condition?: CardCondition;
  createdAt: string;
  updatedAt: string;
}

export interface CardFormData {
  name: string;
  playerName?: string;
  description?: string;
  imageUrl?: string;
  bannerUrl?: string;
  packId: string;
  sportType: SportType;
  rarity: CardRarity;
  condition?: CardCondition;
  estimatedValue?: string;
  serialNumber?: string;
  year?: number;
  manufacturer?: string;
}
