import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminSubmissionsController,
  SubmissionsController,
} from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { Submission, SubmissionSchema } from './schemas/submission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
  ],
  controllers: [SubmissionsController, AdminSubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
