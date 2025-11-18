import type { CardCondition, CardRarity, CardSortBy } from '@/lib/types/card';

export const CARD_RARITY_LABELS: Record<CardRarity, string> = {
  GRAIL: 'Grail',
  CHASE: 'Chase',
  LINEUP: 'Lineup',
};

export const CARD_CONDITION_LABELS: Record<CardCondition, string> = {
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
};

export const CARD_SORT_OPTIONS: { value: CardSortBy; label: string }[] = [
  { value: 'name', label: 'Card Name' },
  { value: 'rarity', label: 'Rarity' },
  { value: 'estimatedValue', label: 'Estimated Value' },
  { value: 'createdAt', label: 'Created Date' },
];

export const formatCardCurrency = (value?: string) => {
  if (!value) return '-';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return '-';
  return `$${parsed.toFixed(2)}`;
};
