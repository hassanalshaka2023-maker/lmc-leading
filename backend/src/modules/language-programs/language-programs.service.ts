import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import type { ProgramCategory } from '../../common/constants/enums';
import {
  LanguageProgram,
  LanguageProgramDocument,
} from './schemas/language-program.schema';

@Injectable()
export class LanguageProgramsService extends BaseCrudService<LanguageProgramDocument> {
  constructor(
    @InjectModel(LanguageProgram.name)
    model: Model<LanguageProgramDocument>,
  ) {
    super(model);
  }

  listPublic(category?: ProgramCategory) {
    return this.findAllPublic(category ? { category } : {});
  }

  listAdmin(category?: ProgramCategory) {
    return this.findAllAdmin(category ? { category } : {});
  }
}
