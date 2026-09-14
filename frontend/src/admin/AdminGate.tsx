import { AdminLayout } from './AdminLayout';
import { RequireAuth } from './RequireAuth';

/** Single lazy entry point for the whole admin area. */
export function AdminGate() {
  return (
    <RequireAuth>
      <AdminLayout />
    </RequireAuth>
  );
}
