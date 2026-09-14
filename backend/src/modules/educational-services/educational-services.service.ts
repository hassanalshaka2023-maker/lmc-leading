import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import {
  EducationalService,
  EducationalServiceDocument,
} from './schemas/educational-service.schema';

@Injectable()
export class EducationalServicesService extends BaseCrudService<EducationalServiceDocument> {
  constructor(
    @InjectModel(EducationalService.name)
    model: Model<EducationalServiceDocument>,
  ) {
    super(model);
  }
}
