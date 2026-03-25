import { useEffect, useState } from 'react';
import { MapPin, Moon, Star, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { getStoredTheme } from '@shared/lib/getStoredTheme';
import { THEME_STORAGE_KEY } from '@shared/config/constants';
import { type Theme } from '@shared/types/theme';

type UserRole = 'guest' | 'job-seeker' | 'employer';
type NavItem = { to: string; label: string };

const GUEST_NAV_ITEMS: readonly NavItem[] = [
  { to: '/jobs', label: 'Вакансии' },
  { to: '/map', label: 'Карта' },
];

const JOB_SEEKER_NAV_ITEMS: readonly NavItem[] = [
  ...GUEST_NAV_ITEMS,
  { to: '/responses', label: 'Отклики' },
];

const EMPLOYER_NAV_ITEMS: readonly NavItem[] = [
  { to: '/my-jobs', label: 'Мои вакансии' },
  { to: '/jobs/create', label: 'Создать' },
  { to: '/candidates', label: 'Кандидаты' },
];

export const Header = () => {
  const [userRole] = useState<UserRole>('guest');
  const isAuth = userRole !== 'guest';
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const favoritesCount = 3;
  const city = 'Москва';
  const navItems =
    userRole === 'employer'
      ? EMPLOYER_NAV_ITEMS
      : userRole === 'job-seeker'
        ? JOB_SEEKER_NAV_ITEMS
        : GUEST_NAV_ITEMS;
  const isDarkTheme = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-header-bg backdrop-blur transition-colors duration-300">
      <div className="flex h-18 w-full items-center justify-between gap-8 px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-10">
          <Link to="/" className="flex items-center whitespace-nowrap">
            <img src="/images/logo.svg" alt="Logo" className="h-9 w-9 text-primary" />
            <span className="text-2xl font-bold tracking-tight text-text">ramplin</span>
          </Link>

          <nav className="flex items-center gap-9 text-lg font-semibold tracking-tight">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="header-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 md:gap-4">
          <div className="header-chip hidden sm:flex">
            <MapPin className="header-chip-icon" strokeWidth={2.2} />
            <span>{city}</span>
          </div>

          <Link to="/favorites" className="header-chip header-chip-link relative">
            <Star className="header-chip-icon" strokeWidth={2.2} />
            <span className="hidden sm:inline">Избранное</span>
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
              {favoritesCount}
            </span>
          </Link>

          {isAuth ? (
            <button className="header-profile-btn">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-medium text-white">
                A
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="sec" size="lg">
                Войти
              </Button>
              <Button size="lg">Регистрация</Button>
            </div>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className={`relative h-8 w-14 rounded-full border transition-all duration-300 ${
              isDarkTheme ? 'border-primary bg-primary' : 'border-slate-300 bg-slate-200'
            }`}
            aria-label="Переключить тему"
            title="Переключить тему"
          >
            <span className="absolute inset-0 flex items-center justify-between px-2.5">
              <Sun
                className={`h-3.5 w-3.5 transition-all duration-300 ${
                  isDarkTheme
                    ? 'scale-95 text-white opacity-100'
                    : 'scale-100 text-amber-600 opacity-100'
                }`}
              />
              <Moon
                className={`h-3.5 w-3.5 transition-all duration-300 ${
                  isDarkTheme
                    ? 'scale-100 text-white opacity-100'
                    : 'scale-95 text-slate-600 opacity-90'
                }`}
              />
            </span>
            <span
              className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
                isDarkTheme ? 'translate-x-6 text-primary' : 'translate-x-0 text-slate-600'
              }`}
            >
              {isDarkTheme ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
