import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminEducationalServicesController,
  EducationalServicesController,
} from './educational-services.controller';
import { EducationalServicesService } from './educational-services.service';
import {
  EducationalService,
  EducationalServiceSchema,
} from './schemas/educational-service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EducationalService.name, schema: EducationalServiceSchema },
    ]),
  ],
  controllers: [
    EducationalServicesController,
    AdminEducationalServicesController,
  ],
  providers: [EducationalServicesService],
})
export class EducationalServicesModule {}
