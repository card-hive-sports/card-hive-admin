export type PackType = "DRAFT" | "PRO" | "ALL_STARS" | "HALL_OF_FAME" | "LEGENDS";
export type SportType = "FOOTBALL" | "BASEBALL" | "BASKETBALL" | "MULTISPORT";

export const PACK_TYPE_OPTIONS: PackType[] = ["DRAFT", "PRO", "ALL_STARS", "HALL_OF_FAME", "LEGENDS"];
export const SPORT_TYPE_OPTIONS: SportType[] = ["FOOTBALL", "BASEBALL", "BASKETBALL", "MULTISPORT"];
export const PACK_SORT_BY = {
  PACK_TYPE: 'packType',
  CREATED_AT: 'createdAt',
  PRICE: 'price',
  CARDS: 'cards'
}
export type PACK_SORT_BY = (typeof PACK_SORT_BY)[keyof typeof PACK_SORT_BY];

export interface Pack {
  id: string;
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
  packType: PackType;
  sportType: SportType;
  description?: string;
  imageUrl: string;
  bannerUrl: string;
  price: string;
  isActive: boolean;
}
