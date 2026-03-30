import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { type AuthRole } from '@shared/types/auth';

type RequireAuthProps = {
  roles?: AuthRole[];
};

export const RequireAuth = ({ roles }: RequireAuthProps) => {
  const { isAuth, session } = useAuth();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}`;

  if (!isAuth || !session) {
    return <Navigate to={`/auth/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  if (roles && !roles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
