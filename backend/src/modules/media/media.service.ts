import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginated, PaginationDto } from '../../common/dto/pagination.dto';
import { Partner, PartnerDocument } from '../partners/schemas/partner.schema';
import {
  Testimonial,
  TestimonialDocument,
} from '../testimonials/schemas/testimonial.schema';
import { Trainer, TrainerDocument } from '../trainers/schemas/trainer.schema';
import { StorageService } from '../storage/storage.service';
import { MediaAsset, MediaAssetDocument } from './schemas/media-asset.schema';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(MediaAsset.name)
    private readonly model: Model<MediaAssetDocument>,
    @InjectModel(Trainer.name)
    private readonly trainerModel: Model<TrainerDocument>,
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
    @InjectModel(Partner.name)
    private readonly partnerModel: Model<PartnerDocument>,
    private readonly storage: StorageService,
  ) {}

  async upload(file: Express.Multer.File, uploadedBy: string) {
    const stored = await this.storage.save(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    return this.model.create({
      url: stored.url,
      storageKey: stored.storageKey,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: stored.sizeBytes,
      uploadedBy,
    });
  }

  async findAll(q: PaginationDto) {
    const [items, total] = await Promise.all([
      this.model
        .find()
        .sort({ createdAt: -1 })
        .skip(q.skip)
        .limit(q.limit)
        .lean()
        .exec(),
      this.model.countDocuments(),
    ]);
    return paginated(items, total, { page: q.page, limit: q.limit });
  }

  async remove(id: string) {
    const doc = await this.model.findByIdAndDelete(id).lean().exec();
    if (!doc) throw new NotFoundException('Media asset not found');
    await this.storage.delete(doc.storageKey);
    await this.clearReferences(doc.url);
    return { deleted: true, id };
  }

  /** Null out any photo/logo URL that pointed at the just-deleted asset. */
  private async clearReferences(url: string) {
    await Promise.all([
      this.trainerModel
        .updateMany({ photoUrl: url }, { $unset: { photoUrl: 1 } })
        .exec(),
      this.testimonialModel
        .updateMany({ photoUrl: url }, { $unset: { photoUrl: 1 } })
        .exec(),
      this.partnerModel
        .updateMany({ logoUrl: url }, { $unset: { logoUrl: 1 } })
        .exec(),
    ]);
  }
}
