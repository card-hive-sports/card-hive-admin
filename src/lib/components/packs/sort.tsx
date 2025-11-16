import { Dispatch, SetStateAction } from "react";
import { ResourceSortPanel } from "../layout";
import { PackSortDraft, PackSortBy, PackSortOrder } from "./types";

interface PackSortPanelProps {
  sortDraft: PackSortDraft;
  setSortDraft: Dispatch<SetStateAction<PackSortDraft>>;
  handleApplySort: () => void;
  close: () => void;
}

const SORT_OPTIONS: { value: PackSortBy; label: string }[] = [
  { value: "packType", label: "Pack Type" },
  { value: "createdAt", label: "Created Date" },
  { value: "price", label: "Price" },
  { value: "cards", label: "Card Count" },
];

export const PackSortPanel = ({
  sortDraft,
  setSortDraft,
  handleApplySort,
  close,
}: PackSortPanelProps) => {
  return (
    <ResourceSortPanel
      sortOptions={SORT_OPTIONS}
      sortBy={sortDraft.sortBy}
      sortOrder={sortDraft.sortOrder}
      onSortByChange={(value) =>
        setSortDraft((prev) => ({ ...prev, sortBy: value as PackSortBy }))
      }
      onSortOrderChange={(value) =>
        setSortDraft((prev) => ({ ...prev, sortOrder: value as PackSortOrder }))
      }
      primaryAction={{
        label: "Apply Sort",
        onClick: () => {
          handleApplySort();
          close();
        },
        variant: "primary",
        size: "sm",
      }}
    />
  );
};
