import { type RefObject } from 'react';
import { Moon, Sun } from 'lucide-react';

type HeaderThemeToggleProps = {
  themeToggleRef: RefObject<HTMLButtonElement | null>;
  isDarkTheme: boolean;
  onToggle: () => void;
};

export const HeaderThemeToggle = ({
  themeToggleRef,
  isDarkTheme,
  onToggle,
}: HeaderThemeToggleProps) => {
  return (
    <button
      ref={themeToggleRef}
      type="button"
      onClick={onToggle}
      className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border hover:bg-background ${
        isDarkTheme ? 'border-border bg-background/80 text-accent' : 'border-border bg-background/70 text-primary'
      }`}
      aria-label="Переключить тему"
      title="Переключить тему"
    >
      <Sun
        className={`absolute h-5 w-5 ${
          isDarkTheme ? 'scale-75 rotate-45 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 ${
          isDarkTheme ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-45 opacity-0'
        }`}
      />
    </button>
  );
};
