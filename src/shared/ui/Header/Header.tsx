import { useEffect, useState } from 'react';
import { MapPin, Moon, Star, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/Button';
import { getStoredTheme } from '@shared/lib/getStoredTheme';
import { THEME_STORAGE_KEY } from '@shared/config/constants';
import { type Theme } from '@shared/types/theme';

export const Header = () => {
  const isAuth = false;
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const favoritesCount = 3;
  const city = 'Москва';

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
      <div className="flex h-[72px] w-full items-center justify-between gap-8 px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-10">
          <Link to="/" className="flex items-center gap-3 whitespace-nowrap">
            <img src="/images/logo.svg" alt="Logo" className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-text">Tramplin</span>
          </Link>

          <nav className="flex items-center gap-8 text-[17px] font-semibold tracking-tight">
            <Link to="/jobs" className="text-text-secondary transition-colors hover:text-primary">
              Вакансии
            </Link>
            <Link to="/map" className="text-text-secondary transition-colors hover:text-primary">
              Карта
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 md:gap-4">
          <div className="hidden items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 text-[15px] font-semibold text-text-secondary sm:flex">
            <MapPin className="h-[18px] w-[18px] text-primary" strokeWidth={2.2} />
            <span>{city}</span>
          </div>

          <Link
            to="/favorites"
            className="relative flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2 text-[15px] font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            <Star className="h-[18px] w-[18px] text-primary" strokeWidth={2.2} />
            <span className="hidden sm:inline">Избранное</span>
            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
              {favoritesCount}
            </span>
          </Link>

          {isAuth ? (
            <button className="flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-background">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                A
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="sec">Войти</Button>
              <Button>Регистрация</Button>
            </div>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className={`relative h-8 w-14 rounded-full border transition-all duration-300 ${
              theme === 'dark' ? 'border-primary bg-primary' : 'border-slate-300 bg-slate-200'
            }`}
            aria-label="Переключить тему"
            title="Переключить тему"
          >
            <span className="absolute inset-0 flex items-center justify-between px-2.5">
              <Sun
                className={`h-3.5 w-3.5 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'scale-95 text-amber-100 opacity-70'
                    : 'scale-100 text-amber-600 opacity-100'
                }`}
              />
              <Moon
                className={`h-3.5 w-3.5 transition-all duration-300 ${
                  theme === 'dark'
                    ? 'scale-100 text-white opacity-100'
                    : 'scale-95 text-slate-600 opacity-90'
                }`}
              />
            </span>
            <span
              className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
                theme === 'dark' ? 'translate-x-6 text-primary' : 'translate-x-0 text-slate-600'
              }`}
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
