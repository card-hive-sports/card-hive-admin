import { apiClient } from '@/lib';

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface PhoneLoginRequestData {
  phone: string;
}

export interface PhoneLoginVerifyData {
  phone: string;
  code: string;
  sessionID?: string;
}

export interface GoogleLoginData {
  idToken: string;
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
  };
}

export interface VerificationResponse {
  message: string;
  sessionID?: string;
}

export const authAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  logoutAll: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/logout/all');
    return response.data;
  },
};
