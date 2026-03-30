import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { AUTH_UNAUTHORIZED_EVENT } from '@shared/config/auth';
import { clearAuthSession, readAuthSession, writeAuthSession } from '@shared/lib/authStorage';
import { type AuthSession } from '@shared/types/auth';

type AuthContextValue = {
  session: AuthSession | null;
  isAuth: boolean;
  setSession: (session: AuthSession) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSessionState] = useState<AuthSession | null>(() => readAuthSession());

  useEffect(() => {
    const sync = () => {
      setSessionState(readAuthSession());
    };

    const onUnauthorized = () => {
      setSessionState(null);
    };

    window.addEventListener('storage', sync);
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuth: session?.isAuth === true,
      setSession: (nextSession) => {
        setSessionState(nextSession);
        writeAuthSession(nextSession);
      },
      signOut: () => {
        setSessionState(null);
        clearAuthSession();
      },
    }),
    [session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
