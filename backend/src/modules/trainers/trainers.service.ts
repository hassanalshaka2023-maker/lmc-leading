import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCrudService } from '../../common/crud/base-crud.service';
import { Trainer, TrainerDocument } from './schemas/trainer.schema';

@Injectable()
export class TrainersService extends BaseCrudService<TrainerDocument> {
  constructor(@InjectModel(Trainer.name) model: Model<TrainerDocument>) {
    super(model);
  }
}
