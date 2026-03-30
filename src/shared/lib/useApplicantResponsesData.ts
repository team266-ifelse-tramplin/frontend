import { useEffect, useMemo, useState } from 'react';
import { mapBackendOpportunityToUi, opportunitiesApi, type Opportunity } from '@entities/Opportunity';
import { MOCK_JOBS } from '@features/jobs-map/model/mockJobs';
import { usersApi } from '@shared/api/usersApi';
import { USER_RESPONSES_MOCK } from '@shared/config/responsesMock';
import { isBackendAuthEnabled } from '@shared/config/features';
import {
  APPLICANT_LOCAL_RESPONSES_CHANGED_EVENT,
  readLocalApplicantResponses,
} from '@shared/lib/localApplicantResponsesStorage';
import { mapBackendApplicationToUserResponse } from '@shared/lib/mapBackendApplication';
import { type AuthSession } from '@shared/types/auth';
import { type UserResponse } from '@shared/types/response';

const mergeResponses = (base: UserResponse[], local: UserResponse[]): UserResponse[] => {
  const byOpp = new Map<string, UserResponse>();
  for (const r of base) {
    byOpp.set(String(r.opportunityId), r);
  }
  for (const r of local) {
    if (!byOpp.has(String(r.opportunityId))) {
      byOpp.set(String(r.opportunityId), r);
    }
  }
  return [...byOpp.values()];
};

export const useApplicantResponsesData = (session: AuthSession | null) => {
  const useApi =
    isBackendAuthEnabled() &&
    session &&
    session.role === 'applicant' &&
    session.accessToken &&
    session.userId;

  const applicantUserId = session?.role === 'applicant' ? session.userId : null;

  const [localRows, setLocalRows] = useState<UserResponse[]>([]);
  const [apiRows, setApiRows] = useState<UserResponse[] | null>(null);
  const [opportunityById, setOpportunityById] = useState<Map<string, Opportunity>>(() => {
    return new Map(MOCK_JOBS.map((job) => [job.id, job as Opportunity]));
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!applicantUserId) {
      setOpportunityById(new Map(MOCK_JOBS.map((job) => [job.id, job as Opportunity])));
    }
  }, [applicantUserId]);

  useEffect(() => {
    if (!applicantUserId) {
      setLocalRows([]);
      return;
    }

    const sync = () => setLocalRows(readLocalApplicantResponses(applicantUserId));
    sync();
    window.addEventListener(APPLICANT_LOCAL_RESPONSES_CHANGED_EVENT, sync);
    return () => window.removeEventListener(APPLICANT_LOCAL_RESPONSES_CHANGED_EVENT, sync);
  }, [applicantUserId]);

  useEffect(() => {
    if (!session || !useApi || !session.userId) {
      setApiRows(null);
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
      setApiRows(mapped);

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
          // удалённая карточка
        }
      }

      if (!cancelled) {
        setOpportunityById((prev) => {
          const m = new Map(prev);
          for (const [k, v] of entries) {
            m.set(k, v);
          }
          return m;
        });
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [useApi, session?.userId, session?.accessToken]);

  const mergedResponses = useMemo(() => {
    if (!applicantUserId) {
      return USER_RESPONSES_MOCK;
    }
    const base = useApi ? (apiRows ?? []) : USER_RESPONSES_MOCK;
    return mergeResponses(base, localRows);
  }, [applicantUserId, useApi, apiRows, localRows]);

  useEffect(() => {
    const ids = [...new Set(mergedResponses.map((r) => String(r.opportunityId)))];
    if (ids.length === 0) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const entries: [string, Opportunity][] = [];
      for (const oid of ids) {
        try {
          const raw = await opportunitiesApi.getOne(oid);
          if (cancelled) {
            return;
          }
          entries.push([oid, mapBackendOpportunityToUi(raw)]);
        } catch {
          // нет карточки
        }
      }
      if (!cancelled && entries.length > 0) {
        setOpportunityById((prev) => {
          const m = new Map(prev);
          let changed = false;
          for (const [k, v] of entries) {
            if (!m.has(k)) {
              m.set(k, v);
              changed = true;
            }
          }
          return changed ? m : prev;
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mergedResponses]);

  return { responses: mergedResponses, opportunityById, loading, useApi: Boolean(useApi) };
};
