import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

function ctx(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  const make = (meta: Record<string, unknown>) => {
    const reflector = {
      getAllAndOverride: (key: string) => meta[key],
    } as unknown as Reflector;
    return new RolesGuard(reflector);
  };

  it('lets @Public() routes through without a user', () => {
    const guard = make({ isPublic: true });
    expect(guard.canActivate(ctx(undefined))).toBe(true);
  });

  it('allows an ADMIN on a default (undecorated) protected route', () => {
    const guard = make({});
    expect(guard.canActivate(ctx({ role: 'ADMIN' }))).toBe(true);
  });

  it('rejects a missing user on a protected route', () => {
    const guard = make({});
    expect(() => guard.canActivate(ctx(undefined))).toThrow(ForbiddenException);
  });

  it('rejects a role that is not in the @Roles() list', () => {
    const guard = make({ roles: ['ADMIN'] });
    expect(() => guard.canActivate(ctx({ role: 'EDITOR' }))).toThrow(
      ForbiddenException,
    );
  });
});
