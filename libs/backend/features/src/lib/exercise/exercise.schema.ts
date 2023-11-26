import { Difficulty } from '@avans-nx-workshop/shared/api';
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class Exercise {
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
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
