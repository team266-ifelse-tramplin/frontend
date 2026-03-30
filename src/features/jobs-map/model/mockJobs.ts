import {
  COMPANIES,
  DESCRIPTIONS,
  EMPLOYMENT_LEVELS,
  LEVELS,
  LOCATIONS,
  OPPORTUNITY_TYPES,
  SALARIES,
  TAGS_POOL,
  TITLES,
  WORK_FORMATS,
} from '@shared/config/jobsMockData';
import { MAP_BOUNDS } from '@shared/config/jobsMap';
import { generateMockMapPoints } from '@shared/lib/jobsMockFactory';
import { type JobPoint } from './types';

const COMPANY_IDS = [
  '777ee7d6-c91c-4e55-ae3d-03a03bb2a548',
  'f41a5d12-180f-4b5c-8fec-0b94776edc0a',
  '065f331a-5a03-4500-b1ca-81b24f12a334',
  '6f64a4d8-73b3-4877-8fe0-95cf57fcc65c',
  '87f841f0-a7bc-47f7-b8d8-8ba57dddc93a',
  '54fc94fe-f094-40cf-b8d4-4f75de7f4f0d',
  '2f8fd90b-fbb0-4deb-b7e3-f431afecf7bf',
  'dd4a10cd-f8db-4c76-9f89-af2fbe8bf5b4',
] as const;

const CREATED_BY = '03ecfd28-818e-4660-8568-86aea4c65160';

const toSalaryFrom = (salary: string) => Number(salary.replace(/[^\d]/g, ''));

const toDateString = (index: number) => {
  const day = 10 + (index % 18);
  const hour = 9 + (index % 8);
  return `2026-03-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:13`;
};

const withLocation = generateMockMapPoints(68, MAP_BOUNDS, (index) => ({
  title: TITLES[index % TITLES.length],
  description: DESCRIPTIONS[index % DESCRIPTIONS.length],
  location: LOCATIONS[index % LOCATIONS.length],
}));

export const MOCK_JOBS: JobPoint[] = withLocation.map((point, index) => {
  const salaryFrom = toSalaryFrom(SALARIES[index % SALARIES.length]);
  const publicationDate = toDateString(index);

  return {
    id: `ba7e6b08-9fea-4dc4-937e-f731801e${String(index).padStart(4, '0')}`,
    title: point.title,
    description: point.description,
    company_id: COMPANY_IDS[index % COMPANY_IDS.length],
    opportunity_type: OPPORTUNITY_TYPES[index % OPPORTUNITY_TYPES.length],
    work_format: WORK_FORMATS[index % WORK_FORMATS.length],
    employment: EMPLOYMENT_LEVELS[index % EMPLOYMENT_LEVELS.length],
    level: LEVELS[index % LEVELS.length],
    location: point.location,
    latitude: point.coordinates[0],
    longitude: point.coordinates[1],
    salary_from: salaryFrom,
    salary_to: salaryFrom + 70000,
    currency: 'rub',
    publication_date: publicationDate,
    expiration_date: publicationDate,
    event_date: publicationDate,
    contact_info: 'hr@company.test',
    status: 'active',
    created_by: CREATED_BY,
    views_count: (index + 1) * 5,
    created_at: publicationDate,
    updated_at: publicationDate,
    tags_data: [
      { name: TAGS_POOL[index % TAGS_POOL.length], category: 'skill' },
      { name: LEVELS[index % LEVELS.length], category: 'level' },
      { name: COMPANIES[index % COMPANIES.length], category: 'company' },
    ],
  };
}).map((job, index) => {
  // Intentional duplicates to test "multiple opportunities at same point" behavior on map.
  if (index >= 0 && index <= 3) {
    return { ...job, latitude: 55.751244, longitude: 37.618423 };
  }

  if (index >= 4 && index <= 6) {
    return { ...job, latitude: 55.761244, longitude: 37.608423 };
  }

  return job;
});
