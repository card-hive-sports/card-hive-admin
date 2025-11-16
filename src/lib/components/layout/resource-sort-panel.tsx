'use client';

import {ReactNode} from "react";
import {clsx} from "clsx";
import {GameButton} from "@/lib/ui";

export interface ResourceSortPanelOption {
  value: string;
  label: ReactNode;
}

export interface ResourceSortPanelProps {
  sortOptions: ResourceSortPanelOption[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  primaryAction?: {
    label: ReactNode;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
    size?: "sm" | "md" | "lg";
  };
  className?: string;
}

export const ResourceSortPanel = ({
  sortOptions,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  primaryAction,
  className,
}: ResourceSortPanelProps) => {
  return (
    <div className={clsx("space-y-3", className)}>
      <div>
        <label className="block text-white/70 text-sm font-medium mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10] cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-white/70 text-sm font-medium mb-2">Order</label>
        <div className="flex gap-2">
          <GameButton
            type="button"
            size="sm"
            variant={sortOrder === "asc" ? "primary" : "secondary"}
            className="flex-1 normal-case"
            onClick={() => onSortOrderChange("asc")}
          >
            Asc
          </GameButton>
          <GameButton
            type="button"
            size="sm"
            variant={sortOrder === "desc" ? "primary" : "secondary"}
            className="flex-1 normal-case"
            onClick={() => onSortOrderChange("desc")}
          >
            Desc
          </GameButton>
        </div>
      </div>

      {primaryAction && (
        <GameButton
          size={primaryAction.size ?? "sm"}
          variant={primaryAction.variant ?? "primary"}
          className="w-full normal-case"
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </GameButton>
      )}
    </div>
  );
};
