export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export const OPPORTUNITIES_ENDPOINT = `${API_BASE_URL}/opportunities`;
export const ACCOUNT_ENDPOINT = `${API_BASE_URL}/account`;
export const USERS_ENDPOINT = `${API_BASE_URL}/users`;
/** Префикс как в FastAPI: заглавная F */
export const FAVORITES_ENDPOINT = `${API_BASE_URL}/Favorites`;
