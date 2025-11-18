import type { CardSortBy, CardSortOrder } from '@/lib/types/card';

export type CardFilterKey = 'packId' | 'rarity' | 'condition';
export type CardFilters = Record<CardFilterKey, string>;

export type CardSortDraft = {
  sortBy: CardSortBy;
  sortOrder: CardSortOrder;
};
