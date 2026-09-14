import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import {
  CorporateProgram,
  CorporateProgramDocument,
} from './schemas/corporate-program.schema';

@Injectable()
export class CorporateProgramsService extends BaseCrudService<CorporateProgramDocument> {
  constructor(
    @InjectModel(CorporateProgram.name)
    model: Model<CorporateProgramDocument>,
  ) {
    super(model);
  }
}
