import { useEffect, useState } from 'react';
import { Building2, ChevronLeft, Clock3, Heart, MapPin, User, Wallet } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@app/providers';
import { OpportunityCard, mapBackendOpportunityToUi, opportunitiesApi } from '@entities/Opportunity';
import { usersApi } from '@shared/api/usersApi';
import { Header } from '@shared/ui/Header';
import {
  formatOpportunitySalary,
  getCompanyLabel,
  getEmploymentLabel,
  getLevelLabel,
  getOpportunityTagNames,
  getOpportunityTypeLabel,
  getWorkFormatLabel,
} from '@shared/lib/opportunityDisplay';
import { useFavoriteIds } from '@shared/lib/useFavoriteIds';
import { Button } from '@shared/ui/Button';

const DETAIL_SECTION_TITLE_CLASS = 'text-base font-bold text-text';
const DETAIL_LIST_CLASS = 'mt-3 space-y-2 text-sm text-text-secondary';

export const OpportunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { favoriteIds, toggleFavorite } = useFavoriteIds();
  const [respondBusy, setRespondBusy] = useState(false);
  const [respondMessage, setRespondMessage] = useState<string | null>(null);
  const [opportunity, setOpportunity] = useState<ReturnType<typeof mapBackendOpportunityToUi> | null>(null);
  const [relatedOpportunities, setRelatedOpportunities] = useState<ReturnType<typeof mapBackendOpportunityToUi>[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);
    setLoadError(null);

    void (async () => {
      try {
        const backendOpportunity = await opportunitiesApi.getOne(id);
        if (!isActive) {
          return;
        }

        const normalizedOpportunity = mapBackendOpportunityToUi(backendOpportunity);
        setOpportunity(normalizedOpportunity);

        const related = await opportunitiesApi.getAll({ work_format: backendOpportunity.work_format ?? undefined });
        if (!isActive) {
          return;
        }

        setRelatedOpportunities(
          related.data
            .map(mapBackendOpportunityToUi)
            .filter((job) => job.id !== normalizedOpportunity.id && job.work_format === normalizedOpportunity.work_format)
            .slice(0, 4),
        );
      } catch {
        if (!isActive) {
          return;
        }
        setLoadError('Не удалось загрузить вакансию. Проверь доступность API.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (!id || (!loading && !opportunity)) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-[1760px] px-5 py-10 md:px-8">
          <section className="rounded-2xl border border-border/80 bg-surface p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-text">Вакансия не найдена</h1>
            <p className="mt-2 text-sm text-text-secondary">
              {loadError ?? 'Возможно, вакансия была удалена или ссылка указана неверно.'}
            </p>
            <Link
              to="/opportunities"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
            >
              <ChevronLeft className="h-4 w-4" />
              К списку вакансий
            </Link>
          </section>
        </main>
      </>
    );
  }

  if (loading || !opportunity) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-[1760px] px-5 py-10 text-sm text-text-secondary md:px-8">
          Загружаем вакансию...
        </main>
      </>
    );
  }

  const handleRespond = () => {
    if (!opportunity || !id) {
      return;
    }
    setRespondMessage(null);

    if (session && session.role !== 'applicant') {
      setRespondMessage('Отклик доступен только соискателям.');
      return;
    }

    const applicantId =
      session && session.role === 'applicant' && session.userId ? session.userId : null;

    if (applicantId) {
      setRespondBusy(true);
      void usersApi
        .makeApplication({
          opportunity_id: id,
          applicant_id: applicantId,
        })
        .then(() => {
          setRespondMessage('Отклик отправлен.');
          navigate('/applications');
        })
        .catch(() => {
          setRespondMessage('Не удалось отправить отклик. Попробуй ещё раз.');
        })
        .finally(() => {
          setRespondBusy(false);
        });
      return;
    }

    navigate(`/auth/login?returnTo=${encodeURIComponent(`/opportunities/${id}`)}`);
  };

  const details = [
    `Тип: ${getOpportunityTypeLabel(opportunity.opportunity_type)}`,
    `Формат: ${getWorkFormatLabel(opportunity.work_format)}`,
    `Уровень: ${getLevelLabel(opportunity.level)}`,
    `Занятость: ${getEmploymentLabel(opportunity.employment)}`,
  ];

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1760px] px-5 py-6 md:px-8">
        <div className="mb-4">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text"
          >
            <ChevronLeft className="h-4 w-4" />К вакансиям
          </Link>
        </div>

        <section className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-text md:text-3xl">{opportunity.title}</h1>
              <p className="mt-2 text-2xl font-extrabold text-primary">
                {formatOpportunitySalary(opportunity)}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-accent" />
                  {getCompanyLabel(opportunity.company_id)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-accent" />
                  {opportunity.location} · {getWorkFormatLabel(opportunity.work_format)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-accent" />
                  {opportunity.publication_date}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => toggleFavorite(opportunity.id)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                  favoriteIds.includes(opportunity.id)
                    ? 'border-favorite/40 bg-favorite/10 text-favorite'
                    : 'border-border bg-background/70 text-text-secondary hover:text-favorite'
                }`}
                aria-label="Добавить в избранное"
              >
                <Heart className={`h-4 w-4 ${favoriteIds.includes(opportunity.id) ? 'fill-current' : ''}`} />
              </button>
              <Button rounded="xl" disabled={respondBusy} onClick={handleRespond}>
                {respondBusy ? 'Отправка…' : 'Откликнуться'}
              </Button>
            </div>
          </div>
          {respondMessage ? <p className="mt-2 text-sm text-text-secondary">{respondMessage}</p> : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {getOpportunityTagNames(opportunity).map((tag) => (
              <span
                key={`${opportunity.id}-${tag}`}
                className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-semibold text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <article className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
              <h2 className={DETAIL_SECTION_TITLE_CLASS}>О вакансии</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{opportunity.description}</p>
            </article>

            <article className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
              <h2 className={DETAIL_SECTION_TITLE_CLASS}>Детали</h2>
              <ul className={DETAIL_LIST_CLASS}>
                {details.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <aside className="h-fit rounded-2xl border border-border/80 bg-surface p-5 shadow-sm lg:sticky lg:top-24">
            <h2 className={DETAIL_SECTION_TITLE_CLASS}>Контакты и мета</h2>
            <div className="mt-3 space-y-2 text-sm text-text-secondary">
              <p className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-accent" />
                {opportunity.contact_info}
              </p>
              <p className="inline-flex items-center gap-2">
                <Wallet className="h-4 w-4 text-accent" />
                Просмотры: {opportunity.views_count}
              </p>
              <p>Статус: {opportunity.status}</p>
              <p>Опубликовано: {opportunity.publication_date}</p>
            </div>
            <Button className="mt-5 w-full" rounded="xl" disabled={respondBusy} onClick={handleRespond}>
              {respondBusy ? 'Отправка…' : 'Откликнуться'}
            </Button>
          </aside>
        </section>

        <section className="mt-5 rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
          <h2 className={DETAIL_SECTION_TITLE_CLASS}>Похожие вакансии</h2>
          {relatedOpportunities.length === 0 ? (
            <p className="mt-2 text-sm text-text-secondary">Пока похожие вакансии не найдены.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {relatedOpportunities.map((relatedOpportunity) => (
                <OpportunityCard
                  key={relatedOpportunity.id}
                  opportunity={relatedOpportunity}
                  detailsHref={`/opportunities/${relatedOpportunity.id}`}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
};
