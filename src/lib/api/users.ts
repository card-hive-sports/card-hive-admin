import {apiClient, CreateUserData, GetUsersParams, PaginatedResponse, UpdateUserData, User} from '@/lib';

export const usersAPI = {
  getUsers: async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getUserByID: async (userID: string): Promise<User> => {
    const response = await apiClient.get(`/users/${userID}`);
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  updateUser: async (userID: string, data: UpdateUserData): Promise<User> => {
    const response = await apiClient.patch(`/users/${userID}`, data);
    return response.data;
  },

  deleteUser: async (userID: string, hard?: boolean): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${userID}`, {
      params: { hard: hard ? 'true' : 'false' }
    });
    return response.data;
  },

  suspendUser: async (userID: string): Promise<User> => {
    const response = await apiClient.patch(`/users/${userID}/suspend`);
    return response.data;
  },

  unsuspendUser: async (userID: string): Promise<User> => {
    const response = await apiClient.patch(`/users/${userID}/unsuspend`);
    return response.data;
  },
};
