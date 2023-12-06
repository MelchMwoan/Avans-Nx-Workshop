import { IPlayer, ITraining } from '@avans-nx-workshop/shared/api';
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Enrollment>;

@Schema()
export class Enrollment {
  @IsMongoId()
  _id!: string;
  @Prop()
  enrollDateTime!: Date;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User'
  })
  player!: IPlayer;
  
  @Prop({
      type: MongooseSchema.Types.ObjectId,
      ref: 'Training'
  })
  training!: ITraining;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
