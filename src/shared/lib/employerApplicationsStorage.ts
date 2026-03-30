import { EMPLOYER_APPLICATIONS_MOCK } from '@shared/config/employerApplicationsMock';
import {
  type EmployerApplicationRow,
  type EmployerDecisionStatus,
} from '@shared/types/employerApplication';

export const EMPLOYER_APPLICATIONS_CHANGED_EVENT = 'employer-applications:changed';

const storageKey = (companyId: string) => `employer:app-status:${companyId}`;

type OverridesMap = Record<string, EmployerDecisionStatus>;

const readOverrides = (companyId: string): OverridesMap => {
  const raw = localStorage.getItem(storageKey(companyId));
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as OverridesMap;
  } catch {
    return {};
  }
};

export type EmployerApplicationsBase = 'mock' | 'loading' | EmployerApplicationRow[];

/** База: мок, пусто при загрузке API, или строки с бэка. Смена статуса работодателя — локальный override до PUT edit_application на бэке. */
export const getEmployerApplications = (
  companyId: string,
  base: EmployerApplicationsBase = 'mock',
): EmployerApplicationRow[] => {
  if (base === 'loading') {
    return [];
  }
  const source = base === 'mock' ? EMPLOYER_APPLICATIONS_MOCK : base;
  const overrides = readOverrides(companyId);
  return source.map((row) => ({
    ...row,
    employerStatus: overrides[row.id] ?? row.employerStatus,
  }));
};

export const setEmployerApplicationStatus = (
  companyId: string,
  applicationId: string,
  status: EmployerDecisionStatus,
) => {
  const overrides = readOverrides(companyId);
  overrides[applicationId] = status;
  localStorage.setItem(storageKey(companyId), JSON.stringify(overrides));
  window.dispatchEvent(new Event(EMPLOYER_APPLICATIONS_CHANGED_EVENT));
};
