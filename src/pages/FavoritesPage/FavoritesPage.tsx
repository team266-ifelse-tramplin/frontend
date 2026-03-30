import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OpportunityCard, mapBackendOpportunityToUi, opportunitiesApi, type Opportunity } from '@entities/Opportunity';
import { useFavoriteIds } from '@shared/lib/useFavoriteIds';
import { Header } from '@shared/ui/Header';

const INITIAL_FAVORITE_IDS = [
  'ba7e6b08-9fea-4dc4-937e-f731801e0000',
  'ba7e6b08-9fea-4dc4-937e-f731801e0001',
  'ba7e6b08-9fea-4dc4-937e-f731801e0002',
  'ba7e6b08-9fea-4dc4-937e-f731801e0003',
  'ba7e6b08-9fea-4dc4-937e-f731801e0006',
  'ba7e6b08-9fea-4dc4-937e-f731801e0008',
];

export const FavoritesPage = () => {
  const { favoriteIds, toggleFavorite } = useFavoriteIds(INITIAL_FAVORITE_IDS);
  const [favoriteJobs, setFavoriteJobs] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (favoriteIds.length === 0) {
        setFavoriteJobs([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const jobs = await Promise.all(
          favoriteIds.map(async (opportunityId) => {
            try {
              const result = await opportunitiesApi.getOne(opportunityId);
              return mapBackendOpportunityToUi(result);
            } catch {
              return null;
            }
          }),
        );

        if (!isActive) {
          return;
        }

        setFavoriteJobs(jobs.filter((job): job is Opportunity => job !== null));
      } catch {
        if (!isActive) {
          return;
        }
        setError('Не удалось загрузить избранные вакансии.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, [favoriteIds]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1760px] px-5 py-6 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-favorite/10 text-favorite">
                <Heart className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-bold text-text">Избранное</h1>
              <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">
                {favoriteJobs.length}
              </span>
            </div>
          </div>
          {loading ? <p className="mb-3 text-sm text-text-secondary">Загружаем избранные вакансии...</p> : null}
          {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}

          {favoriteJobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-background/50 px-4 py-8 text-center">
              <p className="text-base font-semibold text-text">В избранном пока пусто</p>
              <p className="mt-1 text-sm text-text-secondary">
                Добавляй вакансии через сердечко, чтобы они появлялись здесь.
              </p>
              <Link
                to="/opportunities"
                className="mt-4 inline-flex items-center rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                Перейти к вакансиям
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteJobs.map((job) => (
                <OpportunityCard
                  key={job.id}
                  opportunity={job}
                  isFavorite={favoriteIds.includes(job.id)}
                  onToggleFavorite={() => toggleFavorite(job.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};
