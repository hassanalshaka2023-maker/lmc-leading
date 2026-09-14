import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { definedOnly } from '../../common/util/defined';
import { SiteStats, SiteStatsDocument } from './schemas/site-stats.schema';
import { UpdateSiteStatsDto } from './dto/site-stats.dto';

const KEY = 'default';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(SiteStats.name)
    private readonly model: Model<SiteStatsDocument>,
  ) {}

  /**
   * Always returns the single stats document, creating it on first access.
   * Atomic upsert so concurrent first-hits can't race into a duplicate-key error.
   */
  get() {
    return this.model
      .findOneAndUpdate(
        { key: KEY },
        { $setOnInsert: { key: KEY } },
        // timestamps:false → a plain read must not bump `updatedAt`.
        {
          returnDocument: 'after',
          upsert: true,
          setDefaultsOnInsert: true,
          timestamps: false,
        },
      )
      .lean()
      .exec();
  }

  async update(dto: UpdateSiteStatsDto) {
    // Load-modify-save so `.save()` validates the whole merged document and a
    // partial PATCH works (see ContactService.update for the rationale).
    const doc =
      (await this.model.findOne({ key: KEY })) ?? new this.model({ key: KEY });
    doc.set(definedOnly(dto));
    await doc.save();
    return doc.toObject();
  }
}
