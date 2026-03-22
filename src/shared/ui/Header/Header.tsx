import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/Button';

export const Header = () => {
  const isAuth = false;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 grid grid-cols-3 items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.svg" alt="Logo" className="w-7 h-7 text-primary" />
          <span className="font-semibold text-lg tracking-tight">Tramplin</span>
        </Link>

        <nav className="flex items-center justify-center gap-8 text-sm font-medium">
          <Link to="/jobs" className="text-text-secondary hover:text-primary transition-colors">
            Резюме
          </Link>

          <Link to="/map" className="text-text-secondary hover:text-primary transition-colors">
            Карта
          </Link>

          <Link
            to="/favorites"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            Избранное
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2">
          {isAuth ? (
            <button className="flex items-center gap-2 hover:bg-background px-2 py-1 rounded-md transition">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                A
              </div>
            </button>
          ) : (
            <>
              <Button variant="sec">Войти</Button>
              <Button>Регистрация</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
