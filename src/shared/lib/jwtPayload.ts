/** Декодирование payload JWT без проверки подписи (после получения токена с нашего бэкенда). */
export const decodeJwtPayload = <T extends Record<string, unknown>>(token: string): T | null => {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
  let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  try {
    const json = atob(base64);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
};
