import { Dispatch, FC, SetStateAction } from "react";
import { SORT_ORDER, USERS_SORT_OPTIONS } from "../../types";
import { ResourceSortPanel } from "../layout";

export type UsersSortDraft = {
  sortBy: USERS_SORT_OPTIONS;
  sortOrder: SORT_ORDER
}

interface IProps {
  sortDraft: UsersSortDraft;
  setSortDraft: Dispatch<SetStateAction<UsersSortDraft>>;
  handleApplySort: () => void;
  close: () => void;
}

export const UsersSortPanel: FC<IProps> = ({
  sortDraft,
  setSortDraft,
  handleApplySort,
  close,
}) => {
  return (
    <ResourceSortPanel
      sortOptions={[
        { value: USERS_SORT_OPTIONS.CREATED_AT, label: "Joined Date" },
        { value: USERS_SORT_OPTIONS.FULL_NAME, label: "Full Name" },
        { value: USERS_SORT_OPTIONS.WALLET_BALANCE, label: "Wallet Balance" },
        { value: USERS_SORT_OPTIONS.EMAIL, label: "Email" },
        { value: USERS_SORT_OPTIONS.PHONE, label: "Phone" },
      ]}
      sortBy={sortDraft.sortBy}
      sortOrder={sortDraft.sortOrder}
      onSortByChange={(value) =>
        setSortDraft((prev) => ({
          ...prev,
          sortBy: value as USERS_SORT_OPTIONS,
        }))
      }
      onSortOrderChange={(value) =>
        setSortDraft((prev) => ({
          ...prev,
          sortOrder: value as SORT_ORDER,
        }))
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
}