import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { definedOnly } from '../../common/util/defined';
import { UpdateContactInfoDto } from './dto/contact-info.dto';
import {
  ContactInfo,
  ContactInfoDocument,
} from './schemas/contact-info.schema';

const KEY = 'default';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactInfo.name)
    private readonly model: Model<ContactInfoDocument>,
  ) {}

  /**
   * Returns the single contact-info document, creating it on first access.
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

  async update(dto: UpdateContactInfoDto) {
    // Load-modify-save: `.save()` validates the whole merged document, so a
    // partial PATCH works. (`findOneAndUpdate` + `runValidators` wrongly applies
    // `required` to nested paths that aren't in the update.)
    const doc =
      (await this.model.findOne({ key: KEY })) ?? new this.model({ key: KEY });
    doc.set(definedOnly(dto));
    await doc.save();
    return doc.toObject();
  }
}
