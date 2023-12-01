import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @IsMongoId()
  _id!: string;
  @Prop()
  firstName!: string;
  @Prop()
  lastName!: string;
  @Prop({required: true, unique: true, index: true})
  email!: string;
  @Prop()
  telephone!: string;
  @Prop()
  birthDate!: Date;
  @Prop()
  password!: string;
  @Prop()
  rating?: number;
  @Prop()
  playsCompetition?: boolean;
  @Prop()
  NTTBnumber?: number;
  @Prop()
  loan?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
