import { Outlet } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

/** AuthProvider only wraps the admin routes, so public pages never call /auth/me. */
export function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
