import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingSchema } from './training/training.schema';
import { TrainingService } from './training/training.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Training', schema: TrainingSchema }]),
  ],
  controllers: [],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
