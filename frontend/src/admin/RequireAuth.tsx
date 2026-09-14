import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/leaderrami/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
