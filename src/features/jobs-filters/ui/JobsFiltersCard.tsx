import { Filter } from 'lucide-react';
import {
  getEmploymentLabel,
  getLevelLabel,
  getOpportunityTypeLabel,
  getWorkFormatLabel,
} from '@shared/lib/opportunityDisplay';
import {
  FILTER_EMPLOYMENT_LEVELS,
  FILTER_INPUT_CLASS,
  FILTER_LABEL_CLASS,
  FILTER_LEVELS,
  FILTER_OPPORTUNITY_TYPES,
  FILTER_WORK_FORMATS,
} from '@shared/config/jobsFilters';
import { sanitizeNumericInput } from '@shared/lib/jobsFilters';
import { FilterDropdown } from './FilterDropdown';

type JobsFiltersCardProps = {
  skillsQuery: string;
  salaryFrom: string;
  salaryTo: string;
  selectedWorkFormat: (typeof FILTER_WORK_FORMATS)[number];
  selectedOpportunityType: (typeof FILTER_OPPORTUNITY_TYPES)[number];
  selectedLevel: (typeof FILTER_LEVELS)[number];
  selectedEmploymentLevel: (typeof FILTER_EMPLOYMENT_LEVELS)[number];
  onSkillsChange: (value: string) => void;
  onSalaryFromChange: (value: string) => void;
  onSalaryToChange: (value: string) => void;
  onWorkFormatChange: (value: (typeof FILTER_WORK_FORMATS)[number]) => void;
  onOpportunityTypeChange: (value: (typeof FILTER_OPPORTUNITY_TYPES)[number]) => void;
  onLevelChange: (value: (typeof FILTER_LEVELS)[number]) => void;
  onEmploymentLevelChange: (value: (typeof FILTER_EMPLOYMENT_LEVELS)[number]) => void;
  sticky?: boolean;
};

export const JobsFiltersCard = ({
  skillsQuery,
  salaryFrom,
  salaryTo,
  selectedWorkFormat,
  selectedOpportunityType,
  selectedLevel,
  selectedEmploymentLevel,
  onSkillsChange,
  onSalaryFromChange,
  onSalaryToChange,
  onWorkFormatChange,
  onOpportunityTypeChange,
  onLevelChange,
  onEmploymentLevelChange,
  sticky = true,
}: JobsFiltersCardProps) => {
  return (
    <div
      className={`rounded-2xl border border-border/80 bg-surface/95 p-4 shadow-sm ${
        sticky ? 'lg:sticky lg:top-24' : ''
      }`}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Filter className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-text">Фильтры</p>
        </div>
      </div>
      <div className="space-y-3.5">
        <label className="block">
          <span className={FILTER_LABEL_CLASS}>Навыки</span>
          <input
            value={skillsQuery}
            onChange={(event) => onSkillsChange(event.target.value)}
            placeholder="React, TypeScript"
            className={FILTER_INPUT_CLASS}
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className={FILTER_LABEL_CLASS}>ЗП от</span>
            <input
              value={salaryFrom}
              onChange={(event) => onSalaryFromChange(sanitizeNumericInput(event.target.value))}
              placeholder="100000"
              className={FILTER_INPUT_CLASS}
            />
          </label>
          <label className="block">
            <span className={FILTER_LABEL_CLASS}>ЗП до</span>
            <input
              value={salaryTo}
              onChange={(event) => onSalaryToChange(sanitizeNumericInput(event.target.value))}
              placeholder="300000"
              className={FILTER_INPUT_CLASS}
            />
          </label>
        </div>

        <FilterDropdown
          label="Формат работы"
          value={selectedWorkFormat}
          options={FILTER_WORK_FORMATS}
          onSelect={(value) => onWorkFormatChange(value as (typeof FILTER_WORK_FORMATS)[number])}
          formatOption={(value) => (value === 'Все' ? value : getWorkFormatLabel(value))}
        />

        <FilterDropdown
          label="Тип возможности"
          value={selectedOpportunityType}
          options={FILTER_OPPORTUNITY_TYPES}
          onSelect={(value) =>
            onOpportunityTypeChange(value as (typeof FILTER_OPPORTUNITY_TYPES)[number])
          }
          formatOption={(value) => (value === 'Все' ? value : getOpportunityTypeLabel(value))}
        />

        <FilterDropdown
          label="Уровень"
          value={selectedLevel}
          options={FILTER_LEVELS}
          onSelect={(value) => onLevelChange(value as (typeof FILTER_LEVELS)[number])}
          formatOption={(value) => (value === 'Все' ? value : getLevelLabel(value))}
        />

        <FilterDropdown
          label="Уровень занятости"
          value={selectedEmploymentLevel}
          options={FILTER_EMPLOYMENT_LEVELS}
          onSelect={(value) =>
            onEmploymentLevelChange(value as (typeof FILTER_EMPLOYMENT_LEVELS)[number])
          }
          formatOption={(value) => (value === 'Все' ? value : getEmploymentLabel(value))}
        />
      </div>
    </div>
  );
};
