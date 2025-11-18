import { apiClient } from './client';
import type { Card, CardFormData, CardCondition, CardRarity, CardSortBy } from '../types';
import type { PaginatedResponse, SORT_ORDER } from '../types/api';

export interface GetCardsParams {
  search?: string;
  packId?: string;
  rarity?: CardRarity;
  condition?: CardCondition;
  sortBy?: CardSortBy;
  sortOrder?: SORT_ORDER;
  page?: number;
  limit?: number;
}

export const cardsAPI = {
  getCards: async (params?: GetCardsParams): Promise<PaginatedResponse<Card>> => {
    const response = await apiClient.get<PaginatedResponse<Card>>('/inventory/cards', {
      params,
    });
    return response.data;
  },

  getCardById: async (cardID: string): Promise<Card> => {
    const response = await apiClient.get<Card>(`/inventory/cards/${cardID}`);
    return response.data;
  },

  createCard: async (data: CardFormData): Promise<Card> => {
    const response = await apiClient.post<Card>('/inventory/cards', data);
    return response.data;
  },

  updateCard: async (cardID: string, data: CardFormData): Promise<Card> => {
    const response = await apiClient.patch<Card>(`/inventory/cards/${cardID}`, data);
    return response.data;
  },

  deleteCard: async (cardID: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/inventory/cards/${cardID}`);
    return response.data;
  },
};
