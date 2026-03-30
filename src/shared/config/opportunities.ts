import { type AuthSession } from '@shared/types/auth';

export const DEFAULT_COMPANY_ID =
  import.meta.env.VITE_COMPANY_ID ?? 'd896119b-cc6f-41a7-892b-f1ebed29bbe0';

export const DEFAULT_USER_ID =
  import.meta.env.VITE_USER_ID ?? '01c1d671-d22b-4918-9e7a-1ab5565a6a6e';

export const resolveOpportunityActorIds = (session: AuthSession | null) => {
  const companyId = session?.companyId ?? DEFAULT_COMPANY_ID;
  const rawUserId = session?.userId ?? DEFAULT_USER_ID;
  // Safety net for stale mock sessions where userId was accidentally saved as companyId.
  const userId = rawUserId === companyId ? DEFAULT_USER_ID : rawUserId;

  return {
    userId,
    companyId,
  };
};
