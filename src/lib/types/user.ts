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

export interface User {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: Date;
  role: UserRole;
  kycStatus: KYCStatus;
  isActive: boolean;
  isDeleted: boolean;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;

  authProviders?: AuthProviderLink[];
  loginActivities?: LoginActivity[];
}

export interface AuthProviderLink {
  id: string;
  userID: string;
  provider: AuthProvider;
  providerID: string;
  createdAt: Date;

  user?: User;
}

export interface LoginActivity {
  id: string;
  userID: string;
  loginAt: Date;
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

export interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  wallet: string;
  status: string;
}

// DashboardUser extends the Prisma User type with UI-only fields
export type DashboardUser = User & {
  wallet: string;
  cardsOwned: number; // mocked data only
  // createdAt in LibUser is Date, but UI uses ISO string for display/sort
  createdAtStr?: string;
};
