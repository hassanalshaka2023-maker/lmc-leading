import { SetMetadata } from '@nestjs/common';
import type { AdminRole } from '../constants/enums';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route (or controller) to the given role(s).
 * Enforced by the global `RolesGuard`. With no decorator, any authenticated
 * user passes — which in this MVP is only the single ADMIN account.
 */
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
