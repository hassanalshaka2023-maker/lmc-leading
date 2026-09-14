import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginated } from '../../common/dto/pagination.dto';
import {
  CreateSubmissionDto,
  QuerySubmissionsDto,
  UpdateSubmissionDto,
} from './dto/submission.dto';
import { Submission, SubmissionDocument } from './schemas/submission.schema';

const CSV_COLUMNS = [
  'createdAt',
  'type',
  'status',
  'name',
  'phone',
  'email',
  'serviceOfInterest',
  'message',
  'notes',
] as const;

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name)
    private readonly model: Model<SubmissionDocument>,
  ) {}

  async create(dto: CreateSubmissionDto, sourceIp?: string) {
    const doc = await this.model.create({ ...dto, sourceIp });
    // Public endpoint — echo back only what the caller needs, not internal
    // fields (status, sourceIp, handledBy, timestamps).
    return { success: true as const, id: String(doc._id) };
  }

  private buildFilter(q: QuerySubmissionsDto): Record<string, unknown> {
    const filter: Record<string, unknown> = {};
    if (q.status) filter.status = q.status;
    if (q.type) filter.type = q.type;
    return filter;
  }

  async findAll(q: QuerySubmissionsDto) {
    const filter = this.buildFilter(q);
    const [items, total] = await Promise.all([
      this.model
        .find(filter as never)
        .sort({ createdAt: -1 })
        .skip(q.skip)
        .limit(q.limit)
        .lean()
        .exec(),
      this.model.countDocuments(filter as never),
    ]);
    return paginated(items, total, { page: q.page, limit: q.limit });
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).lean().exec();
    if (!doc) throw new NotFoundException('Submission not found');
    return doc;
  }

  async update(id: string, dto: UpdateSubmissionDto, handledBy: string) {
    const doc = await this.model
      .findByIdAndUpdate(
        id,
        { ...dto, handledBy },
        { returnDocument: 'after', runValidators: true },
      )
      .lean()
      .exec();
    if (!doc) throw new NotFoundException('Submission not found');
    return doc;
  }

  async remove(id: string) {
    const doc = await this.model.findByIdAndDelete(id).lean().exec();
    if (!doc) throw new NotFoundException('Submission not found');
    return { deleted: true, id };
  }

  async exportCsv(q: QuerySubmissionsDto): Promise<string> {
    const rows = await this.model
      .find(this.buildFilter(q) as never)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const escape = (v: string | null | undefined) => {
      let s = v ?? '';
      // Neutralise spreadsheet formula injection: a leading =, +, -, @, tab or CR
      // makes Excel/Sheets evaluate the cell. Prefix with a single quote.
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const header = CSV_COLUMNS.join(',');
    const body = rows
      .map((row) => {
        const r = row as unknown as Record<string, string | undefined> & {
          createdAt?: Date;
        };
        return CSV_COLUMNS.map((c) =>
          escape(c === 'createdAt' ? r.createdAt?.toISOString() : r[c]),
        ).join(',');
      })
      .join('\n');
    return `${header}\n${body}\n`;
  }
}
