import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  SUBMISSION_STATUS,
  SUBMISSION_TYPE,
} from '../../../common/constants/enums';
import type {
  SubmissionStatus,
  SubmissionType,
} from '../../../common/constants/enums';

export type SubmissionDocument = HydratedDocument<Submission>;

/**
 * Both the Contact form and the "Register Now" enrolment request land here,
 * separated by `type`. No student accounts are created.
 */
@Schema({ collection: 'submissions', timestamps: true })
export class Submission {
  @Prop({ type: String, enum: SUBMISSION_TYPE, required: true, index: true })
  type: SubmissionType;

  @Prop({ type: String, required: true, trim: true, maxlength: 120 })
  name: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 40 })
  phone: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 160,
  })
  email: string;

  /** free text: the program / course / service the person is interested in */
  @Prop({ type: String, trim: true, maxlength: 200 })
  serviceOfInterest?: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 4000 })
  message: string;

  @Prop({
    type: String,
    enum: SUBMISSION_STATUS,
    default: 'new',
    index: true,
  })
  status: SubmissionStatus;

  @Prop({ type: String, trim: true, maxlength: 4000 })
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  handledBy?: Types.ObjectId;

  /** captured for basic anti-abuse / audit; never shown publicly */
  @Prop({ type: String, trim: true })
  sourceIp?: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);

SubmissionSchema.index({ createdAt: -1 });
SubmissionSchema.index({ status: 1, type: 1, createdAt: -1 });
