import { ACCOUNT_ENDPOINT } from '@shared/config/api';
import { requestJson } from '@shared/lib/http';

export type SignUpBody = {
  email: string;
  phone: string;
  display_name: string;
  role_id: number;
};

export type SignInBody = {
  email: string;
  code: string;
};

export type SendMailcodeBody = {
  email: string;
  purpose?: string;
};

export type SignOutBody = {
  token: string;
};

export type RefreshBody = {
  refresh_token: string;
};

export const accountApi = {
  signUp: (body: SignUpBody) =>
    requestJson<Record<string, unknown>>(`${ACCOUNT_ENDPOINT}/sign_up`, {
      method: 'POST',
      body,
      auth: false,
    }),

  signIn: (body: SignInBody) =>
    requestJson<{
      access_token: string;
      refresh_token: string;
      signed_in_at: string;
    }>(`${ACCOUNT_ENDPOINT}/sign_in`, { method: 'POST', body, auth: false }),

  signOut: (body: SignOutBody) =>
    requestJson<Record<string, unknown>>(`${ACCOUNT_ENDPOINT}/sign_out`, {
      method: 'POST',
      body,
      auth: false,
    }),

  sendEmailCode: (body: SendMailcodeBody) =>
    requestJson<{ send: boolean; email: string; sent_at: string }>(
      `${ACCOUNT_ENDPOINT}/send_email_code`,
      { method: 'POST', body: { purpose: body.purpose ?? 'login', email: body.email }, auth: false },
    ),

  refresh: (body: RefreshBody) =>
    requestJson<{ access_token: string; refreshed_at: string }>(`${ACCOUNT_ENDPOINT}/refresh`, {
      method: 'POST',
      body,
      auth: false,
    }),
};
