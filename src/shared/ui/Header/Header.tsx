import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredTheme } from '@shared/lib/getStoredTheme';
import { toggleTheme } from '@shared/lib/toggleTheme';
import { useCloseOnOutsideClick } from '@shared/lib/useCloseOnOutsideClick';
import { useFavoriteIds } from '@shared/lib/useFavoriteIds';
import { authService } from '@features/auth';
import { useAuth } from '@app/providers';
import { THEME_STORAGE_KEY } from '@/shared/config/themeKey';
import { type Theme } from '@shared/types/theme';
import { type UserRole } from '@shared/types/roles';
import { CITIES } from '@shared/config/mocks';
import { GUEST_NAV_ITEMS, CANDIDATE_NAV_ITEMS, COMPANY_NAV_ITEMS } from '@shared/config/navItems';
import {
  HeaderAuthActions,
  HeaderFavorites,
  HeaderLocation,
  HeaderLogo,
  HeaderNav,
  HeaderProfile,
  HeaderThemeToggle,
} from './HeaderItems';

const navMap = {
  guest: GUEST_NAV_ITEMS,
  applicant: CANDIDATE_NAV_ITEMS,
  company: COMPANY_NAV_ITEMS,
};
export const Header = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const userRole: UserRole = session?.role ?? 'guest';
  const isAuth = userRole !== 'guest';
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const { favoriteIds } = useFavoriteIds();
  const favoritesCount = favoriteIds.length;
  const fullName = session?.login ?? session?.email ?? 'Гость';
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const locationRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const themeToggleRef = useRef<HTMLButtonElement | null>(null);
  const navItems = navMap[userRole];
  const isDarkTheme = theme === 'dark';
  const filteredCities = useMemo(() => {
    const search = citySearch.trim().toLowerCase();
    return CITIES.filter((city) => city.toLowerCase().includes(search));
  }, [citySearch]);
  const userDisplayName = useMemo(() => {
    const [firstName = '', lastName = ''] = fullName.trim().split(/\s+/);
    const lastInitial = lastName ? `${lastName[0]?.toUpperCase()}.` : '';
    return [firstName, lastInitial].filter(Boolean).join(' ');
  }, [fullName]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useCloseOnOutsideClick({
    ref: locationRef,
    isOpen: isLocationOpen,
    onClose: () => setIsLocationOpen(false),
  });

  useCloseOnOutsideClick({
    ref: profileRef,
    isOpen: isProfileOpen,
    onClose: () => setIsProfileOpen(false),
  });

  const handleToggleTheme = () => {
    toggleTheme({ themeToggleRef, setTheme });
  };

  const handleSignOut = () => {
    void (async () => {
      await authService.sign_out();
      signOut();
      setIsProfileOpen(false);
      navigate('/auth/login');
    })();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-header-bg backdrop-blur transition-colors duration-300">
      <div className="mx-auto flex h-18 w-full max-w-[1760px] items-center justify-between gap-8 px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-10">
          <HeaderLogo />
          <HeaderNav navItems={navItems} />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 md:gap-4">
          <HeaderLocation
            locationRef={locationRef}
            isLocationOpen={isLocationOpen}
            selectedCity={selectedCity}
            citySearch={citySearch}
            filteredCities={filteredCities}
            onToggle={() => setIsLocationOpen((prev) => !prev)}
            onSearchChange={setCitySearch}
            onSelectCity={(city) => {
              setSelectedCity(city);
              setIsLocationOpen(false);
              setCitySearch('');
            }}
          />

          <HeaderFavorites favoritesCount={favoritesCount} />

          {isAuth ? (
            <HeaderProfile
              profileRef={profileRef}
              isProfileOpen={isProfileOpen}
              fullName={fullName}
              userDisplayName={userDisplayName}
              role={session?.role ?? 'applicant'}
              onToggle={() => setIsProfileOpen((prev) => !prev)}
              onOpenProfile={() => {
                setIsProfileOpen(false);
                navigate('/profile');
              }}
              onSignOut={handleSignOut}
            />
          ) : (
            <HeaderAuthActions />
          )}

          <HeaderThemeToggle
            themeToggleRef={themeToggleRef}
            isDarkTheme={isDarkTheme}
            onToggle={handleToggleTheme}
          />
        </div>
      </div>
    </header>
  );
};
