import { type RefObject } from 'react';
import { LogOut, User } from 'lucide-react';
import { type AuthRole } from '@shared/types/auth';

type HeaderProfileProps = {
  profileRef: RefObject<HTMLDivElement | null>;
  isProfileOpen: boolean;
  fullName: string;
  userDisplayName: string;
  role: AuthRole;
  onToggle: () => void;
  onOpenProfile: () => void;
  onSignOut: () => void;
};

export const HeaderProfile = ({
  profileRef,
  isProfileOpen,
  fullName,
  userDisplayName,
  role,
  onToggle,
  onOpenProfile,
  onSignOut,
}: HeaderProfileProps) => {
  const roleLabel = role === 'company' ? 'Работодатель' : 'Соискатель';

  return (
    <div ref={profileRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="header-profile-btn group cursor-pointer rounded-xl border border-border bg-background/70 px-3 py-2 transition-colors hover:bg-background"
        aria-expanded={isProfileOpen}
        aria-label="Меню профиля"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {fullName.slice(0, 1).toUpperCase()}
        </div>
        <div className="hidden text-left leading-tight md:block">
          <p className="text-sm font-semibold text-text transition-colors group-hover:text-primary">
            {userDisplayName}
          </p>
          <p className="text-xs text-text-secondary transition-colors group-hover:text-text">
            {roleLabel}
          </p>
        </div>
      </button>

      {isProfileOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-2xl border border-border bg-surface p-2 shadow-xl">
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text"
          >
            <User className="h-4 w-4 text-accent" />
            Профиль
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-favorite transition-colors hover:bg-favorite/15"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      ) : null}
    </div>
  );
};
