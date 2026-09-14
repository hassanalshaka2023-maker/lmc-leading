import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { existsSync, mkdirSync } from 'node:fs';
import type { ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const apiPrefix = config.get<string>('apiPrefix') ?? 'api';
  const port = config.get<number>('port') ?? 3000;
  const corsOrigin =
    config.get<string>('corsOrigin') ?? 'http://localhost:5173';
  const uploadsDir = resolve(
    config.get<string>('storage.localDir') ?? './uploads',
  );

  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  // Needed behind Render/Nginx so rate limiting uses the visitor's IP.
  // TRUST_PROXY = number of proxies in front of the API (0 if none).
  const trustProxy = parseInt(process.env.TRUST_PROXY ?? '1', 10);
  if (trustProxy > 0) app.set('trust proxy', trustProxy);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.enableCors({ origin: corsOrigin.split(','), credentials: true });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Local file storage — served statically. Swap for S3/CDN in production.
  // SVG is intentionally NOT in the upload allowlist, but defend in depth for any
  // file served from /uploads: no inline execution, force download for non-images.
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
    setHeaders: (res: ServerResponse) => {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; img-src 'self'",
      );
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('LMC API')
    .setDescription(
      'Leading Mastery Center — public site + admin dashboard API',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    `${apiPrefix}/docs`,
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  app.enableShutdownHooks();
  await app.listen(port);

  console.log(
    `LMC API on http://localhost:${port}/${apiPrefix}  (docs: /${apiPrefix}/docs)`,
  );
}
void bootstrap();
