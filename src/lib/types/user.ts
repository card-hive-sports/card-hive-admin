import { SORT_ORDER } from "./api";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum KYCStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum AuthProvider {
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
}

export type COMPUTED_STATUS = 'active' | 'inactive' | 'suspended';
export const COMPUTED_STATUS: Record<COMPUTED_STATUS, { isActive: boolean; isDeleted: boolean; }> = {
  'active': {
    isActive: true,
    isDeleted: false,
  },
  'inactive': {
    isActive: false,
    isDeleted: true,
  },
  'suspended': {
    isActive: false,
    isDeleted: false,
  }
};

export const USERS_SORT_OPTIONS = {
  FULL_NAME: 'fullName',
  CREATED_AT: 'createdAt',
  WALLET_BALANCE: 'walletBalance',
  EMAIL: 'email',
  PHONE: 'phone'
}
export type USERS_SORT_OPTIONS = (typeof USERS_SORT_OPTIONS)[keyof typeof USERS_SORT_OPTIONS];

export interface User {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  kycStatus: KYCStatus;
  isActive: boolean;
  isDeleted: boolean;
  walletBalance: string;
  walletCurrency: string;
  createdAt: string;
  updatedAt: string;

  cardsOwned?: number;
  authProviders?: AuthProviderLink[];
  loginActivities?: LoginActivity[];
}

export interface AuthProviderLink {
  id: string;
  userID: string;
  provider: AuthProvider;
  providerID: string;
  createdAt: string;
}

export interface LoginActivity {
  id: string;
  userID: string;
  loginAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceType: string | null;
  platform: string | null;
  browser: string | null;
  loginMethod: AuthProvider;
  success: boolean;
  failureReason: string | null;

  user?: User;
}

export interface GetUserLoginActivitiesParams {
  page?: number;
  limit?: number;
}

export interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  walletBalance?: string;
  walletCurrency?: string;
  status: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  kycStatus?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  sortBy?: USERS_SORT_OPTIONS;
  sortOrder?: SORT_ORDER;
  startDate?: string;
  endDate?: string;
}

export interface CreateUserData {
  fullName: string;
  email?: string;
  phone?: string;
  role?: string;
  walletBalance?: number;
  walletCurrency?: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  kycStatus?: string;
  isActive?: boolean;
  walletBalance?: number;
  walletCurrency?: string;
}
