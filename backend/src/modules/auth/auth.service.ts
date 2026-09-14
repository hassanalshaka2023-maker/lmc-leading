import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'node:crypto';
import { Model } from 'mongoose';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { MailService } from '../mail/mail.service';
import { AdminUser, AdminUserDocument } from './schemas/admin-user.schema';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const RESET_CODE_TTL_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminUser.name)
    private readonly adminModel: Model<AdminUserDocument>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.adminModel
      .findOne({ email: email.toLowerCase() })
      .select('+passwordHash')
      .exec();

    // Uniform error to avoid leaking which part failed.
    const invalid = new UnauthorizedException('Invalid credentials');

    if (!user || !user.isActive) throw invalid;

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        `Account locked. Try again after ${user.lockedUntil.toISOString()}`,
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000);
        user.failedLoginAttempts = 0;
      }
      await user.save();
      throw invalid;
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    user.lastLoginAt = new Date();
    const tokens = await this.issueTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await user.save();
    return tokens;
  }

  async refresh(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.adminModel
      .findById(payload.sub)
      .select('+refreshTokenHash')
      .exec();
    if (!user || !user.isActive || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) throw new UnauthorizedException('Invalid refresh token');

    const tokens = await this.issueTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
    await user.save();
    return tokens;
  }

  async forgotPassword(email: string) {
    const generic = {
      message: 'If that email is registered, a reset code has been sent.',
    };
    const user = await this.adminModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    if (!user || !user.isActive) return generic;

    const code = String(randomInt(100000, 1000000));
    user.resetCodeHash = await bcrypt.hash(code, 10);
    user.resetCodeExpiresAt = new Date(
      Date.now() + RESET_CODE_TTL_MINUTES * 60_000,
    );
    await user.save();

    await this.mail.sendPasswordResetCode(user.email, code);
    return generic;
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const invalid = new UnauthorizedException('Invalid or expired code');
    const user = await this.adminModel
      .findOne({ email: email.toLowerCase() })
      .select('+resetCodeHash')
      .exec();

    if (
      !user ||
      !user.isActive ||
      !user.resetCodeHash ||
      !user.resetCodeExpiresAt ||
      user.resetCodeExpiresAt < new Date()
    ) {
      throw invalid;
    }

    const matches = await bcrypt.compare(code, user.resetCodeHash);
    if (!matches) throw invalid;

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.resetCodeHash = undefined;
    user.resetCodeExpiresAt = undefined;
    user.failedLoginAttempts = 0;
    user.lockedUntil = undefined;
    user.refreshTokenHash = undefined;
    await user.save();
    return { success: true };
  }

  async logout(userId: string) {
    await this.adminModel
      .findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } })
      .exec();
    return { success: true };
  }

  async me(userId: string) {
    const user = await this.adminModel.findById(userId).lean().exec();
    if (!user) throw new UnauthorizedException();
    return {
      id: String(user._id),
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt ?? null,
    };
  }

  private async issueTokens(user: AuthUser) {
    const accessToken = await this.jwt.signAsync(
      { sub: user.userId, email: user.email, role: user.role },
      {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessTtl') ?? '15m',
      } as JwtSignOptions,
    );
    const refreshToken = await this.jwt.signAsync({ sub: user.userId }, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshTtl') ?? '7d',
    } as JwtSignOptions);
    return { accessToken, refreshToken };
  }
}
