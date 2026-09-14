import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type PageDocument = HydratedDocument<Page>;

@Schema({ _id: false })
export class PageSection {
  /** stable slug for the section, unique within a page (e.g. "hero", "why-lmc") */
  @Prop({ type: String, required: true, trim: true })
  key: string;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  heading: LocalizedString;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  body: LocalizedString;

  @Prop({ type: Number, default: 0 })
  order: number;
}
export const PageSectionSchema = SchemaFactory.createForClass(PageSection);

@Schema({ _id: false })
export class PageSeo {
  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  title: LocalizedString;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  description: LocalizedString;
}
export const PageSeoSchema = SchemaFactory.createForClass(PageSeo);

@Schema({ collection: 'pages', timestamps: true })
export class Page {
  /** e.g. "home" | "about" | "membership" | "contact" — unique */
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  key: string;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  title: LocalizedString;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  eyebrow: LocalizedString;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  subtitle: LocalizedString;

  @Prop({ type: [PageSectionSchema], default: [] })
  sections: PageSection[];

  @Prop({ type: PageSeoSchema, default: () => ({}) })
  seo: PageSeo;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  updatedBy?: Types.ObjectId;
}

export const PageSchema = SchemaFactory.createForClass(Page);
