import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ADMIN_ROLE } from '../../../common/constants/enums';
import type { AdminRole } from '../../../common/constants/enums';

export type AdminUserDocument = HydratedDocument<AdminUser>;

@Schema({ collection: 'adminUsers', timestamps: true })
export class AdminUser {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  /** bcrypt hash — excluded from query results by default */
  @Prop({ type: String, required: true, select: false })
  passwordHash: string;

  @Prop({ type: String, enum: ADMIN_ROLE, default: 'ADMIN' })
  role: AdminRole;

  /** hash of the currently valid refresh token — excluded by default */
  @Prop({ type: String, select: false })
  refreshTokenHash?: string;

  /** bcrypt hash of the current password-reset code — excluded by default */
  @Prop({ type: String, select: false })
  resetCodeHash?: string;

  @Prop({ type: Date })
  resetCodeExpiresAt?: Date;

  @Prop({ type: Date })
  lastLoginAt?: Date;

  /** brute-force protection: consecutive failed logins + lockout window */
  @Prop({ type: Number, default: 0 })
  failedLoginAttempts: number;

  @Prop({ type: Date })
  lockedUntil?: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
