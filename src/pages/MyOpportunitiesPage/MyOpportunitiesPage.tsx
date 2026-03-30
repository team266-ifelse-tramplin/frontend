import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { OpportunityCard, opportunitiesApi, useOpportunitiesList } from '@entities/Opportunity';
import { useAuth } from '@app/providers';
import { resolveOpportunityActorIds } from '@shared/config/opportunities';
import { Header } from '@shared/ui/Header';
import { Button } from '@shared/ui/Button';
import { useFavoriteIds } from '@shared/lib/useFavoriteIds';

export const MyOpportunitiesPage = () => {
  const { session } = useAuth();
  const { companyId } = resolveOpportunityActorIds(session);
  const { data, loading, error } = useOpportunitiesList({});
  const { favoriteIds, toggleFavorite } = useFavoriteIds();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [allDeleted, setAllDeleted] = useState(false);

  const myJobs = useMemo(
    () =>
      data.filter(
        (opportunity) =>
          opportunity.company_id === companyId &&
          !removedIds.includes(opportunity.id) &&
          !allDeleted,
      ),
    [allDeleted, companyId, data, removedIds],
  );

  const deleteOne = async (opportunityId: string) => {
    setDeletingId(opportunityId);
    setActionError(null);
    try {
      await opportunitiesApi.deleteOne(opportunityId);
      setRemovedIds((prev) => [...prev, opportunityId]);
    } catch {
      setActionError('Не удалось удалить вакансию.');
    } finally {
      setDeletingId(null);
    }
  };

  const deleteAll = async () => {
    setIsDeletingAll(true);
    setActionError(null);
    try {
      await opportunitiesApi.deleteAllByCompanyId(companyId);
      setAllDeleted(true);
    } catch {
      setActionError('Не удалось удалить вакансии компании.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1760px] px-5 py-6 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-4 shadow-sm md:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-text">Мои вакансии</h1>
              <p className="text-sm text-text-secondary">
                Компания: <span className="font-mono">{companyId}</span>. Бэкенд сейчас отдает до 10 вакансий в списке.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/opportunities/create" className="btn pri sm r-xl">
                Создать вакансию
              </Link>
              <Button
                variant="sec"
                size="sm"
                onClick={() => {
                  if (window.confirm('Удалить все вакансии компании?')) {
                    void deleteAll();
                  }
                }}
                disabled={isDeletingAll}
              >
                {isDeletingAll ? 'Удаляем...' : 'Удалить все'}
              </Button>
            </div>
          </div>

          {loading ? <p className="text-sm text-text-secondary">Загружаем вакансии...</p> : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {actionError ? <p className="mb-3 text-sm text-red-500">{actionError}</p> : null}

          {myJobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-background/50 px-4 py-8 text-center">
              <p className="text-base font-semibold text-text">Пока нет вакансий этой компании</p>
              <p className="mt-1 text-sm text-text-secondary">Создай первую вакансию через форму.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myJobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-border/70 bg-background/30 p-3">
                  <OpportunityCard
                    opportunity={job}
                    isFavorite={favoriteIds.includes(job.id)}
                    onToggleFavorite={() => toggleFavorite(job.id)}
                    detailsHref={`/opportunities/${job.id}`}
                    showRespondButton={false}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <Link to={`/opportunities/${job.id}/edit`} className="btn sec sm r-xl">
                      Редактировать
                    </Link>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Удалить эту вакансию?')) {
                          void deleteOne(job.id);
                        }
                      }}
                      disabled={deletingId === job.id}
                    >
                      {deletingId === job.id ? 'Удаляем...' : 'Удалить'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};
