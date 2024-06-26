import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller'; 
import { MongooseModule } from '@nestjs/mongoose';
import { Exercise, ExerciseSchema } from './exercise.schema';
import { ExerciseService } from './exercise.service';
import { UserModule } from '../user.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema}]), UserModule],
    controllers: [ExerciseController],
    providers: [ExerciseService],
    exports: [ExerciseService],
})
export class BackendFeaturesExerciseModule {}