import { FAVORITES_ENDPOINT } from '@shared/config/api';
import { requestJson } from '@shared/lib/http';

export type BackendFavorite = {
  id: string;
  user_id: string;
  opportunity_id: string;
  created_at: string;
};

export type FavoritesListResponse = {
  quantity: number;
  data: BackendFavorite[];
};

export const favoritesApi = {
  getAll: (userId: string, signal?: AbortSignal) =>
    requestJson<FavoritesListResponse>(`${FAVORITES_ENDPOINT}/get_all`, {
      query: { user_id: userId },
      signal,
    }),

  add: (userId: string, opportunityId: string) =>
    requestJson<{ data: BackendFavorite; created_at: string }>(`${FAVORITES_ENDPOINT}/add`, {
      method: 'POST',
      body: { user_id: userId, opportunity_id: opportunityId },
    }),

  remove: (userId: string, opportunityId: string) =>
    requestJson<null>(`${FAVORITES_ENDPOINT}/remove`, {
      method: 'DELETE',
      query: { user_id: userId, opportunity_id: opportunityId },
    }),
};
