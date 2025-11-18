import { Dispatch, SetStateAction } from 'react';
import { ResourceFilterPanel } from '../layout';
import { CARD_CONDITION_LABELS, CARD_RARITY_LABELS } from './constants';
import type { CardFilters } from './types';

interface CardFilterPanelProps {
  filterDraft: CardFilters;
  setFilterDraft: Dispatch<SetStateAction<CardFilters>>;
  packs: Array<{ id: string; name: string }>;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  close: () => void;
}

export const createInitialCardFilterState = (): CardFilters => ({
  packId: '',
  rarity: '',
  condition: '',
});

export const CardFilterPanel = ({
  filterDraft,
  setFilterDraft,
  packs,
  handleApplyFilters,
  handleClearFilters,
  close,
}: CardFilterPanelProps) => {
  return (
    <ResourceFilterPanel
      sections={[
        {
          id: 'pack-filter',
          label: 'Pack',
          control: (
            <select
              value={filterDraft.packId}
              onChange={(event) =>
                setFilterDraft((prev) => ({ ...prev, packId: event.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All Packs</option>
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name}
                </option>
              ))}
            </select>
          ),
        },
        {
          id: 'rarity-filter',
          label: 'Rarity',
          control: (
            <select
              value={filterDraft.rarity}
              onChange={(event) =>
                setFilterDraft((prev) => ({ ...prev, rarity: event.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All rarities</option>
              {Object.entries(CARD_RARITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          ),
        },
        {
          id: 'condition-filter',
          label: 'Condition',
          control: (
            <select
              value={filterDraft.condition}
              onChange={(event) =>
                setFilterDraft((prev) => ({ ...prev, condition: event.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All conditions</option>
              {Object.entries(CARD_CONDITION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          ),
        },
      ]}
      primaryAction={{
        label: 'Apply filters',
        size: 'sm',
        variant: 'primary',
        onClick: () => {
          handleApplyFilters();
          close();
        },
      }}
      onClear={() => {
        handleClearFilters();
        close();
      }}
    />
  );
};
