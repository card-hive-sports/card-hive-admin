import { Dispatch, SetStateAction } from "react";
import { ResourceFilterPanel } from "../layout";
import { PACK_TYPE_OPTIONS, SPORT_TYPE_OPTIONS } from "@/lib/types/pack";
import { PackFilters } from "./types";
import { packTypeLabels, sportTypeLabels } from "./constants";

interface PackFilterPanelProps {
  filterDraft: PackFilters;
  setFilterDraft: Dispatch<SetStateAction<PackFilters>>;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  close: () => void;
}

export const createInitialFilterState = (): PackFilters => ({
  packType: "",
  sportType: "",
  isActive: "",
});

export const PackFilterPanel = ({
  filterDraft,
  setFilterDraft,
  handleApplyFilters,
  handleClearFilters,
  close,
}: PackFilterPanelProps) => {
  return (
    <ResourceFilterPanel
      sections={[
        {
          id: "pack-type-filter",
          label: "Pack Type",
          control: (
            <select
              value={filterDraft.packType}
              onChange={(e) =>
                setFilterDraft((prev) => ({ ...prev, packType: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All Pack Types</option>
              {PACK_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {packTypeLabels[type]}
                </option>
              ))}
            </select>
          ),
        },
        {
          id: "sport-filter",
          label: "Sport",
          control: (
            <select
              value={filterDraft.sportType}
              onChange={(e) =>
                setFilterDraft((prev) => ({ ...prev, sportType: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All Sports</option>
              {SPORT_TYPE_OPTIONS.map((sport) => (
                <option key={sport} value={sport}>
                  {sportTypeLabels[sport]}
                </option>
              ))}
            </select>
          ),
        },
        {
          id: "status-filter",
          label: "Status",
          control: (
            <select
              value={filterDraft.isActive}
              onChange={(e) =>
                setFilterDraft((prev) => ({ ...prev, isActive: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10]"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          ),
        },
      ]}
      primaryAction={{
        label: "Apply Filters",
        onClick: () => {
          handleApplyFilters();
          close();
        },
        variant: "primary",
        size: "sm",
      }}
      onClear={() => {
        handleClearFilters();
        close();
      }}
    />
  );
};
