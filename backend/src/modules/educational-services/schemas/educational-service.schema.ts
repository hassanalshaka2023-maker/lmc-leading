import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type EducationalServiceDocument = HydratedDocument<EducationalService>;

@Schema({ collection: 'educationalServices', timestamps: true })
export class EducationalService {
  @Prop({ type: LocalizedStringSchema, required: true })
  title: LocalizedString;

  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  slug: string;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  description: LocalizedString;

  /** name of an icon in the frontend icon set (not a file upload) */
  @Prop({ type: String, trim: true })
  icon?: string;

  @Prop({ type: Number, default: 0, index: true })
  order: number;

  @Prop({ type: Boolean, default: true, index: true })
  isPublished: boolean;
}

export const EducationalServiceSchema =
  SchemaFactory.createForClass(EducationalService);
