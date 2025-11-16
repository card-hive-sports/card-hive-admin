import { Dispatch, FC, SetStateAction } from "react";
import { ResourceFilterPanel } from "../layout";


export type ActiveUsersFilterState = {
  status: string;
  startDate: string;
  endDate: string;
};

interface IProps {
  filterDraft: ActiveUsersFilterState;
  setFilterDraft: Dispatch<SetStateAction<ActiveUsersFilterState>>;
  handleApplyFilters: () => void;
  close: () => void;
}

export const UsersFilterPanel: FC<IProps> = ({
  filterDraft,
  setFilterDraft,
  handleApplyFilters,
  close
}) => {
  return (
    <ResourceFilterPanel
      sections={[
        {
          id: "status-filter",
          label: "Status",
          control: (
          <select
            value={filterDraft.status}
            onChange={(e) => setFilterDraft((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10] cursor-pointer"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
          ),
        },
        {
          id: "date-range-filter",
          label: "Date range",
          control: (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filterDraft.startDate}
              onChange={(e) =>
                  setFilterDraft((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10] cursor-pointer"
            />
            <input
              type="date"
              value={filterDraft.endDate}
              onChange={(e) =>
                  setFilterDraft((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#CEFE10] cursor-pointer"
            />
          </div>
          ),
          helperText: "Filter by created date.",
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
    />
  );
}