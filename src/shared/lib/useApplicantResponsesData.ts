import { useEffect, useState } from 'react';
import { mapBackendOpportunityToUi, opportunitiesApi, type Opportunity } from '@entities/Opportunity';
import { MOCK_JOBS } from '@features/jobs-map/model/mockJobs';
import { usersApi } from '@shared/api/usersApi';
import { USER_RESPONSES_MOCK } from '@shared/config/responsesMock';
import { isBackendAuthEnabled } from '@shared/config/features';
import { mapBackendApplicationToUserResponse } from '@shared/lib/mapBackendApplication';
import { type AuthSession } from '@shared/types/auth';
import { type UserResponse } from '@shared/types/response';

export const useApplicantResponsesData = (session: AuthSession | null) => {
  const useApi =
    isBackendAuthEnabled() &&
    session &&
    session.role === 'applicant' &&
    session.accessToken &&
    session.userId;

  const [responses, setResponses] = useState<UserResponse[]>(USER_RESPONSES_MOCK);
  const [opportunityById, setOpportunityById] = useState<Map<string, Opportunity>>(() => {
    return new Map(MOCK_JOBS.map((job) => [job.id, job as Opportunity]));
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session || !useApi || !session.userId) {
      setResponses(USER_RESPONSES_MOCK);
      setOpportunityById(new Map(MOCK_JOBS.map((job) => [job.id, job as Opportunity])));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      const appsRes = await usersApi.getAllApplications(session.userId);
      if (cancelled) {
        return;
      }

      const mapped = appsRes.data.map(mapBackendApplicationToUserResponse);
      setResponses(mapped);

      const ids = [...new Set(mapped.map((r) => r.opportunityId))];
      const entries: [string, Opportunity][] = [];

      for (const oid of ids) {
        try {
          const raw = await opportunitiesApi.getOne(oid);
          if (cancelled) {
            return;
          }
          entries.push([oid, mapBackendOpportunityToUi(raw)]);
        } catch {
          // пропускаем удалённые карточки
        }
      }

      if (!cancelled) {
        setOpportunityById(new Map(entries));
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [useApi, session?.userId, session?.accessToken]);

  return { responses, opportunityById, loading, useApi: Boolean(useApi) };
};
