import { THEME_STORAGE_KEY } from '@/shared/config/themeKey';
import { type Theme } from '@shared/types/theme';

export const getStoredTheme = (): Theme => {
  const storedTheme = window?.localStorage?.getItem(THEME_STORAGE_KEY);
  return (storedTheme as Theme) ?? 'light';
};
