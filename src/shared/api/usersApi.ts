import { USERS_ENDPOINT } from '@shared/config/api';
import { requestJson } from '@shared/lib/http';

export type BackendApplication = {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'reserved';
  cover_letter: string | null;
  applied_at: string;
  updated_at: string;
};

export type ApplicationsListResponse = {
  quantity: number;
  data: BackendApplication[];
};

export type ApplicationCreateBody = {
  opportunity_id: string;
  applicant_id: string;
  cover_letter?: string | null;
  status?: 'pending' | 'accepted' | 'rejected' | 'reserved';
};

export type ApplicantEditBody = {
  user?: { display_name?: string | null; phone?: string | null; email?: string | null };
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  university?: string | null;
  graduation_year?: number | null;
  current_education_year?: number | null;
  about?: string | null;
};

export type EmployerEditBody = {
  user?: { display_name?: string | null; phone?: string | null; email?: string | null };
  company_id?: string | null;
  position?: string | null;
};

/** Тело POST /users/create_applicant (как ApplicantCreateDTO на бэке) */
export type ApplicantCreateBody = {
  user: {
    phone: string;
    email: string;
    display_name: string;
    role_id: number;
    email_verified?: boolean;
  };
  first_name: string;
  middle_name: string;
  last_name: string;
  university: string;
  graduation_year: number;
  current_education_year: number;
  about?: string | null;
};

/** Тело POST /users/create_employer (как EmployerCreateDTO на бэке) */
export type EmployerCreateBody = {
  user: {
    phone: string;
    email: string;
    display_name: string;
    role_id: number;
    email_verified?: boolean;
  };
  company_id: string;
  position: string;
};

export const usersApi = {
  createApplicant: (body: ApplicantCreateBody) =>
    requestJson<{ data: Record<string, unknown>; created_at: string }>(
      `${USERS_ENDPOINT}/create_applicant`,
      { method: 'POST', body },
    ),

  createEmployer: (body: EmployerCreateBody) =>
    requestJson<{ data: Record<string, unknown>; created_at: string }>(
      `${USERS_ENDPOINT}/create_employer`,
      { method: 'POST', body },
    ),

  getAllApplications: (userId: string, signal?: AbortSignal) =>
    requestJson<ApplicationsListResponse>(`${USERS_ENDPOINT}/get_all_applications`, {
      query: { user_id: userId },
      signal,
    }),

  makeApplication: (body: ApplicationCreateBody) =>
    requestJson<{ data: BackendApplication; created_at: string }>(
      `${USERS_ENDPOINT}/make_application`,
      { method: 'POST', body },
    ),

  getApplicationsByOpportunity: (opportunityId: string, signal?: AbortSignal) =>
    requestJson<ApplicationsListResponse>(`${USERS_ENDPOINT}/get_applications_by_opportunity`, {
      query: { opportunity_id: opportunityId },
      signal,
    }),

  getEmployerOpportunities: (userId: string, signal?: AbortSignal) =>
    requestJson<{ quantity: number; data: unknown[] }>(
      `${USERS_ENDPOINT}/get_employer_opportunities`,
      { query: { user_id: userId }, signal },
    ),

  editApplicant: (userId: string, body: ApplicantEditBody) =>
    requestJson<{ new_data: Record<string, unknown>; updated_at: string }>(
      `${USERS_ENDPOINT}/edit_applicant`,
      { method: 'PUT', query: { user_id: userId }, body },
    ),

  editEmployer: (userId: string, body: EmployerEditBody) =>
    requestJson<{ new_data: Record<string, unknown>; updated_at: string }>(
      `${USERS_ENDPOINT}/edit_employer`,
      { method: 'PUT', query: { user_id: userId }, body },
    ),
};
