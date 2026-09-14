import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { definedOnly } from '../../common/util/defined';
import { UpdateMembershipContentDto } from './dto/membership-content.dto';
import {
  MembershipContent,
  MembershipContentDocument,
} from './schemas/membership-content.schema';

const KEY = 'default';

@Injectable()
export class MembershipService {
  constructor(
    @InjectModel(MembershipContent.name)
    private readonly model: Model<MembershipContentDocument>,
  ) {}

  /**
   * Returns the single membership-content document, creating it on first access.
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

  async update(dto: UpdateMembershipContentDto) {
    // Load-modify-save so `.save()` validates the whole merged document and a
    // partial PATCH works (see ContactService.update for the rationale).
    const doc =
      (await this.model.findOne({ key: KEY })) ?? new this.model({ key: KEY });
    doc.set(definedOnly(dto));
    await doc.save();
    return doc.toObject();
  }
}
