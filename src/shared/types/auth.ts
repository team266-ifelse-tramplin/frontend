import { type UserRole } from './roles';

export type AuthRole = Exclude<UserRole, 'guest'>;

export type AuthSession = {
  isAuth: true;
  email: string;
  login?: string;
  role: AuthRole;
  userId: string;
  companyId?: string;
  verifiedAt: string;
  accessToken?: string;
  refreshToken?: string;
};

export type AuthFlowPurpose = 'sign_in' | 'sign_up';

export type AuthCodeRequestInput = {
  email: string;
  purpose: AuthFlowPurpose;
};

export type AuthCodeVerifyInput = {
  email: string;
  code: string;
  purpose: AuthFlowPurpose;
  role?: AuthRole;
  login?: string;
};
