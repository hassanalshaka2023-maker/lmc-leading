import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trainer, TrainerSchema } from './schemas/trainer.schema';
import {
  AdminTrainersController,
  TrainersController,
} from './trainers.controller';
import { TrainersService } from './trainers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trainer.name, schema: TrainerSchema }]),
  ],
  controllers: [TrainersController, AdminTrainersController],
  providers: [TrainersService],
})
export class TrainersModule {}
