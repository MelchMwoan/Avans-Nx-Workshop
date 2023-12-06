import { Module } from '@nestjs/common';
import { TrainingController } from './training.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingService } from './training.service';
import { Training, TrainingSchema } from './training.schema';
import { User, UserSchema } from '../user/user.schema';
import { Exercise, ExerciseSchema } from '../exercise/exercise.schema';
import { Room, RoomSchema } from '../room/room.schema';
import { UserModule } from '../user.module';
import { Enrollment, EnrollmentSchema } from './enrollment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Training.name, schema: TrainingSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    UserModule
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class BackendFeaturesTrainingModule {}
