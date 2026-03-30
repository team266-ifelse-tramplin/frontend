import { type NavItem } from '@shared/types/nav';

export const GUEST_NAV_ITEMS: readonly NavItem[] = [
    { to: '/opportunities', label: 'Вакансии' },
    { to: '/map', label: 'Карта' },
];

export const CANDIDATE_NAV_ITEMS: readonly NavItem[] = [
    ...GUEST_NAV_ITEMS,
    { to: '/applications', label: 'Отклики' },
];

export const COMPANY_NAV_ITEMS: readonly NavItem[] = [
    { to: '/my-opportunities', label: 'Мои вакансии' },
    { to: '/opportunities/create', label: 'Создать' },
    { to: '/applicants', label: 'Соискатели' },
];