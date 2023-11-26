import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller'; 
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from './exercise.schema';
import { ExerciseService } from './exercise.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema}])],
    controllers: [ExerciseController],
    providers: [ExerciseService],
    exports: [ExerciseService],
})
export class BackendFeaturesExerciseModule {}