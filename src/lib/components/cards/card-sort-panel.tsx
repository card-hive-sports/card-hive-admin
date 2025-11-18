import type { Dispatch, SetStateAction } from 'react';
import { ResourceSortPanel } from '../layout';
import { CARD_SORT_OPTIONS } from './constants';
import type { CardSortDraft, CardSortBy, CardSortOrder } from './types';

interface CardSortPanelProps {
  sortDraft: CardSortDraft;
  setSortDraft: Dispatch<SetStateAction<CardSortDraft>>;
  handleApplySort: () => void;
  close: () => void;
}

export const CardSortPanel = ({
  sortDraft,
  setSortDraft,
  handleApplySort,
  close,
}: CardSortPanelProps) => {
  return (
    <ResourceSortPanel
      sortOptions={CARD_SORT_OPTIONS}
      sortBy={sortDraft.sortBy}
      sortOrder={sortDraft.sortOrder}
      onSortByChange={(value) =>
        setSortDraft((prev) => ({ ...prev, sortBy: value as CardSortBy }))
      }
      onSortOrderChange={(value) =>
        setSortDraft((prev) => ({ ...prev, sortOrder: value as CardSortOrder }))
      }
      primaryAction={{
        label: 'Apply sort',
        size: 'sm',
        variant: 'primary',
        onClick: () => {
          handleApplySort();
          close();
        },
      }}
    />
  );
};
