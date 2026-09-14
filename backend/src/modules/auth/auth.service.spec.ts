import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';
import { AdminUser } from './schemas/admin-user.schema';

describe('AuthService.login', () => {
  let service: AuthService;
  let userDoc: Record<string, unknown>;

  const adminModelMock = {
    findOne: jest.fn(() => ({
      select: () => ({ exec: async () => userDoc }),
    })),
  };
  const jwtMock = { signAsync: jest.fn(async () => 'signed.jwt.token') };
  const configMock = { get: jest.fn(() => '15m') };
  const mailMock = { sendPasswordResetCode: jest.fn(async () => undefined) };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(AdminUser.name), useValue: adminModelMock },
        { provide: JwtService, useValue: jwtMock },
        { provide: ConfigService, useValue: configMock },
        { provide: MailService, useValue: mailMock },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  const baseUser = async () => ({
    id: 'u1',
    email: 'admin@lmc.local',
    role: 'ADMIN',
    isActive: true,
    failedLoginAttempts: 0,
    lockedUntil: undefined as Date | undefined,
    passwordHash: await bcrypt.hash('CorrectHorse1', 4),
    save: jest.fn(async function (this: Record<string, unknown>) {
      return this;
    }),
  });

  it('issues tokens on correct credentials', async () => {
    userDoc = await baseUser();
    const out = await service.login('admin@lmc.local', 'CorrectHorse1');
    expect(out).toHaveProperty('accessToken');
    expect(out).toHaveProperty('refreshToken');
  });

  it('rejects a wrong password and counts the attempt', async () => {
    userDoc = await baseUser();
    await expect(
      service.login('admin@lmc.local', 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(userDoc.failedLoginAttempts).toBe(1);
    expect(userDoc.save).toHaveBeenCalled();
  });

  it('locks the account after 5 consecutive failures', async () => {
    userDoc = await baseUser();
    userDoc.failedLoginAttempts = 4;
    await expect(
      service.login('admin@lmc.local', 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(userDoc.lockedUntil).toBeInstanceOf(Date);
  });

  it('refuses login while locked', async () => {
    userDoc = await baseUser();
    userDoc.lockedUntil = new Date(Date.now() + 60_000);
    await expect(
      service.login('admin@lmc.local', 'CorrectHorse1'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
