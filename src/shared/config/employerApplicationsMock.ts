import {
  type EmployerApplicationRow,
  type EmployerDecisionStatus,
} from '@shared/types/employerApplication';

export const EMPLOYER_DECISION_META: Record<
  EmployerDecisionStatus,
  { label: string; badgeClassName: string }
> = {
  pending: { label: 'На рассмотрении', badgeClassName: 'bg-slate-100 text-slate-700 border-slate-200' },
  accepted: { label: 'Принят', badgeClassName: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Отклонён', badgeClassName: 'bg-rose-100 text-rose-700 border-rose-200' },
  reserve: { label: 'В резерве', badgeClassName: 'bg-amber-100 text-amber-800 border-amber-200' },
};

export const EMPLOYER_APPLICATIONS_MOCK: EmployerApplicationRow[] = [
  {
    id: 'ea-1',
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0000',
    opportunityTitle: 'Frontend-разработчик (React)',
    applicantUserId: '32ce2307-c05a-4cd1-87d3-35048f529301',
    applicantDisplayName: 'Алексей Смирнов',
    appliedAt: '12 марта',
    employerStatus: 'pending',
  },
  {
    id: 'ea-2',
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0001',
    opportunityTitle: 'Аналитик данных',
    applicantUserId: '202a2cea-1ae6-4ce4-bc89-24fd667cdd90',
    applicantDisplayName: 'Мария Ким',
    appliedAt: '10 марта',
    employerStatus: 'pending',
  },
  {
    id: 'ea-3',
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0000',
    opportunityTitle: 'Frontend-разработчик (React)',
    applicantUserId: '93a98421-e3ab-4846-ba4f-c444b4bb30af',
    applicantDisplayName: 'Дмитрий Волков',
    appliedAt: '8 марта',
    employerStatus: 'reserve',
  },
];
