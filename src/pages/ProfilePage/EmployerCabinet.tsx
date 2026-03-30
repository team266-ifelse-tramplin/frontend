import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  OpportunityCreateForm,
  useOpportunitiesList,
  type Opportunity,
} from '@entities/Opportunity';
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
import { usersApi } from '@shared/api/usersApi';
import { getCompanyOpportunityTab, type CompanyOpportunityTabKey } from '@shared/lib/companyOpportunityTab';
import {
  readCompanyProfileDraft,
  writeCompanyProfileDraft,
} from '@shared/lib/profileDraftStorage';
import { Button } from '@shared/ui/Button';
import { type AuthSession } from '@shared/types/auth';
import { type EmployerDecisionStatus } from '@shared/types/employerApplication';
import { Building2, Briefcase, ExternalLink, FileText, Users } from 'lucide-react';

const sectionTitleClass = 'text-xs font-semibold uppercase tracking-wide text-text-secondary';

const tabLabels: Record<CompanyOpportunityTabKey, string> = {
  active: 'Активные',
  closed: 'Закрытые',
  scheduled: 'Запланированные',
};

type EmployerCabinetProps = {
  auth: AuthSession;
};

export const EmployerCabinet = ({ auth }: EmployerCabinetProps) => {
  const { companyId } = resolveOpportunityActorIds(auth);
  const useBackend =
    isBackendAuthEnabled() && auth.role === 'company' && Boolean(auth.accessToken);

  const { loading: apiAppsLoading, rows: apiAppRows } = useEmployerApplicationsBase({
    enabled: useBackend,
    companyId,
  });

  const employerBase: EmployerApplicationsBase = useMemo(() => {
    if (!useBackend) {
      return 'mock';
    }
    if (apiAppsLoading || apiAppRows === null) {
      return 'loading';
    }
    return apiAppRows;
  }, [useBackend, apiAppsLoading, apiAppRows]);

  const [appListVersion, setAppListVersion] = useState(0);

  useEffect(() => {
    const bump = () => setAppListVersion((v) => v + 1);
    window.addEventListener(EMPLOYER_APPLICATIONS_CHANGED_EVENT, bump);
    return () => window.removeEventListener(EMPLOYER_APPLICATIONS_CHANGED_EVENT, bump);
  }, []);
  const [companyDraft, setCompanyDraft] = useState(() => readCompanyProfileDraft(companyId));
  const [listRefreshNonce, setListRefreshNonce] = useState(0);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [oppTab, setOppTab] = useState<CompanyOpportunityTabKey>('active');
  const [oppSearch, setOppSearch] = useState('');
  const [oppType, setOppType] = useState<string>('');
  const { data, loading, error } = useOpportunitiesList({}, listRefreshNonce);

  const myOpportunities = useMemo(
    () => data.filter((o) => o.company_id === companyId),
    [data, companyId],
  );

  const tabbedOpportunities = useMemo(() => {
    return myOpportunities.filter((o) => getCompanyOpportunityTab(o) === oppTab);
  }, [myOpportunities, oppTab]);

  const filteredOpportunities = useMemo(() => {
    const q = oppSearch.trim().toLowerCase();
    return tabbedOpportunities.filter((o) => {
      const typeOk = !oppType || o.opportunity_type === oppType;
      const searchOk = !q || o.title.toLowerCase().includes(q);
      return typeOk && searchOk;
    });
  }, [tabbedOpportunities, oppSearch, oppType]);

  const tabCounts = useMemo(() => {
    const counts: Record<CompanyOpportunityTabKey, number> = {
      active: 0,
      closed: 0,
      scheduled: 0,
    };
    for (const o of myOpportunities) {
      counts[getCompanyOpportunityTab(o)] += 1;
    }
    return counts;
  }, [myOpportunities]);

  const applications = useMemo(
    () => getEmployerApplications(companyId, employerBase),
    [companyId, employerBase, appListVersion],
  );
  const [appSearch, setAppSearch] = useState('');
  const [appStatus, setAppStatus] = useState<EmployerDecisionStatus | ''>('');

  const filteredApplications = useMemo(() => {
    const q = appSearch.trim().toLowerCase();
    return applications.filter((row) => {
      const statusOk = !appStatus || row.employerStatus === appStatus;
      const searchOk =
        !q ||
        row.applicantDisplayName.toLowerCase().includes(q) ||
        row.opportunityTitle.toLowerCase().includes(q);
      return statusOk && searchOk;
    });
  }, [applications, appSearch, appStatus]);

  const recentApplications = useMemo(() => filteredApplications.slice(0, 5), [filteredApplications]);

  const socialLines = companyDraft.socialLinks
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-2xl border border-border/80 bg-background/40 p-5">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-text">О компании</h2>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
          Наименование, описание, сфера, контакты в сети. Загрузка фото офиса и видео на CDN — отдельная
          интеграция; пока достаточно URL.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block text-sm">
            <span className={sectionTitleClass}>Наименование</span>
            <input
              type="text"
              value={companyDraft.companyName || auth.login || auth.email}
              onChange={(e) => setCompanyDraft((d) => ({ ...d, companyName: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className={sectionTitleClass}>Сфера деятельности</span>
            <input
              type="text"
              value={companyDraft.industry}
              onChange={(e) => setCompanyDraft((d) => ({ ...d, industry: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none focus:border-primary"
              placeholder="IT, образование, …"
            />
          </label>
          <label className="block text-sm lg:col-span-2">
            <span className={sectionTitleClass}>Краткое описание</span>
            <textarea
              value={companyDraft.about}
              onChange={(e) => setCompanyDraft((d) => ({ ...d, about: e.target.value }))}
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-text outline-none focus:border-primary"
            />
          </label>
            <label className="block text-sm">
            <span className={sectionTitleClass}>Сайт</span>
            <input
              type="url"
              value={companyDraft.website}
              onChange={(e) => setCompanyDraft((d) => ({ ...d, website: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none focus:border-primary"
              placeholder="https://"
            />
            {companyDraft.website ? (
              <a
                href={companyDraft.website}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                Открыть сайт <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </label>
          <label className="block text-sm lg:col-span-2">
            <span className={sectionTitleClass}>Соцсети (по одной ссылке на строку)</span>
            <textarea
              value={companyDraft.socialLinks}
              onChange={(e) => setCompanyDraft((d) => ({ ...d, socialLinks: e.target.value }))}
              rows={3}
              className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm text-text outline-none focus:border-primary"
            />
            {socialLines.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {socialLines.map((url) => (
                  <li key={url}>
                    <a
                      href={url.startsWith('http') ? url : `https://${url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sm text-primary"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </label>
          <label className="block text-sm">
            <span className={sectionTitleClass}>Фото офиса (URL)</span>
            <input
              type="url"
              value={companyDraft.officePhotoUrl}
              onChange={(e) => setCompanyDraft((d) => ({ ...d, officePhotoUrl: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none focus:border-primary"
            />
          </label>
          <label className="block text-sm">
            <span className={sectionTitleClass}>Видеопрезентация (URL)</span>
            <input
              type="url"
              value={companyDraft.videoPresentationUrl}
              onChange={(e) => setCompanyDraft((d) => ({ ...d, videoPresentationUrl: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-text outline-none focus:border-primary"
            />
          </label>
        </div>
        {(companyDraft.officePhotoUrl || companyDraft.videoPresentationUrl) && (
          <div className="mt-4 flex flex-wrap gap-4">
            {companyDraft.officePhotoUrl ? (
              <div className="overflow-hidden rounded-xl border border-border">
                <img
                  src={companyDraft.officePhotoUrl}
                  alt="Офис"
                  className="h-36 max-w-xs object-cover"
                />
              </div>
            ) : null}
            {companyDraft.videoPresentationUrl ? (
              <a
                href={companyDraft.videoPresentationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
              >
                <ExternalLink className="h-4 w-4" />
                Открыть видео
              </a>
            ) : null}
          </div>
        )}
        <p className="mt-3 font-mono text-xs text-text-secondary">ID компании: {companyId}</p>
        <div className="mt-4">
          <p className={sectionTitleClass}>Email аккаунта</p>
          <p className="mt-1 text-sm font-medium text-text">{auth.email}</p>
        </div>
        <Button
          type="button"
          className="mt-4"
          onClick={() => {
            const name = companyDraft.companyName.trim() || auth.login || auth.email;
            writeCompanyProfileDraft(companyId, { ...companyDraft, companyName: name });
            if (isBackendAuthEnabled() && auth.accessToken) {
              void usersApi.editEmployer(auth.userId, {
                user: { display_name: name },
                company_id: companyId,
              });
            }
          }}
        >
          Сохранить профиль компании
        </Button>
      </div>

      <div className="rounded-2xl border border-border/80 bg-background/40 p-5">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-text">Новая возможность</h2>
        </div>
        <p className="mb-4 text-sm text-text-secondary">
          Те же поля, что и при создании карточки на отдельной странице. После сохранения список ниже
          обновится.
        </p>
        {createSuccess ? (
          <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-800">
            {createSuccess}
          </p>
        ) : null}
        <OpportunityCreateForm
          embedded
          onSuccess={(createdId) => {
            setListRefreshNonce((n) => n + 1);
            setCreateSuccess(
              createdId
                ? `Создано. Можно открыть карточку: ${createdId.slice(0, 8)}…`
                : 'Возможность создана.',
            );
            window.setTimeout(() => setCreateSuccess(null), 6000);
          }}
        />
      </div>

      <div className="rounded-2xl border border-border/80 bg-background/40 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-text">Мои возможности</h2>
          </div>
          <Link
            to="/my-opportunities"
            className="text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Полный список и удаление
          </Link>
        </div>
        <p className="mb-3 text-xs text-text-secondary">
          Запланированные: дата публикации позже сегодняшнего дня. Закрытые: статус closed в данных API.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {(Object.keys(tabLabels) as CompanyOpportunityTabKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setOppTab(key)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                oppTab === key
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-border text-text-secondary hover:border-primary/40'
              }`}
            >
              {tabLabels[key]} ({tabCounts[key]})
            </button>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="search"
            value={oppSearch}
            onChange={(e) => setOppSearch(e.target.value)}
            placeholder="Поиск по названию"
            className="min-w-[200px] flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          />
          <select
            value={oppType}
            onChange={(e) => setOppType(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-text"
          >
            <option value="">Все типы</option>
            <option value="vacancy">vacancy</option>
            <option value="internship">internship</option>
            <option value="mentoring">mentoring</option>
            <option value="event">event</option>
          </select>
        </div>
        {loading ? <p className="text-sm text-text-secondary">Загрузка…</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {filteredOpportunities.length === 0 && !loading ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-background/50 px-4 py-8 text-center text-sm text-text-secondary">
            Нет позиций в этой вкладке с учётом фильтров.
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredOpportunities.map((job) => (
              <EmployerOpportunityRow key={job.id} job={job} />
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border/80 bg-background/40 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-text">Отклики</h2>
              <p className="text-sm text-text-secondary">
                {useBackend ? 'Заявки с API; статусы — локально до ручки на бэке.' : 'Последние заявки по демо-данным.'}
              </p>
            </div>
          </div>
          <Link
            to="/applicants"
            className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            Все соискатели
          </Link>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <input
            type="search"
            value={appSearch}
            onChange={(e) => setAppSearch(e.target.value)}
            placeholder="Поиск по ФИО или вакансии"
            className="min-w-[180px] flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <select
            value={appStatus}
            onChange={(e) => setAppStatus(e.target.value as EmployerDecisionStatus | '')}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Все статусы</option>
            {(Object.keys(EMPLOYER_DECISION_META) as EmployerDecisionStatus[]).map((s) => (
              <option key={s} value={s}>
                {EMPLOYER_DECISION_META[s].label}
              </option>
            ))}
          </select>
        </div>
        <p className="mb-2 text-xs text-text-secondary">
          Показаны первые 5 записей с учётом фильтра. Полный список — в разделе соискателей.
        </p>
        {useBackend && apiAppsLoading ? (
          <p className="mb-2 text-sm text-text-secondary">Загружаем заявки…</p>
        ) : null}
        <ul className="space-y-2">
          {recentApplications.map((row) => {
            const meta = EMPLOYER_DECISION_META[row.employerStatus];
            return (
              <li key={row.id}>
                <article className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-border/80 bg-surface px-3 py-2">
                  <div className="min-w-0">
                    <p className="font-medium text-text">{row.applicantDisplayName}</p>
                    <p className="text-xs text-text-secondary">{row.opportunityTitle}</p>
                    <p className="text-xs text-text-secondary">{row.appliedAt}</p>
                    <Link
                      to={`/applicants/candidate/${row.applicantUserId}`}
                      className="mt-1 inline-block text-xs font-semibold text-primary"
                    >
                      Профиль
                    </Link>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold ${meta.badgeClassName}`}
                    >
                      {meta.label}
                    </span>
                    <select
                      value={row.employerStatus}
                      onChange={(e) => {
                        const next = e.target.value as EmployerDecisionStatus;
                        setEmployerApplicationStatus(companyId, row.id, next);
                      }}
                      className="max-w-[9rem] rounded-lg border border-border bg-background px-1.5 py-1 text-xs text-text"
                    >
                      {(Object.keys(EMPLOYER_DECISION_META) as EmployerDecisionStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {EMPLOYER_DECISION_META[s].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const EmployerOpportunityRow = ({ job }: { job: Opportunity }) => {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/80 bg-surface px-4 py-3">
      <div className="min-w-0">
        <Link
          to={`/opportunities/${job.id}`}
          className="font-semibold text-text hover:text-primary"
        >
          {job.title}
        </Link>
        <p className="text-xs text-text-secondary">
          {job.opportunity_type} · публ. {job.publication_date.slice(0, 10)} · {job.status}
        </p>
      </div>
      <Link
        to={`/opportunities/${job.id}/edit`}
        className="shrink-0 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
      >
        Редактировать
      </Link>
    </li>
  );
};
