import { OPPORTUNITIES_ENDPOINT } from '@shared/config/api';
import { requestJson } from '@shared/lib/http';
import {
  type BackendOpportunity,
  type OpportunitiesListFilters,
  type OpportunitiesListResponse,
  type OpportunityCreatePayload,
  type OpportunityEditPayload,
} from './types';

const toListQuery = (filters: OpportunitiesListFilters) => {
  return {
    status: filters.status,
    opportunity_type: filters.opportunity_type,
    work_format: filters.work_format,
    level: filters.level,
    salary_from: filters.salary_from,
    salary_to: filters.salary_to,
    employment: filters.employment,
    location: filters.location,
  };
};

export const opportunitiesApi = {
  getAll: (filters: OpportunitiesListFilters = {}, signal?: AbortSignal) =>
    requestJson<OpportunitiesListResponse>(`${OPPORTUNITIES_ENDPOINT}/get_all`, {
      query: toListQuery(filters),
      signal,
    }),

  getOne: (opportunityId: string, signal?: AbortSignal) =>
    requestJson<BackendOpportunity>(`${OPPORTUNITIES_ENDPOINT}/get_one`, {
      query: { opportunity_id: opportunityId },
      signal,
    }),

  createOne: (payload: OpportunityCreatePayload) =>
    requestJson<{ data: BackendOpportunity; created_at: string }>(`${OPPORTUNITIES_ENDPOINT}/create_one`, {
      method: 'POST',
      body: payload,
    }),

  editOne: (opportunityId: string, payload: OpportunityEditPayload) =>
    requestJson<{ new_data: Record<string, unknown>; updated_at: string }>(
      `${OPPORTUNITIES_ENDPOINT}/edit_one`,
      {
        method: 'PUT',
        query: { opportunity_id: opportunityId },
        body: payload,
      },
    ),

  deleteOne: (opportunityId: string) =>
    requestJson<null>(`${OPPORTUNITIES_ENDPOINT}/delete_one`, {
      method: 'DELETE',
      query: { opportunity_id: opportunityId },
    }),

  deleteAllByCompanyId: (companyId: string) =>
    requestJson<{ quantity: number; deleted_at: string }>(
      `${OPPORTUNITIES_ENDPOINT}/delete_all_by_company_id`,
      {
        method: 'DELETE',
        query: { company_id: companyId },
      },
    ),
};
