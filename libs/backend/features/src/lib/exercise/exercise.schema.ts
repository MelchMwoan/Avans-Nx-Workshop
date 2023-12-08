import { Difficulty, IUser } from '@avans-nx-workshop/shared/api';
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class Exercise {
  @IsMongoId()
  _id!: string;
  @Prop({required: true, unique: true, index: true})
  name!: string;
  @Prop()
  description!: string;
  @Prop({ type: String, enum: Difficulty})
  difficulty!: Difficulty;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User'
  })
  owner!: IUser;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
