import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PartnerDocument = HydratedDocument<Partner>;

@Schema({ collection: 'partners', timestamps: true })
export class Partner {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /** public URL of the logo — set by the dashboard after upload to /admin/media */
  @Prop({ type: String, trim: true })
  logoUrl?: string;

  @Prop({ type: String, trim: true })
  websiteUrl?: string;

  @Prop({ type: Number, default: 0, index: true })
  order: number;

  @Prop({ type: Boolean, default: true, index: true })
  isPublished: boolean;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
