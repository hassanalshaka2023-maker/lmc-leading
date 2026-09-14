import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PROGRAM_CATEGORY } from '../../../common/constants/enums';
import type { ProgramCategory } from '../../../common/constants/enums';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type LanguageProgramDocument = HydratedDocument<LanguageProgram>;

@Schema({ collection: 'languagePrograms', timestamps: true })
export class LanguageProgram {
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

  @Prop({ type: String, enum: PROGRAM_CATEGORY, required: true, index: true })
  category: ProgramCategory;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  level: LocalizedString;

  /** Price is stored for a future paid-enrolment phase; hidden in MVP UI. */
  @Prop({ type: Number, min: 0 })
  priceAmount?: number;

  @Prop({ type: String, trim: true, uppercase: true, maxlength: 3 })
  priceCurrency?: string;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Number, default: 0, index: true })
  order: number;

  @Prop({ type: Boolean, default: true, index: true })
  isPublished: boolean;
}

export const LanguageProgramSchema =
  SchemaFactory.createForClass(LanguageProgram);

LanguageProgramSchema.index({ category: 1, order: 1 });
