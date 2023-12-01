import { Difficulty, IExercise, IRoom, IUser } from '@avans-nx-workshop/shared/api';
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Training>;

@Schema()
export class Training {
  @IsMongoId()
  id!: string;
  @Prop({required: true, unique: true, index: true})
  name!: string;
  @Prop()
  description!: string;
  @Prop()
  dateTime!: Date;
  @Prop()
  minPlayers!: number;
  @Prop({ type: String, enum: Difficulty})
  difficulty!: Difficulty;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Room'
  })
  room!: IRoom;
  
  @Prop({
      default: [],
      type: [MongooseSchema.Types.ObjectId],
      ref: 'User'
  })
  trainers: IUser[] = [];

  @Prop({
      default: [],
      type: [MongooseSchema.Types.ObjectId],
      ref: 'Exercise'
  })
  exercises: IExercise[] = [];
}

export const TrainingSchema = SchemaFactory.createForClass(Training);
