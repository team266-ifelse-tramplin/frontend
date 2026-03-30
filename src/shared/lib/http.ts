import { AUTH_UNAUTHORIZED_EVENT } from '@shared/config/auth';
import { clearAuthSession, readAuthSession } from './authStorage';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
  /** По умолчанию true: подставляет Bearer из сессии */
  auth?: boolean;
};

const toQueryString = (query?: RequestOptions['query']) => {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return;
    }

    params.set(key, String(value));
  });

  const prepared = params.toString();
  return prepared ? `?${prepared}` : '';
};

export class HttpError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.payload = payload;
  }
}

const buildHeaders = (options: RequestOptions): HeadersInit => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const useAuth = options.auth !== false;
  if (useAuth) {
    const session = readAuthSession();
    const token = session && session.accessToken;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

export const requestJson = async <TResponse>(url: string, options: RequestOptions = {}) => {
  const response = await fetch(`${url}${toQueryString(options.query)}`, {
    method: options.method ?? 'GET',
    headers: buildHeaders(options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (response.status === 204) {
    return null as TResponse;
  }

  const textPayload = await response.text();
  const payload = textPayload ? (JSON.parse(textPayload) as unknown) : null;

  if (!response.ok) {
    if (
      response.status === 401 &&
      options.auth !== false &&
      readAuthSession()?.accessToken
    ) {
      clearAuthSession();
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    }
    throw new HttpError(`Request failed with status ${response.status}`, response.status, payload);
  }

  return payload as TResponse;
};
