import { useEffect, useMemo, useState } from 'react';
import { mapBackendOpportunityToUi } from './mappers';
import { opportunitiesApi } from './opportunitiesApi';
import { type OpportunitiesListFilters } from './types';

const toStableKey = (filters: OpportunitiesListFilters) => JSON.stringify(filters);

export const useOpportunitiesList = (filters: OpportunitiesListFilters, refreshNonce = 0) => {
  const [data, setData] = useState<ReturnType<typeof mapBackendOpportunityToUi>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = useMemo(() => toStableKey(filters), [filters]);
  const stableFilters = useMemo(() => JSON.parse(key) as OpportunitiesListFilters, [key]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await opportunitiesApi.getAll(stableFilters, controller.signal);
        setData(response.data.map(mapBackendOpportunityToUi));
        setTotal(response.quantity);
      } catch (reason) {
        if (controller.signal.aborted) {
          return;
        }
        setError('Не удалось загрузить вакансии. Проверь подключение к API.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [key, stableFilters, refreshNonce]);

  return { data, total, loading, error };
};
