/** Включает реальные account / users / Favorites и JWT-сессию вместо демо-auth */
export const isBackendAuthEnabled = () => import.meta.env.VITE_USE_BACKEND_AUTH === 'true';
