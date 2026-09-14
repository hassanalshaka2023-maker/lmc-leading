import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Model } from 'mongoose';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * End-to-end smoke test — boots the real AppModule against an in-memory MongoDB.
 * Covers: health probe, a public content endpoint, the single-source stats doc,
 * contact-form validation + happy path, and that an admin route is locked down.
 */
describe('LMC API (e2e)', () => {
  let app: INestApplication<App>;
  let mongo: MongoMemoryServer;
  let token: string;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    // AppModule's config factory + validateEnv run inside compile(), so these
    // must be set first.
    process.env.MONGO_URI = mongo.getUri('lmc_e2e');
    process.env.NODE_ENV = 'test';
    process.env.JWT_ACCESS_SECRET =
      'e2e-access-secret-e2e-access-secret-000000';
    process.env.JWT_REFRESH_SECRET =
      'e2e-refresh-secret-e2e-refresh-secret-1111';
    process.env.THROTTLE_LIMIT = '1000'; // don't rate-limit the test run

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();

    // Seed one admin so the auth + RolesGuard path can be exercised.
    const adminModel = app.get<Model<Record<string, unknown>>>(
      getModelToken('AdminUser'),
    );
    await adminModel.create({
      email: 'admin@e2e.local',
      passwordHash: await bcrypt.hash('Passw0rd!e2e', 4),
      role: 'ADMIN',
    });

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@e2e.local', password: 'Passw0rd!e2e' })
      .expect(200);
    token = res.body.accessToken as string;
  }, 60_000);

  afterAll(async () => {
    await app?.close();
    await mongo?.stop();
  });

  it('GET /api/health → ok + db connected', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('connected');
  });

  it('GET /api/stats → the single stats document', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/stats')
      .expect(200);
    expect(res.body).toHaveProperty('students');
    expect(res.body).toHaveProperty('programsCount');
  });

  it('GET /api/contact-info → structured contact fields', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/contact-info')
      .expect(200);
    expect(res.body).toHaveProperty('phone');
    expect(res.body).toHaveProperty('socialLinks');
  });

  it('GET /api/language-programs → array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/language-programs')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/submissions → 400 on invalid body', async () => {
    await request(app.getHttpServer())
      .post('/api/submissions')
      .send({ type: 'contact', name: 'x' })
      .expect(400);
  });

  it('POST /api/submissions → 201 + minimal payload on valid body', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/submissions')
      .send({
        type: 'contact',
        name: 'Test User',
        phone: '+1234567',
        email: 'test@example.com',
        message: 'Hello there, this is a test.',
      })
      .expect(201);
    expect(res.body).toEqual({ success: true, id: expect.any(String) });
  });

  it('GET /api/admin/submissions → 401 without a token', async () => {
    await request(app.getHttpServer())
      .get('/api/admin/submissions')
      .expect(401);
  });

  it('a valid token unlocks an admin route', async () => {
    await request(app.getHttpServer())
      .get('/api/admin/contact-info')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('PATCH /api/admin/contact-info → a partial update persists', async () => {
    const patch = await request(app.getHttpServer())
      .patch('/api/admin/contact-info')
      .set('Authorization', `Bearer ${token}`)
      .send({ whatsapp: '905551112233' })
      .expect(200);
    expect(patch.body.whatsapp).toBe('905551112233');

    const pub = await request(app.getHttpServer())
      .get('/api/contact-info')
      .expect(200);
    expect(pub.body.whatsapp).toBe('905551112233');
  });

  it('PATCH /api/admin/contact-info → 400 on a bad social link', async () => {
    await request(app.getHttpServer())
      .patch('/api/admin/contact-info')
      .set('Authorization', `Bearer ${token}`)
      .send({ socialLinks: [{ platform: 'x', url: 'not-a-url' }] })
      .expect(400);
  });
});
