import { type Opportunity } from '../types';
import {
  type BackendOpportunity,
  type OpportunitiesListFilters,
  type OpportunityCreatePayload,
  type OpportunityEditPayload,
} from './types';

const DEFAULT_LAT = 55.751244;
const DEFAULT_LNG = 37.618423;

const normalizeEmployment = (value: BackendOpportunity['employment']) => {
  if (value === 'partial') {
    return 'part';
  }

  return value ?? 'full';
};

const denormalizeEmployment = (value: string) => {
  if (value === 'part') {
    return 'partial';
  }

  return value;
};

export const mapBackendOpportunityToUi = (opportunity: BackendOpportunity): Opportunity => {
  return {
    id: opportunity.id,
    title: opportunity.title,
    description: opportunity.description,
    company_id: opportunity.company_id,
    opportunity_type: opportunity.opportunity_type ?? 'vacancy',
    work_format: opportunity.work_format ?? 'office',
    employment: normalizeEmployment(opportunity.employment),
    level: opportunity.level ?? 'junior',
    location: opportunity.location ?? 'Локация не указана',
    latitude: opportunity.latitude ?? DEFAULT_LAT,
    longitude: opportunity.longitude ?? DEFAULT_LNG,
    salary_from: opportunity.salary_from ?? 0,
    salary_to: opportunity.salary_to ?? 0,
    currency: (opportunity.currency ?? 'RUB').toLowerCase(),
    publication_date: opportunity.publication_date,
    expiration_date: opportunity.expiration_date ?? opportunity.publication_date,
    event_date: opportunity.event_date ?? opportunity.publication_date,
    contact_info: opportunity.contact_info ?? 'Контакт не указан',
    status: opportunity.status,
    created_by: opportunity.created_by,
    views_count: opportunity.views_count,
    created_at: opportunity.created_at,
    updated_at: opportunity.updated_at,
    tags_data: opportunity.tags_data ?? [],
  };
};

export const mapUiFiltersToBackend = (filters: {
  selectedWorkFormat: string;
  selectedOpportunityType: string;
  selectedLevel: string;
  selectedEmploymentLevel: string;
  salaryFrom: string;
  salaryTo: string;
}): OpportunitiesListFilters => {
  const result: OpportunitiesListFilters = {};

  if (filters.selectedWorkFormat !== 'Все') {
    result.work_format = filters.selectedWorkFormat as OpportunitiesListFilters['work_format'];
  }
  if (filters.selectedOpportunityType !== 'Все') {
    result.opportunity_type = filters.selectedOpportunityType as OpportunitiesListFilters['opportunity_type'];
  }
  if (filters.selectedLevel !== 'Все') {
    result.level = filters.selectedLevel as OpportunitiesListFilters['level'];
  }
  if (filters.selectedEmploymentLevel !== 'Все') {
    result.employment = denormalizeEmployment(filters.selectedEmploymentLevel) as OpportunitiesListFilters['employment'];
  }
  if (filters.salaryFrom) {
    result.salary_from = Number(filters.salaryFrom);
  }
  if (filters.salaryTo) {
    result.salary_to = Number(filters.salaryTo);
  }

  return result;
};

export const mapFormToCreatePayload = (input: {
  title: string;
  description: string;
  company_id: string;
  opportunity_type: string;
  work_format: string;
  employment: string;
  level: string;
  location: string;
  salary_from: string;
  salary_to: string;
  currency: string;
  contact_info: string;
  tags: string;
  created_by: string;
  latitude?: string;
  longitude?: string;
}): OpportunityCreatePayload => {
  const parsedLatitude = input.latitude ? Number(input.latitude) : NaN;
  const parsedLongitude = input.longitude ? Number(input.longitude) : NaN;
  const publicationDate = new Date();
  const expirationDate = new Date(publicationDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    title: input.title,
    description: input.description,
    company_id: input.company_id,
    opportunity_type: input.opportunity_type as OpportunityCreatePayload['opportunity_type'],
    work_format: input.work_format as OpportunityCreatePayload['work_format'],
    employment: denormalizeEmployment(input.employment) as OpportunityCreatePayload['employment'],
    level: input.level as OpportunityCreatePayload['level'],
    location: input.location,
    latitude: Number.isFinite(parsedLatitude) ? parsedLatitude : DEFAULT_LAT,
    longitude: Number.isFinite(parsedLongitude) ? parsedLongitude : DEFAULT_LNG,
    salary_from: input.salary_from ? Number(input.salary_from) : undefined,
    salary_to: input.salary_to ? Number(input.salary_to) : undefined,
    currency: input.currency.toUpperCase(),
    publication_date: publicationDate.toISOString(),
    expiration_date: expirationDate.toISOString(),
    event_date: publicationDate.toISOString(),
    contact_info: input.contact_info,
    created_by: input.created_by || undefined,
    tags_data: input.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((name) => ({ name, category: 'skill' })),
  };
};

export const mapFormToEditPayload = (input: {
  title: string;
  description: string;
  opportunity_type: string;
  work_format: string;
  employment: string;
  level: string;
  location: string;
  salary_from: string;
  salary_to: string;
  currency: string;
  status: string;
}): OpportunityEditPayload => {
  return {
    title: input.title,
    description: input.description,
    type: input.opportunity_type as OpportunityEditPayload['type'],
    work_format: input.work_format as OpportunityEditPayload['work_format'],
    employment: denormalizeEmployment(input.employment) as OpportunityEditPayload['employment'],
    level: input.level as OpportunityEditPayload['level'],
    location: input.location,
    salary_from: input.salary_from ? Number(input.salary_from) : undefined,
    salary_to: input.salary_to ? Number(input.salary_to) : undefined,
    currency: input.currency ? input.currency.toUpperCase() : undefined,
    status: input.status || undefined,
  };
};
