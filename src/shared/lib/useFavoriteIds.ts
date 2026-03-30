import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@app/providers';
import { favoritesApi } from '@shared/api/favoritesApi';
import { isBackendAuthEnabled } from '@shared/config/features';
import { FAVORITE_OPPORTUNITY_IDS_KEY } from '@shared/config/favorites';

const FAVORITES_CHANGED_EVENT = 'favorites:changed';

const DEFAULT_INITIAL_FAVORITE_IDS: string[] = [];

const parseFavorites = (rawValue: string | null) => {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
};

const readFavoriteIds = () => parseFavorites(window.localStorage.getItem(FAVORITE_OPPORTUNITY_IDS_KEY));

const writeFavoriteIds = (ids: string[]) => {
  window.localStorage.setItem(FAVORITE_OPPORTUNITY_IDS_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: ids }));
};

export const useFavoriteIds = (initialIds: string[] = DEFAULT_INITIAL_FAVORITE_IDS) => {
  const { session } = useAuth();
  const useApi =
    isBackendAuthEnabled() && Boolean(session && session.accessToken && session.userId);

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    if (useApi) {
      return;
    }

    const stored = readFavoriteIds();
    if (stored.length > 0) {
      setFavoriteIds(stored);
      return;
    }
    if (initialIds.length > 0) {
      writeFavoriteIds(initialIds);
      setFavoriteIds(initialIds);
      return;
    }
    setFavoriteIds([]);
  }, [useApi, initialIds]);

  const userId = session?.userId;
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!useApi || !userId) {
      return;
    }

    let cancelled = false;
    setFavoriteIds([]);

    const controller = new AbortController();
    void favoritesApi.getAll(userId, controller.signal).then((res) => {
      if (!cancelled) {
        setFavoriteIds(res.data.map((row) => row.opportunity_id));
      }
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [useApi, userId, accessToken]);

  useEffect(() => {
    const syncFromStorage = () => {
      setFavoriteIds(readFavoriteIds());
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITE_OPPORTUNITY_IDS_KEY && !useApi) {
        syncFromStorage();
      }
    };

    const onFavoritesChanged = () => {
      if (!useApi) {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(FAVORITES_CHANGED_EVENT, onFavoritesChanged);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onFavoritesChanged);
    };
  }, [useApi]);

  const setAllFavoriteIds = useCallback(
    (nextIds: string[]) => {
      setFavoriteIds(nextIds);
      if (!useApi) {
        writeFavoriteIds(nextIds);
      }
    },
    [useApi],
  );

  const toggleFavorite = useCallback(
    async (opportunityId: string) => {
      if (useApi && userId) {
        const isFavorite = favoriteIds.includes(opportunityId);
        if (isFavorite) {
          await favoritesApi.remove(userId, opportunityId);
        } else {
          await favoritesApi.add(userId, opportunityId);
        }
        const res = await favoritesApi.getAll(userId);
        setFavoriteIds(res.data.map((row) => row.opportunity_id));
        window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
        return;
      }

      setFavoriteIds((previousIds) => {
        const nextIds = previousIds.includes(opportunityId)
          ? previousIds.filter((id) => id !== opportunityId)
          : [...previousIds, opportunityId];

        writeFavoriteIds(nextIds);
        return nextIds;
      });
    },
    [useApi, userId, favoriteIds],
  );

  return { favoriteIds, setAllFavoriteIds, toggleFavorite };
};
