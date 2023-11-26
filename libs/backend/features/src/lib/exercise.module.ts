import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExerciseSchema } from './exercise/exercise.schema';
import { ExerciseService } from './exercise/exercise.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Exercise', schema: ExerciseSchema }]),
  ],
  controllers: [],
  providers: [ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}
