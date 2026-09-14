import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Thin wrapper around nodemailer. If SMTP credentials aren't configured yet
 * (local dev before the admin sets up a Gmail App Password), sending
 * degrades to logging the content instead of throwing — so the
 * forgot-password flow stays testable end-to-end without real email.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger('Mail');
  private readonly transporter: nodemailer.Transporter | null;
  private readonly from: string;

  constructor(config: ConfigService) {
    const user = config.get<string>('mail.user')?.trim();
    // Google displays App Passwords as "abcd efgh ijkl mnop" for readability
    // but the real secret has no spaces — strip them so a copy-paste from
    // the Google Account page works as-is.
    const pass = config.get<string>('mail.pass')?.replace(/\s+/g, '');
    this.from = config.get<string>('mail.from') || user || 'no-reply@lmc.local';
    this.transporter =
      user && pass
        ? nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
          })
        : null;
  }

  async sendPasswordResetCode(to: string, code: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(
        `SMTP not configured — password reset code for ${to}: ${code}`,
      );
      return;
    }
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'رمز إعادة تعيين كلمة المرور / Password reset code',
      text: `Your password reset code is: ${code}\nIt expires in 15 minutes.`,
      html: `<p>Your password reset code is: <b style="font-size:20px">${code}</b></p><p>It expires in 15 minutes.</p>`,
    });
  }
}
