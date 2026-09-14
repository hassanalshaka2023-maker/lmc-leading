import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Bilingual text `{ ar, en }`. Not `required` because Mongoose rejects empty
 * strings for required fields and content can be partially translated.
 */
@Schema({ _id: false })
export class LocalizedString {
  @Prop({ type: String, trim: true, default: '' })
  ar: string;

  @Prop({ type: String, trim: true, default: '' })
  en: string;
}

export const LocalizedStringSchema =
  SchemaFactory.createForClass(LocalizedString);

/** Convenience factory for `@Prop` defaults. */
export const emptyLocalizedString = (): LocalizedString => ({ ar: '', en: '' });
