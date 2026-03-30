import { type Opportunity } from '@entities/Opportunity';

const WORK_FORMAT_LABELS: Record<string, string> = {
  office: 'Офис',
  remote: 'Удаленка',
  hybrid: 'Гибрид',
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  full: 'Полная',
  part: 'Частичная',
  partial: 'Частичная',
};

const LEVEL_LABELS: Record<string, string> = {
  intern: 'Стажер',
  junior: 'Джун',
  middle: 'Мидл',
  senior: 'Сеньор',
};

const OPPORTUNITY_TYPE_LABELS: Record<string, string> = {
  vacancy: 'Работа',
  event: 'Ивент',
  internship: 'Стажка',
  mentoring: 'Менторство',
};

export const getWorkFormatLabel = (value: string) => WORK_FORMAT_LABELS[value] ?? value;
export const getEmploymentLabel = (value: string) => EMPLOYMENT_LABELS[value] ?? value;
export const getLevelLabel = (value: string) => LEVEL_LABELS[value] ?? value;
export const getOpportunityTypeLabel = (value: string) => OPPORTUNITY_TYPE_LABELS[value] ?? value;

export const getOpportunityTagNames = (opportunity: Opportunity) =>
  opportunity.tags_data.map((tag) => tag.name);

export const formatOpportunitySalary = (opportunity: Opportunity) => {
  if (!opportunity.salary_from && !opportunity.salary_to) {
    return 'По договоренности';
  }

  const from = opportunity.salary_from.toLocaleString('ru-RU');
  const to = opportunity.salary_to.toLocaleString('ru-RU');
  const currency = opportunity.currency.toUpperCase();
  return `${from} - ${to} ${currency}`;
};

export const getCompanyLabel = (companyId: string) => `Компания ${companyId.slice(0, 8)}`;
