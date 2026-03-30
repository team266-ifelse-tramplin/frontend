import { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, Clock3, Filter, Heart, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mapUiFiltersToBackend, useOpportunitiesList } from '@entities/Opportunity';
import { JobsFiltersCard } from '@features/jobs-filters';
import { JobsMapSurface } from '@features/jobs-map-card';
import { JobsSearch } from '@features/jobs-search';
import {
  FILTER_EMPLOYMENT_LEVELS,
  FILTER_LEVELS,
  FILTER_OPPORTUNITY_TYPES,
  FILTER_WORK_FORMATS,
} from '@shared/config/jobsFilters';
import { filterJobs } from '@shared/lib/jobsFilters';
import {
  formatOpportunitySalary,
  getCompanyLabel,
  getEmploymentLabel,
  getLevelLabel,
  getOpportunityTagNames,
  getWorkFormatLabel,
} from '@shared/lib/opportunityDisplay';
import { useCloseOnOutsideClick } from '@shared/lib/useCloseOnOutsideClick';
import { useFavoriteIds } from '@shared/lib/useFavoriteIds';
import { Header } from '@shared/ui/Header';

export const MapPage = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { favoriteIds, toggleFavorite } = useFavoriteIds();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [skillsQuery, setSkillsQuery] = useState('');
  const [selectedWorkFormat, setSelectedWorkFormat] =
    useState<(typeof FILTER_WORK_FORMATS)[number]>('Все');
  const [selectedOpportunityType, setSelectedOpportunityType] =
    useState<(typeof FILTER_OPPORTUNITY_TYPES)[number]>('Все');
  const [selectedLevel, setSelectedLevel] = useState<(typeof FILTER_LEVELS)[number]>('Все');
  const [selectedEmploymentLevel, setSelectedEmploymentLevel] =
    useState<(typeof FILTER_EMPLOYMENT_LEVELS)[number]>('Все');
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const applySearch = () => setSearchQuery(searchInputValue);
  const serverFilters = useMemo(
    () =>
      mapUiFiltersToBackend({
        selectedWorkFormat,
        selectedOpportunityType,
        selectedLevel,
        selectedEmploymentLevel,
        salaryFrom,
        salaryTo,
      }),
    [
      selectedWorkFormat,
      selectedOpportunityType,
      selectedLevel,
      selectedEmploymentLevel,
      salaryFrom,
      salaryTo,
    ],
  );
  const { data: backendJobs, total, loading, error } = useOpportunitiesList(serverFilters);

  useCloseOnOutsideClick({
    ref: filtersRef,
    isOpen: isFiltersOpen,
    onClose: () => setIsFiltersOpen(false),
  });

  const filteredJobs = useMemo(() => {
    return filterJobs(backendJobs, {
      searchQuery,
      skillsQuery,
      selectedWorkFormat,
      selectedOpportunityType,
      selectedLevel,
      selectedEmploymentLevel,
      salaryFrom,
      salaryTo,
    });
  }, [backendJobs, searchQuery, skillsQuery, selectedWorkFormat, selectedOpportunityType, selectedLevel, selectedEmploymentLevel, salaryFrom, salaryTo]);
  const activeFiltersCount = useMemo(() => {
    return [
      skillsQuery.trim().length > 0,
      salaryFrom.length > 0,
      salaryTo.length > 0,
      selectedWorkFormat !== 'Все',
      selectedOpportunityType !== 'Все',
      selectedLevel !== 'Все',
      selectedEmploymentLevel !== 'Все',
    ].filter(Boolean).length;
  }, [
    skillsQuery,
    salaryFrom,
    salaryTo,
    selectedWorkFormat,
    selectedOpportunityType,
    selectedLevel,
    selectedEmploymentLevel,
  ]);
  const selectedOpportunity = useMemo(
    () => filteredJobs.find((job) => job.id === selectedJobId) ?? null,
    [filteredJobs, selectedJobId],
  );
  const opportunitiesAtSelectedPoint = useMemo(() => {
    if (!selectedOpportunity) {
      return [];
    }

    return filteredJobs.filter(
      (job) =>
        job.latitude === selectedOpportunity.latitude && job.longitude === selectedOpportunity.longitude,
    );
  }, [filteredJobs, selectedOpportunity]);

  useEffect(() => {
    if (selectedJobId !== null && !selectedOpportunity) {
      setSelectedJobId(null);
    }
  }, [selectedJobId, selectedOpportunity]);

  return (
    <>
      <Header />
      <main className="mx-auto flex h-[calc(100vh-72px)] w-full max-w-[1760px] flex-col px-5 py-4 md:px-8">
        <JobsSearch
          searchInputValue={searchInputValue}
          selectedWorkFormat={selectedWorkFormat}
          onSearchInputChange={setSearchInputValue}
          onSubmit={applySearch}
          onQuickFormatToggle={(format) =>
            setSelectedWorkFormat((prev) => (prev === format ? 'Все' : format))
          }
          containerClassName="rounded-xl border border-border bg-background/60 p-3 mb-4 shrink-0"
        />
        <div className="mb-3 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm text-text-secondary">
          {loading ? 'Загружаем вакансии с сервера...' : `Найдено на сервере: ${total}. После локальных фильтров: ${filteredJobs.length}.`}
          {error ? ` ${error}` : ''}
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm">
          <JobsMapSurface
            jobs={filteredJobs}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
            className="h-full w-full"
            showSalaryOnMarkers={false}
            useClusterer={false}
          />

          <button
            type="button"
            onClick={() => setIsFiltersOpen((prev) => !prev)}
            className="absolute left-4 top-4 z-30 inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-surface/95 px-3 py-2 text-sm font-semibold text-primary shadow-md transition-colors hover:bg-primary/10"
            aria-label={`Открыть фильтры. Активно: ${activeFiltersCount}`}
          >
            <Filter className="h-4 w-4" />
            <span className="inline-flex min-w-6 items-center justify-center rounded-md bg-primary/12 px-1.5 py-0.5 text-xs font-semibold leading-none text-primary">
              {activeFiltersCount}
            </span>
          </button>

          <div
            ref={filtersRef}
            className={`absolute left-4 top-16 z-30 w-[340px] max-w-[calc(100%-2rem)] transition-all duration-200 ${
              isFiltersOpen
                ? 'pointer-events-auto translate-x-0 opacity-100'
                : 'pointer-events-none -translate-x-4 opacity-0'
            }`}
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFiltersOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-surface/95 text-text-secondary transition-colors hover:bg-background hover:text-text"
                aria-label="Закрыть фильтры"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <JobsFiltersCard
              skillsQuery={skillsQuery}
              salaryFrom={salaryFrom}
              salaryTo={salaryTo}
              selectedWorkFormat={selectedWorkFormat}
              selectedOpportunityType={selectedOpportunityType}
              selectedLevel={selectedLevel}
              selectedEmploymentLevel={selectedEmploymentLevel}
              onSkillsChange={setSkillsQuery}
              onSalaryFromChange={setSalaryFrom}
              onSalaryToChange={setSalaryTo}
              onWorkFormatChange={setSelectedWorkFormat}
              onOpportunityTypeChange={setSelectedOpportunityType}
              onLevelChange={setSelectedLevel}
              onEmploymentLevelChange={setSelectedEmploymentLevel}
              sticky={false}
            />
          </div>

          {selectedOpportunity ? (
            opportunitiesAtSelectedPoint.length > 1 ? (
              <div className="absolute bottom-4 right-4 z-30 w-[460px] max-w-[calc(100%-2rem)] rounded-2xl border border-border/80 bg-surface/95 p-4 shadow-xl backdrop-blur">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text">
                      В этой точке: {opportunitiesAtSelectedPoint.length}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedJobId(null)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-surface text-text-secondary transition-colors hover:bg-background hover:text-text"
                    aria-label="Закрыть список вакансий"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
                  {opportunitiesAtSelectedPoint.map((opportunity) => (
                    <article
                      key={opportunity.id}
                      className={`rounded-xl border bg-surface p-4 transition-colors ${
                        selectedJobId === opportunity.id
                          ? 'border-primary ring-2 ring-primary/15'
                          : 'border-border/80 hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedJobId(opportunity.id)}
                          className="min-w-0 text-left"
                        >
                          <p className="line-clamp-2 text-base font-bold text-text">{opportunity.title}</p>
                          <p className="mt-1 text-xl font-extrabold text-primary">
                            {formatOpportunitySalary(opportunity)}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(opportunity.id)}
                          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                            favoriteIds.includes(opportunity.id)
                              ? 'border-favorite/40 bg-favorite/10 text-favorite'
                              : 'border-border/80 bg-surface text-text-secondary hover:text-favorite'
                          }`}
                          aria-label="Добавить в избранное"
                        >
                          <Heart
                            className={`h-4 w-4 ${favoriteIds.includes(opportunity.id) ? 'fill-current' : ''}`}
                          />
                        </button>
                      </div>
                      <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                        <Building2 className="h-4 w-4 text-accent" />
                        <span className="truncate">{getCompanyLabel(opportunity.company_id)}</span>
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="truncate">
                          {opportunity.location} · {getWorkFormatLabel(opportunity.work_format)}
                        </span>
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
                        <Clock3 className="h-4 w-4 text-accent" />
                        <span className="truncate">
                          {getEmploymentLabel(opportunity.employment)} · {getLevelLabel(opportunity.level)}
                        </span>
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{opportunity.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getOpportunityTagNames(opportunity).map((tag) => (
                          <span
                            key={`${opportunity.id}-${tag}`}
                            className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-semibold text-text-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Link to={`/opportunities/${opportunity.id}`} className="btn pri sm r-xl">
                          Откликнуться
                        </Link>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Link
                          to={`/opportunities/${opportunity.id}`}
                          className="text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                        >
                          Открыть вакансию
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="absolute bottom-4 right-4 z-30 w-[460px] max-w-[calc(100%-2rem)] rounded-2xl border border-border/80 bg-surface/95 p-4 shadow-xl backdrop-blur">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-base font-bold text-text">{selectedOpportunity.title}</p>
                    <p className="mt-1 text-xl font-extrabold text-primary">
                      {formatOpportunitySalary(selectedOpportunity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(selectedOpportunity.id)}
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        favoriteIds.includes(selectedOpportunity.id)
                          ? 'border-favorite/40 bg-favorite/10 text-favorite'
                          : 'border-border/80 bg-surface text-text-secondary hover:text-favorite'
                      }`}
                      aria-label="Добавить в избранное"
                    >
                      <Heart
                        className={`h-4 w-4 ${favoriteIds.includes(selectedOpportunity.id) ? 'fill-current' : ''}`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedJobId(null)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-surface text-text-secondary transition-colors hover:bg-background hover:text-text"
                      aria-label="Закрыть карточку вакансии"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="flex items-center gap-2 text-sm text-text-secondary">
                  <Building2 className="h-4 w-4 text-accent" />
                  <span className="truncate">{getCompanyLabel(selectedOpportunity.company_id)}</span>
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="truncate">
                    {selectedOpportunity.location} · {getWorkFormatLabel(selectedOpportunity.work_format)}
                  </span>
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
                  <Clock3 className="h-4 w-4 text-accent" />
                  <span className="truncate">
                    {getEmploymentLabel(selectedOpportunity.employment)} · {getLevelLabel(selectedOpportunity.level)}
                  </span>
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{selectedOpportunity.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {getOpportunityTagNames(selectedOpportunity).map((tag) => (
                    <span
                      key={`${selectedOpportunity.id}-${tag}`}
                      className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs font-semibold text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <Link
                    to={`/opportunities/${selectedOpportunity.id}`}
                    className="inline-flex items-center text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                  >
                    Открыть вакансию
                  </Link>
                  <Link to={`/opportunities/${selectedOpportunity.id}`} className="btn pri sm r-xl">
                    Откликнуться
                  </Link>
                </div>
              </div>
            )
          ) : null}
        </div>
      </main>
    </>
  );
};
