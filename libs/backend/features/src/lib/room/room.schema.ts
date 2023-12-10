import { ITrainer, IUser } from '@avans-nx-workshop/shared/api';
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @IsMongoId()
  _id!: string;
  @Prop({required: true, unique: true, index: true})
  name!: string;
  @Prop()
  maxAmountOfTables!: number;
  @Prop()
  isInMaintenance?: boolean = false;
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User'
  })
  owner!: IUser;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
