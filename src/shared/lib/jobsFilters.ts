import { type JobsFilterValues } from '@shared/types/jobsFilters';

type FilterableJob = {
  title: string;
  company_id: string;
  tags_data: Array<{ name: string }>;
  work_format: string;
  opportunity_type: string;
  level: string;
  employment: string;
  salary_from: number;
  salary_to: number;
};

export const sanitizeNumericInput = (value: string) => value.replace(/[^\d]/g, '');

export const toSalaryBadge = (salaryFrom: number, salaryTo: number, currency: string) => {
  const symbol = currency.toUpperCase();
  return `${Math.round(salaryFrom / 1000)}-${Math.round(salaryTo / 1000)}k ${symbol}`;
};

export const filterJobs = <T extends FilterableJob>(jobs: T[], filters: JobsFilterValues): T[] => {
  const search = filters.searchQuery.trim().toLowerCase();
  const skillTokens = filters.skillsQuery
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  const salaryFromValue = Number(filters.salaryFrom) || 0;
  const salaryToValue = Number(filters.salaryTo) || 0;

  const normalizedEmployment = filters.selectedEmploymentLevel === 'part' ? 'partial' : filters.selectedEmploymentLevel;

  return jobs.filter((job) => {
    const salaryAsNumber = job.salary_from;
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search) ||
      job.company_id.toLowerCase().includes(search) ||
      job.tags_data.some((tag) => tag.name.toLowerCase().includes(search));

    const matchesSkills =
      skillTokens.length === 0 ||
      skillTokens.every((skill) =>
        job.tags_data.some((tag) => tag.name.toLowerCase().includes(skill)),
      );

    const matchesFormat =
      filters.selectedWorkFormat === 'Все' || job.work_format === filters.selectedWorkFormat;
    const matchesOpportunity =
      filters.selectedOpportunityType === 'Все' ||
      job.opportunity_type === filters.selectedOpportunityType;
    const matchesLevel = filters.selectedLevel === 'Все' || job.level === filters.selectedLevel;
    const matchesEmployment =
      filters.selectedEmploymentLevel === 'Все' || job.employment === normalizedEmployment;
    const matchesSalaryFrom = !salaryFromValue || salaryAsNumber >= salaryFromValue;
    const matchesSalaryTo = !salaryToValue || job.salary_to <= salaryToValue;

    return (
      matchesSearch &&
      matchesSkills &&
      matchesFormat &&
      matchesOpportunity &&
      matchesLevel &&
      matchesEmployment &&
      matchesSalaryFrom &&
      matchesSalaryTo
    );
  });
};
