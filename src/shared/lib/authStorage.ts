import { AUTH_PENDING_CODE_STORAGE_KEY, AUTH_SESSION_STORAGE_KEY } from '@shared/config/auth';
import { type AuthFlowPurpose, type AuthSession } from '@shared/types/auth';

type PendingAuthCode = {
  email: string;
  purpose: AuthFlowPurpose;
  code: string;
  expiresAt: number;
  resendAvailableAt: number;
};

const parseJson = <T>(value: string | null): T | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const readAuthSession = (): AuthSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const parsed = parseJson<AuthSession>(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY));
  return parsed?.isAuth ? parsed : null;
};

export const writeAuthSession = (session: AuthSession) => {
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
};

const readPendingMap = () => {
  return (
    parseJson<Record<string, PendingAuthCode>>(window.localStorage.getItem(AUTH_PENDING_CODE_STORAGE_KEY)) ?? {}
  );
};

const getPendingKey = (email: string, purpose: AuthFlowPurpose) => `${purpose}:${email.toLowerCase().trim()}`;

export const readPendingAuthCode = (email: string, purpose: AuthFlowPurpose) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const map = readPendingMap();
  return map[getPendingKey(email, purpose)] ?? null;
};

export const writePendingAuthCode = (pendingCode: PendingAuthCode) => {
  const map = readPendingMap();
  map[getPendingKey(pendingCode.email, pendingCode.purpose)] = pendingCode;
  window.localStorage.setItem(AUTH_PENDING_CODE_STORAGE_KEY, JSON.stringify(map));
};

export const clearPendingAuthCode = (email: string, purpose: AuthFlowPurpose) => {
  const map = readPendingMap();
  delete map[getPendingKey(email, purpose)];
  window.localStorage.setItem(AUTH_PENDING_CODE_STORAGE_KEY, JSON.stringify(map));
};
