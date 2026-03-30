import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@app/providers';
import { resolveOpportunityActorIds } from '@shared/config/opportunities';
import { isBackendAuthEnabled } from '@shared/config/features';
import { EMPLOYER_DECISION_META } from '@shared/config/employerApplicationsMock';
import {
  EMPLOYER_APPLICATIONS_CHANGED_EVENT,
  getEmployerApplications,
  setEmployerApplicationStatus,
  type EmployerApplicationsBase,
} from '@shared/lib/employerApplicationsStorage';
import { useEmployerApplicationsBase } from '@shared/lib/useEmployerApplicationsBase';
import { Header } from '@shared/ui/Header';
import { type AuthSession } from '@shared/types/auth';
import { type EmployerDecisionStatus } from '@shared/types/employerApplication';
import { Users } from 'lucide-react';

export const ApplicantsPage = () => {
  const auth = useAuth().session as AuthSession;
  const { companyId } = resolveOpportunityActorIds(auth);
  const useBackend =
    isBackendAuthEnabled() && auth.role === 'company' && Boolean(auth.accessToken);

  const { loading: apiLoading, rows: apiRows } = useEmployerApplicationsBase({
    enabled: useBackend,
    companyId,
  });

  const employerBase: EmployerApplicationsBase = useMemo(() => {
    if (!useBackend) {
      return 'mock';
    }
    if (apiLoading || apiRows === null) {
      return 'loading';
    }
    return apiRows;
  }, [useBackend, apiLoading, apiRows]);

  const [listVersion, setListVersion] = useState(0);

  useEffect(() => {
    const bump = () => setListVersion((v) => v + 1);
    window.addEventListener(EMPLOYER_APPLICATIONS_CHANGED_EVENT, bump);
    return () => window.removeEventListener(EMPLOYER_APPLICATIONS_CHANGED_EVENT, bump);
  }, []);

  const rows = useMemo(
    () => getEmployerApplications(companyId, employerBase),
    [companyId, employerBase, listVersion],
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployerDecisionStatus | ''>('');
  const [opportunityFilter, setOpportunityFilter] = useState('');

  const opportunityOptions = useMemo(() => {
    const titles = [...new Set(rows.map((r) => r.opportunityTitle))];
    return titles.sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const statusOk = !statusFilter || row.employerStatus === statusFilter;
      const oppOk = !opportunityFilter || row.opportunityTitle === opportunityFilter;
      const searchOk =
        !q ||
        row.applicantDisplayName.toLowerCase().includes(q) ||
        row.opportunityTitle.toLowerCase().includes(q);
      return statusOk && oppOk && searchOk;
    });
  }, [rows, search, statusFilter, opportunityFilter]);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1100px] px-5 py-6 md:px-8">
        <section className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text">Откликнувшиеся соискатели</h1>
              <p className="text-sm text-text-secondary">
                {useBackend
                  ? 'Заявки с API; смена статуса пока только локально (на бэке нет PUT для заявки).'
                  : 'Демо-данные и статусы работодателя. Профиль кандидата — из локального черновика.'}
              </p>
            </div>
          </div>

          {useBackend && apiLoading ? (
            <p className="mb-4 text-sm text-text-secondary">Загружаем заявки…</p>
          ) : null}

          <div className="mb-4 flex flex-wrap gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по ФИО или вакансии"
              className="min-w-[220px] flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EmployerDecisionStatus | '')}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Все статусы</option>
              {(Object.keys(EMPLOYER_DECISION_META) as EmployerDecisionStatus[]).map((s) => (
                <option key={s} value={s}>
                  {EMPLOYER_DECISION_META[s].label}
                </option>
              ))}
            </select>
            <select
              value={opportunityFilter}
              onChange={(e) => setOpportunityFilter(e.target.value)}
              className="min-w-[200px] rounded-xl border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Все возможности</option>
              {opportunityOptions.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/80 bg-background/50 py-10 text-center text-sm text-text-secondary">
              Нет записей по фильтрам.
            </p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((row) => {
                const meta = EMPLOYER_DECISION_META[row.employerStatus];
                return (
                  <li key={row.id}>
                    <article className="rounded-2xl border border-border/80 bg-background/40 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold text-text">{row.applicantDisplayName}</p>
                          <p className="text-sm text-text-secondary">{row.opportunityTitle}</p>
                          <p className="text-xs text-text-secondary">Отклик: {row.appliedAt}</p>
                          <Link
                            to={`/applicants/candidate/${row.applicantUserId}`}
                            className="mt-2 inline-block text-sm font-semibold text-primary"
                          >
                            Открыть профиль
                          </Link>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex justify-center rounded-full border px-3 py-1 text-xs font-semibold ${meta.badgeClassName}`}
                          >
                            {meta.label}
                          </span>
                          <label className="text-xs font-semibold text-text-secondary">
                            Статус
                            <select
                              value={row.employerStatus}
                              onChange={(e) => {
                                const next = e.target.value as EmployerDecisionStatus;
                                setEmployerApplicationStatus(companyId, row.id, next);
                              }}
                              className="mt-1 block w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-text"
                            >
                              {(Object.keys(EMPLOYER_DECISION_META) as EmployerDecisionStatus[]).map(
                                (s) => (
                                  <option key={s} value={s}>
                                    {EMPLOYER_DECISION_META[s].label}
                                  </option>
                                ),
                              )}
                            </select>
                          </label>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </>
  );
};
