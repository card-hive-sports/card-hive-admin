import {apiClient, AuthResponse, EmailLoginData, ForgotPasswordData, GetUserLoginActivitiesParams, LoginActivity, PaginatedResponse, ResetPasswordData} from '@/lib';

export const authAPI = {
  emailLogin: async (data: EmailLoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login/email', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refresh: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  getUserLoginActivities: async (
    userID: string,
    params?: GetUserLoginActivitiesParams
  ): Promise<PaginatedResponse<LoginActivity>> => {
    const response = await apiClient.get(`/auth/users/${userID}/login-activities`, { params });
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
