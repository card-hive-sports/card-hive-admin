export type PackType = "DRAFT" | "PRO" | "ALL_STARS" | "HALL_OF_FAME" | "LEGENDS";
export type SportType = "FOOTBALL" | "BASEBALL" | "BASKETBALL" | "MULTISPORT";

export const PACK_TYPE_OPTIONS: PackType[] = ["DRAFT", "PRO", "ALL_STARS", "HALL_OF_FAME", "LEGENDS"];
export const SPORT_TYPE_OPTIONS: SportType[] = ["FOOTBALL", "BASEBALL", "BASKETBALL", "MULTISPORT"];

export interface Pack {
  id: string;
  name?: string;
  packType: PackType;
  sportType: SportType;
  description?: string;
  imageUrl: string;
  bannerUrl: string;
  price: string;
  cards: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackFormData {
  name: string;
  packType: PackType;
  sportType: SportType;
  description?: string;
  imageUrl: string;
  bannerUrl: string;
  price: string;
  isActive: boolean;
}
