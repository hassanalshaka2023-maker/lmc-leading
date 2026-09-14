import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type SiteStatsDocument = HydratedDocument<SiteStats>;

@Schema({ _id: false })
export class SiteStatsLabels {
  @Prop({
    type: LocalizedStringSchema,
    default: () => ({ ar: 'طالب', en: 'Students' }),
  })
  students: LocalizedString;

  @Prop({
    type: LocalizedStringSchema,
    default: () => ({ ar: 'لغات', en: 'Languages' }),
  })
  languages: LocalizedString;

  @Prop({
    type: LocalizedStringSchema,
    default: () => ({ ar: 'ساعة تدريب', en: 'Training hours' }),
  })
  trainingHours: LocalizedString;

  @Prop({
    type: LocalizedStringSchema,
    default: () => ({ ar: 'برنامج', en: 'Programs' }),
  })
  programsCount: LocalizedString;
}
export const SiteStatsLabelsSchema =
  SchemaFactory.createForClass(SiteStatsLabels);

/**
 * Singleton collection — exactly one document, pinned by `key: "default"`.
 * The single source of truth for every stat shown across the site.
 */
@Schema({ collection: 'siteStats', timestamps: true })
export class SiteStats {
  @Prop({ type: String, required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  students: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  languages: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  trainingHours: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  programsCount: number;

  /** when true the frontend renders "1500+" style suffix */
  @Prop({ type: Boolean, default: true })
  showPlusSuffix: boolean;

  @Prop({ type: SiteStatsLabelsSchema, default: () => ({}) })
  labels: SiteStatsLabels;
}

export const SiteStatsSchema = SchemaFactory.createForClass(SiteStats);
