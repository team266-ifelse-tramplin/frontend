import { useEffect, useState } from 'react';
import { opportunitiesApi } from '@entities/Opportunity';
import { usersApi } from '@shared/api/usersApi';
import { mapBackendApplicationToEmployerRow } from '@shared/lib/mapBackendApplication';
import { type EmployerApplicationRow } from '@shared/types/employerApplication';

export const useEmployerApplicationsBase = (input: { enabled: boolean; companyId: string }) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<EmployerApplicationRow[] | null>(null);

  useEffect(() => {
    if (!input.enabled) {
      setLoading(false);
      setRows(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setRows(null);

    void (async () => {
      const list = await opportunitiesApi.getAll({});
      if (cancelled) {
        return;
      }

      const mine = list.data.filter((o) => o.company_id === input.companyId);
      const titleById = new Map(mine.map((o) => [o.id, o.title]));
      const acc: EmployerApplicationRow[] = [];

      for (const o of mine) {
        const res = await usersApi.getApplicationsByOpportunity(o.id);
        if (cancelled) {
          return;
        }
        for (const app of res.data) {
          acc.push(
            mapBackendApplicationToEmployerRow(app, titleById.get(app.opportunity_id) ?? o.title),
          );
        }
      }

      if (!cancelled) {
        setRows(acc);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [input.enabled, input.companyId]);

  return { loading, rows };
};
