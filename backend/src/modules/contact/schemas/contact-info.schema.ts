import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type ContactInfoDocument = HydratedDocument<ContactInfo>;

@Schema({ _id: false })
export class SocialLink {
  /** e.g. "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok" | "x" */
  @Prop({ type: String, required: true, trim: true, maxlength: 40 })
  platform: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 300 })
  url: string;

  @Prop({ type: Number, default: 0 })
  order: number;
}
export const SocialLinkSchema = SchemaFactory.createForClass(SocialLink);

/**
 * Singleton — structured, admin-editable contact details for the Contact page
 * and the footer (phone, WhatsApp, email, address, map, social links).
 * Pinned by `key: "default"`. All fields are placeholders until the client
 * supplies real values.
 */
@Schema({ collection: 'contactInfo', timestamps: true })
export class ContactInfo {
  @Prop({ type: String, required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: String, trim: true, maxlength: 40, default: '' })
  phone: string;

  /** digits only (no +, spaces or dashes) — used to build a wa.me link */
  @Prop({ type: String, trim: true, maxlength: 40, default: '' })
  whatsapp: string;

  @Prop({
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 160,
    default: '',
  })
  email: string;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  address: LocalizedString;

  /** Google Maps embed URL (the `src` of the <iframe> on the Contact page) */
  @Prop({ type: String, trim: true, maxlength: 600, default: '' })
  mapEmbedUrl: string;

  @Prop({ type: [SocialLinkSchema], default: [] })
  socialLinks: SocialLink[];

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  updatedBy?: Types.ObjectId;
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);
