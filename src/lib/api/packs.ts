import { apiClient } from './client';
import type { PackFormData, Pack, PackType, SportType, PACK_SORT_BY, PaginatedResponse, SORT_ORDER } from '../types';

export interface GetPacksParams {
  search?: string;
  packType?: PackType;
  sportType?: SportType;
  isActive?: boolean;
  sortBy?: PACK_SORT_BY;
  sortOrder?: SORT_ORDER;
  page?: number;
  limit?: number;
}

export type CreatePackData = PackFormData;
export type UpdatePackData = PackFormData;

export const packsAPI = {
  getPacks: async (params?: GetPacksParams): Promise<PaginatedResponse<Pack>> => {
    const response = await apiClient.get<PaginatedResponse<Pack>>('/inventory/packs', {
      params,
    });
    return response.data;
  },

  getPackByID: async (packID: string): Promise<Pack> => {
    const response = await apiClient.get<Pack>(`/inventory/packs/${packID}`);
    return response.data;
  },

  createPack: async (data: CreatePackData): Promise<Pack> => {
    const response = await apiClient.post<Pack>('/inventory/packs', data);
    return response.data;
  },

  updatePack: async (packID: string, data: UpdatePackData): Promise<Pack> => {
    const response = await apiClient.patch<Pack>(`/inventory/packs/${packID}`, data);
    return response.data;
  },

  deletePack: async (packID: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/inventory/packs/${packID}`);
    return response.data;
  },
};
