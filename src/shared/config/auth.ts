export const AUTH_SESSION_STORAGE_KEY = 'auth-session';
export const AUTH_PENDING_CODE_STORAGE_KEY = 'auth-pending-code';

/** Событие при 401 с Bearer: очистка storages в http.ts; AuthProvider сбрасывает session */
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const AUTH_CODE_LENGTH = 6;
export const AUTH_CODE_TTL_MS = 5 * 60 * 1000;
export const AUTH_RESEND_COOLDOWN_MS = 30 * 1000;
