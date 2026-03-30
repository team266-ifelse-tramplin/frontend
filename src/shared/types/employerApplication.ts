export type EmployerDecisionStatus = 'pending' | 'accepted' | 'rejected' | 'reserve';

export type EmployerApplicationRow = {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  applicantUserId: string;
  applicantDisplayName: string;
  appliedAt: string;
  employerStatus: EmployerDecisionStatus;
};
