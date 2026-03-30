import { flushSync } from 'react-dom';
import { type Dispatch, type RefObject, type SetStateAction } from 'react';
import { type Theme } from '@shared/types/theme';

type ToggleThemeParams = {
  themeToggleRef: RefObject<HTMLButtonElement | null>;
  setTheme: Dispatch<SetStateAction<Theme>>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

export const toggleTheme = ({ themeToggleRef, setTheme }: ToggleThemeParams) => {
  const doc = document as ViewTransitionDocument;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const toggleRect = themeToggleRef.current?.getBoundingClientRect();
  const originX = toggleRect ? toggleRect.left + toggleRect.width / 2 : window.innerWidth / 2;
  const originY = toggleRect ? toggleRect.top + toggleRect.height / 2 : window.innerHeight / 2;
  const maxX = Math.max(originX, window.innerWidth - originX);
  const maxY = Math.max(originY, window.innerHeight - originY);
  const radius = Math.hypot(maxX, maxY);

  root.style.setProperty('--theme-transition-x', `${originX}px`);
  root.style.setProperty('--theme-transition-y', `${originY}px`);
  root.style.setProperty('--theme-transition-radius', `${radius}px`);

  if (doc.startViewTransition && !prefersReducedMotion) {
    root.classList.add('theme-switching');
    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
      });
    });
    transition.finished.finally(() => {
      root.classList.remove('theme-switching');
    });
    return;
  }

  setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
};
