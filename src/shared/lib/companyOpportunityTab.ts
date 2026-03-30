import { type Opportunity } from '@entities/Opportunity';

export type CompanyOpportunityTabKey = 'active' | 'closed' | 'scheduled';

/** Закрытые — по status; запланированные — publication_date позже начала текущих суток; иначе активные. */
export const getCompanyOpportunityTab = (opportunity: Opportunity): CompanyOpportunityTabKey => {
  if (opportunity.status.toLowerCase() === 'closed') {
    return 'closed';
  }
  const pub = new Date(opportunity.publication_date);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  if (pub > startOfToday) {
    return 'scheduled';
  }
  return 'active';
};
