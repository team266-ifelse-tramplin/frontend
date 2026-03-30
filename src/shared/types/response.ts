export type ResponseStatus = 'pending' | 'review' | 'interview' | 'offer' | 'rejected';

export type UserResponse = {
  id: string | number;
  opportunityId: string;
  status: ResponseStatus;
  appliedAt: string;
  updatedAt: string;
  note?: string;
};
