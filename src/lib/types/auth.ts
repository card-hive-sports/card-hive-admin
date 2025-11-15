export interface EmailLoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    role: string;
    kycStatus: string;
    createdAt: string;
    avatarUrl?: string;
  };
}
