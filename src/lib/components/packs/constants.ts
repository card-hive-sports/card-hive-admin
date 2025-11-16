import type { PackType, SportType } from "@/lib/types/pack";

export const packTypeLabels: Record<PackType, string> = {
  DRAFT: "Draft",
  PRO: "Pro",
  ALL_STARS: "All Stars",
  HALL_OF_FAME: "Hall of Fame",
  LEGENDS: "Legends",
};

export const sportTypeLabels: Record<SportType, string> = {
  FOOTBALL: "Football",
  BASEBALL: "Baseball",
  BASKETBALL: "Basketball",
  MULTISPORT: "Multisport",
};

export const formatPackCurrency = (value?: string) => {
  if (!value || Number.isNaN(Number(value))) return "-";
  return `$${Number(value).toFixed(2)}`;
};
