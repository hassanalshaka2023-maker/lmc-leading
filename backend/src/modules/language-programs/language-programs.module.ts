import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminLanguageProgramsController,
  LanguageProgramsController,
} from './language-programs.controller';
import { LanguageProgramsService } from './language-programs.service';
import {
  LanguageProgram,
  LanguageProgramSchema,
} from './schemas/language-program.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LanguageProgram.name, schema: LanguageProgramSchema },
    ]),
  ],
  controllers: [LanguageProgramsController, AdminLanguageProgramsController],
  providers: [LanguageProgramsService],
})
export class LanguageProgramsModule {}
