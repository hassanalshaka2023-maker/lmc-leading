import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Partner, PartnerSchema } from '../partners/schemas/partner.schema';
import {
  Testimonial,
  TestimonialSchema,
} from '../testimonials/schemas/testimonial.schema';
import { Trainer, TrainerSchema } from '../trainers/schemas/trainer.schema';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaAsset, MediaAssetSchema } from './schemas/media-asset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MediaAsset.name, schema: MediaAssetSchema },
      // Read-only here — used to clear dangling photo/logo URLs when an asset
      // is deleted so the public site never renders a broken image.
      { name: Trainer.name, schema: TrainerSchema },
      { name: Testimonial.name, schema: TestimonialSchema },
      { name: Partner.name, schema: PartnerSchema },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
