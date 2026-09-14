import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ADMIN_ROLE } from '../constants/enums';
import type { AdminRole } from '../constants/enums';
import type { AuthUser } from '../decorators/current-user.decorator';

/**
 * Global guard, runs after `JwtAuthGuard`. `@Public()` routes are skipped.
 * Every other route requires the caller's role to be allowed — the `@Roles()`
 * list when present, otherwise the default `['ADMIN']`. This makes the whole
 * authenticated surface admin-only, matching the MVP scope.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const allowed = this.reflector.getAllAndOverride<AdminRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [...ADMIN_ROLE];

    const { user } = context.switchToHttp().getRequest<{ user?: AuthUser }>();

    if (!user || !allowed.includes(user.role as AdminRole)) {
      throw new ForbiddenException('Insufficient role');
    }
    return true;
  }
}
