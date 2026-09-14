import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { SubmissionsService } from './submissions.service';
import { Submission } from './schemas/submission.schema';

describe('SubmissionsService', () => {
  let service: SubmissionsService;
  const rows: Array<Record<string, unknown>> = [];

  const modelMock = {
    create: jest.fn(async (doc) => ({ _id: 'abc123', ...doc })),
    find: jest.fn(() => ({
      sort: () => ({ lean: () => ({ exec: async () => rows }) }),
    })),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        { provide: getModelToken(Submission.name), useValue: modelMock },
      ],
    }).compile();
    service = moduleRef.get(SubmissionsService);
    rows.length = 0;
  });

  it('create() returns only { success, id } — no internal fields', async () => {
    const out = await service.create(
      {
        type: 'contact',
        name: 'A',
        phone: '123456',
        email: 'a@b.com',
        message: 'hello world',
      },
      '203.0.113.1',
    );
    expect(out).toEqual({ success: true, id: 'abc123' });
  });

  it('exportCsv() neutralises spreadsheet formula injection', async () => {
    rows.push({
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      type: 'contact',
      status: 'new',
      name: '=1+1',
      phone: '+123456',
      email: 'x@y.com',
      serviceOfInterest: '@SUM(A1:A9)',
      message: '-2+3',
      notes: 'plain note',
    });

    const csv = await service.exportCsv({
      page: 1,
      limit: 50,
      skip: 0,
    } as never);
    const dataLine = csv.trim().split('\n')[1];

    // leading =, +, -, @ each get a ' prefix; the +123456 phone is quoted-safe too
    expect(dataLine).toContain("'=1+1");
    expect(dataLine).toContain("'@SUM(A1:A9)");
    expect(dataLine).toContain("'-2+3");
    expect(dataLine).toContain("'+123456");
    expect(dataLine).toContain('plain note');
  });
});
