import {
  AUTH_CODE_LENGTH,
  AUTH_CODE_TTL_MS,
  AUTH_RESEND_COOLDOWN_MS,
} from '@shared/config/auth';
import { isBackendAuthEnabled } from '@shared/config/features';
import { accountApi } from '@shared/api/accountApi';
import {
  clearPendingAuthCode,
  readAuthSession,
  readPendingAuthCode,
  writePendingAuthCode,
} from '@shared/lib/authStorage';
import { decodeJwtPayload } from '@shared/lib/jwtPayload';
import { type AuthCodeRequestInput, type AuthCodeVerifyInput, type AuthRole, type AuthSession } from '@shared/types/auth';

type RequestCodeResult = {
  retryAfterSec: number;
  expiresInSec: number;
  demoCode: string | null;
};

const DEMO_CODE = '111111';
const VALID_COMPANY_ID = 'd896119b-cc6f-41a7-892b-f1ebed29bbe0';
const VALID_EMPLOYER_USER_ID = '01c1d671-d22b-4918-9e7a-1ab5565a6a6e';
const MOCK_UUID_POOL = [
  '32ce2307-c05a-4cd1-87d3-35048f529301',
  'd896119b-cc6f-41a7-892b-f1ebed29bbe0',
  '202a2cea-1ae6-4ce4-bc89-24fd667cdd90',
  '93a98421-e3ab-4846-ba4f-c444b4bb30af',
  '2d155cd5-deb6-45be-b047-ccf113905351',
] as const;

const BACKEND_ROLE_APPLICANT = 2;
const BACKEND_ROLE_EMPLOYER = 4;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const toStableIndex = (source: string) => {
  const normalizedSource = source.trim().toLowerCase();
  const hash = Array.from(normalizedSource).reduce((acc, char, index) => {
    return acc + char.charCodeAt(0) * (index + 1);
  }, 0);
  return hash % MOCK_UUID_POOL.length;
};

const toMockUuid = (source: string, salt: string) => {
  return MOCK_UUID_POOL[toStableIndex(`${source}:${salt}`)];
};

const roleToCompanyId = (role: AuthRole) => {
  if (role !== 'company') {
    return undefined;
  }

  return VALID_COMPANY_ID;
};

const assertEmail = (email: string) => {
  if (!emailRegex.test(email.trim())) {
    throw new Error('Укажи корректный email.');
  }
};

const assertCode = (code: string) => {
  if (!new RegExp(`^\\d{${AUTH_CODE_LENGTH}}$`).test(code.trim())) {
    throw new Error(`Код должен содержать ${AUTH_CODE_LENGTH} цифр.`);
  }
};

const buildMockSession = (input: { email: string; role: AuthRole; login?: string }): AuthSession => {
  const email = normalizeEmail(input.email);
  return {
    isAuth: true,
    email,
    login: input.login?.trim() || email.split('@')[0],
    role: input.role,
    userId: input.role === 'company' ? VALID_EMPLOYER_USER_ID : toMockUuid(email, 'user'),
    companyId: roleToCompanyId(input.role),
    verifiedAt: new Date().toISOString(),
  };
};

const sessionFromBackendTokens = (
  email: string,
  accessToken: string,
  refreshToken: string,
  login?: string,
): AuthSession => {
  const payload = decodeJwtPayload<{ sub: string; role_id: number }>(accessToken);
  if (!payload?.sub) {
    throw new Error('Не удалось разобрать access-токен.');
  }
  const role = payload.role_id === BACKEND_ROLE_EMPLOYER ? 'company' : 'applicant';
  const normalized = normalizeEmail(email);
  return {
    isAuth: true,
    email: normalized,
    login: login?.trim() || normalized.split('@')[0],
    role,
    userId: payload.sub,
    companyId: role === 'company' ? undefined : undefined,
    verifiedAt: new Date().toISOString(),
    accessToken,
    refreshToken,
  };
};

const sendEmailCodeMock = async (input: AuthCodeRequestInput): Promise<RequestCodeResult> => {
  const email = normalizeEmail(input.email);
  assertEmail(email);

  const now = Date.now();
  const existing = readPendingAuthCode(email, input.purpose);

  if (existing && now < existing.resendAvailableAt) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resendAvailableAt - now) / 1000));
    throw new Error(`Повторная отправка доступна через ${retryAfterSec} сек.`);
  }

  writePendingAuthCode({
    email,
    purpose: input.purpose,
    code: DEMO_CODE,
    expiresAt: now + AUTH_CODE_TTL_MS,
    resendAvailableAt: now + AUTH_RESEND_COOLDOWN_MS,
  });

  return {
    retryAfterSec: Math.ceil(AUTH_RESEND_COOLDOWN_MS / 1000),
    expiresInSec: Math.ceil(AUTH_CODE_TTL_MS / 1000),
    demoCode: DEMO_CODE,
  };
};

const sendEmailCodeBackend = async (input: AuthCodeRequestInput): Promise<RequestCodeResult> => {
  const email = normalizeEmail(input.email);
  assertEmail(email);
  await accountApi.sendEmailCode({
    email,
    purpose: 'login',
  });
  return {
    retryAfterSec: 60,
    expiresInSec: 300,
    demoCode: null,
  };
};

const verifyCodeMock = async (input: AuthCodeVerifyInput): Promise<AuthSession> => {
  const email = normalizeEmail(input.email);
  assertEmail(email);
  assertCode(input.code);

  const pending = readPendingAuthCode(email, input.purpose);
  if (!pending) {
    throw new Error('Сначала запроси код подтверждения.');
  }

  const now = Date.now();
  if (now > pending.expiresAt) {
    clearPendingAuthCode(email, input.purpose);
    throw new Error('Срок действия кода истек. Запроси новый код.');
  }

  if (pending.code !== input.code.trim()) {
    throw new Error('Неверный код подтверждения.');
  }

  if (input.purpose === 'sign_up') {
    if (!input.login?.trim()) {
      throw new Error('Для регистрации укажи логин.');
    }
    if (!input.role) {
      throw new Error('Для регистрации укажи роль.');
    }
  }

  clearPendingAuthCode(email, input.purpose);

  return buildMockSession({
    email,
    role: input.role ?? 'applicant',
    login: input.login,
  });
};

const signInBackend = async (input: { email: string; code: string; login?: string }): Promise<AuthSession> => {
  const email = normalizeEmail(input.email);
  assertEmail(email);
  assertCode(input.code);
  const res = await accountApi.signIn({ email, code: input.code.trim() });
  return sessionFromBackendTokens(email, res.access_token, res.refresh_token, input.login);
};

export type RegisterBackendInput = {
  email: string;
  phone: string;
  displayName: string;
  role: AuthRole;
};

const registerBackend = async (input: RegisterBackendInput): Promise<RequestCodeResult> => {
  const email = normalizeEmail(input.email);
  assertEmail(email);
  const role_id = input.role === 'company' ? BACKEND_ROLE_EMPLOYER : BACKEND_ROLE_APPLICANT;
  await accountApi.signUp({
    email,
    phone: input.phone.trim(),
    display_name: input.displayName.trim(),
    role_id,
  });
  await accountApi.sendEmailCode({ email, purpose: 'login' });
  return {
    retryAfterSec: 60,
    expiresInSec: 300,
    demoCode: null,
  };
};

const signOutBackend = async () => {
  const session = readAuthSession();
  if (session?.accessToken) {
    await accountApi.signOut({ token: session.accessToken });
  }
};

export const authService = {
  send_email_code: async (input: AuthCodeRequestInput): Promise<RequestCodeResult> => {
    if (isBackendAuthEnabled()) {
      return sendEmailCodeBackend(input);
    }
    return sendEmailCodeMock(input);
  },

  sign_up: (input: Omit<AuthCodeVerifyInput, 'purpose'>) =>
    verifyCodeMock({ ...input, purpose: 'sign_up' }),

  sign_in: async (input: Omit<AuthCodeVerifyInput, 'purpose' | 'role' | 'login'> & { login?: string }) => {
    if (isBackendAuthEnabled()) {
      return signInBackend({ email: input.email, code: input.code, login: input.login });
    }
    return verifyCodeMock({ ...input, purpose: 'sign_in' });
  },

  register_backend: registerBackend,

  sign_out: async () => {
    if (isBackendAuthEnabled()) {
      await signOutBackend();
    }
  },
};
