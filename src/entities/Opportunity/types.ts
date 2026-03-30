export type OpportunityTag = {
  name: string;
  category: string;
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  company_id: string;
  opportunity_type: string;
  work_format: string;
  employment: string;
  level: string;
  location: string;
  latitude: number;
  longitude: number;
  salary_from: number;
  salary_to: number;
  currency: string;
  publication_date: string;
  expiration_date: string;
  event_date: string;
  contact_info: string;
  status: string;
  created_by: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  tags_data: OpportunityTag[];
};
