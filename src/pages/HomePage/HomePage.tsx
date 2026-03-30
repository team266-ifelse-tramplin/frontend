import { Header } from '@shared/ui/Header';
import { useAuth } from '@app/providers';
import { JobsMap } from '@features/jobs-map';
import { Link } from 'react-router-dom';
import { OpportunityCard, useOpportunitiesList } from '@entities/Opportunity';
import { resolveOpportunityActorIds } from '@shared/config/opportunities';
import { useFavoriteIds } from '@shared/lib/useFavoriteIds';
import { HomeHero } from '@widgets/HomeHero';

export const HomePage = () => {
  const { session } = useAuth();
  const isCompany = session?.role === 'company';
  const { companyId } = resolveOpportunityActorIds(session);
  const { data, loading, error } = useOpportunitiesList({});
  const { favoriteIds, toggleFavorite } = useFavoriteIds();
  const myJobs = data.filter((opportunity) => opportunity.company_id === companyId);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1760px] px-5 py-6 md:px-8">
        <HomeHero />
        {isCompany ? (
          <section className="mx-auto mt-2 max-w-5xl rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-text">Мои вакансии</h2>
              <div className="flex gap-2">
                <Link to="/my-opportunities" className="btn sec sm r-xl">
                  Управление
                </Link>
                <Link to="/opportunities/create" className="btn pri sm r-xl">
                  Создать вакансию
                </Link>
              </div>
            </div>
            {loading ? <p className="mt-3 text-sm text-text-secondary">Загружаем вакансии...</p> : null}
            {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
            {!loading && !error && myJobs.length === 0 ? (
              <p className="mt-3 text-sm text-text-secondary">У этой компании пока нет вакансий.</p>
            ) : null}
            <div className="mt-4 space-y-3">
              {myJobs.slice(0, 5).map((job) => (
                <OpportunityCard
                  key={job.id}
                  opportunity={job}
                  isFavorite={favoriteIds.includes(job.id)}
                  onToggleFavorite={() => toggleFavorite(job.id)}
                  detailsHref={`/opportunities/${job.id}`}
                  showRespondButton={false}
                />
              ))}
            </div>
          </section>
        ) : (
          <JobsMap />
        )}
      </main>
    </>
  );
};
