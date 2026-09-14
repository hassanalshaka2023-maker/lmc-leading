import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MediaAssetDocument = HydratedDocument<MediaAsset>;

/**
 * Central registry of uploaded files. In dev, files live on local disk and are
 * served from `/uploads`. `storageKey` is the driver-agnostic identifier so the
 * same records work after switching the StorageService to S3.
 */
@Schema({ collection: 'mediaAssets', timestamps: true })
export class MediaAsset {
  /** publicly reachable URL (local static path now, CDN URL later) */
  @Prop({ type: String, required: true })
  url: string;

  /** storage-driver key, e.g. "uploads/2026/08/uuid.webp" — unique */
  @Prop({ type: String, required: true, unique: true })
  storageKey: string;

  @Prop({ type: String, required: true, trim: true })
  originalName: string;

  @Prop({ type: String, required: true })
  mimeType: string;

  @Prop({ type: Number, required: true, min: 0 })
  sizeBytes: number;

  @Prop({ type: Number, min: 0 })
  width?: number;

  @Prop({ type: Number, min: 0 })
  height?: number;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  uploadedBy?: Types.ObjectId;
}

export const MediaAssetSchema = SchemaFactory.createForClass(MediaAsset);

MediaAssetSchema.index({ createdAt: -1 });
