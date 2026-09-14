import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminCorporateProgramsController,
  CorporateProgramsController,
} from './corporate-programs.controller';
import { CorporateProgramsService } from './corporate-programs.service';
import {
  CorporateProgram,
  CorporateProgramSchema,
} from './schemas/corporate-program.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CorporateProgram.name, schema: CorporateProgramSchema },
    ]),
  ],
  controllers: [CorporateProgramsController, AdminCorporateProgramsController],
  providers: [CorporateProgramsService],
})
export class CorporateProgramsModule {}
