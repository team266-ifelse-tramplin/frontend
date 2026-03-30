import { type ResponseStatus, type UserResponse } from '@shared/types/response';

type ResponseStatusMeta = {
  label: string;
  badgeClassName: string;
};

export const RESPONSE_STATUS_META: Record<ResponseStatus, ResponseStatusMeta> = {
  pending: {
    label: 'Отправлен',
    badgeClassName: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  review: {
    label: 'На рассмотрении',
    badgeClassName: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  interview: {
    label: 'Интервью',
    badgeClassName: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  offer: {
    label: 'Оффер',
    badgeClassName: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Отказ',
    badgeClassName: 'bg-rose-100 text-rose-700 border-rose-200',
  },
};

export const USER_RESPONSES_MOCK: UserResponse[] = [
  {
    id: 1,
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0000',
    status: 'review',
    appliedAt: '12 мар',
    updatedAt: '13 мар',
  },
  {
    id: 2,
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0001',
    status: 'interview',
    appliedAt: '10 мар',
    updatedAt: '14 мар',
    note: 'Онлайн-интервью 16 марта',
  },
  {
    id: 3,
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0002',
    status: 'rejected',
    appliedAt: '08 мар',
    updatedAt: '11 мар',
  },
  {
    id: 4,
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0003',
    status: 'offer',
    appliedAt: '05 мар',
    updatedAt: '15 мар',
    note: 'Оффер до конца недели',
  },
  {
    id: 5,
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0006',
    status: 'pending',
    appliedAt: '14 мар',
    updatedAt: '14 мар',
  },
  {
    id: 6,
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0008',
    status: 'review',
    appliedAt: '13 мар',
    updatedAt: '15 мар',
  },
  {
    id: 7,
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0010',
    status: 'pending',
    appliedAt: '15 мар',
    updatedAt: '15 мар',
  },
  {
    id: 8,
    opportunityId: 'ba7e6b08-9fea-4dc4-937e-f731801e0011',
    status: 'interview',
    appliedAt: '09 мар',
    updatedAt: '12 мар',
    note: 'Техническая секция пройдена',
  },
];
