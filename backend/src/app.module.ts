import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { RolesGuard } from './common/guards/roles.guard';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ContactModule } from './modules/contact/contact.module';
import { CorporateProgramsModule } from './modules/corporate-programs/corporate-programs.module';
import { EducationalServicesModule } from './modules/educational-services/educational-services.module';
import { LanguageProgramsModule } from './modules/language-programs/language-programs.module';
import { MailModule } from './modules/mail/mail.module';
import { MediaModule } from './modules/media/media.module';
import { MembershipModule } from './modules/membership/membership.module';
import { PagesModule } from './modules/pages/pages.module';
import { PartnersModule } from './modules/partners/partners.module';
import { StatsModule } from './modules/stats/stats.module';
import { StorageModule } from './modules/storage/storage.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { TrainersModule } from './modules/trainers/trainers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongoUri'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: (config.get<number>('throttle.ttl') ?? 60) * 1000,
          limit: config.get<number>('throttle.limit') ?? 120,
        },
      ],
    }),
    StorageModule,
    MailModule,
    HealthModule,
    AuthModule,
    PagesModule,
    StatsModule,
    LanguageProgramsModule,
    CorporateProgramsModule,
    EducationalServicesModule,
    TrainersModule,
    TestimonialsModule,
    PartnersModule,
    MembershipModule,
    SubmissionsModule,
    MediaModule,
    ContactModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
