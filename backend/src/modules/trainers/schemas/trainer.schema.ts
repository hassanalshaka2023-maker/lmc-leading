import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type TrainerDocument = HydratedDocument<Trainer>;

@Schema({ collection: 'trainers', timestamps: true })
export class Trainer {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /** public URL of the photo — set by the dashboard after upload to /admin/media */
  @Prop({ type: String, trim: true })
  photoUrl?: string;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  specialty: LocalizedString;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  qualifications: LocalizedString;

  @Prop({ type: Number, min: 0, default: 0 })
  experienceYears: number;

  @Prop({ type: Number, default: 0, index: true })
  order: number;

  @Prop({ type: Boolean, default: true, index: true })
  isPublished: boolean;
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);
