import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, GraduationCap, Heart, LayoutDashboard, Link2 } from 'lucide-react';
import { useAuth } from '@app/providers';
import { Header } from '@shared/ui/Header';
import { Button } from '@shared/ui/Button';
import { RESPONSE_STATUS_META } from '@shared/config/responsesMock';
import { isBackendAuthEnabled } from '@shared/config/features';
import { usersApi } from '@shared/api/usersApi';
import { useFavoriteIds } from '@shared/lib/useFavoriteIds';
import { useApplicantResponsesData } from '@shared/lib/useApplicantResponsesData';
import { formatOpportunitySalary, getCompanyLabel } from '@shared/lib/opportunityDisplay';
import {
  readApplicantProfileDraft,
  writeApplicantProfileDraft,
} from '@shared/lib/profileDraftStorage';
import { type AuthSession } from '@shared/types/auth';
import { EmployerCabinet } from './EmployerCabinet';

const linkCardClass =
  'flex items-center gap-3 rounded-xl border border-border/80 bg-background/50 px-4 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/40 hover:bg-primary/5';

const sectionTitleClass = 'text-xs font-semibold uppercase tracking-wide text-text-secondary';

export const ProfilePage = () => {
  const auth = useAuth().session as AuthSession;
  const { favoriteIds } = useFavoriteIds();
  const { responses, opportunityById } = useApplicantResponsesData(auth);
  const fullName = auth.login ?? auth.email;
  const [firstName = '', lastName = ''] = fullName.trim().split(/\s+/);
  const lastInitial = lastName ? `${lastName[0].toUpperCase()}.` : '';
  const userDisplayName = [firstName, lastInitial].filter(Boolean).join(' ');
  const favoriteOpportunities = useMemo(() => {
    if (auth.role !== 'applicant') {
      return [];
    }
    return favoriteIds
      .map((id) => opportunityById.get(id))
      .filter((job): job is NonNullable<typeof job> => Boolean(job));
  }, [auth.role, favoriteIds, opportunityById]);
  const responsesWithJobs = useMemo(() => {
    if (auth.role !== 'applicant') {
      return [];
    }
    return responses
      .map((response) => ({
        response,
        opportunity: opportunityById.get(response.opportunityId),
      }))
      .filter((row): row is typeof row & { opportunity: NonNullable<typeof row.opportunity> } =>
        Boolean(row.opportunity),
      );
  }, [auth.role, responses, opportunityById]);
  const verifiedLabel = useMemo(
    () =>
      new Date(auth.verifiedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [auth.verifiedAt],
  );

  const [applicantDraft, setApplicantDraft] = useState(() =>
    readApplicantProfileDraft(auth.userId),
  );

  const roleLabel = auth.role === 'company' ? 'Работодатель' : 'Соискатель';
  const heroTitle =
    auth.role === 'applicant' ? applicantDraft.fullName.trim() || fullName : userDisplayName;
  const heroInitial = (auth.role === 'applicant' ? heroTitle : fullName).slice(0, 1).toUpperCase();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1760px] px-5 py-6 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
                {heroInitial}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text">{heroTitle}</h1>
                <p className="mt-1 text-sm text-text-secondary">{auth.email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {roleLabel}
                  </span>
                  <span className="text-xs text-text-secondary">В сети с {verifiedLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {auth.role === 'applicant' ? (
            <div className="mt-8 space-y-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-border/80 bg-background/40 p-5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-text">Личные данные и учёба</h2>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Идентифицирующая информация отображается в личном кабинете и пригодится для откликов.
                  </p>
                  <label className="block text-sm">
                    <span className={sectionTitleClass}>ФИО</span>
                    <input
                      type="text"
                      value={applicantDraft.fullName}
                      onChange={(e) => setApplicantDraft((d) => ({ ...d, fullName: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none transition-colors focus:border-primary"
                      placeholder="Иванов Иван Иванович"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className={sectionTitleClass}>Вуз</span>
                    <input
                      type="text"
                      value={applicantDraft.university}
                      onChange={(e) => setApplicantDraft((d) => ({ ...d, university: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none transition-colors focus:border-primary"
                      placeholder="Например, МГУ им. М. В. Ломоносова"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className={sectionTitleClass}>Курс / год выпуска</span>
                    <input
                      type="text"
                      value={applicantDraft.courseOrGraduationYear}
                      onChange={(e) =>
                        setApplicantDraft((d) => ({ ...d, courseOrGraduationYear: e.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none transition-colors focus:border-primary"
                      placeholder="3 курс или 2026"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className={sectionTitleClass}>Телефон</span>
                    <input
                      type="tel"
                      value={applicantDraft.phone}
                      onChange={(e) => setApplicantDraft((d) => ({ ...d, phone: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none transition-colors focus:border-primary"
                      placeholder="+7 …"
                    />
                  </label>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className={sectionTitleClass}>Email в аккаунте</dt>
                      <dd className="mt-1 font-medium text-text">{auth.email}</dd>
                    </div>
                    <div>
                      <dt className={sectionTitleClass}>Логин</dt>
                      <dd className="mt-1 font-medium text-text">{auth.login}</dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-4 rounded-2xl border border-border/80 bg-background/40 p-5">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-text">Резюме и портфолио</h2>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Навыки, проекты и ссылки сохраняются локально до подключения единого API резюме.
                  </p>
                  <label className="block text-sm">
                    <span className={sectionTitleClass}>Навыки</span>
                    <textarea
                      value={applicantDraft.skills}
                      onChange={(e) => setApplicantDraft((d) => ({ ...d, skills: e.target.value }))}
                      rows={3}
                      className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-text outline-none transition-colors focus:border-primary"
                      placeholder="Например: TypeScript, React, аналитика"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className={sectionTitleClass}>Опыт проектов</span>
                    <textarea
                      value={applicantDraft.projectsExperience}
                      onChange={(e) =>
                        setApplicantDraft((d) => ({ ...d, projectsExperience: e.target.value }))
                      }
                      rows={5}
                      className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-text outline-none transition-colors focus:border-primary"
                      placeholder="Кратко о ролях, задачах, стеке и результатах"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className={sectionTitleClass}>Ссылки на репозитории</span>
                    <textarea
                      value={applicantDraft.repoLinks}
                      onChange={(e) => setApplicantDraft((d) => ({ ...d, repoLinks: e.target.value }))}
                      rows={3}
                      className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm text-text outline-none transition-colors focus:border-primary"
                      placeholder={'По одной ссылке на строку\nhttps://github.com/…'}
                    />
                  </label>
                  <Button
                    type="button"
                    onClick={() => {
                      writeApplicantProfileDraft(auth.userId, applicantDraft);
                      if (isBackendAuthEnabled() && auth.accessToken && auth.role === 'applicant') {
                        const parts = applicantDraft.fullName.trim().split(/\s+/).filter(Boolean);
                        const first_name = parts[0] ?? '';
                        const last_name = parts.length > 1 ? parts[parts.length - 1] : '';
                        const middle_name = parts.length > 2 ? parts.slice(1, -1).join(' ') : null;
                        const grad = applicantDraft.courseOrGraduationYear.match(/(19|20)\d{2}/);
                        const graduation_year = grad ? Number(grad[0]) : null;
                        void usersApi.editApplicant(auth.userId, {
                          user: {
                            display_name: applicantDraft.fullName.trim() || auth.login || auth.email,
                            phone: applicantDraft.phone.trim() || null,
                            email: auth.email,
                          },
                          first_name: first_name || null,
                          last_name: last_name || null,
                          middle_name,
                          university: applicantDraft.university.trim() || null,
                          graduation_year,
                          about:
                            [
                              applicantDraft.skills,
                              applicantDraft.projectsExperience,
                              applicantDraft.repoLinks,
                            ]
                              .filter(Boolean)
                              .join('\n\n') || null,
                        });
                      }
                    }}
                  >
                    Сохранить профиль
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-favorite" />
                    <div>
                      <h2 className="text-lg font-bold text-text">Вакансии и мероприятия</h2>
                      <p className="mt-1 text-sm text-text-secondary">
                        То, на что ты откликнулся или планируешь откликнуться: избранные вакансии. Каталог
                        мероприятий подключим отдельно.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/favorites"
                    className="shrink-0 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    Все избранные
                  </Link>
                </div>
                {favoriteOpportunities.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-border/80 bg-background/50 px-4 py-8 text-center text-sm text-text-secondary">
                    Пока нет избранных вакансий. Добавь позиции в каталоге — они появятся здесь.
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {favoriteOpportunities.map((job) => (
                      <li key={job.id}>
                        <Link
                          to={`/opportunities/${job.id}`}
                          className="flex flex-col gap-1 rounded-xl border border-border/80 bg-surface px-4 py-3 transition-colors hover:border-primary/40"
                        >
                          <span className="font-semibold text-text">{job.title}</span>
                          <span className="text-sm text-text-secondary">
                            {getCompanyLabel(job.company_id)} · {formatOpportunitySalary(job)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-border/80 bg-background/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-accent" />
                    <div>
                      <h2 className="text-lg font-bold text-text">История откликов</h2>
                      <p className="mt-1 text-sm text-text-secondary">
                        Статусы отправленных откликов на вакансии.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/applications"
                    className="shrink-0 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                  >
                    Все отклики
                  </Link>
                </div>
                {responsesWithJobs.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-border/80 bg-background/50 px-4 py-8 text-center text-sm text-text-secondary">
                    Откликов пока нет.
                  </div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {responsesWithJobs.map(({ response, opportunity }) => {
                      const statusMeta = RESPONSE_STATUS_META[response.status];
                      return (
                        <li key={response.id}>
                          <article className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border/80 bg-surface px-4 py-3">
                            <div className="min-w-0">
                              <Link
                                to={`/opportunities/${opportunity.id}`}
                                className="font-semibold text-text transition-colors hover:text-primary"
                              >
                                {opportunity.title}
                              </Link>
                              <p className="mt-1 text-sm text-text-secondary">
                                {getCompanyLabel(opportunity.company_id)} · отклик{' '}
                                {response.appliedAt}
                              </p>
                              {response.note ? (
                                <p className="mt-1 text-xs text-text-secondary">{response.note}</p>
                              ) : null}
                            </div>
                            <span
                              className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
                            >
                              {statusMeta.label}
                            </span>
                          </article>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap gap-2 rounded-2xl border border-border/80 bg-background/40 p-4">
                <Link to="/opportunities" className={linkCardClass}>
                  <Briefcase className="h-5 w-5 text-primary" />
                  Каталог вакансий
                </Link>
                <Link to="/map" className={linkCardClass}>
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                  Карта
                </Link>
              </div>
            </div>
          ) : (
            <EmployerCabinet auth={auth} />
          )}
        </section>
      </main>
    </>
  );
};
