import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import { HydratedDocument } from 'mongoose';

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
}

export const RoomSchema = SchemaFactory.createForClass(Room);
