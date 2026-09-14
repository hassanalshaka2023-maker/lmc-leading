import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  LocalizedString,
  LocalizedStringSchema,
} from '../../../common/schemas/localized-string.schema';

export type MembershipContentDocument = HydratedDocument<MembershipContent>;

@Schema({ _id: false })
export class MembershipBenefit {
  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  title: LocalizedString;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  body: LocalizedString;

  @Prop({ type: Number, default: 0 })
  order: number;
}
export const MembershipBenefitSchema =
  SchemaFactory.createForClass(MembershipBenefit);

/**
 * Singleton — static, admin-editable copy for the Membership page.
 * No points engine: `pointsExplanation` is descriptive text only.
 */
@Schema({ collection: 'membershipContent', timestamps: true })
export class MembershipContent {
  @Prop({ type: String, required: true, unique: true, default: 'default' })
  key: string;

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  intro: LocalizedString;

  @Prop({ type: [MembershipBenefitSchema], default: [] })
  benefits: MembershipBenefit[];

  @Prop({ type: LocalizedStringSchema, default: () => ({ ar: '', en: '' }) })
  pointsExplanation: LocalizedString;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  updatedBy?: Types.ObjectId;
}

export const MembershipContentSchema =
  SchemaFactory.createForClass(MembershipContent);
