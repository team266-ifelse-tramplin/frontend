import { EMPLOYMENT_LEVELS, LEVELS, OPPORTUNITY_TYPES, WORK_FORMATS } from './jobsMockData';

export const FILTER_WORK_FORMATS = ['Все', ...WORK_FORMATS] as const;
export const FILTER_OPPORTUNITY_TYPES = ['Все', ...OPPORTUNITY_TYPES] as const;
export const FILTER_LEVELS = ['Все', ...LEVELS] as const;
export const FILTER_EMPLOYMENT_LEVELS = ['Все', ...EMPLOYMENT_LEVELS] as const;

export const FILTER_LABEL_CLASS = 'mb-1.5 block text-xs font-semibold tracking-wide text-text-secondary';
export const FILTER_INPUT_CLASS =
  'h-10 w-full rounded-xl border border-border/80 bg-background/70 px-3 text-sm text-text shadow-sm outline-none transition-all placeholder:text-text-secondary/70 hover:border-primary/35 focus:border-primary/60 focus:ring-2 focus:ring-primary/15';
