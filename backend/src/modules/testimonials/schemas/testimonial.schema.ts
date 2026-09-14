import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type TestimonialDocument = HydratedDocument<Testimonial>;

@Schema({ collection: 'testimonials', timestamps: true })
export class Testimonial {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /** public URL of the photo — set by the dashboard after upload to /admin/media */
  @Prop({ type: String, trim: true })
  photoUrl?: string;

  /** role / category of the person, e.g. "University student" */
  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  role: LocalizedString;

  @Prop({ type: LocalizedStringSchema, required: true })
  text: LocalizedString;

  @Prop({ type: Number, default: 0, index: true })
  order: number;

  @Prop({ type: Boolean, default: true, index: true })
  isPublished: boolean;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
