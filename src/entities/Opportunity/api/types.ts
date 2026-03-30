export type BackendOpportunityTag = {
  name: string;
  category: string;
};

export type BackendOpportunity = {
  id: string;
  title: string;
  description: string;
  company_id: string;
  opportunity_type: 'vacancy' | 'internship' | 'mentoring' | 'event' | null;
  work_format: 'office' | 'hybrid' | 'remote' | null;
  employment: 'full' | 'partial' | null;
  level: 'intern' | 'junior' | 'middle' | 'senior' | null;
  tags_data?: BackendOpportunityTag[] | null;
  location: string | null;
  latitude?: number | null;
  longitude?: number | null;
  salary_from?: number | null;
  salary_to?: number | null;
  currency?: string | null;
  publication_date: string;
  expiration_date?: string | null;
  event_date?: string | null;
  contact_info?: string | null;
  status: string;
  created_by: string;
  views_count: number;
  created_at: string;
  updated_at: string;
};

export type OpportunitiesListResponse = {
  quantity: number;
  data: BackendOpportunity[];
};

export type OpportunitiesListFilters = {
  status?: 'active' | 'closed';
  opportunity_type?: 'vacancy' | 'internship' | 'mentoring' | 'event';
  work_format?: 'office' | 'hybrid' | 'remote';
  level?: 'intern' | 'junior' | 'middle' | 'senior';
  salary_from?: number;
  salary_to?: number;
  employment?: 'full' | 'partial';
  location?: string;
};

export type OpportunityCreatePayload = {
  title: string;
  description: string;
  company_id: string;
  opportunity_type: 'vacancy' | 'internship' | 'mentoring' | 'event';
  work_format: 'office' | 'hybrid' | 'remote';
  employment: 'full' | 'partial';
  level: 'intern' | 'junior' | 'middle' | 'senior';
  tags_data?: BackendOpportunityTag[];
  location?: string;
  latitude?: number;
  longitude?: number;
  salary_from?: number;
  salary_to?: number;
  currency?: string;
  publication_date?: string;
  expiration_date?: string;
  event_date?: string;
  contact_info?: string;
  status?: string;
  created_by?: string;
};

export type OpportunityEditPayload = Partial<{
  title: string;
  description: string;
  type: 'vacancy' | 'internship' | 'mentoring' | 'event';
  work_format: 'office' | 'hybrid' | 'remote';
  employment: 'full' | 'partial';
  level: 'intern' | 'junior' | 'middle' | 'senior';
  location: string;
  latitude: number;
  longitude: number;
  salary_from: number;
  salary_to: number;
  currency: string;
  publication_date: string;
  expiration_date: string;
  event_date: string;
  status: string;
}>;
