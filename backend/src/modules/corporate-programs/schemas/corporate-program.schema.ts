import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type CorporateProgramDocument = HydratedDocument<CorporateProgram>;

@Schema({ collection: 'corporatePrograms', timestamps: true })
export class CorporateProgram {
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

  /** bullet list of learning outcomes, each bilingual */
  @Prop({ type: [LocalizedStringSchema], default: [] })
  outcomes: LocalizedString[];

  @Prop({ type: Number, default: 0, index: true })
  order: number;

  @Prop({ type: Boolean, default: true, index: true })
  isPublished: boolean;
}

export const CorporateProgramSchema =
  SchemaFactory.createForClass(CorporateProgram);
