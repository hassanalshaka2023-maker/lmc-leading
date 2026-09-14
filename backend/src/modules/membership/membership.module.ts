import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
import {
  MembershipContent,
  MembershipContentSchema,
} from './schemas/membership-content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MembershipContent.name, schema: MembershipContentSchema },
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
