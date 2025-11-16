export type PackFilterKey = "packType" | "sportType" | "isActive";
export type PackFilters = Record<PackFilterKey, string>;

export type PackSortBy = "packType" | "createdAt" | "price" | "cards";
export type PackSortOrder = "asc" | "desc";
export type PackSortDraft = {
  sortBy: PackSortBy;
  sortOrder: PackSortOrder;
};
