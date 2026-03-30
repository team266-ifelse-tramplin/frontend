import { useMemo, useRef, useState } from 'react';
import {
  mapUiFiltersToBackend,
  useOpportunitiesList,
} from '@entities/Opportunity';
import {
  FILTER_EMPLOYMENT_LEVELS,
  FILTER_LEVELS,
  FILTER_OPPORTUNITY_TYPES,
  FILTER_WORK_FORMATS,
} from '@shared/config/jobsFilters';
import { filterJobs } from '@shared/lib/jobsFilters';
import { useFavoriteIds } from '@shared/lib/useFavoriteIds';
import { JobsFiltersCard } from '@features/jobs-filters';
import { JobsMapCard } from '@features/jobs-map-card';
import { JobsResultsList } from '@features/jobs-results-list';
import { JobsSearch } from '@features/jobs-search';

type JobsMapProps = {
  showMap?: boolean;
};

export const JobsMap = ({ showMap = true }: JobsMapProps) => {
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
  const mapSectionRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <div className="w-full space-y-3">
      <JobsSearch
        searchInputValue={searchInputValue}
        selectedWorkFormat={selectedWorkFormat}
        onSearchInputChange={setSearchInputValue}
        onSubmit={applySearch}
        onQuickFormatToggle={(format) =>
          setSelectedWorkFormat((prev) => (prev === format ? 'Все' : format))
        }
      />

      <div className="rounded-xl border border-border bg-background/60 px-3 py-2 text-sm text-text-secondary">
        {loading ? 'Загружаем вакансии с сервера...' : `Найдено на сервере: ${total}. Показано после локального поиска: ${filteredJobs.length}.`}
        {error ? ` ${error}` : ''}
      </div>

      <div
        className={`grid gap-4 ${
          showMap ? 'lg:grid-cols-[minmax(360px,30%)_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(320px,28%)_minmax(0,1fr)]'
        }`}
      >
        <aside className="space-y-3">
          {showMap ? (
            <JobsMapCard
              jobs={filteredJobs}
              selectedJobId={selectedJobId}
              mapSectionRef={mapSectionRef}
              onSelectJob={setSelectedJobId}
            />
          ) : null}

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
          />
        </aside>

        <JobsResultsList
          jobs={filteredJobs}
          selectedJobId={selectedJobId}
          favoriteIds={favoriteIds}
          onSelectJob={setSelectedJobId}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
};
